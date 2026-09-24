import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { FeaturedProducts } from '@/components/featured-products'

export default function HomePage() {
  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-4 pt-12 sm:px-6 md:grid-cols-2 md:gap-8 md:pt-20 lg:pb-12">
          <div className="relative z-10 max-w-xl">
            <p className="font-display text-lg font-medium text-accent">Nova Store</p>
            <h1 className="mt-4 text-balance font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Calidez para
              <br />
              tu casa
            </h1>
            <p className="mt-5 max-w-md text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Objetos y textiles de diseño, curados a mano y pensados para durar.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/85"
              >
                Ver productos
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Crear cuenta
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border/70 shadow-xl sm:aspect-square md:aspect-[4/5]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/hero.png"
                alt="Mesa de madera con textiles de lino, cerámicas y flores secas en una tienda cálida"
                className="size-full object-cover"
                fetchPriority="high"
              />
            </div>
          </div>
        </div>
      </section>

      <FeaturedProducts />
    </main>
  )
}
