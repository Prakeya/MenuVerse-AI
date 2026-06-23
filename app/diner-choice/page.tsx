'use client'

import { useRouter } from 'next/navigation'
import { useI18n } from '../../lib/contexts'
import { ArrowLeft, ScanLine, MapPin } from 'lucide-react'

export default function DinerChoicePage() {
  const router = useRouter()
  const { t } = useI18n()

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: 'white', display: 'flex', flexDirection: 'column' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 32px' }}>
        <button onClick={() => router.push('/')} style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <ArrowLeft size={18} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#F5A623', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12, color: '#111' }}>M</div>
          <span style={{ fontWeight: 600, fontSize: 14 }}>MenuVerse AI</span>
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ maxWidth: 700, width: '100%', textAlign: 'center' }}>
          <h1 style={{ fontSize: 38, fontWeight: 800, lineHeight: 1.15, margin: '0 0 12px' }}>
            {t('How would you like to')}<br /><span style={{ color: '#F5A623' }}>{t('start?')}</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, lineHeight: 1.6, margin: '0 0 48px' }}>
            {t('Choose an option below to begin your dining experience')}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <button onClick={() => router.push('/scan')} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 24, padding: '40px 32px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', color: 'white' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#F5A623', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <ScanLine size={28} color="#111" />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px', color: 'white' }}>{t('Scan Table QR')}</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, margin: 0 }}>
                {t('Already at a restaurant? Scan the code on your table to order.')}
              </p>
            </button>

            <button onClick={() => router.push('/discovery')} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 24, padding: '40px 32px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', color: 'white' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#F5A623', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <MapPin size={28} color="#111" />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px', color: 'white' }}>{t('Browse Restaurants Near Me')}</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, margin: 0 }}>
                {t('Not at a table yet? Explore restaurants near your location.')}
              </p>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}