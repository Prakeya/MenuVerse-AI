import React from 'react'
import { motion } from 'framer-motion'
import { Crown, TrendingUp, X } from 'lucide-react'
import type { LoyaltyProfile } from '../types/api'

type Props = {
  profile: LoyaltyProfile
  onDismiss: () => void
}

function tier(visits: number): { label: string; color: string; bg: string } {
  if (visits >= 20) return { label: 'Platinum', color: '#1e40af', bg: '#EFF6FF' }
  if (visits >= 10) return { label: 'Gold',     color: '#92400E', bg: '#FEF3C7' }
  if (visits >= 5)  return { label: 'Silver',   color: '#374151', bg: '#F3F4F6' }
  return                   { label: 'Member',   color: '#065F46', bg: '#D1FAE5' }
}

export default function LoyaltyBanner({ profile, onDismiss }: Props) {
  const t = tier(profile.visit_count)
  const name = profile.name || 'there'

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      style={{
        maxWidth: 1200, margin: '0 auto 20px', padding: '0 24px',
      }}
    >
      <div style={{
        borderRadius: 18, border: `1.5px solid ${t.color}33`,
        background: t.bg, padding: '14px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: t.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Crown size={18} color={t.color} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#1a1a1a' }}>
              Welcome back, {name}! 👋
            </p>
            <p style={{ margin: '2px 0 0', fontSize: 12, color: '#6b7280' }}>
              <span style={{ fontWeight: 700, color: t.color }}>{t.label}</span>
              {' '}· Visit #{profile.visit_count}
              {' '}· ₹{Number(profile.total_spent).toFixed(0)} spent with us
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {profile.visit_count >= 3 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#111', borderRadius: 999, padding: '6px 14px' }}>
              <TrendingUp size={13} color="#F5A623" />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#F5A623' }}>Use code LOYAL20 for 20% off</span>
            </div>
          )}
          <button
            onClick={onDismiss}
            style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', background: t.color + '22', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          >
            <X size={13} color={t.color} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
