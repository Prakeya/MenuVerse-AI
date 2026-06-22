export type MenuItem = {
  item_id: string
  restaurant_id: string
  name: string
  price: number
  category: string
  description?: string | null
  available: boolean
  image_url?: string | null
  is_veg?: boolean | null
  spice_level?: string | null
  allergens?: string | null
  created_at?: string | null
  badges?: string[]
}

export type OrderItem = {
  item_id: string
  quantity: number
  name?: string | null
  price?: number | null
  notes?: string | null
}

export type Order = {
  order_id: string
  restaurant_id: string
  status: string
  items: OrderItem[]
  amount?: number | null
  table_number?: string | null
  notes?: string | null
  created_at?: string | null
}

export type Analytics = {
  totalViews: number
  popularDishes: Array<{ item_id: string; name: string; views: number }>
  peakHour: string
}

export type SessionUser = {
  id: string
  name: string
  email: string
  restaurantId: string
}

export type Session = {
  authenticated: boolean
  user?: SessionUser
}

export type RestaurantTable = {
  table_id: string
  restaurant_id: string
  table_number: string
  seats: number
  status: 'free' | 'occupied' | 'reserved'
  label?: string | null
  created_at?: string | null
}
