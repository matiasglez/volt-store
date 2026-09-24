'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import { ArrowLeft, ImageOff, Minus, Plus, ShoppingBag, Loader2 } from 'lucide-react'
import { api, friendlyError, mediaUrl } from '@/lib/api'
import { formatPrice } from '@/lib/format'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/components/auth-provider'
import { useCart } from '@/components/cart-provider'
import { useToast } from '@/components/toast-provider'

export function ProductDetail({ id }: { id: string }) {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { refresh } = useCart()
  const { toast } = useToast()

  const { data: product, error, isLoading } = useSWR(['product', id] as const, () =>
    api.getProduct(id),
  )

  const [qty, setQty] = useState(1)
  const [adding, setAdding] = useState(false)

  if (isLoading) {
    return (
      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-10 sm:px-6 md:grid-cols-2 md:py-16">
        <Skeleton className="aspect-square rounded-2xl" />
        <div className="space-y-4 pt-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-full max-w-xs" />
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="text-sm text-destructive">{friendlyError(error, 'No encontramos este producto.')}</p>
        <Link href="/products" className="mt-4 inline-block text-sm font-medium text-accent underline-offset-4 hover:underline">
          Volver al catálogo
        </Link>
      </div>
    )
  }

  const img = mediaUrl(product.image)
  const out = product.stock < 1
  const maxQty = Math.max(1, product.stock)

  const handleAdd = async () => {
    if (!isAuthenticated) {
      router.push(`/login?next=${encodeURIComponent(`/products/${product.id}`)}`)
      return
    }
    setAdding(true)
    try {
      await api.addToCart(product.id, qty)
      await refresh()
      toast(`Agregaste ${qty} × ${product.name} al carrito.`)
    } catch (e) {
      toast(friendlyError(e, 'No pudimos agregar el producto.'), 'error')
    } finally {
      setAdding(false)
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 md:py-14">
      <Link
        href="/products"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Catálogo
      </Link>

      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-border/70 bg-secondary">
          {img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={img || '/placeholder.svg'} alt={product.name} className="size-full object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center text-muted-foreground">
              <ImageOff className="size-10" />
            </div>
          )}
        </div>

        <div className="flex flex-col pt-2">
          {product.category_name && (
            <span className="text-sm uppercase tracking-widest text-accent">
              {product.category_name}
            </span>
          )}
          <h1 className="mt-2 font-display text-4xl font-semibold leading-tight tracking-tight">
            {product.name}
          </h1>
          <p className="mt-4 font-display text-3xl font-semibold">
            {formatPrice(product.price)}
          </p>

          <div className="mt-3">
            {out ? (
              <Badge tone="danger">Sin stock</Badge>
            ) : product.stock <= 5 ? (
              <Badge tone="amber">Quedan {product.stock}</Badge>
            ) : (
              <Badge tone="success">En stock</Badge>
            )}
          </div>

          {product.description && (
            <p className="mt-6 text-pretty leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border border-border">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={out || qty <= 1}
                aria-label="Restar"
                className="inline-flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted disabled:opacity-40"
              >
                <Minus className="size-4" />
              </button>
              <span className="w-8 text-center text-sm font-medium tabular-nums">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                disabled={out || qty >= maxQty}
                aria-label="Sumar"
                className="inline-flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted disabled:opacity-40"
              >
                <Plus className="size-4" />
              </button>
            </div>

            <button
              onClick={handleAdd}
              disabled={out || adding}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/85 disabled:pointer-events-none disabled:opacity-50 sm:flex-none"
            >
              {adding ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ShoppingBag className="size-4" />
              )}
              {out ? 'Sin stock' : 'Agregar al carrito'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
