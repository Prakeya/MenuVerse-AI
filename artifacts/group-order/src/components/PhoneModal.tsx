import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, X, Gift } from 'lucide-react'

type Props = {
  onSubmit: (phone: string, name: string) => void
  onSkip: () => void
}

export default function PhoneModal({ onSubmit, onSkip }: Props) {
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  function handleSubmit() {
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length < 10) { setError('Please enter a valid phone number'); return }
    onSubmit(cleaned, name.trim())
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }}
        onClick={onSkip}
      />
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.93 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: 'spring', damping: 22 }}
        style={{
          position: 'fixed', zIndex: 201,
          top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '100%', maxWidth: 400,
          background: 'white', borderRadius: 28, padding: 32,
          boxShadow: '0 24px 64px rgba(0,0,0,0.22)',
        }}
      >
        <button
          onClick={onSkip}
          style={{ position: 'absolute', top: 16, right: 16, width: 30, height: 30, borderRadius: '50%', border: 'none', background: '#f3f4f6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}
        >
          <X size={15} />
        </button>

        {/* Icon */}
        <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #F5A623, #e08010)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <Gift size={26} color="white" />
        </div>

        <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 800, color: '#1a1a1a' }}>Unlock loyalty rewards</h2>
        <p style={{ margin: '0 0 24px', fontSize: 14, color: '#6b7280', lineHeight: 1.5 }}>
          Enter your phone to earn points, get discounts, and see your order history.
        </p>

        {/* Perks */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {['🎁 10% off 3rd visit', '📋 Order history', '⭐ Dish ratings'].map((p) => (
            <span key={p} style={{ background: '#FEF3C7', color: '#92400E', borderRadius: 999, padding: '4px 12px', fontSize: 11, fontWeight: 600 }}>{p}</span>
          ))}
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Phone number *</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, border: `2px solid ${error ? '#ef4444' : '#e5e7eb'}`, borderRadius: 14, padding: '0 16px', background: '#fafafa', transition: 'border-color 0.2s' }}>
            <Phone size={16} color="#9ca3af" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setError('') }}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="+91 98765 43210"
              autoFocus
              style={{ flex: 1, border: 'none', background: 'transparent', padding: '14px 0', fontSize: 15, outline: 'none', color: '#1a1a1a' }}
            />
          </div>
          {error && <p style={{ fontSize: 12, color: '#ef4444', margin: '4px 0 0' }}>{error}</p>}
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Your name (optional)</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="So we can welcome you!"
            style={{ width: '100%', border: '2px solid #e5e7eb', borderRadius: 14, padding: '13px 16px', fontSize: 14, outline: 'none', background: '#fafafa', color: '#1a1a1a', boxSizing: 'border-box' }}
          />
        </div>

        <button
          onClick={handleSubmit}
          style={{ width: '100%', padding: '15px', borderRadius: 14, border: 'none', background: '#111', color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}
        >
          Unlock Rewards →
        </button>

        <button
          onClick={onSkip}
          style={{ width: '100%', padding: '12px', marginTop: 10, border: 'none', background: 'none', color: '#9ca3af', fontSize: 13, cursor: 'pointer' }}
        >
          Skip for now
        </button>
      </motion.div>
    </>
  )
}
