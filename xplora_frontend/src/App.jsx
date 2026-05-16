// src/App.jsx
// ─────────────────────────────────────────────────────────────
// Route Architecture:
//
//  PublicRoute   → if already authenticated → /home
//  ProtectedRoute → if not authenticated   → /login
//
//  /            Landing page   (guest)
//  /home        Personal home  (auth only)
//  /login       Login page     (guest only)
//  /signup      Sign-up page   (guest only)
//  /dashboard   Trip planner   (auth only)
//  /my-trips    Saved trips    (auth only)
//  /shared/:id  Read-only trip (always public)
//  *            404 Not Found
// ─────────────────────────────────────────────────────────────
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import Landing     from "./pages/Landing";
import LandingUser from "./pages/LandingUser";
import Login       from "./pages/Login";
import Signup      from "./pages/Signup";
import Dashboard   from "./pages/Dashboard";
import MyTrips     from "./pages/MyTrips";
import SharedTrip  from "./pages/SharedTrip";
import NotFound    from "./pages/NotFound";

// ── Route Guards ──────────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? <Navigate to="/home" replace /> : children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Guest only */}
        <Route path="/"       element={<PublicRoute><Landing  /></PublicRoute>} />
        <Route path="/login"  element={<PublicRoute><Login    /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup   /></PublicRoute>} />

        {/* Auth only */}
        <Route path="/home"      element={<ProtectedRoute><LandingUser /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard  /></ProtectedRoute>} />
        <Route path="/my-trips"  element={<ProtectedRoute><MyTrips    /></ProtectedRoute>} />

        {/* Always public */}
        <Route path="/shared/:uuid" element={<SharedTrip />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;