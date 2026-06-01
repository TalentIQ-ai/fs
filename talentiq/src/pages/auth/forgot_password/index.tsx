// talentiq/src/pages/auth/forgot_password/index.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import StarBorder from "@/components/StarBorder";
import { forgotPasswordService } from "@/services/auth.service";
import bg from "@/assets/bg.jpg";

type Step = "input" | "sent";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<Step>("input");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email wajib diisi");
      return;
    }

    setLoading(true);
    try {
      await forgotPasswordService(email);
      // Selalu tampilkan halaman sukses (backend tidak bocorkan info email ada/tidak)
      setStep("sent");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Terjadi kesalahan. Silakan coba lagi.";
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

            {step === "input" ? (
              /* ── STEP 1: Input Email ── */
              <>
                {/* Icon */}
                <div className="flex justify-center mb-5">
                  <div className="w-14 h-14 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 text-blue-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                </div>

                <h1 className="text-3xl font-bold text-center text-white mb-2">
                  Lupa Password
                </h1>
                <p className="text-center text-gray-400 mb-8 text-sm leading-relaxed">
                  Masukkan email yang terdaftar. Kami akan mengirimkan
                  link untuk reset password kamu.
                </p>

                {/* Error */}
                {error && (
                  <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="text-blue-400 block mb-2 font-medium text-sm">
                      Alamat Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                      placeholder="nama@email.com"
                      required
                      className="w-full bg-white/5 border border-blue-500/30 rounded-xl px-4 py-3 outline-none text-white placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>

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
                        Mengirim...
                      </>
                    ) : "Kirim Link Reset"}
                  </button>
                </form>

                <div className="text-center mt-6">
                  <Link to="/login" className="text-blue-400 font-bold hover:underline text-sm">
                    ← Kembali ke Login
                  </Link>
                </div>
              </>
            ) : (
              /* ── STEP 2: Email Terkirim ── */
              <>
                {/* Success Icon */}
                <div className="flex justify-center mb-5">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-green-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                </div>

                <h1 className="text-2xl font-bold text-center text-white mb-2">
                  Email Terkirim!
                </h1>
                <p className="text-center text-gray-400 mb-2 text-sm leading-relaxed">
                  Jika <span className="text-blue-400 font-medium">{email}</span> terdaftar,
                  kamu akan menerima email berisi link reset password.
                </p>
                <p className="text-center text-gray-500 text-xs mb-8">
                  Link berlaku selama <strong className="text-gray-400">1 jam</strong>. Periksa folder spam jika tidak ada di inbox.
                </p>

                {/* Info box */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3 mb-6">
                  <p className="text-blue-300 text-xs text-center leading-relaxed">
                    🔒 Keamanan akun Anda adalah prioritas kami. Kami menggunakan enkripsi standar industri.
                  </p>
                </div>

                <button
                  onClick={() => { setStep("input"); setEmail(""); }}
                  className="w-full bg-white/5 hover:bg-white/10 border border-blue-500/30 text-blue-400 py-3 rounded-xl font-semibold transition-all duration-300 mb-4"
                >
                  Kirim Ulang Email
                </button>

                <div className="text-center">
                  <Link to="/login" className="text-blue-400 font-bold hover:underline text-sm">
                    ← Kembali ke Login
                  </Link>
                </div>
              </>
            )}
          </div>
        </StarBorder>
      </div>
    </div>
  );
};

export default ForgotPassword;