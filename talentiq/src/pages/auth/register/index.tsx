import { Link } from "react-router-dom";

import { GridScan } from "@/components/GridScan";
import StarBorder from "@/components/StarBorder";

const Register = () => {
  return (
    <div className="min-h-screen flex justify-center items-center p-5 relative overflow-hidden bg-[#020617]">
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#000814]/80 z-0"></div>

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
      <div className="relative z-20 w-full max-w-md">
        <StarBorder
          as="div"
          color="#025cb8"
          speed="3s"
          thickness={1}
          className="
    w-full 
    rounded-[28px]
    shadow-[0_0_25px_rgba(2,92,184,0.35)]
    bg-gradient-to-br
    from-[#025cb8]/20
    via-black
    to-[#025cb8]/10
  "
        >
          <div
            className="
    bg-black/85
    backdrop-blur-2xl
    rounded-[26px]
    p-8
    border
    border-[#025cb8]/20
    shadow-[0_0_50px_rgba(2,92,184,0.25)]
  "
          >
            <h1 className="text-3xl font-bold text-center text-white mb-2">
              Buat Akun
            </h1>

            <p className="text-center text-gray-300 mb-8">
              Mulai perjalanan karir berbasis AI Anda
            </p>

            <form className="space-y-5">
              <input
                type="text"
                placeholder="Nama Lengkap"
                className="w-full bg-white/5 border border-blue-500/30 rounded-xl px-4 py-3 outline-none text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="email"
                placeholder="Email"
                className="w-full bg-white/5 border border-blue-500/30 rounded-xl px-4 py-3 outline-none text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full bg-white/5 border border-blue-500/30 rounded-xl px-4 py-3 outline-none text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="password"
                placeholder="Konfirmasi Password"
                className="w-full bg-white/5 border border-blue-500/30 rounded-xl px-4 py-3 outline-none text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/30"
              >
                Daftar
              </button>
            </form>

            <p className="text-center text-gray-300 mt-6">
              Sudah punya akun?
              <Link
                to="/login"
                className="text-blue-400 font-bold ml-2"
              >
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