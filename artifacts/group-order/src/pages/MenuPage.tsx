import React from 'react'
import { useParams, useSearch } from 'wouter'
import RestaurantMenuClient from '../components/RestaurantMenuClient'

export default function MenuPage() {
  const params = useParams<{ restaurantId: string }>()
  const search = useSearch()
  const tableNumber = new URLSearchParams(search).get('table') ?? undefined
  return (
    <RestaurantMenuClient
      restaurantId={params.restaurantId || 'restaurant_001'}
      tableNumber={tableNumber}
    />
  )
}
