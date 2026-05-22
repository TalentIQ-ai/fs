import { Link } from "react-router-dom";
import bgImage from "@/assets/bg.jpg";

const ForgotPassword = () => {
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
          Lupa Password
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Masukkan email untuk reset password
        </p>

        <form className="space-y-5">
          <input
            type="email"
            placeholder="nama@email.com"
            className="w-full border border-[#025CB8] rounded-lg px-4 py-3 outline-none text-black placeholder:text-gray-400 focus:ring-2 focus:ring-[#025CB8]"
          />

          <button
            type="submit"
            className="w-full bg-[#025CB8] hover:bg-[#014a94] transition text-white py-3 rounded-lg font-semibold"
          >
            Kirim Link Reset
          </button>
        </form>

        <div className="text-center mt-6">
          <Link
            to="/login"
            className="text-[#025CB8] font-bold hover:underline"
          >
            Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;