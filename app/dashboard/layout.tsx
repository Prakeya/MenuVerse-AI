'use client'

import { useRouter } from 'next/navigation'
import { useI18n } from '../../lib/contexts'
import { LayoutDashboard, MenuSquare, ClipboardList, BarChart3, Upload, QrCode, Settings } from 'lucide-react'
import BackButton from '../../components/BackButton'

const NAV = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/menu', label: 'Menu Studio', icon: MenuSquare },
  { href: '/dashboard/orders', label: 'Orders', icon: ClipboardList },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/import', label: 'AI Import', icon: Upload },
  { href: '/dashboard/qr', label: 'QR Codes', icon: QrCode },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { t } = useI18n()

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb' }}>
      {/* Sidebar */}
      <aside style={{ width: 260, background: 'white', borderRight: '1px solid #e5e7eb', padding: '20px 12px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '0 12px 20px', borderBottom: '1px solid #f3f4f6', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#F5A623', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12, color: '#111' }}>M</div>
            <span style={{ fontWeight: 600, fontSize: 14, color: '#1a1a1a' }}>MenuVerse AI</span>
          </div>
          <BackButton fallback="/" label={t('Exit Dashboard')} />
        </div>
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV.map(n => (
            <a key={n.href} href={n.href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, textDecoration: 'none', fontSize: 13, fontWeight: 500, color: '#6b7280', transition: 'all 0.15s' }}>
              <n.icon size={18} />
              {n.label}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: 24, overflow: 'auto' }}>
        {children}
      </main>
    </div>
  )
}