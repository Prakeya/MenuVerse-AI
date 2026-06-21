'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, ScanLine, UtensilsCrossed } from 'lucide-react'
import BackButton from '../../components/BackButton'

export default function ScanPage() {
  const router = useRouter()

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: 'white', display: 'flex', flexDirection: 'column' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 32px' }}>
        <BackButton fallback="/diner-choice" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#F5A623', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12, color: '#111' }}>M</div>
          <span style={{ fontWeight: 600, fontSize: 14 }}>MenuVerse AI</span>
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ maxWidth: 420, width: '100%', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: '1px solid rgba(245,166,35,0.4)', borderRadius: 999, padding: '6px 14px', fontSize: 11, fontWeight: 600, letterSpacing: '1px', color: '#F5A623', marginBottom: 24 }}>
            <ScanLine size={14} /> DINER ACCESS
          </div>

          <h1 style={{ fontSize: 38, fontWeight: 800, lineHeight: 1.15, margin: '0 0 12px' }}>
            Scan your<br /><span style={{ color: '#F5A623' }}>table QR</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, lineHeight: 1.6, margin: '0 0 32px' }}>
            Hold your camera up to the QR code on your table to view the menu
          </p>

          <div style={{ maxWidth: 320, margin: '0 auto 32px', aspectRatio: '1/1', borderRadius: 28, border: '2px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 12, left: 12, width: 28, height: 28, borderTop: '3px solid #F5A623', borderLeft: '3px solid #F5A623', borderRadius: '8px 0 0 0' }} />
            <div style={{ position: 'absolute', top: 12, right: 12, width: 28, height: 28, borderTop: '3px solid #F5A623', borderRight: '3px solid #F5A623', borderRadius: '0 8px 0 0' }} />
            <div style={{ position: 'absolute', bottom: 12, left: 12, width: 28, height: 28, borderBottom: '3px solid #F5A623', borderLeft: '3px solid #F5A623', borderRadius: '0 0 0 8px' }} />
            <div style={{ position: 'absolute', bottom: 12, right: 12, width: 28, height: 28, borderBottom: '3px solid #F5A623', borderRight: '3px solid #F5A623', borderRadius: '0 0 8px 0' }} />
            
            <div style={{ textAlign: 'center', opacity: 0.5 }}>
              <ScanLine size={48} style={{ margin: '0 auto 8px' }} />
              <p style={{ fontSize: 12 }}>Tap to start scanning</p>
            </div>
          </div>

          <a href="/discovery" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#F5A623', color: '#111', border: 'none', borderRadius: 999, padding: '16px', fontSize: 15, fontWeight: 700, cursor: 'pointer', textDecoration: 'none', marginBottom: 16 }}>
            <ScanLine size={20} />
            Scan QR Code
          </a>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '24px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
          </div>

          <a href="/discovery" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 999, padding: '16px', fontSize: 15, fontWeight: 600, cursor: 'pointer', textDecoration: 'none' }}>
            <UtensilsCrossed size={18} />
            Browse menus near you
          </a>
        </div>
      </main>
    </div>
  )
}