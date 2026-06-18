'use client'

import React from 'react'
import OrdersManager from '../../../components/OrdersManager'

export default function OrdersPage() {
  return (
    <section className="space-y-8 py-6">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-muted">Order management</p>
        <h2 className="text-3xl font-semibold text-primary">Recent customer orders</h2>
        <p className="max-w-2xl text-sm leading-6 text-muted">Track new orders, review order status, and keep service running smoothly.</p>
      </div>
      <OrdersManager />
    </section>
  )
}
