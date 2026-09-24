'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'

/**
 * Redirect to /login?next=<current> when the user is not authenticated.
 * Returns whether auth state has been resolved and the user is allowed.
 */
export function useRequireAuth() {
  const { isAuthenticated, ready } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (ready && !isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`)
    }
  }, [ready, isAuthenticated, router, pathname])

  return { ready, allowed: ready && isAuthenticated }
}
