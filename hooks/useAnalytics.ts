import useSWR from 'swr'
import api from '../lib/api'
import type { Analytics } from '../types/api'

export function useAnalytics(restaurantId?: string) {
  const key = restaurantId ? ['/analytics', restaurantId] : '/analytics'
  const { data, error, isLoading, mutate } = useSWR(key, () => api.getAnalytics(restaurantId))
  return {
    analytics: (data as Analytics | undefined) ?? null,
    isLoading,
    isError: !!error,
    mutate
  }
}

export default useAnalytics
