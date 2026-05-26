// talentiq/src/pages/auth/register/index.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GridScan } from "@/components/GridScan";
import StarBorder from "@/components/StarBorder";
import { registerUser, saveToken } from "@/services/auth.service";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  } as { name: string; email: string; password: string; confirmPassword: string });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agree, setAgree] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validasi frontend
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("Semua field wajib diisi");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok");
      return;
    }
    if (form.password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }
    if (!agree) {
      setError("Kamu harus menyetujui ketentuan layanan");
      return;
    }

    setLoading(true);
    try {
      const res = await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      // Simpan token & auto login
      saveToken(res.token, res.user);

      // Redirect ke dashboard
      navigate("/dashboard");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Registrasi gagal. Silakan coba lagi.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-5 relative overflow-hidden bg-[#020617]">
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#000814]/80 z-0" />

      {/* GridScan */}
      <div className="absolute inset-0 z-[1] opacity-90">
        <GridScan
          gridScale={0.08}
          lineThickness={1}
          scanColor="#025cb8"
          linesColor="#025cb8"
          scanOpacity={0.5}
          scanDuration={3}
          scanDelay={1}
          bloomIntensity={0.5}
        />
      </div>

      {/* Back Button */}
      <Link
        to="/"
        className="absolute top-5 left-5 z-30 bg-white/10 backdrop-blur-md text-white px-5 py-2 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
      >
        ← Kembali
      </Link>

      {/* Card */}
      <div className="relative z-20 w-full max-w-md my-8">
        <StarBorder
          as="div"
          color="#025cb8"
          speed="3s"
          thickness={1}
          className="w-full rounded-[28px] shadow-[0_0_25px_rgba(2,92,184,0.35)] bg-gradient-to-br from-[#025cb8]/20 via-black to-[#025cb8]/10"
        >
          <div className="bg-black/85 backdrop-blur-2xl rounded-[26px] p-8 border border-[#025cb8]/20 shadow-[0_0_50px_rgba(2,92,184,0.25)]">

            <h1 className="text-3xl font-bold text-center text-white mb-2">
              Buat Akun
            </h1>
            <p className="text-center text-gray-300 mb-8">
              Mulai perjalanan karir berbasis AI Anda
            </p>

            {/* Error Alert */}
            {error && (
              <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nama */}
              <div>
                <label className="text-blue-400 block mb-1.5 font-medium text-sm">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Nama Lengkap Anda"
                  required
                  className="w-full bg-white/5 border border-blue-500/30 rounded-xl px-4 py-3 outline-none text-white placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-blue-400 block mb-1.5 font-medium text-sm">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="nama@gmail.com"
                  required
                  className="w-full bg-white/5 border border-blue-500/30 rounded-xl px-4 py-3 outline-none text-white placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-blue-400 block mb-1.5 font-medium text-sm">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 karakter"
                  required
                  className="w-full bg-white/5 border border-blue-500/30 rounded-xl px-4 py-3 outline-none text-white placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              {/* Konfirmasi Password */}
              <div>
                <label className="text-blue-400 block mb-1.5 font-medium text-sm">
                  Konfirmasi Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Ulangi password"
                  required
                  className={`w-full bg-white/5 border rounded-xl px-4 py-3 outline-none text-white placeholder:text-gray-500 focus:ring-2 transition-all ${form.confirmPassword && form.password !== form.confirmPassword
                    ? "border-red-500/50 focus:ring-red-500"
                    : "border-blue-500/30 focus:ring-blue-500"
                    }`}
                />
                {form.confirmPassword && form.password !== form.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1">Password tidak cocok</p>
                )}
              </div>

              {/* Setuju T&C */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-0.5 accent-blue-500"
                />
                <span className="text-gray-400 text-xs leading-relaxed">
                  Saya setuju dengan{" "}
                  <span className="text-blue-400 hover:underline cursor-pointer">
                    Ketentuan Layanan
                  </span>{" "}
                  dan{" "}
                  <span className="text-blue-400 hover:underline cursor-pointer">
                    Kebijakan Privasi
                  </span>{" "}
                  TalentIQ AI.
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-white py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Mendaftarkan...
                  </>
                ) : "Daftar Sekarang"}
              </button>
            </form>

            <p className="text-center text-gray-300 mt-6 text-sm">
              Sudah punya akun?{" "}
              <Link to="/login" className="text-blue-400 font-bold hover:underline">
                Masuk
              </Link>
            </p>
          </div>
        </StarBorder>
      </div>
    </div>
  );
};

export default Register;