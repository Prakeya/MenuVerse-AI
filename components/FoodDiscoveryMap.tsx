 'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { MenuItem } from '../types/api'

export default function FoodDiscoveryMap({ items, onSelect, selectedId }: { items: MenuItem[]; onSelect?: (item: MenuItem) => void; selectedId?: string | null }) {
  const categories = Array.from(new Set(items.map((i) => i.category || 'Classic')))

  return (
    <div className="discovery-map grid gap-6">
      {categories.map((cat, ci) => (
        <motion.section key={cat} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ci * 0.06 }} className="rounded-[20px] bg-white p-4 shadow-soft">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-primary">{cat}</h3>
            <div className="text-sm text-muted">{items.filter((i) => (i.category || 'Classic') === cat).length} dishes</div>
          </div>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {items.filter((i) => (i.category || 'Classic') === cat).map((it, idx) => {
              const isSelected = selectedId === it.item_id
              return (
              <motion.button
                key={it.item_id}
                onClick={() => onSelect?.(it)}
                onKeyDown={(e)=>{ if(e.key==='Enter' || e.key===' ') { e.preventDefault(); onSelect?.(it) } }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                aria-pressed={isSelected}
                tabIndex={0}
                className={`group rounded-xl overflow-hidden border p-2 text-left transition ${isSelected ? 'border-accent ring-2 ring-accent/20 scale-102' : 'border-border'}`}
              >
                <div className="h-24 w-full overflow-hidden rounded-md bg-slate-100 shimmer">
                  <img loading="lazy" src={it.image_url || '/placeholder.png'} alt={it.name} className="h-24 w-full object-cover group-hover:scale-105 transition" />
                </div>
                <div className="mt-2">
                  <div className="text-sm font-semibold text-primary">{it.name}</div>
                  <div className="text-xs text-muted">${it.price.toFixed(2)}</div>
                </div>
              </motion.button>
              )
            })}
          </div>
        </motion.section>
      ))}
    </div>
  )
}
