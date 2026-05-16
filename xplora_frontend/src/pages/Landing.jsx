// src/pages/Landing.jsx
// ─────────────────────────────────────────────────────────────
// Public landing page — all text in English
// CTA button mutates:
//   Guest         → "Get Started — It's Free"
//   Authenticated → "Go to Dashboard"
// ─────────────────────────────────────────────────────────────
import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";

// ── Design tokens ─────────────────────────────────────────────
const T = {
  bg:         "#F6F5F2",
  white:      "#FFFFFF",
  border:     "#E7E5E0",
  text:       "#1C1917",
  muted:      "#A8A29E",
  coral:      "#DA7756",
  coralHover: "#C9623D",
  coralLight: "rgba(218,119,86,0.09)",
  glow:       "rgba(218,119,86,0.28)",
};

// ── Moroccan hero backgrounds ─────────────────────────────────
const HEROES = [
  "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1920&q=80",
  "https://images.unsplash.com/photo-1624802746702-60ca95bdb605?w=1920&q=80",
  "https://images.unsplash.com/photo-1590802163243-290dd8621032?w=1920&q=80",
  "https://images.unsplash.com/photo-1574545188455-fe512926e41b?w=1920&q=80",
];

// ── 6 cities ──────────────────────────────────────────────────
const CITIES = [
  { name:"Marrakech",   tag:"Medina · Palaces",  img:"https://images.unsplash.com/photo-1618423205267-e95744f57edf?w=700&q=80" },
  { name:"Casablanca",  tag:"Metropolis",         img:"https://images.unsplash.com/photo-1699210260021-eac11ba4ff86?w=700&q=80" },
  { name:"Chefchaouen", tag:"Blue City",          img:"https://images.unsplash.com/flagged/photo-1555169048-3c4845cfcf1c?w=700&q=80" },
  { name:"Fès",         tag:"Heritage · Crafts",  img:"https://images.unsplash.com/photo-1557503799-fac6a98054b3?w=700&q=80" },
  { name:"Agadir",      tag:"Atlantic Beach",     img:"https://images.unsplash.com/photo-1538053367502-742497073841?w=700&q=80" },
  { name:"Rabat",       tag:"Royal Capital",      img:"https://images.unsplash.com/photo-1597081315272-a8b558ca4e86?w=700&q=80" },
];

