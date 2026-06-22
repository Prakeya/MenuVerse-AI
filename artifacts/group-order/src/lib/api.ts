import type { MenuItem, Order, Analytics, Session, RestaurantTable, LoyaltyProfile, RatingEntry, PromoResult } from '../types/api'

const BASE = `${import.meta.env.BASE_URL}api`

export const SSE_BASE = BASE

async function req<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    credentials: 'include',
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw Object.assign(new Error(err.error || res.statusText), { status: res.status })
  }
  return res.json()
}

export const api = {
  // Menu
  getMenu: (restaurantId: string) => req<MenuItem[]>('GET', `/menu/${restaurantId}`),
  createMenuItem: (restaurantId: string, data: Partial<MenuItem>) =>
    req<MenuItem>('POST', `/menu/${restaurantId}`, data),
  updateMenuItem: (restaurantId: string, itemId: string, data: Partial<MenuItem>) =>
    req<MenuItem>('PUT', `/menu/${restaurantId}/${itemId}`, data),
  deleteMenuItem: (restaurantId: string, itemId: string) =>
    req<{ ok: boolean }>('DELETE', `/menu/${restaurantId}/${itemId}`),
  toggleAvailability: (restaurantId: string, itemId: string, available: boolean) =>
    req<MenuItem>('PATCH', `/menu/${restaurantId}/${itemId}`, { available }),

  // Orders
  getOrders: (restaurantId: string) => req<Order[]>('GET', `/orders/${restaurantId}`),
  createOrder: (restaurantId: string, data: Partial<Order>) =>
    req<Order>('POST', `/orders/${restaurantId}`, data),
  updateOrderStatus: (restaurantId: string, orderId: string, status: string) =>
    req<Order>('PATCH', `/orders/${restaurantId}/${orderId}`, { status }),

  // Analytics
  getAnalytics: (restaurantId: string) => req<Analytics>('GET', `/analytics/${restaurantId}/popular`),
  trackView: (restaurantId: string, itemId: string) =>
    req<{ ok: boolean }>('POST', `/analytics/${restaurantId}/${itemId}`),

  // Auth
  signIn: (email: string, password: string) =>
    req<Session>('POST', '/auth/signin', { email, password }),
  getSession: () => req<Session>('GET', '/auth/session'),
  signOut: () => req<{ ok: boolean }>('POST', '/auth/signout'),

  // Tables
  getTables: (restaurantId: string) => req<RestaurantTable[]>('GET', `/tables/${restaurantId}`),
  createTable: (restaurantId: string, data: { table_number: string; seats?: number; label?: string }) =>
    req<RestaurantTable>('POST', `/tables/${restaurantId}`, data),
  updateTable: (restaurantId: string, tableId: string, data: Partial<RestaurantTable>) =>
    req<RestaurantTable>('PATCH', `/tables/${restaurantId}/${tableId}`, data),
  deleteTable: (restaurantId: string, tableId: string) =>
    req<{ ok: boolean }>('DELETE', `/tables/${restaurantId}/${tableId}`),

  // Loyalty
  loyaltyIdentify: (phone: string, restaurantId: string, name?: string) =>
    req<{ profile: LoyaltyProfile; returning: boolean }>('POST', '/loyalty/identify', { phone, restaurantId, name }),
  loyaltyGet: (restaurantId: string, phone: string) =>
    req<LoyaltyProfile>('GET', `/loyalty/${restaurantId}/${phone}`),
  loyaltySpend: (phone: string, restaurantId: string, amount: number) =>
    req<{ ok: boolean }>('POST', '/loyalty/spend', { phone, restaurantId, amount }),
  loyaltyLeaderboard: (restaurantId: string) =>
    req<LoyaltyProfile[]>('GET', `/loyalty/leaderboard/${restaurantId}`),

  // Ratings
  getRatings: (restaurantId: string) => req<RatingEntry[]>('GET', `/ratings/${restaurantId}`),
  submitRatings: (restaurantId: string, ratings: Array<{ item_id: string; rating: number; phone?: string }>) =>
    req<{ ok: boolean; count: number }>('POST', `/ratings/${restaurantId}`, { ratings }),

  // Promo
  validatePromo: (code: string) =>
    req<PromoResult>('POST', '/promo/validate', { code }),

  // AI
  aiDescribe: (name: string, category?: string) =>
    req<{ description: string }>('POST', '/ai/describe', { name, category }),
  aiChat: (restaurantId: string, message: string) =>
    req<{ reply: string }>('POST', '/ai/chat', { restaurantId, message }),
  aiImport: (restaurantId: string, text: string) =>
    req<{ imported: number; dishes: Array<{ name: string; price: number; category: string; description: string }> }>(
      'POST', '/ai/import', { restaurantId, text }
    ),
  aiCopilot: (restaurantId: string) =>
    req<{ stats: Record<string, number>; insights: Array<{ icon: string; title: string; desc: string; priority: string }> }>(
      'GET', `/ai/copilot/${restaurantId}`
    ),
}

export default api
