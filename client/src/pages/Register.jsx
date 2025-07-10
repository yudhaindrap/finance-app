import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      toast.success("Registration successful! Please login.");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white px-8">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md space-y-6"
        >
          <div className="text-3xl font-bold text-gray-800 mb-2">Create account</div>
          <p className="text-sm text-gray-500 mb-6">
            Sign up to manage your finances efficiently.
          </p>

          <input
            type="text"
            placeholder="Name"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-400"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
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
            Register
          </button>

          <p className="text-sm text-gray-500 text-center">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Login
            </a>
          </p>
        </form>
      </div>

      {/* RIGHT - Illustration */}
      <div className="hidden md:flex w-1/2 bg-blue-700 text-white items-center justify-center">
        <div className="text-center px-8">
          <img
            src="/illustration2.png"
            alt="register illustration"
            className="w-80 mx-auto mb-8"
          />
          <h2 className="text-2xl font-bold mb-2">Take Control</h2>
          <p className="text-sm text-blue-100">
            Sign up today and start managing your personal finance with ease.
          </p>
        </div>
      </div>
    </div>
  );
}
