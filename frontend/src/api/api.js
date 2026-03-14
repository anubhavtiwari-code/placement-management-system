import axios from "axios";
import toast from "react-hot-toast";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://nexusplace-api.onrender.com/api",
  timeout: 10000, // 10s timeout to prevent hanging UI
});

// Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token.replace(/^"|"$/g, '')}`;
  }
  return req;
});

// Global Error Handler
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "Cloud Connection Error";
    if (error.response?.status === 401) {
      localStorage.clear(); // Session expired
    }
    console.error("🚀 API [Error]:", message);
    toast.error(message);
    return Promise.reject(error);
  }
);

export default API;