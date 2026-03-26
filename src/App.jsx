import { useState, useEffect, useRef } from 'react'
import data from '../renovation-data.json'

const PIN = '0008'

// ── Sparkle Rain Component ─────────────────────────────────────────────────
function SparkleRain() {
  const [sparkles, setSparkles] = useState([])
  const sparkleTypes = ['✨', '💖', '⭐', '🌸', '💎', '✧', '♡', '🎀']

  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now() + Math.random()
      const sparkle = {
        id,
        left: Math.random() * 100,
        duration: 4 + Math.random() * 6,
        delay: Math.random() * 2,
        size: 10 + Math.random() * 18,
        type: sparkleTypes[Math.floor(Math.random() * sparkleTypes.length)],
      }
      setSparkles(prev => [...prev.slice(-30), sparkle])
    }, 300)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="sparkle-container">
      {sparkles.map(s => (
        <span key={s.id} style={{
          position: 'absolute',
          left: `${s.left}%`,
          top: '-20px',
          fontSize: s.size,
          animation: `sparkle-fall ${s.duration}s linear ${s.delay}s forwards`,
          filter: 'drop-shadow(0 0 6px rgba(255, 105, 180, 0.5))',
          pointerEvents: 'none',
        }}>
          {s.type}
        </span>
      ))}
    </div>
  )
}

// ── Colours ────────────────────────────────────────────────────────────────
const STATUS_COLOUR = {
  'in-progress': { dot: '#e91e8c', label: 'In Progress 💅',  bg: 'rgba(233,30,140,0.1)',  text: '#c2185b' },
  'active':      { dot: '#e91e8c', label: 'Active 💪',       bg: 'rgba(233,30,140,0.1)',  text: '#c2185b' },
  'imminent':    { dot: '#8b5cf6', label: 'Imminent ✨',     bg: 'rgba(139,92,246,0.1)',  text: '#7c3aed' },
  'submitted':   { dot: '#8b5cf6', label: 'Submitted 📬',    bg: 'rgba(139,92,246,0.1)',  text: '#7c3aed' },
  'complete':    { dot: '#22c55e', label: 'Done! 🎉',        bg: 'rgba(34,197,94,0.1)',   text: '#16a34a' },
  'blocked':     { dot: '#ef4444', label: 'Blocked 😤',      bg: 'rgba(239,68,68,0.08)',  text: '#dc2626' },
}

const ROOM_STATUS = {
  'complete':    { icon: '✓', color: '#22c55e' },
  'in-prep':     { icon: '💅', color: '#e91e8c' },
  'not-started': { icon: '○', color: '#b8789a' },
}

const TIMELINE_COLOUR = {
  milestone: '#e91e8c',
  decision:  '#8b5cf6',
  upcoming:  '#b8789a',
  personal:  '#ff69b4',
  admin:     '#b8789a',
}

// ── PIN Gate ───────────────────────────────────────────────────────────────
function PinGate({ onUnlock }) {
  const [input, setInput] = useState('')
  const [shake, setShake]  = useState(false)

  const handleKey = (k) => {
    if (k === '←') { setInput(p => p.slice(0, -1)); return }
    if (input.length >= 4) return
    const next = input + k
    setInput(next)
    if (next.length === 4) {
      if (next === PIN) {
        sessionStorage.setItem('reno_pin', '1')
        onUnlock()
      } else {
        setShake(true)
        setTimeout(() => { setShake(false); setInput('') }, 600)
      }
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 32 }}>
      <SparkleRain />
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, marginBottom: 4, color: '#e91e8c' }}>✨ 32A Tressillian ✨</div>
        <div style={{ color: '#b8789a', fontSize: 13, fontWeight: 600 }}>Dream House Dashboard 💖</div>
      </div>

      <div style={{
        background: '#ffffff', border: '2px solid #ffb6d9', borderRadius: 24, padding: '32px 28px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, width: 280,
        boxShadow: '0 8px 32px rgba(233,30,140,0.15)',
      }}>
        {/* Dots */}
        <div style={{ display: 'flex', gap: 14 }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{
              width: 14, height: 14, borderRadius: '50%',
              background: i < input.length ? '#ff69b4' : '#f5c6d8',
              transition: 'background 0.15s',
              boxShadow: i < input.length ? '0 0 8px rgba(255,105,180,0.5)' : 'none',
              ...(shake ? { animation: 'shake 0.4s' } : {}),
            }} />
          ))}
        </div>

        {/* Keypad */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, width: '100%' }}>
          {['1','2','3','4','5','6','7','8','9','←','0',''].map((k, i) => (
            k === '' ? <div key={i} /> :
            <button key={i} onClick={() => handleKey(k)} style={{
              background: '#fff5f9', border: '1px solid #f5c6d8', borderRadius: 14,
              color: '#4a2040', fontSize: k === '←' ? 18 : 20, fontFamily: "'Quicksand', sans-serif",
              fontWeight: 600, padding: '14px 0', cursor: 'pointer', transition: 'all 0.15s',
            }}
            onMouseOver={e => { e.target.style.background = '#ffe0ee'; e.target.style.borderColor = '#ff69b4' }}
            onMouseOut={e => { e.target.style.background = '#fff5f9'; e.target.style.borderColor = '#f5c6d8' }}
            >{k}</button>
          ))}
        </div>
      </div>

      <style>{`@keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }`}</style>
    </div>
  )
}

