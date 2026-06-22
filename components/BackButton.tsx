'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

interface BackButtonProps {
  fallback?: string
  label?: string
}

export default function BackButton({ fallback = '/', label = 'Back' }: BackButtonProps) {
  const router = useRouter()

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push(fallback)
    }
  }

  return (
    <button
      onClick={handleBack}
      aria-label={label}
      style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        border: '1px solid rgba(255,255,255,0.15)',
        background: 'transparent',
        color: 'white',
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