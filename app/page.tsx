import Link from 'next/link'
import { ArrowRight, Zap } from 'lucide-react'
import { FeaturedProducts } from '@/components/featured-products'

export default function HomePage() {
  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-4 pt-12 sm:px-6 md:grid-cols-2 md:gap-8 md:pt-20 lg:pb-12">
          <div className="relative z-10 max-w-xl">
            <p className="flex items-center gap-2 font-display text-lg uppercase tracking-widest text-accent">
              <Zap className="size-4 fill-current" />
              Volt · Temporada 2026
            </p>
            <h1 className="mt-4 text-balance font-display text-6xl font-normal uppercase leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
              Entrená
              <br />
              con <span className="text-accent">intensidad</span>
            </h1>
            <p className="mt-5 max-w-md text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Equipamiento, calzado y accesorios para dar el máximo en cada
              sesión. Creá tu cuenta, sumá al carrito y pagá en modo demo sin
              salir de la tienda.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/85"
              >
                Comprar ahora
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
              <div className="absolute inset-0 bg-[linear-gradient(150deg,oklch(0.88_0.24_113/0.9)_0%,oklch(0.12_0.01_60)_45%,oklch(0.17_0.01_60)_100%)]" />
              <div className="absolute inset-0 bg-[repeating-linear-gradient(115deg,transparent_0_24px,oklch(0.88_0.24_113/0.16)_24px_25px)]" />
              <div className="absolute inset-x-0 bottom-8 flex flex-col items-center gap-3 text-center">
                <span className="font-display text-[11rem] font-normal uppercase leading-none tracking-tight text-background/90">
                  VOLT
                </span>
                <span className="rounded-full bg-primary px-4 py-1.5 font-display text-[0.65rem] uppercase tracking-[0.3em] text-primary-foreground">
                  Sports
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FeaturedProducts />
    </main>
  )
}