// ── Nav ────────────────────────────────────────────────────────────────────
const NAV_ITEMS = ['Overview', 'Phases', 'Workstreams', 'Actions', 'Timeline', 'Team']

function Nav({ active }) {
  const scrollTo = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(255,240,245,0.92)', backdropFilter: 'blur(12px)',
      borderBottom: '2px solid #ffb6d9', padding: '0 24px',
      display: 'flex', alignItems: 'center', gap: 4, height: 56,
      boxShadow: '0 2px 12px rgba(233,30,140,0.08)',
    }}>
      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: '#e91e8c', marginRight: 20, flexShrink: 0 }}>
        ✨ 32A
      </span>
      <div style={{ display: 'flex', gap: 2, overflowX: 'auto', paddingBottom: 2 }}>
        {NAV_ITEMS.map(item => (
          <button key={item} onClick={() => scrollTo(item)} style={{
            background: active === item ? 'rgba(233,30,140,0.12)' : 'transparent',
            border: 'none', borderRadius: 12,
            color: active === item ? '#e91e8c' : '#b8789a',
            padding: '6px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 600,
            fontFamily: "'Quicksand', sans-serif", whiteSpace: 'nowrap', transition: 'all 0.15s',
          }}
          onMouseOver={e => { if (active !== item) e.currentTarget.style.color = '#e91e8c' }}
          onMouseOut={e => { if (active !== item) e.currentTarget.style.color = '#b8789a' }}
          >{item}</button>
        ))}
      </div>
    </nav>
  )
}

// ── Small shared components ────────────────────────────────────────────────
function Badge({ label, color, bg }) {
  return (
    <span style={{ background: bg, color, fontSize: 11, fontWeight: 700, padding: '3px 11px', borderRadius: 20, letterSpacing: 0.3 }}>
      {label}
    </span>
  )
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: '#ffffff', border: '1px solid #f5c6d8', borderRadius: 20,
      padding: 24, boxShadow: '0 4px 16px rgba(233,30,140,0.06)',
      transition: 'box-shadow 0.2s', ...style,
    }}>
      {children}
    </div>
  )
}

function SectionTitle({ children }) {
  return (
    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, marginBottom: 20, color: '#4a2040' }}>
      {children}
    </h2>
  )
}

