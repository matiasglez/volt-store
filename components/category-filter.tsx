'use client'

import useSWR from 'swr'
import { api } from '@/lib/api'
import type { Category } from '@/lib/types'
import { cn } from '@/lib/utils'

interface Props {
  selected: number | null
  onSelect: (id: number | null) => void
}

function flatten(cats: Category[], depth = 0): { cat: Category; depth: number }[] {
  const out: { cat: Category; depth: number }[] = []
  for (const c of cats) {
    out.push({ cat: c, depth })
    if (c.subcategories?.length) out.push(...flatten(c.subcategories, depth + 1))
  }
  return out
}

export function CategoryFilter({ selected, onSelect }: Props) {
  const { data, isLoading } = useSWR('categories', () => api.getCategories())
  const items = data ? flatten(data) : []

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          'rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors',
          selected === null
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        )}
      >
        Todos los productos
      </button>

      {isLoading &&
        Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="mx-1 my-1 h-4 animate-pulse rounded bg-muted/70" />
        ))}

      {items.map(({ cat, depth }) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          style={{ paddingLeft: `${0.75 + depth * 0.85}rem` }}
          className={cn(
            'rounded-lg py-2 pr-3 text-left text-sm transition-colors',
            selected === cat.id
              ? 'bg-accent/12 font-medium text-accent'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground',
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}

export function CategoryChips({ selected, onSelect }: Props) {
  const { data } = useSWR('categories', () => api.getCategories())
  const items = data ? flatten(data) : []

  return (
    <div className="flex snap-x gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          'shrink-0 snap-start rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
          selected === null
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-border text-muted-foreground hover:text-foreground',
        )}
      >
        Todos
      </button>
      {items.map(({ cat }) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={cn(
            'shrink-0 snap-start rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
            selected === cat.id
              ? 'border-accent bg-accent/12 text-accent'
              : 'border-border text-muted-foreground hover:text-foreground',
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}
