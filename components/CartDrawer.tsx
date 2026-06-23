'use client'

import { useRouter } from 'next/navigation'
import { useCart, useToast, useI18n } from '../lib/contexts'
import { Utensils, X, Minus, Plus, Hash, Percent, ArrowRight } from 'lucide-react'
import ImageWithFallback from './ImageWithFallback'

export default function CartDrawer({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const { cart, updateQty, removeFromCart, subtotal, placeOrder, cartCount } = useCart()
  const { showToast } = useToast()
  const { t, translateMenuItem } = useI18n()
  const total = subtotal

  const handleOrder = () => {
    if (cart.length === 0) return
    const order = placeOrder()
    if (order) {
      showToast(t('Order placed successfully! Your food is being prepared.'))
      onClose()
      router.push('/confirmation')
    }
  }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 98, background: 'rgba(0,0,0,0.4)' }} />
      <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 420, maxWidth: '90vw', zIndex: 99, background: 'white', boxShadow: '-8px 0 32px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }} className="animate-slide-right">
        <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{t('Your Order')}</h3>
            <span style={{ fontSize: 13, color: '#6b7280' }}>{cartCount} {t('item(s)')}</span>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} /></button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6b7280' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Utensils size={22} style={{ color: '#9ca3af' }} />
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a', marginBottom: 4 }}>{t('Your order is empty')}</div>
              <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>{t('Add a dish to get started')}</div>
            </div>
          ) : (
            cart.map(entry => (
              <div key={entry.item.item_id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
                <ImageWithFallback src={entry.item.image_url} alt={entry.item.name} style={{ width: 56, height: 56, borderRadius: 12, objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  {(() => { const tr = translateMenuItem(entry.item.item_id, entry.item.name, entry.item.description); return <><div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>{tr.name}</div><div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', marginTop: 2 }}>${(entry.item.price * entry.quantity).toFixed(2)}</div></> })()}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button onClick={() => updateQty(entry.item.item_id, entry.quantity - 1)} style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Minus size={14} />
                  </button>
                  <span style={{ fontSize: 14, fontWeight: 600, minWidth: 20, textAlign: 'center' }}>{entry.quantity}</span>
                  <button onClick={() => updateQty(entry.item.item_id, entry.quantity + 1)} style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Plus size={14} />
                  </button>
                </div>
                <button onClick={() => removeFromCart(entry.item.item_id)} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', display: 'flex' }}>
                  <X size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div style={{ padding: '16px 24px 24px', borderTop: '1px solid #e5e7eb' }}>
            <div style={{ position: 'relative', marginBottom: 12 }}>
              <input placeholder={t('Promo code')} style={{ width: '100%', padding: '10px 16px', borderRadius: 999, border: '1px solid #e5e7eb', fontSize: 13, outline: 'none', background: '#f9fafb' }} />
              <button style={{ position: 'absolute', right: 4, top: 4, padding: '6px 14px', borderRadius: 999, border: 'none', background: '#111', color: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{t('Apply')}</button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>
              <span>{t('Total')}</span><span>${total.toFixed(2)}</span>
            </div>
            <button onClick={handleOrder} style={{ marginTop: 12, width: '100%', padding: '16px', borderRadius: 999, border: 'none', background: '#111', color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {t('Place Order')}
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </>
  )
}