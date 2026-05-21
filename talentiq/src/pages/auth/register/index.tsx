import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div className="min-h-screen bg-[#025CB8] flex justify-center items-center p-5">
      <div className="bg-white w-full max-w-md rounded-2xl p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-center text-[#025CB8] mb-2">
          Buat Akun
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Mulai perjalanan karir berbasis AI Anda
        </p>

        <form className="space-y-5">
          <input
            type="text"
            placeholder="Nama Lengkap"
            className="w-full border border-[#025CB8] rounded-lg px-4 py-3"
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full border border-[#025CB8] rounded-lg px-4 py-3"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border border-[#025CB8] rounded-lg px-4 py-3"
          />

          <input
            type="password"
            placeholder="Konfirmasi Password"
            className="w-full border border-[#025CB8] rounded-lg px-4 py-3"
          />

          <button
            type="submit"
            className="w-full bg-[#025CB8] text-white py-3 rounded-lg font-semibold"
          >
            Daftar
          </button>
        </form>

        <p className="text-center text-gray-500 mb-8 mt-6">
          Sudah punya akun?
          <Link
            to="/login"
            className="text-[#025CB8] font-bold ml-2"
          >
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;