import useSWR from 'swr'
import api from '../lib/api'
import type { Order } from '../types/api'

export function useOrders(restaurantId?: string) {
  const key = restaurantId ? ['/orders', restaurantId] : '/orders'
  const { data, error, isLoading, mutate } = useSWR(key, () => api.getOrders(restaurantId))
  return {
    orders: (data as Order[] | undefined) ?? [],
    isLoading,
    isError: !!error,
    mutate
  }
}

export default useOrders
