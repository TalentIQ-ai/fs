import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="min-h-screen bg-[#025CB8] flex justify-center items-center p-5">
      <div className="bg-white w-full max-w-md rounded-2xl p-8 shadow-xl">
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
              className="w-full border border-[#025CB8] rounded-lg px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="text-[#025CB8] block mb-2 font-medium">
              Password
            </label>

            <input
              type="password"
              placeholder="********"
              className="w-full border border-[#025CB8] rounded-lg px-4 py-3 outline-none"
            />
          </div>

          <div className="text-gray-500 flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Ingat Saya
            </label>

            <Link
              to="/forgot-password"
              className="text-[#025CB8] font-medium"
            >
              Lupa Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-[#025CB8] text-white py-3 rounded-lg font-semibold"
          >
            Masuk
          </button>
        </form>

        <p className="text-center text-gray-500 mb-8 mt-6">
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