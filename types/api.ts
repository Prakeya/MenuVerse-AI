export type MenuItem = {
  item_id: string
  restaurant_id: string
  name: string
  price: number
  category: string
  description?: string
  available: boolean
  image_url?: string
}

export type Order = {
  order_id: string
  status: string
  items: Array<{ item_id: string; quantity: number; name?: string; price?: number }>
  amount?: number
  created_at?: string
}

export type Analytics = {
  totalViews: number
  popularDishes: Array<{ item_id: string; name: string; views: number }>
  peakHour: string
}
