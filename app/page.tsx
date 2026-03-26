'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const VoiceSphereCanvas = dynamic(() => import('@/components/VoiceSphere'), { ssr: false })

// ─── CUSTOM CURSOR ───────────────────────────────────────────────────────────
function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let raf: number
    const pos = { x: -100, y: -100 }
    const ring = { x: -100, y: -100 }
    const onMove = (e: MouseEvent) => { pos.x = e.clientX; pos.y = e.clientY }
    window.addEventListener('mousemove', onMove)
    const tick = () => {
      ring.x += (pos.x - ring.x) * 0.14
      ring.y += (pos.y - ring.y) * 0.14
      if (dotRef.current) dotRef.current.style.transform = `translate(${pos.x - 3}px,${pos.y - 3}px)`
      if (ringRef.current) ringRef.current.style.transform = `translate(${ring.x - 16}px,${ring.y - 16}px)`
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf) }
  }, [])
  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  )
}

// ─── MAGNETIC BUTTON ─────────────────────────────────────────────────────────
interface MagBtnProps {
  children: React.ReactNode
  variant?: 'primary' | 'outline' | 'dark'
  onClick?: () => void
  style?: React.CSSProperties
}
function MagBtn({ children, variant = 'primary', onClick, style }: MagBtnProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return
    const r = el.getBoundingClientRect()
    const x = e.clientX - r.left - r.width / 2
    const y = e.clientY - r.top - r.height / 2
    gsap.to(el, { x: x * 0.28, y: y * 0.28, duration: 0.25, ease: 'power2.out' })
  }
  const onLeave = () => gsap.to(ref.current, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1,0.4)' })
  return (
    <button
      ref={ref}
      className={`mag-btn ${variant}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      style={style}
    >
      {children}
    </button>
  )
}

// ─── TILT CARD ───────────────────────────────────────────────────────────────
function TiltCard({ children, style, className }: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    gsap.to(el, { rotateX: -y * 9, rotateY: x * 9, duration: 0.3, transformPerspective: 800, ease: 'power2.out' })
  }
  const onLeave = () => gsap.to(ref.current, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'elastic.out(1,0.5)' })
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{ transformStyle: 'preserve-3d', ...style }} className={className}>
      {children}
    </div>
  )
}

// ─── COUNTER ─────────────────────────────────────────────────────────────────
function Counter({ target, prefix = '', suffix = '', duration = 2 }: { target: number; prefix?: string; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 92%',
      onEnter: () => {
        const obj = { val: 0 }
        gsap.to(obj, { val: target, duration, ease: 'power2.out', onUpdate: () => { if (ref.current) ref.current.textContent = prefix + Math.round(obj.val).toLocaleString() + suffix } })
      }
    })
    return () => st.kill()
  }, [target, prefix, suffix, duration])
  return <span ref={ref}>{prefix}0{suffix}</span>
}

// ─── WAVEFORM ────────────────────────────────────────────────────────────────
function Waveform({ active }: { active: boolean }) {
  const heights = [20, 40, 60, 80, 100, 80, 100, 60, 80, 40, 60, 30]
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3, height: 32 }}>
      {heights.map((h, i) => (
        <div
          key={i}
          className={`wave-bar ${active ? 'active' : ''}`}
          style={{
            height: h * 0.3,
            background: `linear-gradient(to top, #3d6cff, #a855f7)`,
            animationDelay: `${i * 0.08}s`,
            animationDuration: `${0.5 + (i % 3) * 0.15}s`,
          }}
        />
      ))}
    </div>
  )
}

