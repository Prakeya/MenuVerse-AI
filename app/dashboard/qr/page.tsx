'use client'

import React from 'react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import { motion } from 'framer-motion'

export default function QRPage() {
  return (
    <section className="space-y-8 py-6">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-muted">QR insights</p>
        <h2 className="text-3xl font-semibold text-primary">Share your menu with customers instantly</h2>
        <p className="max-w-2xl text-sm leading-6 text-muted">Generate a modern QR code, share the live menu link, and track engagement from a single place.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-8">
            <div className="mb-6 rounded-[28px] bg-slate-50 p-8 text-center">
              <div className="mx-auto flex h-56 w-56 items-center justify-center rounded-[24px] bg-white shadow-soft">
                <span className="text-2xl font-semibold tracking-[0.2em] text-slate-500">QR</span>
              </div>
            </div>
            <div className="space-y-4 text-center">
              <p className="text-sm font-medium text-primary">Scan to view the live restaurant menu</p>
              <p className="text-sm leading-6 text-muted">Embed this code on receipts, tables, or digital screens to let guests order instantly.</p>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button variant="ghost">Download</Button>
              <Button variant="ghost">Copy link</Button>
              <Button>Share</Button>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="p-8">
            <div className="rounded-[28px] bg-gradient-to-br from-primary/10 to-white p-6 text-center shadow-soft">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-accent text-lg shadow-card">📱</div>
              <h3 className="text-xl font-semibold text-primary">Live menu preview</h3>
              <p className="mt-3 text-sm leading-6 text-muted">Customers tap, scan, and browse your menu on mobile instantly.</p>
            </div>
            <div className="mt-8 grid gap-3">
              {['Instant scan', 'Branded menu experience', 'Easy sharing', 'Real-time updates'].map((item) => (
                <div key={item} className="rounded-3xl border border-border bg-slate-50 px-4 py-4 text-sm text-primary">
                  {item}
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
