import {
  type LucideIcon,
  Volleyball,
  Dumbbell,
  Target,
  CircleDot,
  Trophy,
} from 'lucide-react'
import type { SportKey } from '@/lib/data'

const map: Record<SportKey, LucideIcon> = {
  football: CircleDot,
  cricket: Target,
  basketball: Dumbbell,
  volleyball: Volleyball,
  badminton: Trophy,
}

export function SportIcon({
  sport,
  className,
}: {
  sport: SportKey
  className?: string
}) {
  const Icon = map[sport] ?? CircleDot
  return <Icon className={className} aria-hidden />
}
