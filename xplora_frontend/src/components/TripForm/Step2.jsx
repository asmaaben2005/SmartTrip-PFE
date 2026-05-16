// src/components/TripForm/Step2.jsx
// White cold theme — English — coral accent
import useTranslate from "../../hooks/useTranslate";

const T = {
  coral:       "#DA7756",
  coralHover:  "#C9623D",
  coralLight:  "rgba(218,119,86,0.08)",
  coralBorder: "rgba(218,119,86,0.40)",
  coralActive: "rgba(218,119,86,0.12)",
  border:      "#E7E5E0",
  text:        "#1C1917",
  muted:       "#A8A29E",
  inputBg:     "#FAFAF9",
  error:       "rgba(239,68,68,0.08)",
  errorBorder: "rgba(239,68,68,0.45)",
};

const ErrorMsg = ({ text }) => (
  <p className="text-xs text-red-500 flex items-center gap-1.5 mt-1">
    <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
    </svg>
    {text}
  </p>
);

const Step2 = ({ formData, updateForm, onNext, onBack }) => {
  const [
    title, sub,
    peopleLabel, budgetScopeLabel,
    forAllBtn, perPersonBtn,
    budgetLabel, backBtn, nextBtn,
    maxPeopleErr, lowINR, lowUSD,
  ] = useTranslate([
    "Budget Details",
    "Step 2 of 3 — Group & Budget",
    "How many people are travelling?",
    "Budget scope",
    "For Everyone",
    "Per Person",
    "What is your total budget?",
    "Back",
    "Continue",
    "Maximum 35 travellers allowed.",
    "Budget too low. Minimum ₹700 per person required.",
    "Budget too low. Minimum $20 per person required.",
  ]);

  const MIN_INR = 700;
  const MIN_USD = 20;
  const MAX_PEOPLE = 35;

  const raw        = formData.people ?? "";
  const numPeople  = parseInt(raw);
  const peopleValid = !isNaN(numPeople) && numPeople >= 1 && numPeople <= MAX_PEOPLE;
  const peopleTooMany = !isNaN(numPeople) && numPeople > MAX_PEOPLE;

  const minPP = formData.currency === "INR" ? MIN_INR : MIN_USD;
  const perPerson = formData.budgetType === "total"
    ? parseFloat(formData.budget) / numPeople
    : parseFloat(formData.budget);
  const budgetLow = formData.budget && peopleValid && perPerson < minPP;

  const isValid = peopleValid && formData.budget && parseFloat(formData.budget) > 0 && !budgetLow;

  const decrement = () => { if (peopleValid && numPeople > 1) updateForm({ people: String(numPeople-1) }); };
  const increment = () => {
    const base = peopleValid ? numPeople : 0;
    if (base < MAX_PEOPLE) updateForm({ people: String(base+1) });
  };
  const handlePeople = (e) => {
    const v = e.target.value;
    if (v === "") { updateForm({ people:"" }); return; }
    if (!/^\d+$/.test(v)) return;
    updateForm({ people: String(Math.min(parseInt(v), MAX_PEOPLE)) });
  };

  const inputStyle = (err) => ({
    background: err ? T.error    : T.inputBg,
    border:     `1.5px solid ${err ? T.errorBorder : T.border}`,
    color:      T.text,
    outline:    "none",
  });

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

        {/* People stepper */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold tracking-widest uppercase" style={{ color:T.muted }}>
            {peopleLabel}
          </label>
          <div className="flex items-center gap-3">
            {/* Decrement */}
            <button type="button" onClick={decrement}
              disabled={!peopleValid || numPeople <= 1}
              className="w-10 h-10 rounded-xl border flex items-center justify-center transition-all shrink-0"
              style={{ border:`1.5px solid ${T.border}`, background:T.inputBg, color:(!peopleValid||numPeople<=1)?T.muted:T.text }}
              onMouseEnter={e=>{ if(peopleValid&&numPeople>1){ e.currentTarget.style.borderColor=T.coralBorder; e.currentTarget.style.color=T.coral; } }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor=T.border; e.currentTarget.style.color=(!peopleValid||numPeople<=1)?T.muted:T.text; }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4"/>
              </svg>
            </button>

            {/* Number input */}
            <input type="text" inputMode="numeric"
              value={raw} onChange={handlePeople} placeholder="e.g. 2"
              className="flex-1 text-center rounded-xl px-4 py-3 text-sm font-semibold transition-all"
              style={inputStyle(peopleTooMany)}
              onFocus={e=>{ if(!peopleTooMany) e.currentTarget.style.borderColor=T.coralBorder; }}
              onBlur={e=>{ if(!peopleTooMany) e.currentTarget.style.borderColor=T.border; }}
            />

            {/* Increment */}
            <button type="button" onClick={increment}
              disabled={peopleValid && numPeople >= MAX_PEOPLE}
              className="w-10 h-10 rounded-xl border flex items-center justify-center transition-all shrink-0"
              style={{ border:`1.5px solid ${T.border}`, background:T.inputBg, color:T.text }}
              onMouseEnter={e=>{ if(!(peopleValid&&numPeople>=MAX_PEOPLE)){ e.currentTarget.style.borderColor=T.coralBorder; e.currentTarget.style.color=T.coral; e.currentTarget.style.background=T.coralLight; } }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor=T.border; e.currentTarget.style.color=T.text; e.currentTarget.style.background=T.inputBg; }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
              </svg>
            </button>
          </div>

          {/* Capacity bar */}
          {peopleValid && (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background:T.border }}>
                <div className="h-full rounded-full transition-all duration-300"
                  style={{ width:`${(numPeople/MAX_PEOPLE)*100}%`, background:T.coral }}/>
              </div>
              <span className="text-[10px] shrink-0" style={{ color:T.muted }}>{numPeople} / {MAX_PEOPLE}</span>
            </div>
          )}
          {peopleTooMany && <ErrorMsg text={maxPeopleErr} />}
        </div>

        {/* Budget type toggle */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold tracking-widest uppercase" style={{ color:T.muted }}>
            {budgetScopeLabel}
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { type:"total",      label:forAllBtn,   icon:"👥" },
              { type:"per_person", label:perPersonBtn, icon:"👤" },
            ].map(({ type, label, icon }) => {
              const active = formData.budgetType === type;
              return (
                <button key={type} onClick={() => updateForm({ budgetType:type })}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium border transition-all duration-200"
                  style={{
                    border:     `1.5px solid ${active ? T.coral : T.border}`,
                    background: active ? T.coralActive : T.inputBg,
                    color:      active ? T.coral : T.muted,
                  }}>
                  <span>{icon}</span>
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Budget amount + currency */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold tracking-widest uppercase" style={{ color:T.muted }}>
            {budgetLabel}
          </label>
          <div className="flex gap-2.5">
            <select value={formData.currency}
              onChange={e => updateForm({ currency:e.target.value })}
              className="rounded-xl px-3 py-3 text-sm font-semibold outline-none shrink-0 cursor-pointer"
              style={{ border:`1.5px solid ${T.border}`, background:T.inputBg, color:T.text, width:"90px" }}>
              <option value="INR">₹ INR</option>
              <option value="USD">$ USD</option>
            </select>
            <input type="number" min={0} placeholder="e.g. 15000"
              value={formData.budget || ""}
              onChange={e => updateForm({ budget:e.target.value })}
              className="flex-1 rounded-xl px-4 py-3 text-sm transition-all outline-none"
              style={inputStyle(budgetLow)}
              onFocus={e=>{ if(!budgetLow) e.currentTarget.style.borderColor=T.coralBorder; }}
              onBlur={e=>{ if(!budgetLow) e.currentTarget.style.borderColor=T.border; }}
            />
          </div>

          {/* Per-person info */}
          {formData.budget && peopleValid && !budgetLow && formData.budgetType==="total" && (
            <p className="text-xs flex items-center gap-1.5" style={{ color:T.coral }}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {formData.currency==="INR"?"₹":"$"}{Math.floor(perPerson).toLocaleString()} per person
            </p>
          )}
          {budgetLow && <ErrorMsg text={formData.currency==="INR" ? lowINR : lowUSD} />}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-8">
        <button onClick={onBack}
          className="flex-1 py-3.5 rounded-xl font-semibold text-sm border transition-all hover:bg-stone-50"
          style={{ border:`1.5px solid ${T.border}`, color:T.muted }}>
          ← {backBtn}
        </button>
        <button onClick={onNext} disabled={!isValid}
          className="flex-1 py-3.5 rounded-xl font-bold text-sm text-white transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-35 disabled:cursor-not-allowed disabled:transform-none"
          style={{ background:isValid?`linear-gradient(135deg,#8b3a22,${T.coral})`:"#D6D3CE", boxShadow:isValid?`0 4px 18px rgba(218,119,86,0.30)`:"none" }}>
          {nextBtn} →
        </button>
      </div>
    </div>
  );
};

export default Step2;