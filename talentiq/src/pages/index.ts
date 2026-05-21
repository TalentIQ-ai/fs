import { lazy } from "react";

const Home = lazy(() => import("@/pages/home"));

const JalurKarir = lazy(() => import("@/pages/jalur_karir"));

const AnalisisSkill = lazy(() => import("@/pages/analisis_skill"));

const LowonganKerja = lazy(() => import("@/pages/lowongan_kerja"));

const Login = lazy(() => import("@/pages/auth/login"));

const Register = lazy(() => import("@/pages/auth/register"));

const ForgotPassword = lazy(
  () => import("@/pages/auth/forgot_password")
);

export {
  Home,
  JalurKarir,
  AnalisisSkill,
  LowonganKerja,
  Login,
  Register,
  ForgotPassword,
};