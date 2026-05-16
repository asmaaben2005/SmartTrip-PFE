// src/components/Navbar.jsx
// ─────────────────────────────────────────────────────────────
// Production-ready Global Navbar
//
// Auth state awareness:
//   Authenticated → My Trips | Dashboard | Avatar | Logout
//   Guest         → Log In (link) | Sign Up (coral button)
//
// Design tokens (hex-coded inline — no Tailwind config needed):
//   Background  #F6F5F2 / white 92% opacity  (cold white)
//   Border      #E7E5E0  (warm grey)
//   Text        #1C1917  (charcoal)
//   Secondary   #A8A29E  (slate grey)
//   Accent      #DA7756  (coral)
//   Hover       #C9623D  (coral dark)
// ─────────────────────────────────────────────────────────────
import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// ── Design tokens ─────────────────────────────────────────────
const T = {
  bg:          "rgba(246,245,242,0.95)",
  border:      "#E7E5E0",
  text:        "#1C1917",
  muted:       "#A8A29E",
  coral:       "#DA7756",
  coralHover:  "#C9623D",
  coralLight:  "rgba(218,119,86,0.10)",
  coralBorder: "rgba(218,119,86,0.28)",
};

// ── SmartTrip Logo icon ───────────────────────────────────────
const LogoIcon = () => (
  <svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden>
    <polygon
      points="16,2 6,12 2,12 8,22 2,22 10,30 22,30 30,22 24,22 30,12 26,12"
      fill={T.coral} fillOpacity=".15"
      stroke={T.coral} strokeWidth="1.9" strokeLinejoin="round"
    />
    <circle cx="16" cy="16" r="3.8" fill={T.coral} />
  </svg>
);

// ── Nav link helper ───────────────────────────────────────────
const NavLink = ({ label, onClick, active }) => (
  <button
    onClick={onClick}
    className="text-sm font-medium transition-colors duration-150 px-1"
    style={{ color: active ? T.coral : T.muted }}
    onMouseEnter={e => e.currentTarget.style.color = T.coral}
    onMouseLeave={e => e.currentTarget.style.color = active ? T.coral : T.muted}
  >
    {label}
  </button>
);

