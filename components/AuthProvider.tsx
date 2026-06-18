'use client'

import React, { createContext, useContext } from 'react'
import { useSession } from 'next-auth/react'

type AuthState = {
  user: { id: string; name: string; restaurantId: string } | null
  restaurantId: string | null
}

const AuthContext = createContext<AuthState>({ user: null, restaurantId: null })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()

  const restaurantId = session?.user ? (session.user as any).restaurantId : null

  const state: AuthState = {
    user: session?.user
      ? { id: (session.user as any).id, name: (session.user as any).name, restaurantId }
      : null,
    restaurantId
  }

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}

export default AuthProvider
