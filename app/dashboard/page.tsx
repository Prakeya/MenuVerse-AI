'use client'

import { useRouter } from 'next/navigation'
import { Flame, TrendingUp, AlertTriangle, Lightbulb, Star, BarChart3 } from 'lucide-react'

export default function DashboardOverview() {
  const router = useRouter()

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Overview</h1>
          <p style={{ fontSize: 14, color: '#6b7280', margin: '4px 0 0' }}>Here's how your restaurant is doing today.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Revenue', icon: TrendingUp, value: '$155.91', trend: '+20.1% from last month' },
          { label: 'Orders Today', icon: BarChart3, value: '1', trend: '+19% from yesterday' },
          { label: 'Active Dishes', icon: Flame, value: '9 / 10', trend: 'Available on menu' },
          { label: 'Menu Views', icon: Star, value: '469', trend: 'Peak hour: 12:00 PM' },
        ].map(s => (
          <div key={s.label} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 20, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>{s.label}</span>
              <s.icon size={18} style={{ color: '#6b7280' }} />
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#1a1a1a' }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>{s.trend}</div>
          </div>
        ))}
      </div>

      <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 20, padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ color: '#F5A623', fontSize: 16 }}>✦</span>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>AI Revenue Copilot</div>
          <span style={{ fontSize: 10, color: '#6b7280', background: '#f3f4f6', padding: '2px 8px', borderRadius: 999 }}>Rule-based</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { icon: Flame, title: 'Butter Chicken is Trending', desc: 'Most viewed dish today. Consider promoting it.' },
            { icon: TrendingUp, title: '$38.98 Average Order Value', desc: 'Upsell with combo deals (+15% potential).' },
            { icon: AlertTriangle, title: '1 Item Unavailable', desc: 'Chicken Tikka Masala needs restocking.' },
            { icon: Lightbulb, title: 'Bundle Opportunity', desc: 'Pair Pizza + Drink for $19.99.' },
            { icon: Star, title: 'Add QR to Every Table', desc: '+22% reorder rate with table QR codes.' },
            { icon: BarChart3, title: 'Peak Hour Optimisation', desc: 'Staff at 12 PM for rush hour.' },
          ].map(c => (
            <div key={c.title} style={{ background: '#f9fafb', borderRadius: 12, padding: 14 }}>
              <div style={{ marginBottom: 4 }}><c.icon size={20} style={{ color: '#1a1a1a' }} /></div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', marginBottom: 2 }}>{c.title}</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>{c.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}