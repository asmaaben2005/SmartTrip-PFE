// src/context/AuthContext.jsx
// ─────────────────────────────────────────────────────────────
// Global authentication state.
// Persists JWT + user object in localStorage so the session
// survives page refresh, tab close/reopen, and navigation.
// ─────────────────────────────────────────────────────────────
import { createContext, useState, useCallback } from "react";

export const AuthContext = createContext(null);

// ── Safe localStorage helpers ─────────────────────────────────
const LS_TOKEN = "smarttrip_token";
const LS_USER  = "smarttrip_user";

const loadToken = () => {
  try { return localStorage.getItem(LS_TOKEN) || null; }
  catch { return null; }
};

const loadUser = () => {
  try {
    const raw = localStorage.getItem(LS_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    localStorage.removeItem(LS_USER);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  // ── Lazy initial state: read localStorage ONCE on first render
  // This is the fix that prevents session loss on page refresh.
  const [token, setToken] = useState(loadToken);
  const [user,  setUser]  = useState(loadUser);

  // ── login: persist to state + localStorage atomically ────────
  const login = useCallback((tokenValue, userData) => {
    localStorage.setItem(LS_TOKEN, tokenValue);
    localStorage.setItem(LS_USER,  JSON.stringify(userData));
    setToken(tokenValue);
    setUser(userData);
  }, []);

  // ── logout: wipe everything ───────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem(LS_TOKEN);
    localStorage.removeItem(LS_USER);
    setToken(null);
    setUser(null);
  }, []);

  // ── isAuthenticated: derived boolean ─────────────────────────
  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};