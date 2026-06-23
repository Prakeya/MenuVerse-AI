'use client'

import { useState } from 'react'
import { useI18n } from '../../../lib/contexts'
import { LANGUAGES } from '../../../lib/mockData'

export default function SettingsPage() {
  const { t } = useI18n()
  const [form, setForm] = useState({ name: 'The Golden Fork', phone: '+1 555-0100', address: '123 Main Street, New York, NY', cuisine: 'Indian', currency: 'USD ($)' })
  const [saved, setSaved] = useState(false)

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1a1a1a', margin: 0 }}>{t('Settings')}</h1>
        <p style={{ fontSize: 14, color: '#6b7280', margin: '4px 0 0' }}>{t('Manage your restaurant profile and preferences.')}</p>
      </div>
      <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 20, padding: 24, maxWidth: 600 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', margin: '0 0 16px' }}>{t('Restaurant Profile')}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { label: 'Restaurant Name', key: 'name' as const },
            { label: 'Phone Number', key: 'phone' as const },
          ].map(f => (
            <div key={f.key}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', display: 'block', marginBottom: 6 }}>{t(f.label)}</label>
              <input value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 13, outline: 'none' }} />
            </div>
          ))}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', display: 'block', marginBottom: 6 }}>{t('Address')}</label>
            <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 13, outline: 'none' }} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', display: 'block', marginBottom: 6 }}>{t('Cuisine Type')}</label>
            <input value={form.cuisine} onChange={e => setForm({ ...form, cuisine: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 13, outline: 'none' }} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', display: 'block', marginBottom: 6 }}>{t('Currency')}</label>
            <select value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 13, outline: 'none', background: 'white' }}>
              <option>USD ($)</option><option>EUR (€)</option><option>GBP (£)</option><option>INR (₹)</option>
            </select>
          </div>
        </div>
        <div style={{ marginTop: 24 }}>
          <h4 style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a', margin: '0 0 12px' }}>{t('Language & Translation')}</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {LANGUAGES.map(l => (
              <label key={l.code} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked={l.code === 'en'} style={{ accentColor: '#F5A623' }} /> {l.name}
              </label>
            ))}
          </div>
        </div>
        <button onClick={save} style={{ marginTop: 24, padding: '12px 32px', borderRadius: 999, border: 'none', background: '#111', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
          {saved ? 'Saved ✓' : t('Save Changes')}
        </button>
      </div>
    </div>
  )
}