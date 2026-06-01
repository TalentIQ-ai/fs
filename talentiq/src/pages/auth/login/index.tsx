// talentiq/src/pages/auth/login/index.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import StarBorder from "@/components/StarBorder";
import { loginUser, saveToken } from "@/services/auth.service";
import bg from "@/assets/bg.jpg";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // reset error saat user mengetik
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Email dan password wajib diisi");
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser({ email: form.email, password: form.password });

      // Simpan token & user ke localStorage
      saveToken(res.token, res.user);

      // Redirect ke dashboard
      navigate("/dashboard");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Login gagal. Periksa email dan password kamu.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center p-5 relative overflow-hidden"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#000814]/80 z-0" />

      {/* Back Button */}
      <Link
        to="/"
        className="absolute top-5 left-5 z-30 bg-white/10 backdrop-blur-md text-white px-5 py-2 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
      >
        ← Kembali
      </Link>

      {/* Card */}
      <div className="relative z-20 w-full max-w-md">
        <StarBorder
          as="div"
          color="#025cb8"
          speed="3s"
          thickness={1}
          className="w-full rounded-[28px] shadow-[0_0_25px_rgba(2,92,184,0.35)] bg-gradient-to-br from-[#025cb8]/20 via-black to-[#025cb8]/10"
        >
          <div className="bg-black/85 backdrop-blur-2xl rounded-[26px] p-8 border border-[#025cb8]/20 shadow-[0_0_50px_rgba(2,92,184,0.25)]">

            <h1 className="text-3xl font-bold text-center text-white mb-2">
              Selamat Datang
            </h1>
            <p className="text-center text-gray-300 mb-8">
              Akses dashboard karir berbasis AI anda
            </p>

            {/* Error Alert */}
            {error && (
              <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="text-blue-400 block mb-2 font-medium text-sm">
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
                <label className="text-blue-400 block mb-2 font-medium text-sm">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full bg-white/5 border border-blue-500/30 rounded-xl px-4 py-3 outline-none text-white placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              {/* Remember Me + Lupa Password */}
              <div className="flex items-center justify-between text-sm text-gray-300">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="accent-blue-500"
                  />
                  Ingat Saya
                </label>
                <Link
                  to="/forgot-password"
                  className="text-blue-400 font-medium hover:underline"
                >
                  Lupa Password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-white py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Memproses...
                  </>
                ) : "Masuk"}
              </button>
            </form>

            <p className="text-center text-gray-300 mt-6 text-sm">
              Belum punya akun?{" "}
              <Link to="/register" className="text-blue-400 font-bold hover:underline">
                Daftar
              </Link>
            </p>
          </div>
        </StarBorder>
      </div>
    </div>
  );
};

export default Login;