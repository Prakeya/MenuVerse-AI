import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import api from '../../lib/api'
import { useAuth } from '../../lib/auth'

const EXAMPLE = `STARTERS
Spring Rolls - 299
Paneer Tikka - 349
Chicken Wings - 399

MAINS
Butter Chicken - 449
Margherita Pizza - 349
Truffle Burger - 429
Hyderabadi Biryani - 399

DESSERTS
Gulab Jamun - 149
Chocolate Lava Cake - 249

DRINKS
Mango Lassi - 99
Masala Chai - 59`

type ImportedDish = { name: string; price: number; category: string; description: string }
type Status = 'idle' | 'importing' | 'success' | 'error'

export default function ImportPage() {
  const { restaurantId } = useAuth()
  const qc = useQueryClient()
  const [text, setText] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [result, setResult] = useState<{ imported: number; dishes: ImportedDish[] } | null>(null)
  const [error, setError] = useState('')

  async function handleImport() {
    if (!text.trim()) return
    setStatus('importing')
    setError('')
    setResult(null)
    try {
      const data = await api.aiImport(restaurantId, text)
      setResult(data)
      setStatus('success')
      qc.invalidateQueries({ queryKey: ['menu', restaurantId] })
    } catch {
      setError('Import failed. Please check the format and try again.')
      setStatus('error')
    }
  }

  return (
    <section className="space-y-6 py-6">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-[#FEF3C7] px-3 py-1 text-xs font-bold text-[#92400E] mb-3">
          <Sparkles size={12} /> AI FEATURE
        </div>
        <h2 className="text-3xl font-semibold text-[#14141A]">Magic Menu Import</h2>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-[#84848C]">
          Paste your menu text below. Our AI parses every dish, price, and category — then adds them to your live menu instantly.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: input */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-[#14141A]">Paste your menu text</label>
            <button onClick={() => setText(EXAMPLE)} className="text-xs font-semibold text-[#E5484D] hover:underline">
              Load example ↗
            </button>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={'CATEGORY\nDish Name - ₹Price\n\nANOTHER CATEGORY\nDish Name - ₹Price'}
            className="w-full h-64 px-4 py-3 rounded-[16px] border border-[#E5E7EB] text-sm font-mono leading-7 resize-none outline-none focus:border-[#111] transition bg-[#FAFAFA]"
          />

          {/* Drag & drop area */}
          <motion.div
            whileHover={{ borderColor: '#E5484D' }}
            className="border-2 border-dashed border-[#E5E7EB] rounded-[16px] p-8 text-center cursor-pointer bg-[#FAFAFA] transition-colors"
            onClick={() => {
              const input = document.createElement('input')
              input.type = 'file'
              input.accept = '.txt,.csv'
              input.onchange = async (e) => {
                const file = (e.target as HTMLInputElement).files?.[0]
                if (file) {
                  const t = await file.text()
                  setText(t)
                }
              }
              input.click()
            }}
          >
            <div className="flex flex-col items-center gap-2">
              <Upload size={24} className="text-[#9CA3AF]" />
              <p className="text-sm font-semibold text-[#1A1A1A]">Drop a .txt or .csv file</p>
              <p className="text-xs text-[#9CA3AF]">or click to browse</p>
            </div>
          </motion.div>

          <button
            onClick={handleImport}
            disabled={!text.trim() || status === 'importing'}
            className="w-full py-4 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition disabled:opacity-40"
            style={{ background: text.trim() ? '#111' : '#E5E7EB', color: text.trim() ? 'white' : '#9CA3AF', cursor: text.trim() ? 'pointer' : 'not-allowed' }}
          >
            <Sparkles size={16} />
            {status === 'importing' ? 'Importing…' : 'Import Menu with AI'}
          </button>
        </div>

        {/* Right: result / log */}
        <div className="rounded-[20px] border border-[#ECECEC] bg-white p-6 shadow-[0_4px_12px_rgba(20,20,26,0.04)]">
          <h3 className="text-sm font-semibold text-[#14141A] mb-4">Import Log</h3>

          {status === 'idle' && (
            <div className="py-12 text-center text-[#84848C]">
              <div className="text-3xl mb-3">📋</div>
              <p className="text-sm">Paste your menu and click Import to see results here</p>
            </div>
          )}

          {status === 'importing' && (
            <div className="space-y-3">
              {['Reading menu text…', 'Parsing dish names & prices…', 'Generating descriptions…', 'Saving to your menu…'].map((step, i) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.4 }}
                  className="flex items-center gap-3 rounded-[12px] bg-[#F9FAFB] px-4 py-3"
                >
                  <motion.div
                    className="w-5 h-5 rounded-full border-2 border-[#F5A623] flex items-center justify-center text-[10px] font-bold text-[#F5A623] shrink-0"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear', delay: i * 0.4 }}
                  >
                    {i + 1}
                  </motion.div>
                  <span className="text-sm text-[#1A1A1A]">{step}</span>
                </motion.div>
              ))}
            </div>
          )}

          {status === 'error' && (
            <div className="flex items-start gap-3 rounded-[14px] bg-red-50 border border-red-200 p-4">
              <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-700">Import failed</p>
                <p className="text-xs text-red-600 mt-1">{error}</p>
              </div>
            </div>
          )}

          <AnimatePresence>
            {status === 'success' && result && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 size={18} />
                  <span className="text-sm font-bold">{result.imported} dishes imported successfully!</span>
                </div>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {result.dishes.map((d, i) => (
                    <div key={i} className="flex items-center justify-between rounded-[12px] bg-[#F9FAFB] px-4 py-2.5">
                      <div>
                        <p className="text-sm font-semibold text-[#1A1A1A]">{d.name}</p>
                        <p className="text-xs text-[#9CA3AF]">{d.category}</p>
                      </div>
                      <span className="text-sm font-bold text-[#1A1A1A]">₹{d.price}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[#84848C]">All dishes have been added to your live menu.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* How it works */}
      <div className="rounded-[20px] border border-[#ECECEC] bg-white p-6 shadow-[0_4px_12px_rgba(20,20,26,0.04)]">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={16} className="text-[#E5484D]" />
          <h3 className="text-sm font-semibold text-[#14141A]">How AI import works</h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { step: '1', title: 'Paste', desc: 'Drop any menu text — structured or unstructured.' },
            { step: '2', title: 'Extract', desc: 'AI reads dish names, prices, and categories instantly.' },
            { step: '3', title: 'Publish', desc: 'Dishes appear on your live menu. Edit anytime.' },
          ].map((s) => (
            <div key={s.step} className="rounded-[14px] bg-[#FAFAFA] p-4">
              <div className="text-xs font-bold text-[#E5484D] mb-2">Step {s.step}</div>
              <div className="text-sm font-semibold text-[#14141A] mb-1">{s.title}</div>
              <div className="text-xs text-[#84848C] leading-5">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
