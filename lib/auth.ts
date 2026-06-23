import { NextAuthOptions } from 'next-auth'

export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: 'credentials',
      name: 'credentials',
      type: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (credentials?.email === 'admin@menuverse.ai' && credentials?.password === 'password123') {
          return { id: '1', email: 'admin@menuverse.ai', name: 'Admin' }
        }
        return null
      },
    },
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
}