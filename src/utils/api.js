// src/utils/api.js
import axios from "axios";

const API = axios.create({
  // Ye sahi hai, Vite ke environment variable ko access karne ke liye
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",

  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token from localStorage before each request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const msg = error.response?.data?.message || "";
      if (msg.includes("token") || msg.includes("authorized")) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete API.defaults.headers.common["Authorization"];
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default API;
