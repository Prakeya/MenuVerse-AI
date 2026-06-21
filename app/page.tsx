'use client'

import { useState } from 'react'
import { useI18n } from '../lib/contexts'
import { LANGUAGES } from '../lib/mockData'
import { Globe, ChevronDown, Building2, Users } from 'lucide-react'

const SEEDED_AVATARS = ['https://i.pravatar.cc/40?u=1', 'https://i.pravatar.cc/40?u=2', 'https://i.pravatar.cc/40?u=3']

export default function LandingPage() {
  const { lang, setLang } = useI18n()
  const [showLang, setShowLang] = useState(false)

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=2000&q=80" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(10,10,10,0.9))' }} />
      </div>

      <header style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#F5A623', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, color: '#111' }}>M</div>
          <span style={{ fontWeight: 600, fontSize: 15, color: 'white', letterSpacing: '-0.3px' }}>MenuVerse AI</span>
        </div>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowLang(!showLang)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 999, padding: '8px 14px', color: 'white', cursor: 'pointer', fontSize: 13 }}>
              <Globe size={16} />
              <span style={{ fontWeight: 600 }}>{lang.toUpperCase()}</span>
              <ChevronDown size={14} />
            </button>
            {showLang && (
              <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 8, background: 'white', borderRadius: 16, boxShadow: '0 12px 32px rgba(0,0,0,0.2)', padding: 8, minWidth: 160, zIndex: 20 }}>
                {LANGUAGES.map(l => (
                  <button key={l.code} onClick={() => { setLang(l.code); setShowLang(false) }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', borderRadius: 8, border: 'none', background: lang === l.code ? '#f5f5f5' : 'transparent', cursor: 'pointer', fontSize: 13, color: '#1a1a1a' }}>
                    {l.name} {lang === l.code && '✓'}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>
      </header>

      <main style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 160px)', padding: '0 24px' }}>
        <div style={{ maxWidth: 700, textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 999, padding: '6px 16px 6px 6px', marginBottom: 32 }}>
            <div style={{ display: 'flex' }}>
              {SEEDED_AVATARS.map((src, i) => (
                <img key={i} src={src} alt="" style={{ width: 28, height: 28, borderRadius: '50%', marginLeft: i > 0 ? -8 : 0, border: '2px solid #0a0a0a', objectFit: 'cover' }} />
              ))}
            </div>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>2,400+ restaurants join the table. <span style={{ color: 'white' }}>Join us.</span></span>
          </div>

          <h1 style={{ fontSize: 'clamp(40px, 8vw, 80px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-3px', color: 'white', margin: 0 }}>
            Taste.<span style={{ color: '#F5A623' }}> Order.</span><br />Delight.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, marginTop: 20, maxWidth: 500, margin: '20px auto 0', lineHeight: 1.6 }}>
            AI-powered restaurant OS that turns every table into a cinematic dining experience.
          </p>

          <div style={{ display: 'flex', flexDirection: 'row', gap: 16, justifyContent: 'center', marginTop: 40 }}>
            <a href="/diner-choice" style={{ background: '#F5A623', color: '#111', border: 'none', borderRadius: 999, padding: '16px 32px', fontSize: 16, fontWeight: 700, cursor: 'pointer', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <Users size={20} />
              I'm a Diner
            </a>
            <a href="/login" style={{ background: '#111', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 999, padding: '16px 32px', fontSize: 16, fontWeight: 600, cursor: 'pointer', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <Building2 size={20} />
              I'm an Owner
            </a>
          </div>
        </div>
      </main>

      <div style={{ position: 'relative', zIndex: 10, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '20px 32px', textAlign: 'center' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { val: '2,400+', label: 'RESTAURANTS' },
            { val: '1.2M+', label: 'ORDERS SERVED' },
            { val: '98%', label: 'SATISFACTION' },
            { val: '4.9★', label: 'APP RATING' },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'white' }}>{s.val}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '2px', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}