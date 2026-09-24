'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { friendlyError } from '@/lib/api'
import { useAuth } from '@/components/auth-provider'
import { useToast } from '@/components/toast-provider'
import { Input } from '@/components/ui/input'

type Mode = 'login' | 'register'

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get('next') || '/products'
  const { login, register } = useAuth()
  const { toast } = useToast()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isRegister = mode === 'register'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (isRegister && password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }

    setLoading(true)
    try {
      if (isRegister) {
        await register(email, password)
        toast('¡Cuenta creada! Ya iniciaste sesión.')
      } else {
        await login(email, password)
        toast('¡Bienvenido de nuevo!')
      }
      router.push(next)
    } catch (err) {
      setError(friendlyError(err, 'No pudimos completar la operación.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-[70dvh] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      <div className="text-center">
        <h1 className="font-display text-4xl font-semibold tracking-tight">
          {isRegister ? 'Crear cuenta' : 'Iniciar sesión'}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {isRegister
            ? 'Sumate a VOLT para comprar y seguir tus pedidos.'
            : 'Ingresá para ver tu carrito y tus pedidos.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            Correo electrónico
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vos@ejemplo.com"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium">
            Contraseña
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPw ? 'text' : 'password'}
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isRegister ? 'Mínimo 8 caracteres' : '••••••••'}
              className="pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              aria-label={showPw ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            >
              {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        {error && (
          <p className="rounded-lg border border-destructive/25 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/85 disabled:opacity-60"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
          {isRegister ? 'Crear cuenta' : 'Ingresar'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {isRegister ? (
          <>
            ¿Ya tenés cuenta?{' '}
            <Link
              href={`/login${next !== '/products' ? `?next=${encodeURIComponent(next)}` : ''}`}
              className="font-medium text-accent underline-offset-4 hover:underline"
            >
              Iniciá sesión
            </Link>
          </>
        ) : (
          <>
            ¿No tenés cuenta?{' '}
            <Link
              href={`/register${next !== '/products' ? `?next=${encodeURIComponent(next)}` : ''}`}
              className="font-medium text-accent underline-offset-4 hover:underline"
            >
              Creá una
            </Link>
          </>
        )}
      </p>
    </main>
  )
}
