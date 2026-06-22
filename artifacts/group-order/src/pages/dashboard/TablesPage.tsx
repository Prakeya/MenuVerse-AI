import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, MapPin, Users, CheckCircle2, Clock, AlertCircle, X, QrCode } from 'lucide-react'
import api from '../../lib/api'
import type { RestaurantTable } from '../../types/api'
import { useAuth } from '../../lib/auth'

const RESTAURANT_ID = 'restaurant_001'

const STATUS_CONFIG: Record<string, { label: string; bg: string; border: string; text: string; icon: React.ElementType }> = {
  free:      { label: 'Free',     bg: '#F0FDF4', border: '#BBF7D0', text: '#166534', icon: CheckCircle2 },
  occupied:  { label: 'Occupied', bg: '#FEF3C7', border: '#FDE68A', text: '#92400E', icon: Clock },
  reserved:  { label: 'Reserved', bg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF', icon: AlertCircle },
}

function TableCard({ table, onDelete, onStatusChange }: {
  table: RestaurantTable
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: string) => void
}) {
  const cfg = STATUS_CONFIG[table.status] ?? STATUS_CONFIG['free']
  const Icon = cfg.icon
  const base = `${import.meta.env.BASE_URL}`
  const qrUrl = `${window.location.origin}${base}menu/${RESTAURANT_ID}?table=${table.table_number}`

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      style={{
        borderRadius: 20, border: `2px solid ${cfg.border}`,
        background: cfg.bg, padding: 20, position: 'relative',
        display: 'flex', flexDirection: 'column', gap: 12,
      }}
    >
      {/* Delete */}
      <button
        onClick={() => onDelete(table.table_id)}
        style={{ position: 'absolute', top: 12, right: 12, width: 28, height: 28, borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.06)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' }}
      >
        <Trash2 size={13} />
      </button>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: cfg.border, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <MapPin size={20} color={cfg.text} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1A1A1A' }}>Table {table.table_number}</h3>
          {table.label && <p style={{ margin: '2px 0 0', fontSize: 12, color: '#6B7280' }}>{table.label}</p>}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
            <Users size={11} color="#9CA3AF" />
            <span style={{ fontSize: 12, color: '#9CA3AF' }}>{table.seats} seats</span>
          </div>
        </div>
      </div>

      {/* Status badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Icon size={14} color={cfg.text} />
        <span style={{ fontSize: 13, fontWeight: 700, color: cfg.text }}>{cfg.label}</span>
      </div>

      {/* Status change */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {Object.entries(STATUS_CONFIG).map(([s, sc]) => (
          s !== table.status && (
            <button
              key={s}
              onClick={() => onStatusChange(table.table_id, s)}
              style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 999, border: `1px solid ${sc.border}`, background: 'white', color: sc.text, cursor: 'pointer' }}
            >
              Mark {sc.label}
            </button>
          )
        ))}
      </div>

      {/* QR link */}
      <a
        href={qrUrl}
        target="_blank"
        rel="noreferrer"
        style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#6B7280', textDecoration: 'none', borderTop: `1px solid ${cfg.border}`, paddingTop: 10 }}
      >
        <QrCode size={12} /> Diner link
      </a>
    </motion.div>
  )
}

