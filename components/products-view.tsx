'use client'

import { useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import useSWR from 'swr'
import { PackageOpen } from 'lucide-react'
import { api, friendlyError } from '@/lib/api'
import { ProductCard, ProductCardSkeleton } from '@/components/product-card'
import { CategoryFilter, CategoryChips } from '@/components/category-filter'
import { Pagination } from '@/components/pagination'

export function ProductsView() {
  const router = useRouter()
  const params = useSearchParams()

  const page = Math.max(1, Number(params.get('page')) || 1)
  const categoryParam = params.get('category_id')
  const categoryId = categoryParam ? Number(categoryParam) : null

  const { data, error, isLoading } = useSWR(
    ['products', page, categoryId] as const,
    () => api.getProducts({ page, category_id: categoryId ?? undefined }),
    { keepPreviousData: true },
  )

  const updateUrl = useCallback(
    (next: { page?: number; category_id?: number | null }) => {
      const q = new URLSearchParams(params.toString())
      if (next.page !== undefined) {
        if (next.page <= 1) q.delete('page')
        else q.set('page', String(next.page))
      }
      if (next.category_id !== undefined) {
        if (next.category_id === null) q.delete('category_id')
        else q.set('category_id', String(next.category_id))
        q.delete('page')
      }
      const qs = q.toString()
      router.push(`/products${qs ? `?${qs}` : ''}`, { scroll: false })
    },
    [params, router],
  )

  const onSelectCategory = (id: number | null) => updateUrl({ category_id: id })
  const onChangePage = (p: number) => {
    updateUrl({ page: p })
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const products = data?.results ?? []

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14">
      <header className="mb-8">
        <p className="text-sm uppercase tracking-widest text-accent">Catálogo</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Productos
        </h1>
      </header>

      <div className="md:hidden">
        <CategoryChips selected={categoryId} onSelect={onSelectCategory} />
      </div>

      <div className="mt-6 flex flex-col gap-8 md:flex-row md:gap-10">
        <aside className="hidden w-56 shrink-0 md:block">
          <div className="sticky top-24">
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Categorías
            </p>
            <CategoryFilter selected={categoryId} onSelect={onSelectCategory} />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          {error ? (
            <p className="rounded-lg border border-destructive/25 bg-destructive/5 px-4 py-6 text-center text-sm text-destructive">
              {friendlyError(error)}
            </p>
          ) : isLoading ? (
            <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-20 text-center">
              <PackageOpen className="size-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No encontramos productos en esta categoría.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              <div className="mt-12">
                <Pagination
                  page={page}
                  count={data?.count ?? 0}
                  onChange={onChangePage}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
