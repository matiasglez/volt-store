'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { ShoppingBag, User, LogOut, Menu, X } from 'lucide-react'
import { useAuth } from './auth-provider'
import { useCart } from './cart-provider'
import { cn } from '@/lib/utils'

const links = [
  { href: '/products', label: 'Productos' },
  { href: '/orders', label: 'Pedidos' },
]

export function Navbar() {
  const pathname = usePathname()
  const { isAuthenticated, email, logout, ready } = useAuth()
  const { count } = useCart()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="group flex items-baseline gap-1.5" onClick={() => setOpen(false)}>
          <span className="font-display text-2xl font-semibold tracking-tight text-foreground">
            Nova
          </span>
          <span className="font-display text-2xl font-semibold tracking-tight text-accent">
            Store
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = pathname === l.href || pathname.startsWith(l.href + '/')
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {l.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <Link
            href="/cart"
            aria-label="Carrito"
            className="relative rounded-lg p-2 text-foreground transition-colors hover:bg-muted"
          >
            <ShoppingBag className="size-5" />
            {ready && count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-accent px-1 text-[0.65rem] font-semibold leading-none text-accent-foreground">
                {count}
              </span>
            )}
          </Link>

          <div className="hidden items-center gap-1.5 md:flex">
            {ready && isAuthenticated ? (
              <>
                <span className="max-w-[12rem] truncate rounded-md px-2 text-sm text-muted-foreground">
                  {email}
                </span>
                <button
                  onClick={logout}
                  aria-label="Cerrar sesión"
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <LogOut className="size-4" />
                  Salir
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/85"
              >
                <User className="size-4" />
                Iniciar sesión
              </Link>
            )}
          </div>

          <button
            className="rounded-lg p-2 text-foreground transition-colors hover:bg-muted md:hidden"
            aria-label="Menú"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border/70 bg-background md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-4 py-2 sm:px-6">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-3 text-sm font-medium text-foreground"
              >
                {l.label}
              </Link>
            ))}
            <div className="my-1 h-px bg-border" />
            {ready && isAuthenticated ? (
              <>
                <span className="truncate px-2 py-2 text-sm text-muted-foreground">{email}</span>
                <button
                  onClick={() => {
                    setOpen(false)
                    logout()
                  }}
                  className="inline-flex items-center gap-1.5 rounded-md px-2 py-3 text-left text-sm font-medium text-foreground"
                >
                  <LogOut className="size-4" />
                  Cerrar sesión
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-1.5 rounded-md px-2 py-3 text-sm font-medium text-accent"
              >
                <User className="size-4" />
                Iniciar sesión
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