export default function TablesPage() {
  const { user } = useAuth()
  const restaurantId = user?.restaurantId ?? RESTAURANT_ID
  const qc = useQueryClient()

  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ table_number: '', seats: 4, label: '' })

  const { data: tables = [], isLoading } = useQuery({
    queryKey: ['tables', restaurantId],
    queryFn: () => api.getTables(restaurantId),
  })

  const createMut = useMutation({
    mutationFn: (data: typeof form) => api.createTable(restaurantId, { ...data, seats: Number(data.seats) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tables', restaurantId] }); setShowAdd(false); setForm({ table_number: '', seats: 4, label: '' }) },
  })

  const updateMut = useMutation({
    mutationFn: ({ tableId, status }: { tableId: string; status: string }) =>
      api.updateTable(restaurantId, tableId, { status: status as RestaurantTable['status'] }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tables', restaurantId] }),
  })

  const deleteMut = useMutation({
    mutationFn: (tableId: string) => api.deleteTable(restaurantId, tableId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tables', restaurantId] }),
  })

  const stats = {
    total: tables.length,
    free: tables.filter((t) => t.status === 'free').length,
    occupied: tables.filter((t) => t.status === 'occupied').length,
    reserved: tables.filter((t) => t.status === 'reserved').length,
  }

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#14141A]">Tables</h1>
          <p className="text-sm text-[#84848C] mt-1">Manage seating, track occupancy, and generate diner QR links</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 rounded-full bg-[#E5484D] px-5 py-2.5 text-sm font-semibold text-white hover:brightness-95 transition"
        >
          <Plus size={15} /> Add Table
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Tables', value: stats.total, color: '#14141A' },
          { label: 'Free', value: stats.free, color: '#166534' },
          { label: 'Occupied', value: stats.occupied, color: '#92400E' },
          { label: 'Reserved', value: stats.reserved, color: '#1E40AF' },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-2xl border border-[#ECECEC] bg-white p-5">
            <p style={{ color }} className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-[#84848C] mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Tables grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-[#F7F5F5] h-48 animate-pulse" />
          ))}
        </div>
      ) : tables.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-full bg-[#F7F5F5] flex items-center justify-center mb-4">
            <MapPin size={22} className="text-[#84848C]" />
          </div>
          <p className="text-base font-semibold text-[#14141A]">No tables yet</p>
          <p className="text-sm text-[#84848C] mt-1">Add your first table to start tracking occupancy</p>
          <button
            onClick={() => setShowAdd(true)}
            className="mt-6 flex items-center gap-2 rounded-full bg-[#E5484D] px-5 py-2.5 text-sm font-semibold text-white"
          >
            <Plus size={14} /> Add Table
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {tables.map((t) => (
              <TableCard
                key={t.table_id}
                table={t}
                onDelete={(id) => deleteMut.mutate(id)}
                onStatusChange={(id, status) => updateMut.mutate({ tableId: id, status })}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add table modal */}
      <AnimatePresence>
        {showAdd && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowAdd(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.95 }}
              className="fixed z-[51] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl shadow-2xl p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#14141A]">Add New Table</h2>
                <button onClick={() => setShowAdd(false)} className="w-8 h-8 rounded-full bg-[#F7F5F5] flex items-center justify-center text-[#84848C] hover:bg-[#ECECEC]">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-[#84848C] mb-1.5 block">Table Number *</label>
                  <input
                    value={form.table_number}
                    onChange={(e) => setForm((f) => ({ ...f, table_number: e.target.value }))}
                    placeholder="e.g. 1, A1, VIP-01"
                    className="w-full rounded-2xl border border-[#ECECEC] bg-[#FAFAFA] px-4 py-3 text-sm text-[#14141A] focus:outline-none focus:border-[#E5484D] transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-[#84848C] mb-1.5 block">Seats</label>
                  <input
                    type="number" min={1} max={20}
                    value={form.seats}
                    onChange={(e) => setForm((f) => ({ ...f, seats: Number(e.target.value) }))}
                    className="w-full rounded-2xl border border-[#ECECEC] bg-[#FAFAFA] px-4 py-3 text-sm text-[#14141A] focus:outline-none focus:border-[#E5484D] transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-[#84848C] mb-1.5 block">Label (optional)</label>
                  <input
                    value={form.label}
                    onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                    placeholder="e.g. Window Table, Rooftop, VIP"
                    className="w-full rounded-2xl border border-[#ECECEC] bg-[#FAFAFA] px-4 py-3 text-sm text-[#14141A] focus:outline-none focus:border-[#E5484D] transition"
                  />
                </div>
              </div>

              <button
                onClick={() => createMut.mutate(form)}
                disabled={!form.table_number.trim() || createMut.isPending}
                className="mt-6 w-full py-3.5 rounded-full bg-[#E5484D] text-white text-sm font-bold hover:brightness-95 disabled:opacity-50 transition"
              >
                {createMut.isPending ? 'Adding…' : 'Add Table'}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
