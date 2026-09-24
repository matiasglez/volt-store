import { Suspense } from 'react'
import { CheckoutSuccessView } from '@/components/checkout-success-view'

export default function CheckoutSuccessPage() {
  return (
    <Suspense>
      <CheckoutSuccessView />
    </Suspense>
  )
}
