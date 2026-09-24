import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Fraunces, DM_Sans } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/auth-provider'
import { CartProvider } from '@/components/cart-provider'
import { ToastProvider } from '@/components/toast-provider'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['opsz'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Nova Store — Objetos con calidez para tu casa',
  description:
    'Nova Store: tienda de objetos y textiles de diseño cálido. Envíos a todo el país y pago con Mercado Pago.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#1A1A1A',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es-AR" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body className="font-sans antialiased">
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <div className="flex min-h-dvh flex-col">
                <Navbar />
                <div className="flex-1">{children}</div>
                <Footer />
              </div>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
