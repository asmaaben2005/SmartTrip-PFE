// src/pages/Dashboard.jsx
// Light blanc froid theme — coral accent — 6 villes marocaines

import Navbar from "../components/Navbar";
import TripForm from "../components/TripForm/TripForm";
import Sidebar from "../components/Sidebar";

const C  = "#DA7756";
const CH = "#C9623D";

/* ── Left panel ─────────────────────────────────────────────── */
const LeftPanel = () => (
  <aside
    className="hidden xl:flex w-72 flex-col gap-6 px-5 py-7 overflow-y-auto border-r"
    style={{ background:"#FFFFFF", borderColor:"#E7E5E0" }}
  >
    {/* Trending cities */}
    <div>
      <p className="text-[10px] font-bold tracking-widest uppercase mb-4" style={{color:"#A8A29E"}}>
        Destinations Tendance
      </p>
      <div className="flex flex-col gap-2">
        {[
          { name:"Marrakech",   tag:"Médina · Palais",  temp:"28°C" },
          { name:"Casablanca",  tag:"Métropole",        temp:"22°C" },
          { name:"Chefchaouen", tag:"Ville Bleue",      temp:"18°C" },
          { name:"Fès",         tag:"Patrimoine",       temp:"24°C" },
          { name:"Agadir",      tag:"Plage Atlantique", temp:"26°C" },
          { name:"Rabat",       tag:"Capitale Royale",  temp:"21°C" },
        ].map((d, i) => (
          <div key={i}
            className="flex items-center justify-between px-3 py-2.5 rounded-xl cursor-default transition-all duration-200 border"
            style={{ background:"#F6F5F2", borderColor:"#E7E5E0" }}
            onMouseEnter={e=>{ e.currentTarget.style.background="rgba(218,119,86,0.06)"; e.currentTarget.style.borderColor="rgba(218,119,86,0.25)"; }}
            onMouseLeave={e=>{ e.currentTarget.style.background="#F6F5F2"; e.currentTarget.style.borderColor="#E7E5E0"; }}
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate" style={{color:"#1C1917"}}>{d.name}</p>
              <p className="text-[10px]" style={{color:C}}>{d.tag}</p>
            </div>
            <span className="text-xs shrink-0 ml-2" style={{color:"#A8A29E"}}>{d.temp}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Pro Tip */}
    <div className="rounded-xl p-4 border"
      style={{ background:"rgba(218,119,86,0.05)", borderColor:"rgba(218,119,86,0.20)" }}>
      <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{color:C}}>✦ Conseil Pro</p>
      <p className="text-xs leading-relaxed" style={{color:"#57534E"}}>
        Réservez vos riads à Marrakech au moins 4 semaines à l'avance pour les meilleurs tarifs.
      </p>
    </div>

    {/* Platform stats */}
    <div>
      <p className="text-[10px] font-bold tracking-widest uppercase mb-4" style={{color:"#A8A29E"}}>
        Statistiques
      </p>
      <div className="grid grid-cols-2 gap-2">
        {[
          { value:"12K+", label:"Voyages Créés" },
          { value:"6",    label:"Villes Maroc"  },
          { value:"98%",  label:"Satisfaction"  },
          { value:"<30s", label:"Plan Généré"   },
        ].map((s, i) => (
          <div key={i} className="rounded-xl px-3 py-3 text-center border"
            style={{ background:"#F6F5F2", borderColor:"#E7E5E0" }}>
            <p className="font-serif font-bold text-lg" style={{color:C}}>{s.value}</p>
            <p className="text-[10px] mt-0.5" style={{color:"#A8A29E"}}>{s.label}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Best seasons */}
    <div>
      <p className="text-[10px] font-bold tracking-widest uppercase mb-4" style={{color:"#A8A29E"}}>
        Meilleures Saisons
      </p>
      <div className="flex flex-col gap-2.5">
        {[
          { region:"Marrakech & Fès", months:"Mars – Mai",  dot:C          },
          { region:"Côte Atlantique", months:"Juin – Sept", dot:"#e8956d"  },
          { region:"Atlas & Rif",     months:"Avr – Oct",   dot:"#60a5fa"  },
          { region:"Désert Sud",      months:"Oct – Fév",   dot:"#fbbf24"  },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full shrink-0" style={{background:item.dot}}/>
            <p className="text-xs flex-1 truncate" style={{color:"#57534E"}}>{item.region}</p>
            <p className="text-[10px]" style={{color:"#A8A29E"}}>{item.months}</p>
          </div>
        ))}
      </div>
    </div>
  </aside>
);

/* ── Dashboard ──────────────────────────────────────────────── */
const Dashboard = () => (
  <div className="min-h-screen" style={{background:"#F6F5F2"}}>

    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=Outfit:wght@300;400;500;600&display=swap');

      /* scrollbars */
      aside::-webkit-scrollbar { width:4px; }
      aside::-webkit-scrollbar-track { background:transparent; }
      aside::-webkit-scrollbar-thumb { background:rgba(218,119,86,0.25); border-radius:99px; }
      .xp-main::-webkit-scrollbar { width:4px; }
      .xp-main::-webkit-scrollbar-track { background:transparent; }
      .xp-main::-webkit-scrollbar-thumb { background:#D6D3CE; border-radius:99px; }

      @media(min-width:768px){ .xp-layout{ height:calc(100vh - 64px)!important; } }
    `}</style>

    <Navbar/>

    <div className="xp-layout flex w-full" style={{height:"calc(100vh - 56px)"}}>

      <LeftPanel/>

      {/* Main form area */}
      <main
        className="xp-main flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pb-24 md:pb-8 flex items-start justify-center"
        style={{background:"#F6F5F2"}}
      >
        <TripForm/>
      </main>

      {/* Sidebar — AI assistant */}
      <aside
        className="w-80 hidden md:flex flex-col overflow-hidden border-l"
        style={{ background:"#FFFFFF", borderColor:"#E7E5E0" }}
      >
        <Sidebar/>
      </aside>
    </div>

    {/* Mobile sidebar */}
    <div className="md:hidden">
      <Sidebar/>
    </div>
  </div>
);

export default Dashboard;