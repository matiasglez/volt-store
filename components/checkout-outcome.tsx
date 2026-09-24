'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { XCircle, Clock, type LucideIcon } from 'lucide-react'

interface OutcomeProps {
  icon: LucideIcon
  iconClass: string
  title: string
  message: string
  primaryHref: string
  primaryLabel: string
}

function Outcome({ icon: Icon, iconClass, title, message, primaryHref, primaryLabel }: OutcomeProps) {
  const params = useSearchParams()
  const orderId = params.get('order_id') || params.get('external_reference')

  return (
    <main className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center sm:px-6">
      <div className={`flex size-16 items-center justify-center rounded-full ${iconClass}`}>
        <Icon className="size-8" />
      </div>
      <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">{message}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href={orderId ? `${primaryHref}?order_id=${orderId}` : primaryHref}
          className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/85"
        >
          {primaryLabel}
        </Link>
        <Link
          href="/orders"
          className="inline-flex items-center rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          Ver mis pedidos
        </Link>
      </div>
    </main>
  )
}

export function CheckoutFailure() {
  return (
    <Suspense>
      <Outcome
        icon={XCircle}
        iconClass="bg-destructive/12 text-destructive"
        title="No pudimos procesar el pago"
        message="El pago fue rechazado o cancelado. Podés intentarlo nuevamente; tu pedido sigue reservado por unos minutos."
        primaryHref="/checkout"
        primaryLabel="Reintentar pago"
      />
    </Suspense>
  )
}

export function CheckoutPending() {
  return (
    <Suspense>
      <Outcome
        icon={Clock}
        iconClass="bg-accent/12 text-accent"
        title="Tu pago está pendiente"
        message="Mercado Pago está procesando tu pago. Cuando se acredite vas a ver el pedido como pagado. Podés revisar el estado desde tus pedidos."
        primaryHref="/checkout"
        primaryLabel="Ver estado del pago"
      />
    </Suspense>
  )
}
