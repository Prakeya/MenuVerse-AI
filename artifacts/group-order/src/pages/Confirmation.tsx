import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useSearch } from 'wouter'
import { CheckCircle2, UtensilsCrossed, ChefHat, Bell, ThumbsUp, MapPin } from 'lucide-react'
import { SSE_BASE } from '../lib/api'

const STEPS = [
  { key: 'pending', label: 'Order received', icon: CheckCircle2, desc: 'The kitchen has received your order' },
  { key: 'preparing', label: 'Preparing', icon: ChefHat, desc: 'Our chef is cooking your food' },
  { key: 'ready', label: 'Ready!', icon: Bell, desc: 'Your order is ready — our team will bring it to you' },
  { key: 'delivered', label: 'Delivered', icon: ThumbsUp, desc: 'Enjoy your meal! 🎉' },
]

function stepIndex(status: string) {
  const idx = STEPS.findIndex((s) => s.key === status)
  return idx >= 0 ? idx : 0
}

export default function Confirmation() {
  const search = useSearch()
  const params = new URLSearchParams(search)
  const orderId = params.get('order')
  const tableNumber = params.get('table')

  const [status, setStatus] = useState('pending')

  useEffect(() => { window.scrollTo(0, 0) }, [])

  useEffect(() => {
    if (!orderId) return
    const es = new EventSource(`${SSE_BASE}/sse/order/${orderId}`)
    es.addEventListener('status_changed', (e) => {
      const data = JSON.parse((e as MessageEvent).data)
      if (data.status) setStatus(data.status)
    })
    es.onerror = () => es.close()
    return () => es.close()
  }, [orderId])

  const currentStep = stepIndex(status)
  const CurrentIcon = STEPS[currentStep].icon

  return (
    <div className="min-h-screen bg-[#FFFEFB] flex flex-col items-center justify-center px-4 text-center py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 20 }}
        className="flex flex-col items-center gap-6 w-full max-w-sm"
      >
        {/* Status icon */}
        <motion.div
          key={status}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 14 }}
          className={`w-20 h-20 rounded-full flex items-center justify-center ${
            status === 'delivered' ? 'bg-emerald-50' : 'bg-amber-50'
          }`}
        >
          <CurrentIcon size={38} className={status === 'delivered' ? 'text-emerald-500' : 'text-amber-500'} />
        </motion.div>

        <div>
          <h1 className="text-3xl font-bold text-[#1A1A1A]">
            {status === 'delivered' ? 'Enjoy your meal!' : status === 'ready' ? "It's ready!" : 'Order placed!'}
          </h1>
          <p className="mt-2 text-[#6B7280] text-sm">{STEPS[currentStep].desc}</p>
        </div>

        {/* Table badge */}
        {tableNumber && (
          <div className="flex items-center gap-2 rounded-full bg-[#F5A623]/10 border border-[#F5A623]/30 px-4 py-2">
            <MapPin size={14} className="text-[#F5A623]" />
            <span className="text-sm font-bold text-[#92400E]">Table {tableNumber}</span>
          </div>
        )}

        {/* Progress steps */}
        <div className="w-full rounded-2xl border border-[#E5E7EB] bg-white p-5 text-left space-y-0">
          {STEPS.map((step, i) => {
            const Icon = step.icon
            const done = i < currentStep
            const active = i === currentStep
            const future = i > currentStep
            return (
              <div key={step.key} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                    done ? 'bg-emerald-500 border-emerald-500' :
                    active ? 'bg-[#F5A623] border-[#F5A623]' :
                    'bg-white border-[#E5E7EB]'
                  }`}>
                    <Icon size={14} className={done || active ? 'text-white' : 'text-[#D1D5DB]'} />
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`w-0.5 h-8 my-0.5 transition-all ${done ? 'bg-emerald-400' : 'bg-[#E5E7EB]'}`} />
                  )}
                </div>
                <div className={`pt-1 pb-3 ${future ? 'opacity-40' : ''}`}>
                  <p className={`text-sm font-semibold ${active ? 'text-[#F5A623]' : done ? 'text-emerald-600' : 'text-[#1A1A1A]'}`}>
                    {step.label}
                    {active && (
                      <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-[#F5A623] animate-pulse" />
                    )}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Est time */}
        {status !== 'delivered' && (
          <div className="w-full flex items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-4">
            <div className="w-8 h-8 rounded-full bg-[#FEF3C7] flex items-center justify-center">
              <UtensilsCrossed size={15} className="text-[#92400E]" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-[#1A1A1A]">Est. preparation time</p>
              <p className="text-xs text-[#6B7280]">15–25 minutes</p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 w-full">
          <Link
            href={`/menu/restaurant_001${tableNumber ? `?table=${tableNumber}` : ''}`}
            className="w-full py-3.5 rounded-full bg-[#111] text-white text-sm font-bold text-center no-underline hover:bg-[#333] transition"
          >
            Order more
          </Link>
          <Link
            href="/"
            className="w-full py-3.5 rounded-full border border-[#E5E7EB] bg-white text-[#1A1A1A] text-sm font-semibold text-center no-underline hover:bg-[#F9FAFB] transition"
          >
            Back to home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
