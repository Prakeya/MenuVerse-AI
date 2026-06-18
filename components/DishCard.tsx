 'use client'

import React, { useState } from 'react'
import Badge from './ui/Badge'
import { motion } from 'framer-motion'
import Button from './ui/Button'

type DishCardProps = {
  dish: any
  onOrder?: () => void
  onOpen?: () => void
  selected?: boolean
  muted?: boolean
  badges?: Array<{ label: string; tone: 'gold' | 'red' | 'green' | 'muted' | 'brand' }>
}

const toneMap: Record<string, string> = {
  gold: 'badge-gold',
  red: 'badge-spicy',
  green: 'badge-veg',
  muted: 'bg-slate-100 text-slate-700',
  brand: 'badge-gold'
}

export default function DishCard({ dish, onOrder, onOpen, selected, muted, badges = [] }: DishCardProps) {
  const [justAdded, setJustAdded] = useState(false)
  const isVeg = /veg|vegetarian/i.test(dish.category || dish.name || '')
  const cardClass = `group transition-all duration-250 overflow-hidden rounded-[32px] border border-border bg-white ${selected ? 'dish-selected' : 'shadow-soft'} ${muted ? 'dish-muted' : ''}`

  return (
    <motion.div whileHover={{ y: -8, scale: 1.02 }} animate={selected ? { scale: 1.02, y: -8 } : { scale: 1, y: 0 }} className={cardClass}>
        <div className="relative overflow-hidden rounded-[32px]">
        <img
          loading="lazy"
          src={dish.image_url || '/placeholder.png'}
          alt={dish.name}
          className="h-72 w-full object-cover transition duration-500 group-hover:scale-105 shimmer"
        />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className={`rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] shadow-sm ${isVeg ? 'badge-veg' : 'bg-white/95 text-primary'}`}>
            {isVeg ? 'Veg' : 'Non-Veg'}
          </span>
          {!dish.available && (
            <span className="rounded-full bg-slate-100 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">
              Sold out
            </span>
          )}
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4 flex flex-wrap gap-2">
          {badges.map((badge) => (
            <Badge key={badge.label} className={`${toneMap[badge.tone] || 'bg-slate-100 text-slate-700'}`}>
              {badge.label}
            </Badge>
          ))}
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-primary">{dish.name}</h3>
            <p className="mt-3 text-sm leading-6 text-secondary">{dish.description}</p>
          </div>
          <button className="rounded-full border border-border bg-white p-3 text-secondary transition hover:border-accent hover:text-accent">
            ♥
          </button>
        </div>

          <div className="mt-6 flex items-center justify-between gap-4 relative">
          <div>
            <div className="text-sm uppercase tracking-[0.18em] text-secondary">Price</div>
            <div className="mt-2 text-2xl font-semibold text-primary">${dish.price.toFixed(2)}</div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row items-center">
            <Button variant="ghost" onClick={onOpen}>Details</Button>
            <Button
              onClick={(e) => {
                if (!dish.available) return
                try {
                  if (onOrder) onOrder()
                } finally {
                  setJustAdded(true)
                  setTimeout(() => setJustAdded(false), 900)
                }
              }}
              disabled={!dish.available}
            >
              Add
            </Button>
            {justAdded && (
              <div className="absolute -right-6 -top-6 z-50 animate-add-fly">
                <div className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-black shadow-sm">+1</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
