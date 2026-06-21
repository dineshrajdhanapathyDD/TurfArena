'use client'

import { useRouter, usePathname } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

const NO_BACK_ROUTES = ['/', '/home', '/customer-dashboard', '/organizer', '/owner']

export function BackButton() {
  const router = useRouter()
  const pathname = usePathname()

  if (NO_BACK_ROUTES.includes(pathname)) return null

  return (
    <button
      onClick={() => router.back()}
      aria-label="Go back"
      className="fixed top-4 left-4 z-50 flex items-center gap-1.5 rounded-full bg-surface-2/90 backdrop-blur-md border border-border px-3 py-2 text-sm font-medium text-foreground shadow-soft transition-all hover:bg-surface-2 active:scale-95 touch-target sm:top-5 sm:left-5"
    >
      <ChevronLeft className="size-4" />
      <span className="hidden sm:inline">Back</span>
    </button>
  )
}
