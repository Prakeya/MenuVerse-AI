'use client'

import { useState } from 'react'
import { MenuItem } from '../lib/types'
import { useCart, useI18n } from '../lib/contexts'
import { X, Minus, Plus, AlertTriangle, ChevronRight, Check, Flame, Star, Heart, ChefHat, Ban, Wine } from 'lucide-react'
import { MOCK_DISHES } from '../lib/mockData'
import ImageWithFallback from './ImageWithFallback'

const SIZES = ['380g', '480g', '560g']
const ADD_ONS = ['Extra Cheese', 'Avocado', 'Bacon', 'Jalapeños']

const BADGE_STYLES: Record<string, { bg: string; color: string; icon: any }> = {
  trending: { bg: '#fef3c7', color: '#92400e', icon: Flame },
  bestseller: { bg: '#fffbeb', color: '#92400e', icon: Star },
  favourite: { bg: '#fdf2f8', color: '#9d174d', icon: Heart },
  'chef-special': { bg: '#111', color: 'white', icon: ChefHat },
  spicy: { bg: '#fff1f2', color: '#9f1239', icon: Flame },
  'light-healthy': { bg: '#f0fdf4', color: '#166534', icon: Flame },
}

export default function DishDetail({ dish, onClose }: { dish: MenuItem; onClose: () => void }) {
  const { addToCart } = useCart()
  const { t, translateMenuItem } = useI18n()
  const dishTranslation = translateMenuItem(dish.item_id, dish.name, dish.description)
  const [qty, setQty] = useState(1)
  const [selectedSize, setSelectedSize] = useState(SIZES[1])
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])

  const toggleAddOn = (name: string) => {
    setSelectedAddOns(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name])
  }

  const handleAdd = () => {
    addToCart(dish, qty)
    onClose()
  }

  const pairings = (dish.pairsWith || []).map(id => MOCK_DISHES.find(d => d.item_id === id)).filter(Boolean) as MenuItem[]

  const badgeKey = dish.badges?.[0]
  const badgeStyle = badgeKey ? BADGE_STYLES[badgeKey] : null
  const BadgeIcon = badgeStyle?.icon

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 80, background: 'rgba(0,0,0,0.5)' }} />
      <div style={{ position: 'fixed', top: '5%', left: '10%', right: '10%', bottom: '5%', zIndex: 81, background: 'white', borderRadius: 28, overflow: 'hidden', display: 'flex', flexDirection: 'column', maxWidth: 1100, margin: '0 auto' }} className="animate-slide-up">
        {/* Header with close */}
        <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 5 }}>
          <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.5)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Left: Image */}
          <div style={{ flex: 1, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ImageWithFallback src={dish.image_url} alt={dish.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          {/* Right: Details */}
          <div style={{ flex: 1, padding: 32, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {badgeKey && badgeStyle && BadgeIcon && (
              <div style={{ marginBottom: 12 }}>
                  <span style={{ background: badgeStyle.bg, color: badgeStyle.color, borderRadius: 999, padding: '4px 12px', fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', display: 'inline-flex', alignItems: 'center', gap: 6, textTransform: 'uppercase' }}>
                  <BadgeIcon size={14} /> {t(badgeKey.replace('-', ' ').toUpperCase())}
                </span>
              </div>
            )}
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#1a1a1a', margin: '0 0 8px' }}>{dishTranslation.name}</h2>
            <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6, margin: '0 0 20px' }}>{dishTranslation.description}</p>

            {/* Size selector */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', marginBottom: 8 }}>{t('Size')}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {SIZES.map(s => (
                  <button key={s} onClick={() => setSelectedSize(s)} style={{
                    padding: '8px 18px', borderRadius: 999, border: '1px solid', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                    background: selectedSize === s ? '#111' : 'white', color: selectedSize === s ? 'white' : '#1a1a1a', borderColor: selectedSize === s ? '#111' : '#e5e7eb'
                  }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Build Your Meal */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', marginBottom: 8 }}>{t('Build Your Meal')}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {ADD_ONS.map(addon => (
                  <button key={addon} onClick={() => toggleAddOn(addon)} style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 999, border: '1px solid', cursor: 'pointer', fontSize: 12, fontWeight: 500,
                    background: selectedAddOns.includes(addon) ? '#fef3c7' : 'white', color: '#1a1a1a', borderColor: selectedAddOns.includes(addon) ? '#F5A623' : '#e5e7eb'
                  }}>
                    {selectedAddOns.includes(addon) && <Check size={14} style={{ color: '#F5A623' }} />}
                    {t(addon)}
                  </button>
                ))}
              </div>
            </div>

            {/* Ingredients & Allergens */}
            <div style={{ marginBottom: 20, padding: 16, background: '#f9fafb', borderRadius: 16, border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', marginBottom: 8 }}>{t('Ingredients')}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                {dish.ingredients?.map(ing => (
                  <span key={ing} style={{ padding: '4px 10px', background: 'white', borderRadius: 999, border: '1px solid #e5e7eb', fontSize: 11, color: '#1a1a1a' }}>{ing}</span>
                ))}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                <AlertTriangle size={14} style={{ color: '#dc2626' }} />
                {t('Allergens')}
              </div>
              <div style={{ padding: '8px 12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, fontSize: 12, color: '#991b1b', display: 'flex', alignItems: 'center', gap: 6 }}>
                <AlertTriangle size={14} />
                {dish.allergens && dish.allergens.length > 0
                  ? `${t('Contains')}: ${dish.allergens.join(', ')}`
                  : t('No major allergens listed')}
              </div>
            </div>

            {/* Quantity + Add to Order */}
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #e5e7eb', borderRadius: 999, padding: '4px 8px' }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Minus size={16} />
                </button>
                <span style={{ fontSize: 16, fontWeight: 700, minWidth: 28, textAlign: 'center' }}>{qty}</span>
                <button onClick={() => setQty(Math.min(10, qty + 1))} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Plus size={16} />
                </button>
              </div>
              <button onClick={handleAdd} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#111', color: 'white', border: 'none', borderRadius: 999, padding: '14px 24px', cursor: 'pointer', fontSize: 15, fontWeight: 700 }}>
                <span>${(dish.price * qty).toFixed(2)}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {t('Add to Order')}
                  <ChevronRight size={18} />
                </span>
              </button>
            </div>

            {/* Pairings */}
            <div style={{ marginTop: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', marginBottom: 12 }}>{t('Recommended Pairings')}</div>
              <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }} className="scrollbar-hide">
                {pairings.map(p => (
                  <div key={p.item_id} style={{ minWidth: 160, background: '#f9fafb', borderRadius: 12, padding: 10, cursor: 'pointer' }}>
                    <ImageWithFallback src={p.image_url} alt={p.name} style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 8 }} />
                  {(() => { const tr = translateMenuItem(p.item_id, p.name, p.description); return <><div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', marginTop: 6 }}>{tr.name}</div><div style={{ fontSize: 12, color: '#6b7280' }}>${p.price.toFixed(2)}</div></> })()}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}