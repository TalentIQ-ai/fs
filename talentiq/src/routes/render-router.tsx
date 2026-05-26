// talentiq/src/routes/render-router.tsx
import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LayoutComponent from "@/layout";

// ── Helper: cek apakah sudah login ────────────────────────────────────────────
const isAuthenticated = () => !!localStorage.getItem("token");

// ── Protected Route ───────────────────────────────────────────────────────────
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />;
};

// ── Guest Route (redirect ke dashboard jika sudah login) ──────────────────────
const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  return !isAuthenticated() ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

// ── Public Pages ──────────────────────────────────────────────────────────────
const Home = lazy(() => import("@/pages/home"));
const NotFound = lazy(() => import("@/pages/not-found"));
const AnalisisSkill = lazy(() => import("@/pages/analisis_skill"));
const JalurKarir = lazy(() => import("@/pages/jalur_karir"));
const LowonganKerja = lazy(() => import("@/pages/lowongan_kerja"));

// ── Auth Pages ────────────────────────────────────────────────────────────────
const Login = lazy(() => import("@/pages/auth/login"));
const Register = lazy(() => import("@/pages/auth/register"));
const ForgotPassword = lazy(() => import("@/pages/auth/forgot_password"));

// ── User (Authenticated) Pages ────────────────────────────────────────────────
const Dashboard = lazy(() => import("@/pages/dashboard"));
const UserAnalisisSkill = lazy(() => import("@/pages/auth/user-analisis-skill"));
const RoadmapKarir = lazy(() => import("@/pages/auth/roadmap-karir"));
const ProfilKursus = lazy(() => import("@/pages/auth/profil"));
const UserLowonganKerja = lazy(() => import("@/pages/auth/lowongan_kerja"));

const RenderRouter = () => {
  return (
    <Routes>

      {/* ── Auth (hanya untuk yang belum login) ── */}
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
      <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />

      {/* ── Public dengan Layout Header+Footer ── */}
      <Route element={<LayoutComponent />}>
        <Route path="/" element={<Home />} />
        <Route path="/lowongan-kerja" element={<LowonganKerja />} />
      </Route>

      {/* ── Public tanpa Layout ── */}
      <Route path="/analisis-skill" element={<AnalisisSkill />} />
      <Route path="/jalur-karir" element={<JalurKarir />} />

      {/* ── Protected (harus login) ── */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/auth/user-analisis-skill" element={<ProtectedRoute><UserAnalisisSkill /></ProtectedRoute>} />
      <Route path="/auth/roadmap-karir" element={<ProtectedRoute><RoadmapKarir /></ProtectedRoute>} />
      <Route path="/profil" element={<ProtectedRoute><ProfilKursus /></ProtectedRoute>} />
      <Route path="/auth/lowongan_kerja" element={<ProtectedRoute><UserLowonganKerja /></ProtectedRoute>} />

      {/* ── 404 ── */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
};

export default RenderRouter;