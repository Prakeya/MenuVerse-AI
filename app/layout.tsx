import './globals.css'
import React from 'react'
import Sidebar from '../components/Sidebar'
import Providers from '../components/Providers'
import PageTransition from '../components/PageTransition'

export const metadata = {
  title: 'MenuVerse AI',
  description: 'AI-powered restaurant operating system'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-primary min-h-screen antialiased">
        <Providers>
          <header className="site-header border-b border-border py-4 mb-6">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-accent text-white text-lg font-semibold">
                  M
                </div>
                <div>
                  <p className="text-sm font-semibold tracking-[0.14em] uppercase text-muted">MenuVerse</p>
                  <h1 className="text-xl font-semibold text-primary">Restaurant OS</h1>
                </div>
              </div>
              <nav className="hidden md:flex items-center gap-3 text-sm font-medium text-muted">
                <a href="/dashboard" className="rounded-full px-4 py-2 text-primary hover:bg-[#F7F5F5]">Dashboard</a>
                <a href="/dashboard/menu" className="rounded-full px-4 py-2 text-primary hover:bg-[#F7F5F5]">Menu</a>
                <a href="/dashboard/orders" className="rounded-full px-4 py-2 text-primary hover:bg-[#F7F5F5]">Orders</a>
              </nav>
            </div>
          </header>

          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid gap-8 xl:grid-cols-[280px_1fr]">
              <Sidebar />
              <main className="flex-1">
                <PageTransition>{children}</PageTransition>
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
