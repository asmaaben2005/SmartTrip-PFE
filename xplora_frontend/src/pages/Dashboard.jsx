// src/pages/Dashboard.jsx
// ─────────────────────────────────────────────────────────────
// 3-column professional workspace:
//  Left  → City cards with images + seasonal info
//  Center → TripForm step wizard
//  Right  → AI Chat Sidebar
// All text in English. Cold white + coral theme.
// ─────────────────────────────────────────────────────────────
import Navbar   from "../components/Navbar";
import TripForm from "../components/TripForm/TripForm";
import Sidebar  from "../components/Sidebar";

// ── Design tokens ─────────────────────────────────────────────
const T = {
  bg:          "#F6F5F2",
  white:       "#FFFFFF",
  border:      "#E7E5E0",
  text:        "#1C1917",
  muted:       "#A8A29E",
  coral:       "#DA7756",
  coralLight:  "rgba(218,119,86,0.08)",
  coralBorder: "rgba(218,119,86,0.25)",
};

// ── 6 Moroccan cities (no Ouarzazate) ────────────────────────
const CITIES = [
  {
    name: "Marrakech",
    tag:  "Medina · Palaces",
    temp: "28°C",
    img:  "https://images.unsplash.com/photo-1618423205267-e95744f57edf?w=400&q=80",
  },
  {
    name: "Casablanca",
    tag:  "Metropolis",
    temp: "22°C",
    img:  "https://images.unsplash.com/photo-1699210260021-eac11ba4ff86?w=400&q=80",
  },
  {
    name: "Chefchaouen",
    tag:  "Blue City",
    temp: "18°C",
    img:  "https://images.unsplash.com/flagged/photo-1555169048-3c4845cfcf1c?w=400&q=80",
  },
  {
    name: "Fès",
    tag:  "Heritage · Crafts",
    temp: "24°C",
    img:  "https://images.unsplash.com/photo-1557503799-fac6a98054b3?w=400&q=80",
  },
  {
    name: "Agadir",
    tag:  "Atlantic Beach",
    temp: "26°C",
    img:  "https://images.unsplash.com/photo-1538053367502-742497073841?w=400&q=80",
  },
  {
    name: "Rabat",
    tag:  "Royal Capital",
    temp: "21°C",
    img:  "https://images.unsplash.com/photo-1597081315272-a8b558ca4e86?w=400&q=80",
  },
];

// ── City card with image ──────────────────────────────────────
const CityCard = ({ city }) => (
  <div
    className="group relative h-[68px] rounded-xl overflow-hidden cursor-default transition-all duration-300 hover:-translate-y-px"
    style={{ border:`1px solid ${T.border}`, boxShadow:"0 1px 4px rgba(28,25,23,0.06)" }}
  >
    {/* Background image */}
    <div
      className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
      style={{
        backgroundImage:    `url('${city.img}')`,
        backgroundSize:     "cover",
        backgroundPosition: "center",
      }}
    />
    {/* Gradient overlay for text legibility */}
    <div
      className="absolute inset-0"
      style={{ background:"linear-gradient(90deg,rgba(0,0,0,0.60) 0%,rgba(0,0,0,0.20) 100%)" }}
    />
    {/* Coral glow on hover */}
    <div
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      style={{ background:"rgba(218,119,86,0.16)" }}
    />
    {/* Text */}
    <div className="absolute inset-0 flex items-center justify-between px-3 z-10">
      <div>
        <p className="text-white text-[13px] font-bold leading-tight">{city.name}</p>
        <p className="text-[10px] font-semibold mt-0.5" style={{ color:"rgba(244,184,154,0.92)" }}>
          {city.tag}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="text-[11px] font-medium text-white/80">{city.temp}</span>
        <svg
          className="w-3.5 h-3.5 text-white opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </div>
    </div>
  </div>
);

// ── Stat pill ─────────────────────────────────────────────────
const StatPill = ({ value, label }) => (
  <div
    className="rounded-xl px-3 py-3 text-center border"
    style={{ background:T.bg, borderColor:T.border }}
  >
    <p className="font-serif font-bold text-lg" style={{ color:T.coral }}>{value}</p>
    <p className="text-[10px] font-medium mt-0.5" style={{ color:T.muted }}>{label}</p>
  </div>
);

// ── Left sidebar ──────────────────────────────────────────────
const LeftSidebar = () => (
  <aside
    className="hidden xl:flex w-[270px] shrink-0 flex-col gap-5 px-4 py-6 overflow-y-auto border-r"
    style={{ background:T.white, borderColor:T.border }}
  >
    {/* Section: Trending */}
    <div>
      <p className="text-[10px] font-bold tracking-widest uppercase px-1 mb-3" style={{ color:T.muted }}>
        Trending Destinations
      </p>
      <div className="flex flex-col gap-2">
        {CITIES.map((city) => <CityCard key={city.name} city={city} />)}
      </div>
    </div>

    {/* Section: Pro Tip */}
    <div
      className="rounded-xl p-4 border"
      style={{ background:T.coralLight, borderColor:T.coralBorder }}
    >
      <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color:T.coral }}>
        ✦ Pro Tip
      </p>
      <p className="text-xs leading-relaxed" style={{ color:"#57534E" }}>
        Book your riad in Marrakech at least 4 weeks ahead to secure the best rates and private rooms.
      </p>
    </div>

    {/* Section: Platform Stats */}
    <div>
      <p className="text-[10px] font-bold tracking-widest uppercase px-1 mb-3" style={{ color:T.muted }}>
        Platform Stats
      </p>
      <div className="grid grid-cols-2 gap-2">
        <StatPill value="12K+" label="Trips Created"   />
        <StatPill value="6"    label="Moroccan Cities" />
        <StatPill value="98%"  label="Satisfaction"    />
        <StatPill value="<30s" label="Plan Generated"  />
      </div>
    </div>

    {/* Section: Best Seasons */}
    <div>
      <p className="text-[10px] font-bold tracking-widest uppercase px-1 mb-3" style={{ color:T.muted }}>
        Best Travel Seasons
      </p>
      <div className="flex flex-col gap-2.5">
        {[
          { region:"Marrakech & Fès",  months:"Mar – May", dot:T.coral    },
          { region:"Atlantic Coast",   months:"Jun – Sep", dot:"#e8956d"  },
          { region:"Atlas & Rif",      months:"Apr – Oct", dot:"#60a5fa"  },
          { region:"Southern Desert",  months:"Oct – Feb", dot:"#fbbf24"  },
        ].map((s) => (
          <div key={s.region} className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background:s.dot }} />
            <p className="text-xs flex-1 truncate" style={{ color:"#57534E" }}>{s.region}</p>
            <p className="text-[10px]" style={{ color:T.muted }}>{s.months}</p>
          </div>
        ))}
      </div>
    </div>
  </aside>
);

