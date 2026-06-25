'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useCart, useI18n } from '../../../lib/contexts'
import { MenuItem } from '../../../lib/types'
import CartDrawer from '../../../components/CartDrawer'
import AIWaiter from '../../../components/AIWaiter'
import DishDetail from '../../../components/DishDetail'
import BackButton from '../../../components/BackButton'
import { ShoppingCart, MessageCircle, Flame, Star, Heart, ChefHat, AlertTriangle, Ban } from 'lucide-react'
import ImageWithFallback from '../../../components/ImageWithFallback'

const BADGE_STYLES: Record<string, { bg: string; color: string; border?: string; icon: any }> = {
  trending: { bg: '#fef3c7', color: '#92400e', icon: Flame },
  bestseller: { bg: '#fffbeb', color: '#92400e', border: '#fcd34d', icon: Star },
  favourite: { bg: '#fdf2f8', color: '#9d174d', icon: Heart },
  'chef-special': { bg: '#111', color: 'white', icon: ChefHat },
  spicy: { bg: '#fff1f2', color: '#9f1239', icon: Flame },
  'light-healthy': { bg: '#f0fdf4', color: '#166534', icon: Flame },
}

const RESTAURANT_NAMES: Record<string, string> = {
  'r1': 'The Golden Fork',
  'r2': 'Bella Italia',
  'r3': 'Sakura Sushi',
  'r4': 'Burger Republic',
}

export default function RestaurantMenuPage() {
  const router = useRouter()
  const params = useParams()
  const restaurantId = params.restaurantId as string
  const { addToCart, cartCount } = useCart()
  const { t, translateMenuItem } = useI18n()
  const [category, setCategory] = useState<string | null>(null)
  const [showCart, setShowCart] = useState(false)
  const [showAI, setShowAI] = useState(false)
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null)
  const [dishes, setDishes] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)

  const restaurantName = RESTAURANT_NAMES[restaurantId] || 'Restaurant'

  useEffect(() => {
    fetchMenu()
  }, [restaurantId])

  const fetchMenu = async () => {
    try {
      const res = await fetch(`/api/menu/${restaurantId}`)
      if (res.ok) {
        const data = await res.json()
        setDishes(data)
      }
    } catch (error) {
      console.error('Error fetching menu:', error)
    } finally {
      setLoading(false)
    }
  }

  const filtered = useMemo(() => {
    if (!category) return dishes
    return dishes.filter(d => d.category === category)
  }, [category, dishes])

  const hero = dishes[0]

  return (
    <div style={{ minHeight: '100vh', background: '#FFFEFB' }}>
      {/* Header — back + restaurant name + cart */}
      <header style={{ position: 'sticky', top: 0, zIndex: 30, background: 'rgba(255,254,251,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <BackButton fallback="/discovery" />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#F5A623', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12, color: '#111' }}>M</div>
              <span style={{ fontWeight: 600, fontSize: 14, color: '#1a1a1a' }}>{restaurantName}</span>
            </div>
          </div>
          <button onClick={() => setShowCart(true)} style={{ padding: '8px 16px', borderRadius: 999, border: 'none', background: '#111', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'white', display: 'flex', alignItems: 'center', gap: 6, position: 'relative' }}>
            <ShoppingCart size={16} /> {t('Add to Order')}
            {cartCount > 0 && (
              <span style={{ background: '#F5A623', color: '#111', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{cartCount}</span>
            )}
          </button>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '8px 24px 12px', display: 'flex', gap: 8, overflowX: 'auto' }} className="scrollbar-hide">
          <button onClick={() => setCategory(null)} style={{ padding: '8px 18px', borderRadius: 999, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: 13, fontWeight: 600, background: !category ? '#111' : '#f3f4f6', color: !category ? 'white' : '#1a1a1a' }}>{t('All Dishes')}</button>
          {['Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Salads', 'Sides'].map(c => (
            <button key={c} onClick={() => setCategory(c)} style={{ padding: '8px 18px', borderRadius: 999, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: 13, fontWeight: 600, background: category === c ? '#111' : '#f3f4f6', color: category === c ? 'white' : '#1a1a1a' }}>{t(c)}</button>
          ))}
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}>Loading menu...</div>
        ) : hero ? (
          <>
            {/* Hero Banner */}
            <div style={{ position: 'relative', borderRadius: 24, overflow: 'hidden', marginBottom: 32, height: 440, background: '#111' }}>
              <ImageWithFallback src={hero.image_url} alt={hero.name} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.2))' }} />
              
              <div style={{ position: 'absolute', top: 20, left: 24, display: 'flex', gap: 8 }}>
                <span style={{ background: '#F5A623', color: '#111', borderRadius: 999, padding: '4px 12px', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em' }}>{t("TODAY'S FEATURE")}</span>
                <span style={{ background: 'rgba(0,0,0,0.5)', color: 'white', borderRadius: 999, padding: '4px 12px', fontSize: 11, fontWeight: 600, letterSpacing: '0.05em' }}>{t(hero.category.toUpperCase())}</span>
              </div>
              
              <div style={{ position: 'absolute', top: 20, right: 24, background: 'white', borderRadius: 999, padding: '6px 16px', fontSize: 16, fontWeight: 800, color: '#111', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                ${hero.price.toFixed(2)}
              </div>

              <div style={{ position: 'absolute', bottom: 32, left: 32, maxWidth: 500 }}>
                {(() => { const tr = translateMenuItem(hero.item_id, hero.name, hero.description); return <><h2 style={{ fontSize: 36, fontWeight: 800, color: 'white', margin: '0 0 8px' }}>{tr.name}</h2><p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 1.5, margin: '0 0 16px' }}>{tr.description}</p></> })()}
                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={() => addToCart(hero)} style={{ background: '#F5A623', color: '#111', border: 'none', borderRadius: 999, padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                    + {t('Add to Order')}
                  </button>
                  <button onClick={() => setSelectedDish(hero)} style={{ background: 'transparent', color: 'rgba(255,255,255,0.8)', border: 'none', fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}>
                    {t('View details')}
                  </button>
                </div>
              </div>
            </div>

            {/* All Dishes */}
            <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>{t('All Dishes')}</h3>
              <span style={{ fontSize: 13, color: '#6b7280' }}>{filtered.length} items</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
              {filtered.map((dish) => (
                <DishCard key={dish.item_id} dish={dish} onAdd={() => addToCart(dish)} onOpen={() => setSelectedDish(dish)} />
              ))}
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}>No menu items available</div>
        )}
      </main>

      {/* Floating AI Waiter button only — cart is in header */}
      <button onClick={() => setShowAI(!showAI)} style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 50, width: 56, height: 56, borderRadius: '50%', background: '#111', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
        <MessageCircle size={24} color="white" />
      </button>

      {showAI && <AIWaiter onClose={() => setShowAI(false)} />}
      {showCart && <CartDrawer onClose={() => setShowCart(false)} />}
      {selectedDish && <DishDetail dish={selectedDish} onClose={() => setSelectedDish(null)} />}
    </div>
  )
}

