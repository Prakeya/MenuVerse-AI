import React, { useState, useMemo } from 'react'
import { useLocation } from 'wouter'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ShoppingCart, MessageCircle, Flame, Star, Heart, ChefHat, Ban, Leaf, MapPin } from 'lucide-react'
import api from '../lib/api'
import CartDrawer, { CartEntry } from './CartDrawer'
import AIWaiter from './AIWaiter'
import DishDetailModal from './DishDetailModal'
import type { MenuItem } from '../types/api'

const BADGE_STYLES: Record<string, { bg: string; color: string; label: string; icon: React.ElementType }> = {
  trending:     { bg: '#FEF3C7', color: '#92400E', label: 'Trending',       icon: Flame },
  bestseller:   { bg: '#FFFBEB', color: '#B45309', label: 'Bestseller',     icon: Star },
  favourite:    { bg: '#FDF2F8', color: '#9D174D', label: 'Favourite',      icon: Heart },
  'chef-special': { bg: '#111', color: 'white',   label: "Chef's Special", icon: ChefHat },
}

const SPICE_DOTS: Record<string, number> = { mild: 1, medium: 2, hot: 3 }

type DietFilter = 'all' | 'veg' | 'nonveg'

export default function RestaurantMenuClient({
  restaurantId,
  tableNumber,
}: {
  restaurantId: string
  tableNumber?: string
}) {
  const [, navigate] = useLocation()
  const qc = useQueryClient()
  const [category, setCategory] = useState<string | null>(null)
  const [dietFilter, setDietFilter] = useState<DietFilter>('all')
  const [cart, setCart] = useState<CartEntry[]>([])
  const [showCart, setShowCart] = useState(false)
  const [showAI, setShowAI] = useState(false)
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null)
  const [placing, setPlacing] = useState(false)

  const { data: menu = [], isLoading } = useQuery({
    queryKey: ['menu', restaurantId],
    queryFn: () => api.getMenu(restaurantId),
  })

  const categories = useMemo(() => [...new Set(menu.map((d) => d.category))], [menu])

  const filtered = useMemo(() => {
    let items = category ? menu.filter((d) => d.category === category) : menu
    if (dietFilter === 'veg') items = items.filter((d) => d.is_veg)
    if (dietFilter === 'nonveg') items = items.filter((d) => !d.is_veg)
    return items
  }, [menu, category, dietFilter])

  const hero = menu.find((d) => d.available) ?? menu[0]
  const cartCount = cart.reduce((s, e) => s + e.quantity, 0)

  function addToCart(dish: MenuItem, qty = 1) {
    setCart((prev) => {
      const existing = prev.find((e) => e.item.item_id === dish.item_id)
      if (existing) return prev.map((e) => e.item.item_id === dish.item_id ? { ...e, quantity: e.quantity + qty } : e)
      return [...prev, { item: dish, quantity: qty }]
    })
    api.trackView(restaurantId, dish.item_id).catch(() => {})
  }

  function updateQty(itemId: string, qty: number) {
    if (qty <= 0) setCart((prev) => prev.filter((e) => e.item.item_id !== itemId))
    else setCart((prev) => prev.map((e) => e.item.item_id === itemId ? { ...e, quantity: qty } : e))
  }

  async function placeOrder(notes: string) {
    setPlacing(true)
    try {
      const total = cart.reduce((s, e) => s + Number(e.item.price) * e.quantity, 0) * 1.05
      const order = await api.createOrder(restaurantId, {
        items: cart.map((e) => ({ item_id: e.item.item_id, name: e.item.name, quantity: e.quantity, price: Number(e.item.price) })) as any,
        amount: total,
        status: 'pending',
        table_number: tableNumber ?? null,
        notes: notes || null,
      })
      qc.invalidateQueries({ queryKey: ['orders', restaurantId] })
      setCart([])
      setShowCart(false)
      navigate(`/confirmation?order=${order.order_id}${tableNumber ? `&table=${tableNumber}` : ''}`)
    } catch {
      alert('Order failed — please try again.')
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FFFEFB' }}>
      {/* Sticky header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 30, background: 'rgba(255,254,251,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#F5A623', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, color: '#111' }}>M</div>
            <span style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a' }}>MenuVerse AI</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {tableNumber && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: 999, padding: '6px 14px' }}>
                <MapPin size={13} color="#92400E" />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#92400E' }}>Table {tableNumber}</span>
              </div>
            )}
            <button
              onClick={() => setShowCart(true)}
              style={{ padding: '9px 18px', borderRadius: 999, border: 'none', background: '#111', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'white', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <ShoppingCart size={15} />
              Cart
              {cartCount > 0 && (
                <span style={{ background: '#F5A623', color: '#111', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filter pills row */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '6px 24px 12px', display: 'flex', gap: 8, overflowX: 'auto', alignItems: 'center' }}>
          {/* Category pills */}
          <button onClick={() => setCategory(null)} style={pillStyle(!category)}>All</button>
          {categories.map((c) => (
            <button key={c} onClick={() => setCategory(c)} style={pillStyle(category === c)}>{c}</button>
          ))}
          {/* Divider */}
          <div style={{ width: 1, height: 22, background: '#e5e7eb', margin: '0 4px', flexShrink: 0 }} />
          {/* Dietary filters */}
          <button onClick={() => setDietFilter(dietFilter === 'veg' ? 'all' : 'veg')}
            style={{ ...pillStyle(dietFilter === 'veg'), display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
            Veg Only
          </button>
          <button onClick={() => setDietFilter(dietFilter === 'nonveg' ? 'all' : 'nonveg')}
            style={{ ...pillStyle(dietFilter === 'nonveg'), display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
            Non-Veg
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
        {isLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ borderRadius: 20, background: '#f3f4f6', height: 280, animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : (
          <>
            {/* Hero banner */}
            {hero && !category && dietFilter === 'all' && (
              <div
                style={{ position: 'relative', borderRadius: 24, overflow: 'hidden', marginBottom: 32, height: 400, background: '#111', cursor: 'pointer' }}
                onClick={() => setSelectedDish(hero)}
              >
                <img
                  src={hero.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&h=600&fit=crop&q=80'}
                  alt={hero.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.72), rgba(0,0,0,0.1))' }} />
                <div style={{ position: 'absolute', top: 20, left: 24, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ background: '#F5A623', color: '#111', borderRadius: 999, padding: '4px 14px', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em' }}>TODAY'S FEATURE</span>
                  {hero.is_veg != null && (
                    <span style={{ background: hero.is_veg ? '#22c55e' : '#ef4444', color: 'white', borderRadius: 999, padding: '4px 10px', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                      {hero.is_veg ? <Leaf size={10} /> : '🍖'} {hero.is_veg ? 'VEG' : 'NON-VEG'}
                    </span>
                  )}
                </div>
                <div style={{ position: 'absolute', top: 20, right: 24, background: 'white', borderRadius: 999, padding: '6px 18px', fontSize: 18, fontWeight: 800, color: '#111', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                  ₹{Number(hero.price).toFixed(0)}
                </div>
                <div style={{ position: 'absolute', bottom: 32, left: 32, maxWidth: 480 }}>
                  <h2 style={{ fontSize: 34, fontWeight: 800, color: 'white', margin: '0 0 8px', lineHeight: 1.1 }}>{hero.name}</h2>
                  <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, lineHeight: 1.6, margin: '0 0 20px' }}>{hero.description}</p>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); addToCart(hero) }}
                      style={{ background: '#F5A623', color: '#111', border: 'none', borderRadius: 999, padding: '12px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
                    >
                      + Add to Order
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setSelectedDish(hero) }}
                      style={{ background: 'transparent', color: 'rgba(255,255,255,0.85)', border: 'none', fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}>
                      View details
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#1a1a1a' }}>
                {category || 'All Dishes'}
                {dietFilter !== 'all' && <span style={{ fontSize: 13, fontWeight: 500, color: '#9ca3af', marginLeft: 8 }}>· {dietFilter === 'veg' ? 'Veg Only' : 'Non-Veg'}</span>}
              </h3>
              <span style={{ fontSize: 13, color: '#9ca3af' }}>{filtered.length} items</span>
            </div>

            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#9ca3af' }}>
                <p style={{ fontSize: 16, fontWeight: 600 }}>No dishes match this filter</p>
                <p style={{ fontSize: 13, marginTop: 4 }}>Try a different category or dietary preference</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
                {filtered.map((dish) => (
                  <DishCard
                    key={dish.item_id}
                    dish={dish}
                    onAdd={() => addToCart(dish)}
                    onOpen={() => setSelectedDish(dish)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Floating AI Waiter */}
      <button
        onClick={() => setShowAI(!showAI)}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 50,
          width: 52, height: 52, borderRadius: '50%', background: '#111', border: 'none',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
        }}
        title="Ask AI Waiter"
      >
        <MessageCircle size={22} color="white" />
      </button>

      <AnimatePresence>
        {showCart && (
          <CartDrawer
            cart={cart}
            tableNumber={tableNumber}
            onUpdateQty={updateQty}
            onRemove={(id) => setCart((prev) => prev.filter((e) => e.item.item_id !== id))}
            onClose={() => setShowCart(false)}
            onPlaceOrder={placeOrder}
            placing={placing}
          />
        )}
        {showAI && <AIWaiter restaurantId={restaurantId} onClose={() => setShowAI(false)} />}
        {selectedDish && (
          <DishDetailModal
            dish={selectedDish}
            onClose={() => setSelectedDish(null)}
            onAddToCart={(dish, qty) => addToCart(dish, qty)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function pillStyle(active: boolean): React.CSSProperties {
  return {
    padding: '7px 18px', borderRadius: 999, border: 'none', cursor: 'pointer',
    whiteSpace: 'nowrap', fontSize: 13, fontWeight: 600, flexShrink: 0,
    background: active ? '#111' : '#f3f4f6', color: active ? 'white' : '#1a1a1a',
    transition: 'all 0.15s',
  }
}

function DishCard({ dish, onAdd, onOpen }: { dish: MenuItem; onAdd: () => void; onOpen: () => void }) {
  const [added, setAdded] = useState(false)
  const badge = dish.badges?.[0] ? BADGE_STYLES[dish.badges[0]] : null
  const BadgeIcon = badge?.icon
  const spiceDots = dish.spice_level ? SPICE_DOTS[dish.spice_level] ?? 0 : 0

  function handleAdd(e: React.MouseEvent) {
    e.stopPropagation()
    if (!dish.available) return
    onAdd()
    setAdded(true)
    setTimeout(() => setAdded(false), 500)
  }

  return (
    <motion.div
      whileHover={{ y: -6 }}
      onClick={onOpen}
      style={{ borderRadius: 20, border: '1px solid #e5e7eb', background: 'white', overflow: 'hidden', cursor: 'pointer', opacity: dish.available ? 1 : 0.65, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
    >
      <div style={{ position: 'relative', height: 180, background: '#f3f4f6' }}>
        <img
          src={dish.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=280&fit=crop&q=80'}
          alt={dish.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {/* Veg/NonVeg dot */}
        {dish.is_veg != null && (
          <div style={{ position: 'absolute', top: 10, right: 10, width: 18, height: 18, borderRadius: 4, border: `2px solid ${dish.is_veg ? '#22c55e' : '#ef4444'}`, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: dish.is_veg ? '#22c55e' : '#ef4444' }} />
          </div>
        )}
        {badge && BadgeIcon && (
          <div style={{ position: 'absolute', top: 10, left: 10 }}>
            <span style={{ background: badge.bg, color: badge.color, borderRadius: 999, padding: '3px 10px', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', display: 'inline-flex', alignItems: 'center', gap: 3, textTransform: 'uppercase' }}>
              <BadgeIcon size={10} /> {badge.label}
            </span>
          </div>
        )}
        {!dish.available && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ background: 'rgba(0,0,0,0.7)', color: 'white', borderRadius: 999, padding: '4px 14px', fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Ban size={11} /> SOLD OUT
            </span>
          </div>
        )}
      </div>

      <div style={{ padding: '14px 16px' }}>
        <h4 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>{dish.name}</h4>
        <p style={{ margin: '0 0 10px', fontSize: 12, color: '#6b7280', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {dish.description || 'Freshly prepared by our chef.'}
        </p>
        {/* Spice level */}
        {spiceDots > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 8 }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i} style={{ fontSize: 10 }}>{i < spiceDots ? '🌶️' : '⚪'}</span>
            ))}
            <span style={{ fontSize: 10, color: '#9ca3af', marginLeft: 2 }}>{dish.spice_level}</span>
          </div>
        )}
        {dish.allergens && (
          <p style={{ margin: '0 0 8px', fontSize: 10, color: '#f59e0b', fontWeight: 600 }}>⚠️ {dish.allergens}</p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#1a1a1a' }}>₹{Number(dish.price).toFixed(0)}</span>
          <motion.button
            animate={added ? { scale: 1.3 } : { scale: 1 }}
            onClick={handleAdd}
            style={{
              width: 36, height: 36, borderRadius: '50%', border: 'none',
              background: dish.available ? (added ? '#F5A623' : '#111') : '#d1d5db',
              color: 'white', cursor: dish.available ? 'pointer' : 'not-allowed',
              fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700,
            }}
          >
            +
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
