import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, X, Send } from 'lucide-react'
import api from '../lib/api'
import type { OrderItem } from '../types/api'

type Props = {
  restaurantId: string
  items: OrderItem[]
  phone?: string
  onClose: () => void
}

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}
        >
          <Star
            size={26}
            fill={n <= (hovered || value) ? '#F5A623' : 'none'}
            color={n <= (hovered || value) ? '#F5A623' : '#D1D5DB'}
          />
        </button>
      ))}
    </div>
  )
}

export default function RatingModal({ restaurantId, items, phone, onClose }: Props) {
  const [ratings, setRatings] = useState<Record<string, number>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const validItems = items.filter((i) => i.item_id && i.name)

  async function handleSubmit() {
    const toSubmit = validItems
      .filter((i) => ratings[i.item_id] > 0)
      .map((i) => ({ item_id: i.item_id, rating: ratings[i.item_id], phone }))

    if (toSubmit.length === 0) { onClose(); return }
    setSubmitting(true)
    try {
      await api.submitRatings(restaurantId, toSubmit)
      setSubmitted(true)
      setTimeout(onClose, 2000)
    } catch {
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.93 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20 }}
        style={{
          position: 'fixed', zIndex: 201,
          top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '100%', maxWidth: 420,
          background: 'white', borderRadius: 28, padding: 28,
          boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
          maxHeight: '85vh', overflowY: 'auto',
        }}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 16, right: 16, width: 30, height: 30, borderRadius: '50%', border: 'none', background: '#f3f4f6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <X size={15} color="#6b7280" />
        </button>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: 'center', padding: '20px 0' }}
            >
              <div style={{ fontSize: 52, marginBottom: 12 }}>🌟</div>
              <h2 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 800, color: '#1a1a1a' }}>Thank you!</h2>
              <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>Your ratings help us improve every dish.</p>
            </motion.div>
          ) : (
            <motion.div key="form">
              <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 800, color: '#1a1a1a' }}>How was your meal?</h2>
              <p style={{ margin: '0 0 24px', fontSize: 13, color: '#6b7280' }}>Rate each dish you ordered</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
                {validItems.map((item) => (
                  <div key={item.item_id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.name}
                      </p>
                      <p style={{ margin: '1px 0 0', fontSize: 11, color: '#9ca3af' }}>×{item.quantity}</p>
                    </div>
                    <StarRating
                      value={ratings[item.item_id] ?? 0}
                      onChange={(v) => setRatings((r) => ({ ...r, [item.item_id]: v }))}
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  width: '100%', padding: '14px', borderRadius: 14, border: 'none',
                  background: '#111', color: 'white', fontSize: 14, fontWeight: 700,
                  cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.6 : 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                <Send size={15} /> {submitting ? 'Submitting…' : 'Submit Ratings'}
              </button>

              <button onClick={onClose} style={{ width: '100%', padding: 10, marginTop: 8, border: 'none', background: 'none', color: '#9ca3af', fontSize: 13, cursor: 'pointer' }}>
                Skip
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}
