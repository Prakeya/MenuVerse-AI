import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import api from '../../lib/api'
import { useAuth } from '../../lib/auth'
import Skeleton from '../../components/Skeleton'

export default function AnalyticsPage() {
  const { restaurantId } = useAuth()

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics', restaurantId],
    queryFn: () => api.getAnalytics(restaurantId),
    refetchInterval: 30_000,
  })
  const { data: orders = [] } = useQuery({
    queryKey: ['orders', restaurantId],
    queryFn: () => api.getOrders(restaurantId),
  })

  const totalRevenue = orders.reduce((s, o) => s + (Number(o.amount) || 0), 0)
  const avgOrder = orders.length > 0 ? totalRevenue / orders.length : 0
  const chartData = (analytics?.popularDishes ?? []).slice(0, 8).map((d) => ({ name: d.name.split(' ').slice(0, 2).join(' '), views: d.views }))

  const summaryStats = [
    { label: 'Menu Views', value: analytics?.totalViews ?? 0 },
    { label: 'Total Orders', value: orders.length },
    { label: 'Revenue', value: `₹${totalRevenue.toFixed(0)}` },
    { label: 'Avg. Order Value', value: `₹${avgOrder.toFixed(0)}` },
  ]

  return (
    <section className="space-y-6 py-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-[#84848C]">Analytics</p>
        <h2 className="mt-1 text-3xl font-semibold text-[#14141A]">Menu Performance</h2>
        <p className="mt-1 text-sm text-[#84848C]">Live view counts, order data, and revenue from your restaurant.</p>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryStats.map((s) =>
          isLoading ? (
            <Skeleton key={s.label} className="h-28" />
          ) : (
            <div key={s.label} className="rounded-[20px] border border-[#ECECEC] bg-white p-6 shadow-[0_4px_12px_rgba(20,20,26,0.04)]">
              <p className="text-xs uppercase tracking-[0.2em] text-[#84848C]">{s.label}</p>
              <p className="mt-3 text-3xl font-semibold text-[#14141A]">{s.value}</p>
            </div>
          )
        )}
      </div>

      {/* Bar chart */}
      <div className="rounded-[20px] border border-[#ECECEC] bg-white p-6 shadow-[0_4px_12px_rgba(20,20,26,0.04)]">
        <h3 className="text-sm font-semibold text-[#14141A] mb-6">Most Viewed Dishes</h3>
        {isLoading ? (
          <Skeleton className="h-52" />
        ) : chartData.length === 0 ? (
          <div className="py-12 text-center text-[#84848C]">
            <p className="font-medium">No view data yet</p>
            <p className="text-xs mt-1">Dish views will appear here as customers browse your menu</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: '1px solid #ECECEC', fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                cursor={{ fill: 'rgba(229,72,77,0.06)' }}
              />
              <Bar dataKey="views" radius={[6, 6, 0, 0]}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? '#E5484D' : i < 3 ? '#F5A623' : '#E5E7EB'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Popular dishes table */}
      <div className="rounded-[20px] border border-[#ECECEC] bg-white shadow-[0_4px_12px_rgba(20,20,26,0.04)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#F3F4F6]">
          <h3 className="text-sm font-semibold text-[#14141A]">Dish Rankings</h3>
        </div>
        {isLoading ? (
          <div className="p-6 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10" />)}</div>
        ) : (analytics?.popularDishes ?? []).length === 0 ? (
          <div className="py-12 text-center text-[#84848C] text-sm">No dish view data yet</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-[#FAFAFA] text-left">
                {['#', 'Dish', 'Category', 'Views'].map((h) => (
                  <th key={h} className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#84848C]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(analytics?.popularDishes ?? []).slice(0, 10).map((d, i) => (
                <tr key={d.item_id} className="border-t border-[#F3F4F6] hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-5 py-3 text-sm font-bold text-[#E5484D]">#{i + 1}</td>
                  <td className="px-5 py-3 text-sm font-semibold text-[#14141A]">{d.name}</td>
                  <td className="px-5 py-3 text-xs text-[#84848C]">{(d as any).category ?? '—'}</td>
                  <td className="px-5 py-3 text-sm text-[#14141A]">{d.views}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  )
}
