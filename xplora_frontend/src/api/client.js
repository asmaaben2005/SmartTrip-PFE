// src/api/client.js
// ─────────────────────────────────────────────────────────────
// Axios instance:
//  • Attaches JWT from localStorage to every request header
//  • On 401 → auto-logout + redirect to /login
// ─────────────────────────────────────────────────────────────
import axios from "axios";

const client = axios.create({
 baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  headers: { "Content-Type": "application/json" },
});

// ── Attach token ──────────────────────────────────────────────
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("smarttrip_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Handle expired token ──────────────────────────────────────
client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("smarttrip_token");
      localStorage.removeItem("smarttrip_user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default client;