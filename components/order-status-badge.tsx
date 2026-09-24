import type { OrderStatus } from '@/lib/types'
import { Badge } from '@/components/ui/badge'

const map: Record<OrderStatus, { label: string; tone: 'amber' | 'success' | 'danger' }> = {
  PENDING: { label: 'Pendiente', tone: 'amber' },
  PAID: { label: 'Pagado', tone: 'success' },
  CANCELLED: { label: 'Cancelado', tone: 'danger' },
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const cfg = map[status] ?? { label: status, tone: 'muted' as const }
  return <Badge tone={cfg.tone}>{cfg.label}</Badge>
}
