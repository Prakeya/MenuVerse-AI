import React from 'react'
import { Switch, Route, Router as WouterRouter, Link, useLocation } from 'wouter'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { AuthProvider, useAuth } from './lib/auth'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import MenuPage from './pages/MenuPage'
import NotFound from './pages/NotFound'
import Confirmation from './pages/Confirmation'
import KitchenDisplay from './pages/KitchenDisplay'
import Overview from './pages/dashboard/Overview'
import MenuPageDash from './pages/dashboard/MenuPage'
import OrdersPage from './pages/dashboard/OrdersPage'
import AnalyticsPage from './pages/dashboard/AnalyticsPage'
import ImportPage from './pages/dashboard/ImportPage'
import QrPage from './pages/dashboard/QrPage'
import SettingsPage from './pages/dashboard/SettingsPage'
import TablesPage from './pages/dashboard/TablesPage'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
})

function Header() {
  const { user, signOut } = useAuth()
  const [, navigate] = useLocation()

  return (
    <header className="site-header border-b border-[#ECECEC] py-4 mb-6">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#E5484D] text-white text-base font-semibold">M</div>
          <div>
            <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[#84848C]">MenuVerse</p>
            <h1 className="text-base font-semibold text-[#14141A]">Restaurant OS</h1>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-2 text-sm font-medium">
          <Link href="/dashboard" className="rounded-full px-4 py-2 text-[#14141A] hover:bg-[#F7F5F5] transition no-underline">Dashboard</Link>
          <Link href="/dashboard/menu" className="rounded-full px-4 py-2 text-[#14141A] hover:bg-[#F7F5F5] transition no-underline">Menu</Link>
          <Link href="/dashboard/orders" className="rounded-full px-4 py-2 text-[#14141A] hover:bg-[#F7F5F5] transition no-underline">Orders</Link>
          <Link href="/kitchen" className="rounded-full px-4 py-2 text-[#14141A] hover:bg-[#F7F5F5] transition no-underline">Kitchen</Link>
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:block text-xs text-[#84848C]">{user.name}</span>
              <button
                onClick={async () => { await signOut(); navigate('/signin') }}
                className="rounded-full border border-[#ECECEC] bg-white px-4 py-2 text-xs font-semibold text-[#14141A] hover:bg-[#FAFAFA] transition"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link href="/signin" className="rounded-full bg-[#E5484D] px-4 py-2 text-xs font-semibold text-white hover:brightness-95 transition no-underline">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation()
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <div className="grid gap-8 xl:grid-cols-[280px_1fr]">
        <Sidebar />
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={location}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

function AppRoutes() {
  return (
    <Switch>
      <Route path="/signin" component={SignIn} />
      <Route path="/menu/:restaurantId" component={MenuPage} />
      <Route path="/kitchen" component={KitchenDisplay} />
      <Route path="/confirmation" component={Confirmation} />
      <Route path="/dashboard/menu">
        {() => <><Header /><DashboardLayout><MenuPageDash /></DashboardLayout></>}
      </Route>
      <Route path="/dashboard/orders">
        {() => <><Header /><DashboardLayout><OrdersPage /></DashboardLayout></>}
      </Route>
      <Route path="/dashboard/analytics">
        {() => <><Header /><DashboardLayout><AnalyticsPage /></DashboardLayout></>}
      </Route>
      <Route path="/dashboard/import">
        {() => <><Header /><DashboardLayout><ImportPage /></DashboardLayout></>}
      </Route>
      <Route path="/dashboard/qr">
        {() => <><Header /><DashboardLayout><QrPage /></DashboardLayout></>}
      </Route>
      <Route path="/dashboard/settings">
        {() => <><Header /><DashboardLayout><SettingsPage /></DashboardLayout></>}
      </Route>
      <Route path="/dashboard/tables">
        {() => <><Header /><DashboardLayout><TablesPage /></DashboardLayout></>}
      </Route>
      <Route path="/dashboard">
        {() => <><Header /><DashboardLayout><Overview /></DashboardLayout></>}
      </Route>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <AppRoutes />
        </WouterRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
