'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import useSWR, { useSWRConfig } from 'swr'
import { ArrowLeft, CreditCard, Loader2, RefreshCw } from 'lucide-react'
import { api, friendlyError } from '@/lib/api'
import { formatDate, formatPrice } from '@/lib/format'
import { OrderStatusBadge } from '@/components/order-status-badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useRequireAuth } from '@/hooks/use-require-auth'

export function OrderDetail({ id }: { id: string }) {
  const { allowed, ready } = useRequireAuth()
  const { mutate } = useSWRConfig()
  const { data: order, error, isLoading } = useSWR(
    allowed ? (['order', id] as const) : null,
    () => api.getOrder(id),
  )

  const [checking, setChecking] = useState(false)
  const [checkingDone, setCheckingDone] = useState(false)
  const [checkError, setCheckError] = useState<string | null>(null)

  const needsMpCheck =
    !!order &&
    order.status === 'PENDING' &&
    order.payment?.payment_method === 'MERCADOPAGO' &&
    !checkingDone

  // Al abrir un pedido pendiente con pago Mercado Pago, reconciliamos con la
  // API (sin depender de la redireccion de retorno) buscando por external_reference.
  useEffect(() => {
    if (!needsMpCheck || checking) return
    let active = true
    setChecking(true)
    setCheckError(null)

    const run = async () => {
      try {
        await api.confirmMercadoPago(order.id)
        await mutate(['order', id])
      } catch (e) {
        if (active) {
          setCheckError(friendlyError(e, 'Todavía no pudimos confirmar el pago.'))
        }
      } finally {
        if (active) {
          setChecking(false)
          setCheckingDone(true)
        }
      }
    }

    void run()
    return () => {
      active = false
    }
  }, [needsMpCheck, checking, order, id, mutate])

  const retryVerify = () => {
    setCheckingDone(false)
    setCheckError(null)
  }

  if (!ready || !allowed || isLoading) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="mt-6 h-72 w-full rounded-2xl" />
      </main>
    )
  }

  if (error || !order) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <p className="text-sm text-destructive">
          {friendlyError(error, 'No encontramos este pedido.')}
        </p>
        <Link href="/orders" className="mt-4 inline-block text-sm font-medium text-accent hover:underline">
          Volver a pedidos
        </Link>
      </main>
    )
  }

  const items = order.order_items ?? []

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 md:py-14">
      <Link
        href="/orders"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Pedidos
      </Link>

      <div className="overflow-hidden rounded-2xl border border-border/70 bg-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-5">
          <div>
            <h1 className="font-display text-2xl font-semibold">Pedido #{order.id}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{formatDate(order.created_on)}</p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        <ul className="divide-y divide-border px-6">
          {items.map((it) => {
            const name =
              it.product_name ??
              (typeof it.product === 'object' && it.product?.name ? it.product.name : 'Artículo')
            return (
              <li key={it.id} className="flex items-center justify-between gap-4 py-4">
                <div className="min-w-0">
                  <p className="truncate font-medium">{name}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {formatPrice(it.price)} × {it.quantity}
                  </p>
                </div>
                <span className="font-medium tabular-nums">{formatPrice(it.cost)}</span>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center justify-between border-t border-border px-6 py-5">
          <span className="font-medium">Total</span>
          <span className="font-display text-2xl font-semibold tabular-nums">
            {formatPrice(order.total_cost)}
          </span>
        </div>

        {order.status === 'PENDING' && (
          <div className="border-t border-border bg-secondary/40 px-6 py-5">
            <Link
              href={`/checkout?order_id=${order.id}`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
            >
              <CreditCard className="size-4" />
              Pagar este pedido
            </Link>

            {order.payment?.payment_method === 'MERCADOPAGO' && (
              <div className="mt-3">
                <button
                  onClick={retryVerify}
                  disabled={checking}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-60"
                >
                  {checking ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Verificando pago…
                    </>
                  ) : (
                    <>
                      <RefreshCw className="size-4" />
                      Verificar pago
                    </>
                  )}
                </button>
                {checkError && (
                  <p className="mt-3 rounded-xl border border-destructive/25 bg-destructive/5 p-3 text-xs leading-relaxed text-destructive">
                    {checkError}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
