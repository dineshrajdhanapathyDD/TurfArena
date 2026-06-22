'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Settings,
  Trophy,
  Target,
  Award,
  Zap,
  Medal,
  Flame,
  Star,
  Shield,
  Edit3,
} from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { BottomNav } from '@/components/bottom-nav'
import { AIInsightCard } from '@/components/ai-insight-card'

const stats = [
  { label: 'Matches', value: 64, icon: Target, c: 'text-secondary' },
  { label: 'Wins', value: 41, icon: Trophy, c: 'text-success' },
  { label: 'Goals', value: 88, icon: Zap, c: 'text-accent' },
  { label: 'Assists', value: 52, icon: Award, c: 'text-primary' },
  { label: 'MVP', value: 12, icon: Medal, c: 'text-warning' },
]

const achievements = [
  { label: 'Hat-trick Hero', icon: Flame, c: 'text-accent bg-accent/15' },
  { label: '100 Matches', icon: Shield, c: 'text-secondary bg-secondary/15' },
  { label: 'Top Scorer', icon: Star, c: 'text-warning bg-warning/15' },
  { label: 'MVP x10', icon: Medal, c: 'text-primary bg-primary/15' },
]

const perf = [40, 65, 50, 80, 60, 90, 75]
const perfLabels = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7']

export default function ProfilePage() {
  const max = Math.max(...perf)
  const winRate = Math.round((41 / 64) * 100)

  return (
    <AppShell>
      {/* Header row */}
      <div className="flex items-center justify-between px-5 pt-8">
        <span className="text-base font-bold">Profile</span>
        <Link
          href="/settings"
          aria-label="Settings"
          className="flex size-10 items-center justify-center rounded-full bg-surface-2"
        >
          <Settings className="size-[18px]" />
        </Link>
      </div>

      {/* Profile hero */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-5 px-5"
      >
        <div className="glass shadow-soft relative overflow-hidden rounded-[24px] p-5">
          {/* Background glow */}
          <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-primary/8 blur-2xl" />
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <Image
                src="/images/player-1.png"
                alt="Arjun Mehta"
                width={80}
                height={80}
                className="size-20 rounded-full object-cover ring-3 ring-primary/40"
              />
              <button
                aria-label="Edit profile photo"
                className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-primary"
              >
                <Edit3 className="size-3 text-primary-foreground" />
              </button>
            </div>
            <div className="flex-1">
              <h1 className="text-lg font-bold">Arjun Mehta</h1>
              <p className="text-sm text-muted-foreground">Striker · Thunder FC</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-warning/15 px-2.5 py-0.5 text-[11px] font-semibold text-warning">
                  Gold Tier
                </span>
                <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                  #1 Ranked
                </span>
                <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-[11px] font-semibold text-foreground">
                  2,840 pts
                </span>
              </div>
            </div>
          </div>

          {/* Win rate bar */}
          <div className="mt-4 border-t border-white/8 pt-4">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Win rate</span>
              <span className="font-bold text-success">{winRate}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${winRate}%` }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="h-full rounded-full bg-gradient-to-r from-primary to-success"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <section className="px-5 pt-5">
        <h3 className="section-title text-sm">Stats</h3>
        <div className="no-scrollbar flex gap-2.5 overflow-x-auto pb-1">
          {stats.map((s, i) => {
            const Icon = s.icon
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.06 }}
                className="glass flex min-w-[80px] flex-col items-center gap-1.5 rounded-[16px] p-3.5"
              >
                <Icon className={`size-4.5 ${s.c}`} />
                <span className="text-lg font-bold tabular-nums">{s.value}</span>
                <span className="text-[10px] text-muted-foreground">{s.label}</span>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Performance chart */}
      <section className="px-5 pt-5">
        <div className="glass shadow-soft rounded-[20px] p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Performance</h3>
            <span className="text-[11px] text-muted-foreground">Last 7 matches</span>
          </div>
          <div className="flex h-28 items-end justify-between gap-1.5">
            {perf.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 0.2 + i * 0.07, duration: 0.5, ease: 'backOut' }}
                  style={{ height: `${(v / max) * 100}%`, transformOrigin: 'bottom', minHeight: 8 }}
                  className="w-full rounded-t-md bg-gradient-to-t from-primary/50 to-primary"
                />
                <span className="text-[9px] text-muted-foreground">{perfLabels[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Coach Insights */}
      <section className="px-5 pt-5">
        <h3 className="section-title text-sm">AI Coach</h3>
        <div className="space-y-3">
          <AIInsightCard
            title="Get Training Tips"
            action="coach"
            body={{ playerId: 'p1', playerName: 'Arjun Mehta' }}
          />
          <AIInsightCard
            title="Weekly Performance Report"
            action="report"
            body={{ playerId: 'p1', playerName: 'Arjun Mehta' }}
          />
        </div>
      </section>

      {/* Achievements */}
      <section className="px-5 pt-5">
        <h3 className="section-title text-sm">Achievements</h3>
        <div className="grid grid-cols-2 gap-2.5">
          {achievements.map((a, i) => {
            const Icon = a.icon
            return (
              <motion.div
                key={a.label}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.06 }}
                className="glass flex items-center gap-3 rounded-[16px] p-3"
              >
                <span className={`flex size-9 items-center justify-center rounded-[10px] ${a.c}`}>
                  <Icon className="size-4.5" />
                </span>
                <span className="text-xs font-medium leading-snug">{a.label}</span>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Match history */}
      <section className="px-5 pt-5">
        <h3 className="section-title text-sm">Recent Matches</h3>
        <div className="space-y-2">
          {[
            { home: 'Thunder FC', away: 'Strikers', result: 'W', score: '3-2', date: 'Today' },
            { home: 'Phoenix XI', away: 'Thunder FC', result: 'L', score: '1-0', date: 'Jun 10' },
            { home: 'Thunder FC', away: 'Royal Kickers', result: 'W', score: '4-1', date: 'Jun 8' },
          ].map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.06 }}
              className="glass flex items-center gap-3 rounded-[16px] p-3"
            >
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  m.result === 'W' ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'
                }`}
              >
                {m.result}
              </span>
              <div className="flex-1">
                <span className="text-sm font-medium">{m.home} vs {m.away}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">{m.score}</p>
                <p className="text-[10px] text-muted-foreground">{m.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <BottomNav />
    </AppShell>
  )
}
