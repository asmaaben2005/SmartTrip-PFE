// src/components/TripForm/Step3.jsx
// White cold theme — English — coral accent
import useTranslate from "../../hooks/useTranslate";

const T = {
  coral:       "#DA7756",
  coralHover:  "#C9623D",
  coralLight:  "rgba(218,119,86,0.08)",
  coralBorder: "rgba(218,119,86,0.40)",
  coralActive: "rgba(218,119,86,0.10)",
  border:      "#E7E5E0",
  text:        "#1C1917",
  muted:       "#A8A29E",
  inputBg:     "#FAFAF9",
};

const Step3 = ({ formData, updateForm, onSubmit, onBack }) => {
  const [
    title, sub, styleLabel,
    standardLabel, standardDesc,
    mediumLabel, mediumDesc,
    lowLabel, lowDesc,
    interestsLabel, interestsSub,
    adventureLabel, foodLabel, cultureLabel, natureLabel, relaxLabel,
    backBtn, generateBtn,
  ] = useTranslate([
    "Your Travel Style",
    "Step 3 of 3 — Style & Interests",
    "Choose your travel style",
    "Comfort",    "Best experience · quality hotels",
    "Balanced",   "Comfort and cost in harmony",
    "Budget",     "Smart picks · lower spend",
    "Any specific interests?", "Select one or more",
    "Adventure", "Food & Drink", "Culture", "Nature", "Relaxation",
    "Back", "Generate My Trip",
  ]);

  const STYLES = [
    {
      value:"standard", label:standardLabel, desc:standardDesc,
      icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>,
    },
    {
      value:"medium", label:mediumLabel, desc:mediumDesc,
      icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/></svg>,
    },
    {
      value:"low", label:lowLabel, desc:lowDesc,
      icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
    },
  ];

  const INTERESTS = [
    { value:"adventure",  label:adventureLabel, emoji:"🧗" },
    { value:"food",       label:foodLabel,       emoji:"🍜" },
    { value:"culture",    label:cultureLabel,    emoji:"🏛️" },
    { value:"nature",     label:natureLabel,     emoji:"🌿" },
    { value:"relaxation", label:relaxLabel,      emoji:"🌅" },
  ];

  const toggleInterest = (val) => {
    const cur = formData.interests || [];
    updateForm({ interests: cur.includes(val) ? cur.filter(i=>i!==val) : [...cur,val] });
  };

  const isValid = formData.travelStyle && (formData.interests||[]).length > 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-7">
        <span className="inline-block text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full mb-2"
          style={{ background:T.coralLight, color:T.coral }}>
          {sub}
        </span>
        <h2 className="font-serif text-2xl md:text-3xl font-black" style={{ color:T.text }}>{title}</h2>
      </div>

      <div className="flex flex-col gap-6">

        {/* Travel style */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold tracking-widest uppercase" style={{ color:T.muted }}>
            {styleLabel}
          </label>
          <div className="flex flex-col gap-2.5">
            {STYLES.map((s) => {
              const active = formData.travelStyle === s.value;
              return (
                <button key={s.value} onClick={() => updateForm({ travelStyle:s.value })}
                  className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl border text-left transition-all duration-200 active:scale-[0.99]"
                  style={{
                    border:     `1.5px solid ${active ? T.coral : T.border}`,
                    background: active ? T.coralActive : T.inputBg,
                    color:      active ? T.coral : T.text,
                  }}>
                  <span className="shrink-0" style={{ color: active ? T.coral : T.muted }}>{s.icon}</span>
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-sm block">{s.label}</span>
                    <span className="text-xs block" style={{ color: active ? `${T.coral}CC` : T.muted }}>{s.desc}</span>
                  </div>
                  {active && (
                    <div className="ml-auto w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ background:T.coral }}>
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interests */}
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline gap-2 flex-wrap">
            <label className="text-[11px] font-bold tracking-widest uppercase" style={{ color:T.muted }}>
              {interestsLabel}
            </label>
            <span className="text-[10px]" style={{ color:T.muted }}>{interestsSub}</span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {INTERESTS.map((interest) => {
              const active = (formData.interests||[]).includes(interest.value);
              return (
                <button key={interest.value} onClick={() => toggleInterest(interest.value)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium border transition-all duration-200 active:scale-95"
                  style={{
                    border:     `1.5px solid ${active ? T.coral : T.border}`,
                    background: active ? T.coralActive : T.inputBg,
                    color:      active ? T.coral : T.muted,
                  }}>
                  <span>{interest.emoji}</span>
                  {interest.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-8">
        <button onClick={onBack}
          className="flex-1 py-3.5 rounded-xl font-semibold text-sm border transition-all hover:bg-stone-50"
          style={{ border:`1.5px solid ${T.border}`, color:T.muted }}>
          ← {backBtn}
        </button>
        <button onClick={onSubmit} disabled={!isValid}
          className="flex-1 py-3.5 rounded-xl font-bold text-sm text-white transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-35 disabled:cursor-not-allowed disabled:transform-none"
          style={{ background:isValid?`linear-gradient(135deg,#8b3a22,${T.coral})`:"#D6D3CE", boxShadow:isValid?`0 4px 18px rgba(218,119,86,0.30)`:"none" }}>
          ✦ {generateBtn}
        </button>
      </div>
    </div>
  );
};

export default Step3;