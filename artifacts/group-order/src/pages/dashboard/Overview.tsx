import React from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'wouter'
import { TrendingUp, AlertTriangle, Lightbulb, Star, BarChart3, QrCode, Plus } from 'lucide-react'
import api from '../../lib/api'
import { useAuth } from '../../lib/auth'

const ICON_MAP: Record<string, React.ElementType> = { AlertTriangle, TrendingUp, Plus, QrCode, Star, Lightbulb, BarChart3 }
const PRIORITY_STYLES = { high: 'border-red-200 bg-red-50', medium: 'border-amber-200 bg-amber-50', low: 'border-[#ECECEC] bg-[#FAFAFA]' }

export default function Overview() {
  const { restaurantId, user } = useAuth()
  const { data: menu = [] } = useQuery({ queryKey: ['menu', restaurantId], queryFn: () => api.getMenu(restaurantId) })
  const { data: orders = [] } = useQuery({ queryKey: ['orders', restaurantId], queryFn: () => api.getOrders(restaurantId) })
  const { data: copilot } = useQuery({ queryKey: ['copilot', restaurantId], queryFn: () => api.aiCopilot(restaurantId), refetchInterval: 60_000 })

  const activeDishes = menu.filter((m) => m.available).length
  const totalRevenue = orders.reduce((s, o) => s + (Number(o.amount) || 0), 0)

  const stats = [
    { label: 'Total Dishes', value: menu.length, trend: `${activeDishes} available` },
    { label: 'Orders Today', value: orders.length, trend: 'Real-time' },
    { label: 'Revenue', value: `₹${totalRevenue.toFixed(0)}`, trend: 'All time', accent: true },
    { label: 'Active Dishes', value: `${activeDishes} / ${menu.length}`, trend: 'On menu' },
  ]

  return (
    <section className="space-y-6 py-6">
      <div className="rounded-[24px] border border-[#ECECEC] bg-white p-8 shadow-[0_6px_18px_rgba(20,20,26,0.06)]">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#84848C]">Overview</p>
            <h2 className="mt-2 text-3xl font-semibold text-[#14141A]">
              {user ? `Welcome back, ${user.name.split(' ')[0]}` : 'Your restaurant at a glance'}
            </h2>
            <p className="mt-2 max-w-lg text-sm leading-6 text-[#84848C]">
              Here's how your restaurant is performing. AI insights update live from your menu & orders.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Live', 'AI Insights', 'Real-time Orders'].map((label) => (
              <span key={label} className="rounded-pill border border-[#ECECEC] bg-[#FBFBFB] px-4 py-2 text-xs font-semibold text-[#14141A]">{label}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <motion.div key={s.label} whileHover={{ y: -4 }} className="rounded-[20px] border border-[#ECECEC] bg-white p-6 shadow-[0_4px_12px_rgba(20,20,26,0.04)]">
            <p className="text-xs uppercase tracking-[0.2em] text-[#84848C]">{s.label}</p>
            <p className={`mt-3 text-3xl font-semibold ${s.accent ? 'text-[#E5484D]' : 'text-[#14141A]'}`}>{s.value}</p>
            <p className="mt-1 text-xs text-[#84848C]">{s.trend}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[20px] border border-[#ECECEC] bg-white p-6 shadow-[0_4px_12px_rgba(20,20,26,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#14141A]">Recent Orders</h3>
            <Link href="/dashboard/orders" className="text-xs font-semibold text-[#E5484D] no-underline hover:underline">View all →</Link>
          </div>
          {orders.length === 0 ? (
            <p className="text-sm text-[#84848C] py-6 text-center">No orders yet — share your menu link to get started!</p>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map((o) => (
                <div key={o.order_id} className="flex items-center justify-between text-sm">
                  <span className="font-mono text-xs text-[#84848C]">{o.order_id.slice(0, 8)}…</span>
                  <span className="rounded-full bg-[#FFF4E5] px-2.5 py-0.5 text-xs font-semibold text-[#B45309] capitalize">{o.status}</span>
                  <span className="font-semibold text-[#14141A]">₹{Number(o.amount || 0).toFixed(0)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-[20px] border border-[#ECECEC] bg-white p-6 shadow-[0_4px_12px_rgba(20,20,26,0.04)]">
          <h3 className="text-sm font-semibold text-[#14141A] mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { href: '/dashboard/menu', label: 'Manage Menu', desc: 'Add, edit or remove dishes' },
              { href: '/menu/restaurant_001', label: 'Preview Customer Menu', desc: 'See what your customers see' },
              { href: '/dashboard/analytics', label: 'View Analytics', desc: 'Menu performance & insights' },
              { href: '/dashboard/qr', label: 'Get QR Code', desc: 'Share your menu instantly' },
            ].map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="flex items-center justify-between rounded-[14px] border border-[#ECECEC] bg-[#FAFAFA] px-4 py-3 hover:border-[#E5484D] hover:bg-[#FDEDEE] transition no-underline"
              >
                <div>
                  <div className="text-sm font-semibold text-[#14141A]">{a.label}</div>
                  <div className="text-xs text-[#84848C] mt-0.5">{a.desc}</div>
                </div>
                <span className="text-[#E5484D] text-xs font-bold">→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* AI Revenue Copilot */}
      <div className="rounded-[20px] border border-[#ECECEC] bg-white p-6 shadow-[0_4px_12px_rgba(20,20,26,0.04)]">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-lg text-[#F5A623]">✦</span>
          <div>
            <div className="text-sm font-semibold text-[#14141A]">AI Revenue Copilot</div>
            <div className="text-xs text-[#84848C]">Smart insights from your live menu & order data</div>
          </div>
          <span className="ml-auto text-[10px] text-[#84848C] bg-[#F3F4F6] px-2 py-0.5 rounded-full">Rule-based</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(copilot?.insights?.length
            ? copilot.insights
            : [{ icon: 'TrendingUp', title: 'Loading insights…', desc: 'AI copilot analyses your data automatically.', priority: 'low' }]
          ).map((insight: any, i: number) => {
            const Icon = ICON_MAP[insight.icon] ?? Lightbulb
            const cls = PRIORITY_STYLES[insight.priority as keyof typeof PRIORITY_STYLES] ?? PRIORITY_STYLES.low
            return (
              <div key={i} className={`rounded-[14px] border p-4 ${cls}`}>
                <Icon size={18} className="mb-2 text-[#1A1A1A]" />
                <div className="text-xs font-semibold text-[#1A1A1A] mb-1">{insight.title}</div>
                <div className="text-xs text-[#6B7280] leading-5">{insight.desc}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
