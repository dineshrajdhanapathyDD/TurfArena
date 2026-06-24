'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Home,
  Compass,
  Trophy,
  Sparkles,
  User,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const items: { href: string; label: string; icon: LucideIcon }[] = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/discover', label: 'Discover', icon: Compass },
  { href: '/ai', label: 'AI Coach', icon: Sparkles },
  { href: '/leaderboards', label: 'Ranks', icon: Trophy },
  { href: '/profile', label: 'Profile', icon: User },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-md sm:max-w-lg md:max-w-3xl lg:max-w-5xl xl:max-w-6xl px-3 sm:px-4 pb-3 sm:pb-4">
      <div className="glass-strong shadow-soft flex items-center justify-around rounded-[24px] sm:rounded-[28px] px-1 sm:px-2 py-2 sm:py-2.5">
        {items.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-1 flex-col items-center gap-0.5 sm:gap-1 rounded-[16px] sm:rounded-[20px] py-2 sm:py-1.5 touch-target"
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
            >
              {active && (
                <motion.span
                  layoutId="navActive"
                  className="absolute inset-0 rounded-[16px] sm:rounded-[20px] bg-primary/12"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                className={cn(
                  'relative size-5 sm:size-[19px] transition-colors duration-200',
                  active ? 'text-primary' : 'text-muted-foreground'
                )}
              />
              <span
                className={cn(
                  'relative text-[10px] sm:text-[10px] font-medium transition-colors duration-200',
                  active ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
