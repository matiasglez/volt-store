'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useRouter } from 'next/navigation'
import { api, clearTokens, getAccessToken, setTokens } from '@/lib/api'

const EMAIL_KEY = 'nova_email'

interface AuthContextValue {
  email: string | null
  isAuthenticated: boolean
  ready: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)
  const [authed, setAuthed] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setAuthed(!!getAccessToken())
    setEmail(window.localStorage.getItem(EMAIL_KEY))
    setReady(true)

    const onLogout = () => {
      setAuthed(false)
      setEmail(null)
      window.localStorage.removeItem(EMAIL_KEY)
      router.push('/login')
    }
    window.addEventListener('nova:logout', onLogout)
    return () => window.removeEventListener('nova:logout', onLogout)
  }, [router])

  const login = useCallback(async (mail: string, password: string) => {
    const tokens = await api.login(mail, password)
    setTokens(tokens)
    window.localStorage.setItem(EMAIL_KEY, mail)
    setEmail(mail)
    setAuthed(true)
  }, [])

  const register = useCallback(async (mail: string, password: string) => {
    await api.register(mail, password)
    // Auto-login after successful registration.
    const tokens = await api.login(mail, password)
    setTokens(tokens)
    window.localStorage.setItem(EMAIL_KEY, mail)
    setEmail(mail)
    setAuthed(true)
  }, [])

  const logout = useCallback(() => {
    clearTokens()
    window.localStorage.removeItem(EMAIL_KEY)
    setAuthed(false)
    setEmail(null)
    window.dispatchEvent(new CustomEvent('nova:cart-refresh'))
    router.push('/')
  }, [router])

  const value = useMemo(
    () => ({ email, isAuthenticated: authed, ready, login, register, logout }),
    [email, authed, ready, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
