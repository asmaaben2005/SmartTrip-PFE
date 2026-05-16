// src/components/TripForm/Step1.jsx
// White cold theme — English — coral accent
import useTranslate from "../../hooks/useTranslate";

const T = {
  coral:       "#DA7756",
  coralHover:  "#C9623D",
  coralLight:  "rgba(218,119,86,0.08)",
  coralBorder: "rgba(218,119,86,0.40)",
  border:      "#E7E5E0",
  borderFocus: "#DA7756",
  text:        "#1C1917",
  muted:       "#A8A29E",
  bg:          "#FFFFFF",
  inputBg:     "#FAFAF9",
  error:       "rgba(239,68,68,0.10)",
  errorBorder: "rgba(239,68,68,0.50)",
};

const isValidPlace = (val) =>
  val.trim().length >= 2 && /^[a-zA-ZÀ-ÿ\s,.\-']+$/.test(val.trim());

// ── Input ─────────────────────────────────────────────────────
const Field = ({ label, placeholder, value, onChange, invalid, errorMsg }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] font-bold tracking-widest uppercase" style={{ color:T.muted }}>
      {label}
    </label>
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200"
      style={{
        background:  invalid ? T.error    : T.inputBg,
        border:      `1.5px solid ${invalid ? T.errorBorder : T.border}`,
        color:       T.text,
      }}
      onFocus={e => { if (!invalid) e.currentTarget.style.borderColor = T.coralBorder; e.currentTarget.style.background = "#FFFFFF"; }}
      onBlur={e  => { if (!invalid) e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = T.inputBg; }}
    />
    {invalid && (
      <p className="text-xs text-red-500 flex items-center gap-1.5 mt-0.5">
        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
        {errorMsg}
      </p>
    )}
  </div>
);

const Step1 = ({ formData, updateForm, onNext }) => {
  const today = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  })();

  const maxDate = (() => {
    const d = new Date();
    d.setMonth(d.getMonth()+1);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  })();

  const [
    title, sub,
    fromLabel, fromPlaceholder,
    destLabel, destPlaceholder,
    startLabel, endLabel,
    nextBtn, invalidErr,
  ] = useTranslate([
    "Where do you want to go?",
    "Step 1 of 3 — Where & When",
    "Travelling From",
    "e.g. Casablanca, Rabat, Agadir...",
    "Destination",
    "e.g. Marrakech, Fès, Chefchaouen...",
    "Departure Date",
    "Return Date",
    "Continue",
    "Letters only — no numbers or symbols.",
  ]);

  const fromTouched = (formData.from?.length || 0) > 0;
  const destTouched = (formData.destination?.length || 0) > 0;
  const fromInvalid = fromTouched && !isValidPlace(formData.from);
  const destInvalid = destTouched && !isValidPlace(formData.destination);

  const isValid =
    formData.from && formData.destination &&
    isValidPlace(formData.from) && isValidPlace(formData.destination) &&
    formData.startDate && formData.endDate;

  const sanitize = (v) => v.replace(/[0-9!@#$%^&*()_+=[\]{};:"\\|<>?/]/g,"");

  return (
    <div>
      {/* Header */}
      <div className="mb-7">
        <span className="inline-block text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full mb-2"
          style={{ background:T.coralLight, color:T.coral }}>
          {sub}
        </span>
        <h2 className="font-serif text-2xl md:text-3xl font-black" style={{ color:T.text }}>
          {title}
        </h2>
      </div>

      <div className="flex flex-col gap-5">
        <Field label={fromLabel} placeholder={fromPlaceholder}
          value={formData.from || ""} invalid={fromInvalid} errorMsg={invalidErr}
          onChange={e => updateForm({ from: sanitize(e.target.value) })}
        />
        <Field label={destLabel} placeholder={destPlaceholder}
          value={formData.destination || ""} invalid={destInvalid} errorMsg={invalidErr}
          onChange={e => updateForm({ destination: sanitize(e.target.value) })}
        />

        {/* Date row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label:startLabel, field:"startDate", min:today, max:maxDate },
            { label:endLabel,   field:"endDate",   min:formData.startDate||today, max:maxDate },
          ].map(({ label, field, min, max }) => (
            <div key={field} className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold tracking-widest uppercase" style={{ color:T.muted }}>{label}</label>
              <input type="date" min={min} max={max}
                value={formData[field] || ""}
                onChange={e => updateForm({ [field]:e.target.value })}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200"
                style={{ background:T.inputBg, border:`1.5px solid ${T.border}`, color:T.text, colorScheme:"light" }}
                onFocus={e => { e.currentTarget.style.borderColor=T.coralBorder; e.currentTarget.style.background="#FFFFFF"; }}
                onBlur={e  => { e.currentTarget.style.borderColor=T.border; e.currentTarget.style.background=T.inputBg; }}
              />
            </div>
          ))}
        </div>
      </div>

      <button onClick={onNext} disabled={!isValid}
        className="mt-8 w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-35 disabled:cursor-not-allowed disabled:transform-none"
        style={{ background:isValid ? `linear-gradient(135deg,#8b3a22,${T.coral})` : "#D6D3CE", boxShadow:isValid?`0 4px 18px rgba(218,119,86,0.30)`:"none" }}
        onMouseEnter={e=>{ if(isValid) e.currentTarget.style.background=`linear-gradient(135deg,#7a3120,${T.coralHover})`; }}
        onMouseLeave={e=>{ if(isValid) e.currentTarget.style.background=`linear-gradient(135deg,#8b3a22,${T.coral})`; }}
      >
        {nextBtn} →
      </button>
    </div>
  );
};

export default Step1;