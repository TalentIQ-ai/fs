import { Link } from "react-router-dom";

import { GridScan } from "@/components/GridScan";
import StarBorder from "@/components/StarBorder";

const Login = () => {
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

      {/* Star Border Card */}
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
              Selamat Datang
            </h1>

            <p className="text-center text-gray-300 mb-8">
              Akses dashboard karir berbasis AI anda
            </p>

            <form className="space-y-5">
              <div>
                <label className="text-blue-400 block mb-2 font-medium">
                  Email
                </label>

                <input
                  type="email"
                  placeholder="nama@gmail.com"
                  className="w-full bg-white/5 border border-blue-500/30 rounded-xl px-4 py-3 outline-none text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-blue-400 block mb-2 font-medium">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="********"
                  className="w-full bg-white/5 border border-blue-500/30 rounded-xl px-4 py-3 outline-none text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="text-gray-300 flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  Ingat Saya
                </label>

                <Link
                  to="/forgot-password"
                  className="text-blue-400 font-medium hover:underline"
                >
                  Lupa Password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/30"
              >
                Masuk
              </button>
            </form>

            <p className="text-center text-gray-300 mt-6">
              Belum punya akun?
              <Link
                to="/register"
                className="text-blue-400 font-bold ml-2"
              >
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