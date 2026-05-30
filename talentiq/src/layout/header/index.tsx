import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import logoHeader from "@/assets/logoheader.png";
import StarBorder from "@/components/StarBorder";

const menuList = [
  { name: "Beranda", url: "/" },
  { name: "Analisis Skill", url: "/analisis-skill" },
  { name: "Jalur Karir", url: "/jalur-karir" },
  { name: "Lowongan Kerja", url: "/lowongan-kerja" },
];

const HeaderComponent = () => {
  const currentRoute = useLocation();
  const redirect = useNavigate();

  const [mobileMenuShown, setMobileMenuShown] = useState(false);
  const [headerCompact, setHeaderCompact] = useState(false);

  useEffect(() => {
    const syncHeaderState = () => {
      const isShrink = window.scrollY > 30;
      setHeaderCompact((prev) => (
        prev !== isShrink ? isShrink : prev
      ));
    };

    window.addEventListener("scroll", syncHeaderState);

    return () => {
      window.removeEventListener("scroll", syncHeaderState);
    };
  }, []);

  useEffect(() => {
    mobileMenuShown && setMobileMenuShown(false);
  }, [currentRoute.pathname]);

  const floatingMenuPosition = useMemo(
    () => (headerCompact ? "top-[78px]" : "top-[86px]"),
    [headerCompact]
  );

  const goToLogin = () => redirect("/login");

  return (
    <>
      {/* top nav */}
      <header className="fixed top-0 left-0 z-50 w-full flex justify-center px-4 sm:px-8 pt-4">

        <div className="relative w-full max-w-7xl">

          {/* glow dikit biar ga flat */}
          <div
            className="absolute inset-0 rounded-[28px] blur-2xl opacity-70 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg,#62AAEA,#025CB8,#62AAEA)",
            }}
          />

          <StarBorder
            as="div"
            color="#025cb8"
            speed="2s"
            thickness={2}
            className="w-full rounded-[30px]"
          >
            <div
              className={`
                flex items-center rounded-[26px]
                transition-all duration-300
                ${headerCompact
                  ? "bg-white/95 backdrop-blur-xl px-5 py-3"
                  : "bg-white/90 backdrop-blur-xl px-6 py-4"
                }
              `}
            >

              {/* logo */}
              <Link
                to="/"
                className="mr-6 lg:mr-14 shrink-0 flex items-center"
              >
                <img
                  src={logoHeader}
                  alt="TalentIQ AI"
                  className={`
                    object-contain transition-all duration-300
                    ${headerCompact ? "h-[22px]" : "h-[28px]"}
                  `}
                />
              </Link>

              {/* desktop nav */}
              <nav className="hidden md:flex items-center gap-2 lg:gap-3">
                {menuList.map((navLink) => {
                  const activePage =
                    currentRoute.pathname === navLink.url;

                  return (
                    <Link
                      key={navLink.url}
                      to={navLink.url}
                      className={`
                        relative rounded-xl px-4 py-2
                        font-semibold transition-all duration-300

                        ${activePage
                          ? "bg-gradient-to-r from-[#025CB8] to-[#62AAEA] text-white shadow-lg"
                          : "text-gray-600 hover:text-[#025CB8] hover:bg-[#025CB8]/5"
                        }

                        ${headerCompact ? "text-sm" : "text-[15px]"}
                      `}
                    >
                      {navLink.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="flex-1" />

              {/* kanan desktop */}
              <div className="hidden md:flex items-center gap-3">

                <button
                  onClick={goToLogin}
                  className="
                    rounded-xl
                    bg-gradient-to-r
                    from-[#025CB8]
                    to-[#62AAEA]
                    text-white
                    font-bold
                    shadow-lg
                    transition-all duration-300
                    hover:-translate-y-0.5
                    hover:shadow-2xl
                    hover:from-[#0147A0]
                    hover:to-[#025CB8]
                  "
                >
                  <span
                    className={`
                      block
                      ${headerCompact
                        ? "px-4 py-2 text-sm"
                        : "px-5 py-2.5 text-sm"
                      }
                    `}
                  >
                    Akun
                  </span>
                </button>
              </div>

              {/* trigger mobile */}
              <button
                aria-label="toggle navigation"
                onClick={() => setMobileMenuShown((prev) => !prev)}
                className="
                  md:hidden
                  w-11 h-11
                  rounded-xl
                  flex items-center justify-center
                  bg-[#025CB8]/10
                  text-[#025CB8]
                  transition-all duration-300
                  hover:bg-[#025CB8]/15
                "
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-5 h-5"
                >
                  {mobileMenuShown ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </StarBorder>
        </div>
      </header>

      {/* menu hp */}
      <div
        className={`
          fixed left-0 right-0 z-40 px-4 sm:px-8
          transition-all duration-300 ease-in-out
          ${floatingMenuPosition}

          ${mobileMenuShown
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-3 pointer-events-none"
          }
        `}
      >
        <div className="max-w-7xl mx-auto overflow-hidden rounded-2xl border border-gray-100 bg-white/95 backdrop-blur-xl shadow-2xl">

          <div className="flex flex-col gap-2 p-4">

            {menuList.map((navLink) => {
              const currentPage =
                currentRoute.pathname === navLink.url;

              return (
                <Link
                  key={navLink.url}
                  to={navLink.url}
                  className={`
                    flex items-center justify-between
                    rounded-xl px-4 py-3
                    font-semibold transition-all duration-300

                    ${currentPage
                      ? "bg-gradient-to-r from-[#025CB8] to-[#62AAEA] text-white"
                      : "text-gray-700 hover:bg-[#025CB8]/5 hover:text-[#025CB8]"
                    }
                  `}
                >
                  <span>{navLink.name}</span>

                  {currentPage
                    ? <div className="w-2 h-2 rounded-full bg-white" />
                    : null}
                </Link>
              );
            })}

            <div className="my-2 h-px bg-gray-100" />

            <button
              onClick={goToLogin}
              className="
                flex items-center justify-center
                rounded-xl py-3
                font-bold text-white
                bg-gradient-to-r
                from-[#025CB8]
                to-[#62AAEA]
                transition-all duration-300
                shadow-md
                hover:from-[#0147A0]
                hover:to-[#025CB8]
              "
            >
              Masuk ke Akun
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderComponent;