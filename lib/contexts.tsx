'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { CartItem, MenuItem, Order } from './types'
import { MOCK_DISHES } from './mockData'

// === CART CONTEXT ===
interface CartContextType {
  cart: CartItem[]
  addToCart: (item: MenuItem, qty?: number) => void
  updateQty: (itemId: string, qty: number) => void
  removeFromCart: (itemId: string) => void
  clearCart: () => void
  cartCount: number
  subtotal: number
}

const CartContext = createContext<CartContextType>({} as CartContextType)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])

  const addToCart = useCallback((item: MenuItem, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(c => c.item.item_id === item.item_id)
      if (existing) return prev.map(c => c.item.item_id === item.item_id ? { ...c, quantity: c.quantity + qty } : c)
      return [...prev, { item, quantity: qty }]
    })
  }, [])

  const updateQty = useCallback((itemId: string, qty: number) => {
    setCart(prev => qty <= 0 ? prev.filter(c => c.item.item_id !== itemId) : prev.map(c => c.item.item_id === itemId ? { ...c, quantity: qty } : c))
  }, [])

  const removeFromCart = useCallback((itemId: string) => setCart(prev => prev.filter(c => c.item.item_id !== itemId)), [])
  const clearCart = useCallback(() => setCart([]), [])

  const cartCount = cart.reduce((s, c) => s + c.quantity, 0)
  const subtotal = cart.reduce((s, c) => s + c.item.price * c.quantity, 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQty, removeFromCart, clearCart, cartCount, subtotal }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)

// === I18N CONTEXT ===
interface I18nContextType {
  lang: string
  setLang: (code: string) => void
  t: (text: string) => string
}

const I18nContext = createContext<I18nContextType>({} as I18nContextType)

const TRANSLATIONS: Record<string, Record<string, string>> = {
  es: { 'Taste. Order. Delight.': 'Saborea. Pide. Disfruta.', "I'm a Diner": 'Soy un Comensal', "I'm an Owner": 'Soy un Dueño', 'Scan your table QR': 'Escanea tu QR de mesa', 'Open demo menu directly': 'Abrir menú demo', 'All Dishes': 'Todos los Platos', 'Add to Order': 'Agregar al Pedido' },
  fr: { 'Taste. Order. Delight.': 'Goûtez. Commandez. Savourez.', "I'm a Diner": 'Je suis un Convive', "I'm an Owner": 'Je suis un Propriétaire', 'Scan your table QR': 'Scannez le QR de votre table', 'Open demo menu directly': 'Ouvrir le menu démo', 'All Dishes': 'Tous les Plats', 'Add to Order': 'Ajouter à la Commande' },
  hi: { 'Taste. Order. Delight.': 'स्वाद लें। ऑर्डर करें। आनंद लें।', "I'm a Diner": 'मैं एक ग्राहक हूं', "I'm an Owner": 'मैं एक मालिक हूं', 'Scan your table QR': 'अपना टेबल QR स्कैन करें', 'Open demo menu directly': 'डेमो मेन्यू खोलें', 'All Dishes': 'सभी व्यंजन', 'Add to Order': 'ऑर्डर में जोड़ें' },
  ar: { 'Taste. Order. Delight.': 'تذوق. اطلب. استمتع.', "I'm a Diner": 'أنا زبون', "I'm an Owner": 'أنا مالك', 'Scan your table QR': 'امسح QR الطاولة', 'Open demo menu directly': 'افتح القائمة التجريبية', 'All Dishes': 'جميع الأطباق', 'Add to Order': 'أضف إلى الطلب' },
  zh: { 'Taste. Order. Delight.': '品尝。下单。享受。', "I'm a Diner": '我是食客', "I'm an Owner": '我是店主', 'Scan your table QR': '扫描您桌子的二维码', 'Open demo menu directly': '直接打开演示菜单', 'All Dishes': '所有菜品', 'Add to Order': '添加到订单' },
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState('en')

  const t = useCallback((text: string) => {
    if (lang === 'en') return text
    return TRANSLATIONS[lang]?.[text] || text
  }, [lang])

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>
}

export const useI18n = () => useContext(I18nContext)

// === TOAST CONTEXT ===
interface ToastContextType {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void
}

const ToastContext = createContext<ToastContextType>({} as ToastContextType)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null)

  const showToast = useCallback((msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className="toast" style={{ borderLeft: `4px solid ${toast.type === 'success' ? '#10b981' : toast.type === 'error' ? '#ef4444' : '#F5A623'}` }}>
          <span style={{ fontSize: 18 }}>{toast.type === 'success' ? '✓' : toast.type === 'error' ? '✗' : 'ℹ'}</span>
          <span style={{ fontSize: 14, color: '#1a1a1a', flex: 1 }}>{toast.msg}</span>
          <button onClick={() => setToast(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: 16 }}>✕</button>
        </div>
      )}
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)