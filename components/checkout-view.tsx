'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import useSWR from 'swr'
import { Clock, Loader2, ShieldCheck } from 'lucide-react'
import { api, friendlyError } from '@/lib/api'
import { formatPrice } from '@/lib/format'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/toast-provider'
import { useRequireAuth } from '@/hooks/use-require-auth'
import { OrderStatusBadge } from '@/components/order-status-badge'

function Countdown({ expiresAt }: { expiresAt: string }) {
  const [left, setLeft] = useState(() => Date.parse(expiresAt) - Date.now())

  useEffect(() => {
    const t = setInterval(() => setLeft(Date.parse(expiresAt) - Date.now()), 1000)
    return () => clearInterval(t)
  }, [expiresAt])

  if (Number.isNaN(Date.parse(expiresAt))) return null

  if (left <= 0) {
    return (
      <Badge tone="danger">
        <Clock className="size-3" />
        Reserva vencida
      </Badge>
    )
  }

  const mins = Math.floor(left / 60000)
  const secs = Math.floor((left % 60000) / 1000)
  return (
    <Badge tone="amber">
      <Clock className="size-3" />
      Reservado por {mins}:{String(secs).padStart(2, '0')}
    </Badge>
  )
}

export function CheckoutView() {
  const { allowed, ready } = useRequireAuth()
  const params = useSearchParams()
  const orderId = params.get('order_id')
  const { toast } = useToast()
  const [paying, setPaying] = useState(false)

  const { data: order, error, isLoading } = useSWR(
    allowed && orderId ? (['order', orderId] as const) : null,
    () => api.getOrder(orderId as string),
  )

  const handlePay = async () => {
    if (!order) return
    setPaying(true)
    try {
      const payment = await api.createPayment(order.id)
      if (payment.init_point) {
        window.location.href = payment.init_point
      } else {
        toast('No recibimos el enlace de pago. Intentá de nuevo.', 'error')
        setPaying(false)
      }
    } catch (e) {
      toast(friendlyError(e, 'No pudimos iniciar el pago.'), 'error')
      setPaying(false)
    }
  }

  if (!ready || !allowed) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-6 h-64 w-full rounded-2xl" />
      </main>
    )
  }

  if (!orderId) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <p className="text-sm text-muted-foreground">No hay ningún pedido para pagar.</p>
        <Link href="/cart" className="mt-4 inline-block text-sm font-medium text-accent hover:underline">
          Volver al carrito
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 md:py-16">
      <p className="text-sm uppercase tracking-widest text-accent">Finalizar compra</p>
      <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">Tu pedido</h1>

      {isLoading ? (
        <Skeleton className="mt-8 h-64 w-full rounded-2xl" />
      ) : error || !order ? (
        <p className="mt-8 rounded-lg border border-destructive/25 bg-destructive/5 px-4 py-6 text-center text-sm text-destructive">
          {friendlyError(error, 'No encontramos este pedido.')}
        </p>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-border/70 bg-card">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
            <div>
              <p className="text-sm text-muted-foreground">Pedido</p>
              <p className="font-display text-lg font-semibold">#{order.id}</p>
            </div>
            <div className="flex items-center gap-2">
              {order.expires_at && order.status === 'PENDING' && (
                <Countdown expiresAt={order.expires_at} />
              )}
              <OrderStatusBadge status={order.status} />
            </div>
          </div>

          <ul className="divide-y divide-border px-6">
            {order.order_items.map((it) => (
              <li key={it.id} className="flex items-center justify-between gap-4 py-4 text-sm">
                <span className="text-muted-foreground">
                  {typeof it.product === 'object' && it.product?.name
                    ? it.product.name
                    : `Artículo`}{' '}
                  <span className="text-foreground">× {it.quantity}</span>
                </span>
                <span className="font-medium tabular-nums">{formatPrice(it.cost)}</span>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between border-t border-border px-6 py-5">
            <span className="font-medium">Total</span>
            <span className="font-display text-2xl font-semibold tabular-nums">
              {formatPrice(order.total_cost)}
            </span>
          </div>

          <div className="border-t border-border bg-secondary/40 px-6 py-6">
            {order.status === 'PENDING' ? (
              <>
                <button
                  onClick={handlePay}
                  disabled={paying}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90 disabled:opacity-60"
                >
                  {paying ? <Loader2 className="size-4 animate-spin" /> : null}
                  Pagar con Mercado Pago
                </button>
                <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <ShieldCheck className="size-3.5" />
                  Pago protegido. Te redirigimos a Mercado Pago.
                </p>
              </>
            ) : (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Este pedido ya no está pendiente de pago.
                </p>
                <Link
                  href={`/orders/${order.id}`}
                  className="mt-3 inline-block text-sm font-medium text-accent hover:underline"
                >
                  Ver detalle del pedido
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
