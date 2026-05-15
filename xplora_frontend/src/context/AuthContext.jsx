// src/context/AuthContext.jsx
// ─────────────────────────────────────────────────────────────
// Stores JWT + user in localStorage so the app "remembers"
// the session on page refresh or navigation.
// ─────────────────────────────────────────────────────────────
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

// ── Safe localStorage readers ─────────────────────────────────
const readToken = () => {
  try { return localStorage.getItem("smarttrip_token") || null; }
  catch { return null; }
};

const readUser = () => {
  try {
    const raw = localStorage.getItem("smarttrip_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    localStorage.removeItem("smarttrip_user");
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  // ── Initialize directly from localStorage ──────────────────
  // This is the KEY fix: we read localStorage on FIRST render,
  // so after a refresh or page change the user is still logged in.
  const [token, setToken] = useState(readToken);
  const [user,  setUser]  = useState(readUser);

  // ── login: save to state + localStorage ────────────────────
  const login = (tokenValue, userData) => {
    localStorage.setItem("smarttrip_token", tokenValue);
    localStorage.setItem("smarttrip_user",  JSON.stringify(userData));
    setToken(tokenValue);
    setUser(userData);
  };

  // ── logout: clear everything ────────────────────────────────
  const logout = () => {
    localStorage.removeItem("smarttrip_token");
    localStorage.removeItem("smarttrip_user");
    setToken(null);
    setUser(null);
  };

  // ── isAuthenticated: true when we have a valid token ────────
  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};