function DishCard({ dish, onAdd, onOpen }: { dish: MenuItem; onAdd: () => void; onOpen: () => void }) {
  const { t, translateMenuItem } = useI18n()
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    if (!dish.available) return
    onAdd()
    setAdded(true)
    setTimeout(() => setAdded(false), 400)
  }

  const badgeKey = dish.badges?.[0]
  const badgeStyle = badgeKey ? BADGE_STYLES[badgeKey] : null
  const BadgeIcon = badgeStyle?.icon

  return (
    <div style={{ borderRadius: 20, border: '1px solid #e5e7eb', background: 'white', overflow: 'hidden', transition: 'all 0.2s', opacity: dish.available ? 1 : 0.6, pointerEvents: dish.available ? 'auto' : 'none' }}>
      <div style={{ position: 'relative', height: 180, background: '#f3f4f6', cursor: 'pointer' }} onClick={onOpen}>
        <ImageWithFallback src={dish.image_url} alt={dish.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        {badgeKey && badgeStyle && BadgeIcon && (
          <div style={{ position: 'absolute', top: 12, left: 12 }}>
            <span style={{ background: badgeStyle.bg, color: badgeStyle.color, border: badgeStyle.border ? `1px solid ${badgeStyle.border}` : 'none', borderRadius: 999, padding: '3px 10px', fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', display: 'inline-flex', alignItems: 'center', gap: 4, textTransform: 'uppercase' }}>
              <BadgeIcon size={12} /> {t(badgeKey.replace('-', ' ').toUpperCase())}
            </span>
          </div>
        )}
        {!dish.available && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ background: 'rgba(0,0,0,0.7)', color: 'white', borderRadius: 999, padding: '4px 14px', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Ban size={12} /> SOLD OUT
            </span>
          </div>
        )}
      </div>
      <div style={{ padding: 16 }}>
        {(() => { const tr = translateMenuItem(dish.item_id, dish.name, dish.description); return <><h4 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 700, color: '#1a1a1a', cursor: 'pointer' }} onClick={onOpen}>{tr.name}</h4><p style={{ margin: '0 0 12px', fontSize: 13, color: '#6b7280', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{tr.description}</p></> })()}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#1a1a1a' }}>${dish.price.toFixed(2)}</span>
          <button onClick={handleAdd} style={{
            width: 40, height: 40, borderRadius: '50%', border: 'none', background: dish.available ? '#111' : '#d1d5db', color: 'white', cursor: dish.available ? 'pointer' : 'not-allowed', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.15s',
            transform: added ? 'scale(1.2)' : 'scale(1)'
          }}>
            +
          </button>
        </div>
      </div>
    </div>
  )
}