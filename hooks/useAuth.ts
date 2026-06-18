import { useContext } from 'react'
import { AuthProvider, useAuth as _useAuth } from '../components/AuthProvider'

export { AuthProvider }

export function useAuth() {
  return _useAuth()
}

export default useAuth
