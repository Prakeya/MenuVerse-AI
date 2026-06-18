'use client'

import React from 'react'
import useOrders from '../hooks/useOrders'
import Card from './ui/Card'
import Badge from './ui/Badge'
import Button from './ui/Button'
import { motion, AnimatePresence } from 'framer-motion'
import Skeleton from './Skeleton'
import { useAuth } from '../hooks/useAuth'

export default function OrdersManager() {
  const { restaurantId } = useAuth()
  const { orders, isLoading, isError } = useOrders(restaurantId || undefined)

  const totalOrders = orders.length
  const activeOrders = orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled').length
  const revenue = orders.reduce((s, o) => s + (o.amount || 0), 0)

  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <motion.div whileHover={{ y: -4 }}>
          <Card>
            <div className="text-sm text-slate-300">Total Orders</div>
            <div className="text-2xl font-bold mt-2">{totalOrders}</div>
          </Card>
        </motion.div>
        <motion.div whileHover={{ y: -4 }}>
          <Card>
            <div className="text-sm text-slate-300">Active Orders</div>
            <div className="text-2xl font-bold mt-2">{activeOrders}</div>
          </Card>
        </motion.div>
        <motion.div whileHover={{ y: -4 }}>
          <Card>
            <div className="text-sm text-slate-300">Revenue Today</div>
            <div className="text-2xl font-bold mt-2">${revenue.toFixed(2)}</div>
          </Card>
        </motion.div>
      </div>

      <Card>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        ) : isError ? (
          <div>Error loading orders</div>
        ) : orders.length === 0 ? (
          <div className="py-8 text-center text-slate-400">No active orders.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm text-slate-300 border-b border-white/6">
                  <th className="py-3">Order ID</th>
                  <th className="py-3">Items</th>
                  <th className="py-3">Amount</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Time</th>
                  <th className="py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                {orders.map((o) => (
                  <motion.tr key={o.order_id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="border-b border-white/6 hover:bg-white/2 transition-colors">
                    <td className="py-3 font-mono text-sm">{o.order_id}</td>
                    <td className="py-3">{o.items?.length ?? 0}</td>
                    <td className="py-3">${(o.amount || 0).toFixed(2)}</td>
                    <td className="py-3">
                      <Badge>{o.status}</Badge>
                    </td>
                    <td className="py-3 text-sm text-slate-400">{o.created_at ? new Date(o.created_at).toLocaleString() : '-'}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" onClick={() => alert('View order')}>View</Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </section>
  )
}
