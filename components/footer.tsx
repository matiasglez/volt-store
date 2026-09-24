import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-charcoal text-ivory">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <p className="font-display text-2xl font-semibold">
            Nova <span className="text-accent">Store</span>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ivory/65">
            Objetos y textiles de diseño cálido para tu casa. Curados a mano,
            pensados para durar.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 text-sm sm:grid-cols-3">
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
        </div>
      </div>
      <div className="border-t border-ivory/10">
        <div className="mx-auto max-w-6xl px-4 py-5 text-xs text-ivory/45 sm:px-6">
          © {new Date().getFullYear()} Nova Store. Hecho en Argentina.
        </div>
      </div>
    </footer>
  )
}
