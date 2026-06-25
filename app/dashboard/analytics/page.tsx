'use client'

import { useState, useEffect } from 'react'
import { useI18n } from '../../../lib/contexts'

export default function AnalyticsPage() {
  const { t } = useI18n()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    menuViews: 0,
    totalOrders: 0,
    revenue: 0,
    peakHour: 'N/A'
  })
  const [popularItems, setPopularItems] = useState<any[]>([])

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics/rest_1/popular')
      if (res.ok) {
        const data = await res.json()
        setPopularItems(data.slice(0, 5))
        setStats({
          menuViews: data.reduce((sum: number, item: any) => sum + (item.views || 0), 0),
          totalOrders: 0,
          revenue: 0,
          peakHour: '12:00 PM'
        })
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1a1a1a', margin: 0 }}>{t('Analytics')}</h1>
        <p style={{ fontSize: 14, color: '#6b7280', margin: '4px 0 0' }}>{t('Live menu performance and diner behaviour.')}</p>
      </div>
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}>Loading analytics...</div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
            <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 20, padding: 20 }}>
              <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>{t('Menu Views')}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#1a1a1a' }}>{stats.menuViews}</div>
            </div>
            <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 20, padding: 20 }}>
              <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>{t('Total Orders')}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#1a1a1a' }}>{stats.totalOrders}</div>
            </div>
            <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 20, padding: 20 }}>
              <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>{t('Revenue')}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#1a1a1a' }}>${stats.revenue}</div>
            </div>
            <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 20, padding: 20 }}>
              <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>{t('Peak Hour')}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#1a1a1a' }}>{stats.peakHour}</div>
            </div>
          </div>
          <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 20, padding: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a', marginBottom: 16 }}>{t('Most Popular Dishes — Views')}</div>
            {popularItems.length > 0 ? (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, height: 200, paddingTop: 24 }}>
                {popularItems.map((d, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '100%', height: d.views > 0 ? (d.views / Math.max(...popularItems.map((p: any) => p.views || 1))) * 160 : 8, background: '#F5A623', borderRadius: '8px 8px 0 0', minHeight: 8 }} />
                    <div style={{ fontSize: 11, color: '#6b7280', marginTop: 8, textAlign: 'center' }}>Item {d.item_id.slice(-3)}</div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#1a1a1a' }}>{d.views || 0}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>No analytics data available yet</div>
            )}
          </div>
        </>
      )}
    </div>
  )
}