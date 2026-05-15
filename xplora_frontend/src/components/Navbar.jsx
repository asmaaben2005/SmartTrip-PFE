// src/components/Navbar.jsx
// Light blanc froid theme + coral accent

import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import LanguageSelector from "./LanguageSelector";
import useTranslate from "../hooks/useTranslate";
import SurpriseMe from "./SurpriseMe";

const C = "#DA7756";   // coral
const CH = "#C9623D";  // coral hover

const Navbar = () => {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [surpriseOpen, setSurpriseOpen] = useState(false);
  const [menuOpen,     setMenuOpen]     = useState(false);

  const [myTrips, logoutText] = useTranslate(["Mes Voyages", "Déconnexion"]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleLogoClick = () => navigate(isAuthenticated ? "/home" : "/");
  const handleLogout    = () => { logout(); navigate("/"); setMenuOpen(false); };
  const handleNav       = (p) => { navigate(p); setMenuOpen(false); };
  const handleSurprise  = () => { setSurpriseOpen(true); setMenuOpen(false); };

  return (
    <>
      <nav
        className="w-full h-14 md:h-16 sticky top-0 z-50 flex items-center justify-between px-4 md:px-8 border-b"
        style={{
          background:   "rgba(246,245,242,0.94)",
          backdropFilter:"blur(16px)",
          borderColor:  "#E7E5E0",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={handleLogoClick}>
          <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
            <polygon points="16,2 6,12 2,12 8,22 2,22 10,30 22,30 30,22 24,22 30,12 26,12"
              fill={C} fillOpacity=".15" stroke={C} strokeWidth="2" strokeLinejoin="round"/>
            <circle cx="16" cy="16" r="3.5" fill={C}/>
          </svg>
          <span className="font-serif font-bold text-xl tracking-wide" style={{color:"#1C1917"}}>
            Smart<span style={{color:C}}>Trip</span>
          </span>
        </div>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-5">
          <button onClick={() => navigate("/my-trips")}
            className="text-sm font-medium transition-colors"
            style={{color:"#57534E"}}
            onMouseEnter={e=>e.currentTarget.style.color=C}
            onMouseLeave={e=>e.currentTarget.style.color="#57534E"}
          >
            {myTrips}
          </button>

          {/* Surprise Me */}
          <button
            onClick={() => setSurpriseOpen(true)}
            className="flex items-center gap-1.5 text-sm font-semibold px-3.5 py-1.5 rounded-full transition-all duration-200 border"
            style={{ color:C, borderColor:"rgba(218,119,86,0.30)", background:"rgba(218,119,86,0.06)" }}
            onMouseEnter={e=>{ e.currentTarget.style.background="rgba(218,119,86,0.12)"; e.currentTarget.style.borderColor=C; }}
            onMouseLeave={e=>{ e.currentTarget.style.background="rgba(218,119,86,0.06)"; e.currentTarget.style.borderColor="rgba(218,119,86,0.30)"; }}
          >
            <span>✦</span><span>Surprise Me</span>
          </button>

          <LanguageSelector />

          {/* Avatar */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
              style={{ background:"rgba(218,119,86,0.12)", border:`1.5px solid rgba(218,119,86,0.30)` }}>
              <span className="text-xs font-bold" style={{color:C}}>
                {(user?.name||"T")[0].toUpperCase()}
              </span>
            </div>
            <span className="text-sm hidden lg:block" style={{color:"#57534E"}}>{user?.name||"Voyageur"}</span>
          </div>

          <button onClick={handleLogout}
            className="text-xs font-semibold px-3 py-1.5 rounded-full border transition-all"
            style={{ color:"#57534E", borderColor:"#D6D3CE", background:"#F6F5F2" }}
            onMouseEnter={e=>{ e.currentTarget.style.color=C; e.currentTarget.style.borderColor=C; }}
            onMouseLeave={e=>{ e.currentTarget.style.color="#57534E"; e.currentTarget.style.borderColor="#D6D3CE"; }}
          >
            {logoutText}
          </button>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-3">
          <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
            style={{ background:"rgba(218,119,86,0.12)", border:"1.5px solid rgba(218,119,86,0.30)" }}>
            <span className="text-xs font-bold" style={{color:C}}>{(user?.name||"T")[0].toUpperCase()}</span>
          </div>
          <button onClick={() => setMenuOpen(o=>!o)}
            className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg border transition-all"
            style={{ background:"#F6F5F2", borderColor:"#E7E5E0" }}>
            <span className={`block h-px transition-all duration-300 origin-center ${menuOpen?"rotate-45 translate-y-[7px]":""}`} style={{width:"18px",background:"#57534E"}}/>
            <span className={`block h-px transition-all duration-300 ${menuOpen?"opacity-0 w-0":""}`} style={{width:"18px",background:"#57534E"}}/>
            <span className={`block h-px transition-all duration-300 origin-center ${menuOpen?"-rotate-45 -translate-y-[7px]":""}`} style={{width:"18px",background:"#57534E"}}/>
          </button>
        </div>
      </nav>

      {menuOpen && <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden" onClick={() => setMenuOpen(false)}/>}

      {/* Drawer */}
      <div
        className={`fixed top-14 right-0 z-50 w-72 max-w-[90vw] md:hidden flex flex-col transition-transform duration-300 ease-out ${menuOpen?"translate-x-0":"translate-x-full"}`}
        style={{ height:"calc(100dvh - 3.5rem)", background:"#FFFFFF", borderLeft:"1px solid #E7E5E0" }}
      >
        {/* User info */}
        <div className="px-5 py-4 border-b shrink-0" style={{borderColor:"#E7E5E0"}}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{background:"rgba(218,119,86,0.10)",border:"1.5px solid rgba(218,119,86,0.30)"}}>
              <span className="text-sm font-bold" style={{color:C}}>{(user?.name||"T")[0].toUpperCase()}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate" style={{color:"#1C1917"}}>{user?.name||"Voyageur"}</p>
              <p className="text-xs truncate" style={{color:"#A8A29E"}}>{user?.email||""}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 min-h-0 overflow-y-auto px-3 py-3 gap-1">
          {[
            { label:"Accueil",   path:"/home",      icon:<path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/> },
            { label:"Planifier", path:"/dashboard", icon:<path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 7.384A2.25 2.25 0 012.25 5.492V5.25"/> },
            { label:myTrips,     path:"/my-trips",  icon:<path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/> },
          ].map(({label,path,icon})=>(
            <button key={path} onClick={()=>handleNav(path)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all text-left"
              style={{color:"#57534E"}}
              onMouseEnter={e=>{ e.currentTarget.style.background="rgba(218,119,86,0.08)"; e.currentTarget.style.color=C; }}
              onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#57534E"; }}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>{icon}</svg>
              {label}
            </button>
          ))}

          <button onClick={handleSurprise}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all text-left mt-1 border"
            style={{color:C, borderColor:"rgba(218,119,86,0.25)", background:"rgba(218,119,86,0.05)"}}
            onMouseEnter={e=>{ e.currentTarget.style.background="rgba(218,119,86,0.10)"; }}
            onMouseLeave={e=>{ e.currentTarget.style.background="rgba(218,119,86,0.05)"; }}
          >
            <span className="text-base shrink-0">✦</span>
            Surprise Me
          </button>

          <div className="mt-3 px-1 pt-3 border-t" style={{borderColor:"#E7E5E0"}}>
            <p className="text-[10px] font-bold tracking-widest uppercase px-3 mb-2" style={{color:"#A8A29E"}}>Langue</p>
            <LanguageSelector mobileFullWidth />
          </div>

          <div className="mt-3 pt-3 border-t" style={{borderColor:"#E7E5E0"}}>
            <button onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-all">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              {logoutText}
            </button>
          </div>
        </div>
      </div>

      <SurpriseMe isOpen={surpriseOpen} onClose={() => setSurpriseOpen(false)} />
    </>
  );
};

export default Navbar;