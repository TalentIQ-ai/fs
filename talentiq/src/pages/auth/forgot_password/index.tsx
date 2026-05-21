import { Link } from "react-router-dom";

const ForgotPassword = () => {
  return (
    <div className="min-h-screen bg-[#025CB8] flex justify-center items-center p-5">
      <div className="bg-white w-full max-w-md rounded-2xl p-8 shadow-xl">
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
            className="w-full border border-[#025CB8] rounded-lg px-4 py-3"
          />

          <button
            type="submit"
            className="w-full bg-[#025CB8] text-white py-3 rounded-lg font-semibold"
          >
            Kirim Link Reset
          </button>
        </form>

        <div className="text-center mt-6">
          <Link
            to="/login"
            className="text-[#025CB8] font-bold"
          >
            Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;