'use client'

import { useI18n } from '../../../lib/contexts'

export default function AnalyticsPage() {
  const { t } = useI18n()

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1a1a1a', margin: 0 }}>{t('Analytics')}</h1>
        <p style={{ fontSize: 14, color: '#6b7280', margin: '4px 0 0' }}>{t('Live menu performance and diner behaviour.')}</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Menu Views', value: '469' },
          { label: 'Total Orders', value: '4' },
          { label: 'Revenue', value: '$156' },
          { label: 'Peak Hour', value: '12:00 PM' },
        ].map(s => (
          <div key={s.label} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 20, padding: 20 }}>
            <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>{t(s.label)}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#1a1a1a' }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 20, padding: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a', marginBottom: 16 }}>{t('Most Popular Dishes — Views')}</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, height: 200, paddingTop: 24 }}>
          {[
            { name: 'Butter Chicken', views: 142 },
            { name: 'Pizza', views: 98 },
            { name: 'Sushi', views: 76 },
            { name: 'Burger', views: 65 },
            { name: 'Lava Cake', views: 44 },
          ].map(d => (
            <div key={d.name} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '100%', height: (d.views / 142) * 160, background: '#F5A623', borderRadius: '8px 8px 0 0', minHeight: 8 }} />
              <div style={{ fontSize: 11, color: '#6b7280', marginTop: 8, textAlign: 'center' }}>{t(d.name)}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#1a1a1a' }}>{d.views}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}