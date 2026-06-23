'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useI18n } from '../../lib/contexts'

export default function LoginPage() {
  const router = useRouter()
  const { t } = useI18n()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    router.push('/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FFFEFB', display: 'flex', flexDirection: 'column' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 32px' }}>
        <button onClick={() => router.push('/')} style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: '#1a1a1a' }}>
          ←
        </button>
        <span style={{ fontWeight: 700, fontSize: 16, color: '#1a1a1a' }}>MenuVerse</span>
      </header>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ maxWidth: 400, width: '100%' }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 4px', color: '#1a1a1a' }}>{t('Sign in')}</h1>
          <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 32px' }}>{t('Enter your credentials to access the dashboard')}</p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', display: 'block', marginBottom: 6 }}>{t('Email')}</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@menuverse.ai" style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 14, outline: 'none', background: 'white' }} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', display: 'block', marginBottom: 6 }}>{t('Password')}</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 14, outline: 'none', background: 'white' }} />
            </div>
            <button type="submit" style={{ width: '100%', padding: '14px', borderRadius: 999, border: 'none', background: '#111', color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 8 }}>
              {t('Sign In')}
            </button>
          </form>
          <p style={{ fontSize: 12, color: '#6b7280', textAlign: 'center', marginTop: 24 }}>
            {t('Demo credentials')}: <strong>admin@menuverse.ai</strong> / <strong>password123</strong>
          </p>
        </div>
      </main>
    </div>
  )
}