import React, { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChefHat, Bell, CheckCircle2, Clock, RefreshCw, Wifi, WifiOff, MapPin } from 'lucide-react'
import api, { SSE_BASE } from '../lib/api'
import type { Order } from '../types/api'

const STATUS_FLOW: Record<string, { next: string; label: string; color: string; bg: string }> = {
  pending:    { next: 'preparing', label: 'Accept & Prepare', color: '#92400E', bg: '#FEF3C7' },
  preparing:  { next: 'ready',     label: 'Mark Ready',       color: '#1e40af', bg: '#DBEAFE' },
  ready:      { next: 'delivered', label: 'Mark Delivered',   color: '#065F46', bg: '#D1FAE5' },
  delivered:  { next: '',          label: 'Delivered',         color: '#6B7280', bg: '#F3F4F6' },
}

const STATUS_LABELS: Record<string, { label: string; icon: React.ElementType; ring: string }> = {
  pending:   { label: 'New Order',  icon: Clock,         ring: '#F5A623' },
  preparing: { label: 'Preparing',  icon: ChefHat,       ring: '#3B82F6' },
  ready:     { label: 'Ready!',     icon: Bell,          ring: '#22C55E' },
  delivered: { label: 'Delivered',  icon: CheckCircle2,  ring: '#9CA3AF' },
}

const RESTAURANT_ID = 'restaurant_001'

