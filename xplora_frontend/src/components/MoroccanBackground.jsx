// src/components/MoroccanBackground.jsx
// ─────────────────────────────────────────────────────────────
// Reusable background component with:
//  • Cross-fade transition between cities
//  • Gradient overlay for text readability
//  • City indicator badge (bottom-left)
//  • Navigation dots (bottom-center)
//  • Arrow controls (optional)
// ─────────────────────────────────────────────────────────────

import { useMoroccanBackground } from "../hooks/useMoroccanBackground";
import { CITY_KEYS } from "../constants/moroccanCities";

// ── Green accent ──────────────────────────────────────────────
const GREEN = "#3A7D44";

/**
 * @param {object}  props
 * @param {string}  props.cityProp     - Force a city key
 * @param {boolean} props.autoRotate   - Enable auto-rotation
 * @param {number}  props.interval     - Rotation interval ms
 * @param {boolean} props.showControls - Show prev/next arrows
 * @param {boolean} props.showDots     - Show city dots
 * @param {boolean} props.showBadge    - Show city badge
 * @param {node}    props.children     - Content rendered on top
 */
const MoroccanBackground = ({
  cityProp     = null,
  autoRotate   = false,
  interval     = 7000,
  showControls = false,
  showDots     = true,
  showBadge    = true,
  children,
}) => {
  const { city, currentKey, currentIndex, fading, loaded, next, prev, switchTo } =
    useMoroccanBackground({ cityProp, autoRotate, interval });

  return (
    <div className="relative w-full h-full overflow-hidden">

      {/* ── Background image layer ── */}
      <div
        className="absolute inset-0 z-0 transition-opacity duration-700"
        style={{
          backgroundImage:    `url(${city.url})`,
          backgroundSize:     "cover",
          backgroundPosition: city.position,
          opacity:            loaded && !fading ? 1 : 0,
        }}
      />

      {/* ── Skeleton while loading ── */}
      {!loaded && (
        <div
          className="absolute inset-0 z-0 animate-pulse"
          style={{ background: "linear-gradient(135deg,#0d1f10,#1a3820)" }}
        />
      )}

      {/* ── Gradient overlay (keeps text readable) ── */}
      {/*
        Two-layer overlay strategy:
        1. Base dark layer — universal readability
        2. Bottom-to-top gradient — protects bottom UI elements
        Adjust opacity values to taste.
      */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background: `
            linear-gradient(
              to bottom,
              rgba(0,0,0,0.38) 0%,
              rgba(0,0,0,0.22) 40%,
              rgba(0,0,0,0.55) 75%,
              rgba(0,0,0,0.72) 100%
            )
          `,
        }}
      />

      {/* ── City badge — bottom left ── */}
      {showBadge && loaded && (
        <div
          className="absolute bottom-5 left-5 z-30 flex items-center gap-2.5 px-3.5 py-2 rounded-full transition-all duration-500"
          style={{
            background:  "rgba(0,0,0,0.45)",
            backdropFilter: "blur(10px)",
            border:      `1px solid rgba(255,255,255,0.15)`,
          }}
        >
          <span className="text-base leading-none">{city.emoji}</span>
          <div>
            <p className="text-white text-xs font-bold leading-none">{city.name}</p>
            <p className="text-white/45 text-[10px] mt-0.5">{city.landmark}</p>
          </div>
          <span
            className="text-[10px] font-medium px-2 py-0.5 rounded-full ml-1"
            style={{ background: `${GREEN}25`, color: GREEN, border: `1px solid ${GREEN}40` }}
          >
            {city.arabicName}
          </span>
        </div>
      )}

      {/* ── Navigation dots — bottom center ── */}
      {showDots && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5">
          {CITY_KEYS.map((key, i) => (
            <button
              key={key}
              onClick={() => switchTo(key)}
              title={key}
              className="transition-all duration-300 rounded-full"
              style={{
                width:      currentIndex === i ? 20 : 7,
                height:     7,
                background: currentIndex === i ? GREEN : "rgba(255,255,255,0.35)",
                border:     "none",
                padding:    0,
                cursor:     "pointer",
              }}
            />
          ))}
        </div>
      )}

      {/* ── Arrow controls ── */}
      {showControls && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ background: "rgba(0,0,0,0.40)", border: "1px solid rgba(255,255,255,0.20)" }}
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ background: "rgba(0,0,0,0.40)", border: "1px solid rgba(255,255,255,0.20)" }}
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* ── Content slot ── */}
      <div className="relative z-20 w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default MoroccanBackground;