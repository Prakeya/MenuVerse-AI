'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useCart, useI18n } from '../../../lib/contexts'
import { MOCK_DISHES, CATEGORIES, LANGUAGES } from '../../../lib/mockData'
import CartDrawer from '../../../components/CartDrawer'
import AIWaiter from '../../../components/AIWaiter'
import DishDetail from '../../../components/DishDetail'
import BackButton from '../../../components/BackButton'
import { MenuItem } from '../../../lib/types'
import { MapPin, ShoppingCart, MessageCircle, Flame, Star, Heart, ChefHat, AlertTriangle, Ban } from 'lucide-react'
import ImageWithFallback from '../../../components/ImageWithFallback'

const BADGE_STYLES: Record<string, { bg: string; color: string; border?: string; icon: any }> = {
  trending: { bg: '#fef3c7', color: '#92400e', icon: Flame },
  bestseller: { bg: '#fffbeb', color: '#92400e', border: '#fcd34d', icon: Star },
  favourite: { bg: '#fdf2f8', color: '#9d174d', icon: Heart },
  'chef-special': { bg: '#111', color: 'white', icon: ChefHat },
  spicy: { bg: '#fff1f2', color: '#9f1239', icon: Flame },
  'light-healthy': { bg: '#f0fdf4', color: '#166534', icon: Flame },
}

export default function MenuPage() {
  const router = useRouter()
  const { t, lang, setLang } = useI18n()
  const { addToCart, cartCount } = useCart()
  const [category, setCategory] = useState<string | null>(null)
  const [showCart, setShowCart] = useState(false)
  const [showAI, setShowAI] = useState(false)
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null)
  const [showPlaceMenu, setShowPlaceMenu] = useState(false)
  const [place] = useState('New York')

  const filtered = useMemo(() => {
    if (!category) return MOCK_DISHES
    return MOCK_DISHES.filter(d => d.category === category)
  }, [category])

  const hero = MOCK_DISHES[0]
  const { translateMenuItem } = useI18n()
  const translatedHero = translateMenuItem(hero.item_id, hero.name, hero.description)

  return (
    <div style={{ minHeight: '100vh', background: '#FFFEFB' }}>
      {/* Header — place + language only */}
      <header style={{ position: 'sticky', top: 0, zIndex: 30, background: 'rgba(255,254,251,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <BackButton fallback="/scan" />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => router.push('/scan')} role="button">
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#F5A623', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12, color: '#111' }}>M</div>
              <span style={{ fontWeight: 600, fontSize: 14, color: '#1a1a1a' }}>MenuVerse AI</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Place selector */}
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowPlaceMenu(!showPlaceMenu)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 999, border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>
                <MapPin size={16} /> {place} <span style={{ fontSize: 10 }}>▼</span>
              </button>
              {showPlaceMenu && (
                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 8, background: 'white', borderRadius: 16, boxShadow: '0 12px 32px rgba(0,0,0,0.1)', padding: 8, minWidth: 220, zIndex: 20 }}>
                  {['New York', 'Los Angeles', 'Chicago', 'Miami'].map(c => (
                    <button key={c} onClick={() => setShowPlaceMenu(false)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13, color: '#1a1a1a' }}>{c}</button>
                  ))}
                </div>
              )}
            </div>
            {/* Language buttons - simple and always visible */}
            <div style={{ display: 'flex', gap: 4 }}>
              {LANGUAGES.map(l => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    border: 'none',
                    background: lang === l.code ? '#111' : '#f3f4f6',
                    color: lang === l.code ? 'white' : '#1a1a1a',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 600
                  }}
                >
                  {l.code.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category pills */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '8px 24px 12px', display: 'flex', gap: 8, overflowX: 'auto' }} className="scrollbar-hide">
          <button onClick={() => setCategory(null)} style={{ padding: '8px 18px', borderRadius: 999, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: 13, fontWeight: 600, background: !category ? '#111' : '#f3f4f6', color: !category ? 'white' : '#1a1a1a' }}>{t('All Dishes')}</button>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)} style={{ padding: '8px 18px', borderRadius: 999, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: 13, fontWeight: 600, background: category === c ? '#111' : '#f3f4f6', color: category === c ? 'white' : '#1a1a1a' }}>{t(c)}</button>
          ))}
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
        {/* Hero Banner */}
        <div style={{ position: 'relative', borderRadius: 24, overflow: 'hidden', marginBottom: 32, height: 440, background: '#111' }}>
          <ImageWithFallback src={hero.image_url} alt={hero.name} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.2))' }} />
          
          <div style={{ position: 'absolute', top: 20, left: 24, display: 'flex', gap: 8 }}>
            <span style={{ background: '#F5A623', color: '#111', borderRadius: 999, padding: '4px 12px', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em' }}>TODAY'S FEATURE</span>
            <span style={{ background: 'rgba(0,0,0,0.5)', color: 'white', borderRadius: 999, padding: '4px 12px', fontSize: 11, fontWeight: 600, letterSpacing: '0.05em' }}>{hero.category.toUpperCase()}</span>
          </div>
          
          <div style={{ position: 'absolute', top: 20, right: 24, background: 'white', borderRadius: 999, padding: '6px 16px', fontSize: 16, fontWeight: 800, color: '#111', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
            ${hero.price.toFixed(2)}
          </div>

          <div style={{ position: 'absolute', bottom: 32, left: 32, maxWidth: 500 }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: 'white', margin: '0 0 8px' }}>{translatedHero.name}</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 1.5, margin: '0 0 16px' }}>{translatedHero.description}</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => addToCart(hero)} style={{ background: '#F5A623', color: '#111', border: 'none', borderRadius: 999, padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                + {t('Add to Order')}
              </button>
              <button onClick={() => setSelectedDish(hero)} style={{ background: 'transparent', color: 'rgba(255,255,255,0.8)', border: 'none', fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}>
                View details
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
      </main>

      {/* Floating AI Waiter button */}
      <button onClick={() => setShowAI(!showAI)} style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 50, width: 56, height: 56, borderRadius: '50%', background: '#111', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
        <MessageCircle size={24} color="white" />
      </button>

      {/* Floating Cart button */}
      <button onClick={() => setShowCart(true)} style={{ position: 'fixed', bottom: 24, left: 24, zIndex: 50, padding: '12px 20px', borderRadius: 999, background: '#111', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.2)', color: 'white', fontSize: 14, fontWeight: 600 }}>
        <ShoppingCart size={18} />
        {t('Add to Order')}
        {cartCount > 0 && (
          <span style={{ background: '#F5A623', color: '#111', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{cartCount}</span>
        )}
      </button>

      {showAI && <AIWaiter onClose={() => setShowAI(false)} />}
      {showCart && <CartDrawer onClose={() => setShowCart(false)} />}
      {selectedDish && <DishDetail dish={selectedDish} onClose={() => setSelectedDish(null)} />}
    </div>
  )
}

function DishCard({ dish, onAdd, onOpen }: { dish: MenuItem; onAdd: () => void; onOpen: () => void }) {
  const { translateMenuItem } = useI18n()
  const dishTranslation = translateMenuItem(dish.item_id, dish.name, dish.description)
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
              <BadgeIcon size={12} /> {badgeKey.replace('-', ' ')}
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
        <h4 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 700, color: '#1a1a1a', cursor: 'pointer' }} onClick={onOpen}>{dishTranslation.name}</h4>
        <p style={{ margin: '0 0 12px', fontSize: 13, color: '#6b7280', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{dishTranslation.description}</p>
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