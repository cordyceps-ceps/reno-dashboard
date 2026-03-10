import { useState, useEffect, useRef } from 'react'
import data from '../renovation-data.json'

const PIN = '7315'

// ── Colours ────────────────────────────────────────────────────────────────
const STATUS_COLOUR = {
  'in-progress': { dot: '#f59e0b', label: 'In Progress',  bg: 'rgba(245,158,11,0.12)',  text: '#f59e0b' },
  'active':      { dot: '#f59e0b', label: 'Active',        bg: 'rgba(245,158,11,0.12)',  text: '#f59e0b' },
  'imminent':    { dot: '#60a5fa', label: 'Imminent',      bg: 'rgba(96,165,250,0.12)',  text: '#60a5fa' },
  'submitted':   { dot: '#60a5fa', label: 'Submitted',     bg: 'rgba(96,165,250,0.12)',  text: '#60a5fa' },
  'complete':    { dot: '#22c55e', label: 'Complete',      bg: 'rgba(34,197,94,0.12)',   text: '#22c55e' },
  'blocked':     { dot: '#ef4444', label: 'Blocked',       bg: 'rgba(239,68,68,0.12)',   text: '#ef4444' },
}

const ROOM_STATUS = {
  'complete':    { icon: '✓', color: '#22c55e' },
  'in-prep':     { icon: '◐', color: '#f59e0b' },
  'not-started': { icon: '○', color: '#8888a0' },
}

const TIMELINE_COLOUR = {
  milestone: '#d4a853',
  decision:  '#60a5fa',
  upcoming:  '#8888a0',
  personal:  '#f472b6',
  admin:     '#8888a0',
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
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, marginBottom: 4 }}>32A Tressillian</div>
        <div style={{ color: '#8888a0', fontSize: 13 }}>Renovation Dashboard</div>
      </div>

      <div style={{
        background: '#18181d', border: '1px solid #2a2a35', borderRadius: 16, padding: '32px 28px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, width: 280,
      }}>
        {/* Dots */}
        <div style={{ display: 'flex', gap: 14 }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{
              width: 14, height: 14, borderRadius: '50%',
              background: i < input.length ? '#d4a853' : '#2a2a35',
              transition: 'background 0.15s',
              ...(shake ? { animation: 'shake 0.4s' } : {}),
            }} />
          ))}
        </div>

        {/* Keypad */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, width: '100%' }}>
          {['1','2','3','4','5','6','7','8','9','←','0',''].map((k, i) => (
            k === '' ? <div key={i} /> :
            <button key={i} onClick={() => handleKey(k)} style={{
              background: '#0f0f11', border: '1px solid #2a2a35', borderRadius: 10,
              color: '#e8e8ef', fontSize: k === '←' ? 18 : 20, fontFamily: "'DM Sans', sans-serif",
              padding: '14px 0', cursor: 'pointer', transition: 'background 0.1s',
            }}
            onMouseOver={e => e.target.style.background = '#23232a'}
            onMouseOut={e => e.target.style.background = '#0f0f11'}
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
      background: 'rgba(15,15,17,0.9)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #2a2a35', padding: '0 24px',
      display: 'flex', alignItems: 'center', gap: 4, height: 56,
    }}>
      <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 16, color: '#d4a853', marginRight: 20, flexShrink: 0 }}>
        32A
      </span>
      <div style={{ display: 'flex', gap: 2, overflowX: 'auto', paddingBottom: 2 }}>
        {NAV_ITEMS.map(item => (
          <button key={item} onClick={() => scrollTo(item)} style={{
            background: active === item ? 'rgba(212,168,83,0.15)' : 'transparent',
            border: 'none', borderRadius: 8,
            color: active === item ? '#d4a853' : '#8888a0',
            padding: '6px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 500,
            fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap', transition: 'all 0.15s',
          }}
          onMouseOver={e => { if (active !== item) e.currentTarget.style.color = '#e8e8ef' }}
          onMouseOut={e => { if (active !== item) e.currentTarget.style.color = '#8888a0' }}
          >{item}</button>
        ))}
      </div>
    </nav>
  )
}

