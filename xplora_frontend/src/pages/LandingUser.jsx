// src/pages/LandingUser.jsx
// Light blanc froid theme — 6 villes marocaines — coral accent

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";
import client from "../api/client";

const C  = "#DA7756";
const CH = "#C9623D";
const BG = "#F6F5F2";

/* ── 6 villes marocaines ────────────────────────────────────── */
const CITIES = [
  { name:"Marrakech",   tag:"Médina · Palais",  emoji:"🏮",
    img:"https://images.unsplash.com/photo-1618423205267-e95744f57edf?w=700&q=80" },
  { name:"Casablanca",  tag:"Métropole Moderne", emoji:"🕌",
    img:"https://images.unsplash.com/photo-1699210260021-eac11ba4ff86?w=700&q=80" },
  { name:"Chefchaouen", tag:"Ville Bleue",       emoji:"💙",
    img:"https://images.unsplash.com/flagged/photo-1555169048-3c4845cfcf1c?w=700&q=80" },
  { name:"Fès",         tag:"Patrimoine Éternel",emoji:"🎨",
    img:"https://images.unsplash.com/photo-1557503799-fac6a98054b3?w=700&q=80" },
  { name:"Agadir",      tag:"Charme Côtier",     emoji:"🏖️",
    img:"https://images.unsplash.com/photo-1538053367502-742497073841?w=700&q=80" },
  { name:"Rabat",       tag:"Capitale Royale",   emoji:"🏛️",
    img:"https://images.unsplash.com/photo-1597081315272-a8b558ca4e86?w=700&q=80" },
];

/* ── Moroccan hero backgrounds ──────────────────────────────── */
const HEROES = [
  "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1920&q=80",
  "https://images.unsplash.com/photo-1624802746702-60ca95bdb605?w=1920&q=80",
  "https://images.unsplash.com/photo-1590802163243-290dd8621032?w=1920&q=80",
  "https://images.unsplash.com/photo-1574545188455-fe512926e41b?w=1920&q=80",
];

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Bonjour";
  if (h < 18) return "Bon après-midi";
  return "Bonsoir";
};

/* ── Trip card ─────────────────────────────────────────────── */
const TripCard = ({ trip, onClick }) => {
  const fmt = (d) => {
    try { return new Date(d).toLocaleDateString("fr-MA",{day:"numeric",month:"short",year:"numeric"}); }
    catch { return d; }
  };
  return (
    <button onClick={onClick}
      className="text-left rounded-xl border p-4 transition-all duration-200 group hover:-translate-y-0.5 active:scale-[0.99]"
      style={{background:"#FFFFFF", borderColor:"#E7E5E0"}}
      onMouseEnter={e=>{ e.currentTarget.style.borderColor="rgba(218,119,86,0.40)"; e.currentTarget.style.background="#FFFAF8"; }}
      onMouseLeave={e=>{ e.currentTarget.style.borderColor="#E7E5E0"; e.currentTarget.style.background="#FFFFFF"; }}
    >
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-[10px] font-medium truncate" style={{color:"#A8A29E"}}>{trip.from_location||"—"}</span>
        <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke={C} strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"/>
        </svg>
        <span className="text-[10px] font-bold uppercase truncate" style={{color:C}}>{trip.destination}</span>
      </div>
      <h3 className="font-serif text-base font-black truncate" style={{color:"#1C1917"}}>{trip.destination}</h3>
      <p className="text-[11px] mt-1" style={{color:"#A8A29E"}}>Sauvegardé le {fmt(trip.created_at)}</p>
      <div className="flex items-center gap-1 mt-3 text-[11px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity" style={{color:C}}>
        Voir l'itinéraire
        <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
        </svg>
      </div>
    </button>
  );
};