// ─── ROI CALCULATOR ──────────────────────────────────────────────────────────
function ROICalculator({ onChange }: { onChange: (annualLoss: number, roi: number, breakEvenCalls: number) => void }) {
  const [missedCalls, setMissedCalls] = useState(8)
  const [jobValue, setJobValue] = useState(350)
  const annualCost = 149 * 12
  const annualLoss = missedCalls * 52 * jobValue
  const roi = annualLoss - annualCost
  const breakEvenCalls = Math.ceil(annualCost / jobValue)

  useEffect(() => { onChange(annualLoss, roi, breakEvenCalls) }, [annualLoss, roi, breakEvenCalls, onChange])

  const labelStyle: React.CSSProperties = { fontSize: 13, color: '#94a3b8', fontWeight: 600, marginBottom: 8, display: 'flex', justifyContent: 'space-between' }
  const valStyle: React.CSSProperties = { color: '#f0f4ff', fontWeight: 800 }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div>
        <div style={labelStyle}><span>Weekly missed calls</span><span style={valStyle}>{missedCalls} calls</span></div>
        <input type="range" min={1} max={30} value={missedCalls} onChange={e => setMissedCalls(Number(e.target.value))} style={{ accentColor: '#3d6cff' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#334155', marginTop: 4 }}><span>1</span><span>30</span></div>
      </div>
      <div>
        <div style={labelStyle}><span>Average job value</span><span style={valStyle}>${jobValue}</span></div>
        <input type="range" min={100} max={2000} step={50} value={jobValue} onChange={e => setJobValue(Number(e.target.value))} style={{ accentColor: '#a855f7' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#334155', marginTop: 4 }}><span>$100</span><span>$2,000</span></div>
      </div>
      <div style={{ background: 'rgba(61,108,255,0.06)', border: '1px solid rgba(61,108,255,0.12)', borderRadius: 12, padding: '16px 20px' }}>
        <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 8 }}>Your calculation:</div>
        <div style={{ fontSize: 14, color: '#94a3b8' }}>{missedCalls} calls/wk × {52} weeks × ${jobValue} = <span style={{ color: '#f0f4ff', fontWeight: 700 }}>${annualLoss.toLocaleString()}/yr</span></div>
      </div>
    </div>
  )
}

// ─── VOICE SELECTOR ──────────────────────────────────────────────────────────
const voices = [
  { name: 'Alex', personality: 'Professional & confident', industry: 'Perfect for B2B and law firms', emoji: '🎩', color: '#3d6cff' },
  { name: 'Sarah', personality: 'Warm & friendly', industry: 'Great for healthcare and salons', emoji: '🌸', color: '#a855f7' },
  { name: 'Marcus', personality: 'Direct & efficient', industry: 'Ideal for HVAC and contractors', emoji: '⚡', color: '#3d6cff' },
  { name: 'Emma', personality: 'Empathetic & clear', industry: 'Best for dental and medical', emoji: '💫', color: '#a855f7' },
]

function VoiceSelector() {
  const [selected, setSelected] = useState(0)
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
      {voices.map((v, i) => (
        <TiltCard key={i}>
          <div
            onClick={() => setSelected(i)}
            style={{
              background: selected === i ? 'rgba(61,108,255,0.1)' : '#0c1020',
              border: `1.5px solid ${selected === i ? v.color : 'rgba(61,108,255,0.12)'}`,
              borderRadius: 14,
              padding: '18px 20px',
              cursor: 'none',
              transition: 'all 0.3s',
              boxShadow: selected === i ? `0 0 24px rgba(61,108,255,0.15)` : 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: `linear-gradient(135deg, #3d6cff, #a855f7)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                {v.emoji}
              </div>
              <div>
                <div style={{ fontWeight: 800, color: selected === i ? '#f0f4ff' : '#94a3b8', fontSize: 15 }}>{v.name}</div>
                <div style={{ fontSize: 12, color: v.color, fontWeight: 600 }}>{v.personality}</div>
              </div>
            </div>
            <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 12 }}>{v.industry}</div>
            {selected === i ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse 1.5s ease-in-out infinite' }} />
                <span style={{ fontSize: 12, color: '#22c55e', fontWeight: 700 }}>Playing...</span>
                <Waveform active={true} />
              </div>
            ) : (
              <div style={{ fontSize: 12, color: '#334155', fontWeight: 600 }}>▶ Click to preview</div>
            )}
          </div>
        </TiltCard>
      ))}
    </div>
  )
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', h)
    gsap.fromTo(navRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.3 })
    return () => window.removeEventListener('scroll', h)
  }, [])
  const links = ['How it works', 'Features', 'Integrations', 'Pricing']
  return (
    <nav ref={navRef} style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? 'rgba(6,8,16,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(61,108,255,0.1)' : 'none',
      transition: 'all 0.4s',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
        <a href="#" style={{ textDecoration: 'none', fontSize: 22, fontWeight: 900, color: '#f0f4ff', letterSpacing: -0.5 }}>
          Never<span className="grad">Miss</span>
        </a>
        <div style={{ display: 'flex', gap: 32 }} className="nav-links">
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/\s+/g, '-')}`}
              style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#f0f4ff')}
              onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}>
              {l}
            </a>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <a href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 14 }}>Sign in</a>
          <MagBtn variant="primary" style={{ padding: '10px 22px', fontSize: 14, borderRadius: 100 }}>Start free →</MagBtn>
        </div>
      </div>
    </nav>
  )
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const tl = gsap.timeline()
    tl.fromTo(leftRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' })
    tl.fromTo(rightRef.current, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1, ease: 'power3.out' }, '-=0.5')
  }, [])
  return (
    <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: 80, position: 'relative', overflow: 'hidden' }}>
      {/* Background glow */}
      <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 800, height: 800, background: 'radial-gradient(ellipse, rgba(61,108,255,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px', width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '55% 45%', gap: 48, alignItems: 'center' }}>

          {/* LEFT */}
          <div ref={leftRef}>
            {/* Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(61,108,255,0.08)', border: '1px solid rgba(61,108,255,0.25)', borderRadius: 100, padding: '7px 16px', marginBottom: 32, fontSize: 13, color: '#3d6cff', fontWeight: 700 }}>
              <span style={{ animation: 'spin 3s linear infinite', display: 'inline-block' }}>⚡</span>
              AI Voice Receptionist — Powered by NeverMiss
            </div>
            {/* H1 */}
            <h1 style={{ fontSize: 'clamp(40px,5.5vw,68px)', fontWeight: 900, lineHeight: 1.05, marginBottom: 24, letterSpacing: -2, color: '#f0f4ff' }}>
              Your phone rings.<br />
              <span className="grad" style={{ display: 'block' }}>Every. Single. Time.</span>
            </h1>
            {/* Sub */}
            <p style={{ fontSize: 19, color: '#94a3b8', lineHeight: 1.7, marginBottom: 40, maxWidth: 500 }}>
              Never lose a customer to voicemail again. NeverMiss AI answers every call, books appointments, and qualifies leads — 24/7, in your voice.
            </p>
            {/* CTAs */}
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 32 }}>
              <MagBtn variant="primary">Start free — 14 days →</MagBtn>
              <MagBtn variant="outline">Watch 2-min demo ▶</MagBtn>
            </div>
            {/* Trust row */}
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 40 }}>
              {['✓ 50 free calls', '✓ No credit card', '✓ 10-min setup', '✓ Cancel anytime'].map(t => (
                <span key={t} style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>{t}</span>
              ))}
            </div>
            {/* Stats */}
            <div style={{ display: 'flex', gap: 32 }}>
              {[{ v: '40%', l: 'More jobs booked' }, { v: '$1,500+', l: 'Revenue recovered/mo' }, { v: '98%', l: 'Call answer rate' }].map(s => (
                <div key={s.l}>
                  <div style={{ fontSize: 28, fontWeight: 900, lineHeight: 1 }} className="grad">{s.v}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div ref={rightRef} style={{ position: 'relative', height: 520 }}>
            {/* 3D Sphere */}
            <div style={{ position: 'absolute', inset: 0 }}>
              <VoiceSphereCanvas />
            </div>
            {/* Floating call card */}
            <div className="float-badge" style={{
              position: 'absolute', bottom: 40, left: -20, zIndex: 10,
              background: '#0c1020', border: '1px solid rgba(61,108,255,0.25)', borderRadius: 14,
              padding: '14px 18px', fontSize: 13, minWidth: 220, backdropFilter: 'blur(12px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 20 }}>📞</span>
                <span style={{ color: '#f0f4ff', fontWeight: 700 }}>+1 (602) 555-4821</span>
              </div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>Incoming call...</div>
              <div style={{ fontSize: 12, color: '#22c55e', fontWeight: 600 }}>→ AI answered in 0.4s</div>
              <div style={{ fontSize: 12, color: '#22c55e', fontWeight: 600 }}>→ Appointment booked ✓</div>
            </div>
            {/* Live badge */}
            <div style={{
              position: 'absolute', top: 20, right: -10, zIndex: 10,
              background: '#0c1020', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 100,
              padding: '8px 16px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8,
              backdropFilter: 'blur(12px)',
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse 2s ease-in-out infinite' }} />
              <span style={{ color: '#f0f4ff', fontWeight: 700 }}>Live — answering calls right now</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── STATS TICKER ─────────────────────────────────────────────────────────────
function StatsTicker() {
  const stats = [
    { v: 98, s: '%', l: 'Call answer rate' },
    { v: 10, s: 's', p: '<', l: 'Response time' },
    { v: 24, s: '/7', l: 'Available' },
    { v: 0, s: '', p: '$', l: 'Setup fee' },
  ]
  return (
    <div style={{ background: '#0c1020', borderTop: '1px solid rgba(61,108,255,0.1)', borderBottom: '1px solid rgba(61,108,255,0.1)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
          {stats.map((s, i) => (
            <div key={i} style={{ padding: '36px 24px', textAlign: 'center', borderRight: i < 3 ? '1px solid rgba(61,108,255,0.1)' : 'none' }}>
              <div style={{ fontSize: 42, fontWeight: 900, lineHeight: 1, marginBottom: 8 }} className="grad">
                {s.p}<Counter target={s.v} suffix={s.s} />
              </div>
              <div style={{ fontSize: 14, color: '#94a3b8' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── THE PAIN ─────────────────────────────────────────────────────────────────
function ThePain() {
  const steps = [
    { icon: '📵', text: 'Your phone rings at 7pm. You\'re finishing a job.' },
    { icon: '🔇', text: 'Customer hears voicemail. They hang up.' },
    { icon: '📲', text: 'They Google "plumber near me" again.' },
    { icon: '📞', text: 'Your competitor answers. Job is theirs.' },
    { icon: '💸', text: 'You lost $450 — without ever knowing.' },
  ]
  const sRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    gsap.utils.toArray<HTMLElement>('.pain-step').forEach((el, i) => {
      gsap.fromTo(el, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.6, delay: i * 0.15, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 88%' } })
    })
  }, [])
  return (
    <section ref={sRef} style={{ padding: '96px 0', position: 'relative' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="section-label">THE REALITY</div>
          <h2 style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 900, color: '#f0f4ff', letterSpacing: -1.5, marginBottom: 16 }}>
            Every missed call is a<br /><span className="grad">competitor&apos;s win.</span>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          {/* Timeline */}
          <div style={{ position: 'relative', paddingLeft: 48 }}>
            <div className="timeline-line" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {steps.map((s, i) => (
                <div key={i} className="pain-step" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ position: 'absolute', left: 10, width: 22, height: 22, borderRadius: '50%', background: i === 4 ? '#ef4444' : '#0c1020', border: `2px solid ${i === 4 ? '#ef4444' : '#3d6cff'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, zIndex: 1, marginTop: 2 }}>
                    {i + 1}
                  </div>
                  <div style={{ background: '#0c1020', border: `1px solid ${i === 4 ? 'rgba(239,68,68,0.3)' : 'rgba(61,108,255,0.12)'}`, borderRadius: 12, padding: '14px 18px', flex: 1 }}>
                    <span style={{ fontSize: 20, marginRight: 10 }}>{s.icon}</span>
                    <span style={{ color: i === 4 ? '#ef4444' : '#f0f4ff', fontSize: 15, fontWeight: i === 4 ? 700 : 400 }}>{s.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Big stat */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ background: '#0c1020', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 24, padding: '48px 32px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, #ef4444, transparent)' }} />
              <div style={{ fontSize: 80, fontWeight: 900, color: '#ef4444', lineHeight: 1, marginBottom: 16 }}>8×</div>
              <div style={{ fontSize: 18, color: '#f0f4ff', fontWeight: 700, marginBottom: 8 }}>per week</div>
              <div style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.6, marginBottom: 32 }}>This happens to the average contractor. That&apos;s $182,000 in lost revenue every year.</div>
              <MagBtn variant="primary">Stop the bleeding →</MagBtn>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── HOW IT WORKS ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const [active, setActive] = useState(0)
  const steps = [
    { num: '01', icon: '🔗', title: 'Paste your website URL', desc: 'Our AI reads your entire website in seconds — services, pricing, hours, FAQ. Zero manual setup required.' },
    { num: '02', icon: '🤖', title: 'AI builds your receptionist', desc: 'A custom voice agent is created with your exact business knowledge. Speaks naturally, handles objections.' },
    { num: '03', icon: '✅', title: 'Go live in minutes', desc: 'Get a local phone number. Forward your line. Your AI receptionist starts answering immediately — 24/7.' },
  ]
  const mockups = [
    <div key={0} style={{ background: '#060810', border: '1px solid rgba(61,108,255,0.2)', borderRadius: 12, padding: 24, fontFamily: 'monospace' }}>
      <div style={{ color: '#94a3b8', fontSize: 13, marginBottom: 12 }}>Your business website</div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: '#0c1020', borderRadius: 8, padding: '10px 14px', border: '1px solid rgba(61,108,255,0.3)' }}>
        <span style={{ fontSize: 13, color: '#94a3b8' }}>https://</span>
        <span style={{ fontSize: 13, color: '#3d6cff', fontWeight: 600 }}>yourplumbingco.com</span>
        <span style={{ marginLeft: 'auto', animation: 'pulse 1.5s ease-in-out infinite', color: '#3d6cff', fontSize: 13 }}>↵</span>
      </div>
      <div style={{ marginTop: 16, color: '#22c55e', fontSize: 13, fontWeight: 600 }}>✓ Reading 47 pages of content...</div>
    </div>,
    <div key={1} style={{ background: '#060810', border: '1px solid rgba(61,108,255,0.2)', borderRadius: 12, padding: 24 }}>
      <div style={{ color: '#94a3b8', fontSize: 13, marginBottom: 16 }}>AI Training Progress</div>
      {['Business services', 'Pricing & packages', 'Business hours', 'FAQ & policies', 'Appointment logic'].map((item, j) => (
        <div key={j} style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>
            <span>{item}</span><span style={{ color: '#22c55e' }}>✓</span>
          </div>
          <div style={{ height: 4, background: '#0c1020', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'linear-gradient(90deg, #3d6cff, #a855f7)', borderRadius: 2, width: '100%', animation: `shimmer 1.5s ease infinite ${j * 0.2}s` }} />
          </div>
        </div>
      ))}
    </div>,
    <div key={2} style={{ background: '#060810', border: '1px solid rgba(61,108,255,0.2)', borderRadius: 12, padding: 24, textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>📱</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: '#f0f4ff', marginBottom: 8 }}>+1 (602) 555-0199</div>
      <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 20 }}>Your dedicated AI number</div>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 100, padding: '8px 18px', fontSize: 13, color: '#22c55e', fontWeight: 700 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse 1.5s ease-in-out infinite' }} />
        Live — ready for calls
      </div>
    </div>
  ]

  useEffect(() => {
    const interval = setInterval(() => setActive(a => (a + 1) % 3), 3500)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="how-it-works" style={{ padding: '96px 0', background: 'rgba(12,16,32,0.5)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="section-label">HOW IT WORKS</div>
          <h2 style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 900, color: '#f0f4ff', letterSpacing: -1.5 }}>
            Live in 3 steps.<br /><span className="grad">Under 10 minutes.</span>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          {/* Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {steps.map((s, i) => (
              <div key={i} onClick={() => setActive(i)} style={{ cursor: 'none', display: 'flex', gap: 20, padding: '20px 24px', borderRadius: 16, border: `1.5px solid ${active === i ? '#3d6cff' : 'rgba(61,108,255,0.1)'}`, background: active === i ? 'rgba(61,108,255,0.06)' : 'transparent', transition: 'all 0.3s', position: 'relative', overflow: 'hidden' }}>
                {active === i && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, #3d6cff, transparent)' }} />}
                <div style={{ fontSize: 48, fontWeight: 900, color: active === i ? 'rgba(61,108,255,0.15)' : 'rgba(255,255,255,0.04)', lineHeight: 1, flexShrink: 0, alignSelf: 'center' }}>{s.num}</div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: active === i ? '#f0f4ff' : '#94a3b8', marginBottom: 6, transition: 'color 0.3s' }}>
                    <span style={{ marginRight: 8 }}>{s.icon}</span>{s.title}
                  </div>
                  <div style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
          {/* Animated mockup */}
          <div style={{ position: 'relative' }}>
            <div style={{ transition: 'opacity 0.4s', opacity: 1 }}>
              {mockups[active]}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── ROI SECTION ──────────────────────────────────────────────────────────────
function ROISection() {
  const [annualLoss, setAnnualLoss] = useState(145600)
  const [roi, setRoi] = useState(143812)
  const [breakEven, setBreakEven] = useState(6)
  const annualCost = 149 * 12

  const handleChange = useCallback((loss: number, roiVal: number, be: number) => {
    setAnnualLoss(loss); setRoi(roiVal); setBreakEven(be)
  }, [])

  return (
    <section id="roi" style={{ padding: '96px 0', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '50%', left: '20%', transform: 'translateY(-50%)', width: 400, height: 400, background: 'radial-gradient(ellipse, rgba(239,68,68,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="section-label">ROI CALCULATOR</div>
          <h2 style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 900, color: '#f0f4ff', letterSpacing: -1.5 }}>
            Calculate your<br /><span className="grad">exact revenue leak.</span>
          </h2>
          <p style={{ fontSize: 17, color: '#94a3b8', marginTop: 16 }}>Move the sliders. See what you&apos;re losing.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
          {/* Left — Sliders */}
          <div className="card" style={{ padding: '36px' }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#f0f4ff', marginBottom: 32 }}>Your numbers</h3>
            <ROICalculator onChange={handleChange} />
          </div>
          {/* Right — Results */}
          <div>
            <div className="grad-border" style={{ marginBottom: 16 }}>
              <div className="grad-border-inner">
                <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600, marginBottom: 8 }}>YOU&apos;RE LOSING</div>
                <div style={{ fontSize: 52, fontWeight: 900, color: '#ef4444', lineHeight: 1, marginBottom: 4 }}>
                  ${annualLoss.toLocaleString()}
                </div>
                <div style={{ fontSize: 14, color: '#94a3b8' }}>per year in missed call revenue</div>
              </div>
            </div>
            <div className="card" style={{ marginBottom: 16, padding: '20px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 4 }}>NeverMiss costs</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#f0f4ff' }}>${annualCost.toLocaleString()}/yr <span style={{ fontSize: 14, fontWeight: 400, color: '#94a3b8' }}>($149/mo)</span></div>
                </div>
                <div style={{ fontSize: 32 }}>💳</div>
              </div>
            </div>
            <div className="card" style={{ marginBottom: 24, padding: '20px 24px', border: '1px solid rgba(34,197,94,0.2)', background: 'rgba(34,197,94,0.05)' }}>
              <div style={{ fontSize: 13, color: '#22c55e', fontWeight: 700, marginBottom: 6 }}>YOUR FIRST-YEAR ROI</div>
              <div style={{ fontSize: 42, fontWeight: 900, color: '#22c55e', lineHeight: 1, marginBottom: 8 }}>
                +${roi.toLocaleString()}
              </div>
              <div style={{ fontSize: 13, color: '#94a3b8' }}>NeverMiss pays for itself after just <strong style={{ color: '#f0f4ff' }}>{breakEven} answered calls</strong></div>
              <div style={{ marginTop: 12, height: 4, background: '#0c1020', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'linear-gradient(90deg, #22c55e, #3d6cff)', borderRadius: 2, width: `${Math.min(100, (annualCost / annualLoss) * 100)}%`, transition: 'width 0.5s ease' }} />
              </div>
            </div>
            <MagBtn variant="primary" style={{ width: '100%', justifyContent: 'center' }}>Stop the leak — Start free →</MagBtn>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── VOICE SELECTOR SECTION ───────────────────────────────────────────────────
function VoiceSelectorSection() {
  return (
    <section style={{ padding: '96px 0', background: 'rgba(12,16,32,0.5)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="section-label">VOICE SELECTOR</div>
          <h2 style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 900, color: '#f0f4ff', letterSpacing: -1.5, marginBottom: 16 }}>
            Choose the voice<br />that <span className="grad">represents you.</span>
          </h2>
          <p style={{ fontSize: 17, color: '#94a3b8', maxWidth: 520, margin: '0 auto' }}>
            Every NeverMiss AI has a distinct personality trained for your industry.
          </p>
        </div>
        <div style={{ maxWidth: 840, margin: '0 auto' }}>
          <VoiceSelector />
          <p style={{ textAlign: 'center', fontSize: 14, color: '#334155', marginTop: 24 }}>
            All voices can be customized to your exact business name, services, and responses.
          </p>
        </div>
      </div>
    </section>
  )
}

// ─── BEFORE / AFTER ───────────────────────────────────────────────────────────
function BeforeAfter() {
  const calls = [
    { caller: 'Sarah M.', intent: 'Leak repair — urgent', lost: '$380 job', booked: '10am Thursday ✓' },
    { caller: 'John D.', intent: 'Annual inspection', lost: '$220 job', booked: 'Monday 2pm ✓' },
    { caller: 'Mike R.', intent: 'Emergency pipe burst', lost: '$850 job', booked: 'Same day 4pm ✓' },
    { caller: 'Lisa K.', intent: 'New installation quote', lost: '$1,200 lead', booked: 'Friday consultation ✓' },
  ]
  return (
    <section style={{ padding: '96px 0', position: 'relative' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2 style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 900, color: '#f0f4ff', letterSpacing: -1.5 }}>
            Same week. <span className="grad">Completely different results.</span>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 4px 1fr', gap: 0, alignItems: 'stretch' }}>
          {/* Without */}
          <div style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '16px 0 0 16px', padding: '28px 32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
              <span style={{ fontSize: 20 }}>❌</span>
              <h3 style={{ color: '#ef4444', fontWeight: 800, fontSize: 16 }}>Without NeverMiss</h3>
            </div>
            {calls.map((c, i) => (
              <div key={i} style={{ padding: '14px 0', borderBottom: i < 3 ? '1px solid rgba(239,68,68,0.1)' : 'none' }}>
                <div style={{ fontSize: 14, color: '#f0f4ff', fontWeight: 600, marginBottom: 4 }}>{c.caller} — {c.intent}</div>
                <div style={{ fontSize: 13, color: '#ef4444', fontWeight: 700 }}>✗ Missed call · Lost {c.lost}</div>
              </div>
            ))}
            <div style={{ marginTop: 24, padding: '14px 18px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#ef4444' }}>-$2,650</div>
              <div style={{ fontSize: 13, color: '#94a3b8' }}>revenue lost this week</div>
            </div>
          </div>
          {/* Divider */}
          <div style={{ background: 'linear-gradient(to bottom, #3d6cff, #a855f7)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#060810', border: '2px solid #3d6cff', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#3d6cff', fontWeight: 800, zIndex: 2 }}>vs</div>
          </div>
          {/* With */}
          <div style={{ background: 'rgba(61,108,255,0.04)', border: '1px solid rgba(61,108,255,0.2)', borderRadius: '0 16px 16px 0', padding: '28px 32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
              <span style={{ fontSize: 20 }}>✅</span>
              <h3 style={{ color: '#3d6cff', fontWeight: 800, fontSize: 16 }}>With NeverMiss</h3>
            </div>
            {calls.map((c, i) => (
              <div key={i} style={{ padding: '14px 0', borderBottom: i < 3 ? '1px solid rgba(61,108,255,0.1)' : 'none' }}>
                <div style={{ fontSize: 14, color: '#f0f4ff', fontWeight: 600, marginBottom: 4 }}>{c.caller} — {c.intent}</div>
                <div style={{ fontSize: 13, color: '#22c55e', fontWeight: 700 }}>✓ Answered · Booked {c.booked}</div>
              </div>
            ))}
            <div style={{ marginTop: 24, padding: '14px 18px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 10, textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#22c55e' }}>4 jobs booked</div>
              <div style={{ fontSize: 13, color: '#94a3b8' }}>+$2,650 in revenue captured</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── FEATURES ─────────────────────────────────────────────────────────────────
function FeaturesSection() {
  const large = [
    {
      icon: '📞', title: '24/7 AI Answering', desc: 'Every call answered instantly. No hold music. No voicemail. Your AI answers in under a second, every time, even at 3am on Christmas.',
      visual: (
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(61,108,255,0.06)', borderRadius: 10, padding: '12px 16px' }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse 1.5s ease-in-out infinite' }} />
          <span style={{ fontSize: 13, color: '#22c55e', fontWeight: 700 }}>Answering right now</span>
          <div style={{ marginLeft: 'auto' }}><Waveform active={true} /></div>
        </div>
      )
    },
    {
      icon: '📅', title: 'Instant Appointment Booking', desc: 'Connects to Google Calendar and Calendly. Checks real-time availability. Books directly in the call. Sends SMS confirmation automatically.',
      visual: (
        <div style={{ marginTop: 16, background: 'rgba(61,108,255,0.06)', borderRadius: 10, padding: '12px 16px', fontSize: 13 }}>
          <div style={{ color: '#94a3b8', marginBottom: 8 }}>Next available slots:</div>
          {['Thu Jan 9, 10am', 'Thu Jan 9, 2pm', 'Fri Jan 10, 9am'].map((s, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: i < 2 ? '1px solid rgba(61,108,255,0.08)' : 'none' }}>
              <span style={{ color: '#f0f4ff' }}>{s}</span>
              <span style={{ color: '#22c55e', fontWeight: 700 }}>Available ✓</span>
            </div>
          ))}
        </div>
      )
    }
  ]
  const small = [
    { icon: '🎙️', title: 'Call recordings', desc: 'Every call recorded and transcribed. Search, replay, and learn.' },
    { icon: '🛡️', title: 'Smart spam filtering', desc: 'AI blocks robocalls and telemarketers before they reach you.' },
    { icon: '🎭', title: 'Custom AI personality', desc: 'Tune voice, tone, script, and responses to match your brand.' },
    { icon: '📊', title: 'Real-time analytics', desc: 'Track call volume, peak hours, booking rates, and revenue won.' },
  ]
  return (
    <section id="features" style={{ padding: '96px 0', background: 'rgba(12,16,32,0.5)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="section-label">FEATURES</div>
          <h2 style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 900, color: '#f0f4ff', letterSpacing: -1.5, marginBottom: 16 }}>
            40+ features.<br /><span className="grad">Zero complexity.</span>
          </h2>
        </div>
        <div className="bento-grid">
          {large.map((f, i) => (
            <TiltCard key={i} className="bento-large">
              <div className="card" style={{ height: '100%' }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: '#f0f4ff', marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.6 }}>{f.desc}</p>
                {f.visual}
              </div>
            </TiltCard>
          ))}
          {small.map((f, i) => (
            <TiltCard key={i}>
              <div className="card" style={{ height: '100%' }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#f0f4ff', marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── INTEGRATIONS ─────────────────────────────────────────────────────────────
function Integrations() {
  const row1 = [
    { icon: '📅', name: 'Google Calendar', tag: 'Calendar' },
    { icon: '🗓️', name: 'Calendly', tag: 'Scheduling' },
    { icon: '💬', name: 'WhatsApp', tag: 'Messaging' },
    { icon: '📱', name: 'Twilio', tag: 'Telecom' },
    { icon: '💳', name: 'Stripe', tag: 'Payments' },
    { icon: '📅', name: 'Google Calendar', tag: 'Calendar' },
    { icon: '🗓️', name: 'Calendly', tag: 'Scheduling' },
    { icon: '💬', name: 'WhatsApp', tag: 'Messaging' },
    { icon: '📱', name: 'Twilio', tag: 'Telecom' },
    { icon: '💳', name: 'Stripe', tag: 'Payments' },
  ]
  const row2 = [
    { icon: '🎙️', name: 'Vapi.ai', tag: 'Voice AI' },
    { icon: '🔊', name: 'ElevenLabs', tag: 'Voice' },
    { icon: '🏢', name: 'Google Business', tag: 'GMB' },
    { icon: '📊', name: 'HubSpot', tag: 'CRM' },
    { icon: '🔗', name: 'Webhooks', tag: 'Developer' },
    { icon: '🎙️', name: 'Vapi.ai', tag: 'Voice AI' },
    { icon: '🔊', name: 'ElevenLabs', tag: 'Voice' },
    { icon: '🏢', name: 'Google Business', tag: 'GMB' },
    { icon: '📊', name: 'HubSpot', tag: 'CRM' },
    { icon: '🔗', name: 'Webhooks', tag: 'Developer' },
  ]
  const IntCard = ({ item }: { item: { icon: string; name: string; tag: string } }) => (
    <div style={{ background: '#0c1020', border: '1px solid rgba(61,108,255,0.12)', borderRadius: 14, padding: '16px 20px', minWidth: 160, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 }}>
      <div style={{ fontSize: 28 }}>{item.icon}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#f0f4ff' }}>{item.name}</div>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#3d6cff', background: 'rgba(61,108,255,0.1)', padding: '2px 8px', borderRadius: 100 }}>{item.tag}</div>
    </div>
  )
  return (
    <section id="integrations" style={{ padding: '96px 0', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', marginBottom: 56 }}>
        <div style={{ textAlign: 'center' }}>
          <div className="section-label">INTEGRATIONS</div>
          <h2 style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 900, color: '#f0f4ff', letterSpacing: -1.5 }}>
            Connects with<br /><span className="grad">everything you use.</span>
          </h2>
        </div>
      </div>
      <div style={{ overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 120, background: 'linear-gradient(to right, #060810, transparent)', zIndex: 2, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 120, background: 'linear-gradient(to left, #060810, transparent)', zIndex: 2, pointerEvents: 'none' }} />
        <div style={{ overflow: 'hidden', marginBottom: 16 }}>
          <div className="marquee-track forward" style={{ gap: 16 }}>
            {row1.map((item, i) => <IntCard key={i} item={item} />)}
          </div>
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div className="marquee-track reverse" style={{ gap: 16 }}>
            {row2.map((item, i) => <IntCard key={i} item={item} />)}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── COMPARISON TABLE ─────────────────────────────────────────────────────────
function ComparisonTable() {
  const features = [
    '24/7 availability', 'Answers instantly (<1s)', 'Books appointments', 'SMS confirmations',
    'Handles multiple calls simultaneously', 'Call recordings & summaries',
    'Smart spam filtering', 'Custom personality & script',
    'Real-time analytics dashboard', 'Never sick / never on vacation',
  ]
  const vm = [false, false, false, false, false, false, false, false, false, true]
  const hr = [false, true, true, false, false, false, true, true, false, false]
  const nm = [true, true, true, true, true, true, true, true, true, true]

  const Check = ({ v }: { v: boolean }) => (
    <td style={{ padding: '12px 20px', textAlign: 'center', fontSize: 16 }}>
      {v ? <span style={{ color: '#22c55e', fontWeight: 900 }}>✓</span> : <span style={{ color: '#334155' }}>✗</span>}
    </td>
  )

  return (
    <section style={{ padding: '96px 0', background: 'rgba(12,16,32,0.5)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 900, color: '#f0f4ff', letterSpacing: -1.5 }}>
            The <span className="grad">obvious</span> choice
          </h2>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="comp-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr>
                {['Feature', 'Voicemail', 'Human Receptionist', 'NeverMiss'].map((h, i) => (
                  <th key={h} style={{ padding: '14px 20px', textAlign: i === 0 ? 'left' : 'center', color: i === 3 ? '#3d6cff' : '#94a3b8', fontWeight: 800, fontSize: i === 3 ? 15 : 13, letterSpacing: i === 3 ? 0 : 0.5, background: i === 3 ? 'rgba(61,108,255,0.05)' : 'transparent', borderBottom: '1px solid rgba(61,108,255,0.1)' }}>
                    {i === 3 && <div style={{ fontSize: 11, fontWeight: 700, color: '#a855f7', marginBottom: 2, letterSpacing: 1 }}>★ BEST VALUE</div>}
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((f, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? 'rgba(61,108,255,0.02)' : 'transparent' }}>
                  <td style={{ padding: '12px 20px', color: '#94a3b8', textAlign: 'left' }}>{f}</td>
                  <Check v={vm[i]} />
                  <Check v={hr[i]} />
                  <td style={{ padding: '12px 20px', textAlign: 'center', background: 'rgba(61,108,255,0.04)', fontSize: 16 }}>
                    <span style={{ color: '#3d6cff', fontWeight: 900 }}>✓</span>
                  </td>
                </tr>
              ))}
              <tr style={{ background: 'rgba(61,108,255,0.04)' }}>
                <td style={{ padding: '16px 20px', color: '#f0f4ff', fontWeight: 700 }}>Monthly cost</td>
                <td style={{ padding: '16px 20px', textAlign: 'center', color: '#94a3b8', fontWeight: 700 }}>$0<span style={{ fontSize: 11, display: 'block', color: '#334155' }}>+$4,800 in lost revenue</span></td>
                <td style={{ padding: '16px 20px', textAlign: 'center', color: '#ef4444', fontWeight: 700 }}>$2,500+/mo</td>
                <td style={{ padding: '16px 20px', textAlign: 'center', background: 'rgba(61,108,255,0.06)' }}>
                  <span style={{ fontWeight: 900, fontSize: 20 }} className="grad">$149/mo</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p style={{ marginTop: 16, textAlign: 'center', fontSize: 14, color: '#94a3b8', fontStyle: 'italic' }}>
          You&apos;re already paying $2,500+ in lost calls. NeverMiss costs $149.
        </p>
      </div>
    </section>
  )
}

// ─── LIVE DEMO SIMULATOR ──────────────────────────────────────────────────────
type DemoState = 'idle' | 'ringing' | 'answering' | 'chatting' | 'booked'
function LiveDemo() {
  const [state, setState] = useState<DemoState>('idle')
  const [bubbles, setBubbles] = useState<{ text: string; role: 'caller' | 'ai' }[]>([])
  const [playing, setPlaying] = useState(false)

  const runDemo = useCallback(() => {
    if (playing) return
    setPlaying(true)
    setBubbles([])
    setState('ringing')
    setTimeout(() => { setState('answering') }, 1800)
    setTimeout(() => { setState('chatting'); setBubbles([{ text: 'Hi, I need a plumber for a leak — it\'s pretty urgent.', role: 'caller' }]) }, 3200)
    setTimeout(() => { setBubbles(b => [...b, { text: 'I\'m on it! I can have someone there today at 3pm or 5pm. Which works better for you?', role: 'ai' }]) }, 4800)
    setTimeout(() => { setBubbles(b => [...b, { text: '3pm please, the water is dripping fast.', role: 'caller' }]) }, 6400)
    setTimeout(() => { setBubbles(b => [...b, { text: 'Perfect — you\'re booked for today at 3pm! I\'m sending a confirmation text right now.', role: 'ai' }]); setState('booked') }, 8000)
    setTimeout(() => { setState('idle'); setPlaying(false); setBubbles([]) }, 14000)
  }, [playing])

  useEffect(() => {
    const t = setTimeout(runDemo, 1500)
    return () => clearTimeout(t)
  }, [runDemo])

  return (
    <section id="demo" style={{ padding: '96px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="section-label">LIVE DEMO</div>
          <h2 style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 900, color: '#f0f4ff', letterSpacing: -1.5 }}>
            See it in action.<br /><span className="grad">No sign-up needed.</span>
          </h2>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 48 }}>
          {/* Phone */}
          <div className="phone-frame">
            <div style={{ padding: '12px', background: '#060810' }}>
              <div className="phone-notch" />
            </div>
            {/* Status bar */}
            <div style={{ padding: '0 20px 12px', display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#334155' }}>
              <span>9:41</span><span>●●●</span>
            </div>
            {/* Call UI */}
            <div style={{ padding: '0 20px', textAlign: 'center' }}>
              {state === 'idle' && (
                <div style={{ paddingTop: 60 }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>📞</div>
                  <div style={{ fontSize: 14, color: '#94a3b8' }}>Demo starts automatically...</div>
                  <button onClick={runDemo} style={{ marginTop: 20, background: 'linear-gradient(135deg,#3d6cff,#a855f7)', border: 'none', color: '#fff', padding: '10px 24px', borderRadius: 100, fontSize: 14, fontWeight: 700, cursor: 'none' }}>
                    Replay →
                  </button>
                </div>
              )}
              {state === 'ringing' && (
                <div style={{ paddingTop: 40 }}>
                  <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 20px' }}>
                    <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(61,108,255,0.2)', animation: 'ping 1.2s ease-out infinite' }} />
                    <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(61,108,255,0.15)', animation: 'ping 1.2s ease-out infinite 0.4s' }} />
                    <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#3d6cff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>📞</div>
                  </div>
                  <div style={{ fontSize: 16, color: '#f0f4ff', fontWeight: 700, marginBottom: 4 }}>Incoming call</div>
                  <div style={{ fontSize: 13, color: '#94a3b8' }}>+1 (555) 234-8910</div>
                </div>
              )}
              {(state === 'answering' || state === 'chatting' || state === 'booked') && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginBottom: 12 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse 1.5s ease-in-out infinite' }} />
                    <span style={{ fontSize: 13, color: '#22c55e', fontWeight: 700 }}>NeverMiss AI Answering</span>
                  </div>
                  {state === 'answering' && (
                    <div style={{ display: 'flex', justifyContent: 'center', height: 40 }}>
                      <Waveform active={true} />
                    </div>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12, maxHeight: 280, overflowY: 'auto', padding: '0 4px' }}>
                    {bubbles.map((b, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: b.role === 'caller' ? 'flex-start' : 'flex-end', animation: 'bubbleIn 0.4s ease' }}>
                        <div style={{ background: b.role === 'ai' ? 'linear-gradient(135deg,rgba(61,108,255,0.3),rgba(168,85,247,0.3))' : '#1a2040', border: `1px solid ${b.role === 'ai' ? 'rgba(61,108,255,0.3)' : 'rgba(255,255,255,0.06)'}`, borderRadius: b.role === 'caller' ? '12px 12px 12px 2px' : '12px 12px 2px 12px', padding: '8px 12px', fontSize: 12, color: '#f0f4ff', maxWidth: '85%', textAlign: 'left', lineHeight: 1.5 }}>
                          {b.text}
                        </div>
                      </div>
                    ))}
                  </div>
                  {state === 'booked' && (
                    <div style={{ marginTop: 12, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 10, padding: '10px', fontSize: 12, color: '#22c55e', fontWeight: 700 }}>
                      ✓ Appointment booked · SMS sent ✓
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          {/* Labels */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 280 }}>
            {[
              { step: '01', title: 'AI answers instantly', desc: 'Under 0.4 seconds. No hold music.', active: state === 'ringing' || state === 'answering' },
              { step: '02', title: 'Natural conversation', desc: 'Caller can\'t tell it\'s AI.', active: state === 'chatting' },
              { step: '03', title: 'Appointment booked', desc: 'SMS confirmation sent automatically.', active: state === 'booked' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', opacity: item.active ? 1 : 0.4, transition: 'opacity 0.4s' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: item.active ? 'linear-gradient(135deg,#3d6cff,#a855f7)' : '#0c1020', border: `1px solid ${item.active ? '#3d6cff' : 'rgba(61,108,255,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#f0f4ff', flexShrink: 0 }}>
                  {item.step}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#f0f4ff', marginBottom: 4 }}>{item.title}</div>
                  <div style={{ fontSize: 13, color: '#94a3b8' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── INDUSTRIES ───────────────────────────────────────────────────────────────
function IndustriesSection() {
  const industries = [
    { icon: '🔧', name: 'HVAC & Plumbing', prop: 'Never miss an emergency call', metric: '3x after-hours jobs' },
    { icon: '🏠', name: 'Roofing & Construction', prop: 'Capture every estimate request', metric: '90% less missed calls' },
    { icon: '⚡', name: 'Electricians', prop: 'Handle emergency dispatch 24/7', metric: '0 missed emergencies' },
    { icon: '⚖️', name: 'Law Firms', prop: 'Qualify leads, book consultations', metric: '2x client intake' },
    { icon: '🦷', name: 'Dental Clinics', prop: 'Fill cancellations in real-time', metric: '40% more bookings' },
    { icon: '💆', name: 'Med Spas & Aesthetics', prop: 'Professional first impression', metric: '$800 avg booking value' },
    { icon: '🐾', name: 'Veterinary Clinics', prop: 'Urgent triage, 24/7 support', metric: 'Zero missed emergencies' },
    { icon: '🏡', name: 'Real Estate Agents', prop: 'Capture buyer & seller leads', metric: '2x leads per week' },
  ]
  return (
    <section id="industries" style={{ padding: '96px 0', background: 'rgba(12,16,32,0.5)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="section-label">INDUSTRIES</div>
          <h2 style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 900, color: '#f0f4ff', letterSpacing: -1.5, marginBottom: 16 }}>
            Built for every<br /><span className="grad">service business.</span>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          {industries.map((item, i) => (
            <TiltCard key={i}>
              <div className="card" style={{ height: '100%' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{item.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: '#f0f4ff', marginBottom: 8 }}>{item.name}</h3>
                <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5, marginBottom: 12 }}>{item.prop}</p>
                <p style={{ fontSize: 12, fontWeight: 700 }} className="grad">↗ {item.metric}</p>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── SOCIAL PROOF ─────────────────────────────────────────────────────────────
function SocialProof() {
  const bigStats = [
    { v: 10000, s: '+', l: 'Calls handled' },
    { v: 98, s: '%', l: 'Satisfaction rate' },
    { v: 2400000, s: '', p: '$', l: 'Revenue recovered' },
    { v: 0.4, s: 's', p: '<', l: 'Answer time' },
  ]
  const testimonials = [
    { stars: 5, quote: 'We were losing 8-10 calls every weekend. NeverMiss picks up every single one now. We\'ve booked 23 extra jobs this month alone. ROI is insane.', name: 'Mike Thompson', company: 'Thompson Plumbing & HVAC', role: 'Owner' },
    { stars: 5, quote: 'Setup took literally 7 minutes. I pasted my website URL and it was live. My customers genuinely can\'t tell it\'s AI — they think I hired someone.', name: 'Sarah Johnson', company: 'SJ Electric', role: 'Founder' },
    { stars: 5, quote: 'After-hours calls used to be my biggest frustration. Now every 11pm call gets handled perfectly. I woke up to 3 booked appointments last Monday.', name: 'Carlos Rivera', company: 'Rivera Roofing Co.', role: 'Owner' },
  ]
  return (
    <section style={{ padding: '96px 0', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 700, background: 'radial-gradient(ellipse, rgba(168,85,247,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        {/* Big stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 64 }}>
          {bigStats.map((s, i) => (
            <div key={i} style={{ background: '#0c1020', border: '1px solid rgba(61,108,255,0.12)', borderRadius: 16, padding: '28px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 40, fontWeight: 900, lineHeight: 1, marginBottom: 8 }} className="grad">
                {s.p}<Counter target={s.v} suffix={s.s} duration={2.5} />
              </div>
              <div style={{ fontSize: 14, color: '#94a3b8' }}>{s.l}</div>
            </div>
          ))}
        </div>
        {/* Testimonials */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
          {testimonials.map((t, i) => (
            <TiltCard key={i}>
              <div className="card" style={{ height: '100%' }}>
                <div style={{ marginBottom: 16, fontSize: 16 }}>{'⭐'.repeat(t.stars)}</div>
                <p style={{ fontSize: 15, color: '#f0f4ff', lineHeight: 1.7, fontStyle: 'italic', marginBottom: 20 }}>&ldquo;{t.quote}&rdquo;</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 'auto' }}>
                  <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg,#3d6cff,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, color: '#f0f4ff', fontSize: 14 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>{t.role}, {t.company}</div>
                  </div>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── PRICING ─────────────────────────────────────────────────────────────────
function Pricing() {
  const [annual, setAnnual] = useState(false)
  const plans = [
    {
      name: 'Free', price: 0, annualPrice: 0, highlight: false, cta: 'Start free',
      features: ['50 calls/month', '1 AI agent', 'Basic call handling', 'Email support', 'Local phone number'],
    },
    {
      name: 'Pro', price: 49, annualPrice: 39, highlight: true, cta: 'Start free trial →',
      features: ['300 calls/month', '3 AI agents', 'Appointment booking', 'SMS confirmations', 'Call recordings', 'Advanced analytics', 'Priority support'],
    },
    {
      name: 'Business', price: 99, annualPrice: 79, highlight: false, cta: 'Contact us',
      features: ['Unlimited calls', '10 AI agents', 'Everything in Pro', 'White-label', 'API access', 'Full analytics suite', 'Dedicated support'],
    },
  ]
  return (
    <section id="pricing" style={{ padding: '96px 0', background: 'rgba(12,16,32,0.5)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="section-label">PRICING</div>
          <h2 style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 900, color: '#f0f4ff', letterSpacing: -1.5, marginBottom: 16 }}>
            Simple pricing.<br /><span className="grad">Serious results.</span>
          </h2>
          {/* Toggle */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: '#0c1020', border: '1px solid rgba(61,108,255,0.15)', borderRadius: 100, padding: '6px 8px', marginTop: 16 }}>
            <button onClick={() => setAnnual(false)} style={{ padding: '8px 20px', borderRadius: 100, border: 'none', cursor: 'none', fontWeight: 700, fontSize: 13, background: !annual ? 'linear-gradient(135deg,#3d6cff,#a855f7)' : 'transparent', color: !annual ? '#fff' : '#94a3b8', transition: 'all 0.3s' }}>Monthly</button>
            <button onClick={() => setAnnual(true)} style={{ padding: '8px 20px', borderRadius: 100, border: 'none', cursor: 'none', fontWeight: 700, fontSize: 13, background: annual ? 'linear-gradient(135deg,#3d6cff,#a855f7)' : 'transparent', color: annual ? '#fff' : '#94a3b8', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: 8 }}>
              Annual <span style={{ fontSize: 11, background: 'rgba(34,197,94,0.2)', color: '#22c55e', padding: '2px 6px', borderRadius: 100 }}>Save 20%</span>
            </button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, alignItems: 'start' }}>
          {plans.map((p, i) => (
            <div key={i} className={p.highlight ? 'pricing-popular' : ''} style={{ position: 'relative' }}>
              {p.highlight && (
                <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#3d6cff,#a855f7)', color: '#fff', fontSize: 11, fontWeight: 800, padding: '4px 14px', borderRadius: 100, whiteSpace: 'nowrap', letterSpacing: 0.5 }}>
                  MOST POPULAR
                </div>
              )}
              {p.highlight ? (
                <div className="grad-border">
                  <div className="grad-border-inner" style={{ padding: '32px 28px' }}>
                    <PlanContent plan={p} annual={annual} />
                  </div>
                </div>
              ) : (
                <div className="card" style={{ padding: '32px 28px' }}>
                  <PlanContent plan={p} annual={annual} />
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 48, padding: '24px', background: '#0c1020', border: '1px solid rgba(61,108,255,0.1)', borderRadius: 16 }}>
          <p style={{ color: '#94a3b8', fontSize: 15 }}>
            💡 NeverMiss Pro at <strong style={{ color: '#3d6cff' }}>$49/mo</strong> vs hiring a receptionist at <strong style={{ color: '#ef4444' }}>$2,500+/mo</strong> — that&apos;s a <strong style={{ color: '#22c55e' }}>98% savings</strong>.
          </p>
        </div>
      </div>
    </section>
  )
}

interface Plan { name: string; price: number; annualPrice: number; highlight: boolean; cta: string; features: string[] }
function PlanContent({ plan, annual }: { plan: Plan; annual: boolean }) {
  const price = annual ? plan.annualPrice : plan.price
  return (
    <>
      <div style={{ fontSize: 13, fontWeight: 700, color: plan.highlight ? '#3d6cff' : '#94a3b8', letterSpacing: 1, marginBottom: 12 }}>{plan.name.toUpperCase()}</div>
      <div style={{ marginBottom: 24 }}>
        <span style={{ fontSize: 52, fontWeight: 900, color: '#f0f4ff', lineHeight: 1 }}>${price}</span>
        <span style={{ color: '#94a3b8', fontSize: 14 }}>/mo</span>
        {annual && plan.price > 0 && <div style={{ fontSize: 12, color: '#22c55e', marginTop: 4, fontWeight: 600 }}>Save ${(plan.price - plan.annualPrice) * 12}/yr</div>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
        {plan.features.map(f => (
          <div key={f} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 14, color: '#94a3b8' }}>
            <span style={{ color: '#3d6cff', fontWeight: 700, flexShrink: 0 }}>✓</span> {f}
          </div>
        ))}
      </div>
      <MagBtn variant={plan.highlight ? 'primary' : 'outline'} style={{ width: '100%', justifyContent: 'center' }}>{plan.cta}</MagBtn>
    </>
  )
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = useState<number | null>(null)
  const faqs = [
    { q: 'How does setup work?', a: 'Under 10 minutes. Paste your website URL, choose a voice personality, and get your dedicated phone number. Your AI receptionist is live before your next coffee.' },
    { q: 'Can callers tell it\'s AI?', a: 'Most can\'t. Our voices are powered by ElevenLabs and trained to sound completely natural. You can choose to disclose it or not.' },
    { q: 'What if AI can\'t handle a call?', a: 'Smart escalation kicks in — the AI transfers the call to you with a quick summary of what was discussed. You\'re always in control.' },
    { q: 'Do I need tech skills?', a: 'Zero. None. If you can paste a URL and click a button, you\'re ready to go. No code, no setup complexity.' },
    { q: 'Can it book into my calendar?', a: 'Yes! Google Calendar, Calendly, and more. The AI checks real-time availability and books directly into your calendar during the call.' },
    { q: 'What phone numbers are available?', a: 'Local US numbers for your area, toll-free numbers, or we can forward your existing business number directly to NeverMiss.' },
    { q: 'How does billing work?', a: 'Monthly or annual subscription. Cancel anytime, no questions asked. We\'ll remind you before any renewal.' },
    { q: 'Can I customize what the AI says?', a: 'Completely. The AI learns from your website, plus you can add custom scripts, FAQs, pricing tables, and specific instructions for any scenario.' },
  ]
  return (
    <section id="faq" style={{ padding: '96px 0', background: 'rgba(12,16,32,0.5)' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 900, color: '#f0f4ff', letterSpacing: -1.5 }}>
            Frequently asked <span className="grad">questions</span>
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {faqs.map((item, i) => (
            <div key={i} style={{ background: '#0c1020', border: `1.5px solid ${open === i ? '#3d6cff' : 'rgba(61,108,255,0.1)'}`, borderRadius: 14, overflow: 'hidden', transition: 'border-color 0.3s' }}>
              <button onClick={() => setOpen(open === i ? null : i)} style={{ width: '100%', textAlign: 'left', padding: '18px 22px', background: 'none', border: 'none', cursor: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <span style={{ fontWeight: 700, color: '#f0f4ff', fontSize: 15 }}>{item.q}</span>
                <span style={{ color: '#3d6cff', fontSize: 20, fontWeight: 300, transform: open === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.3s', flexShrink: 0 }}>+</span>
              </button>
              <div className={`faq-answer ${open === i ? 'open' : ''}`} style={{ padding: open === i ? '0 22px 18px' : '0 22px' }}>
                <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.7 }}>{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── FINAL CTA ────────────────────────────────────────────────────────────────
function FinalCTA() {
  const [email, setEmail] = useState('')
  return (
    <section style={{ padding: '120px 0', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(61,108,255,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, #3d6cff, #a855f7, transparent)' }} />
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 24px', textAlign: 'center', position: 'relative' }}>
        <h2 style={{ fontSize: 'clamp(28px,5vw,58px)', fontWeight: 900, color: '#f0f4ff', letterSpacing: -2, lineHeight: 1.1, marginBottom: 20 }}>
          Your competitor just<br /><span className="grad">answered your customer&apos;s call.</span>
        </h2>
        <p style={{ fontSize: 18, color: '#94a3b8', marginBottom: 48, lineHeight: 1.6 }}>
          Don&apos;t let it happen again. Start free today.
        </p>
        <div style={{ display: 'flex', gap: 12, maxWidth: 480, margin: '0 auto 24px', flexWrap: 'wrap' }}>
          <input
            type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)}
            style={{ flex: 1, padding: '14px 18px', borderRadius: 100, border: '1.5px solid rgba(61,108,255,0.2)', background: '#0c1020', color: '#f0f4ff', fontSize: 15, outline: 'none', minWidth: 200 }}
            onFocus={e => (e.currentTarget.style.borderColor = '#3d6cff')}
            onBlur={e => (e.currentTarget.style.borderColor = 'rgba(61,108,255,0.2)')}
          />
          <MagBtn variant="primary">Get started free →</MagBtn>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
          {['14-day free trial', '50 calls included', 'No credit card'].map(t => (
            <span key={t} style={{ fontSize: 13, color: '#334155', fontWeight: 600 }}>✓ {t}</span>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  const cols: Record<string, string[]> = {
    Product: ['Features', 'Integrations', 'Pricing', 'Changelog'],
    Company: ['About', 'Blog', 'Careers', 'Contact'],
    Resources: ['Docs', 'API Reference', 'Status Page', 'Support'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR'],
  }
  return (
    <footer style={{ borderTop: '1px solid rgba(61,108,255,0.08)', background: '#0c1020', padding: '64px 0 32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 48, marginBottom: 56 }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#f0f4ff', marginBottom: 12 }}>
              Never<span className="grad">Miss</span>
            </div>
            <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.7, maxWidth: 260, marginBottom: 24 }}>
              AI voice receptionist for service businesses. Answer every call. Book every appointment. Recover every dollar.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              {['𝕏', 'in', '📘'].map((s, i) => (
                <a key={i} href="#" style={{ width: 36, height: 36, borderRadius: '50%', background: '#0c1020', border: '1px solid rgba(61,108,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#94a3b8', textDecoration: 'none', transition: 'border-color 0.2s, color 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#3d6cff'; (e.currentTarget as HTMLAnchorElement).style.color = '#f0f4ff' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(61,108,255,0.15)'; (e.currentTarget as HTMLAnchorElement).style.color = '#94a3b8' }}>
                  {s}
                </a>
              ))}
            </div>
          </div>
          {Object.entries(cols).map(([cat, items]) => (
            <div key={cat}>
              <p style={{ fontSize: 11, fontWeight: 800, color: '#334155', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>{cat}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {items.map(item => (
                  <a key={item} href="#" style={{ fontSize: 14, color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#f0f4ff')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}>
                    {item}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(61,108,255,0.08)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 13, color: '#334155' }}>© 2026 NeverMiss · Built for service businesses · contact@nevermiss.ai</p>
          <p style={{ fontSize: 13, color: '#334155' }}>Made with ❤️ + AI</p>
        </div>
      </div>
    </footer>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function Page() {
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Scroll-triggered reveals
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.card').forEach(el => {
        gsap.fromTo(el, { opacity: 0, y: 30 }, {
          opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' }
        })
      })
    }, mainRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={mainRef} style={{ background: '#060810', minHeight: '100vh', position: 'relative' }}>
      <CustomCursor />
      <Nav />
      <Hero />
      <StatsTicker />
      <ThePain />
      <HowItWorks />
      <ROISection />
      <VoiceSelectorSection />
      <BeforeAfter />
      <FeaturesSection />
      <Integrations />
      <ComparisonTable />
      <LiveDemo />
      <IndustriesSection />
      <SocialProof />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  )
}
