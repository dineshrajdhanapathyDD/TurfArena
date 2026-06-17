'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Radio, Goal, Footprints, Square, Flag } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { BackHeader } from '@/components/back-header'
import { matchEvents } from '@/lib/data'

const eventIcon: Record<string, typeof Goal> = {
  Goal: Goal,
  Assist: Footprints,
  'Yellow Card': Square,
  'Red Card': Square,
}

export default function LivePage() {
  const [minute, setMinute] = useState(82)
  const [home, setHome] = useState(2)
  const [away, setAway] = useState(1)
  const [possession, setPossession] = useState(58)

  useEffect(() => {
    const id = setInterval(() => {
      setMinute((m) => (m >= 90 ? 90 : m + 1))
      setPossession((p) => Math.min(70, Math.max(40, p + (Math.random() > 0.5 ? 1 : -1))))
    }, 3000)
    return () => clearInterval(id)
  }, [])

  return (
    <AppShell withNav={false} className="pb-10">
      <BackHeader
        title="Live Match Center"
        right={
          <span className="flex items-center gap-1.5 rounded-full bg-danger/15 px-2.5 py-1 text-xs font-semibold text-danger">
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="size-2 rounded-full bg-danger"
            />
            LIVE
          </span>
        }
      />

      {/* Score card */}
      <section className="px-5 pt-4">
        <div className="glass shadow-soft rounded-[24px] p-6">
          <div className="mb-4 text-center">
            <span className="rounded-full bg-surface-2 px-3 py-1 text-xs text-muted-foreground">
              City Champions League · {minute}&apos;
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-1 flex-col items-center gap-2">
              <span className="flex size-14 items-center justify-center rounded-[18px] bg-primary/15 text-xl font-bold text-primary">
                T
              </span>
              <span className="text-sm font-medium">Thunder FC</span>
            </div>
            <div className="flex items-center gap-3">
              <AnimatedScore value={home} />
              <span className="text-2xl font-bold text-muted-foreground">:</span>
              <AnimatedScore value={away} />
            </div>
            <div className="flex flex-1 flex-col items-center gap-2">
              <span className="flex size-14 items-center justify-center rounded-[18px] bg-secondary/15 text-xl font-bold text-secondary">
                S
              </span>
              <span className="text-sm font-medium">Strikers</span>
            </div>
          </div>
        </div>
      </section>

      {/* Live stats */}
      <section className="px-5 pt-5">
        <div className="glass rounded-[20px] p-5">
          <h3 className="mb-4 font-semibold">Live Statistics</h3>
          <StatBar label="Possession" home={possession} away={100 - possession} suffix="%" />
          <StatBar label="Shots" home={12} away={8} />
          <StatBar label="Corners" home={6} away={3} />
        </div>
      </section>

      {/* Events timeline */}
      <section className="px-5 pt-6">
        <h3 className="mb-3 font-semibold">Match Events</h3>
        <div className="relative space-y-3 pl-6">
          <div className="absolute left-2 top-2 bottom-2 w-px bg-border" />
          <AnimatePresence>
            {[...matchEvents].reverse().map((e, i) => {
              const Icon = eventIcon[e.type] ?? Flag
              const color =
                e.type === 'Goal'
                  ? 'text-success bg-success/15'
                  : e.type === 'Red Card'
                    ? 'text-danger bg-danger/15'
                    : e.type === 'Yellow Card'
                      ? 'text-warning bg-warning/15'
                      : 'text-secondary bg-secondary/15'
              return (
                <motion.div
                  key={`${e.minute}-${i}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="relative flex items-center gap-3"
                >
                  <span
                    className={`absolute -left-6 flex size-5 items-center justify-center rounded-full ${color}`}
                  >
                    <Icon className="size-3" />
                  </span>
                  <div className="glass flex flex-1 items-center gap-3 rounded-[14px] px-4 py-2.5">
                    <span className="font-mono text-sm font-bold text-muted-foreground">
                      {e.minute}&apos;
                    </span>
                    <div>
                      <p className="text-sm font-medium">{e.type}</p>
                      <p className="text-xs text-muted-foreground">
                        {e.player} · {e.team === 'home' ? 'Thunder FC' : 'Strikers'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </section>
    </AppShell>
  )
}

function AnimatedScore({ value }: { value: number }) {
  return (
    <div className="relative flex size-12 items-center justify-center overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -30, opacity: 0 }}
          className="text-4xl font-bold tabular-nums"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

function StatBar({
  label,
  home,
  away,
  suffix = '',
}: {
  label: string
  home: number
  away: number
  suffix?: string
}) {
  const total = home + away
  const homePct = (home / total) * 100
  return (
    <div className="mb-4 last:mb-0">
      <div className="mb-1.5 flex justify-between text-sm">
        <span className="font-semibold text-primary">
          {home}
          {suffix}
        </span>
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold text-secondary">
          {away}
          {suffix}
        </span>
      </div>
      <div className="flex h-1.5 overflow-hidden rounded-full bg-surface-2">
        <motion.div
          className="h-full bg-primary"
          animate={{ width: `${homePct}%` }}
          transition={{ duration: 0.6 }}
        />
        <div className="h-full flex-1 bg-secondary" />
      </div>
    </div>
  )
}