/* ── Main ───────────────────────────────────────────────────── */
const LandingUser = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [bgUrl]           = useState(() => HEROES[Math.floor(Math.random() * HEROES.length)]);
  const [bgLoaded, setBgLoaded]   = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [trips, setTrips]         = useState([]);
  const [tripsLoading, setTripsLoading] = useState(true);
  const [showCities, setShowCities]     = useState(false);
  const citiesRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.src = bgUrl;
    img.onload = () => { setBgLoaded(true); setTimeout(() => setHeroLoaded(true), 100); };
  }, [bgUrl]);

  useEffect(() => {
    client.get("/trips/my-trips")
      .then(r => setTrips(r.data?.slice(0,4)||[]))
      .catch(() => setTrips([]))
      .finally(() => setTripsLoading(false));
  }, []);

  useEffect(() => {
    if (!citiesRef.current) return;
    const obs = new IntersectionObserver(([e])=>{ if(e.isIntersecting) setShowCities(true); },{threshold:0.1});
    obs.observe(citiesRef.current);
    return () => obs.disconnect();
  }, []);

  const firstName = user?.name?.split(" ")[0] || "Voyageur";

  return (
    <div className="min-h-screen w-screen overflow-x-hidden" style={{background:BG}}>

      {/* ════ HERO ════ */}
      <div className="relative h-screen flex flex-col overflow-hidden">
        {/* Moroccan background */}
        <div className="absolute inset-0 z-0 transition-opacity duration-1000"
          style={{
            backgroundImage: bgLoaded ? `url('${bgUrl}')` : undefined,
            backgroundSize:"cover", backgroundPosition:"center",
            opacity: bgLoaded ? 1 : 0,
          }}
        />
        {/* Gradient overlay — keeps text readable on photo */}
        <div className="absolute inset-0 z-10" style={{
          background:"linear-gradient(to bottom, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.28) 45%, rgba(0,0,0,0.62) 100%)"
        }}/>

        {/* ── Navbar (transparent over hero) ── */}
        <nav className="relative z-30 flex items-center justify-between px-4 md:px-8 py-4 border-b border-white/10 backdrop-blur-md shrink-0"
          style={{background:"rgba(246,245,242,0.15)"}}>
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top:0,behavior:"smooth"})}>
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
              <polygon points="16,2 6,12 2,12 8,22 2,22 10,30 22,30 30,22 24,22 30,12 26,12"
                fill="white" fillOpacity=".2" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
              <circle cx="16" cy="16" r="3.5" fill="white"/>
            </svg>
            <span className="font-serif text-white text-xl font-bold tracking-wide">
              Smart<span style={{color:"#f4b89a"}}>Trip</span>
            </span>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <button onClick={() => navigate("/my-trips")}
              className="text-sm font-medium text-white/70 hover:text-white transition-colors hidden sm:block">
              Mes Voyages
            </button>
            <button onClick={() => navigate("/dashboard")}
              className="px-4 py-2 text-sm font-semibold rounded-full text-white transition-all hover:-translate-y-0.5"
              style={{background:`linear-gradient(135deg,#8b3a22,${C})`, boxShadow:`0 4px 14px rgba(218,119,86,0.40)`}}>
              Planifier
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 border-white/30"
                style={{background:"rgba(255,255,255,0.15)"}}>
                <span className="text-sm font-bold text-white">{(user?.name||"T")[0].toUpperCase()}</span>
              </div>
              <span className="text-sm text-white/70 hidden md:block">{user?.name}</span>
            </div>
            <button onClick={() => { logout(); navigate("/"); }}
              className="text-xs font-semibold px-3 py-1.5 rounded-full border border-white/25 text-white/70 hover:text-white hover:border-white/50 transition-all"
              style={{background:"rgba(255,255,255,0.08)"}}>
              Déconnexion
            </button>
          </div>
        </nav>

        {/* ── Hero content ── */}
        <div className="relative z-20 flex-1 flex items-center justify-center px-5 min-h-0">
          <div className="max-w-3xl w-full text-center">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full border border-white/25"
              style={{
                background:"rgba(255,255,255,0.12)", backdropFilter:"blur(8px)",
                opacity: heroLoaded?1:0,
                transform: heroLoaded?"translateY(0)":"translateY(-16px)",
                transition:"opacity 0.6s ease,transform 0.6s ease",
              }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{background:"#f4b89a"}}/>
              <span className="text-xs font-semibold tracking-widest uppercase text-white/90">
                {greeting()}, {firstName} 👋
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-sans text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4 drop-shadow-2xl"
              style={{
                opacity: heroLoaded?1:0,
                transform: heroLoaded?"translateY(0)":"translateY(24px)",
                transition:"opacity 0.65s ease 0.1s,transform 0.65s ease 0.1s",
              }}>
              Prêt pour votre<br/>
              <span className="italic" style={{color:"#f4b89a"}}>prochain voyage ?</span>
            </h1>

            <p className="text-white/65 text-sm md:text-base font-light mb-8 max-w-lg mx-auto leading-relaxed"
              style={{
                opacity: heroLoaded?1:0,
                transform: heroLoaded?"translateY(0)":"translateY(16px)",
                transition:"opacity 0.7s ease 0.25s,transform 0.7s ease 0.25s",
              }}>
              Planifiez un nouvel itinéraire marocain en quelques secondes avec l'IA, ou consultez vos voyages sauvegardés.
            </p>

            {/* CTAs */}
            <div className="flex items-center justify-center gap-3 flex-wrap"
              style={{
                opacity: heroLoaded?1:0,
                transform: heroLoaded?"translateY(0)":"translateY(16px)",
                transition:"opacity 0.7s ease 0.4s,transform 0.7s ease 0.4s",
              }}>
              <button onClick={() => navigate("/dashboard")}
                className="px-7 py-3.5 font-semibold text-sm rounded-full text-white transition-all hover:-translate-y-0.5 active:scale-[0.97]"
                style={{background:`linear-gradient(135deg,#8b3a22,${C})`, boxShadow:`0 6px 24px rgba(218,119,86,0.45)`}}>
                ✦ Planifier un voyage
              </button>
              <button onClick={() => navigate("/my-trips")}
                className="px-7 py-3.5 border border-white/30 text-white/80 font-semibold text-sm rounded-full transition-all hover:-translate-y-0.5 backdrop-blur-sm"
                style={{background:"rgba(255,255,255,0.10)"}}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor="rgba(244,184,154,0.60)"; e.currentTarget.style.color="#f4b89a"; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor="rgba(255,255,255,0.30)"; e.currentTarget.style.color="rgba(255,255,255,0.80)"; }}>
                Mes voyages sauvegardés →
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mt-10 pt-8 border-t border-white/15"
              style={{opacity: heroLoaded?1:0, transition:"opacity 0.7s ease 0.6s"}}>
              {[[trips.length||"0","Voyages sauvegardés"],["6","Villes disponibles"],["∞","Possibilités"]].map(([n,l])=>(
                <div key={l} className="text-center">
                  <p className="text-2xl font-bold text-white">{n}</p>
                  <p className="text-[10px] text-white/45 uppercase tracking-wider mt-0.5">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1"
          style={{opacity: heroLoaded?0.5:0, transition:"opacity 0.7s ease 0.9s"}}>
          <span className="text-[10px] text-white/50 uppercase tracking-widest">Défiler</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent animate-bounce"/>
        </div>
      </div>

      {/* ════ RECENT TRIPS (white section) ════ */}
      <section className="py-16 px-4 md:px-8" style={{background:"#FFFFFF"}}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{color:C}}>Vos itinéraires</p>
              <h2 className="font-sans text-2xl md:text-3xl font-extrabold" style={{color:"#1C1917"}}>Voyages récents</h2>
            </div>
            {trips.length > 0 && (
              <button onClick={() => navigate("/my-trips")}
                className="text-xs font-semibold transition-colors" style={{color:C}}
                onMouseEnter={e=>e.currentTarget.style.color=CH}
                onMouseLeave={e=>e.currentTarget.style.color=C}>
                Voir tout →
              </button>
            )}
          </div>

          {tripsLoading && (
            <div className="flex items-center gap-3 text-sm" style={{color:"#A8A29E"}}>
              <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{borderColor:`${C}25`,borderTopColor:C}}/>
              Chargement...
            </div>
          )}

          {!tripsLoading && trips.length === 0 && (
            <div className="rounded-2xl border p-10 text-center" style={{background:"#F6F5F2",borderColor:"#E7E5E0"}}>
              <p className="text-4xl mb-4">🗺️</p>
              <p className="text-sm font-light mb-5" style={{color:"#A8A29E"}}>
                Aucun voyage sauvegardé pour l'instant.<br/>Planifiez votre première aventure marocaine !
              </p>
              <button onClick={() => navigate("/dashboard")}
                className="px-6 py-2.5 font-semibold text-sm rounded-full text-white transition-all hover:-translate-y-0.5"
                style={{background:`linear-gradient(135deg,#8b3a22,${C})`, boxShadow:`0 4px 16px rgba(218,119,86,0.30)`}}>
                Planifier maintenant →
              </button>
            </div>
          )}

          {!tripsLoading && trips.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {trips.map(trip => (
                <TripCard key={trip.uuid} trip={trip} onClick={() => navigate("/my-trips")}/>
              ))}
              {/* New trip card */}
              <button onClick={() => navigate("/dashboard")}
                className="rounded-xl border border-dashed p-4 flex flex-col items-center justify-center gap-3 transition-all hover:-translate-y-0.5 min-h-[120px]"
                style={{borderColor:"rgba(218,119,86,0.25)",background:"rgba(218,119,86,0.03)"}}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor=C; e.currentTarget.style.background="rgba(218,119,86,0.07)"; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor="rgba(218,119,86,0.25)"; e.currentTarget.style.background="rgba(218,119,86,0.03)"; }}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{background:"rgba(218,119,86,0.10)",border:"1.5px solid rgba(218,119,86,0.30)"}}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={C} strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
                  </svg>
                </div>
                <span className="text-xs font-semibold" style={{color:C}}>Nouveau voyage</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ════ CITIES GRID (light grey section) ════ */}
      <section ref={citiesRef} className="py-16 px-4 md:px-8" style={{background:"#F6F5F2"}}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{color:C}}>6 Destinations</p>
            <h2 className="font-sans text-2xl md:text-3xl font-extrabold mb-2" style={{color:"#1C1917"}}>Où voyager ensuite ?</h2>
            <p className="text-sm font-light" style={{color:"#A8A29E"}}>Cliquez pour planifier instantanément</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {CITIES.map((city, i) => (
              <button key={i} onClick={() => navigate("/dashboard")}
                className="group relative h-44 md:h-52 rounded-2xl overflow-hidden text-left transition-all duration-300 hover:-translate-y-1"
                style={{
                  opacity:    showCities?1:0,
                  transform:  showCities?"translateY(0)":"translateY(24px)",
                  transition: `opacity 0.5s ease ${i*0.07}s, transform 0.5s cubic-bezier(0.34,1.56,0.64,1) ${i*0.07}s, translate 0.3s ease`,
                  border:     "1px solid #E7E5E0",
                  boxShadow:  "0 2px 8px rgba(0,0,0,0.06)",
                }}
              >
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                  style={{backgroundImage:`url('${city.img}')`,backgroundSize:"cover",backgroundPosition:"center"}}/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent"/>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  style={{background:`radial-gradient(circle at 50% 80%,rgba(218,119,86,0.15) 0%,transparent 60%)`}}/>

                <div className="absolute inset-0 flex flex-col justify-between p-4 z-10">
                  <span className="self-end text-2xl opacity-0 group-hover:opacity-70 transition-opacity">{city.emoji}</span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{color:"#f4b89a"}}>{city.tag}</p>
                    <h3 className="font-sans text-lg font-extrabold text-white">{city.name}</h3>
                    <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity" style={{color:"#f4b89a"}}>
                      Planifier ici
                      <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 opacity-0 group-hover:opacity-40 transition-all duration-400 rounded-bl-xl"
                  style={{borderColor:C}}/>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ════ CTA BAND ════ */}
      <section className="py-14 px-4 text-center border-t" style={{background:"#FFFFFF",borderColor:"#E7E5E0"}}>
        <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{color:C}}>Planification IA</p>
        <h2 className="font-sans text-2xl md:text-3xl font-extrabold mb-3" style={{color:"#1C1917"}}>
          Commencez votre prochaine aventure
        </h2>
        <p className="text-sm font-light mb-7 max-w-lg mx-auto" style={{color:"#A8A29E"}}>
          Décrivez votre voyage idéal et laissez l'IA construire un itinéraire complet jour par jour.
        </p>
        <button onClick={() => navigate("/dashboard")}
          className="px-8 py-3.5 font-semibold text-sm rounded-full text-white transition-all hover:-translate-y-0.5 active:scale-[0.97]"
          style={{background:`linear-gradient(135deg,#8b3a22,${C})`, boxShadow:`0 6px 24px rgba(218,119,86,0.30)`}}>
          ✦ Planifier maintenant
        </button>
      </section>

      {/* ════ FOOTER ════ */}
      <footer className="border-t py-8 px-4 text-center" style={{background:"#F6F5F2",borderColor:"#E7E5E0"}}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
            <polygon points="16,2 6,12 2,12 8,22 2,22 10,30 22,30 30,22 24,22 30,12 26,12"
              fill={C} fillOpacity=".2" stroke={C} strokeWidth="2" strokeLinejoin="round"/>
            <circle cx="16" cy="16" r="3.5" fill={C}/>
          </svg>
          <span className="font-serif text-base font-bold" style={{color:"#1C1917"}}>
            Smart<span style={{color:C}}>Trip</span>
          </span>
        </div>
        <p className="text-xs" style={{color:"#A8A29E"}}>Morocco, Smartly Reimagined. · © 2024 SmartTrip</p>
      </footer>

      <style>{`
        html { scroll-behavior:smooth; }
        * { -webkit-font-smoothing:antialiased; }
        ::-webkit-scrollbar { width:6px; }
        ::-webkit-scrollbar-track { background:#F6F5F2; }
        ::-webkit-scrollbar-thumb { background:rgba(218,119,86,0.30); border-radius:99px; }
      `}</style>
    </div>
  );
};

export default LandingUser;