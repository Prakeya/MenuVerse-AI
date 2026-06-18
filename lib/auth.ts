import CredentialsProvider from 'next-auth/providers/credentials'
import { NextAuthOptions } from 'next-auth'

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const email = credentials?.email
        const password = credentials?.password
        // Demo credentials
        if (email === 'admin@menuverse.ai' && password === 'password123') {
          return {
            id: 'owner_001',
            name: 'Demo Restaurant Owner',
            email: 'admin@menuverse.ai',
            restaurantId: 'restaurant_001'
          } as any
        }
        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // attach restaurantId and name to token
        token.user = {
          id: (user as any).id,
          restaurantId: (user as any).restaurantId,
          name: (user as any).name
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token && (token as any).user) {
        session.user = (token as any).user
      }
      return session
    }
  }
}

export default authOptions
