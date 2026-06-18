'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import useMenu from '../hooks/useMenu'
import DishCard from './DishCard'
import Button from './ui/Button'
import api from '../lib/api'
import FoodDiscoveryMap from './FoodDiscoveryMap'
import { MenuItem } from '../types/api'

const categoriesFromItems = (items: MenuItem[]) => Array.from(new Set(items.map((item) => item.category || 'Classic')))

export default function RestaurantMenuClient({ restaurantId }: { restaurantId: string }) {
  const { items, isLoading } = useMenu(restaurantId)
  const [fetchedItems, setFetchedItems] = useState<MenuItem[]>([])
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [activeItem, setActiveItem] = useState<MenuItem | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [cart, setCart] = useState<Array<{ item: MenuItem; quantity: number }>>([])
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')

  useEffect(() => {
    if (!restaurantId) return
    console.log('[DinerPage] fetching menu for', restaurantId)
    api.getMenu(restaurantId)
      .then((res) => {
        console.log('[DinerPage] fetched items:', res)
        setFetchedItems(res)
        console.log('[DinerPage] state after fetchedItems set:', res)
      })
      .catch((e) => console.error('[DinerPage] fetch error', e))
  }, [restaurantId])

  useEffect(() => {
    console.log('[DinerPage] SWR items changed:', items)
  }, [items])

  const sourceItems = items.length ? items : fetchedItems
  const categories = useMemo(() => categoriesFromItems(sourceItems), [sourceItems])
  const filtered = useMemo(
    () =>
      sourceItems.filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) &&
          (!selectedCategory || item.category === selectedCategory)
      ),
    [sourceItems, query, selectedCategory]
  )

  useEffect(() => {
    console.log('[DinerPage] filtered menu count:', filtered.length)
  }, [filtered])

  const heroDish = activeItem || filtered[0] || sourceItems[0] || null
  const cartCount = cart.reduce((sum, entry) => sum + entry.quantity, 0)
  const subtotal = cart.reduce((sum, entry) => sum + entry.item.price * entry.quantity, 0)
  const delivery = cartCount ? 4.99 : 0
  const discount = cartCount ? 5 : 0
  const total = subtotal + delivery - discount

  function addToCart(item: MenuItem) {
    setCart((prev) => {
      const existing = prev.find((entry) => entry.item.item_id === item.item_id)
      if (existing) {
        return prev.map((entry) =>
          entry.item.item_id === item.item_id ? { ...entry, quantity: entry.quantity + quantity } : entry
        )
      }
      return [...prev, { item, quantity }]
    })
    setQuantity(1)
  }

  function updateCart(itemId: string, nextQuantity: number) {
    setCart((prev) =>
      prev
        .map((entry) => (entry.item.item_id === itemId ? { ...entry, quantity: nextQuantity } : entry))
        .filter((entry) => entry.quantity > 0)
    )
  }

  function removeFromCart(itemId: string) {
    setCart((prev) => prev.filter((entry) => entry.item.item_id !== itemId))
  }

  return (
    <section className={`diner-theme min-h-screen pb-10 ${activeItem ? 'dish-active' : ''}`}>
      <div className="diner-hero-card rounded-[32px] p-6 lg:p-10">
        <header className="space-y-6 lg:flex lg:items-end lg:justify-between lg:space-y-0">
          <div className="max-w-3xl space-y-4">
            <div className="eyebrow">AI Curated</div>
            <p className="text-sm uppercase tracking-[0.2em] text-muted">Restaurant menu</p>
            <h1 className="text-4xl font-extrabold leading-tight hero-title">Premium dishes for every appetite</h1>
            <div className="gold-underline" style={{ width: '120px' }} />
            <p className="text-sm leading-6 text-muted max-w-2xl">
              Discover beautifully plated meals and order instantly with a polished, customer-friendly menu experience.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-[24px] border border-border bg-white p-4 text-sm text-slate-700">
              <div className="font-semibold text-primary">Category</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {categories.slice(0, 4).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      selectedCategory === cat ? 'bg-accent text-black shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={async () => {
                try {
                  console.log('[DinerPage][Test API] requesting menu', restaurantId)
                  const res = await api.getMenu(restaurantId)
                  console.log('[DinerPage][Test API] response', res)
                  alert(`Diner Test API: received ${res.length} items`)
                } catch (e) {
                  console.error(e)
                  alert('Diner Test API failed')
                }
              }}
              className="rounded-md px-3 py-2 bg-black text-white"
            >
              Test API
            </button>

            <div className="rounded-[24px] border border-border bg-white p-4 text-sm text-slate-700">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-primary">Cart</span>
                <span>{cartCount} items</span>
              </div>
              <div className="mt-4 text-2xl font-semibold text-primary">${total.toFixed(2)}</div>
            </div>
          </div>
        </header>
        <div className="wave-divider" style={{ backgroundImage: "url('/wave.svg')" }} />

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_0.9fr]">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[32px] border border-border bg-white p-8 shadow-soft"
            >
              <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-center">
                <div className="space-y-6">
                  <p className="text-sm uppercase tracking-[0.2em] text-muted">Featured dish</p>
                  <h2 className="text-4xl font-semibold text-primary">{heroDish?.name || 'Chef's Special'}</h2>
                  <p className="mt-4 max-w-xl text-sm leading-6 text-muted">
                    {heroDish?.description || 'The perfect combination of premium ingredients and unforgettable flavor.'}
                  </p>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-[24px] border border-border bg-slate-50 p-4">
                      <div className="text-xs uppercase tracking-[0.2em] text-muted">Portion</div>
                      <div className="mt-2 text-base font-semibold text-primary">Regular</div>
                    </div>
                    <div className="rounded-[24px] border border-border bg-slate-50 p-4">
                      <div className="text-xs uppercase tracking-[0.2em] text-muted">Add-ons</div>
                      <div className="mt-2 text-base font-semibold text-primary">Extra cheese</div>
                    </div>
                    <div className="rounded-[24px] border border-border bg-slate-50 p-4">
                      <div className="text-xs uppercase tracking-[0.2em] text-muted">Status</div>
                      <div className="mt-2 text-base font-semibold text-primary">{heroDish?.available ? 'Fresh' : 'Sold out'}</div>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-[1fr_auto] items-center">
                    <div className="flex items-center gap-3 rounded-3xl border border-border bg-slate-100 px-4 py-3">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-xl text-primary">−</button>
                      <span className="min-w-[46px] text-center text-lg font-semibold text-primary">{quantity}</span>
                      <button onClick={() => setQuantity(Math.min(10, quantity + 1))} className="text-xl text-primary">+</button>
                    </div>
                    <button
                      onClick={() => heroDish && addToCart(heroDish)}
                      className="rounded-[28px] diner-accent px-6 py-4 text-base font-semibold shadow-card card-lift"
                      style={{ color: '#16140F' }}
                    >
                      Add to order · ${heroDish?.price.toFixed(2) || '0.00'}
                    </button>
                  </div>
                </div>

                <div className="relative rounded-[32px] bg-gradient-to-br from-white via-slate-50 to-slate-100 p-6 shadow-soft">
                  <div className="absolute -top-8 right-8 h-24 w-24 rounded-full bg-accent/15 blur-2xl" />
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm uppercase tracking-[0.24em] text-muted">Dish preview</div>
                      <div className="mt-3 text-3xl font-semibold text-primary">${heroDish?.price.toFixed(2) || '0.00'}</div>
                    </div>
                    <div className="rounded-full bg-white p-3 shadow-card">
                      <img src={heroDish?.image_url || '/placeholder.png'} alt={heroDish?.name} className="h-20 w-20 rounded-full object-cover" />
                    </div>
                  </div>

                  <div className="mt-6 rounded-[32px] bg-white p-4 shadow-soft">
                    <div className="text-sm text-muted">Recommended pairings</div>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {filtered.slice(1, 5).map((pairing) => (
                        <div key={pairing.item_id} className="rounded-3xl border border-border bg-slate-50 p-4">
                          <div className="text-sm font-semibold text-primary">{pairing.name}</div>
                          <div className="mt-1 text-sm text-muted">${pairing.price.toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-muted">Explore menu</p>
                  <h2 className="text-3xl font-semibold text-primary">Our most loved dishes</h2>
                </div>
                <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary shadow-card">{filtered.length} items</div>
              </div>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
                className="grid gap-5 sm:grid-cols-2"
              >
                {viewMode === 'list' ? (
                  filtered.slice(0, 6).map((dish, index) => (
                    <motion.div key={dish.item_id} variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}>
                      <DishCard
                        dish={dish}
                        onOrder={() => addToCart(dish)}
                        onOpen={() => setActiveItem(dish)}
                        selected={activeItem?.item_id === dish.item_id}
                        muted={Boolean(activeItem && activeItem.item_id !== dish.item_id)}
                        badges={getDishBadges(dish, index)}
                      />
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-2">
                    <FoodDiscoveryMap items={sourceItems} selectedId={activeItem?.item_id} onSelect={(it) => setActiveItem(it)} />
                  </div>
                )}
              </motion.div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="hidden h-fit rounded-[32px] border border-border bg-white p-6 shadow-soft lg:block"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-muted">Your order</p>
                  <h3 className="text-2xl font-semibold text-primary">Cart summary</h3>
                </div>
                <div className="rounded-2xl bg-accent px-4 py-2 text-sm font-semibold text-black">{cartCount} items</div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant={viewMode === 'list' ? 'primary' : 'ghost'} onClick={() => setViewMode('list')}>Browse</Button>
                    <Button variant={viewMode === 'list' ? 'ghost' : 'primary'} onClick={() => setViewMode('map')}>Discovery Map</Button>
                  </div>
                  <div className="text-sm text-muted">Viewing: {viewMode}</div>
                </div>
                {cart.length === 0 ? (
                  <div className="rounded-[28px] bg-slate-50 p-6 text-center text-muted">Add dishes to your cart to see totals.</div>
                ) : (
                  cart.map((entry) => (
                    <div key={entry.item.item_id} className="rounded-[28px] border border-border bg-slate-50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-primary">{entry.item.name}</p>
                          <p className="text-sm text-muted">{entry.quantity} × ${entry.item.price.toFixed(2)}</p>
                        </div>
                        <div className="text-right font-semibold text-primary">${(entry.item.price * entry.quantity).toFixed(2)}</div>
                      </div>
                      <div className="mt-4 flex items-center justify-between gap-3 text-sm text-muted">
                        <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 border border-border">
                          <button onClick={() => updateCart(entry.item.item_id, Math.max(1, entry.quantity - 1))}>−</button>
                          <span>{entry.quantity}</span>
                          <button onClick={() => updateCart(entry.item.item_id, entry.quantity + 1)}>+</button>
                        </div>
                        <button onClick={() => removeFromCart(entry.item.item_id)} className="text-accent">Remove</button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-6 rounded-[32px] bg-slate-50 p-5">
                <div className="flex items-center justify-between text-sm text-muted mb-3">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted mb-3">
                  <span>Delivery</span>
                  <span>${delivery.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted mb-3">
                  <span>Discount</span>
                  <span className="text-primary">-${discount.toFixed(2)}</span>
                </div>
                <div className="border-t border-border pt-4 flex items-center justify-between text-lg font-semibold text-primary">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button className="mt-6 w-full rounded-[28px] diner-accent px-5 py-4 text-base font-semibold shadow-card transition card-lift" style={{ color: '#16140F' }}>
                Confirm order
              </button>
            </motion.div>
          </aside>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-x-0 bottom-0 z-30 block bg-white p-4 shadow-[0_-20px_40px_rgba(0,0,0,0.08)] lg:hidden"
        >
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
            <div>
              <div className="text-sm uppercase tracking-[0.2em] text-muted">Your order</div>
              <div className="text-xl font-semibold text-primary">${total.toFixed(2)}</div>
            </div>
            <button className="rounded-[28px] diner-accent px-6 py-4 text-base font-semibold shadow-card transition card-lift" style={{ color: '#16140F' }}>
              Checkout
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function getDishBadges(item: MenuItem, index: number) {
  const badges: Array<{ label: string; tone: 'gold' | 'red' | 'green' | 'muted' | 'brand' }> = []
  const desc = (item.description || '').toLowerCase()
  const spicy = /spice|spicy|tikka|curry|chili|hot/.test(desc)

  if (!item.available) {
    badges.push({ label: 'Sold out', tone: 'muted' })
  }
  if (index === 0) {
    badges.push({ label: "Chef’s Special", tone: 'gold' })
  }
  if (spicy) {
    badges.push({ label: 'Spicy 🔥', tone: 'red' })
  }
  if (item.category?.toLowerCase() === 'sides') {
    badges.push({ label: 'Light & Healthy', tone: 'green' })
  }
  if (item.price >= 300) {
    badges.push({ label: 'Premium', tone: 'brand' })
  }

  return badges.slice(0, 3)
}