export default function KitchenDisplay() {
  const [orders, setOrders] = useState<Order[]>([])
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    try {
      const all = await api.getOrders(RESTAURANT_ID)
      setOrders(all.filter((o) => o.status !== 'delivered').reverse())
    } catch {}
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 30_000) // fallback poll

    const es = new EventSource(`${SSE_BASE}/sse/restaurant/${RESTAURANT_ID}`)
    es.onopen = () => setConnected(true)
    es.onerror = () => setConnected(false)

    es.addEventListener('new_order', (e) => {
      const order = JSON.parse((e as MessageEvent).data) as Order
      setOrders((prev) => [order, ...prev.filter((o) => o.order_id !== order.order_id)])
    })

    es.addEventListener('order_updated', (e) => {
      const updated = JSON.parse((e as MessageEvent).data) as Order
      setOrders((prev) =>
        updated.status === 'delivered'
          ? prev.filter((o) => o.order_id !== updated.order_id)
          : prev.map((o) => o.order_id === updated.order_id ? updated : o)
      )
    })

    return () => { clearInterval(interval); es.close() }
  }, [fetchOrders])

  async function advance(order: Order) {
    const flow = STATUS_FLOW[order.status]
    if (!flow?.next) return
    setUpdating(order.order_id)
    try {
      await api.updateOrderStatus(RESTAURANT_ID, order.order_id, flow.next)
    } catch {
      alert('Failed to update order status')
    } finally {
      setUpdating(null)
    }
  }

  const active = orders.filter((o) => o.status !== 'delivered')
  const pendingCount = orders.filter((o) => o.status === 'pending').length
  const preparingCount = orders.filter((o) => o.status === 'preparing').length
  const readyCount = orders.filter((o) => o.status === 'ready').length

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', color: 'white', fontFamily: 'system-ui, sans-serif' }}>
      {/* KDS Header */}
      <header style={{ background: '#111', borderBottom: '1px solid #222', padding: '16px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#F5A623', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ChefHat size={18} color="#111" />
          </div>
          <div>
            <p style={{ fontSize: 11, color: '#666', margin: 0, letterSpacing: '0.12em', textTransform: 'uppercase' }}>MenuVerse AI</p>
            <h1 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Kitchen Display</h1>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {/* Stats */}
          {[
            { label: 'New', count: pendingCount, color: '#F5A623' },
            { label: 'Cooking', count: preparingCount, color: '#3B82F6' },
            { label: 'Ready', count: readyCount, color: '#22C55E' },
          ].map(({ label, count, color }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 22, fontWeight: 800, color, margin: 0 }}>{count}</p>
              <p style={{ fontSize: 11, color: '#666', margin: 0 }}>{label}</p>
            </div>
          ))}

          {/* Connection status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: connected ? '#052e16' : '#2d1515', border: `1px solid ${connected ? '#166534' : '#7f1d1d'}`, borderRadius: 999, padding: '6px 12px' }}>
            {connected ? <Wifi size={13} color="#22c55e" /> : <WifiOff size={13} color="#ef4444" />}
            <span style={{ fontSize: 11, fontWeight: 600, color: connected ? '#22c55e' : '#ef4444' }}>
              {connected ? 'Live' : 'Offline'}
            </span>
          </div>

          <button
            onClick={fetchOrders}
            style={{ background: '#222', border: '1px solid #333', borderRadius: 8, padding: '8px 14px', color: '#999', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}
          >
            <RefreshCw size={13} /> Refresh
          </button>
        </div>
      </header>

      {/* Order board */}
      <div style={{ padding: 24 }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ borderRadius: 16, background: '#1a1a1a', height: 220 }} />
            ))}
          </div>
        ) : active.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: 120 }}>
            <CheckCircle2 size={48} color="#333" style={{ marginBottom: 16 }} />
            <p style={{ fontSize: 20, fontWeight: 700, color: '#555' }}>All caught up!</p>
            <p style={{ fontSize: 14, color: '#444', marginTop: 8 }}>No active orders right now. New orders will appear here live.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            <AnimatePresence>
              {active.map((order) => {
                const statusMeta = STATUS_LABELS[order.status] ?? STATUS_LABELS['pending']
                const flow = STATUS_FLOW[order.status]
                const StatusIcon = statusMeta.icon
                const isUpdating = updating === order.order_id
                const orderTime = order.created_at ? new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
                const items = order.items as Array<{ name?: string; quantity: number; price?: number }>

                return (
                  <motion.div
                    key={order.order_id}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    style={{
                      borderRadius: 16, background: '#161616',
                      border: `2px solid ${statusMeta.ring}33`,
                      overflow: 'hidden',
                      boxShadow: `0 0 20px ${statusMeta.ring}22`,
                    }}
                  >
                    {/* Card header */}
                    <div style={{ padding: '14px 18px', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: statusMeta.ring + '22', border: `2px solid ${statusMeta.ring}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <StatusIcon size={13} color={statusMeta.ring} />
                        </div>
                        <div>
                          <span style={{ fontSize: 12, fontWeight: 700, color: statusMeta.ring }}>{statusMeta.label}</span>
                          <span style={{ fontSize: 11, color: '#555', marginLeft: 8 }}>{orderTime}</span>
                        </div>
                      </div>
                      {order.table_number && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#222', borderRadius: 999, padding: '4px 10px' }}>
                          <MapPin size={11} color="#F5A623" />
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#F5A623' }}>Table {order.table_number}</span>
                        </div>
                      )}
                    </div>

                    {/* Items */}
                    <div style={{ padding: '14px 18px' }}>
                      <div style={{ marginBottom: 10 }}>
                        {items.map((item, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px solid #222' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ width: 22, height: 22, borderRadius: 6, background: '#F5A623', color: '#111', fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {item.quantity}
                              </span>
                              <span style={{ fontSize: 14, color: '#e0e0e0' }}>{item.name || 'Item'}</span>
                            </div>
                            {item.price && (
                              <span style={{ fontSize: 13, color: '#666' }}>₹{(Number(item.price) * item.quantity).toFixed(0)}</span>
                            )}
                          </div>
                        ))}
                      </div>

                      {order.notes && (
                        <div style={{ background: '#1e1a0e', border: '1px solid #3d3000', borderRadius: 8, padding: '8px 12px', marginBottom: 10 }}>
                          <p style={{ fontSize: 11, color: '#F5A623', margin: 0, fontWeight: 600 }}>📝 Note: <span style={{ color: '#e0e0e0', fontWeight: 400 }}>{order.notes}</span></p>
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#888', marginBottom: 14 }}>
                        <span>{items.reduce((s, i) => s + i.quantity, 0)} items</span>
                        {order.amount && <span style={{ color: '#F5A623', fontWeight: 700 }}>₹{Number(order.amount).toFixed(0)}</span>}
                      </div>

                      {flow?.next && (
                        <button
                          onClick={() => advance(order)}
                          disabled={isUpdating}
                          style={{
                            width: '100%', padding: '11px', borderRadius: 10, border: 'none',
                            background: statusMeta.ring, color: order.status === 'pending' ? '#111' : 'white',
                            fontWeight: 700, fontSize: 13, cursor: isUpdating ? 'not-allowed' : 'pointer',
                            opacity: isUpdating ? 0.6 : 1, transition: 'opacity 0.2s',
                          }}
                        >
                          {isUpdating ? 'Updating…' : flow.label}
                        </button>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
