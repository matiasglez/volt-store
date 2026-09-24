import Link from 'next/link'
import { ImageOff } from 'lucide-react'
import type { Product } from '@/lib/types'
import { mediaUrl } from '@/lib/api'
import { formatPrice } from '@/lib/format'
import { Badge } from '@/components/ui/badge'

export function ProductCard({ product }: { product: Product }) {
  const img = mediaUrl(product.image)
  const out = product.stock < 1

  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-xl transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-square overflow-hidden rounded-xl border border-border/70 bg-secondary">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img || '/placeholder.svg'}
            alt={product.name}
            className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <ImageOff className="size-8" />
          </div>
        )}
        {out && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[1px]">
            <Badge tone="muted">Sin stock</Badge>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 px-1 pt-3">
        {product.category_name && (
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            {product.category_name}
          </span>
        )}
        <h3 className="text-[0.95rem] font-medium leading-snug text-foreground">
          {product.name}
        </h3>
        <p className="mt-1 font-display text-lg font-semibold text-foreground">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-square animate-pulse rounded-xl bg-muted/70" />
      <div className="space-y-2 px-1">
        <div className="h-3 w-1/3 animate-pulse rounded bg-muted/70" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted/70" />
        <div className="h-5 w-1/4 animate-pulse rounded bg-muted/70" />
      </div>
    </div>
  )
}
