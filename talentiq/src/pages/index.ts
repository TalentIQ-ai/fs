import { lazy } from "react";

const Home = lazy(() => import("@/pages/home"));

const Dashboard = lazy(() => import("@/pages/dashboard"));

const JalurKarir = lazy(() => import("@/pages/auth/roadmap-karir"));

const AnalisisSkill = lazy(() => import("@/pages/auth/user-analisis-skill"));

const ProfilKursus = lazy(() => import("@/pages/auth/profil"));

const LowonganKerja = lazy(() => import("@/pages/lowongan_kerja"));

const Login = lazy(() => import("@/pages/auth/login"));

const Register = lazy(() => import("@/pages/auth/register"));

const ForgotPassword = lazy(
  () => import("@/pages/auth/forgot_password")
);

export {
  Home,
  Dashboard,
  JalurKarir,
  AnalisisSkill,
  ProfilKursus,
  LowonganKerja,
  Login,
  Register,
  ForgotPassword,
};