'use client'

import React from 'react'
import Card from '../../components/ui/Card'
import { motion } from 'framer-motion'

export default function DashboardPage() {
  return (
    <section className="space-y-8 py-6">
      <Card className="p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-muted">Overview</p>
            <h2 className="mt-3 text-3xl font-semibold text-primary">Your restaurant at a glance</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
              Keep everything in one refined dashboard: active menu items, orders, AI insights, and QR performance.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[auto_auto]">
            {['Live', 'AI Suggestions', 'New Orders', 'Revenue'].map((label) => (
              <div key={label} className="rounded-pill border border-border bg-[#FBFBFB] px-4 py-2 text-sm font-semibold text-primary">
                {label}
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total Dishes', value: '42', accent: false },
          { label: 'Active Dishes', value: '31', accent: false },
          { label: 'Sold Out', value: '5', accent: false },
          { label: 'Views Today', value: '1.2k', accent: true }
        ].map((stat) => (
          <motion.div key={stat.label} whileHover={{ y: -4 }} className="rounded-[20px] border border-border bg-white p-6 shadow-soft">
            <p className="text-sm uppercase tracking-[0.24em] text-muted">{stat.label}</p>
            <p className={`mt-4 text-3xl font-semibold ${stat.accent ? 'text-accent' : 'text-primary'}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
