export interface MenuItem {
  item_id: string
  restaurant_id: string
  name: string
  price: number
  category: string
  description: string
  image_url: string
  available: boolean
  badges?: string[]
  prep_time?: number
  ingredients?: string[]
  allergens?: string[]
  isSignatureDish?: boolean
  pairsWith?: string[]
}

export interface CartItem {
  item: MenuItem
  quantity: number
}

export interface Order {
  order_id: string
  items: CartItem[]
  total: number
  status: 'confirmed' | 'preparing' | 'ready' | 'completed'
  created_at: string
  prep_time_estimate: number
  table_id?: string
  customer_name?: string
}

export interface TranslationMap {
  [key: string]: string
}

export interface Restaurant {
  id: string
  name: string
  cuisine_type: string
  cover_image: string
  rating: number
  distance_km?: number
  address: string
  hours: string
  signature_dish?: MenuItem
  signature_dish_name?: string
  latitude: number
  longitude: number
}