// ── Right sidebar wrapper ─────────────────────────────────────
const RightSidebar = () => (
  <aside
    className="w-[300px] shrink-0 hidden md:flex flex-col overflow-hidden border-l"
    style={{ background:T.white, borderColor:T.border }}
  >
    <Sidebar />
  </aside>
);

// ── Dashboard ─────────────────────────────────────────────────
const Dashboard = () => (
  <div className="min-h-screen flex flex-col" style={{ background:T.bg }}>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Outfit:wght@300;400;500;600&display=swap');
      * { -webkit-font-smoothing:antialiased; }
      @media(min-width:768px){ .dash-layout{ height:calc(100vh - 60px)!important; } }
      .left-scroll::-webkit-scrollbar       { width:3px; }
      .left-scroll::-webkit-scrollbar-track { background:transparent; }
      .left-scroll::-webkit-scrollbar-thumb { background:rgba(218,119,86,0.22); border-radius:99px; }
      .center-scroll::-webkit-scrollbar       { width:4px; }
      .center-scroll::-webkit-scrollbar-track { background:transparent; }
      .center-scroll::-webkit-scrollbar-thumb { background:#D6D3CE; border-radius:99px; }
    `}</style>

    <Navbar />

    <div
      className="dash-layout flex flex-1 w-full overflow-hidden"
      style={{ height:"calc(100vh - 60px)" }}
    >
      {/* Left */}
      <aside
        className="hidden xl:flex w-[270px] shrink-0 flex-col gap-5 px-4 py-6 overflow-y-auto border-r left-scroll"
        style={{ background:T.white, borderColor:T.border }}
      >
        {/* Trending Destinations */}
        <div>
          <p className="text-[10px] font-bold tracking-widest uppercase px-1 mb-3" style={{ color:T.muted }}>
            Trending Destinations
          </p>
          <div className="flex flex-col gap-2">
            {CITIES.map((city) => <CityCard key={city.name} city={city} />)}
          </div>
        </div>

        {/* Pro Tip */}
        <div className="rounded-xl p-4 border" style={{ background:T.coralLight, borderColor:T.coralBorder }}>
          <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color:T.coral }}>
            ✦ Pro Tip
          </p>
          <p className="text-xs leading-relaxed" style={{ color:"#57534E" }}>
            Book your riad in Marrakech at least 4 weeks ahead to secure the best rates.
          </p>
        </div>

        {/* Stats */}
        <div>
          <p className="text-[10px] font-bold tracking-widest uppercase px-1 mb-3" style={{ color:T.muted }}>
            Platform Stats
          </p>
          <div className="grid grid-cols-2 gap-2">
            <StatPill value="12K+" label="Trips Created"   />
            <StatPill value="6"    label="Moroccan Cities" />
            <StatPill value="98%"  label="Satisfaction"    />
            <StatPill value="<30s" label="Plan Generated"  />
          </div>
        </div>

        {/* Seasons */}
        <div>
          <p className="text-[10px] font-bold tracking-widest uppercase px-1 mb-3" style={{ color:T.muted }}>
            Best Travel Seasons
          </p>
          <div className="flex flex-col gap-2.5">
            {[
              { region:"Marrakech & Fès",  months:"Mar – May", dot:T.coral   },
              { region:"Atlantic Coast",   months:"Jun – Sep", dot:"#e8956d" },
              { region:"Atlas & Rif",      months:"Apr – Oct", dot:"#60a5fa" },
              { region:"Southern Desert",  months:"Oct – Feb", dot:"#fbbf24" },
            ].map((s) => (
              <div key={s.region} className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background:s.dot }} />
                <p className="text-xs flex-1 truncate" style={{ color:"#57534E" }}>{s.region}</p>
                <p className="text-[10px]" style={{ color:T.muted }}>{s.months}</p>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Center: Trip planner form */}
      <main
        className="flex-1 overflow-y-auto center-scroll p-4 md:p-6 lg:p-8 pb-24 md:pb-8 flex items-start justify-center"
        style={{ background:T.bg }}
      >
        <TripForm />
      </main>

      {/* Right: AI Sidebar */}
      <aside
        className="w-[300px] shrink-0 hidden md:flex flex-col overflow-hidden border-l"
        style={{ background:T.white, borderColor:T.border }}
      >
        <Sidebar />
      </aside>
    </div>

    {/* Mobile: Sidebar floating */}
    <div className="md:hidden">
      <Sidebar />
    </div>
  </div>
);

export default Dashboard;