// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext }  from "./context/AuthContext";
import Landing          from "./pages/Landing";
import LandingUser      from "./pages/LandingUser";   // ← NEW
import Login            from "./pages/Login";
import Signup           from "./pages/Signup";
import Dashboard        from "./pages/Dashboard";
import SharedTrip       from "./pages/SharedTrip";
import MyTrips          from "./pages/MyTrips";
import NotFound         from "./pages/NotFound";

// ── If NOT logged in → redirect to /login ────────────────────
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// ── If ALREADY logged in → redirect to /home ─────────────────
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? <Navigate to="/home" replace /> : children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Non-auth only ─────────────────────────────────── */}
        <Route path="/"       element={<PublicRoute><Landing /></PublicRoute>} />
        <Route path="/login"  element={<PublicRoute><Login   /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup  /></PublicRoute>} />

        {/* ── Auth only ─────────────────────────────────────── */}
        {/* /home = personalized landing for logged-in users     */}
        <Route path="/home"      element={<ProtectedRoute><LandingUser /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard  /></ProtectedRoute>} />
        <Route path="/my-trips"  element={<ProtectedRoute><MyTrips    /></ProtectedRoute>} />

        {/* ── Always public ─────────────────────────────────── */}
        <Route path="/shared/:uuid" element={<SharedTrip />} />
        <Route path="*"             element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;