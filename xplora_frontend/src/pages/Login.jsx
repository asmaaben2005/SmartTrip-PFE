// src/pages/Login.jsx
// Design matches Landing.jsx — coral palette + Moroccan backgrounds

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import client from "../api/client";
import useAuth from "../context/useAuth";

/* ── Same backgrounds as Landing ───────────────────────────── */
const MOROCCAN_BG_IMAGES = [
  "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1920&q=80",
  "https://images.unsplash.com/photo-1624802746702-60ca95bdb605?w=1920&q=80",
  "https://images.unsplash.com/photo-1590802163243-290dd8621032?w=1920&q=80",
  "https://images.unsplash.com/photo-1668312981990-4eaf23a78986?w=1920&q=80",
  "https://images.unsplash.com/photo-1574545188455-fe512926e41b?w=1920&q=80",
  "https://images.unsplash.com/photo-1580746738099-1cb74f972feb?w=1920&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80",
];

/* ── Same coral palette as Landing ─────────────────────────── */
const G = {
  primary:     "#da7756",
  bright:      "#e8956d",
  deep:        "#8b3a22",
  darkest:     "#5c2010",
  glow:        "rgba(218,119,86,0.25)",
  glowLight:   "rgba(232,149,109,0.15)",
  badge:       "rgba(218,119,86,0.12)",
  badgeBorder: "rgba(218,119,86,0.35)",
  panelBg:     "rgba(4,10,7,0.82)",
  inputBg:     "rgba(255,255,255,0.06)",
  inputBorder: "rgba(255,255,255,0.12)",
};

