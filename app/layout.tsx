import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Anton, DM_Sans } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/auth-provider'
import { CartProvider } from '@/components/cart-provider'
import { ToastProvider } from '@/components/toast-provider'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

const anton = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-anton',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'VOLT — Tienda deportiva',
  description:
    'VOLT: ropa y equipamiento deportivo para entrenar al máximo. Envíos a todo el país y pago con Mercado Pago.',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#101014',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es-AR" className={`${anton.variable} ${dmSans.variable}`}>
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