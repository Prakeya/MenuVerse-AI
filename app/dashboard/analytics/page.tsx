'use client'

import React from 'react'
import AnalyticsDashboard from '../../../components/AnalyticsDashboard'

export default function AnalyticsPage() {
  return (
    <section className="space-y-8 py-6">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-muted">Analytics</p>
        <h2 className="text-3xl font-semibold text-primary">Data that helps your menu perform</h2>
        <p className="max-w-2xl text-sm leading-6 text-muted">See restaurant performance, popular dishes, and daily traffic in one refined analytics view.</p>
      </div>
      <AnalyticsDashboard />
    </section>
  )
}
