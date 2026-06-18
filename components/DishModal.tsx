'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Button from './ui/Button'
import api from '../lib/api'
import type { MenuItem } from '../types/api'

export default function DishModal({
  initial,
  onClose,
  onSaved
}: {
  initial?: Partial<MenuItem>
  onClose: () => void
  onSaved?: () => void
}) {
  const [name, setName] = useState(initial?.name || '')
  const [price, setPrice] = useState(initial?.price?.toString() || '')
  const [category, setCategory] = useState(initial?.category || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [available, setAvailable] = useState(initial?.available ?? true)
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    setName(initial?.name || '')
    setPrice(initial?.price?.toString() || '')
    setCategory(initial?.category || '')
    setDescription(initial?.description || '')
    setAvailable(initial?.available ?? true)
  }, [initial])

  async function generate() {
    try {
      setAiLoading(true)
      const res = await fetch('/api/ai/describe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, category }) })
      const data = await res.json()
      if (data.description) setDescription(data.description)
    } catch (err) {
      console.error(err)
      alert('AI generation failed')
    } finally {
      setAiLoading(false)
    }
  }

  async function save() {
    setLoading(true)
    try {
      const payload: Partial<MenuItem> = { name, price: parseFloat(price || '0') || 0, category, description, available }
      if (initial?.item_id) {
        await api.updateMenu({ ...(payload as any), item_id: initial.item_id })
      } else {
        await api.createMenu(payload)
      }
      onSaved && onSaved()
      onClose()
    } catch (err) {
      console.error(err)
      alert('Save failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative w-full max-w-2xl mx-4">
        <div className="rounded-2xl bg-card p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-2">{initial?.item_id ? 'Edit Dish' : 'Add Dish'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input className="p-2 rounded-md bg-transparent border border-white/6" value={name} onChange={(e) => setName(e.target.value)} placeholder="Dish name" />
            <input className="p-2 rounded-md bg-transparent border border-white/6" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" />
            <input className="p-2 rounded-md bg-transparent border border-white/6" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" />
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={available} onChange={(e) => setAvailable(e.target.checked)} />
                Available
              </label>
            </div>
            <textarea className="p-2 rounded-md bg-transparent border border-white/6 md:col-span-2" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
          </div>
          <div className="flex items-center justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={generate}>{aiLoading ? 'Generating...' : 'Generate AI Description'}</Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button onClick={save}>{loading ? 'Saving...' : 'Save'}</Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
