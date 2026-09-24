import type {
  AuthTokens,
  Cart,
  Category,
  Order,
  Paginated,
  Payment,
  Product,
} from './types'

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://127.0.0.1:8000'

const API_BASE = `${API_URL}/api`

const ACCESS_KEY = 'nova_access'
const REFRESH_KEY = 'nova_refresh'

/* ---------------- token storage ---------------- */

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(ACCESS_KEY)
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(REFRESH_KEY)
}

export function setTokens(tokens: Partial<AuthTokens>) {
  if (typeof window === 'undefined') return
  if (tokens.access) window.localStorage.setItem(ACCESS_KEY, tokens.access)
  if (tokens.refresh) window.localStorage.setItem(REFRESH_KEY, tokens.refresh)
}

export function clearTokens() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(ACCESS_KEY)
  window.localStorage.removeItem(REFRESH_KEY)
}

/** Prefix a possibly-relative media path with the API origin. */
export function mediaUrl(path: string | null | undefined): string | null {
  if (!path) return null
  if (/^https?:\/\//.test(path)) return path
  return `${API_URL}${path.startsWith('/') ? '' : '/'}${path}`
}

/* ---------------- error type ---------------- */

export class ApiError extends Error {
  status: number
  data: unknown
  constructor(status: number, message: string, data?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

/** Turn a DRF error payload into a friendly, single Spanish string. */
export function friendlyError(err: unknown, fallback = 'Ocurrió un error. Intentá de nuevo.'): string {
  if (err instanceof ApiError) {
    const d = err.data
    if (typeof d === 'string' && d) return d
    if (d && typeof d === 'object') {
      const obj = d as Record<string, unknown>
      const parts: string[] = []
      for (const key of ['detail', 'non_field_errors', 'message', 'error']) {
        const v = obj[key]
        if (typeof v === 'string') parts.push(v)
        else if (Array.isArray(v)) parts.push(...v.map(String))
      }
      if (parts.length === 0) {
        for (const [, v] of Object.entries(obj)) {
          if (typeof v === 'string') parts.push(v)
          else if (Array.isArray(v)) parts.push(...v.map(String))
        }
      }
      if (parts.length) return parts.join(' ')
    }
    if (err.status === 401) return 'Sesión expirada. Iniciá sesión nuevamente.'
    return err.message || fallback
  }
  if (err instanceof Error) return err.message || fallback
  return fallback
}

/* ---------------- core request ---------------- */

let refreshPromise: Promise<string | null> | null = null

async function tryRefresh(): Promise<string | null> {
  const refresh = getRefreshToken()
  if (!refresh) return null

  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const res = await fetch(`${API_BASE}/users/auth/token/refresh/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh }),
        })
        if (!res.ok) return null
        const data = (await res.json()) as { access?: string }
        if (data.access) {
          setTokens({ access: data.access })
          return data.access
        }
        return null
      } catch {
        return null
      } finally {
        refreshPromise = null
      }
    })()
  }
  return refreshPromise
}

function logout() {
  clearTokens()
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('nova:logout'))
  }
}

interface RequestOptions {
  method?: string
  body?: unknown
  auth?: boolean
  retry?: boolean
}

async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = false, retry = true } = opts

  const headers: Record<string, string> = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  const access = getAccessToken()
  if (auth && access) headers['Authorization'] = `Bearer ${access}`

  let res: Response
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: 'no-store',
    })
  } catch {
    throw new ApiError(0, 'No pudimos conectar con el servidor.')
  }

  // Attempt token refresh once on 401 for authed requests.
  if (res.status === 401 && auth && retry) {
    const newAccess = await tryRefresh()
    if (newAccess) {
      return request<T>(path, { ...opts, retry: false })
    }
    logout()
    throw new ApiError(401, 'No autorizado')
  }

  if (res.status === 204) return undefined as T

  let data: unknown = null
  const text = await res.text()
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = text
    }
  }

  if (!res.ok) {
    throw new ApiError(res.status, `Request failed (${res.status})`, data)
  }
  return data as T
}

/* ---------------- API surface ---------------- */

export const api = {
  // Auth
  register: (email: string, password: string) =>
    request<{ email: string }>('/users/auth/register/', {
      method: 'POST',
      body: { email, password },
    }),
  login: (email: string, password: string) =>
    request<AuthTokens>('/users/auth/login/', {
      method: 'POST',
      body: { email, password },
    }),

  // Products
  getProducts: (params: { page?: number; category_id?: number } = {}) => {
    const q = new URLSearchParams()
    if (params.page) q.set('page', String(params.page))
    if (params.category_id) q.set('category_id', String(params.category_id))
    const qs = q.toString()
    return request<Paginated<Product>>(`/products/${qs ? `?${qs}` : ''}`)
  },
  getProduct: (id: string) => request<Product>(`/products/${id}/`),
  getCategories: () => request<Category[]>('/products/categories/'),

  // Cart
  getCart: () => request<Cart>('/cart/', { auth: true }),
  addToCart: (product_id: string, quantity: number) =>
    request<{ message: string }>('/cart/', {
      method: 'POST',
      body: { product_id, quantity },
      auth: true,
    }),
  removeCartItem: (product_uuid: string) =>
    request<void>(`/cart/item/${product_uuid}/`, {
      method: 'DELETE',
      auth: true,
    }),

  // Orders
  checkout: () =>
    request<Order>('/orders/checkout/', { method: 'POST', body: {}, auth: true }),
  getOrders: () => request<Paginated<Order> | Order[]>('/orders/', { auth: true }),
  getOrder: (id: number | string) => request<Order>(`/orders/${id}/`, { auth: true }),

  // Payments
  createPayment: (order_id: number) =>
    request<Payment & { init_point?: string }>('/payments/create/', {
      method: 'POST',
      body: { order_id, payment_method: 'MERCADOPAGO' },
      auth: true,
    }),
  getPayments: () => request<Paginated<Payment> | Payment[]>('/payments/', { auth: true }),
}
