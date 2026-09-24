'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, Loader2, RefreshCw } from 'lucide-react'
import { api, friendlyError } from '@/lib/api'
import type { Order } from '@/lib/types'
import { OrderStatusBadge } from '@/components/order-status-badge'
import { formatPrice } from '@/lib/format'
import { useAuth } from '@/components/auth-provider'

export function CheckoutSuccessView() {
  const params = useSearchParams()
  const { isAuthenticated, ready } = useAuth()
  const orderId =
    params.get('order_id') || params.get('external_reference') || null
  const paymentId = params.get('payment_id') || null

  const [order, setOrder] = useState<Order | null>(null)
  const [polling, setPolling] = useState(false)
  const [confirmed, setConfirmed] = useState(!orderId)
  const [confirming, setConfirming] = useState(false)
  const [confirmError, setConfirmError] = useState<string | null>(null)
  const [retry, setRetry] = useState(0)

  // Confirmación una sola vez al volver de Mercado Pago. Si no viene
  // payment_id, el backend busca el pago por external_reference.
  useEffect(() => {
    if (!ready || !isAuthenticated || !orderId || confirmed) return
    let active = true
    setConfirming(true)
    setConfirmError(null)

    const run = async () => {
      try {
        await api.confirmMercadoPago(Number(orderId), paymentId ?? undefined)
      } catch (e) {
        if (active) {
          setConfirmError(
            friendlyError(e, 'Todavía no pudimos confirmar el pago.'),
          )
        }
      } finally {
        if (active) {
          setConfirmed(true)
          setConfirming(false)
        }
      }
    }

    void run()
    return () => {
      active = false
    }
  }, [ready, isAuthenticated, orderId, paymentId, confirmed, retry])

  // Reintento manual si la confirmación falló.
  const retryConfirm = () => {
    setConfirmed(false)
    setRetry((r) => r + 1)
  }

  // Cargamos y poll de la orden (espera a que termine la confirmación).
  useEffect(() => {
    if (!ready || !isAuthenticated || !orderId || !confirmed) return
    let active = true
    let tries = 0
    setPolling(true)

    const poll = async () => {
      tries += 1
      try {
        const o = await api.getOrder(orderId)
        if (!active) return
        setOrder(o)
        if (o.status === 'PAID' || o.status === 'CANCELLED' || tries >= 5) {
          setPolling(false)
          return
        }
      } catch {
        if (tries >= 5) {
          setPolling(false)
          return
        }
      }
      if (active) setTimeout(poll, 3000)
    }
    void poll()
    return () => {
      active = false
    }
  }, [ready, isAuthenticated, orderId, confirmed])

  const isPending =
    order !== null && order.status === 'PENDING' && confirming === false

  return (
    <main className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center sm:px-6">
      <div className="flex size-16 items-center justify-center rounded-full bg-emerald-600/12 text-emerald-700">
        <CheckCircle2 className="size-8" />
      </div>
      <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight">
        ¡Gracias por tu compra!
      </h1>
      <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
        {confirming
          ? 'Estamos confirmando tu pago con Mercado Pago, un momento…'
          : 'Recibimos tu pago. La confirmación puede tardar unos instantes en acreditarse; vamos a actualizar el estado de tu pedido en breve.'}
      </p>

      {orderId && (
        <div className="mt-8 w-full rounded-2xl border border-border/70 bg-card p-6 text-left">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pedido</p>
              <p className="font-display text-lg font-semibold">#{orderId}</p>
            </div>
            {order ? (
              <OrderStatusBadge status={order.status} />
            ) : confirming ? (
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Loader2 className="size-3.5 animate-spin" />
                Confirmando
              </span>
            ) : polling ? (
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Loader2 className="size-3.5 animate-spin" />
                Verificando
              </span>
            ) : null}
          </div>
          {order && (
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="font-display text-xl font-semibold tabular-nums">
                {formatPrice(order.total_cost)}
              </span>
            </div>
          )}

          {isPending && (
            <div className="mt-5 flex flex-col gap-2 rounded-xl border border-amber-300/25 bg-amber-300/5 p-4 text-left">
              <p className="text-sm text-amber-300">
                Tu pago figura pendiente en Mercado Pago. Puede tardar unos
                minutos en acreditarse.
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={retryConfirm}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/85"
                >
                  <RefreshCw className="size-3.5" />
                  Reintentar confirmación
                </button>
                <Link
                  href="/orders"
                  className="text-xs font-medium text-accent hover:underline"
                >
                  Ver mis pedidos
                </Link>
              </div>
            </div>
          )}

          {confirmError && isPending && (
            <p className="mt-5 rounded-xl border border-destructive/25 bg-destructive/5 p-4 text-sm text-destructive">
              {confirmError}
            </p>
          )}
        </div>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {orderId && (
          <Link
            href={`/orders/${orderId}`}
            className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/85"
          >
            Ver mi pedido
          </Link>
        )}
        <Link
          href="/products"
          className="inline-flex items-center rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          Seguir comprando
        </Link>
      </div>
    </main>
  )
}