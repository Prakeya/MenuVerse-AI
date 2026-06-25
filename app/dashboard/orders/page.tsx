'use client'

import { useState, useEffect } from 'react'
import { useCart } from '../../../lib/contexts'

export default function OrdersPage() {
  const { orders } = useCart()
  const [localOrders, setLocalOrders] = useState(orders)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLocalOrders(orders)
  }, [orders])

  useEffect(() => {
    // In a real app, you'd fetch orders from the API
    // For now, we'll use the cart context
    setLoading(false)
  }, [])

  const statusColor = (s: string) => {
    switch(s) {
      case 'confirmed': return { bg: '#fef3c7', color: '#92400e' }
      case 'preparing': return { bg: '#dbeafe', color: '#1e40af' }
      case 'ready': return { bg: '#d1fae5', color: '#065f46' }
      case 'completed': return { bg: '#f3f4f6', color: '#374151' }
      default: return { bg: '#f3f4f6', color: '#374151' }
    }
  }

  const formatTime = (isoString: string) => {
    const date = new Date(isoString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    return `${Math.floor(diffHours / 24)} day${Math.floor(diffHours / 24) > 1 ? 's' : ''} ago`
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Orders</h1>
        <p style={{ fontSize: 14, color: '#6b7280', margin: '4px 0 0' }}>View and manage incoming orders in real-time.</p>
      </div>
      <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 20, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}>Loading orders...</div>
        ) : localOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a', marginBottom: 4 }}>No orders yet</div>
            <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>Orders will appear here once customers place them</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb', fontSize: 12, color: '#6b7280', textAlign: 'left' }}>
                <th style={{ padding: '14px 16px' }}>Order ID</th>
                <th style={{ padding: '14px 16px' }}>Table / Info</th>
                <th style={{ padding: '14px 16px' }}>Items</th>
                <th style={{ padding: '14px 16px' }}>Amount</th>
                <th style={{ padding: '14px 16px' }}>Status</th>
                <th style={{ padding: '14px 16px' }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {localOrders.map((o: any) => {
                const sc = statusColor(o.status)
                return (
                  <tr key={o.order_id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, color: '#1a1a1a', fontFamily: 'monospace' }}>{o.order_id}</td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#1a1a1a' }}>{o.table_id || 'Takeout'}</td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#6b7280' }}>{o.items.map((i: any) => `${i.quantity}x ${i.item.name}`).join(', ')}</td>
                    <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>${o.total.toFixed(2)}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ background: sc.bg, color: sc.color, borderRadius: 999, padding: '4px 12px', fontSize: 11, fontWeight: 600, textTransform: 'capitalize' }}>{o.status}</span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 12, color: '#6b7280' }}>{formatTime(o.created_at)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}