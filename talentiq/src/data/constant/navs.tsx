import { cloneDeep } from "lodash";
import { Link } from "react-router-dom";

import {
  HOME_PATH,
  USER_PATH,
  TODO_PATH,
  LOWONGAN_KERJA_PATH,
  LOGIN_PATH,
  REGISTER_PATH,
  FORGOT_PASSWORD_PATH,
} from "./path";

import { TypeNavs, TypeRoutes } from "./type-navs";

import {
  Home,
  JalurKarir,
  AnalisisSkill,
  LowonganKerja,
  Login,
  Register,
  ForgotPassword,
} from "@/pages";

import { capitalizeFirstLetter } from "@/utils";

const navs: TypeNavs[] = [
  {
    key: HOME_PATH,
    label: "home",
    element: <Home />,
  },
  {
    key: USER_PATH,
    label: "jalur karir",
    element: <JalurKarir />,
  },
  {
    key: TODO_PATH,
    label: "analisis skill",
    element: <AnalisisSkill />,
  },
  {
    key: LOWONGAN_KERJA_PATH,
    label: "lowongan kerja",
    element: <LowonganKerja />,
  },

  {
    key: LOGIN_PATH,
    label: "login",
    element: <Login />,
  },

  {
    key: REGISTER_PATH,
    label: "register",
    element: <Register />,
  },

  {
    key: FORGOT_PASSWORD_PATH,
    label: "forgot password",
    element: <ForgotPassword />,
  },
];

const getRoutes = (
  arr: TypeRoutes[],
  nav: TypeNavs,
  basePath = ""
) => {
  if (nav.children) {
    for (const n of nav.children) {
      getRoutes(arr, n, basePath + nav.key);
    }
  }

  if (!nav.element) return;

  arr.push({
    path: basePath + nav.key,
    element: nav.element,
  });

  return arr;
};

const addLink = (nav: TypeNavs, path: string) => {
  return nav.children ? (
    capitalizeFirstLetter(nav.label as string)
  ) : (
    <Link to={path}>
      {capitalizeFirstLetter(nav.label as string)}
    </Link>
  );
};

const getShowNavigation = (
  nav: TypeNavs,
  basePath = ""
): TypeNavs | undefined => {
  if (!nav.label) return;

  if (nav.children) {
    const arr: TypeNavs[] = [];

    for (const n of nav.children) {
      const formatN = getShowNavigation(
        n,
        basePath + nav.key
      );

      if (formatN) arr.push(formatN);
    }

    nav.children = arr.length > 0 ? arr : undefined;
  }

  return {
    key: basePath + nav.key,
    label: addLink(nav, basePath + nav.key),
    children: nav.children,
    element: nav.element,
  };
};

const menuList: TypeNavs[] = [];

const routeList: TypeRoutes[] = [];

const navList: TypeNavs[] = navs.map((nav) => ({
  key: nav.key,
  label: nav.label,
}));

for (const nav of navs) {
  const nav1 = cloneDeep(nav);

  const n = getShowNavigation(nav1);

  if (n) menuList.push(n);

  const nav2 = cloneDeep(nav);

  getRoutes(routeList, nav2);
}

export { routeList, menuList, navList };