// ── Section: Overview ──────────────────────────────────────────────────────
function Overview() {
  return (
    <section id="overview" style={{ paddingTop: 80, paddingBottom: 48 }}>
      <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Badge label="Phase 1 — Non-structural 💅" color="#e91e8c" bg="rgba(233,30,140,0.12)" />
      </div>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 44, lineHeight: 1.1, marginBottom: 6, color: '#4a2040' }}>
        ✨ 32A Tressillian Road ✨
      </h1>
      <p style={{ color: '#b8789a', fontSize: 14, marginBottom: 6, fontWeight: 600 }}>Brockley, London SE4 1YB · Last updated {data.meta.lastUpdated}</p>
      <p style={{ color: '#e91e8c', fontSize: 16, marginBottom: 32, fontStyle: 'italic', fontWeight: 500 }}>
        "Hi! I'm Barbie, and today we're managing a renovation! 💖🏡"
      </p>

      {/* Key dates */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 36 }}>
        {data.keyDates.slice(0, 3).map(d => (
          <div key={d.label} style={{
            background: '#ffffff', border: '1px solid #f5c6d8', borderRadius: 16,
            padding: '10px 18px', display: 'flex', flexDirection: 'column', gap: 2,
            boxShadow: '0 2px 8px rgba(233,30,140,0.06)',
          }}>
            <span style={{ color: '#b8789a', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>{d.label}</span>
            <span style={{ color: '#e91e8c', fontWeight: 700, fontSize: 15 }}>{d.date.replace('2026-', '')}</span>
            <span style={{ color: '#b8789a', fontSize: 12 }}>{d.note}</span>
          </div>
        ))}
      </div>

      {/* Workstream pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {data.workstreams.map((ws) => {
          const s = STATUS_COLOUR[ws.status] || STATUS_COLOUR['active']
          return (
            <div key={ws.id} onClick={() => document.getElementById('workstreams')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ background: s.bg, border: `1px solid ${s.dot}33`, borderRadius: 12, padding: '6px 14px',
                display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer',
              }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
              <span style={{ color: s.text, fontSize: 13, fontWeight: 600 }}>{ws.name}</span>
            </div>
          )
        })}
      </div>
    </section>
  )
}

// ── Section: Phases ────────────────────────────────────────────────────────
function Phases() {
  const { phase1, phase2, workstreams } = data
  const gateStatuses = {
    'Planning permission': workstreams.find(w => w.id === 'planning')?.status,
    'Building control approval': workstreams.find(w => w.id === 'building-control')?.status,
    'Party wall awards (3 relationships)': workstreams.find(w => w.id === 'party-wall')?.status,
    'Licence to Alter': workstreams.find(w => w.id === 'lta')?.status,
  }

  return (
    <section id="phases" style={{ paddingTop: 72, paddingBottom: 48 }}>
      <SectionTitle>✨ Phase Tracker ✨</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>

        {/* Phase 1 */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 11, color: '#b8789a', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4, fontWeight: 700 }}>Phase 1</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: '#4a2040' }}>The Glow-Up Phase 💅</h3>
            </div>
            <Badge label="Let's Go! 🎀" color="#22c55e" bg="rgba(34,197,94,0.12)" />
          </div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
            <div style={{ fontSize: 13, color: '#b8789a' }}>🏗 <span style={{ color: '#4a2040', fontWeight: 600 }}>{phase1.contractor.split('(')[0].trim()}</span></div>
            <div style={{ fontSize: 13, color: '#b8789a' }}>📅 <span style={{ color: '#4a2040', fontWeight: 600 }}>{phase1.startDate}</span></div>
            <div style={{ fontSize: 13, color: '#b8789a' }}>⏱ <span style={{ color: '#4a2040', fontWeight: 600 }}>~{phase1.estimatedWeeks} fabulous weeks</span></div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {phase1.rooms.map(room => {
              const s = ROOM_STATUS[room.status] || ROOM_STATUS['not-started']
              return (
                <div key={room.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ color: s.color, fontSize: 16, width: 18, textAlign: 'center', flexShrink: 0 }}>{s.icon}</span>
                  <span style={{ fontSize: 14, color: room.status === 'complete' ? '#b8789a' : '#4a2040', fontWeight: 500 }}>{room.name}</span>
                  {room.note && <span style={{ fontSize: 12, color: '#b8789a', marginLeft: 'auto' }}>{room.note}</span>}
                </div>
              )
            })}
          </div>
        </Card>

        {/* Phase 2 */}
        <Card style={{ opacity: 0.75, position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #fff5f9 0%, #ffe8f0 100%)' }}>
          <div style={{
            position: 'absolute', top: 12, right: 12,
            background: '#ffe0ee', borderRadius: 20, padding: '4px 12px',
            fontSize: 12, color: '#e91e8c', display: 'flex', alignItems: 'center', gap: 5, fontWeight: 600,
          }}>
            🔒 Gated (but we're working on it!)
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: '#b8789a', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4, fontWeight: 700 }}>Phase 2</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: '#4a2040' }}>The BIG Transformation 🏗️✨</h3>
            <p style={{ fontSize: 13, color: '#b8789a', marginTop: 4, fontWeight: 500 }}>Summer 2026 — requires all 4 approvals. We've SO got this! 💪</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            {phase2.gateConditions.map((cond) => {
              return (
                <div key={cond} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#e91e8c', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: '#4a2040', fontWeight: 500 }}>{cond}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 11, color: '#e91e8c', fontWeight: 600 }}>Pending 🤞</span>
                </div>
              )
            })}
          </div>
          <div style={{ borderTop: '1px solid #f5c6d8', paddingTop: 14, fontSize: 13, color: '#b8789a', fontStyle: 'italic' }}>
            ✨ Open-plan dream kitchen, structural wall removal, gorgeous bifold doors, brand new slab — it's going to be INCREDIBLE!
          </div>
        </Card>
      </div>
    </section>
  )
}

