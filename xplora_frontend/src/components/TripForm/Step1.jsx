// src/components/TripForm/Step1.jsx
import useTranslate from "../../hooks/useTranslate";

const isValidPlace = (val) =>
  val.trim().length >= 2 && /^[a-zA-ZÀ-ÿ\s,.\-']+$/.test(val.trim());

const G = {
  primary:     "#da7756",
  bright:      "#e8956d",
  badgeBorder: "rgba(218,119,86,0.35)",
  badge:       "rgba(218,119,86,0.12)",
};

const InputField = ({ label, placeholder, value, onChange, invalid, errorMsg }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-bold tracking-widest text-white/30 uppercase">
      {label}
    </label>
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full rounded-xl px-4 py-3 min-h-12 text-sm text-white/85 placeholder-white/20 focus:outline-none transition-all duration-200 border ${
        invalid
          ? "border-red-500/40 bg-red-500/5 focus:border-red-500/60"
          : "border-white/10 bg-white/5 focus:bg-white/8"
      }`}
      style={ invalid ? {} : { "--tw-border-opacity":1 }}
      onFocus={e=>{ if(!invalid) e.currentTarget.style.borderColor=G.badgeBorder; }}
      onBlur={e=>{ if(!invalid) e.currentTarget.style.borderColor="rgba(255,255,255,0.10)"; }}
    />
    {invalid && (
      <p className="text-xs text-red-400 flex items-center gap-1.5">
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
    nextBtn, invalidPlaceError,
  ] = useTranslate([
    "Où voulez-vous aller ?",
    "Étape 1 sur 3 — Où & Quand",
    "Départ depuis",
    "ex. Casablanca, Rabat, Agadir...",
    "Destination",
    "ex. Marrakech, Fès, Chefchaouen...",
    "Date de départ",
    "Date de retour",
    "Continuer",
    "Lettres uniquement — pas de chiffres ou symboles.",
  ]);

  const fromTouched = formData.from?.length > 0;
  const destTouched = formData.destination?.length > 0;
  const fromInvalid = fromTouched && !isValidPlace(formData.from);
  const destInvalid = destTouched && !isValidPlace(formData.destination);

  const isValid =
    formData.from && formData.destination &&
    isValidPlace(formData.from) && isValidPlace(formData.destination) &&
    formData.startDate && formData.endDate;

  return (
    <div>
      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color:G.primary }}>{sub}</p>
        <h2 className="font-serif text-xl md:text-2xl font-black text-white">{title}</h2>
      </div>

      <div className="flex flex-col gap-4 md:gap-5">
        <InputField
          label={fromLabel} placeholder={fromPlaceholder}
          value={formData.from || ""} invalid={fromInvalid} errorMsg={invalidPlaceError}
          onChange={e => updateForm({ from: e.target.value.replace(/[0-9!@#$%^&*()_+=[\]{};:"\\|<>?/]/g,"") })}
        />
        <InputField
          label={destLabel} placeholder={destPlaceholder}
          value={formData.destination} invalid={destInvalid} errorMsg={invalidPlaceError}
          onChange={e => updateForm({ destination: e.target.value.replace(/[0-9!@#$%^&*()_+=[\]{};:"\\|<>?/]/g,"") })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          {[
            { label:startLabel, field:"startDate", min:today, max:maxDate },
            { label:endLabel,   field:"endDate",   min:formData.startDate||today, max:maxDate },
          ].map(({ label, field, min, max }) => (
            <div key={field} className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-widest text-white/30 uppercase">{label}</label>
              <input
                type="date" min={min} max={max}
                value={formData[field]}
                onChange={e => updateForm({ [field]:e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 min-h-12 text-sm text-white/85 focus:outline-none transition-all duration-200"
                style={{ colorScheme:"dark" }}
                onFocus={e=>e.currentTarget.style.borderColor=G.badgeBorder}
                onBlur={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.10)"}
              />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!isValid}
        className="mt-7 md:mt-8 w-full py-3.5 min-h-13 rounded-xl font-bold text-sm text-white transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
        style={{
          background: isValid ? `linear-gradient(135deg,${G.deep||"#8b3a22"},${G.primary})` : undefined,
          boxShadow:  isValid ? `0 6px 20px rgba(218,119,86,0.25)` : undefined,
        }}
      >
        {nextBtn} →
      </button>
    </div>
  );
};

export default Step1;