// src/pages/NotFound.jsx
import { useNavigate } from "react-router-dom";

const G = {
  primary:     "#da7756",
  bright:      "#e8956d",
  deep:        "#8b3a22",
  glow:        "rgba(218,119,86,0.25)",
  badge:       "rgba(218,119,86,0.12)",
  badgeBorder: "rgba(218,119,86,0.35)",
};

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen w-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1554978991-e9d0f4eb7f17?w=1920&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center 40%",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0" style={{ background:"linear-gradient(to bottom,rgba(4,10,7,0.60),rgba(4,10,7,0.50),rgba(4,10,7,0.85))" }}/>

      {/* Card */}
      <div
        className="relative z-10 rounded-2xl px-10 py-12 max-w-md w-full text-center"
        style={{
          background:    "linear-gradient(160deg,rgba(12,28,20,0.92) 0%,rgba(8,16,12,0.94) 100%)",
          backdropFilter:"blur(20px)",
          border:        "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Top shimmer */}
        <div className="h-px mb-8 rounded-full mx-4" style={{ background:`linear-gradient(to right,transparent,${G.primary},transparent)` }}/>

        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border"
          style={{ border:`1px solid ${G.badgeBorder}`, background:G.badge }}
        >
          <span className="text-xs font-semibold tracking-widest uppercase" style={{ color:G.bright }}>
            Page Introuvable
          </span>
        </div>

        {/* 404 */}
        <h1 className="font-serif text-8xl font-black mb-2 drop-shadow-lg" style={{ color:G.primary }}>
          404
        </h1>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white mb-3">
          Perdu dans le Désert
        </h2>

        {/* Message */}
        <p className="text-white/50 text-sm mb-8 leading-relaxed font-light">
          Cette destination n'existe pas sur notre carte. La page que vous cherchez a peut-être été déplacée ou n'a jamais existé.
        </p>

        {/* Divider */}
        <div className="h-px mb-8 mx-8" style={{ background:`${G.badgeBorder}50` }}/>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2.5 font-semibold text-sm rounded-full transition-all hover:-translate-y-0.5 active:scale-[0.97] text-white"
            style={{
              background: `linear-gradient(135deg,${G.deep},${G.primary})`,
              boxShadow:  `0 4px 18px ${G.glow}`,
            }}
          >
            Retour à l'Accueil
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 font-semibold text-sm rounded-full transition-all hover:-translate-y-0.5 active:scale-[0.97] border border-white/15 text-white/70 hover:text-white hover:border-white/30"
            style={{ background:"rgba(255,255,255,0.05)" }}
          >
            Page Précédente
          </button>
        </div>

        {/* Tagline */}
        <p className="mt-8 text-white/25 text-xs italic font-light">
          Morocco, Smartly Reimagined.
        </p>
      </div>
    </div>
  );
};

export default NotFound;