// ── Main Navbar ───────────────────────────────────────────────
const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate  = useNavigate();
  const location  = useLocation();
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const avatarRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  // Close avatar dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setAvatarOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    navigate("/");
    setAvatarOpen(false);
    setMenuOpen(false);
  };

  const go = (path) => {
    navigate(path);
    setMenuOpen(false);
    setAvatarOpen(false);
  };

  const logoTarget = isAuthenticated ? "/home" : "/";

  return (
    <>
      {/* ══════════════════════════════════════════
          NAVBAR BAR
      ══════════════════════════════════════════ */}
      <nav
        className="w-full h-[60px] sticky top-0 z-50 flex items-center justify-between px-4 md:px-8 border-b"
        style={{
          background:    T.bg,
          backdropFilter:"blur(18px)",
          WebkitBackdropFilter:"blur(18px)",
          borderColor:   T.border,
        }}
      >
        {/* ── Logo ── */}
        <button
          onClick={() => go(logoTarget)}
          className="flex items-center gap-2 shrink-0 focus:outline-none"
          aria-label="SmartTrip home"
        >
          <LogoIcon />
          <span
            className="font-serif text-xl font-bold tracking-wide select-none"
            style={{ color: T.text }}
          >
            Smart<span style={{ color: T.coral }}>Trip</span>
          </span>
        </button>

        {/* ── Desktop navigation ── */}
        <div className="hidden md:flex items-center gap-6">

          {isAuthenticated ? (
            /* ── Authenticated desktop links ── */
            <>
              <NavLink label="Dashboard" onClick={() => go("/dashboard")} active={isActive("/dashboard")} />
              <NavLink label="My Trips"  onClick={() => go("/my-trips")}  active={isActive("/my-trips")}  />

              {/* Avatar dropdown */}
              <div className="relative" ref={avatarRef}>
                <button
                  onClick={() => setAvatarOpen(o => !o)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border transition-all duration-200 focus:outline-none"
                  style={{
                    border:     `1px solid ${T.coralBorder}`,
                    background: avatarOpen ? T.coralLight : "transparent",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = T.coralLight}
                  onMouseLeave={e => { if (!avatarOpen) e.currentTarget.style.background = "transparent"; }}
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: T.coral, color: "#fff" }}
                  >
                    {(user?.name || "U")[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium hidden lg:block" style={{ color: T.text }}>
                    {user?.name?.split(" ")[0] || "Account"}
                  </span>
                  <svg
                    className="w-3.5 h-3.5 transition-transform duration-200"
                    style={{ transform: avatarOpen ? "rotate(180deg)" : "rotate(0deg)", color: T.muted }}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown */}
                {avatarOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 rounded-xl border overflow-hidden"
                    style={{
                      background:    "#FFFFFF",
                      borderColor:   T.border,
                      boxShadow:     "0 8px 30px rgba(28,25,23,0.10)",
                    }}
                  >
                    {/* User info */}
                    <div className="px-4 py-3 border-b" style={{ borderColor: T.border }}>
                      <p className="text-sm font-semibold" style={{ color: T.text }}>{user?.name || "User"}</p>
                      <p className="text-xs mt-0.5 truncate" style={{ color: T.muted }}>{user?.email || ""}</p>
                    </div>
                    {/* Links */}
                    {[
                      { label:"Dashboard",  path:"/dashboard" },
                      { label:"My Trips",   path:"/my-trips"  },
                    ].map(({ label, path }) => (
                      <button
                        key={path}
                        onClick={() => go(path)}
                        className="w-full text-left px-4 py-2.5 text-sm transition-colors duration-150"
                        style={{ color: T.text }}
                        onMouseEnter={e => { e.currentTarget.style.background = T.coralLight; e.currentTarget.style.color = T.coral; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.text; }}
                      >
                        {label}
                      </button>
                    ))}
                    <div className="border-t" style={{ borderColor: T.border }}>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-500 transition-colors duration-150"
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.06)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* ── Guest desktop links ── */
            <>
              <NavLink label="Features"    onClick={() => document.getElementById("features-section")?.scrollIntoView({ behavior:"smooth" })} />
              <NavLink label="Destinations" onClick={() => document.getElementById("cities-section")?.scrollIntoView({ behavior:"smooth" })} />
              <div className="w-px h-4" style={{ background: T.border }} />
              <button
                onClick={() => go("/login")}
                className="text-sm font-medium transition-colors duration-150"
                style={{ color: T.muted }}
                onMouseEnter={e => e.currentTarget.style.color = T.text}
                onMouseLeave={e => e.currentTarget.style.color = T.muted}
              >
                Log In
              </button>
              <button
                onClick={() => go("/signup")}
                className="px-4 py-2 text-sm font-semibold rounded-full text-white transition-all duration-200 hover:-translate-y-px active:scale-[0.97]"
                style={{ background: T.coral, boxShadow:`0 3px 14px rgba(218,119,86,0.32)` }}
                onMouseEnter={e => e.currentTarget.style.background = T.coralHover}
                onMouseLeave={e => e.currentTarget.style.background = T.coral}
              >
                Sign Up
              </button>
            </>
          )}
        </div>

        {/* ── Mobile right side ── */}
        <div className="flex md:hidden items-center gap-3">
          {isAuthenticated && (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
              style={{ background: T.coral }}
            >
              {(user?.name || "U")[0].toUpperCase()}
            </div>
          )}
          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="w-9 h-9 flex flex-col items-center justify-center gap-[5px] rounded-lg border focus:outline-none transition-all"
            style={{ background:"#F6F5F2", borderColor: T.border }}
            aria-label="Toggle menu"
          >
            <span className={`block h-[1.5px] bg-current transition-all duration-300 origin-center ${menuOpen ? "rotate-45 translate-y-[6.5px] w-[18px]" : "w-[18px]"}`} style={{ color:T.text }} />
            <span className={`block h-[1.5px] bg-current transition-all duration-200 ${menuOpen ? "opacity-0 w-0" : "w-[14px]"}`} style={{ color:T.text }} />
            <span className={`block h-[1.5px] bg-current transition-all duration-300 origin-center ${menuOpen ? "-rotate-45 -translate-y-[6.5px] w-[18px]" : "w-[18px]"}`} style={{ color:T.text }} />
          </button>
        </div>
      </nav>

      {/* ══════════════════════════════════════════
          MOBILE OVERLAY
      ══════════════════════════════════════════ */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background:"rgba(28,25,23,0.18)", backdropFilter:"blur(4px)" }}
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* ══════════════════════════════════════════
          MOBILE DRAWER
      ══════════════════════════════════════════ */}
      <div
        className={`fixed top-[60px] right-0 z-50 w-72 max-w-[88vw] md:hidden flex flex-col transition-transform duration-300 ease-out ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
        style={{
          height:      "calc(100dvh - 60px)",
          background:  "#FFFFFF",
          borderLeft:  `1px solid ${T.border}`,
          boxShadow:   "-8px 0 32px rgba(28,25,23,0.08)",
        }}
      >
        {/* User info (auth) */}
        {isAuthenticated && (
          <div className="px-5 py-4 border-b shrink-0" style={{ borderColor: T.border }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-base"
                style={{ background: T.coral }}>
                {(user?.name || "U")[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color:T.text }}>{user?.name}</p>
                <p className="text-xs truncate" style={{ color:T.muted }}>{user?.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Links */}
        <div className="flex flex-col flex-1 min-h-0 overflow-y-auto px-3 py-3 gap-0.5">
          {isAuthenticated ? (
            <>
              {[
                { label:"Home",      path:"/home"      },
                { label:"Dashboard", path:"/dashboard" },
                { label:"My Trips",  path:"/my-trips"  },
              ].map(({ label, path }) => (
                <button key={path} onClick={() => go(path)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left transition-all"
                  style={{ color: isActive(path) ? T.coral : T.text, background: isActive(path) ? T.coralLight : "transparent" }}
                  onMouseEnter={e => { if (!isActive(path)) { e.currentTarget.style.background = "#F6F5F2"; } }}
                  onMouseLeave={e => { if (!isActive(path)) { e.currentTarget.style.background = "transparent"; } }}
                >
                  {label}
                </button>
              ))}
              <div className="mt-auto pt-3 border-t" style={{ borderColor: T.border }}>
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all">
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <>
              {[
                { label:"Features",     scroll:"features-section" },
                { label:"Destinations", scroll:"cities-section"   },
              ].map(({ label, scroll }) => (
                <button key={label}
                  onClick={() => { document.getElementById(scroll)?.scrollIntoView({behavior:"smooth"}); setMenuOpen(false); }}
                  className="px-4 py-3 rounded-xl text-sm font-medium text-left transition-all"
                  style={{ color:T.text }}
                  onMouseEnter={e => e.currentTarget.style.background="#F6F5F2"}
                  onMouseLeave={e => e.currentTarget.style.background="transparent"}
                >
                  {label}
                </button>
              ))}
              <div className="mt-3 flex flex-col gap-2 px-1">
                <button onClick={() => go("/login")}
                  className="w-full py-2.5 rounded-xl text-sm font-medium border transition-all"
                  style={{ color:T.text, borderColor:T.border }}>
                  Log In
                </button>
                <button onClick={() => go("/signup")}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                  style={{ background:T.coral }}>
                  Sign Up — It's Free
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;