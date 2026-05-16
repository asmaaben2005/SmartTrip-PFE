// src/components/TripForm/TripForm.jsx
// ─────────────────────────────────────────────────────────────
// Fixed:
//  1. API payload maps form fields → backend TripRequest schema
//  2. Error always converted to string (fixes React render crash)
// ─────────────────────────────────────────────────────────────
import { useState } from "react";
import Step1       from "./Step1";
import Step2       from "./Step2";
import Step3       from "./Step3";
import TripResult  from "../TripResult";
import LoadingSpinner from "../LoadingSpinner";
import client      from "../../api/client";
import useTranslate from "../../hooks/useTranslate";

const T = {
  coral:       "#DA7756",
  coralLight:  "rgba(218,119,86,0.10)",
  coralBorder: "rgba(218,119,86,0.30)",
  border:      "#E7E5E0",
  text:        "#1C1917",
  muted:       "#A8A29E",
};

const INITIAL = {
  from:"", destination:"", startDate:"", endDate:"",
  people:1, budgetType:"total", budget:"", currency:"USD",
  travelStyle:"", interests:[],
};

const STEP_LABELS = ["Location", "Budget", "Style"];

// ── Helpers ───────────────────────────────────────────────────

/**
 * Calculate number of days between two date strings.
 * Minimum 1 day, maximum 21 days.
 */
function calcDuration(startDate, endDate) {
  if (!startDate || !endDate) return 3;
  const ms   = new Date(endDate) - new Date(startDate);
  const days = Math.round(ms / (1000 * 60 * 60 * 24));
  return Math.max(1, Math.min(days, 21));
}

/**
 * Map form budget amount + type → backend BudgetLevel string.
 * Backend expects: "Budget" | "Moderate" | "Luxury"
 */
function mapBudgetLevel(budget, currency) {
  const amount = parseFloat(budget) || 0;
  // Thresholds in USD (approximate)
  const usd = currency === "INR" ? amount / 83 : amount;
  if (usd < 500)  return "Budget";
  if (usd < 2000) return "Moderate";
  return "Luxury";
}

/**
 * Map form travelStyle value → backend TravelStyleType.
 * Backend expects: "Adventure" | "Cultural" | "Relaxation" | "Family"
 */
function mapTravelStyle(style) {
  const map = {
    standard:    "Cultural",
    medium:      "Cultural",
    low:         "Adventure",
    adventure:   "Adventure",
    cultural:    "Cultural",
    relaxation:  "Relaxation",
    family:      "Family",
    comfort:     "Relaxation",
    balanced:    "Cultural",
    budget:      "Adventure",
  };
  return map[style?.toLowerCase()] || "Cultural";
}

/**
 * Extract a safe error message string from any error shape.
 * Prevents the "Objects are not valid as React child" crash.
 */
function extractError(err) {
  // Pydantic 422 → { detail: [{type, loc, msg, input}, ...] }
  const detail = err?.response?.data?.detail;
  if (Array.isArray(detail)) {
    return detail
      .map(d => d?.msg || JSON.stringify(d))
      .join(" · ");
  }
  if (typeof detail === "string") return detail;
  if (typeof err?.response?.data === "string") return err.response.data;
  if (err?.message) return err.message;
  return "Something went wrong. Please try again.";
}

