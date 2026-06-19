'use client'

import { useEffect, useState } from 'react'

function diff(target: number) {
  const ms = Math.max(0, target - Date.now())
  const d = Math.floor(ms / (1000 * 60 * 60 * 24))
  const h = Math.floor((ms / (1000 * 60 * 60)) % 24)
  const m = Math.floor((ms / (1000 * 60)) % 60)
  const s = Math.floor((ms / 1000) % 60)
  return { d, h, m, s }
}

export function Countdown({ target }: { target: number }) {
  const [t, setT] = useState(() => diff(target))

  useEffect(() => {
    const id = setInterval(() => setT(diff(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  const blocks = t.d > 0
    ? [{ v: t.d, l: 'Days' }, { v: t.h, l: 'Hrs' }, { v: t.m, l: 'Min' }]
    : [{ v: t.h, l: 'Hrs' }, { v: t.m, l: 'Min' }, { v: t.s, l: 'Sec' }]

  return (
    <div className="flex gap-1.5">
      {blocks.map((b, i) => (
        <div
          key={b.l}
          className="flex min-w-[44px] flex-col items-center rounded-[12px] bg-surface-2/80 px-2 py-1.5"
        >
          <span className="font-mono text-base font-bold tabular-nums leading-none">
            {String(b.v).padStart(2, '0')}
          </span>
          <span className="mt-0.5 text-[9px] uppercase tracking-wider text-muted-foreground">
            {b.l}
          </span>
        </div>
      ))}
    </div>
  )
}
