import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag, ArrowRight, MapPin, MessageSquare } from 'lucide-react'
import type { MenuItem } from '../types/api'

export type CartEntry = { item: MenuItem; quantity: number }

type Props = {
  cart: CartEntry[]
  tableNumber?: string
  onUpdateQty: (itemId: string, qty: number) => void
  onRemove: (itemId: string) => void
  onClose: () => void
  onPlaceOrder: (notes: string) => void
  placing: boolean
}

export default function CartDrawer({ cart, tableNumber, onUpdateQty, onRemove, onClose, onPlaceOrder, placing }: Props) {
  const [notes, setNotes] = useState('')
  const subtotal = cart.reduce((sum, e) => sum + Number(e.item.price) * e.quantity, 0)
  const itemCount = cart.reduce((sum, e) => sum + e.quantity, 0)
  const tax = subtotal * 0.05

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[98] bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 260 }}
        className="fixed top-0 right-0 bottom-0 z-[99] w-[420px] max-w-[92vw] bg-white shadow-[-8px_0_48px_rgba(0,0,0,0.12)] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#F3F4F6]">
          <div>
            <h3 className="text-lg font-bold text-[#1A1A1A]">Your Order</h3>
            <p className="text-sm text-[#6B7280] mt-0.5">{itemCount} item{itemCount !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex items-center gap-3">
            {tableNumber && (
              <div className="flex items-center gap-1.5 rounded-full bg-[#F5A623]/10 border border-[#F5A623]/30 px-3 py-1.5">
                <MapPin size={12} className="text-[#F5A623]" />
                <span className="text-xs font-bold text-[#92400E]">Table {tableNumber}</span>
              </div>
            )}
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB] transition">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center pb-8">
              <div className="w-16 h-16 rounded-full bg-[#F3F4F6] flex items-center justify-center mb-4">
                <ShoppingBag size={24} className="text-[#9CA3AF]" />
              </div>
              <p className="text-base font-semibold text-[#1A1A1A]">Your order is empty</p>
              <p className="text-sm text-[#6B7280] mt-1">Add dishes from the menu to get started</p>
            </div>
          ) : (
            <div className="space-y-1">
              {cart.map((entry) => (
                <div key={entry.item.item_id} className="flex items-center gap-3 py-3 border-b border-[#F9FAFB]">
                  <div className="relative shrink-0">
                    <img
                      src={entry.item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=80&h=80&fit=crop&q=80'}
                      alt={entry.item.name}
                      className="w-14 h-14 rounded-2xl object-cover"
                    />
                    {entry.item.is_veg != null && (
                      <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${entry.item.is_veg ? 'bg-green-500' : 'bg-red-500'}`} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1A1A1A] truncate">{entry.item.name}</p>
                    <p className="text-sm font-bold text-[#1A1A1A] mt-0.5">
                      ₹{(Number(entry.item.price) * entry.quantity).toFixed(0)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onUpdateQty(entry.item.item_id, entry.quantity - 1)}
                      className="w-7 h-7 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#1A1A1A] hover:bg-[#F3F4F6] transition"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-5 text-center text-sm font-semibold">{entry.quantity}</span>
                    <button
                      onClick={() => onUpdateQty(entry.item.item_id, entry.quantity + 1)}
                      className="w-7 h-7 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#1A1A1A] hover:bg-[#F3F4F6] transition"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <button onClick={() => onRemove(entry.item.item_id)} className="text-[#9CA3AF] hover:text-[#EF4444] transition shrink-0">
                    <X size={14} />
                  </button>
                </div>
              ))}

              {/* Special instructions */}
              <div className="pt-3">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-[#6B7280] mb-2 uppercase tracking-wide">
                  <MessageSquare size={12} /> Special instructions
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="No onions, extra spicy, allergies…"
                  rows={2}
                  className="w-full resize-none rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#F5A623] transition"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-6 py-5 border-t border-[#F3F4F6] space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-[#6B7280]">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-sm text-[#6B7280]">
                <span>Service charge (5%)</span>
                <span>₹{tax.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#1A1A1A] pt-2 border-t border-[#F3F4F6]">
                <span>Total</span>
                <span>₹{(subtotal + tax).toFixed(0)}</span>
              </div>
            </div>
            <button
              onClick={() => onPlaceOrder(notes)}
              disabled={placing}
              className="w-full py-4 rounded-full bg-[#111] text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#333] disabled:opacity-60 transition"
            >
              {placing ? 'Placing order…' : <>Place Order <ArrowRight size={16} /></>}
            </button>
          </div>
        )}
      </motion.div>
    </>
  )
}
