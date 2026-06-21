'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ConfirmationPage() {
  const router = useRouter()
  const [timeLeft, setTimeLeft] = useState(900) // 15 min in seconds

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000)
    return () => clearInterval(interval)
  }, [])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', overflow: 'hidden' }}>
      {/* Confetti dots */}
      {[1,2,3,4,5,6,7,8].map(i => (
        <div key={i} style={{ position: 'absolute', width: 6, height: 6, borderRadius: '50%', background: ['#F5A623','#ef4444','white','#6b7280'][i%4], top: `${10 + i * 10}%`, left: `${5 + i * 11}%`, opacity: 0.6, animation: `confettiFall ${3 + i * 0.5}s linear infinite`, animationDelay: `${i * 0.3}s` }} />
      ))}

      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, maxWidth: 420 }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#F5A623', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <span style={{ fontSize: 32 }}>✓</span>
        </div>

        <h1 style={{ fontSize: 32, fontWeight: 800, color: 'white', margin: '0 0 8px' }}>Order Confirmed!</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, margin: '0 0 32px' }}>Sit back — your kitchen is already on it.</p>

        {/* Timer */}
        <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '2px', marginBottom: 8 }}>ESTIMATED PREP TIME</div>
          <div style={{ fontSize: 48, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>
            <span style={{ color: '#F5A623' }}>{String(minutes).padStart(2, '0')}</span><span style={{ color: 'white' }}> : {String(seconds).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Live Status */}
        <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '2px', marginBottom: 16 }}>LIVE STATUS</div>
          {[
            { label: 'Order Confirmed', sub: "We've received your order", done: true },
            { label: 'Being Prepared', sub: 'The kitchen is on it', done: timeLeft < 800 },
            { label: 'Ready to Serve', sub: 'Your food is on its way', done: timeLeft < 100 },
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, opacity: step.done ? 1 : 0.5 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: step.done ? '#10b981' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                {step.done ? '✓' : i + 1}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ color: 'white', fontSize: 14, fontWeight: 600 }}>{step.label}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{step.sub}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 20, marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '2px', marginBottom: 12 }}>YOUR ORDER</div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>1 x Butter Chicken — $18.99</div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 12, paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: 'white', fontSize: 16 }}>
            <span>Total</span><span>$23.98</span>
          </div>
        </div>

        <button onClick={() => router.push('/menu/demo')} style={{ width: '100%', padding: '16px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
          Order Something Else
        </button>
      </div>
    </div>
  )
}