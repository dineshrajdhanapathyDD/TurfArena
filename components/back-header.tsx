'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

export function BackHeader({
  title,
  right,
}: {
  title?: string
  right?: React.ReactNode
}) {
  const router = useRouter()
  return (
    <header className="sticky top-0 z-40 flex items-center gap-3 px-4 py-3 glass-strong">
      <button
        onClick={() => router.back()}
        aria-label="Go back"
        className="flex size-9 items-center justify-center rounded-full bg-surface-2/80 transition-colors active:bg-surface-2"
      >
        <ChevronLeft className="size-5" />
      </button>
      {title && <h1 className="text-sm font-semibold">{title}</h1>}
      <div className="ml-auto">{right}</div>
    </header>
  )
}
