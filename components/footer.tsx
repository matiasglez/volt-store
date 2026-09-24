import Link from 'next/link'
import { Coffee, GitBranch, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-charcoal text-ivory">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <p className="font-display text-2xl font-normal uppercase tracking-tight">
            Volt <span className="text-accent">Sports</span>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ivory/65">
            Ropa y equipamiento deportivo para entrenar al máximo. Probá el
            demo completo: registro, carrito y pago simulado.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 text-sm sm:grid-cols-4">
          <div className="flex flex-col gap-2.5">
            <span className="text-xs uppercase tracking-widest text-ivory/45">Tienda</span>
            <Link href="/products" className="text-ivory/80 transition-colors hover:text-accent">
              Productos
            </Link>
            <Link href="/cart" className="text-ivory/80 transition-colors hover:text-accent">
              Carrito
            </Link>
            <Link href="/orders" className="text-ivory/80 transition-colors hover:text-accent">
              Pedidos
            </Link>
          </div>
          <div className="flex flex-col gap-2.5">
            <span className="text-xs uppercase tracking-widest text-ivory/45">Cuenta</span>
            <Link href="/login" className="text-ivory/80 transition-colors hover:text-accent">
              Iniciar sesión
            </Link>
            <Link href="/register" className="text-ivory/80 transition-colors hover:text-accent">
              Crear cuenta
            </Link>
          </div>
          <div className="flex flex-col gap-2.5">
            <span className="text-xs uppercase tracking-widest text-ivory/45">Pagos</span>
            <span className="text-ivory/80">Mercado Pago</span>
            <span className="text-ivory/80">Envíos a todo el país</span>
          </div>
          <div className="flex flex-col gap-2.5">
            <span className="text-xs uppercase tracking-widest text-ivory/45">Contacto</span>
            <a
              href="mailto:matiasezequielgonzalez365@gmail.com"
              className="inline-flex items-center gap-1.5 break-all text-ivory/80 transition-colors hover:text-accent"
            >
              <Mail className="size-3.5 shrink-0" />
              matiasezequielgonzalez365@gmail.com
            </a>
            <a
              href="https://mpago.la/2TXqyzt"
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-flex w-fit items-center gap-2 rounded-full border border-ivory/20 px-3.5 py-2 text-xs font-medium text-ivory transition-colors hover:bg-ivory/10"
            >
              <Coffee className="size-3.5" />
              ¿Me pagás un cafecito?
            </a>
            <a
              href="https://github.com/matiasglez"
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-flex w-fit items-center gap-2 rounded-full border border-ivory/20 px-3.5 py-2 text-xs font-medium text-ivory transition-colors hover:bg-ivory/10"
            >
              <GitBranch className="size-3.5" />
              github.com/matiasglez
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-ivory/10">
        <div className="mx-auto max-w-6xl px-4 py-5 text-xs text-ivory/45 sm:px-6">
          © {new Date().getFullYear()} Volt Sports. Hecho en Argentina.
        </div>
      </div>
    </footer>
  )
}
