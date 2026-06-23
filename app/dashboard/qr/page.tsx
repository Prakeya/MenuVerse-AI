'use client'

import { useState } from 'react'
import { useI18n } from '../../../lib/contexts'
import { Copy, Download, Printer, Share2, Check } from 'lucide-react'

const TABLE_QR = Array.from({ length: 8 }, (_, i) => ({ id: `T-${i + 1}`, url: `https://menuverse.ai/menu/demo?table=T-${i + 1}` }))

export default function QRPage() {
  const { t } = useI18n()
  const [copied, setCopied] = useState<string | null>(null)

  const copy = (url: string, id: string) => {
    navigator.clipboard.writeText(url)
    setCopied(id)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: '1px solid rgba(245,166,35,0.4)', borderRadius: 999, padding: '4px 12px', fontSize: 11, fontWeight: 600, color: '#92400e', marginBottom: 8 }}>
          {t('DINER ACCESS')}
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1a1a1a', margin: 0 }}>{t('QR Menu Code')}</h1>
        <p style={{ fontSize: 14, color: '#6b7280', margin: '4px 0 0' }}>{t('Print this code on table tents or share the link — diners scan and order instantly.')}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
        {/* QR Preview */}
        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 20, padding: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a', marginBottom: 4 }}>MenuVerse AI</div>
          <div style={{ width: 180, height: 180, background: '#f3f4f6', margin: '16px auto', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #111' }}>
            <div style={{ fontSize: 11, color: '#6b7280' }}>QR Code</div>
          </div>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#1a1a1a', letterSpacing: '2px', marginBottom: 4 }}>{t('SCAN TO ORDER')}</div>
          <div style={{ fontSize: 10, color: '#6b7280', fontFamily: 'monospace', wordBreak: 'break-all' }}>https://menuverse.ai/menu/demo</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 8, fontSize: 11, color: '#10b981' }}>
            <Check size={14} /> {t('Live QR — scan with any camera to verify')}
          </div>
        </div>

        {/* Share & Export */}
        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 20, padding: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a', marginBottom: 12 }}>{t('Share & Export')}</div>
          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: '10px 14px', fontSize: 12, fontFamily: 'monospace', color: '#1a1a1a', marginBottom: 16, wordBreak: 'break-all' }}>
            DIRECT LINK: https://menuverse.ai/menu/demo
          </div>
          {[
            { icon: Copy, label: 'Copy menu link', action: () => copy('https://menuverse.ai/menu/demo', 'link') },
            { icon: Download, label: 'Download QR as PNG' },
            { icon: Printer, label: 'Print table tent' },
            { icon: Share2, label: 'Share directly' },
          ].map(a => (
            <button key={a.label} onClick={a.action} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer', fontSize: 13, color: '#1a1a1a', marginBottom: 8, textAlign: 'left' }}>
              <a.icon size={16} style={{ color: '#6b7280' }} />
              {t(a.label)}
              {copied === a.label.toLowerCase().replace(/ /g, '-') && <Check size={14} style={{ marginLeft: 'auto', color: '#10b981' }} />}
            </button>
          ))}
        </div>
      </div>

      {/* Per-Table QR Codes */}
      <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 20, padding: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a', marginBottom: 4 }}>{t('Per-Table QR Codes')}</div>
        <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>{t('Each table gets its own URL — track which tables are most active in Analytics.')}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 12 }}>
          {TABLE_QR.map(t => (
            <div key={t.id} onClick={() => copy(t.url, t.id)} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 12, textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s' }}>
              <div style={{ width: 64, height: 64, background: 'white', margin: '0 auto 8px', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: 9, color: '#6b7280' }}>QR</div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a' }}>{t.id}</div>
              {copied === t.id && <Check size={12} style={{ color: '#10b981', marginTop: 4 }} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}