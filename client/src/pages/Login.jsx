import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("Login berhasil! Mengarahkan ke dashboard...", {
        position: "top-right",
        autoClose: 2000,
      });
      setTimeout(() => navigate("/"), 2000); // Delay agar toast bisa tampil
    } catch (err) {
      toast.error(err.response?.data?.message || "Login gagal!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen flex">
      <ToastContainer />

      {/* LEFT - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white px-8">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md space-y-6"
        >
          <div className="text-3xl font-bold text-gray-800 mb-2">Sign in</div>
          <p className="text-sm text-gray-500 mb-6">Enter your email and password to access your account.</p>

          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-400"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-400"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition duration-300"
          >
            Login
          </button>
          <p className="text-sm text-gray-500 text-center">
            Don't have an account? <a href="/register" className="text-blue-500 hover:underline">Register</a>
          </p>
        </form>
      </div>

      {/* RIGHT - Image or Illustration */}
      <div className="hidden md:flex w-1/2 bg-blue-700 text-white items-center justify-center relative">
        <div className="text-center px-8">
          <img
            src="/illustration.png"
            alt="illustration"
            className="w-80 mx-auto mb-8"
          />
          <h2 className="text-2xl font-bold mb-2">Check the status</h2>
          <p className="text-sm text-blue-100">
            Track your spending and stay in control with your finances.
          </p>
        </div>
      </div>
    </div>
  );
}