// ── Small shared components ────────────────────────────────────────────────
function Badge({ label, color, bg }) {
  return (
    <span style={{ background: bg, color, fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20, letterSpacing: 0.3 }}>
      {label}
    </span>
  )
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: '#18181d', border: '1px solid #2a2a35', borderRadius: 14,
      padding: 24, ...style,
    }}>
      {children}
    </div>
  )
}

function SectionTitle({ children }) {
  return (
    <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, marginBottom: 20, color: '#e8e8ef' }}>
      {children}
    </h2>
  )
}

// ── Section: Overview ──────────────────────────────────────────────────────
function Overview() {
  const wsStatus = data.workstreams.map(w => STATUS_COLOUR[w.status] || STATUS_COLOUR['active'])
  return (
    <section id="overview" style={{ paddingTop: 80, paddingBottom: 48 }}>
      <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Badge label="Phase 1 — Non-structural" color="#d4a853" bg="rgba(212,168,83,0.15)" />
      </div>
      <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 44, lineHeight: 1.1, marginBottom: 6 }}>
        32A Tressillian Road
      </h1>
      <p style={{ color: '#8888a0', fontSize: 14, marginBottom: 32 }}>Brockley, London SE4 1YB · Last updated {data.meta.lastUpdated}</p>

      {/* Key dates */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 36 }}>
        {data.keyDates.slice(0, 3).map(d => (
          <div key={d.label} style={{
            background: '#18181d', border: '1px solid #2a2a35', borderRadius: 10,
            padding: '10px 18px', display: 'flex', flexDirection: 'column', gap: 2,
          }}>
            <span style={{ color: '#8888a0', fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>{d.label}</span>
            <span style={{ color: '#d4a853', fontWeight: 600, fontSize: 15 }}>{d.date.replace('2026-', '')}</span>
            <span style={{ color: '#8888a0', fontSize: 12 }}>{d.note}</span>
          </div>
        ))}
      </div>

      {/* Workstream pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {data.workstreams.map((ws, i) => {
          const s = STATUS_COLOUR[ws.status] || STATUS_COLOUR['active']
          return (
            <div key={ws.id} onClick={() => document.getElementById('workstreams')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ background: s.bg, border: `1px solid ${s.dot}33`, borderRadius: 8, padding: '6px 14px',
                display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer',
              }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
              <span style={{ color: s.text, fontSize: 13, fontWeight: 500 }}>{ws.name}</span>
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
      <SectionTitle>Phase Tracker</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>

        {/* Phase 1 */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 11, color: '#8888a0', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Phase 1</div>
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22 }}>Non-structural Works</h3>
            </div>
            <Badge label="Active" color="#22c55e" bg="rgba(34,197,94,0.12)" />
          </div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
            <div style={{ fontSize: 13, color: '#8888a0' }}>🏗 <span style={{ color: '#e8e8ef' }}>{phase1.contractor.split('(')[0].trim()}</span></div>
            <div style={{ fontSize: 13, color: '#8888a0' }}>📅 <span style={{ color: '#e8e8ef' }}>{phase1.startDate}</span></div>
            <div style={{ fontSize: 13, color: '#8888a0' }}>⏱ <span style={{ color: '#e8e8ef' }}>~{phase1.estimatedWeeks} weeks</span></div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {phase1.rooms.map(room => {
              const s = ROOM_STATUS[room.status] || ROOM_STATUS['not-started']
              return (
                <div key={room.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ color: s.color, fontSize: 16, width: 18, textAlign: 'center', flexShrink: 0 }}>{s.icon}</span>
                  <span style={{ fontSize: 14, color: room.status === 'complete' ? '#8888a0' : '#e8e8ef' }}>{room.name}</span>
                  {room.note && <span style={{ fontSize: 12, color: '#8888a0', marginLeft: 'auto' }}>{room.note}</span>}
                </div>
              )
            })}
          </div>
        </Card>

        {/* Phase 2 */}
        <Card style={{ opacity: 0.7, position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: 12, right: 12,
            background: '#2a2a35', borderRadius: 20, padding: '4px 10px',
            fontSize: 12, color: '#8888a0', display: 'flex', alignItems: 'center', gap: 5,
          }}>
            🔒 Gated
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: '#8888a0', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Phase 2</div>
            <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22 }}>Structural Works</h3>
            <p style={{ fontSize: 13, color: '#8888a0', marginTop: 4 }}>Summer 2026 — requires all 4 approvals</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            {phase2.gateConditions.map((cond, i) => {
              const ws = Object.keys(gateStatuses)[i]
              const st = gateStatuses[cond]
              const cleared = st === 'complete'
              return (
                <div key={cond} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: cleared ? '#22c55e' : '#f59e0b', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: cleared ? '#8888a0' : '#e8e8ef' }}>{cond}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 11, color: cleared ? '#22c55e' : '#f59e0b' }}>{cleared ? 'Cleared' : 'Pending'}</span>
                </div>
              )
            })}
          </div>
          <div style={{ borderTop: '1px solid #2a2a35', paddingTop: 14, fontSize: 13, color: '#8888a0', fontStyle: 'italic' }}>
            Key works: open-plan reconfiguration, structural wall removal, bifold doors, new RC slab
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
            <span style={{ fontSize: 11, color: '#8888a0' }}>Updated {ws.lastUpdate}</span>
          </div>
          <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20 }}>{ws.name}</h3>
        </div>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.text, fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
          {ws.number}
        </div>
      </div>

      <p style={{ fontSize: 13, color: '#c0c0d0', marginBottom: 14, lineHeight: 1.5 }}>{ws.summary}</p>

      {ws.waitingOn && (
        <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8, padding: '8px 12px', marginBottom: 14, fontSize: 13 }}>
          <span style={{ color: '#f59e0b', fontWeight: 600 }}>Waiting on: </span>
          <span style={{ color: '#c0c0d0' }}>{ws.waitingOn}</span>
        </div>
      )}

      {ws.nickActions?.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          {ws.nickActions.map(a => (
            <div key={a} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#c0c0d0' }}>
              <span style={{ color: '#d4a853', fontWeight: 600, flexShrink: 0 }}>→ You:</span>
              <span>{a}</span>
            </div>
          ))}
        </div>
      )}

      <button onClick={() => setOpen(!open)} style={{
        background: 'none', border: 'none', color: '#8888a0', cursor: 'pointer',
        fontSize: 12, padding: 0, display: 'flex', alignItems: 'center', gap: 5, fontFamily: "'DM Sans', sans-serif",
      }}>
        {open ? '▲' : '▼'} {open ? 'Hide detail' : 'Show detail'}
      </button>

      {open && (
        <div style={{ marginTop: 16, borderTop: '1px solid #2a2a35', paddingTop: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ws.detail.map((d, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, fontSize: 13 }}>
                <span style={{ color: '#d4a853', flexShrink: 0, marginTop: 2 }}>·</span>
                <span style={{ color: '#c0c0d0', lineHeight: 1.5 }}>{d}</span>
              </div>
            ))}
          </div>
          {ws.contacts?.length > 0 && (
            <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {ws.contacts.map(c => c.email ? (
                <a key={c.name} href={`mailto:${c.email}`} style={{
                  background: '#0f0f11', border: '1px solid #2a2a35', borderRadius: 8,
                  padding: '5px 12px', fontSize: 12, color: '#60a5fa', textDecoration: 'none',
                }}>✉ {c.name}</a>
              ) : (
                <span key={c.name} style={{ background: '#0f0f11', border: '1px solid #2a2a35', borderRadius: 8, padding: '5px 12px', fontSize: 12, color: '#8888a0' }}>{c.name}</span>
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
      <SectionTitle>Workstreams</SectionTitle>
      <p style={{ color: '#8888a0', fontSize: 13, marginBottom: 24 }}>All four must be cleared before Phase 2 structural works can begin.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
        {data.workstreams.map(ws => <WorkstreamCard key={ws.id} ws={ws} />)}
      </div>
    </section>
  )
}

// ── Section: Actions ───────────────────────────────────────────────────────
function ActionCard({ action, side }) {
  const ws = data.workstreams.find(w => w.id === action.workstream)
  const bg = side === 'waiting' ? 'rgba(245,158,11,0.06)' : 'rgba(239,68,68,0.06)'
  const border = side === 'waiting' ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.2)'

  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 12, padding: '14px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 6 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: '#e8e8ef', lineHeight: 1.3 }}>{action.title}</div>
        {action.priority === 'high' && <span style={{ fontSize: 10, fontWeight: 700, color: '#ef4444', background: 'rgba(239,68,68,0.15)', padding: '2px 7px', borderRadius: 10, flexShrink: 0 }}>HIGH</span>}
      </div>
      <p style={{ fontSize: 13, color: '#c0c0d0', marginBottom: 10, lineHeight: 1.5 }}>{action.description}</p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        {ws && <span style={{ fontSize: 11, color: '#8888a0', background: '#0f0f11', border: '1px solid #2a2a35', padding: '2px 8px', borderRadius: 6 }}>{ws.name}</span>}
        {action.dueNote && <span style={{ fontSize: 11, color: '#8888a0' }}>🕐 {action.dueNote}</span>}
        {action.owner && side === 'waiting' && <span style={{ fontSize: 11, color: '#f59e0b', marginLeft: 'auto' }}>→ {action.owner}</span>}
      </div>
    </div>
  )
}

function Actions() {
  const waiting = data.actions.filter(a => a.type === 'waiting')
  const nick = data.actions.filter(a => a.type === 'nick')

  return (
    <section id="actions" style={{ paddingTop: 72, paddingBottom: 48 }}>
      <SectionTitle>Actions</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>

        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#f59e0b', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>⏳</span> Waiting on others ({waiting.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {waiting.map(a => <ActionCard key={a.id} action={a} side="waiting" />)}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#ef4444', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>→</span> Nick needs to act ({nick.length})
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
      <SectionTitle>Timeline</SectionTitle>
      <div style={{ position: 'relative', paddingLeft: 32 }}>
        {/* vertical line */}
        <div style={{ position: 'absolute', left: 7, top: 8, bottom: 0, width: 2, background: '#2a2a35' }} />

        {data.timeline.map((item, i) => {
          const color = TIMELINE_COLOUR[item.type] || '#8888a0'
          const muted = item.type === 'upcoming' || item.type === 'admin'
          return (
            <div key={i} style={{ position: 'relative', marginBottom: 24, opacity: muted ? 0.65 : 1 }}>
              {/* dot */}
              <div style={{
                position: 'absolute', left: -28, top: 4, width: 12, height: 12,
                borderRadius: '50%', background: color, border: '2px solid #0f0f11',
                zIndex: 1,
              }} />
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'baseline' }}>
                <span style={{ fontSize: 12, color: color, fontWeight: 600, flexShrink: 0, minWidth: 90 }}>{item.date}</span>
                <span style={{ fontSize: 14, color: muted ? '#8888a0' : '#e8e8ef', lineHeight: 1.4 }}>{item.event}</span>
                {item.type === 'decision' && <span style={{ fontSize: 10, color: '#60a5fa', fontWeight: 700, background: 'rgba(96,165,250,0.1)', padding: '1px 7px', borderRadius: 8 }}>DECISION</span>}
                {item.type === 'personal' && <span style={{ fontSize: 10, color: '#f472b6', fontWeight: 700, background: 'rgba(244,114,182,0.1)', padding: '1px 7px', borderRadius: 8 }}>PERSONAL</span>}
                {item.type === 'upcoming' && <span style={{ fontSize: 10, color: '#8888a0', fontWeight: 600, background: '#1e1e24', padding: '1px 7px', borderRadius: 8 }}>UPCOMING</span>}
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
      <SectionTitle>Team</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
        {data.team.map(member => (
          <Card key={member.name} style={{ padding: '18px 20px' }}>
            <div style={{ fontSize: 11, color: '#8888a0', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>{member.role}</div>
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 2 }}>{member.name}</div>
            <div style={{ fontSize: 13, color: '#8888a0', marginBottom: 10 }}>{member.company}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {member.email && <a href={`mailto:${member.email}`} style={{ fontSize: 12, color: '#60a5fa', textDecoration: 'none' }}>✉ {member.email}</a>}
              {member.phone && <a href={`tel:${member.phone}`} style={{ fontSize: 12, color: '#60a5fa', textDecoration: 'none' }}>📞 {member.phone}</a>}
              {member.note && <span style={{ fontSize: 12, color: '#8888a0', fontStyle: 'italic' }}>{member.note}</span>}
              {member.ref && <span style={{ fontSize: 12, color: '#8888a0' }}>Ref: {member.ref}</span>}
            </div>
          </Card>
        ))}
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
