import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Minus, Plus, Flame, Star, Heart, ChefHat } from 'lucide-react'
import type { MenuItem } from '../types/api'

const BADGE_MAP: Record<string, { label: string; icon: React.ElementType; cls: string }> = {
  trending: { label: 'Trending', icon: Flame, cls: 'bg-[#FEF3C7] text-[#92400E]' },
  bestseller: { label: 'Bestseller', icon: Star, cls: 'bg-[#FFFBEB] text-[#B45309]' },
  favourite: { label: 'Favourite', icon: Heart, cls: 'bg-[#FDF2F8] text-[#9D174D]' },
  'chef-special': { label: "Chef's Special", icon: ChefHat, cls: 'bg-[#111] text-white' },
}

type Props = {
  dish: MenuItem
  onClose: () => void
  onAddToCart: (dish: MenuItem, qty: number) => void
}

export default function DishDetailModal({ dish, onClose, onAddToCart }: Props) {
  const [qty, setQty] = useState(1)

  const badge = (dish.badges && dish.badges[0]) ? BADGE_MAP[dish.badges[0]] : null
  const BadgeIcon = badge?.icon

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.25 }}
        className="fixed z-[81] inset-4 md:inset-10 lg:left-[15%] lg:right-[15%] lg:top-[8%] lg:bottom-[8%] bg-white rounded-[28px] overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.25)] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition"
        >
          <X size={18} />
        </button>

        {/* Image */}
        <div className="w-full md:w-1/2 h-56 md:h-full relative shrink-0">
          <img
            src={dish.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=600&fit=crop&q=80'}
            alt={dish.name}
            className="w-full h-full object-cover"
          />
          {!dish.available && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-black/70 text-white rounded-full px-4 py-2 text-sm font-bold tracking-wide">SOLD OUT</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 flex flex-col p-6 md:p-8 overflow-y-auto">
          {badge && BadgeIcon && (
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider w-fit mb-3 ${badge.cls}`}>
              <BadgeIcon size={12} /> {badge.label}
            </span>
          )}

          <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A]">{dish.name}</h2>
          <p className="mt-2 text-sm text-[#6B7280] leading-relaxed">
            {dish.description || 'A chef-crafted dish prepared fresh to order.'}
          </p>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-bold text-[#1A1A1A]">₹{Number(dish.price).toFixed(0)}</span>
            <span className="text-sm text-[#9CA3AF]">per serving</span>
          </div>

          <div className="mt-1 flex items-center gap-2">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${dish.available ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
              {dish.available ? 'Available' : 'Sold Out'}
            </span>
            <span className="text-xs text-[#9CA3AF] bg-[#F3F4F6] px-2.5 py-1 rounded-full">{dish.category}</span>
          </div>

          <div className="flex-1" />

          {/* Quantity + Add */}
          {dish.available && (
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center gap-3 bg-[#F3F4F6] rounded-full px-1 py-1">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm hover:bg-[#E5E7EB] transition"
                >
                  <Minus size={14} />
                </button>
                <span className="w-6 text-center text-sm font-bold">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm hover:bg-[#E5E7EB] transition"
                >
                  <Plus size={14} />
                </button>
              </div>
              <button
                onClick={() => { onAddToCart(dish, qty); onClose() }}
                className="flex-1 py-3.5 rounded-full bg-[#111] text-white text-sm font-bold hover:bg-[#333] transition"
              >
                Add ₹{(Number(dish.price) * qty).toFixed(0)} to order
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </>
  )
}
