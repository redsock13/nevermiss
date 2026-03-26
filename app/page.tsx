"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ── SCRAMBLE ── */
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
function scramble(el: HTMLElement, target: string, ms = 900) {
  const frames = Math.round(ms / 30); const obj = { f: 0 };
  const run = () => {
    el.textContent = target.split("").map((c, i) =>
      c === " " ? " " : obj.f / frames > i / target.length ? c : CHARS[Math.floor(Math.random() * CHARS.length)]
    ).join("");
    if (obj.f++ < frames) requestAnimationFrame(run); else el.textContent = target;
  };
  run();
}

/* ── WAVEFORM ── */
function Waveform({ active }: { active: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3, height: 36 }}>
      {Array.from({ length: 12 }, (_, i) => (
        <div key={i} style={{
          width: 3, borderRadius: 99, background: "#2563eb",
          transition: "height .15s ease",
          height: active ? `${8 + Math.sin(Date.now() / 200 + i) * 14 + 14}px` : "4px",
          animation: active ? `waveform ${.4 + i * .07}s ease-in-out infinite alternate` : "none",
          animationDelay: `${i * 0.06}s`,
        }} />
      ))}
    </div>
  );
}

/* ── PHONE ANIMATION ── */
function PhoneHero() {
  const [state, setState] = useState<"idle"|"ringing"|"answered">("idle");
  const [callText, setCallText] = useState("Incoming call...");

  useEffect(() => {
    const cycle = () => {
      setState("ringing");
      setCallText("Incoming call...");
      setTimeout(() => {
        setState("answered");
        setCallText("NeverMiss AI answering...");
      }, 1800);
      setTimeout(() => {
        setCallText("Lead qualified ✓ Appointment booked");
      }, 4000);
      setTimeout(() => {
        setState("idle");
        setCallText("Incoming call...");
      }, 7000);
    };
    const t = setTimeout(cycle, 800);
    const i = setInterval(cycle, 8000);
    return () => { clearTimeout(t); clearInterval(i); };
  }, []);

  const BG = { background: "linear-gradient(135deg,#2563eb,#06b6d4)", WebkitBackgroundClip: "text" as const, WebkitTextFillColor: "transparent" as const };

  return (
    <div style={{ position: "relative", width: 320, height: 320, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Rings */}
      {state === "ringing" && (
        <>
          <div className="ring" style={{ position: "absolute", top: "50%", left: "50%", border: "2px solid rgba(37,99,235,.7)", borderRadius: "50%" }} />
          <div className="ring" style={{ position: "absolute", top: "50%", left: "50%", border: "2px solid rgba(37,99,235,.5)", borderRadius: "50%" }} />
          <div className="ring" style={{ position: "absolute", top: "50%", left: "50%", border: "2px solid rgba(37,99,235,.3)", borderRadius: "50%" }} />
        </>
      )}
      {/* Phone card */}
      <div style={{
        background: "rgba(255,255,255,.04)", border: `1px solid ${state === "answered" ? "rgba(37,99,235,.4)" : "rgba(255,255,255,.08)"}`,
        borderRadius: 24, padding: "28px 32px", width: 280, backdropFilter: "blur(24px)",
        boxShadow: state === "answered" ? "0 0 40px rgba(37,99,235,.2)" : "0 20px 60px rgba(0,0,0,.4)",
        transition: "all .4s ease",
        animation: state === "idle" ? "none" : "callIn .4s ease",
      }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20 }}>
          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            background: state === "answered" ? "linear-gradient(135deg,#2563eb,#06b6d4)" : "rgba(255,255,255,.1)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
            transition: "background .4s",
          }}>
            {state === "answered" ? "🤖" : "📞"}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#f0f4ff" }}>
              {state === "answered" ? "NeverMiss AI" : "+1 (602) 555-0184"}
            </div>
            <div style={{ fontSize: 12, color: state === "answered" ? "#2563eb" : "#475569" }}>
              {state === "ringing" ? "● Ringing" : state === "answered" ? "● Live" : "Waiting..."}
            </div>
          </div>
        </div>
        <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 16, lineHeight: 1.5, minHeight: 36 }}>
          {callText}
        </div>
        <Waveform active={state === "answered"} />
      </div>

      {/* Floating badges */}
      {state === "answered" && (
        <>
          <div className="float" style={{ position: "absolute", top: 20, right: -10, background: "rgba(4,5,15,.95)", borderRadius: 12, padding: "8px 14px", fontSize: 12, fontWeight: 700, border: "1px solid rgba(37,99,235,.2)", whiteSpace: "nowrap", color: "#06b6d4" }}>
            ✓ Appointment booked
          </div>
          <div className="float2" style={{ position: "absolute", bottom: 20, left: -10, background: "rgba(4,5,15,.95)", borderRadius: 12, padding: "8px 14px", fontSize: 12, fontWeight: 700, border: "1px solid rgba(37,99,235,.2)", whiteSpace: "nowrap", color: "#2563eb" }}>
            24/7 • Never sleeps
          </div>
        </>
      )}
    </div>
  );
}