// ── Component ─────────────────────────────────────────────────
const TripForm = () => {
  const [step,          setStep]          = useState(1);
  const [formData,      setFormData]      = useState(INITIAL);
  const [loading,       setLoading]       = useState(false);
  const [tripPlan,      setTripPlan]      = useState(null);
  const [savedFormData, setSavedFormData] = useState(null);
  const [error,         setError]         = useState("");   // always string
  const [regenCount,    setRegenCount]    = useState(0);

  const [planNewTrip] = useTranslate(["Plan a new trip"]);

  const updateForm = (fields) => setFormData(p => ({ ...p, ...fields }));

 const generateTrip = async () => {  // حيدنا الـ parameter باش نعتمدو على formData نيشان
  setLoading(true);
  setError("");
  try {
    // ── Force read directly from the current active formData state ──
    const payload = {
      departure:    String(formData.from || "").trim(), 
      destination:  String(formData.destination || "").trim(), 
      duration:     calcDuration(formData.startDate, formData.endDate), 
      budget:       mapBudgetLevel(formData.budget, formData.currency), 
      travel_style: mapTravelStyle(formData.travelStyle), 
      interests:    Array.isArray(formData.interests) ? formData.interests : [],
    };

    console.log("→ Force Sending to /api/trips/generate:", payload); // غاتبان ليك الداتا كاملة ف الـ console دابا

    const res = await client.post("/trips/generate", payload);
    setTripPlan(res.data);
    setSavedFormData(formData); // حفظ الـ formData الحالية
  } catch (err) {
    console.error("Generate error:", err?.response?.data || err);
    setError(extractError(err)); 
  } finally {
    setLoading(false);
  }
};

  const handleRegenerate = () => {
  if (regenCount >= 2) return;
  setRegenCount(c => c + 1);
  setTripPlan(null);
  generateTrip(); // عيطي ليها نيشان بلا parameters
};

  const handleReset = () => {
    setTripPlan(null); setSavedFormData(null);
    setStep(1); setFormData(INITIAL);
    setRegenCount(0); setError("");
  };

  if (loading) return <LoadingSpinner />;

  if (tripPlan) {
    const active = savedFormData || formData;
    return (
      <div className="w-full max-w-2xl px-4 md:px-0">
        <button onClick={handleReset}
          className="mb-5 flex items-center gap-2 text-xs font-semibold transition-colors"
          style={{ color:T.muted }}
          onMouseEnter={e=>e.currentTarget.style.color=T.coral}
          onMouseLeave={e=>e.currentTarget.style.color=T.muted}>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          {planNewTrip}
        </button>
        <TripResult
          plan={tripPlan}
          weatherData={tripPlan.weatherData}
          fromLocation={active.from}
          onRegenerate={handleRegenerate}
          onPlanNewTrip={handleReset}
          regenerateCount={regenCount}
          hotelsData={tripPlan.hotelsData || []}
          flightsData={tripPlan.flightsData || []}
          trainsData={tripPlan.trainsData || []}
          photosData={tripPlan.photosData || []}
          hotelPhotosData={tripPlan.hotelPhotosData || []}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl px-4 md:px-0">

      {/* Step indicator */}
      <div className="flex items-center justify-between mb-8">
        {[1,2,3].map((s) => (
          <div key={s} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border-2"
                style={{
                  background:  step===s ? T.coral : step>s ? T.coralLight : "#FFFFFF",
                  borderColor: step===s ? T.coral : step>s ? T.coral      : T.border,
                  color:       step===s ? "#FFF"  : step>s ? T.coral      : T.muted,
                  boxShadow:   step===s ? `0 0 0 4px ${T.coralLight}` : "none",
                }}>
                {step > s
                  ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  : s}
              </div>
              <span className="text-[10px] font-medium transition-colors"
                style={{ color: step>=s ? T.text : T.muted }}>
                {STEP_LABELS[s-1]}
              </span>
            </div>
            {s < 3 && (
              <div className="flex-1 h-px mx-2 mb-5 rounded-full transition-colors duration-300"
                style={{ background: step>s ? T.coral : T.border }}/>
            )}
          </div>
        ))}
      </div>

      {/* Error banner — error is always a string here */}
      {error && (
        <div className="mb-5 border rounded-xl px-4 py-3 flex items-start gap-2.5"
          style={{ background:"rgba(239,68,68,0.06)", borderColor:"rgba(239,68,68,0.25)" }}>
          <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {/* Form card */}
      <div className="rounded-2xl border p-6 md:p-8"
        style={{ background:"#FFFFFF", borderColor:T.border, boxShadow:"0 2px 16px rgba(28,25,23,0.07)" }}>
        {step===1 && <Step1 formData={formData} updateForm={updateForm} onNext={()=>setStep(2)}/>}
        {step===2 && <Step2 formData={formData} updateForm={updateForm} onNext={()=>setStep(3)} onBack={()=>setStep(1)}/>}
        {step===3 && <Step3 formData={formData} updateForm={updateForm} onSubmit={generateTrip} onBack={()=>setStep(2)}/>}
      </div>
    </div>
  );
};

export default TripForm;