import axios from 'axios'
import type { MenuItem, Order, Analytics } from '../types/api'
import { getSession } from 'next-auth/react'

// Use the local Next.js proxy endpoint so browser requests are same-origin
const client = axios.create({ baseURL: '/api', headers: { 'Content-Type': 'application/json' } })

async function resolveRestaurantId(restaurantId?: string) {
  if (restaurantId) return restaurantId
  try {
    const session = await getSession()
    if (session?.user) return (session.user as any).restaurantId
    // Fallback for local development when no auth session is present
    return process.env.NEXT_PUBLIC_DEFAULT_RESTAURANT || 'rest_1'
  } catch (err) {
    return process.env.NEXT_PUBLIC_DEFAULT_RESTAURANT || 'rest_1'
  }
}

export const api = {
  // Menu
  async getMenu(restaurantId?: string): Promise<MenuItem[]> {
    const rid = await resolveRestaurantId(restaurantId)
    console.log('[API] getMenu request for restaurant:', rid)
    if (!rid) return []
    const res = await client.get(`/menu/${rid}`)
    console.log('[API] raw getMenu response:', res.data)

    // Normalize response shapes to MenuItem[]
    const payload = res.data
    let items: any[] = []
    if (Array.isArray(payload)) {
      items = payload
    } else if (payload && typeof payload === 'object') {
      if (Array.isArray(payload.menu)) items = payload.menu
      else if (Array.isArray(payload.items)) items = payload.items
      else if (Array.isArray(payload.data)) items = payload.data
      else if (Array.isArray(payload.item)) items = payload.item
      else if (Array.isArray(payload.result)) items = payload.result
      else if (payload.item && typeof payload.item === 'object') items = [payload.item]
      else items = []
    }

    console.log('[API] normalized menu items length:', items.length)
    return items as MenuItem[]
  },
  async createMenu(item: Partial<MenuItem>): Promise<MenuItem> {
    const rid = await resolveRestaurantId(item.restaurant_id)
    if (!rid) throw new Error('Missing restaurant id')
    const payload = { ...item }
    console.log('[API] createMenu request:', { rid, payload })
    const res = await client.post(`/menu/${rid}`, payload)
    console.log('[API] createMenu response:', res.data)
    return res.data.item as MenuItem
  },
  async updateMenu(item: Partial<MenuItem> & { item_id: string }): Promise<MenuItem> {
    const rid = await resolveRestaurantId(item.restaurant_id)
    if (!rid) throw new Error('Missing restaurant id')
    const payload = { ...item }
    console.log('[API] updateMenu request:', { rid, item_id: item.item_id, payload })
    const res = await client.put(`/menu/${rid}/${item.item_id}`, payload)
    console.log('[API] updateMenu response:', res.data)
    return res.data.item as MenuItem
  },
  async deleteMenu(item_id: string) {
    const rid = await resolveRestaurantId()
    if (!rid) throw new Error('Missing restaurant id')
    console.log('[API] deleteMenu request:', { rid, item_id })
    const res = await client.delete(`/menu/${rid}/${item_id}`)
    console.log('[API] deleteMenu response:', res.data)
    return res.data
  },
  async toggleAvailability(item_id: string, available: boolean) {
    const rid = await resolveRestaurantId()
    if (!rid) throw new Error('Missing restaurant id')
    console.log('[API] toggleAvailability request:', { rid, item_id, available })
    const res = await client.patch(`/menu/${rid}/${item_id}`, { available })
    console.log('[API] toggleAvailability response:', res.data)
    return res.data
  },

  // Orders
  async getOrders(restaurantId?: string): Promise<Order[]> {
    const rid = await resolveRestaurantId(restaurantId)
    if (!rid) return []
    console.log('[API] getOrders request for restaurant:', rid)
    const res = await client.get(`/orders/${rid}`)
    console.log('[API] getOrders response:', res.data)
    return res.data as Order[]
  },
  async postOrder(payload: Partial<Order>) {
    const rid = await resolveRestaurantId((payload as any).restaurant_id)
    if (!rid) throw new Error('Missing restaurant id')
    const p = { ...(payload as any) }
    console.log('[API] postOrder request:', { rid, p })
    const res = await client.post(`/orders/${rid}`, p)
    console.log('[API] postOrder response:', res.data)
    return res.data
  },

  // Analytics
  async getAnalytics(restaurantId?: string): Promise<Analytics> {
    const rid = await resolveRestaurantId(restaurantId)
    if (!rid) return {} as Analytics
    // return popular analytics for now
    console.log('[API] getAnalytics request for restaurant:', rid)
    const res = await client.get(`/analytics/${rid}/popular`)
    console.log('[API] getAnalytics response:', res.data)
    return res.data as Analytics
  },

  // Views
  async postView(payload: { item_id: string; restaurant_id: string }) {
    const rid = await resolveRestaurantId(payload.restaurant_id)
    if (!rid) throw new Error('Missing restaurant id')
    console.log('[API] postView request:', { rid, item_id: payload.item_id })
    const res = await client.post(`/analytics/${rid}/${payload.item_id}`)
    console.log('[API] postView response:', res.data)
    return res.data
  }
}

export default api
