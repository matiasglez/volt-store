import { cn } from '@/lib/utils'

type BadgeTone = 'neutral' | 'amber' | 'success' | 'danger' | 'muted'

const tones: Record<BadgeTone, string> = {
  neutral: 'bg-primary text-primary-foreground',
  amber: 'bg-accent/12 text-accent border border-accent/25',
  success: 'bg-emerald-600/12 text-emerald-700 border border-emerald-600/25',
  danger: 'bg-destructive/12 text-destructive border border-destructive/25',
  muted: 'bg-muted text-muted-foreground border border-border',
}

export function Badge({
  tone = 'neutral',
  className,
  ...props
}: React.ComponentProps<'span'> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide',
        tones[tone],
        className,
      )}
      {...props}
    />
  )
}
