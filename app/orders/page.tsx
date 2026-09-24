import { Suspense } from 'react'
import { OrdersView } from '@/components/orders-view'

export default function OrdersPage() {
  return (
    <Suspense>
      <OrdersView />
    </Suspense>
  )
}