/* ── MAG BTN ── */
function MagBtn({ children, href, primary, big, onClick }: { children: React.ReactNode; href?: string; primary?: boolean; big?: boolean; onClick?: () => void }) {
  const r = useRef<HTMLAnchorElement>(null);
  const onMove = (e: React.MouseEvent) => { const b = r.current!.getBoundingClientRect(); gsap.to(r.current, { x: (e.clientX - b.left - b.width / 2) * .28, y: (e.clientY - b.top - b.height / 2) * .28, duration: .3, ease: "power2.out" }); };
  const onLeave = () => gsap.to(r.current, { x: 0, y: 0, duration: .6, ease: "elastic.out(1,.4)" });
  return (
    <a ref={r} href={href || "#contact"} onMouseMove={onMove} onMouseLeave={onLeave} onClick={onClick}
      style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none", padding: big ? "17px 44px" : "13px 28px", borderRadius: 999, fontSize: big ? 17 : 15, fontWeight: 700, background: primary ? "linear-gradient(135deg,#2563eb,#06b6d4)" : "rgba(37,99,235,.08)", color: primary ? "#fff" : "#60a5fa", border: primary ? "none" : "1px solid rgba(37,99,235,.2)", boxShadow: primary ? "0 8px 32px rgba(37,99,235,.35), inset 0 1px 0 rgba(255,255,255,.1)" : "none", flexShrink: 0, cursor: "none" }}>
      {children}
    </a>
  );
}

/* ── COUNTER ── */
function Counter({ to, prefix = "", suffix = "" }: { to: number; prefix?: string; suffix?: string }) {
  const r = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const o = { v: 0 };
    gsap.to(o, { v: to, duration: 2.2, ease: "power3.out", scrollTrigger: { trigger: r.current, start: "top 85%", once: true }, onUpdate: () => { if (r.current) r.current.textContent = prefix + Math.round(o.v).toLocaleString() + suffix; } });
  }, [to, prefix, suffix]);
  return <span ref={r}>{prefix}0{suffix}</span>;
}

