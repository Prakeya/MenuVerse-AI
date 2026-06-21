'use client'

import { useState } from 'react'

export default function ImportPage() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  const loadExample = () => {
    setText(`STARTERS
Spring Rolls - $8.99
Chicken Wings - $12.99

MAINS
Butter Chicken - $18.99
Margherita Pizza - $14.99
Truffle Burger - $16.99

DESSERTS
Chocolate Lava Cake - $9.99

DRINKS
Mango Lassi - $4.99`)
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fef3c7', borderRadius: 999, padding: '4px 12px', fontSize: 11, fontWeight: 600, color: '#92400e', marginBottom: 8 }}>
          ✦ AI FEATURE
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Magic Menu Import</h1>
        <p style={{ fontSize: 14, color: '#6b7280', margin: '4px 0 0' }}>Paste or upload your existing menu — our AI extracts every dish instantly.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>Paste your menu text</label>
            <button onClick={loadExample} style={{ background: 'none', border: 'none', color: '#F5A623', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Load example</button>
          </div>
          <textarea value={text} onChange={e => setText(e.target.value)} placeholder="STARTERS&#10;Dish Name - $Price&#10;&#10;MAINS&#10;Dish Name - $Price" style={{ width: '100%', height: 300, padding: 16, borderRadius: 16, border: '1px solid #e5e7eb', fontSize: 13, outline: 'none', resize: 'none', fontFamily: 'monospace', lineHeight: 1.8 }} />

          <div style={{ marginTop: 16, border: '2px dashed #e5e7eb', borderRadius: 16, padding: 32, textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s', background: '#f9fafb' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>📄</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>Drop a .txt or .csv file</div>
            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>or click to browse</div>
          </div>

          <button onClick={() => { if (text.trim()) setLoading(true) }} style={{ marginTop: 16, width: '100%', padding: '14px', borderRadius: 999, border: 'none', background: text.trim() ? '#111' : '#e5e7eb', color: text.trim() ? 'white' : '#9ca3af', fontSize: 15, fontWeight: 700, cursor: text.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            ✦ Import Menu with AI
          </button>
        </div>

        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 20, padding: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a', marginBottom: 16 }}>Import Log</div>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['Reading menu...', 'Identifying dishes...', 'Generating descriptions...', 'Creating entries...'].map((step, i) => (
                <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#f9fafb', borderRadius: 10 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid #F5A623', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#F5A623' }}>{i + 1}</div>
                  <span style={{ fontSize: 13, color: '#1a1a1a' }}>{step}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: 32, textAlign: 'center', color: '#6b7280', fontSize: 13 }}>Import something to see the log</div>
          )}
        </div>
      </div>
    </div>
  )
}