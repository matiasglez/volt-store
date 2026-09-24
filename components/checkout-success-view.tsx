'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { api } from '@/lib/api'
import type { Order } from '@/lib/types'
import { OrderStatusBadge } from '@/components/order-status-badge'
import { formatPrice } from '@/lib/format'
import { useAuth } from '@/components/auth-provider'

export function CheckoutSuccessView() {
  const params = useSearchParams()
  const { isAuthenticated, ready } = useAuth()
  const orderId =
    params.get('order_id') || params.get('external_reference') || null

  const [order, setOrder] = useState<Order | null>(null)
  const [polling, setPolling] = useState(false)

  useEffect(() => {
    if (!ready || !isAuthenticated || !orderId) return
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
  }, [ready, isAuthenticated, orderId])

  return (
    <main className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center sm:px-6">
      <div className="flex size-16 items-center justify-center rounded-full bg-emerald-600/12 text-emerald-700">
        <CheckCircle2 className="size-8" />
      </div>
      <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight">
        ¡Gracias por tu compra!
      </h1>
      <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
        Recibimos tu pago. La confirmación puede tardar unos instantes en
        acreditarse; vamos a actualizar el estado de tu pedido en breve.
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
