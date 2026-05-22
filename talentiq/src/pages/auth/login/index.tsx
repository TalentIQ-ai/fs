import { Link } from "react-router-dom";
import bgImage from "@/assets/bg.jpg";

const Login = () => {
  return (
    <div
      className="min-h-screen flex justify-center items-center p-5 bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Back Button */}
      <Link
        to="/"
        className="absolute top-5 left-5 z-20 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl border border-white/30 hover:bg-white/30 transition-all"
      >
        ← Kembali
      </Link>



      {/* Card */}
      <div className="relative bg-white w-full max-w-md rounded-2xl p-8 shadow-2xl z-10">
        <h1 className="text-3xl font-bold text-center text-[#025CB8] mb-2">
          Selamat Datang
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Akses dashboard karir berbasis AI anda
        </p>

        <form className="space-y-5">
          <div>
            <label className="text-[#025CB8] block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              placeholder="nama@gmail.com"
              className="w-full border border-[#025CB8] rounded-lg px-4 py-3 outline-none text-black placeholder:text-gray-400 focus:ring-2 focus:ring-[#025CB8]"
            />
          </div>

          <div>
            <label className="text-[#025CB8] block mb-2 font-medium">
              Password
            </label>

            <input
              type="password"
              placeholder="********"
              className="w-full border border-[#025CB8] rounded-lg px-4 py-3 outline-none text-black placeholder:text-gray-400 focus:ring-2 focus:ring-[#025CB8]"
            />
          </div>

          <div className="text-gray-500 flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Ingat Saya
            </label>

            <Link
              to="/forgot-password"
              className="text-[#025CB8] font-medium hover:underline"
            >
              Lupa Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-[#025CB8] hover:bg-[#014a94] transition text-white py-3 rounded-lg font-semibold"
          >
            Masuk
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6">
          Belum punya akun?
          <Link
            to="/register"
            className="text-[#025CB8] font-bold ml-2"
          >
            Daftar
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;