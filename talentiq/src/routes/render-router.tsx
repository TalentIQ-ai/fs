import { lazy } from "react";
import { Route, Routes } from "react-router-dom";

import LayoutComponent from "@/layout";

// Pages
const Home = lazy(() => import("@/pages/home"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const NotFound = lazy(() => import("@/pages/not-found"));
const AnalisisSkill = lazy(() => import("@/pages/analisis_skill"));
const JalurKarir = lazy(() => import("@/pages/jalur_karir"));
const LowonganKerja = lazy(() => import("@/pages/lowongan_kerja"));
const UserAnalisisSkill = lazy(() => import("@/pages/auth/user-analisis-skill"));
const RoadmapKarir = lazy(() => import("@/pages/auth/roadmap-karir"));
const ProfilKursus = lazy(() => import("@/pages/auth/profil"));
const UserLowonganKerja = lazy(() => import("@/pages/auth/lowongan_kerja"));

const Login = lazy(() => import("@/pages/auth/login"));
const Register = lazy(() => import("@/pages/auth/register"));
const ForgotPassword = lazy(() => import("@/pages/auth/forgot_password"));

const RenderRouter = () => {
  return (
    <Routes>
      {/* ================= PUBLIC AUTH ================= */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/user-analisis-skill" element={<UserAnalisisSkill />} />

      {/* ================= MAIN LAYOUT ================= */}
      <Route element={<LayoutComponent />}>
        <Route path="/" element={<Home />} />
        <Route path="/lowongan-kerja" element={<LowonganKerja />} />
      </Route>

      {/* ================= DASHBOARD (authenticated) ================= */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/analisis-skill" element={<AnalisisSkill />} />
      <Route path="/jalur-karir" element={<JalurKarir />} />
      <Route path="/profil" element={<ProfilKursus />} />
      <Route path="/auth/roadmap-karir" element={<RoadmapKarir />} />
      <Route path="/auth/lowongan_kerja" element={<UserLowonganKerja />} /> 

      {/* ================= 404 ================= */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default RenderRouter;
// src/routes/render-router.tsx