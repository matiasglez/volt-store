'use client'

import Link from 'next/link'
import useSWR from 'swr'
import { ArrowRight } from 'lucide-react'
import { api, friendlyError } from '@/lib/api'
import { ProductCard, ProductCardSkeleton } from '@/components/product-card'

export function FeaturedProducts() {
  const { data, error, isLoading } = useSWR('products:featured', () =>
    api.getProducts({ page: 1 }),
  )

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-widest text-accent">Selección</p>
          <h2 className="mt-2 font-display text-3xl font-normal uppercase tracking-tight sm:text-4xl">
            Lo nuevo para entrenar
          </h2>
        </div>
        <Link
          href="/products"
          className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-foreground"
        >
          Ver todo
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {error ? (
        <p className="rounded-lg border border-destructive/25 bg-destructive/5 px-4 py-6 text-center text-sm text-destructive">
          {friendlyError(error)}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : (data?.results ?? []).slice(0, 8).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
        </div>
      )}

      {!isLoading && !error && (data?.results?.length ?? 0) === 0 && (
        <p className="py-10 text-center text-sm text-muted-foreground">
          Todavía no hay productos publicados.
        </p>
      )}
    </section>
  )
}
