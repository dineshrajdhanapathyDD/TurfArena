'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp, ChevronDown, Minus, Crown } from 'lucide-react'
import { AppShell, PageHeader } from '@/components/app-shell'
import { BottomNav } from '@/components/bottom-nav'
import { playerRanks } from '@/lib/data'

const tabs = ['Players', 'Teams', 'Turfs'] as const
const ranges = ['Weekly', 'Monthly', 'All Time'] as const

export default function LeaderboardsPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>('Players')
  const [range, setRange] = useState<(typeof ranges)[number]>('Weekly')

  const top3 = playerRanks.slice(0, 3)
  const rest = playerRanks.slice(3)
  // podium order: 2nd, 1st, 3rd
  const podium = [top3[1], top3[0], top3[2]]
  const podiumHeights = ['h-20', 'h-28', 'h-16']
  const ringColors = ['ring-muted-foreground/40', 'ring-warning', 'ring-secondary/60']
  const medals = ['🥈', '🥇', '🥉']

  return (
    <AppShell>
      <PageHeader title="Leaderboards" subtitle="Compete and climb the ranks" />

      {/* Tabs */}
      <div className="mt-1 flex gap-1.5 rounded-full bg-surface-2 p-1 mx-5">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`relative flex-1 rounded-full py-2 text-sm font-medium transition-colors ${
              tab === t ? 'text-foreground' : 'text-muted-foreground'
            }`}
          >
            {tab === t && (
              <motion.span
                layoutId="lbtab"
                className="absolute inset-0 rounded-full bg-surface shadow-soft"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative">{t}</span>
          </button>
        ))}
      </div>

      {/* Range filter */}
      <div className="no-scrollbar mt-3 flex gap-2 px-5">
        {ranges.map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              range === r
                ? 'bg-primary/15 text-primary'
                : 'text-muted-foreground'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Podium */}
      <section className="px-5 pt-6">
        <div className="glass shadow-soft overflow-hidden rounded-[24px] p-5">
          <div className="flex items-end justify-center gap-4">
            {podium.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12, type: 'spring', stiffness: 200 }}
                className="flex flex-1 flex-col items-center"
              >
                {i === 1 && <Crown className="mb-1.5 size-5 text-warning" />}
                <div className="relative">
                  <Image
                    src={p.avatar}
                    alt={p.name}
                    width={48}
                    height={48}
                    className={`size-12 rounded-full object-cover ring-2 ${ringColors[i]}`}
                  />
                  <span className="absolute -bottom-1 -right-1 text-sm">{medals[i]}</span>
                </div>
                <span className="mt-2 text-xs font-semibold">{p.name.split(' ')[0]}</span>
                <span className="text-[11px] font-bold text-primary">{p.points.toLocaleString()}</span>
                <div
                  className={`mt-2 flex w-full ${podiumHeights[i]} items-start justify-center rounded-t-[12px] pt-2 text-sm font-bold text-muted-foreground ${
                    i === 1 ? 'bg-warning/15' : i === 0 ? 'bg-muted/30' : 'bg-secondary/10'
                  }`}
                >
                  {i === 0 ? 2 : i === 1 ? 1 : 3}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Rest of ranking */}
      <section className="px-5 pt-4">
        <AnimatePresence>
          <div className="space-y-2">
            {rest.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="glass flex items-center gap-3 rounded-[16px] p-3"
              >
                <span className="w-5 shrink-0 text-center text-sm font-bold text-muted-foreground">
                  {i + 4}
                </span>
                <Image
                  src={p.avatar}
                  alt={p.name}
                  width={38}
                  height={38}
                  className="size-[38px] rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold">{p.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {p.badge} · {p.matches} matches
                  </p>
                </div>
                <span className="font-bold text-primary text-sm">{p.points.toLocaleString()}</span>
                {p.change > 0 ? (
                  <ChevronUp className="size-4 shrink-0 text-success" />
                ) : p.change < 0 ? (
                  <ChevronDown className="size-4 shrink-0 text-danger" />
                ) : (
                  <Minus className="size-4 shrink-0 text-muted-foreground" />
                )}
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </section>

      <BottomNav />
    </AppShell>
  )
}
