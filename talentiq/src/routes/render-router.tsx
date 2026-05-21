import { lazy } from "react";
import { Route, Routes } from "react-router-dom";

// Layout
import LayoutComponent from "@/layout";

// Main Pages
const Home = lazy(() => import("@/pages/home"));
const NotFound = lazy(() => import("@/pages/not-found"));
const AnalisisSkill = lazy(() => import("@/pages/analisis_skill"));
const JalurKarir = lazy(() => import("@/pages/jalur_karir"));
const LowonganKerja = lazy(() => import("@/pages/lowongan_kerja"));

// Auth Pages
const Login = lazy(() => import("@/pages/auth/login"));
const Register = lazy(() => import("@/pages/auth/register"));
const ForgotPassword = lazy(
  () => import("@/pages/auth/forgot_password")
);

const RenderRouter = () => {
  return (
    <Routes>
      {/* ================= AUTH PAGES ================= */}
      {/* TANPA HEADER & FOOTER */}
      <Route path="/login" element={<Login />} />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      {/* ================= MAIN LAYOUT ================= */}
      {/* DENGAN HEADER & FOOTER */}
      <Route path="/" element={<LayoutComponent />}>
        {/* Home */}
        <Route index element={<Home />} />

        {/* Features */}
        <Route
          path="analisis-skill"
          element={<AnalisisSkill />}
        />

        <Route
          path="jalur-karir"
          element={<JalurKarir />}
        />

        <Route
          path="lowongan-kerja"
          element={<LowonganKerja />}
        />
      </Route>

      {/* ================= 404 ================= */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default RenderRouter;