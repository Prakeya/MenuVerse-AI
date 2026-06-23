'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

interface BackButtonProps {
  fallback?: string
  label?: string
  variant?: 'light' | 'dark'
}

export default function BackButton({ fallback = '/', label = 'Back', variant = 'light' }: BackButtonProps) {
  const router = useRouter()

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push(fallback)
    }
  }

  const isDark = variant === 'dark'

  return (
    <button
      onClick={handleBack}
      aria-label={label}
      style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #e5e7eb',
        background: isDark ? 'transparent' : 'white',
        color: isDark ? 'white' : '#1a1a1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        flexShrink: 0,
      }}
    >
      <ArrowLeft size={18} />
    </button>
  )
}