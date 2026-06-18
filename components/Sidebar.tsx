'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function Sidebar() {
  const items = [
    { href: '/dashboard', label: 'Overview' },
    { href: '/dashboard/menu', label: 'Menu' },
    { href: '/dashboard/orders', label: 'Orders' },
    { href: '/dashboard/import', label: 'AI Import' },
    { href: '/dashboard/analytics', label: 'Analytics' },
    { href: '/dashboard/qr', label: 'QR' },
    { href: '/dashboard/settings', label: 'Settings' }
  ]
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="hidden md:block sidebar-hidden-mobile">
        <div className="sticky top-6 space-y-4 rounded-[20px] border border-border bg-surface p-4 shadow-card">
          <div className="mb-4 border-b border-border pb-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Workspace</p>
          </div>
          <nav className="space-y-1">
            {items.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                className="block rounded-full px-4 py-3 text-sm font-medium text-primary transition hover:bg-[#FAFAFA]"
              >
                {it.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="md:hidden">
        <button className="rounded-pill border border-border bg-white px-4 py-3 text-sm font-medium text-primary" onClick={() => setOpen(true)}>
          Open menu
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed inset-y-0 left-0 z-50 w-72 border-r border-border bg-white p-4 shadow-card"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="text-sm font-semibold text-primary">Menu</div>
                <button className="rounded-full p-2 text-muted" onClick={() => setOpen(false)}>
                  Close
                </button>
              </div>
              <nav className="space-y-2">
                {items.map((it) => (
                  <Link key={it.href} href={it.href} className="block rounded-[18px] px-4 py-3 text-sm font-medium text-primary transition hover:bg-[#FAFAFA]" onClick={() => setOpen(false)}>
                    {it.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
