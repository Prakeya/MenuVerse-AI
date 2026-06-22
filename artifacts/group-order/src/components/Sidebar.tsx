import React, { useState } from 'react'
import { Link, useLocation } from 'wouter'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, UtensilsCrossed, ShoppingBag, Sparkles,
  BarChart2, QrCode, Settings, Menu, X, TableProperties, ChefHat
} from 'lucide-react'

const items = [
  { href: '/dashboard',           label: 'Overview',    icon: LayoutDashboard },
  { href: '/dashboard/menu',      label: 'Menu',        icon: UtensilsCrossed },
  { href: '/dashboard/orders',    label: 'Orders',      icon: ShoppingBag },
  { href: '/dashboard/tables',    label: 'Tables',      icon: TableProperties },
  { href: '/dashboard/import',    label: 'AI Import',   icon: Sparkles },
  { href: '/dashboard/analytics', label: 'Analytics',   icon: BarChart2 },
  { href: '/dashboard/qr',        label: 'QR Codes',    icon: QrCode },
  { href: '/dashboard/settings',  label: 'Settings',    icon: Settings },
]

const bottomItems = [
  { href: '/kitchen', label: 'Kitchen Display', icon: ChefHat },
]

function NavLink({ href, label, icon: Icon, onClick }: {
  href: string; label: string; icon: React.ElementType; onClick?: () => void
}) {
  const [location] = useLocation()
  const active = location === href || (href !== '/dashboard' && location.startsWith(href))
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-full px-4 py-3 text-sm font-medium transition no-underline ${
        active ? 'bg-[#FDEDEE] text-[#E5484D]' : 'text-[#14141A] hover:bg-[#FAFAFA]'
      }`}
    >
      <Icon size={16} className={active ? 'text-[#E5484D]' : 'text-[#84848C]'} />
      {label}
    </Link>
  )
}

export default function Sidebar() {
  const [open, setOpen] = useState(false)

  const SidebarContent = ({ onItemClick }: { onItemClick?: () => void }) => (
    <>
      <div className="mb-4 border-b border-[#ECECEC] pb-4">
        <p className="text-xs uppercase tracking-[0.2em] text-[#84848C]">Workspace</p>
      </div>
      <nav className="space-y-1 flex-1">
        {items.map((it) => <NavLink key={it.href} {...it} onClick={onItemClick} />)}
      </nav>
      <div className="mt-4 pt-4 border-t border-[#ECECEC] space-y-1">
        <p className="text-xs uppercase tracking-[0.2em] text-[#84848C] mb-2">Operations</p>
        {bottomItems.map((it) => <NavLink key={it.href} {...it} onClick={onItemClick} />)}
      </div>
    </>
  )

  return (
    <>
      <div className="hidden md:block">
        <div className="sticky top-6 flex flex-col rounded-[20px] border border-[#ECECEC] bg-white p-4 shadow-[0_12px_24px_rgba(20,20,26,0.08)]">
          <SidebarContent />
        </div>
      </div>

      <div className="md:hidden mb-4">
        <button
          className="flex items-center gap-2 rounded-full border border-[#ECECEC] bg-white px-4 py-3 text-sm font-medium text-[#14141A]"
          onClick={() => setOpen(true)}
        >
          <Menu size={16} /> Menu
        </button>
        <AnimatePresence>
          {open && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/40"
                onClick={() => setOpen(false)}
              />
              <motion.div
                initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25 }}
                className="fixed inset-y-0 left-0 z-50 w-72 border-r border-[#ECECEC] bg-white p-4 shadow-[0_12px_24px_rgba(20,20,26,0.08)] flex flex-col"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="text-sm font-semibold text-[#14141A]">MenuVerse</div>
                  <button className="rounded-full p-2 text-[#84848C] hover:bg-[#FAFAFA]" onClick={() => setOpen(false)}>
                    <X size={16} />
                  </button>
                </div>
                <SidebarContent onItemClick={() => setOpen(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
