import { Suspense } from 'react'
import { CheckoutView } from '@/components/checkout-view'

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutView />
    </Suspense>
  )
}