// ── Features ──────────────────────────────────────────────────
const FEATURES = [
  { icon:"🧠", title:"AI-Powered Planning",     desc:"Describe your dream trip and get a complete day-by-day Moroccan itinerary instantly." },
  { icon:"💰", title:"Smart Budget Management", desc:"Every plan respects your budget with realistic cost breakdowns per category." },
  { icon:"🗺️", title:"6 Iconic Cities",          desc:"Marrakech to Rabat — AI-curated routes tailored to your travel style." },
  { icon:"☀️", title:"Live Weather Insights",    desc:"Real-time forecasts integrated into your itinerary to avoid surprises." },
  { icon:"🏨", title:"Hotel Recommendations",   desc:"Curated accommodation options matched to your style and budget." },
  { icon:"🚂", title:"Transport Guidance",      desc:"Train, bus, and flight options with estimated costs and travel time." },
];

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  const [bgUrl]    = useState(() => HEROES[Math.floor(Math.random() * HEROES.length)]);
  const [bgLoaded, setBgLoaded]   = useState(false);
  const [animated, setAnimated]   = useState(false);
  const [showCities, setShowCities] = useState(false);
  const citiesRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.src = bgUrl;
    img.onload = () => { setBgLoaded(true); setTimeout(() => setAnimated(true), 80); };
  }, [bgUrl]);

  useEffect(() => {
    if (!citiesRef.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setShowCities(true); }, { threshold:0.08 });
    obs.observe(citiesRef.current);
    return () => obs.disconnect();
  }, []);

  // ── Dynamic CTA ───────────────────────────────────────────
  const handleCTA = () => navigate(isAuthenticated ? "/dashboard" : "/signup");
  const ctaLabel  = isAuthenticated ? "Go to Dashboard →" : "Get Started — It's Free";

  return (
    <div className="min-h-screen w-screen overflow-x-hidden" style={{ background:T.bg }}>

      {/* ════ HERO (full viewport) ════ */}
      <div className="relative h-screen flex flex-col overflow-hidden">

        {/* Moroccan background image */}
        <div className="absolute inset-0 z-0 transition-opacity duration-1000"
          style={{
            backgroundImage: bgLoaded ? `url('${bgUrl}')` : undefined,
            backgroundSize:  "cover",
            backgroundPosition: "center",
            opacity: bgLoaded ? 1 : 0,
          }}
        />
        {/* Cinematic gradient overlay */}
        <div className="absolute inset-0 z-10"
          style={{ background:"linear-gradient(to bottom,rgba(0,0,0,0.48) 0%,rgba(0,0,0,0.22) 50%,rgba(0,0,0,0.70) 100%)" }}
        />

        {/* Navbar sits inside hero (transparent) */}
        <div className="relative z-30">
          <Navbar />
        </div>

        {/* Hero content */}
        <div className="relative z-20 flex-1 flex items-center justify-center px-5 min-h-0 pb-16">
          <div className="max-w-3xl w-full text-center">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-white/25 backdrop-blur-sm"
              style={{
                background:"rgba(255,255,255,0.12)",
                opacity: animated?1:0,
                transform: animated?"translateY(0)":"translateY(-14px)",
                transition:"opacity 0.55s ease,transform 0.55s ease",
              }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{background:"#f4b89a"}}/>
              <span className="text-xs font-semibold tracking-widest uppercase text-white/90">
                AI Travel Planner for Morocco
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-sans text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-5 drop-shadow-2xl"
              style={{
                opacity: animated?1:0,
                transform: animated?"translateY(0)":"translateY(22px)",
                transition:"opacity 0.65s ease 0.1s,transform 0.65s ease 0.1s",
              }}>
              Plan Your Trip to<br/>
              <span className="italic" style={{color:"#f4b89a"}}>Morocco with AI.</span>
            </h1>

            {/* Sub */}
            <p className="text-white/65 text-base md:text-lg font-light mb-8 max-w-xl mx-auto leading-relaxed"
              style={{
                opacity: animated?1:0,
                transform: animated?"translateY(0)":"translateY(14px)",
                transition:"opacity 0.7s ease 0.22s,transform 0.7s ease 0.22s",
              }}>
              Describe your ideal Moroccan adventure. SmartTrip's AI builds a complete day-by-day itinerary — hotels, transport, food, and budget breakdown. Instantly.
            </p>

            {/* CTAs */}
            <div className="flex items-center justify-center gap-4 flex-wrap"
              style={{
                opacity: animated?1:0,
                transform: animated?"translateY(0)":"translateY(14px)",
                transition:"opacity 0.7s ease 0.38s,transform 0.7s ease 0.38s",
              }}>
              {/* Dynamic primary CTA */}
              <button onClick={handleCTA}
                className="px-7 py-3.5 font-semibold text-sm rounded-full text-white transition-all hover:-translate-y-0.5 active:scale-[0.97]"
                style={{ background:`linear-gradient(135deg,#8b3a22,${T.coral})`, boxShadow:`0 6px 24px ${T.glow}` }}
                onMouseEnter={e=>e.currentTarget.style.background=`linear-gradient(135deg,#7a3120,${T.coralHover})`}
                onMouseLeave={e=>e.currentTarget.style.background=`linear-gradient(135deg,#8b3a22,${T.coral})`}>
                {ctaLabel}
              </button>

              <button
                onClick={() => document.getElementById("cities-section")?.scrollIntoView({behavior:"smooth"})}
                className="px-7 py-3.5 border border-white/30 text-white/80 font-semibold text-sm rounded-full transition-all hover:-translate-y-0.5 backdrop-blur-sm"
                style={{background:"rgba(255,255,255,0.08)"}}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor="rgba(244,184,154,0.55)"; e.currentTarget.style.color="#f4b89a"; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor="rgba(255,255,255,0.30)"; e.currentTarget.style.color="rgba(255,255,255,0.80)"; }}>
                Explore Destinations ↓
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-10 mt-10 pt-8 border-t border-white/15"
              style={{ opacity:animated?1:0, transition:"opacity 0.7s ease 0.55s" }}>
              {[["12K+","Trips Planned"],["6","Moroccan Cities"],["98%","Satisfaction"],["<30s","Plan Generated"]].map(([v,l])=>(
                <div key={l} className="text-center">
                  <p className="text-xl font-bold text-white">{v}</p>
                  <p className="text-[10px] text-white/45 uppercase tracking-wider mt-0.5">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1"
          style={{opacity:animated?0.45:0,transition:"opacity 0.7s ease 0.8s"}}>
          <span className="text-[10px] text-white/55 uppercase tracking-widest">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/35 to-transparent animate-bounce"/>
        </div>
      </div>

      {/* ════ FEATURES (white) ════ */}
      <section id="features-section" className="py-20 px-4 md:px-8" style={{background:T.white}}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{color:T.coral}}>
              Why SmartTrip
            </p>
            <h2 className="font-sans text-3xl md:text-4xl font-extrabold mb-3" style={{color:T.text}}>
              Everything you need to travel smarter
            </h2>
            <p className="text-sm font-light max-w-lg mx-auto" style={{color:T.muted}}>
              AI that understands Morocco — from ancient medinas to Atlantic coastlines.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div key={f.title}
                className="group p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 cursor-default"
                style={{ border:`1px solid ${T.border}`, background:T.bg }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor=T.coral; e.currentTarget.style.boxShadow=`0 4px 20px ${T.glow}`; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor=T.border; e.currentTarget.style.boxShadow="none"; }}>
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="text-sm font-bold mb-1.5" style={{color:T.text}}>{f.title}</h3>
                <p className="text-xs leading-relaxed font-light" style={{color:T.muted}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ CITIES (grey) ════ */}
      <section id="cities-section" ref={citiesRef} className="py-20 px-4 md:px-8" style={{background:T.bg}}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{color:T.coral}}>
              6 Destinations
            </p>
            <h2 className="font-sans text-3xl md:text-4xl font-extrabold mb-3" style={{color:T.text}}>
              Where do you want to go?
            </h2>
            <p className="text-sm font-light" style={{color:T.muted}}>
              Click on a city and start planning your Moroccan adventure
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {CITIES.map((city, i) => (
              <button key={i} onClick={handleCTA}
                className="group relative h-52 rounded-2xl overflow-hidden text-left transition-all duration-300 hover:-translate-y-1"
                style={{
                  opacity:    showCities?1:0,
                  transform:  showCities?"translateY(0)":"translateY(28px)",
                  transition: `opacity 0.5s ease ${i*0.07}s, transform 0.55s cubic-bezier(0.34,1.56,0.64,1) ${i*0.07}s, translate 0.3s ease`,
                  border:`1px solid ${T.border}`,
                  boxShadow:"0 2px 10px rgba(28,25,23,0.07)",
                }}>
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage:`url('${city.img}')`, backgroundSize:"cover", backgroundPosition:"center" }}/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent"/>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  style={{background:"rgba(218,119,86,0.14)"}}/>
                <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 opacity-0 group-hover:opacity-40 transition-all duration-400 rounded-bl-2xl"
                  style={{borderColor:T.coral}}/>
                <div className="absolute inset-0 flex flex-col justify-end p-5 z-10">
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{color:"#f4b89a"}}>{city.tag}</p>
                  <h3 className="font-sans text-lg font-extrabold text-white">{city.name}</h3>
                  <div className="flex items-center gap-1 mt-2 text-[11px] font-semibold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300" style={{color:"#f4b89a"}}>
                    Plan this trip
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ════ CTA BAND (white) ════ */}
      <section className="py-20 px-4 text-center border-t" style={{background:T.white, borderColor:T.border}}>
        <h2 className="font-sans text-3xl md:text-4xl font-extrabold mb-4" style={{color:T.text}}>
          Ready to explore Morocco?
        </h2>
        <p className="text-sm font-light mb-8 max-w-md mx-auto" style={{color:T.muted}}>
          Join thousands of travelers who use SmartTrip to turn their Moroccan dreams into perfectly planned realities.
        </p>
        <button onClick={handleCTA}
          className="px-8 py-4 font-semibold text-sm rounded-full text-white transition-all hover:-translate-y-0.5 active:scale-[0.97]"
          style={{background:`linear-gradient(135deg,#8b3a22,${T.coral})`, boxShadow:`0 6px 24px ${T.glow}`}}>
          {ctaLabel}
        </button>
      </section>

      {/* ════ FOOTER ════ */}
      <footer className="border-t py-10 px-4 md:px-8" style={{background:T.bg,borderColor:T.border}}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
              <polygon points="16,2 6,12 2,12 8,22 2,22 10,30 22,30 30,22 24,22 30,12 26,12"
                fill={T.coral} fillOpacity=".18" stroke={T.coral} strokeWidth="2" strokeLinejoin="round"/>
              <circle cx="16" cy="16" r="3.5" fill={T.coral}/>
            </svg>
            <span className="font-serif font-bold text-base" style={{color:T.text}}>
              Smart<span style={{color:T.coral}}>Trip</span>
            </span>
          </div>
          <p className="text-xs text-center" style={{color:T.muted}}>
            © 2024 SmartTrip · AI-powered travel planning for Morocco · All rights reserved.
          </p>
          <div className="flex gap-5">
            {["Privacy","Terms","Contact"].map(l=>(
              <a key={l} href="#" className="text-xs transition-colors" style={{color:T.muted}}
                onMouseEnter={e=>e.currentTarget.style.color=T.coral}
                onMouseLeave={e=>e.currentTarget.style.color=T.muted}>
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>

      <style>{`
        html { scroll-behavior:smooth; }
        * { -webkit-font-smoothing:antialiased; }
        ::-webkit-scrollbar { width:6px; }
        ::-webkit-scrollbar-track { background:#F6F5F2; }
        ::-webkit-scrollbar-thumb { background:rgba(218,119,86,0.28); border-radius:99px; }
      `}</style>
    </div>
  );
};

export default Landing;