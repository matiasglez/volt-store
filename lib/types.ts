export interface Paginated<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  parent: number | null
  subcategories: Category[]
}

export interface Product {
  id: string // UUID
  category: number
  category_name: string
  name: string
  description: string
  price: string
  stock: number
  image: string | null
  is_active: boolean
  created_on: string
}

export interface CartItemProduct {
  id: string
  name: string
  price: string
}

export interface CartItem {
  id: number
  product: CartItemProduct
  quantity: number
  subtotal: string
}

export interface Cart {
  id: number
  items: CartItem[]
  total: string
}

export type OrderStatus = 'PENDING' | 'PAID' | 'CANCELLED'

export interface OrderItem {
  id: number
  product: number | { id: string; name: string } | null
  product_name?: string | null
  quantity: number
  price: string
  cost: string
  [key: string]: unknown
}

export interface OrderPayment {
  id: number
  status: string
  payment_method: string
}

export interface Order {
  id: number
  user: number | string
  status: OrderStatus
  order_items: OrderItem[]
  total_cost: string
  created_on: string
  expires_at: string | null
  payment: OrderPayment | null
}

export interface Payment {
  id: number
  order: number
  payment_method: string
  status?: string
  init_point?: string
  [key: string]: unknown
}

export interface AuthTokens {
  access: string
  refresh: string
}
