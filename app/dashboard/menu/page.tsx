'use client'

import { useState } from 'react'
import { useI18n } from '../../../lib/contexts'
import { MOCK_DISHES, CATEGORIES } from '../../../lib/mockData'
import { MenuItem } from '../../../lib/types'
import { X, Edit2, Save, ImageOff } from 'lucide-react'
import ImageWithFallback from '../../../components/ImageWithFallback'

function DishImage({ src, name }: { src: string; name: string }) {
  const [error, setError] = useState(false)

  if (error || !src) {
    return (
      <div style={{ width: 40, height: 40, borderRadius: 10, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <ImageOff size={20} style={{ color: '#9ca3af' }} />
      </div>
    )
  }

  return (
    <ImageWithFallback
      src={src}
      alt={name}
      style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }}
    />
  )
}

export default function MenuStudioPage() {
  const { t } = useI18n()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string | null>(null)
  const [dishes, setDishes] = useState(MOCK_DISHES)
  const [editing, setEditing] = useState<MenuItem | null>(null)
  const [editForm, setEditForm] = useState({ name: '', description: '', price: 0, category: '', ingredients: '', allergens: '' })

  const filtered = dishes.filter(d => {
    if (category && d.category !== category) return false
    if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const openEdit = (dish: MenuItem) => {
    setEditing(dish)
    setEditForm({
      name: dish.name,
      description: dish.description,
      price: dish.price,
      category: dish.category,
      ingredients: (dish.ingredients || []).join(', '),
      allergens: (dish.allergens || []).join(', '),
    })
  }

  const saveEdit = () => {
    if (!editing) return
    setDishes(prev => prev.map(d => d.item_id === editing.item_id ? {
      ...d,
      name: editForm.name,
      description: editForm.description,
      price: editForm.price,
      category: editForm.category,
      ingredients: editForm.ingredients.split(',').map(s => s.trim()).filter(Boolean),
      allergens: editForm.allergens.split(',').map(s => s.trim()).filter(Boolean),
    } : d))
    setEditing(null)
  }

  const toggleAvail = (id: string) => {
    setDishes(prev => prev.map(d => d.item_id === id ? { ...d, available: !d.available } : d))
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1a1a1a', margin: 0 }}>{t('Menu Studio')}</h1>
          <p style={{ fontSize: 14, color: '#6b7280', margin: '4px 0 0' }}>{t('Manage your dishes, availability, and pricing.')}</p>
        </div>
        <button style={{ padding: '12px 24px', borderRadius: 999, border: 'none', background: '#111', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>+ {t('Add Dish')}</button>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('Search dishes...')} style={{ flex: 1, padding: '10px 16px', borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 13, outline: 'none' }} />
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto' }} className="scrollbar-hide">
        <button onClick={() => setCategory(null)} style={{ padding: '8px 16px', borderRadius: 999, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, background: category === null ? '#111' : '#f3f4f6', color: category === null ? 'white' : '#1a1a1a' }}>{t('All')}</button>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCategory(c)} style={{ padding: '8px 16px', borderRadius: 999, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, background: category === c ? '#111' : '#f3f4f6', color: category === c ? 'white' : '#1a1a1a', whiteSpace: 'nowrap' }}>{c}</button>
        ))}
      </div>

      <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 20, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e5e7eb', fontSize: 12, color: '#6b7280', textAlign: 'left' }}>
              <th style={{ padding: '12px 16px' }}>{t('Dish')}</th>
              <th style={{ padding: '12px 16px' }}>{t('Price')}</th>
              <th style={{ padding: '12px 16px' }}>{t('Category')}</th>
              <th style={{ padding: '12px 16px' }}>{t('Status')}</th>
              <th style={{ padding: '12px 16px' }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(d => (
              <tr key={d.item_id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <DishImage src={d.image_url} name={d.name} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.name}</span>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 14, color: '#1a1a1a' }}>${d.price.toFixed(2)}</td>
                <td style={{ padding: '12px 16px' }}><span style={{ background: '#f3f4f6', borderRadius: 999, padding: '4px 10px', fontSize: 12, color: '#6b7280' }}>{d.category}</span></td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: d.available ? '#10b981' : '#ef4444' }}>{d.available ? t('ACTIVE') : t('HIDDEN')}</span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button onClick={() => openEdit(d)} style={{ width: 44, height: 24, borderRadius: 999, border: 'none', background: '#111', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Edit2 size={12} color="white" />
                    </button>
                    <button onClick={() => toggleAvail(d.item_id)} style={{ width: 44, height: 24, borderRadius: 999, border: 'none', background: d.available ? '#111' : '#d1d5db', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
                      <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, left: d.available ? 24 : 3, transition: 'left 0.2s' }} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setEditing(null)}>
          <div style={{ background: 'white', borderRadius: 20, padding: 24, width: 500, maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{t('Edit Dish')}</h3>
              <button onClick={() => setEditing(null)} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} /></button>
            </div>
            <div style={{ display: 'grid', gap: 16 }}>
              {[
                { label: 'Name', key: 'name' as const },
                { label: 'Description', key: 'description' as const, textarea: true },
                { label: 'Price ($)', key: 'price' as const, type: 'number' },
                { label: 'Category', key: 'category' as const },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', display: 'block', marginBottom: 6 }}>{t(f.label)}</label>
                  {f.textarea ? (
                    <textarea value={editForm[f.key]} onChange={e => setEditForm({ ...editForm, [f.key]: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 13, outline: 'none', minHeight: 80, resize: 'vertical' }} />
                  ) : (
                    <input type={f.type || 'text'} value={editForm[f.key]} onChange={e => setEditForm({ ...editForm, [f.key]: f.key === 'price' ? parseFloat(e.target.value) || 0 : e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 13, outline: 'none' }} />
                  )}
                </div>
              ))}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', display: 'block', marginBottom: 6 }}>{t('Ingredients (comma-separated)')}</label>
                <input value={editForm.ingredients} onChange={e => setEditForm({ ...editForm, ingredients: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 13, outline: 'none' }} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', display: 'block', marginBottom: 6 }}>{t('Allergens (comma-separated)')}</label>
                <input value={editForm.allergens} onChange={e => setEditForm({ ...editForm, allergens: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 13, outline: 'none' }} />
              </div>
              <button onClick={saveEdit} style={{ marginTop: 8, padding: '12px 24px', borderRadius: 999, border: 'none', background: '#111', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Save size={16} /> {t('Save Changes')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}