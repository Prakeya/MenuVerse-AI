'use client'

import { ReactNode } from 'react'
import { CartProvider, I18nProvider, ToastProvider } from '../lib/contexts'

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <CartProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </CartProvider>
    </I18nProvider>
  )
}