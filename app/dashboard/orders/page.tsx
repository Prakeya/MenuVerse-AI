'use client'

import { useState } from 'react'

const MOCK_ORDERS = [
  { id: 'ORD-001', table: 'Table 4', items: ['Butter Chicken', 'Naan'], amount: 23.98, status: 'pending', time: '2 min ago' },
  { id: 'ORD-002', table: 'Table 7', items: ['Margherita Pizza'], amount: 14.99, status: 'preparing', time: '8 min ago' },
  { id: 'ORD-003', table: 'Takeout', items: ['Sushi Platter', 'Mango Lassi'], amount: 29.98, status: 'ready', time: '15 min ago' },
  { id: 'ORD-004', table: 'Table 2', items: ['Truffle Burger', 'Caesar Salad'], amount: 29.98, status: 'completed', time: '32 min ago' },
]

export default function OrdersPage() {
  const [orders] = useState(MOCK_ORDERS)

  const statusColor = (s: string) => {
    switch(s) {
      case 'pending': return { bg: '#fef3c7', color: '#92400e' }
      case 'preparing': return { bg: '#dbeafe', color: '#1e40af' }
      case 'ready': return { bg: '#d1fae5', color: '#065f46' }
      case 'completed': return { bg: '#f3f4f6', color: '#374151' }
      default: return { bg: '#f3f4f6', color: '#374151' }
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Orders</h1>
        <p style={{ fontSize: 14, color: '#6b7280', margin: '4px 0 0' }}>View and manage incoming orders in real-time.</p>
      </div>
      <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 20, overflow: 'hidden' }}>
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
            {orders.map(o => {
              const sc = statusColor(o.status)
              return (
                <tr key={o.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, color: '#1a1a1a', fontFamily: 'monospace' }}>{o.id}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: '#1a1a1a' }}>{o.table}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: '#6b7280' }}>{o.items.join(', ')}</td>
                  <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>${o.amount.toFixed(2)}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ background: sc.bg, color: sc.color, borderRadius: 999, padding: '4px 12px', fontSize: 11, fontWeight: 600, textTransform: 'capitalize' }}>{o.status}</span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 12, color: '#6b7280' }}>{o.time}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}