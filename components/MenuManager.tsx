'use client'

import React, { useMemo, useState } from 'react'
import useMenu from '../hooks/useMenu'
import api from '../lib/api'
import Button from './ui/Button'
import { motion, AnimatePresence } from 'framer-motion'
import DishModal from './DishModal'
import Skeleton from './Skeleton'
import { useAuth } from '../hooks/useAuth'
import Badge from './ui/Badge'

export default function MenuManager() {
  const { restaurantId } = useAuth()
  const { items, isLoading, isError, mutate } = useMenu(restaurantId || undefined)
  React.useEffect(() => {
    console.log('[MenuManager] mount restaurantId=', restaurantId)
  }, [restaurantId])

  React.useEffect(() => {
    console.log('[MenuManager] SWR items updated:', items.length, items)
  }, [items])
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<null | any>(null)
  const [aiResult, setAiResult] = useState<string>('')

  const filtered = useMemo(
    () => items.filter((item) => item.name.toLowerCase().includes(query.toLowerCase())),
    [items, query]
  )

  const categories = useMemo(() => Array.from(new Set(items.map((item) => item.category || 'Classic'))), [items])
  const availableCount = items.filter((item) => item.available).length
  const soldOutCount = items.length - availableCount

  async function toggle(item_id: string, available: boolean) {
    try {
      await api.toggleAvailability(item_id, !available)
      await mutate()
    } catch (err) {
      console.error(err)
      alert('Failed to update availability')
    }
  }

  async function remove(item_id: string) {
    if (!confirm('Delete this item?')) return
    try {
      await api.deleteMenu(item_id)
      await mutate()
    } catch (err) {
      console.error(err)
      alert('Failed to delete')
    }
  }

  async function applySuggestion(item_id: string, suggestedPrice: number) {
    try {
      await api.updateMenu({ item_id, price: suggestedPrice })
      await mutate()
      alert('Applied suggestion')
    } catch (err) {
      console.error(err)
      alert('Failed to apply suggestion')
    }
  }

  return (
    <section className="space-y-8">
      <div className="rounded-[32px] border border-[rgba(0,0,0,0.05)] bg-white p-6 shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Menu Studio</p>
            <h2 className="mt-3 text-4xl font-semibold text-[#111111]">Manage dishes with style.</h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              A modern food management workspace with beautiful cards, quick actions, and premium spacing.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="ghost" onClick={() => setOpen(false)}>Import</Button>
            <Button onClick={() => { setEditing(null); setOpen(true) }}>Add Dish</Button>
            <Button variant="secondary" onClick={async () => {
              console.log('[MenuManager][Test API] requesting menu for rest_1')
              try {
                const res = await api.getMenu('rest_1')
                console.log('[MenuManager][Test API] response:', res)
                alert(`Test API: received ${res.length} items (check console for details)`)
              } catch (e) {
                console.error('[MenuManager][Test API] error', e)
                alert('Test API failed — check console')
              }
            }}>Test API</Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[32px] border border-[rgba(0,0,0,0.05)] bg-white p-5 shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Total dishes</p>
          <p className="mt-4 text-3xl font-semibold text-[#111111]">{items.length}</p>
        </div>
        <div className="rounded-[32px] border border-[rgba(0,0,0,0.05)] bg-white p-5 shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Available</p>
          <p className="mt-4 text-3xl font-semibold text-[#111111]">{availableCount}</p>
        </div>
        <div className="rounded-[32px] border border-[rgba(0,0,0,0.05)] bg-white p-5 shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Sold out</p>
          <p className="mt-4 text-3xl font-semibold text-[#111111]">{soldOutCount}</p>
        </div>
      </div>

      <div className="rounded-[32px] border border-[rgba(0,0,0,0.05)] bg-white p-6 shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">AI Insights</p>
            <h3 className="mt-2 text-2xl font-semibold text-[#111111]">Quick suggestions</h3>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={async () => {
              try {
                console.log('[MenuManager][AI] requesting analytics')
                const res = await api.getAnalytics(restaurantId || undefined)
                console.log('[MenuManager][AI] analytics response', res)
                setAiResult(JSON.stringify(res, null, 2))
                alert('AI Insights fetched — check console or panel')
              } catch (e) {
                console.error(e)
                alert('AI Insights failed')
              }
            }}>Run AI Insights</Button>
            <Button variant="primary" onClick={async () => {
              // apply heuristic suggestions for top 3 items
              try {
                const top = items.slice().sort((a,b)=>a.price-b.price).slice(0,3)
                const ops = top.map(it => {
                  const suggested = +(it.price * 1.08).toFixed(2)
                  return api.updateMenu({ item_id: it.item_id, price: suggested })
                })
                await Promise.all(ops)
                await mutate()
                alert('Applied suggestions for top 3 items')
              } catch (e) {
                console.error(e)
                alert('Failed to apply batch suggestions')
              }
            }}>Apply All</Button>
          </div>
        </div>

        <div className="mt-4 grid gap-3">
          <div className="text-sm text-muted">Pricing suggestions (heuristic)</div>
          <div className="grid gap-2">
            {items.slice().sort((a,b)=>a.price-b.price).slice(0,3).map(it => {
              const suggested = +(it.price * 1.08).toFixed(2)
              return (
                <div key={it.item_id} className="rounded-lg p-3 border border-[rgba(0,0,0,0.03)] flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{it.name}</div>
                    <div className="text-xs text-muted">Current: ${it.price.toFixed(2)}</div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div className="text-sm text-muted">Suggestion: ${suggested}</div>
                    <Button variant="ghost" onClick={() => applySuggestion(it.item_id, suggested)}>Apply</Button>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-4">
            <details>
              <summary className="cursor-pointer text-sm font-semibold">Raw AI result</summary>
              <pre className="mt-2 max-h-64 overflow-auto text-xs bg-[#F8F8F8] p-3 rounded">{aiResult}</pre>
            </details>
          </div>
        </div>
      </div>

      <div className="rounded-[32px] border border-[rgba(0,0,0,0.05)] bg-white p-6 shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Search</p>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your menu items"
              className="w-full rounded-[32px] border border-[rgba(0,0,0,0.05)] bg-[#F8F8F8] px-5 py-4 text-sm text-[#111111] outline-none transition focus:border-[#FF3B30]"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.slice(0, 6).map((category) => (
              <button
                key={category}
                onClick={() => setQuery(category)}
                className="rounded-full bg-[#F4F4F4] px-4 py-2 text-sm font-medium text-[#111111] transition hover:bg-[#FF3B30] hover:text-white"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <motion.div
        layout
        className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
      >
        {isLoading ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="rounded-[32px] border border-[rgba(0,0,0,0.05)] bg-[#F8F8F8] p-6 shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-40" />
            </div>
          ))
        ) : isError ? (
          <div className="rounded-[32px] border border-[rgba(0,0,0,0.05)] bg-white p-6 text-center text-slate-500 shadow-[0_18px_45px_rgba(0,0,0,0.08)]">Failed to load menu</div>
        ) : filtered.length === 0 ? (
          <div className="rounded-[32px] border border-[rgba(0,0,0,0.05)] bg-white p-10 text-center text-slate-500 shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
            No dishes found. Add your first premium item.
          </div>
        ) : (
          filtered.map((item) => (
            <motion.article
              key={item.item_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[32px] border border-[rgba(0,0,0,0.05)] bg-white p-6 shadow-[0_18px_45px_rgba(0,0,0,0.08)] transition hover:-translate-y-1"
            >
              <div className="relative overflow-hidden rounded-[28px] bg-[#F4F4F4]">
                <img src={item.image_url || '/placeholder.png'} alt={item.name} className="h-48 w-full object-cover" />
                <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-2 text-xs font-semibold text-[#111111] shadow-sm">{item.category}</div>
              </div>
              <div className="mt-5 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-semibold text-[#111111]">{item.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.description || 'Crafted to delight every guest at your table.'}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-semibold text-[#111111]">${item.price.toFixed(2)}</div>
                    <div className="mt-2 text-sm text-slate-500">{item.available ? 'Ready now' : 'Sold out'}</div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge>{item.available ? 'Available' : 'Sold Out'}</Badge>
                  <button onClick={() => toggle(item.item_id, item.available)} className="text-sm font-semibold text-[#FF3B30] transition hover:text-[#c1271f]">
                    {item.available ? 'Mark sold out' : 'Mark available'}
                  </button>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button variant="ghost" onClick={() => { setEditing(item); setOpen(true) }}>Edit</Button>
                <Button variant="ghost" onClick={() => remove(item.item_id)}>Delete</Button>
              </div>
            </motion.article>
          ))
        )}
      </motion.div>

      <AnimatePresence>{open && <DishModal initial={editing || undefined} onClose={() => setOpen(false)} onSaved={() => mutate()} />}</AnimatePresence>

      <button
        onClick={() => { setEditing(null); setOpen(true) }}
        className="fixed bottom-6 right-6 z-20 rounded-full bg-[#FF3B30] px-6 py-4 text-base font-semibold text-white shadow-[0_18px_45px_rgba(255,59,48,0.18)] transition hover:brightness-95"
      >
        + Add Dish
      </button>
    </section>
  )
}
