"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Color tokens ───────────────────────────────────────────────────────────
const C = {
  bg: "#0b0f1e",
  card: "#111827",
  border: "#1e2d4a",
  teal: "#00d4a8",
  tealHover: "#00b894",
  white: "#ffffff",
  gray: "#94a3b8",
  muted: "#475569",
  danger: "#ef4444",
};

// ─── Shared button styles ────────────────────────────────────────────────────
const btnTeal = {
  background: C.teal,
  color: "#000",
  border: "none",
  padding: "12px 24px",
  borderRadius: "8px",
  fontWeight: 700,
  fontSize: "15px",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  transition: "background 0.2s",
  whiteSpace: "nowrap" as const,
};
const btnDark = {
  background: "transparent",
  color: C.white,
  border: `1.5px solid ${C.border}`,
  padding: "12px 24px",
  borderRadius: "8px",
  fontWeight: 600,
  fontSize: "15px",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  transition: "border-color 0.2s, background 0.2s",
  whiteSpace: "nowrap" as const,
};

// ─── Section label ────────────────────────────────────────────────────────────
function Label({ text }: { text: string }) {
  return (
    <p style={{ color: C.teal, fontSize: "12px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>
      {text}
    </p>
  );
}

// ─── Section wrapper ─────────────────────────────────────────────────────────
function Section({ id, children, style }: { id?: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <section id={id} style={{ padding: "96px 0", position: "relative", ...style }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        {children}
      </div>
    </section>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
function Card({ children, style, highlighted }: { children: React.ReactNode; style?: React.CSSProperties; highlighted?: boolean }) {
  return (
    <div style={{
      background: highlighted ? `${C.card}` : C.card,
      border: `1.5px solid ${highlighted ? C.teal : C.border}`,
      borderRadius: "12px",
      padding: "24px",
      position: "relative",
      ...style,
    }}>
      {children}
    </div>
  );
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? "rgba(11,15,30,0.95)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? `1px solid ${C.border}` : "none",
      transition: "all 0.3s",
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "68px" }}>
        {/* Logo */}
        <a href="#" style={{ textDecoration: "none", fontSize: "20px", fontWeight: 800, color: C.white }}>
          Never<span style={{ color: C.teal }}>Miss</span>
        </a>

        {/* Links */}
        <div className="nav-links" style={{ display: "flex", gap: "32px" }}>
          {["How it works", "Features", "Integrations", "Pricing", "FAQ"].map((link) => (
            <a key={link} href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
              style={{ color: C.gray, textDecoration: "none", fontSize: "14px", fontWeight: 500, transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.white)}
              onMouseLeave={e => (e.currentTarget.style.color = C.gray)}>
              {link}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <a href="#" style={{ color: C.gray, textDecoration: "none", fontSize: "14px", fontWeight: 500 }}>Sign in</a>
          <button style={{ ...btnTeal, padding: "9px 18px", fontSize: "14px" }}
            onMouseEnter={e => (e.currentTarget.style.background = C.tealHover)}
            onMouseLeave={e => (e.currentTarget.style.background = C.teal)}>
            Start free →
          </button>
        </div>
      </div>
    </nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{ paddingTop: "140px", paddingBottom: "80px", background: C.bg }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }}>

          {/* LEFT */}
          <div>
            {/* Badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: `rgba(0,212,168,0.08)`, border: `1px solid rgba(0,212,168,0.25)`,
              borderRadius: "100px", padding: "6px 14px", marginBottom: "28px",
              fontSize: "13px", color: C.teal, fontWeight: 600,
            }}>
              🤖 AI-powered voice receptionist
            </div>

            {/* H1 */}
            <h1 style={{ fontSize: "clamp(36px,5vw,58px)", fontWeight: 800, lineHeight: 1.1, marginBottom: "20px", color: C.white }}>
              Never miss a call.<br />
              <span style={{ color: C.teal }}>Never lose a customer.</span>
            </h1>

            {/* Subtitle */}
            <p style={{ fontSize: "18px", color: C.gray, lineHeight: 1.7, marginBottom: "36px", maxWidth: "480px" }}>
              AI receptionist that answers calls, books appointments, and captures leads 24/7 — built for service businesses.
            </p>

            {/* CTAs */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "28px" }}>
              <button style={btnTeal}
                onMouseEnter={e => (e.currentTarget.style.background = C.tealHover)}
                onMouseLeave={e => (e.currentTarget.style.background = C.teal)}>
                Start free — no card needed →
              </button>
              <button style={btnDark}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.background = "rgba(0,212,168,0.05)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = "transparent"; }}>
                📞 Try live demo
              </button>
            </div>

            {/* Trust */}
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              {["50 free calls included", "No credit card required", "Setup in under 10 minutes"].map((t) => (
                <span key={t} style={{ fontSize: "13px", color: C.gray, display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ color: C.teal, fontWeight: 700 }}>✓</span> {t}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT — Chat mockup */}
          <div style={{ position: "relative" }}>
            {/* Floating badge top-right */}
            <div className="float-badge" style={{
              position: "absolute", top: "-20px", right: "-10px", zIndex: 2,
              background: C.card, border: `1px solid ${C.border}`, borderRadius: "10px",
              padding: "10px 14px", fontSize: "12px", color: C.white, fontWeight: 600,
            }}>
              ⭐ 4.9 customer rating<br />
              <span style={{ color: C.muted, fontWeight: 400 }}>Post-call surveys</span>
            </div>

            {/* Main card */}
            <div style={{
              background: C.card, border: `1.5px solid ${C.border}`, borderRadius: "16px",
              overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
            }}>
              {/* Header */}
              <div style={{
                background: "#0d1526", padding: "14px 20px", display: "flex", alignItems: "center", gap: "10px",
                borderBottom: `1px solid ${C.border}`,
              }}>
                <span className="pulse-dot" style={{
                  width: "10px", height: "10px", borderRadius: "50%", background: C.teal,
                  display: "inline-block",
                }} />
                <span style={{ fontWeight: 700, fontSize: "14px", color: C.white }}>AI Receptionist Active</span>
                <span style={{ marginLeft: "auto", fontSize: "12px", color: C.muted }}>NeverMiss</span>
              </div>

              {/* Chat bubbles */}
              <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "12px", minHeight: "260px" }}>
                {/* Caller 1 */}
                <div className="chat-bubble" style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#1e2d4a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", flexShrink: 0 }}>👤</div>
                  <div>
                    <p style={{ fontSize: "11px", color: C.muted, marginBottom: "4px" }}>CALLER</p>
                    <div style={{ background: "#1e2d4a", borderRadius: "0 10px 10px 10px", padding: "10px 14px", fontSize: "14px", color: C.white, maxWidth: "260px" }}>
                      Hi, I&apos;d like to book a plumbing inspection for Thursday.
                    </div>
                  </div>
                </div>

                {/* AI 1 */}
                <div className="chat-bubble" style={{ display: "flex", gap: "8px", alignItems: "flex-start", justifyContent: "flex-end" }}>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "11px", color: C.teal, marginBottom: "4px" }}>NEVERMISS AI</p>
                    <div style={{ background: `rgba(0,212,168,0.1)`, border: `1px solid rgba(0,212,168,0.2)`, borderRadius: "10px 0 10px 10px", padding: "10px 14px", fontSize: "14px", color: C.white, maxWidth: "280px" }}>
                      Of course! I have Thursday at 10am and 2pm available. Which works better?
                    </div>
                  </div>
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: `rgba(0,212,168,0.15)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", flexShrink: 0 }}>🤖</div>
                </div>

                {/* Caller 2 */}
                <div className="chat-bubble" style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#1e2d4a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", flexShrink: 0 }}>👤</div>
                  <div>
                    <p style={{ fontSize: "11px", color: C.muted, marginBottom: "4px" }}>CALLER</p>
                    <div style={{ background: "#1e2d4a", borderRadius: "0 10px 10px 10px", padding: "10px 14px", fontSize: "14px", color: C.white, maxWidth: "260px" }}>
                      2pm would be great.
                    </div>
                  </div>
                </div>

                {/* AI 2 */}
                <div className="chat-bubble" style={{ display: "flex", gap: "8px", alignItems: "flex-start", justifyContent: "flex-end" }}>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "11px", color: C.teal, marginBottom: "4px" }}>NEVERMISS AI</p>
                    <div style={{ background: `rgba(0,212,168,0.1)`, border: `1px solid rgba(0,212,168,0.2)`, borderRadius: "10px 0 10px 10px", padding: "10px 14px", fontSize: "14px", color: C.white, maxWidth: "280px" }}>
                      Perfect — you&apos;re booked for Thursday at 2pm. I&apos;ll send you a confirmation text.
                    </div>
                  </div>
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: `rgba(0,212,168,0.15)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", flexShrink: 0 }}>🤖</div>
                </div>
              </div>

              {/* Bottom badge */}
              <div className="chat-status" style={{
                margin: "0 20px 20px", background: "rgba(0,212,168,0.06)", border: `1px solid rgba(0,212,168,0.2)`,
                borderRadius: "8px", padding: "10px 14px", fontSize: "13px", color: C.teal, fontWeight: 600, textAlign: "center",
              }}>
                ✓ Appointment booked · SMS sent · Calendar updated
              </div>
            </div>

            {/* Floating badge bottom */}
            <div className="float-badge-2" style={{
              position: "absolute", bottom: "-16px", left: "-10px", zIndex: 2,
              background: C.card, border: `1px solid ${C.border}`, borderRadius: "10px",
              padding: "10px 14px", fontSize: "12px", color: C.white, fontWeight: 600,
            }}>
              📊 98% booking accuracy<br />
              <span style={{ color: C.muted, fontWeight: 400 }}>Zero double-bookings</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ─── STATS BAR ────────────────────────────────────────────────────────────────
function StatsBar() {
  const stats = [
    { value: "98%", label: "Call answer rate" },
    { value: "10 min", label: "Average setup" },
    { value: "24/7", label: "Always available" },
    { value: "50+", label: "Integrations" },
  ];
  return (
    <div style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, background: C.card }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "0" }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              padding: "32px 24px", textAlign: "center",
              borderRight: i < stats.length - 1 ? `1px solid ${C.border}` : "none",
            }}>
              <p style={{ fontSize: "36px", fontWeight: 800, color: C.teal, marginBottom: "4px" }}>{s.value}</p>
              <p style={{ fontSize: "14px", color: C.gray }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── THE PROBLEM ──────────────────────────────────────────────────────────────
function TheProblem() {
  const cards = [
    { stat: "62%", desc: "of small business calls go unanswered", biggest: false },
    { stat: "$4,800", desc: "lost revenue per month from missed calls", biggest: true },
    { stat: "85%", desc: "of callers won't call back if unanswered", biggest: false },
    { stat: "27%", desc: "of revenue lost to poor phone handling", biggest: false },
  ];
  return (
    <Section id="the-problem">
      <div style={{ textAlign: "center", marginBottom: "56px" }}>
        <Label text="THE PROBLEM" />
        <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, color: C.white, marginBottom: "16px" }}>
          Missed calls are <span style={{ color: C.teal }}>killing</span> your revenue
        </h2>
        <p style={{ fontSize: "18px", color: C.gray, maxWidth: "480px", margin: "0 auto" }}>
          Every unanswered call is a customer you&apos;ll never get back.
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "20px" }}>
        {cards.map((c, i) => (
          <div key={i} className="reveal" style={{ position: "relative" }}>
            {c.biggest && (
              <div style={{
                position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)",
                background: C.danger, color: C.white, fontSize: "10px", fontWeight: 800,
                padding: "3px 10px", borderRadius: "100px", letterSpacing: "1px", whiteSpace: "nowrap",
              }}>
                BIGGEST LOSS
              </div>
            )}
            <Card highlighted={c.biggest}>
              <p style={{ fontSize: "42px", fontWeight: 800, color: c.biggest ? C.danger : C.teal, marginBottom: "12px" }}>{c.stat}</p>
              <p style={{ fontSize: "15px", color: C.gray, lineHeight: 1.5 }}>{c.desc}</p>
            </Card>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─── HOW IT WORKS ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      num: "01", icon: "🔗", title: "Paste your website URL",
      desc: "Our AI reads your entire website in seconds. Services, pricing, hours, FAQ. No manual setup needed.",
    },
    {
      num: "02", icon: "🤖", title: "AI builds your receptionist",
      desc: "A custom voice agent is created with your business knowledge. Speaks naturally, answers questions, books appointments.",
    },
    {
      num: "03", icon: "📞", title: "Go live in minutes",
      desc: "Get a dedicated phone number. Forward your business line. Your AI receptionist starts answering calls immediately — 24/7.",
    },
  ];
  return (
    <Section id="how-it-works" style={{ background: `${C.card}10` }}>
      <div style={{ textAlign: "center", marginBottom: "56px" }}>
        <Label text="HOW IT WORKS" />
        <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, color: C.white, marginBottom: "16px" }}>
          Live in 3 steps. Under 10 minutes.
        </h2>
        <p style={{ fontSize: "18px", color: C.gray }}>
          No technical skills needed. If you have a website, you&apos;re ready to go.
        </p>
      </div>
      <div className="how-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "32px" }}>
        {steps.map((s) => (
          <div key={s.num} className="reveal" style={{ position: "relative" }}>
            <div style={{ fontSize: "80px", fontWeight: 900, color: "#ffffff08", position: "absolute", top: "-10px", left: "0", lineHeight: 1, userSelect: "none" }}>{s.num}</div>
            <Card style={{ paddingTop: "36px" }}>
              <div style={{ width: "44px", height: "44px", background: `rgba(0,212,168,0.15)`, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", marginBottom: "16px" }}>
                {s.icon}
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: C.white, marginBottom: "10px" }}>{s.title}</h3>
              <p style={{ fontSize: "15px", color: C.gray, lineHeight: 1.6 }}>{s.desc}</p>
            </Card>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─── BEFORE / AFTER ───────────────────────────────────────────────────────────
function BeforeAfter() {
  const without = [
    { main: "Missed call from (555) 234-5678", sub: "Potential customer — gone" },
    { main: 'Voicemail: "Hi, I wanted to book..."', sub: "Never listened to" },
    { main: "Missed call from (555) 876-5432", sub: "Called your competitor instead" },
    { main: "After-hours call — no one available", sub: "Lost a $400 job" },
  ];
  const with_ = [
    { main: "AI answered — booked plumbing job for Mike R.", sub: "Thursday 2pm confirmed" },
    { main: "AI answered — provided pricing, sent SMS", sub: "Lead captured and followed up" },
    { main: "AI answered — scheduled consultation for James R.", sub: "New customer acquired" },
    { main: "After-hours call handled by AI", sub: "Appointment booked at 11pm" },
  ];
  return (
    <Section>
      <div style={{ textAlign: "center", marginBottom: "56px" }}>
        <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, color: C.white, marginBottom: "16px" }}>
          Same calls. Completely different outcomes.
        </h2>
        <p style={{ fontSize: "18px", color: C.gray }}>
          See what happens when every call gets answered — even at 2am on a Sunday.
        </p>
      </div>
      <div className="before-after-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Without */}
        <Card style={{ borderColor: "rgba(239,68,68,0.3)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
            <span style={{ fontSize: "18px" }}>❌</span>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#ef4444" }}>Without NeverMiss</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {without.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <span style={{ color: C.danger, fontWeight: 700, marginTop: "2px", flexShrink: 0 }}>✗</span>
                <div>
                  <p style={{ fontSize: "14px", color: C.white, fontWeight: 500 }}>{item.main}</p>
                  <p style={{ fontSize: "13px", color: C.muted }}>{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: `1px solid rgba(239,68,68,0.2)`, fontSize: "14px", fontWeight: 700, color: C.danger }}>
            4 missed calls = $1,800+ lost this week
          </div>
        </Card>

        {/* With */}
        <Card style={{ borderColor: "rgba(0,212,168,0.3)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
            <span style={{ fontSize: "18px" }}>✅</span>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: C.teal }}>With NeverMiss</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {with_.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <span style={{ color: C.teal, fontWeight: 700, marginTop: "2px", flexShrink: 0 }}>✓</span>
                <div>
                  <p style={{ fontSize: "14px", color: C.white, fontWeight: 500 }}>{item.main}</p>
                  <p style={{ fontSize: "13px", color: C.muted }}>{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: `1px solid rgba(0,212,168,0.2)`, fontSize: "14px", fontWeight: 700, color: C.teal }}>
            4 calls answered = 3 appointments booked
          </div>
        </Card>
      </div>
    </Section>
  );
}

// ─── FEATURES ─────────────────────────────────────────────────────────────────
function Features() {
  const tabs = ["Call Management", "Booking & Scheduling", "CRM & Customers", "AI Intelligence", "Multi-Channel"];
  const [active, setActive] = useState(0);

  const features = [
    { icon: "📞", title: "24/7 call answering", desc: "AI answers every call instantly. No hold times, no voicemail." },
    { icon: "📲", title: "Smart call transfer", desc: "AI knows when to handle and when to transfer. Custom routing." },
    { icon: "🎧", title: "Call recordings & playback", desc: "Every call recorded in your dashboard." },
    { icon: "📋", title: "AI call summaries", desc: "Key details, action items, follow-ups extracted instantly." },
    { icon: "🛡️", title: "Spam filtering", desc: "Blocks robocalls and telemarketers. Only real customers get through." },
    { icon: "📊", title: "Call analytics", desc: "Track volume, peak hours, conversion rates." },
  ];

  return (
    <Section id="features" style={{ background: `${C.card}20` }}>
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <Label text="FEATURES" />
        <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, color: C.white, marginBottom: "16px" }}>
          Everything you need. Nothing you don&apos;t.
        </h2>
        <p style={{ fontSize: "18px", color: C.gray }}>40+ features built for businesses that care about every customer call.</p>
      </div>

      {/* Tab nav */}
      <div style={{ display: "flex", gap: "0", borderBottom: `1px solid ${C.border}`, marginBottom: "40px", overflowX: "auto" }}>
        {tabs.map((t, i) => (
          <button key={t} onClick={() => setActive(i)} style={{
            background: "none", border: "none", cursor: "pointer",
            padding: "12px 20px", fontSize: "14px", fontWeight: 600, whiteSpace: "nowrap",
            color: active === i ? C.teal : C.gray,
            borderBottom: active === i ? `2px solid ${C.teal}` : "2px solid transparent",
            transition: "all 0.2s",
          }}>
            {t}
          </button>
        ))}
      </div>

      {/* Feature grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "20px" }}>
        {features.map((f, i) => (
          <div key={i} className="reveal">
            <Card>
              <div style={{ fontSize: "28px", marginBottom: "12px" }}>{f.icon}</div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: C.white, marginBottom: "8px" }}>{f.title}</h3>
              <p style={{ fontSize: "14px", color: C.gray, lineHeight: 1.6 }}>{f.desc}</p>
            </Card>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─── INTEGRATIONS ─────────────────────────────────────────────────────────────
function Integrations() {
  const items = [
    { icon: "📅", name: "Google Calendar", desc: "Sync bookings automatically", tag: "Calendar", tagColor: "#3b82f6" },
    { icon: "🗓️", name: "Calendly", desc: "Connect your scheduling links", tag: "Calendar", tagColor: "#3b82f6" },
    { icon: "💬", name: "WhatsApp", desc: "Send confirmations via WhatsApp", tag: "Messaging", tagColor: "#22c55e" },
    { icon: "📱", name: "Twilio", desc: "Reliable SMS & voice backbone", tag: "Telecom", tagColor: "#8b5cf6" },
    { icon: "🏢", name: "Google Business", desc: "Manage your business profile", tag: "Business", tagColor: "#f59e0b" },
    { icon: "💳", name: "Stripe", desc: "Collect deposits over the phone", tag: "Payments", tagColor: "#6366f1" },
    { icon: "🎙️", name: "Vapi.ai", desc: "Ultra-realistic voice AI engine", tag: "Voice AI", tagColor: "#00d4a8" },
    { icon: "🔗", name: "Webhooks", desc: "Send data to any platform", tag: "Developer", tagColor: "#64748b" },
    { icon: "🔊", name: "ElevenLabs", desc: "Natural voice synthesis", tag: "Voice", tagColor: "#ec4899" },
    { icon: "📲", name: "SMS / Twilio", desc: "2-way SMS with customers", tag: "Messaging", tagColor: "#22c55e" },
  ];
  return (
    <Section id="integrations">
      <div style={{ textAlign: "center", marginBottom: "56px" }}>
        <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, color: C.white, marginBottom: "16px" }}>
          Connects with tools you already use
        </h2>
        <p style={{ fontSize: "18px", color: C.gray }}>
          NeverMiss integrates with your calendar, messaging, and business tools out of the box.
        </p>
      </div>
      <div className="integration-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "16px" }}>
        {items.map((item, i) => (
          <div key={i} className="reveal">
            <Card style={{ padding: "20px", textAlign: "center" }}>
              <div style={{ fontSize: "32px", marginBottom: "10px" }}>{item.icon}</div>
              <p style={{ fontSize: "14px", fontWeight: 700, color: C.white, marginBottom: "4px" }}>{item.name}</p>
              <p style={{ fontSize: "12px", color: C.muted, marginBottom: "10px", lineHeight: 1.4 }}>{item.desc}</p>
              <span style={{ fontSize: "11px", fontWeight: 700, color: item.tagColor, background: `${item.tagColor}18`, padding: "2px 8px", borderRadius: "100px" }}>
                {item.tag}
              </span>
            </Card>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─── COMPARISON TABLE ─────────────────────────────────────────────────────────
function ComparisonTable() {
  const Y = <span className="comp-yes" style={{ color: C.teal, fontWeight: 700 }}>✓</span>;
  const N = <span className="comp-no" style={{ color: C.danger, fontWeight: 700 }}>✗</span>;
  const M = <span className="comp-maybe" style={{ color: C.muted }}>—</span>;

  const rows: [string, React.ReactNode, React.ReactNode, React.ReactNode][] = [
    ["24/7 availability", N, N, Y],
    ["Answers instantly", N, Y, Y],
    ["Books appointments", N, Y, Y],
    ["Sends SMS confirmations", N, M, Y],
    ["Captures caller info", N, Y, Y],
    ["Handles multiple calls at once", N, N, Y],
    ["Never calls in sick", Y, N, Y],
    ["Call analytics", N, N, Y],
    ["Sentiment analysis", N, N, Y],
    ["Customer CRM", N, N, Y],
    ["WhatsApp integration", N, N, Y],
    ["Monthly cost", "$0*", "$2,500+", <span key="nm" style={{ color: C.teal, fontWeight: 800 }}>$149</span>],
  ];

  return (
    <Section style={{ background: `${C.card}20` }}>
      <div style={{ textAlign: "center", marginBottom: "56px" }}>
        <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, color: C.white }}>Why NeverMiss?</h2>
      </div>
      <div className="comp-table-wrap">
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
          <thead>
            <tr>
              {["Feature", "Voicemail", "Human receptionist", "NeverMiss"].map((h, i) => (
                <th key={h} style={{
                  padding: "14px 20px", textAlign: i === 0 ? "left" : "center",
                  color: i === 3 ? C.teal : C.gray, fontWeight: 700, fontSize: i === 3 ? "15px" : "14px",
                  borderBottom: `1px solid ${C.border}`,
                  background: i === 3 ? `rgba(0,212,168,0.05)` : "transparent",
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([feat, vm, human, nm], i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? `${C.card}50` : "transparent" }}>
                <td style={{ padding: "14px 20px", color: C.gray, textAlign: "left" }}>{feat}</td>
                <td style={{ padding: "14px 20px", textAlign: "center", color: C.white }}>{vm}</td>
                <td style={{ padding: "14px 20px", textAlign: "center", color: C.white }}>{human}</td>
                <td style={{ padding: "14px 20px", textAlign: "center", color: C.white, background: "rgba(0,212,168,0.03)" }}>{nm}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ marginTop: "12px", fontSize: "12px", color: C.muted }}>* Voicemail is free, but costs ~$4,800/mo in lost revenue.</p>
      </div>
    </Section>
  );
}

// ─── INDUSTRIES ───────────────────────────────────────────────────────────────
function Industries() {
  const list = [
    { icon: "🔧", name: "HVAC & Plumbing", desc: "Book service calls, answer pricing questions, dispatch technicians.", metric: "3x more jobs booked after-hours" },
    { icon: "🏠", name: "Roofing & Construction", desc: "Capture leads, schedule estimates, follow up on quotes.", metric: "Cut missed call rate by 90%" },
    { icon: "⚡", name: "Electricians", desc: "Handle emergency calls, schedule inspections, provide pricing.", metric: "Never miss an emergency job" },
    { icon: "⚖️", name: "Law Firms", desc: "Capture every lead, qualify potential clients, schedule consultations 24/7.", metric: "Never miss a potential client call" },
    { icon: "🦷", name: "Dental Clinics", desc: "Book cleanings, answer insurance questions, confirm appointments.", metric: "3x more appointments booked after-hours" },
    { icon: "💆", name: "Med Spas & Aesthetics", desc: "Professional first impression for high-value consultations.", metric: "40% increase in bookings" },
    { icon: "🐾", name: "Veterinary Clinics", desc: "Handle urgent pet calls with empathy. Triage by symptoms.", metric: "24/7 emergency call triage" },
    { icon: "🏡", name: "Real Estate Agents", desc: "Capture buyer and seller leads instantly. Schedule viewings.", metric: "2x more leads captured per week" },
  ];
  return (
    <Section id="industries">
      <div style={{ textAlign: "center", marginBottom: "56px" }}>
        <Label text="INDUSTRIES" />
        <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, color: C.white, marginBottom: "16px" }}>
          Built for service businesses
        </h2>
        <p style={{ fontSize: "18px", color: C.gray, maxWidth: "560px", margin: "0 auto" }}>
          Whether you run a plumbing company or a law firm, NeverMiss speaks your industry&apos;s language.
        </p>
      </div>
      <div className="industry-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px" }}>
        {list.map((item, i) => (
          <div key={i} className="reveal">
            <Card style={{ height: "100%" }}>
              <div style={{ fontSize: "30px", marginBottom: "12px" }}>{item.icon}</div>
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: C.white, marginBottom: "8px" }}>{item.name}</h3>
              <p style={{ fontSize: "13px", color: C.gray, lineHeight: 1.5, marginBottom: "14px" }}>{item.desc}</p>
              <p style={{ fontSize: "12px", color: C.teal, fontWeight: 700 }}>↗ {item.metric}</p>
            </Card>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
function Testimonials() {
  const topStats = [
    { value: "98%", label: "Call answer rate" },
    { value: "5/5", label: "Customer satisfaction" },
    { value: "10 min", label: "Average setup" },
    { value: "Zero", label: "Missed calls" },
  ];
  const reviews = [
    {
      stars: 5, quote: "We were losing 8-10 calls every weekend. NeverMiss picks up every single one now. We've booked 23 extra jobs this month alone.",
      name: "Mike Thompson", company: "Thompson Plumbing & HVAC",
    },
    {
      stars: 5, quote: "Setting it up took literally 7 minutes. I pasted my website URL, chose a voice, and it was live. My customers can't tell it's AI.",
      name: "Sarah Johnson", company: "SJ Electric",
    },
  ];
  return (
    <Section style={{ background: `${C.card}20` }}>
      <div style={{ textAlign: "center", marginBottom: "56px" }}>
        <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, color: C.white }}>
          Trusted by businesses that never miss a beat
        </h2>
      </div>

      {/* Top stats */}
      <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px", marginBottom: "48px" }}>
        {topStats.map((s, i) => (
          <div key={i} style={{ textAlign: "center", padding: "24px", background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px" }}>
            <p style={{ fontSize: "32px", fontWeight: 800, color: C.teal }}>{s.value}</p>
            <p style={{ fontSize: "14px", color: C.gray, marginTop: "4px" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {reviews.map((r, i) => (
          <div key={i} className="reveal">
          <Card>
            <div style={{ marginBottom: "16px" }}>{"⭐".repeat(r.stars)}</div>
            <p style={{ fontSize: "16px", color: C.white, lineHeight: 1.7, fontStyle: "italic", marginBottom: "20px" }}>
              &ldquo;{r.quote}&rdquo;
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: `rgba(0,212,168,0.15)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>
                {r.name[0]}
              </div>
              <div>
                <p style={{ fontWeight: 700, color: C.white, fontSize: "14px" }}>{r.name}</p>
                <p style={{ fontSize: "13px", color: C.muted }}>{r.company}</p>
              </div>
            </div>
          </Card>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─── PRICING ──────────────────────────────────────────────────────────────────
function Pricing() {
  const starterFeatures = [
    "Up to 200 calls/month", "Local US phone number", "24/7 AI answering", "Appointment booking",
    "SMS confirmations", "Call recordings", "Cancel anytime",
  ];
  const growthFeatures = [
    "Unlimited calls", "2 phone numbers", "Everything in Starter", "Custom AI personality",
    "CRM integration", "Weekly reports", "Priority support", "Onboarding call",
  ];
  return (
    <Section id="pricing">
      <div style={{ textAlign: "center", marginBottom: "56px" }}>
        <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, color: C.white, marginBottom: "16px" }}>
          Simple pricing. Serious results.
        </h2>
      </div>

      <div className="pricing-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", maxWidth: "800px", margin: "0 auto" }}>
        {/* Starter */}
        <Card>
          <p style={{ fontSize: "13px", fontWeight: 700, color: C.muted, letterSpacing: "1px", marginBottom: "8px" }}>STARTER</p>
          <div style={{ marginBottom: "24px" }}>
            <span style={{ fontSize: "48px", fontWeight: 800, color: C.white }}>$149</span>
            <span style={{ color: C.muted, fontSize: "15px" }}>/mo</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
            {starterFeatures.map((f) => (
              <div key={f} style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "14px", color: C.gray }}>
                <span style={{ color: C.teal, fontWeight: 700 }}>✓</span> {f}
              </div>
            ))}
          </div>
          <button style={{ ...btnDark, width: "100%", justifyContent: "center" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.background = "rgba(0,212,168,0.05)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = "transparent"; }}>
            Get started
          </button>
        </Card>

        {/* Growth */}
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", background: C.teal, color: "#000", fontSize: "11px", fontWeight: 800, padding: "3px 12px", borderRadius: "100px", whiteSpace: "nowrap" }}>
            MOST POPULAR
          </div>
          <Card highlighted style={{ paddingTop: "32px" }}>
            <p style={{ fontSize: "13px", fontWeight: 700, color: C.teal, letterSpacing: "1px", marginBottom: "8px" }}>GROWTH</p>
            <div style={{ marginBottom: "24px" }}>
              <span style={{ fontSize: "48px", fontWeight: 800, color: C.white }}>$249</span>
              <span style={{ color: C.muted, fontSize: "15px" }}>/mo</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
              {growthFeatures.map((f) => (
                <div key={f} style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "14px", color: C.gray }}>
                  <span style={{ color: C.teal, fontWeight: 700 }}>✓</span> {f}
                </div>
              ))}
            </div>
            <button style={{ ...btnTeal, width: "100%", justifyContent: "center" }}
              onMouseEnter={e => (e.currentTarget.style.background = C.tealHover)}
              onMouseLeave={e => (e.currentTarget.style.background = C.teal)}>
              Start free →
            </button>
          </Card>
        </div>
      </div>

      {/* Comparison note */}
      <div style={{ display: "flex", justifyContent: "center", gap: "40px", marginTop: "48px", flexWrap: "wrap" }}>
        {[
          { label: "Voicemail", cost: "$0", sub: "but $4,800/mo in lost revenue", color: C.danger },
          { label: "Human receptionist", cost: "$2,500+/mo", sub: "plus sick days & training", color: C.muted },
          { label: "NeverMiss", cost: "from $149/mo", sub: "no setup fees, cancel anytime", color: C.teal },
        ].map((c, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <p style={{ fontSize: "13px", color: C.muted, marginBottom: "4px" }}>vs {c.label}</p>
            <p style={{ fontSize: "22px", fontWeight: 800, color: c.color }}>{c.cost}</p>
            <p style={{ fontSize: "12px", color: C.muted }}>{c.sub}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const items = [
    { q: "How long does setup take?", a: "Under 10 minutes. Paste your URL, pick a voice, get a number. Your AI receptionist is live before your next cup of coffee." },
    { q: "Can callers tell it's AI?", a: "Most can't. Our voices are incredibly natural. You can disclose it or not — your choice." },
    { q: "What if I already have a phone number?", a: "Forward it to your NeverMiss number. Keep your existing number, your customers keep dialing the same number." },
    { q: "What happens after my free trial?", a: "You choose a plan. No automatic charges without your approval. We'll remind you before anything is billed." },
    { q: "Can I customize what the AI says?", a: "Yes. The AI learns from your website, and you can add custom instructions, FAQs, pricing — anything you want it to know." },
  ];
  return (
    <Section id="faq" style={{ background: `${C.card}20` }}>
      <div style={{ textAlign: "center", marginBottom: "56px" }}>
        <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, color: C.white }}>Frequently asked questions</h2>
      </div>
      <div style={{ maxWidth: "720px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "12px" }}>
        {items.map((item, i) => (
          <div key={i} style={{
            background: C.card, border: `1px solid ${open === i ? C.teal : C.border}`,
            borderRadius: "10px", overflow: "hidden", transition: "border-color 0.2s",
          }}>
            <button onClick={() => setOpen(open === i ? null : i)} style={{
              width: "100%", textAlign: "left", padding: "18px 20px", background: "none", border: "none",
              cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px",
            }}>
              <span style={{ fontWeight: 600, color: C.white, fontSize: "15px" }}>{item.q}</span>
              <span style={{ color: C.teal, fontSize: "20px", lineHeight: 1, transform: open === i ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
            </button>
            <div className={`faq-content${open === i ? " open" : ""}`} style={{ padding: open === i ? "0 20px 18px" : "0 20px" }}>
              <p style={{ fontSize: "15px", color: C.gray, lineHeight: 1.7 }}>{item.a}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─── CTA FINAL ────────────────────────────────────────────────────────────────
function FinalCTA() {
  const [email, setEmail] = useState("");
  return (
    <section style={{ padding: "96px 0", background: `radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,212,168,0.08) 0%, transparent 70%), ${C.bg}` }}>
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, color: C.white, marginBottom: "16px" }}>
          Stop losing jobs to voicemail.
        </h2>
        <p style={{ fontSize: "18px", color: C.gray, marginBottom: "40px" }}>
          14-day free trial. 50 free calls included. No credit card required.
        </p>
        <div style={{ display: "flex", gap: "12px", maxWidth: "480px", margin: "0 auto 24px" }}>
          <input
            type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)}
            style={{
              flex: 1, padding: "13px 16px", borderRadius: "8px", border: `1.5px solid ${C.border}`,
              background: C.card, color: C.white, fontSize: "15px", outline: "none",
            }}
            onFocus={e => (e.currentTarget.style.borderColor = C.teal)}
            onBlur={e => (e.currentTarget.style.borderColor = C.border)}
          />
          <button style={btnTeal}
            onMouseEnter={e => (e.currentTarget.style.background = C.tealHover)}
            onMouseLeave={e => (e.currentTarget.style.background = C.teal)}>
            Start free →
          </button>
        </div>
        <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}>
          {["Setup in 10 minutes", "No credit card", "Cancel anytime"].map((t) => (
            <span key={t} style={{ fontSize: "13px", color: C.muted }}>✓ {t}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  const links: Record<string, string[]> = {
    Product: ["Features", "Integrations", "Pricing", "Changelog"],
    Company: ["About", "Blog", "Careers", "Contact"],
    Resources: ["Docs", "API", "Status", "Support"],
  };
  return (
    <footer style={{ borderTop: `1px solid ${C.border}`, background: C.card, padding: "60px 0 32px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "48px", marginBottom: "48px" }}>
          {/* Brand */}
          <div>
            <p style={{ fontSize: "22px", fontWeight: 800, color: C.white, marginBottom: "12px" }}>
              Never<span style={{ color: C.teal }}>Miss</span>
            </p>
            <p style={{ fontSize: "14px", color: C.muted, lineHeight: 1.6 }}>AI receptionist for service businesses</p>
          </div>
          {/* Links */}
          {Object.entries(links).map(([cat, items]) => (
            <div key={cat}>
              <p style={{ fontSize: "12px", fontWeight: 700, color: C.muted, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "16px" }}>{cat}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {items.map(item => (
                  <a key={item} href="#" style={{ fontSize: "14px", color: C.gray, textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = C.white)}
                    onMouseLeave={e => (e.currentTarget.style.color = C.gray)}>
                    {item}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <p style={{ fontSize: "13px", color: C.muted }}>© 2026 NeverMiss · contact@mindforge-ia.com</p>
          <p style={{ fontSize: "13px", color: C.muted }}>Made with ❤️ for service businesses</p>
        </div>
      </div>
    </footer>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function Page() {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP scroll-triggered reveal
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 32 },
          {
            opacity: 1, y: 0, duration: 0.7, ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
          }
        );
      });
    }, mainRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} style={{ background: C.bg, minHeight: "100vh" }}>
      <Nav />
      <Hero />
      <StatsBar />
      <TheProblem />
      <HowItWorks />
      <BeforeAfter />
      <Features />
      <Integrations />
      <ComparisonTable />
      <Industries />
      <Testimonials />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}
