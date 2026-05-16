// src/components/Sidebar.jsx
// AI Travel Chat Assistant — white cold theme — English — coral accent
import { useState, useRef, useEffect, useCallback } from "react";
import useTranslate from "../hooks/useTranslate";
import client from "../api/client";

const T = {
  coral:       "#DA7756",
  coralHover:  "#C9623D",
  coralLight:  "rgba(218,119,86,0.08)",
  coralBorder: "rgba(218,119,86,0.25)",
  border:      "#E7E5E0",
  text:        "#1C1917",
  muted:       "#A8A29E",
  bg:          "#FFFFFF",
  bubbleAI:    "#F6F5F2",
  bubbleUser:  "#DA7756",
};

const RESET_SEC = 30;

const Sidebar = () => {
  const [title, subtitle, placeholder, greeting, s1, s2, s3] = useTranslate([
    "AI Travel Assistant",
    "Ask about any Moroccan destination",
    "Ask about any destination...",
    "Hi! Ask me anything about a destination — weather, crowds, best time, vibe. I'll help you decide.",
    "Best time to visit Marrakech?",
    "Is Chefchaouen safe in winter?",
    "Crowd levels in Fès in March?",
  ]);

  const [greetingSet, setGreetingSet] = useState(false);
  const [messages,    setMessages]    = useState([]);
  const [input,       setInput]       = useState("");
  const [loading,     setLoading]     = useState(false);
  const [chip,        setChip]        = useState("");
  const [chipUsed,    setChipUsed]    = useState(false);
  const [countdown,   setCountdown]   = useState(null);
  const [showSugg,    setShowSugg]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  const countdownRef = useRef(null);
  const bottomRef    = useRef(null);

  const resetChat = useCallback(() => {
    setMessages([{ role:"ai", text: greeting || "Hi! Ask me anything about a Moroccan destination." }]);
    setChip(""); setChipUsed(false); setCountdown(null);
    clearTimeout(countdownRef.current);
    setInput(""); setShowSugg(false);
  }, [greeting]);

  useEffect(() => {
    if (greeting && !greetingSet) {
      setGreetingSet(true);
      setMessages([{ role:"ai", text:greeting }]);
    }
  }, [greeting, greetingSet]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, chip, countdown]);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow="hidden";
    else document.body.style.overflow="";
    return () => { document.body.style.overflow=""; };
  }, [mobileOpen]);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) { clearTimeout(countdownRef.current); resetChat(); return; }
    countdownRef.current = setTimeout(() => setCountdown(c=>c-1), 1000);
    return () => clearTimeout(countdownRef.current);
  }, [countdown, resetChat]);

  const sendMessage = async (text) => {
    const q = (text || input).trim();
    if (!q) return;
    setChip(""); setChipUsed(false); setCountdown(null);
    clearTimeout(countdownRef.current); setShowSugg(false);
    setMessages(p => [...p, { role:"user", text:q }]);
    setInput(""); setLoading(true);
    try {
      const history = messages.slice(-6).map(m => ({ role:m.role, text:m.text }));
      const res = await client.post("/sidebar/ask", { question:q, history });
      const { answer, suggested_chip } = res.data;
      setMessages(p => [...p, { role:"ai", text:answer }]);
      if (suggested_chip) setChip(suggested_chip);
    } catch {
      setMessages(p => [...p, { role:"ai", text:"Something went wrong. Please try again." }]);
    } finally { setLoading(false); }
  };

  const handleChip = async () => {
    if (!chip || chipUsed || loading) return;
    setChipUsed(true);
    const q = chip; setChip("");
    await sendMessage(q);
    setCountdown(RESET_SEC);
  };

  const suggestions = [s1,s2,s3].filter(Boolean);

  // ── Chat panel content ───────────────────────────────────────
  const ChatPanel = (
    <div className="flex flex-col h-full" style={{ background:T.bg }}>

      {/* Header */}
      <div className="px-4 py-3.5 border-b shrink-0 flex items-center justify-between"
        style={{ borderColor:T.border }}>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/>
            <h3 className="text-sm font-bold" style={{ color:T.text }}>{title}</h3>
          </div>
          <p className="text-[11px] pl-4" style={{ color:T.muted }}>{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          {messages.length > 1 && (
            <button onClick={resetChat}
              className="text-[10px] px-2.5 py-1 rounded-full border transition-all"
              style={{ border:`1px solid ${T.border}`, color:T.muted }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor=T.coralBorder; e.currentTarget.style.color=T.coral; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor=T.border; e.currentTarget.style.color=T.muted; }}>
              Clear
            </button>
          )}
          {/* Mobile close */}
          <button onClick={() => setMobileOpen(false)}
            className="md:hidden w-7 h-7 flex items-center justify-center rounded-full border transition-all"
            style={{ border:`1px solid ${T.border}`, color:T.muted }}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3"
        style={{ scrollbarWidth:"thin", scrollbarColor:`${T.coralBorder} transparent` }}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role==="user"?"justify-end":"justify-start"}`}>
            {msg.role==="ai" && (
              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 mr-2 border"
                style={{ background:T.coralLight, borderColor:T.coralBorder }}>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke={T.coral} strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
              </div>
            )}
            <div
              className="text-xs leading-relaxed rounded-2xl px-3.5 py-2.5 max-w-[82%]"
              style={msg.role==="ai"
                ? { background:T.bubbleAI, color:T.text, border:`1px solid ${T.border}` }
                : { background:T.coral,    color:"#FFFFFF" }
              }
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Loading dots */}
        {loading && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 border"
              style={{ background:T.coralLight, borderColor:T.coralBorder }}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke={T.coral} strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
            </div>
            <div className="rounded-2xl px-3.5 py-2.5 border" style={{ background:T.bubbleAI, borderColor:T.border }}>
              <span className="flex items-center gap-1.5">
                {[0,150,300].map(d=>(
                  <span key={d} className="w-1.5 h-1.5 rounded-full animate-bounce"
                    style={{ background:T.coral, animationDelay:`${d}ms` }}/>
                ))}
              </span>
            </div>
          </div>
        )}

        {/* Suggested chip */}
        {chip && !loading && (
          <div className="flex justify-start pl-9">
            <button onClick={handleChip}
              className="text-[11px] px-3 py-1.5 rounded-full border transition-all"
              style={{ border:`1.5px solid ${T.coralBorder}`, color:T.coral, background:T.coralLight }}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(218,119,86,0.16)"}
              onMouseLeave={e=>e.currentTarget.style.background=T.coralLight}>
              ✦ {chip}
            </button>
          </div>
        )}

        {/* Countdown */}
        {countdown !== null && !loading && (
          <div className="mx-1 rounded-xl px-3 py-2 flex items-center justify-between border"
            style={{ background:"#FAFAF9", borderColor:T.border }}>
            <span className="text-[10px]" style={{ color:T.muted }}>Chat resets in {countdown}s</span>
            <button onClick={resetChat} className="text-[10px] font-semibold" style={{ color:T.coral }}>
              Reset now
            </button>
          </div>
        )}

        <div ref={bottomRef}/>
      </div>

      {/* Input area */}
      <div className="px-4 py-3 border-t shrink-0" style={{ borderColor:T.border }}>

        {/* Suggestions dropdown */}
        {showSugg && (
          <div className="mb-2.5 rounded-xl border overflow-hidden" style={{ borderColor:T.border }}>
            {suggestions.map((s,i)=>(
              <button key={i}
                onClick={()=>{ sendMessage(s); setShowSugg(false); }}
                className="w-full text-left text-xs px-3.5 py-2.5 border-b last:border-0 transition-all"
                style={{ background:"#FFFFFF", borderColor:T.border, color:T.text }}
                onMouseEnter={e=>{ e.currentTarget.style.background=T.coralLight; e.currentTarget.style.color=T.coral; }}
                onMouseLeave={e=>{ e.currentTarget.style.background="#FFFFFF"; e.currentTarget.style.color=T.text; }}>
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          {/* Suggestions toggle */}
          <button onClick={()=>setShowSugg(v=>!v)}
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all"
            style={{
              border:     `1.5px solid ${showSugg ? T.coral : T.border}`,
              background: showSugg ? T.coralLight : "#FFFFFF",
            }}
            title="Quick questions">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              style={{ color: showSugg ? T.coral : T.muted }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </button>

          {/* Text input */}
          <input type="text"
            value={input}
            onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&!loading&&sendMessage()}
            placeholder={placeholder}
            disabled={loading}
            className="flex-1 text-xs rounded-xl px-3 py-2.5 outline-none transition-all border disabled:opacity-50"
            style={{ background:"#FAFAF9", borderColor:T.border, color:T.text }}
            onFocus={e=>e.currentTarget.style.borderColor=T.coralBorder}
            onBlur={e=>e.currentTarget.style.borderColor=T.border}
          />

          {/* Send */}
          <button onClick={()=>sendMessage()}
            disabled={!input.trim()||loading}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white transition-all shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background:T.coral }}
            onMouseEnter={e=>{ if(!(!input.trim()||loading)) e.currentTarget.style.background=T.coralHover; }}
            onMouseLeave={e=>e.currentTarget.style.background=T.coral}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop: full sidebar panel */}
      <div className="hidden md:flex md:flex-col md:h-full">
        {ChatPanel}
      </div>

      {/* Mobile: overlay + bottom sheet */}
      <div className="md:hidden">
        {/* Overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={()=>setMobileOpen(false)}/>
        )}

        {/* Bottom sheet */}
        <div
          className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-out ${mobileOpen?"translate-y-0":"translate-y-full"}`}
          style={{ height:"72vh", borderRadius:"20px 20px 0 0", border:`1px solid ${T.border}`, boxShadow:"0 -8px 32px rgba(28,25,23,0.10)" }}>
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full" style={{background:T.border}}/>
          </div>
          <div style={{height:"calc(100% - 1.25rem)"}}>{ChatPanel}</div>
        </div>

        {/* Floating trigger */}
        {!mobileOpen && (
          <button onClick={()=>setMobileOpen(true)}
            className="fixed bottom-5 right-5 z-40 flex items-center gap-2 px-4 py-3 rounded-2xl shadow-lg transition-all active:scale-95 text-white"
            style={{ background:`linear-gradient(135deg,#8b3a22,${T.coral})`, boxShadow:`0 6px 20px rgba(218,119,86,0.40)` }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
            </svg>
            <span className="text-sm font-bold">AI Assistant</span>
            {messages.length > 1 && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/>
            )}
          </button>
        )}
      </div>
    </>
  );
};

export default Sidebar;