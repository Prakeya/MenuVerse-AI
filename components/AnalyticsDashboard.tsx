'use client'

import React from 'react'
import useAnalytics from '../hooks/useAnalytics'
import Card from './ui/Card'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts'
import { motion } from 'framer-motion'
import Skeleton from './Skeleton'
import { useAuth } from '../hooks/useAuth'

export default function AnalyticsDashboard() {
  const { restaurantId } = useAuth()
  const { analytics, isLoading, isError } = useAnalytics(restaurantId || undefined)

  if (isLoading) return <div className="py-6"><Skeleton className="h-48 w-full" /></div>
  if (isError) return <div>Error loading analytics</div>
  if (!analytics) return <div className="py-8 text-center text-slate-400">No customer activity yet.</div>

  const data = analytics.popularDishes.map((d) => ({ name: d.name, views: d.views }))

  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <motion.div whileHover={{ y: -4 }}>
          <Card>
            <div className="text-sm text-slate-300">Total Views</div>
            <div className="text-2xl font-bold mt-2">{analytics.totalViews}</div>
          </Card>
        </motion.div>
        <motion.div whileHover={{ y: -4 }}>
          <Card>
            <div className="text-sm text-slate-300">Peak Hour</div>
            <div className="text-2xl font-bold mt-2">{analytics.peakHour}</div>
          </Card>
        </motion.div>
        <motion.div whileHover={{ y: -4 }}>
          <Card>
            <div className="text-sm text-slate-300">Popular Dish</div>
            <div className="text-2xl font-bold mt-2">{analytics.popularDishes[0]?.name ?? '—'}</div>
          </Card>
        </motion.div>
      </div>

      <Card>
        <h3 className="font-semibold mb-4">Popular Dishes</h3>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ left: 0, right: 20 }}>
              <XAxis dataKey="name" tick={{ fill: '#9aa4b2' }} />
              <YAxis tick={{ fill: '#9aa4b2' }} />
              <Tooltip />
              <Bar dataKey="views" fill="#FF6B35">
                {data.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </section>
  )
}
