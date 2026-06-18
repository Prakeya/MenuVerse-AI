import { useEffect } from 'react'
import useSWR from 'swr'
import api from '../lib/api'
import type { MenuItem } from '../types/api'

export function useMenu(restaurantId?: string) {
  const id = restaurantId || process.env.NEXT_PUBLIC_DEFAULT_RESTAURANT || 'rest_1'
  const key = `/menu/${id}`
  const { data, error, isLoading, mutate } = useSWR(key, () => api.getMenu(id))

  useEffect(() => {
    if (data) {
      console.log('[useMenu] fetched items via SWR:', data)
    }
    if (error) {
      console.error('[useMenu] fetch error:', error)
    }
  }, [data, error])

  return {
    items: (data as MenuItem[] | undefined) ?? [],
    isLoading,
    isError: !!error,
    mutate
  }
}

export default useMenu