/* ── Input field ─────────────────────────────────────────────*/
const InputField = ({ label, name, type="text", value, onChange, onBlur, error, isPassword=false, showToggle, onToggle }) => (
  <div className="flex flex-col gap-1.5">
    <label style={{ fontSize:10, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase", color:"rgba(232,149,109,0.80)" }}>
      {label}
    </label>
    <div className="relative">
      <input
        type={isPassword?(showToggle?"text":"password"):type}
        name={name} value={value} onChange={onChange}
        placeholder={`Enter your ${label.toLowerCase()}`}
        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 text-stone-100 placeholder-stone-600"
        style={{
          border: error ? "1px solid rgba(239,68,68,0.55)" : `1px solid ${G.inputBorder}`,
          background: error ? "rgba(239,68,68,0.08)" : G.inputBg,
          backdropFilter: "blur(8px)",
        }}
        onFocus={e=>{ if(!error) e.currentTarget.style.borderColor=G.badgeBorder; }}
        onBlur={e=>{ if(!error) e.currentTarget.style.borderColor=G.inputBorder; onBlur&&onBlur(e); }}
      />
      {isPassword && (
        <button type="button" onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
          style={{ color:"rgba(255,255,255,0.30)" }}
          onMouseEnter={e=>e.currentTarget.style.color=G.primary}
          onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.30)"}
        >
          {showToggle
            ?<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/></svg>
            :<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          }
        </button>
      )}
    </div>
    {error && (
      <p className="text-xs text-red-400 flex items-center gap-1.5">
        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        {error}
      </p>
    )}
  </div>
);

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Pick random bg on mount — same logic as Landing
  const [bgUrl]         = useState(() => MOROCCAN_BG_IMAGES[Math.floor(Math.random() * MOROCCAN_BG_IMAGES.length)]);
  const [bgLoaded, setBgLoaded] = useState(false);

  // Preload bg
  useState(() => {
    const img = new Image();
    img.src = bgUrl;
    img.onload = () => setBgLoaded(true);
  });

  const [form, setForm]                   = useState({ email:"", password:"" });
  const [errors, setErrors]               = useState({});
  const [showPassword, setShowPassword]   = useState(false);
  const [loading, setLoading]             = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const validate = (field, value) => {
    if(field==="email"){
      if(!value.trim()) return "Email is required.";
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address.";
    }
    if(field==="password" && !value) return "Password is required.";
    return "";
  };

  const handleChange = e => setForm({...form,[e.target.name]:e.target.value});
  const handleBlur   = e => { const {name,value}=e.target; setErrors(p=>({...p,[name]:validate(name,value)})); };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs={};
    Object.keys(form).forEach(f=>{ const err=validate(f,form[f]); if(err) errs[f]=err; });
    setErrors(errs);
    if(Object.keys(errs).length>0) return;
    setLoading(true);
    try {
      const res = await client.post("/auth/login",{email:form.email,password:form.password});
      login(res.data.access_token,res.data.user);
      navigate("/dashboard");
    } catch(err){
      setErrors({email:err.response?.data?.detail||"Login failed. Try again."});
    } finally { setLoading(false); }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async tok => {
      setGoogleLoading(true); setErrors({});
      try {
        const ui  = await (await fetch("https://www.googleapis.com/oauth2/v3/userinfo",{headers:{Authorization:`Bearer ${tok.access_token}`}})).json();
        const res = await client.post("/auth/google",{credential:tok.access_token,email:ui.email,name:ui.name});
        login(res.data.access_token,res.data.user);
        navigate("/dashboard");
      } catch(err){ setErrors({email:err.response?.data?.detail||"Google login failed."}); }
      finally { setGoogleLoading(false); }
    },
    onError:()=>setErrors({email:"Google login was cancelled or failed."}),
  });

  return (
    <div className="h-screen w-screen overflow-hidden relative" style={{background:"#060e0a"}}>

      {/* ── Moroccan background (same as Landing) ── */}
      <div
        className="absolute inset-0 z-0 transition-opacity duration-1000"
        style={{
          backgroundImage: bgLoaded ? `url('${bgUrl}')` : undefined,
          backgroundSize:  "cover",
          backgroundPosition: "center",
          opacity: bgLoaded ? 1 : 0,
        }}
      />
      {/* Dark overlay — same as Landing */}
      <div className="absolute inset-0 z-10" style={{ background:"rgba(6,14,10,0.65)" }}/>

      {/* ── NAVBAR (same as Landing) ── */}
      <nav
        className="relative z-20 flex items-center justify-between px-4 md:px-8 py-4 border-b border-white/10 backdrop-blur-md"
        style={{ background:"rgba(6,14,10,0.55)" }}
      >
        <span
          className="font-serif text-white text-xl md:text-2xl font-bold tracking-wide select-none cursor-pointer"
          onClick={()=>navigate("/")}
        >
          Smart<span style={{color:G.primary}}>Trip</span>
        </span>
        <div className="flex items-center gap-3">
          <span className="text-stone-500 text-xs hidden sm:block">New here?</span>
          <button
            onClick={()=>navigate("/signup")}
            className="px-5 py-2 text-sm font-semibold rounded-full transition-all hover:-translate-y-px active:scale-[0.97]"
            style={{
              background:`linear-gradient(135deg,${G.deep},${G.primary})`,
              color:"#fff",
              boxShadow:`0 4px 18px ${G.glow}`,
            }}
          >
            Get started
          </button>
        </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-20 flex h-[calc(100vh-65px)] overflow-hidden">

        {/* Left panel — info (hidden on mobile) */}
        <div className="hidden lg:flex w-1/2 flex-col justify-center px-14 xl:px-20">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border self-start"
            style={{ border:`1px solid ${G.badgeBorder}`, background:G.badge }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{background:G.primary}}/>
            <span className="text-xs font-semibold tracking-widest uppercase" style={{color:G.bright}}>
              Welcome Back
            </span>
          </div>

          <h1 className="font-sans text-4xl xl:text-5xl font-extrabold text-stone-100 leading-tight mb-4 drop-shadow-2xl">
            Your Morocco<br/>
            <span className="italic" style={{color:G.primary}}>awaits you.</span>
          </h1>

          <p className="text-stone-400 text-sm leading-relaxed font-light mb-10 max-w-sm">
            Sign in to access your personalized Moroccan travel plans, saved itineraries and AI recommendations.
          </p>

          {/* Stats — same as Landing */}
          <div className="flex items-center gap-8 pt-6 border-t border-white/10">
            {[["12K+","Trips Created"],["7","Cities"],["98%","Satisfaction"]].map(([num,label])=>(
              <div key={label}>
                <p className="text-xl font-bold" style={{color:G.primary}}>{num}</p>
                <p className="text-[10px] text-white/35 uppercase tracking-wider mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel — form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-5 lg:px-14 xl:px-20 overflow-y-auto py-8">
          <div className="w-full max-w-sm">

            {/* Form card */}
            <div
              className="rounded-2xl p-7 border border-white/8"
              style={{
                background:"linear-gradient(160deg,rgba(12,28,20,0.92) 0%,rgba(8,16,12,0.94) 100%)",
                backdropFilter:"blur(20px)",
              }}
            >
              {/* Top shimmer */}
              <div className="h-px mb-6 rounded-full" style={{background:`linear-gradient(to right,transparent,${G.primary},transparent)`}}/>

              <div className="mb-6">
                <p className="text-xs font-semibold tracking-widest uppercase mb-1.5" style={{color:G.primary}}>
                  ✦ Sign In
                </p>
                <h2 className="font-sans text-2xl font-extrabold text-stone-100">
                  Welcome back
                </h2>
                <p className="text-stone-500 text-xs mt-1">Sign in to SmartTrip to continue</p>
              </div>

              {/* Toggle Sign Up / Log In */}
              <div
                className="flex rounded-xl p-1 mb-6 border"
                style={{ background:"rgba(255,255,255,0.04)", borderColor:"rgba(255,255,255,0.08)" }}
              >
                <button
                  onClick={()=>navigate("/signup")}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium text-stone-500 hover:text-stone-300 transition-colors"
                >
                  Sign Up
                </button>
                <button
                  className="flex-1 py-2.5 rounded-lg text-sm font-bold text-white"
                  style={{
                    background:`linear-gradient(135deg,${G.deep},${G.primary})`,
                    boxShadow:`0 3px 12px ${G.glow}`,
                  }}
                >
                  Log In
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <InputField label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} onBlur={handleBlur} error={errors.email}/>
                <InputField label="Password" name="password" value={form.password} onChange={handleChange} onBlur={handleBlur} error={errors.password} isPassword showToggle={showPassword} onToggle={()=>setShowPassword(p=>!p)}/>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-1 w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-50 hover:-translate-y-0.5 active:scale-[0.98]"
                  style={{
                    background:`linear-gradient(135deg,${G.deep},${G.primary})`,
                    boxShadow:`0 6px 20px ${G.glow}`,
                  }}
                >
                  {loading ? "Signing in..." : "Sign In →"}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px" style={{background:"rgba(255,255,255,0.08)"}}/>
                <span className="text-xs font-medium text-stone-600">or continue with</span>
                <div className="flex-1 h-px" style={{background:"rgba(255,255,255,0.08)"}}/>
              </div>

              {/* Google */}
              <button
                onClick={()=>handleGoogleLogin()}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 rounded-xl py-3 text-sm font-medium text-stone-400 hover:text-stone-200 transition-all disabled:opacity-50 border border-white/8 hover:border-white/15"
                style={{background:"rgba(255,255,255,0.04)"}}
              >
                {googleLoading
                  ?<span className="w-4 h-4 border-2 rounded-full animate-spin" style={{borderColor:`${G.primary}30`,borderTopColor:G.primary}}/>
                  :<img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4"/>}
                {googleLoading?"Connecting...":"Continue with Google"}
              </button>

              <p className="text-center text-xs mt-5 text-stone-600">
                Don't have an account?{" "}
                <Link to="/signup" className="font-semibold transition-colors" style={{color:G.primary}}
                  onMouseEnter={e=>e.currentTarget.style.color=G.bright}
                  onMouseLeave={e=>e.currentTarget.style.color=G.primary}
                >Create one</Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        html, body { overflow: hidden; }
        * { -webkit-font-smoothing: antialiased; }
      `}</style>
    </div>
  );
};

export default Login;