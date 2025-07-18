// src/services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // sesuaikan dengan backend kamu
});

// Interceptor request: tambahkan token ke header
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor response: auto logout jika token expired
API.interceptors.response.use(
  response => response,
  error => {
    if (
      error.response &&
      error.response.data &&
      error.response.data.message === "jwt expired"
    ) {
      // Hapus token dari localStorage
      localStorage.removeItem("token");

      // Redirect user ke halaman login
      window.location.href = "/login"; // paksa redirect agar bersih
    }

    return Promise.reject(error);
  }
);

export default API;
