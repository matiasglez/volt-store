'use client'

import Link from 'next/link'
import useSWR from 'swr'
import { ChevronRight, Package, ReceiptText } from 'lucide-react'
import { api, friendlyError } from '@/lib/api'
import type { Order } from '@/lib/types'
import { formatDate, formatPrice } from '@/lib/format'
import { OrderStatusBadge } from '@/components/order-status-badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useRequireAuth } from '@/hooks/use-require-auth'

function normalize(data: unknown): Order[] {
  if (Array.isArray(data)) return data as Order[]
  if (data && typeof data === 'object' && 'results' in data) {
    return (data as { results: Order[] }).results ?? []
  }
  return []
}

export function OrdersView() {
  const { allowed, ready } = useRequireAuth()
  const { data, error, isLoading } = useSWR(
    allowed ? 'orders' : null,
    () => api.getOrders(),
  )

  if (!ready || !allowed) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Skeleton className="h-8 w-40" />
        <div className="mt-8 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      </main>
    )
  }

  const orders = normalize(data)

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 md:py-14">
      <p className="text-sm uppercase tracking-widest text-accent">Mi cuenta</p>
      <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">Pedidos</h1>

      {isLoading ? (
        <div className="mt-8 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <p className="mt-8 rounded-lg border border-destructive/25 bg-destructive/5 px-4 py-6 text-center text-sm text-destructive">
          {friendlyError(error)}
        </p>
      ) : orders.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border py-20 text-center">
          <Package className="size-9 text-muted-foreground" />
          <div>
            <p className="font-medium">Todavía no tenés pedidos</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Cuando hagas tu primera compra, va a aparecer acá.
            </p>
          </div>
          <Link
            href="/products"
            className="mt-2 inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/85"
          >
            Ver productos
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {orders.map((order) => {
            const items = order.order_items ?? []
            const count = items.reduce((n, i) => n + i.quantity, 0)
            return (
              <li key={order.id}>
                <Link
                  href={`/orders/${order.id}`}
                  className="group flex items-center gap-4 rounded-2xl border border-border/70 bg-card p-5 transition-colors hover:border-accent/40"
                >
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground">
                    <ReceiptText className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-display text-lg font-semibold">#{order.id}</p>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {formatDate(order.created_on)} · {count}{' '}
                      {count === 1 ? 'artículo' : 'artículos'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-lg font-semibold tabular-nums">
                      {formatPrice(order.total_cost)}
                    </p>
                    {order.status === 'PENDING' && (
                      <span className="text-xs font-medium text-accent">Pagar ahora</span>
                    )}
                  </div>
                  <ChevronRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </main>
  )
}