// ── Section: Workstreams ───────────────────────────────────────────────────
function WorkstreamCard({ ws }) {
  const [open, setOpen] = useState(false)
  const s = STATUS_COLOUR[ws.status] || STATUS_COLOUR['active']

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
            <Badge label={s.label} color={s.text} bg={s.bg} />
            <span style={{ fontSize: 11, color: '#b8789a', fontWeight: 500 }}>Updated {ws.lastUpdate}</span>
          </div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: '#4a2040' }}>{ws.name}</h3>
        </div>
        <div style={{ width: 38, height: 38, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.text, fontWeight: 700, fontSize: 16, flexShrink: 0, border: `1px solid ${s.dot}33` }}>
          {ws.number}
        </div>
      </div>

      <p style={{ fontSize: 13, color: '#6b3a5a', marginBottom: 14, lineHeight: 1.6 }}>{ws.summary}</p>

      {ws.waitingOn && (
        <div style={{ background: 'rgba(233,30,140,0.06)', border: '1px solid rgba(233,30,140,0.2)', borderRadius: 12, padding: '8px 12px', marginBottom: 14, fontSize: 13 }}>
          <span style={{ color: '#e91e8c', fontWeight: 700 }}>Waiting on: </span>
          <span style={{ color: '#6b3a5a' }}>{ws.waitingOn}</span>
        </div>
      )}

      {ws.nickActions?.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          {ws.nickActions.map(a => (
            <div key={a} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#6b3a5a' }}>
              <span style={{ color: '#e91e8c', fontWeight: 700, flexShrink: 0 }}>→ You:</span>
              <span>{a}</span>
            </div>
          ))}
        </div>
      )}

      <button onClick={() => setOpen(!open)} style={{
        background: 'none', border: 'none', color: '#b8789a', cursor: 'pointer',
        fontSize: 12, padding: 0, display: 'flex', alignItems: 'center', gap: 5, fontFamily: "'Quicksand', sans-serif", fontWeight: 600,
      }}>
        {open ? '▲ Hide details' : '▼ Show me everything! 💅'}
      </button>

      {open && (
        <div style={{ marginTop: 16, borderTop: '1px solid #f5c6d8', paddingTop: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ws.detail.map((d, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, fontSize: 13 }}>
                <span style={{ color: '#e91e8c', flexShrink: 0, marginTop: 2 }}>💖</span>
                <span style={{ color: '#6b3a5a', lineHeight: 1.5 }}>{d}</span>
              </div>
            ))}
          </div>
          {ws.contacts?.length > 0 && (
            <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {ws.contacts.map(c => c.email ? (
                <a key={c.name} href={`mailto:${c.email}`} style={{
                  background: '#fff5f9', border: '1px solid #f5c6d8', borderRadius: 10,
                  padding: '5px 12px', fontSize: 12, color: '#e91e8c', textDecoration: 'none', fontWeight: 600,
                }}>✉ {c.name}</a>
              ) : (
                <span key={c.name} style={{ background: '#fff5f9', border: '1px solid #f5c6d8', borderRadius: 10, padding: '5px 12px', fontSize: 12, color: '#b8789a', fontWeight: 500 }}>{c.name}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  )
}

function Workstreams() {
  return (
    <section id="workstreams" style={{ paddingTop: 72, paddingBottom: 48 }}>
      <SectionTitle>💅 Workstreams 💅</SectionTitle>
      <p style={{ color: '#b8789a', fontSize: 13, marginBottom: 24, fontWeight: 500 }}>All four need to be cleared before Phase 2 can happen — but like, we're totally on track! ✨</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
        {data.workstreams.map(ws => <WorkstreamCard key={ws.id} ws={ws} />)}
      </div>
    </section>
  )
}

// ── Section: Actions ───────────────────────────────────────────────────────
function ActionCard({ action, side }) {
  const ws = data.workstreams.find(w => w.id === action.workstream)
  const bg = side === 'waiting' ? 'rgba(233,30,140,0.05)' : 'rgba(139,92,246,0.05)'
  const border = side === 'waiting' ? 'rgba(233,30,140,0.2)' : 'rgba(139,92,246,0.2)'

  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 16, padding: '14px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 6 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: '#4a2040', lineHeight: 1.3 }}>{action.title}</div>
        {action.priority === 'high' && <span style={{ fontSize: 10, fontWeight: 700, color: '#e91e8c', background: 'rgba(233,30,140,0.12)', padding: '2px 8px', borderRadius: 10, flexShrink: 0 }}>URGENT 💅</span>}
      </div>
      <p style={{ fontSize: 13, color: '#6b3a5a', marginBottom: 10, lineHeight: 1.5 }}>{action.description}</p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        {ws && <span style={{ fontSize: 11, color: '#b8789a', background: '#fff5f9', border: '1px solid #f5c6d8', padding: '2px 8px', borderRadius: 8, fontWeight: 500 }}>{ws.name}</span>}
        {action.dueNote && <span style={{ fontSize: 11, color: '#b8789a' }}>🕐 {action.dueNote}</span>}
        {action.owner && side === 'waiting' && <span style={{ fontSize: 11, color: '#e91e8c', marginLeft: 'auto', fontWeight: 600 }}>→ {action.owner}</span>}
      </div>
    </div>
  )
}

function Actions() {
  const waiting = data.actions.filter(a => a.type === 'waiting')
  const nick = data.actions.filter(a => a.type === 'nick')

  return (
    <section id="actions" style={{ paddingTop: 72, paddingBottom: 48 }}>
      <SectionTitle>📋 Actions — Let's Get It Done! 💪</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>

        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#e91e8c', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>⏳</span> Waiting on others — patience is a virtue, babes! ({waiting.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {waiting.map(a => <ActionCard key={a.id} action={a} side="waiting" />)}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#8b5cf6', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>💅</span> Nick's to-do list — you've got this! ({nick.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {nick.map(a => <ActionCard key={a.id} action={a} side="nick" />)}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Section: Timeline ──────────────────────────────────────────────────────
function Timeline() {
  return (
    <section id="timeline" style={{ paddingTop: 72, paddingBottom: 48 }}>
      <SectionTitle>📅 Our Journey So Far ✨</SectionTitle>
      <div style={{ position: 'relative', paddingLeft: 32 }}>
        {/* vertical line */}
        <div style={{ position: 'absolute', left: 7, top: 8, bottom: 0, width: 2, background: 'linear-gradient(to bottom, #ff69b4, #e91e8c, #8b5cf6)' }} />

        {data.timeline.map((item, i) => {
          const color = TIMELINE_COLOUR[item.type] || '#b8789a'
          const muted = item.type === 'upcoming' || item.type === 'admin'
          return (
            <div key={i} style={{ position: 'relative', marginBottom: 24, opacity: muted ? 0.65 : 1 }}>
              {/* dot */}
              <div style={{
                position: 'absolute', left: -28, top: 4, width: 12, height: 12,
                borderRadius: '50%', background: color, border: '2px solid #fff0f5',
                zIndex: 1, boxShadow: `0 0 8px ${color}44`,
              }} />
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'baseline' }}>
                <span style={{ fontSize: 12, color: color, fontWeight: 700, flexShrink: 0, minWidth: 90 }}>{item.date}</span>
                <span style={{ fontSize: 14, color: muted ? '#b8789a' : '#4a2040', lineHeight: 1.4, fontWeight: 500 }}>{item.event}</span>
                {item.type === 'decision' && <span style={{ fontSize: 10, color: '#8b5cf6', fontWeight: 700, background: 'rgba(139,92,246,0.1)', padding: '1px 8px', borderRadius: 8 }}>DECISION 💅</span>}
                {item.type === 'personal' && <span style={{ fontSize: 10, color: '#ff69b4', fontWeight: 700, background: 'rgba(255,105,180,0.1)', padding: '1px 8px', borderRadius: 8 }}>PERSONAL 💖</span>}
                {item.type === 'upcoming' && <span style={{ fontSize: 10, color: '#b8789a', fontWeight: 600, background: '#ffe8f0', padding: '1px 8px', borderRadius: 8 }}>COMING SOON ✨</span>}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

// ── Section: Team ──────────────────────────────────────────────────────────
function Team() {
  return (
    <section id="team" style={{ paddingTop: 72, paddingBottom: 80 }}>
      <SectionTitle>👑 The Dream Team 👑</SectionTitle>
      <p style={{ color: '#b8789a', fontSize: 14, marginBottom: 24, fontWeight: 500, fontStyle: 'italic' }}>
        "You can be anything!" — and these people are proving it every day ✨
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
        {data.team.map(member => (
          <Card key={member.name} style={{ padding: '18px 20px' }}>
            <div style={{ fontSize: 11, color: '#e91e8c', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6, fontWeight: 700 }}>{member.role}</div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2, color: '#4a2040' }}>{member.name}</div>
            <div style={{ fontSize: 13, color: '#b8789a', marginBottom: 10, fontWeight: 500 }}>{member.company}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {member.email && <a href={`mailto:${member.email}`} style={{ fontSize: 12, color: '#e91e8c', textDecoration: 'none', fontWeight: 600 }}>✉ {member.email}</a>}
              {member.phone && <a href={`tel:${member.phone}`} style={{ fontSize: 12, color: '#e91e8c', textDecoration: 'none', fontWeight: 600 }}>📞 {member.phone}</a>}
              {member.note && <span style={{ fontSize: 12, color: '#b8789a', fontStyle: 'italic' }}>{member.note}</span>}
              {member.ref && <span style={{ fontSize: 12, color: '#b8789a' }}>Ref: {member.ref}</span>}
            </div>
          </Card>
        ))}
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: 64, padding: 32, color: '#b8789a', fontSize: 14 }}>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: '#e91e8c', marginBottom: 8 }}>
          ✨ "This renovation is going to be, like, totally amazing!" ✨
        </p>
        <p style={{ fontSize: 12, fontWeight: 500 }}>Made with 💖 by Barbie (and a little help from Cordyceps 🍄)</p>
      </div>
    </section>
  )
}

// ── Root ───────────────────────────────────────────────────────────────────
export default function App() {
  const [unlocked, setUnlocked] = useState(!!sessionStorage.getItem('reno_pin'))
  const [activeSection, setActiveSection] = useState('Overview')
  const contentRef = useRef(null)

  useEffect(() => {
    if (!unlocked) return
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id.charAt(0).toUpperCase() + e.target.id.slice(1)) })
      },
      { rootMargin: '-30% 0px -60% 0px' }
    )
    NAV_ITEMS.forEach(item => {
      const el = document.getElementById(item.toLowerCase())
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [unlocked])

  if (!unlocked) return <PinGate onUnlock={() => setUnlocked(true)} />

  return (
    <div ref={contentRef}>
      <SparkleRain />
      <Nav active={activeSection} />
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '0 20px' }}>
        <Overview />
        <Phases />
        <Workstreams />
        <Actions />
        <Timeline />
        <Team />
      </main>
    </div>
  )
}