/* ────────── PAGE ────────── */
export default function Home() {
  const root = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const BG: React.CSSProperties = { background: "linear-gradient(135deg,#2563eb,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" };
  const NICHES = ["Plumber", "HVAC Contractor", "Electrician", "Roofer", "Locksmith", "Pest Control", "Landscaper", "General Contractor"];

  useEffect(() => {
    const dot = document.getElementById("cur"), ring = document.getElementById("cur-ring");
    if (!dot || !ring) return;
    const fn = (e: MouseEvent) => { gsap.to(dot, { x: e.clientX, y: e.clientY, duration: .04 }); gsap.to(ring, { x: e.clientX, y: e.clientY, duration: .14 }); };
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  useEffect(() => {
    import("lenis").then(m => {
      const lenis = new m.default({ lerp: .09, smoothWheel: true });
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const el = document.getElementById("sc");
    if (el) setTimeout(() => scramble(el, "NeverMiss", 900), 600);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([".hn", ".hb", ".ht1", ".ht2", ".hs", ".hbtns", ".hphone", ".hstat"], { opacity: 0 });
      gsap.set([".ht1", ".ht2"], { y: 60 });
      gsap.set([".hb", ".hs", ".hbtns", ".hstat"], { y: 24 });
      gsap.set(".hphone", { y: 50, scale: .95 });
      gsap.timeline({ delay: .1 })
        .to(".hn", { opacity: 1, duration: .5 })
        .to(".hb", { opacity: 1, y: 0, duration: .6, ease: "power3.out" }, "-=.2")
        .to(".ht1", { opacity: 1, y: 0, duration: 1, ease: "power4.out" }, "-=.3")
        .to(".ht2", { opacity: 1, y: 0, duration: 1, ease: "power4.out" }, "-=.7")
        .to(".hs", { opacity: 1, y: 0, duration: .8, ease: "power3.out" }, "-=.5")
        .to(".hbtns", { opacity: 1, y: 0, duration: .7, ease: "power3.out" }, "-=.4")
        .to(".hstat", { opacity: 1, y: 0, stagger: .08, duration: .6, ease: "power3.out" }, "-=.3")
        .to(".hphone", { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: "power3.out" }, "-=.6");
      gsap.utils.toArray<HTMLElement>(".sr").forEach(el => {
        gsap.set(el, { opacity: 0, y: 40 });
        gsap.to(el, { opacity: 1, y: 0, duration: .8, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 83%", once: true } });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <div id="cur" /><div id="cur-ring" /><div className="scanline" />

      {/* Aurora */}
      <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "-15%", right: "-10%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle,rgba(37,99,235,.12) 0%,transparent 65%)", filter: "blur(80px)" }} />
        <div style={{ position: "absolute", top: "40%", left: "-10%", width: 550, height: 550, borderRadius: "50%", background: "radial-gradient(circle,rgba(6,182,212,.08) 0%,transparent 65%)", filter: "blur(90px)" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "15%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(37,99,235,.07) 0%,transparent 65%)", filter: "blur(70px)" }} />
        <div className="dot-grid" />
      </div>

      <div ref={root} style={{ position: "relative", zIndex: 2 }}>

        {/* NAV */}
        <nav className="hn" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 clamp(20px,4vw,48px)", height: 62, background: "rgba(4,5,15,.88)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(37,99,235,.08)" }}>
          <span style={{ fontWeight: 900, fontSize: 20, letterSpacing: "-0.5px" }}>Never<span style={BG}>Miss</span></span>
          <div className="nav-links" style={{ display: "flex", gap: 32, fontSize: 14, color: "#475569" }}>
            {["How it works", "Pricing", "For who"].map((n, i) => (
              <a key={i} href={`#s${i}`} style={{ color: "inherit", textDecoration: "none" }}
                onMouseEnter={e => ((e.target as HTMLElement).style.color = "#60a5fa")}
                onMouseLeave={e => ((e.target as HTMLElement).style.color = "#475569")}>{n}</a>
            ))}
          </div>
          <MagBtn href="#contact" primary>Start free trial →</MagBtn>
        </nav>

        {/* HERO */}
        <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "90px 24px 60px", textAlign: "center", position: "relative", overflow: "hidden" }}>

          <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: 1100, margin: "0 auto" }}>

            <div className="hb" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(37,99,235,.08)", border: "1px solid rgba(37,99,235,.2)", borderRadius: 999, padding: "7px 18px", fontSize: 13, color: "#60a5fa", marginBottom: 36, fontWeight: 500 }}>
              <span style={{ width: 7, height: 7, background: "#2563eb", borderRadius: "50%", boxShadow: "0 0 10px #2563eb", display: "inline-block" }} className="pulse-blue" />
              14-day free trial · No credit card · Cancel anytime
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 48, alignItems: "center", width: "100%", maxWidth: 1000 }}>
              <div style={{ textAlign: "left" }}>
                <h1 className="ht1" style={{ fontSize: "clamp(44px,7vw,88px)", fontWeight: 900, letterSpacing: "-3px", lineHeight: .95, marginBottom: 8 }}>
                  Your phone rings.
                </h1>
                <h1 className="ht2" style={{ fontSize: "clamp(44px,7vw,88px)", fontWeight: 900, letterSpacing: "-3px", lineHeight: .95, marginBottom: 28 }}>
                  <span id="sc" style={{ ...BG, backgroundSize: "200% auto" }} className="shimmer">NeverMiss</span> answers.
                </h1>

                <p className="hs" style={{ fontSize: "clamp(16px,2vw,20px)", color: "#64748b", maxWidth: 500, lineHeight: 1.65, marginBottom: 44 }}>
                  AI voice agent that answers every call, qualifies leads, and books appointments — 24/7. You focus on the job. We handle the phone.
                </p>

                <div className="hbtns" style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 56 }}>
                  <MagBtn href="#contact" primary big>Start free — 14 days →</MagBtn>
                  <MagBtn href="#s0" big={false}>See how it works</MagBtn>
                </div>

                <div className="stats-row" style={{ display: "grid", gridTemplateColumns: "repeat(3,auto)", gap: 32 }}>
                  {[
                    { v: 40, s: "%", l: "of calls missed by contractors" },
                    { v: 1500, prefix: "$", s: "+", l: "lost per week on average" },
                    { v: 149, prefix: "$", s: "/mo", l: "flat — no surprises" },
                  ].map((s, i) => (
                    <div key={i} className="hstat">
                      <div style={{ fontSize: "clamp(28px,3.5vw,42px)", fontWeight: 900, letterSpacing: "-1.5px", ...BG, lineHeight: 1 }}>
                        <Counter to={s.v} prefix={s.prefix || ""} suffix={s.s} />
                      </div>
                      <div style={{ fontSize: 12, color: "#475569", maxWidth: 120, lineHeight: 1.4, marginTop: 4 }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hphone" style={{ flexShrink: 0 }}>
                <PhoneHero />
              </div>
            </div>
          </div>
        </section>

        {/* MARQUEE */}
        <div style={{ overflow: "hidden", padding: "18px 0", borderTop: "1px solid rgba(37,99,235,.07)", borderBottom: "1px solid rgba(37,99,235,.07)", background: "rgba(0,0,0,.3)" }}>
          <div className="mq">
            {[...Array(2)].flatMap(() => NICHES.map((n, i) => (
              <div key={`${n}${i}`} style={{ display: "flex", alignItems: "center", gap: 20, paddingRight: 40, whiteSpace: "nowrap" }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#334155" }}>📞 {n}</span>
                <span style={{ color: "#1e293b", fontSize: 8 }}>◆</span>
              </div>
            )))}
          </div>
        </div>

        {/* PROBLEM */}
        <section id="s0" style={{ padding: "80px 24px 100px" }}>
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <div className="sr" style={{ marginBottom: 64 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(37,99,235,.07)", border: "1px solid rgba(37,99,235,.15)", borderRadius: 999, padding: "6px 16px", fontSize: 13, color: "#60a5fa", fontWeight: 500, marginBottom: 16 }}>The problem</div>
              <h2 style={{ fontSize: "clamp(28px,4.5vw,56px)", fontWeight: 900, letterSpacing: "-1.5px", lineHeight: 1.05 }}>
                You're paying Google to<br /><span style={BG}>send you calls you can't answer.</span>
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }} className="how-grid">
              {[
                { e: "📲", t: "40% of calls go to voicemail", d: "When you're on a job, under a sink, on a roof — you can't pick up. That customer calls your competitor instead." },
                { e: "🌙", t: "60% of calls happen off-hours", d: "Evenings and weekends are prime time for emergency calls. Your voicemail doesn't close deals." },
                { e: "💸", t: "$1,500+ lost every week", d: "5 missed calls at $300 each = $1,500/week in lost revenue. That's $78,000/year walking out the door." },
              ].map((c, i) => (
                <div key={i} className="sr" style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(37,99,235,.09)", borderRadius: 18, padding: "28px 24px" }}>
                  <div style={{ fontSize: 32, marginBottom: 14 }}>{c.e}</div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10, letterSpacing: "-.2px" }}>{c.t}</h3>
                  <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.65 }}>{c.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="s1" style={{ padding: "60px 24px 100px", background: "rgba(0,0,0,.3)", borderTop: "1px solid rgba(37,99,235,.06)" }}>
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <div className="sr" style={{ marginBottom: 56 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(37,99,235,.07)", border: "1px solid rgba(37,99,235,.15)", borderRadius: 999, padding: "6px 16px", fontSize: 13, color: "#60a5fa", fontWeight: 500, marginBottom: 16 }}>How it works</div>
              <h2 style={{ fontSize: "clamp(28px,4.5vw,56px)", fontWeight: 900, letterSpacing: "-1.5px", lineHeight: 1.05 }}>
                Up and running<br /><span style={BG}>in 10 minutes.</span>
              </h2>
            </div>
            {[
              { n: "01", e: "📞", t: "You get a business phone number", d: "We give you a local US number (or forward your existing one). Customers call it like any other business number." },
              { n: "02", e: "🤖", t: "NeverMiss AI picks up instantly", d: "Our AI greets callers in your name, understands their request, and handles the conversation naturally — 24/7." },
              { n: "03", e: "📅", t: "Appointment booked, you get notified", d: "The AI books the job directly into your calendar and sends you a text with the lead details. You show up and get paid." },
            ].map((s, i) => (
              <div key={i} className="sr" style={{ display: "grid", gridTemplateColumns: "68px 1fr", gap: 24, padding: "32px 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,.04)" : "none", alignItems: "flex-start" }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(37,99,235,.08)", border: "1px solid rgba(37,99,235,.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{s.e}</div>
                <div>
                  <div style={{ fontSize: 10, color: "#60a5fa", fontWeight: 700, letterSpacing: 2, marginBottom: 7, textTransform: "uppercase" }}>Step {s.n}</div>
                  <h3 style={{ fontSize: 21, fontWeight: 700, marginBottom: 8, letterSpacing: "-.3px" }}>{s.t}</h3>
                  <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.65, maxWidth: 480 }}>{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FOR WHO */}
        <section id="s2" style={{ padding: "80px 24px 100px" }}>
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <div className="sr" style={{ marginBottom: 48 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(37,99,235,.07)", border: "1px solid rgba(37,99,235,.15)", borderRadius: 999, padding: "6px 16px", fontSize: 13, color: "#60a5fa", fontWeight: 500, marginBottom: 16 }}>Built for</div>
              <h2 style={{ fontSize: "clamp(28px,4.5vw,56px)", fontWeight: 900, letterSpacing: "-1.5px", lineHeight: 1.05 }}>
                Any contractor who can't afford<br /><span style={BG}>to miss a single call.</span>
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
              {NICHES.map((n, i) => (
                <div key={i} className="sr" style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(37,99,235,.08)", borderRadius: 14, padding: "18px 20px", display: "flex", alignItems: "center", gap: 12, transition: ".2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(37,99,235,.3)"; (e.currentTarget as HTMLElement).style.background = "rgba(37,99,235,.05)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(37,99,235,.08)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.03)"; }}>
                  <span style={{ fontSize: 20 }}>📞</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#94a3b8" }}>{n}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="s3" style={{ padding: "80px 24px 100px", background: "rgba(0,0,0,.3)", borderTop: "1px solid rgba(37,99,235,.06)" }}>
          <div style={{ maxWidth: 780, margin: "0 auto" }}>
            <div className="sr" style={{ marginBottom: 48, textAlign: "center" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(37,99,235,.07)", border: "1px solid rgba(37,99,235,.15)", borderRadius: 999, padding: "6px 16px", fontSize: 13, color: "#60a5fa", fontWeight: 500, marginBottom: 16 }}>Pricing</div>
              <h2 style={{ fontSize: "clamp(28px,4.5vw,56px)", fontWeight: 900, letterSpacing: "-1.5px", lineHeight: 1.05 }}>
                Less than one<br /><span style={BG}>missed call.</span>
              </h2>
              <p style={{ color: "#475569", fontSize: 16, marginTop: 16 }}>One missed call = $300 lost. NeverMiss costs $149/month. The math is obvious.</p>
            </div>
            <div className="sr pricing-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(37,99,235,.1)", borderRadius: 22, padding: "40px 36px" }}>
                <div style={{ fontSize: 13, color: "#475569", marginBottom: 8 }}>Starter</div>
                <div style={{ fontSize: 60, fontWeight: 900, letterSpacing: "-3px", ...BG, lineHeight: 1 }}>$149</div>
                <div style={{ fontSize: 13, color: "#334155", marginBottom: 32 }}>per month · no contract</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 13, marginBottom: 36 }}>
                  {["Up to 200 calls/month", "Local US phone number", "24/7 AI answering", "Appointment booking", "Lead qualification", "SMS notification", "Call recordings", "Cancel anytime"].map((f, i) => (
                    <div key={i} style={{ display: "flex", gap: 11, alignItems: "center", fontSize: 14 }}>
                      <div style={{ width: 20, height: 20, borderRadius: "50%", background: "linear-gradient(135deg,#2563eb,#06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ color: "#fff", fontSize: 10, fontWeight: 800 }}>✓</span>
                      </div>
                      <span style={{ color: "#94a3b8" }}>{f}</span>
                    </div>
                  ))}
                </div>
                <MagBtn href="#contact" primary>Start free trial →</MagBtn>
              </div>
              <div style={{ padding: 2, borderRadius: 24, background: "linear-gradient(135deg,#2563eb,#06b6d4,#2563eb)", backgroundSize: "300%", animation: "gb 4s ease infinite" }}>
                <div style={{ background: "#04050f", borderRadius: 22, padding: "40px 36px", height: "100%" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 13, color: "#475569" }}>Growth</span>
                    <span style={{ background: "rgba(37,99,235,.1)", color: "#60a5fa", fontSize: 11, fontWeight: 700, borderRadius: 99, padding: "3px 10px", border: "1px solid rgba(37,99,235,.2)" }}>Most popular</span>
                  </div>
                  <div style={{ fontSize: 60, fontWeight: 900, letterSpacing: "-3px", ...BG, lineHeight: 1 }}>$249</div>
                  <div style={{ fontSize: 13, color: "#334155", marginBottom: 32 }}>per month · no contract</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 13, marginBottom: 36 }}>
                    {["Unlimited calls", "2 phone numbers", "Everything in Starter", "Custom AI personality & script", "CRM integration (HubSpot, Salesforce)", "Weekly performance reports", "Priority support", "Onboarding call included"].map((f, i) => (
                      <div key={i} style={{ display: "flex", gap: 11, alignItems: "center", fontSize: 14 }}>
                        <div style={{ width: 20, height: 20, borderRadius: "50%", background: "linear-gradient(135deg,#2563eb,#06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <span style={{ color: "#fff", fontSize: 10, fontWeight: 800 }}>✓</span>
                        </div>
                        <span style={{ color: "#94a3b8" }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <MagBtn href="#contact" primary>Start free trial →</MagBtn>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="contact" style={{ padding: "80px 24px 112px" }}>
          <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
            <div className="sr">
              <h2 style={{ fontSize: "clamp(28px,4.5vw,56px)", fontWeight: 900, letterSpacing: "-1.5px", lineHeight: 1.05, marginBottom: 14 }}>
                Stop losing jobs<br /><span style={BG}>to voicemail.</span>
              </h2>
              <p style={{ color: "#475569", fontSize: 17, marginBottom: 44, lineHeight: 1.65 }}>
                14-day free trial. Up and running in 10 minutes. No credit card required.
              </p>
              {sent ? (
                <div style={{ background: "rgba(37,99,235,.07)", border: "1px solid rgba(37,99,235,.18)", borderRadius: 16, padding: "28px", fontSize: 18, color: "#60a5fa", fontWeight: 600 }}>
                  🎉 You're on the list! We'll reach out within the hour.
                </div>
              ) : (
                <form onSubmit={e => { e.preventDefault(); if (email) setSent(true); }}
                  style={{ display: "flex", gap: 9, maxWidth: 460, margin: "0 auto", flexWrap: "wrap", justifyContent: "center" }}>
                  <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required
                    style={{ flex: 1, minWidth: 200, background: "rgba(255,255,255,.05)", border: "1.5px solid rgba(37,99,235,.15)", borderRadius: 12, padding: "14px 18px", color: "#f0f4ff", fontSize: 15, outline: "none", fontFamily: "inherit" }}
                    onFocus={e => { (e.target as HTMLInputElement).style.borderColor = "rgba(37,99,235,.5)"; }}
                    onBlur={e => { (e.target as HTMLInputElement).style.borderColor = "rgba(37,99,235,.15)"; }} />
                  <button type="submit" style={{ background: "linear-gradient(135deg,#2563eb,#06b6d4)", color: "#fff", padding: "14px 28px", borderRadius: 12, fontSize: 15, fontWeight: 700, border: "none", cursor: "none", fontFamily: "inherit", boxShadow: "0 8px 24px rgba(37,99,235,.35)" }}>
                    Start free →
                  </button>
                </form>
              )}
              <p style={{ marginTop: 16, fontSize: 13, color: "#334155" }}>
                Or email us at <a href="mailto:contact@mindforge-ia.com" style={{ color: "#60a5fa", textDecoration: "none" }}>contact@mindforge-ia.com</a>
              </p>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ padding: "24px clamp(20px,4vw,48px)", borderTop: "1px solid rgba(37,99,235,.07)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, background: "rgba(0,0,0,.4)" }}>
          <span style={{ fontWeight: 900, fontSize: 17 }}>Never<span style={BG}>Miss</span></span>
          <span style={{ fontSize: 13, color: "#334155" }}>© 2026 NeverMiss · All rights reserved</span>
          <a href="mailto:contact@mindforge-ia.com" style={{ fontSize: 13, color: "#334155", textDecoration: "none" }}>contact@mindforge-ia.com</a>
        </footer>
      </div>
    </>
  );
}
