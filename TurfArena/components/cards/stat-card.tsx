import { type LucideIcon } from 'lucide-react'
import { cn } from '@/TurfArena/lib/utils'

export function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent = 'primary',
}: {
  icon: LucideIcon
  label: string
  value: string | number
  sub?: string
  accent?: 'primary' | 'secondary' | 'accent' | 'warning' | 'success'
}) {
  const tints: Record<string, string> = {
    primary: 'bg-primary/15 text-primary',
    secondary: 'bg-secondary/15 text-secondary',
    accent: 'bg-accent/15 text-accent',
    warning: 'bg-warning/15 text-warning',
    success: 'bg-success/15 text-success',
  }
  return (
    <div className="glass shadow-soft rounded-[18px] p-4">
      <div
        className={cn(
          'mb-3 flex size-9 items-center justify-center rounded-[12px]',
          tints[accent]
        )}
      >
        <Icon className="size-4.5" />
      </div>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
      {sub && <p className="mt-1 text-xs font-medium text-success">{sub}</p>}
    </div>
  )
}
