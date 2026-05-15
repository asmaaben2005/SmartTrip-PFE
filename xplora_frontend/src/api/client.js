// src/api/client.js
// ─────────────────────────────────────────────────────────────
// Axios instance that automatically attaches the JWT token
// to every request. Uses the same localStorage key as AuthContext.
// ─────────────────────────────────────────────────────────────
import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Attach JWT to every request ───────────────────────────────
client.interceptors.request.use((config) => {
  // Must use the SAME key as AuthContext ("smarttrip_token")
  const token = localStorage.getItem("smarttrip_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Handle 401 globally (token expired / invalid) ────────────
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired — clean up and redirect to login
      localStorage.removeItem("smarttrip_token");
      localStorage.removeItem("smarttrip_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default client;