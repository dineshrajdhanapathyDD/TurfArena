'use client'

import { useRouter, usePathname } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

// Only hide on splash and role-specific home pages
const HIDE_ON = ['/', '/onboarding', '/auth']

export function BackButton() {
  const router = useRouter()
  const pathname = usePathname()

  if (HIDE_ON.includes(pathname)) return null

  return (
    <button
      onClick={() => router.back()}
      aria-label="Go back"
      className="fixed top-3 left-3 z-[60] flex items-center gap-1.5 rounded-full bg-[#1b2235]/90 backdrop-blur-md border border-white/15 px-3 py-2 text-sm font-medium text-white shadow-lg transition-all hover:bg-[#1b2235] active:scale-95 sm:top-4 sm:left-4 sm:px-3.5 sm:py-2.5"
    >
      <ArrowLeft className="size-4" />
      <span className="hidden sm:inline text-xs">Back</span>
    </button>
  )
}
