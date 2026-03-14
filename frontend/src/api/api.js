import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://nexusplace-api.onrender.com/api" || "http://localhost:5000/api",
});

// Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;