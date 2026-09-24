'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { api } from '@/lib/api'
import type { Cart } from '@/lib/types'
import { useAuth } from './auth-provider'

interface CartContextValue {
  cart: Cart | null
  count: number
  loading: boolean
  refresh: () => Promise<void>
}

const CartContext = createContext<CartContextValue | null>(null)

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, ready } = useAuth()
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.getCart()
      setCart(data)
    } catch {
      setCart(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!ready) return
    if (isAuthenticated) {
      void refresh()
    } else {
      setCart(null)
    }
  }, [ready, isAuthenticated, refresh])

  useEffect(() => {
    const handler = () => {
      // Refresh only when logged in; otherwise clear.
      void refresh()
    }
    window.addEventListener('nova:cart-refresh', handler)
    return () => window.removeEventListener('nova:cart-refresh', handler)
  }, [refresh])

  const count = useMemo(
    () => (cart?.items ?? []).reduce((n, i) => n + i.quantity, 0),
    [cart],
  )

  const value = useMemo(
    () => ({ cart, count, loading, refresh }),
    [cart, count, loading, refresh],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
