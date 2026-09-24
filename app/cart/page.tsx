'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Loader2, ShoppingBag, Trash2 } from 'lucide-react'
import { api, friendlyError } from '@/lib/api'
import { formatPrice } from '@/lib/format'
import { useCart } from '@/components/cart-provider'
import { useToast } from '@/components/toast-provider'
import { useRequireAuth } from '@/hooks/use-require-auth'
import { Skeleton } from '@/components/ui/skeleton'

export default function CartPage() {
  const { allowed, ready } = useRequireAuth()
  const { cart, loading, refresh } = useCart()
  const { toast } = useToast()
  const router = useRouter()

  const [removing, setRemoving] = useState<string | null>(null)
  const [checkingOut, setCheckingOut] = useState(false)

  if (!ready || !allowed) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Skeleton className="h-8 w-40" />
        <div className="mt-8 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      </main>
    )
  }

  const items = cart?.items ?? []
  const empty = !loading && items.length === 0

  const handleRemove = async (productId: string) => {
    setRemoving(productId)
    try {
      await api.removeCartItem(productId)
      await refresh()
      toast('Producto eliminado del carrito.')
    } catch (e) {
      toast(friendlyError(e), 'error')
    } finally {
      setRemoving(null)
    }
  }

  const handleCheckout = async () => {
    setCheckingOut(true)
    try {
      const order = await api.checkout()
      await refresh()
      router.push(`/checkout?order_id=${order.id}`)
    } catch (e) {
      toast(friendlyError(e, 'No pudimos iniciar la compra.'), 'error')
      setCheckingOut(false)
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 md:py-14">
      <h1 className="font-display text-4xl font-semibold tracking-tight">Carrito</h1>

      {loading && !cart ? (
        <div className="mt-8 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : empty ? (
        <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border py-20 text-center">
          <ShoppingBag className="size-9 text-muted-foreground" />
          <div>
            <p className="font-medium">Tu carrito está vacío</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Equipate para tu próxima sesión.
            </p>
          </div>
          <Link
            href="/products"
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/85"
          >
            Ver productos
            <ArrowRight className="size-4" />
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem]">
          <ul className="divide-y divide-border rounded-2xl border border-border/70 bg-card">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 p-4 sm:p-5">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">{item.product.name}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {formatPrice(item.product.price)} · {item.quantity}{' '}
                    {item.quantity === 1 ? 'unidad' : 'unidades'}
                  </p>
                </div>
                <p className="font-display text-lg font-semibold tabular-nums">
                  {formatPrice(item.subtotal)}
                </p>
                <button
                  onClick={() => handleRemove(item.product.id)}
                  disabled={removing === item.product.id}
                  aria-label={`Eliminar ${item.product.name}`}
                  className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                >
                  {removing === item.product.id ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                </button>
              </li>
            ))}
          </ul>

          <aside className="h-fit rounded-2xl border border-border/70 bg-card p-6 lg:sticky lg:top-24">
            <h2 className="font-display text-xl font-semibold">Resumen</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <dt>Subtotal</dt>
                <dd className="tabular-nums">{formatPrice(cart?.total)}</dd>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <dt>Envío</dt>
                <dd>A calcular</dd>
              </div>
            </dl>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="font-medium">Total</span>
              <span className="font-display text-2xl font-semibold tabular-nums">
                {formatPrice(cart?.total)}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90 disabled:opacity-60"
            >
              {checkingOut ? <Loader2 className="size-4 animate-spin" /> : null}
              Finalizar compra
            </button>
            <Link
              href="/products"
              className="mt-3 block text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Seguir comprando
            </Link>
          </aside>
        </div>
      )}
    </main>
  )
}
