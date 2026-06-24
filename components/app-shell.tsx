'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function AppShell({
  children,
  className,
  withNav = true,
  fullWidth = false,
}: {
  children: React.ReactNode
  className?: string
  withNav?: boolean
  fullWidth?: boolean
}) {
  return (
    <div className={cn(
      'relative mx-auto min-h-dvh w-full bg-background',
      fullWidth ? 'max-w-full' : 'max-w-md sm:max-w-lg md:max-w-3xl lg:max-w-5xl xl:max-w-6xl'
    )}>
      {/* ambient glow */}
      <div className="pointer-events-none fixed inset-0 mx-auto max-w-4xl overflow-hidden">
        <div className="absolute -left-16 -top-16 size-56 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute -right-20 top-1/3 size-56 rounded-full bg-secondary/8 blur-3xl" />
      </div>
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className={cn(
          'relative z-10',
          withNav ? 'pb-28 sm:pb-32' : 'pb-6 sm:pb-8',
          className
        )}
      >
        {children}
      </motion.main>
    </div>
  )
}

export function PageHeader({
  title,
  subtitle,
  right,
}: {
  title: string
  subtitle?: string
  right?: React.ReactNode
}) {
  return (
    <header className="flex items-start justify-between gap-3 px-4 sm:px-5 pt-5 sm:pt-6 pb-2">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-balance text-foreground">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {right}
    </header>
  )
}
