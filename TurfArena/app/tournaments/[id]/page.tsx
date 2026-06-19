'use client'

import { use, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Users, MapPin, Calendar, Radio } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { BackHeader } from '@/components/back-header'
import { tournaments, playerRanks, formatCurrency } from '@/lib/data'

const tabs = ['Overview', 'Teams', 'Fixtures', 'Leaderboard', 'Rules'] as const
type Tab = (typeof tabs)[number]

export default function TournamentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const t = tournaments.find((x) => x.id === id)
  const [tab, setTab] = useState<Tab>('Overview')

  if (!t) notFound()

  return (
    <AppShell withNav={false} className="pb-28">
      <div className="relative h-56">
        <Image src={t.image || '/placeholder.svg'} alt={t.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-background/40" />
        <div className="absolute inset-x-0 top-0">
          <BackHeader />
        </div>
        <div className="absolute bottom-4 left-5 right-5">
          <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-accent-foreground">
            {t.format}
          </span>
          <h1 className="mt-2 text-2xl font-bold text-balance">{t.name}</h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-3.5" /> {t.venue}, {t.city}
          </p>
        </div>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-3 gap-3 px-5 pt-5">
        {[
          { icon: Trophy, label: 'Prize', value: formatCurrency(t.prizePool), c: 'text-success' },
          { icon: Users, label: 'Teams', value: `${t.teamsJoined}/${t.totalSpots}`, c: 'text-secondary' },
          { icon: Calendar, label: 'Entry', value: formatCurrency(t.entryFee), c: 'text-accent' },
        ].map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="glass rounded-[16px] p-3 text-center">
              <Icon className={`mx-auto size-5 ${s.c}`} />
              <p className="mt-1.5 text-sm font-bold">{s.value}</p>
              <p className="text-[11px] text-muted-foreground">{s.label}</p>
            </div>
          )
        })}
      </div>

      {/* Tabs */}
      <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto px-5">
        {tabs.map((tb) => (
          <button
            key={tb}
            onClick={() => setTab(tb)}
            className={`relative whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              tab === tb ? 'text-primary-foreground' : 'text-muted-foreground'
            }`}
          >
            {tab === tb && (
              <motion.span
                layoutId="ttab"
                className="absolute inset-0 rounded-full bg-primary"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative">{tb}</span>
          </button>
        ))}
      </div>

      <div className="px-5 pt-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {tab === 'Overview' && (
              <div className="space-y-4">
                <div className="glass rounded-[18px] p-4">
                  <h3 className="font-semibold">About</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    The {t.name} brings together the best local teams for an
                    action-packed {t.format} competition. Compete for a prize
                    pool of {formatCurrency(t.prizePool)} and a shot at the
                    regional finals.
                  </p>
                </div>
                <Link href="/live">
                  <div className="glass flex items-center gap-3 rounded-[18px] p-4">
                    <span className="flex size-10 items-center justify-center rounded-full bg-danger/15">
                      <Radio className="size-5 text-danger" />
                    </span>
                    <div>
                      <p className="font-semibold">Watch live matches</p>
                      <p className="text-xs text-muted-foreground">
                        Real-time scores & stats
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {tab === 'Teams' && (
              <div className="space-y-3">
                {['Thunder FC', 'Strikers United', 'Phoenix XI', 'Royal Kickers'].map(
                  (name, i) => (
                    <div key={name} className="glass flex items-center gap-3 rounded-[16px] p-3">
                      <span className="flex size-10 items-center justify-center rounded-full bg-surface-2 font-bold text-primary">
                        {name[0]}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium">{name}</p>
                        <p className="text-xs text-muted-foreground">7 players</p>
                      </div>
                      <span className="text-xs text-muted-foreground">Seed #{i + 1}</span>
                    </div>
                  )
                )}
              </div>
            )}

            {tab === 'Fixtures' && (
              <div className="space-y-3">
                {[
                  ['Thunder FC', 'Strikers United', 'Today 6:00 PM'],
                  ['Phoenix XI', 'Royal Kickers', 'Today 7:30 PM'],
                  ['Winner A', 'Winner B', 'Sun 5:00 PM'],
                ].map((f, i) => (
                  <div key={i} className="glass rounded-[16px] p-4">
                    <p className="mb-2 text-center text-xs text-muted-foreground">
                      {f[2]}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="flex-1 text-center font-medium">{f[0]}</span>
                      <span className="rounded-full bg-surface-2 px-3 py-1 text-xs">
                        VS
                      </span>
                      <span className="flex-1 text-center font-medium">{f[1]}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === 'Leaderboard' && (
              <div className="space-y-2">
                {playerRanks.slice(0, 5).map((p, i) => (
                  <div key={p.id} className="glass flex items-center gap-3 rounded-[16px] p-3">
                    <span className="w-5 text-center font-bold text-muted-foreground">
                      {i + 1}
                    </span>
                    <Image src={p.avatar} alt={p.name} width={36} height={36} className="size-9 rounded-full object-cover" />
                    <span className="flex-1 font-medium">{p.name}</span>
                    <span className="font-bold text-primary">{p.points}</span>
                  </div>
                ))}
              </div>
            )}

            {tab === 'Rules' && (
              <div className="glass rounded-[18px] p-4">
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {[
                    'Each team must register a minimum of 7 and maximum of 10 players.',
                    'Matches are 2 halves of 20 minutes each.',
                    'A red card results in a one-match suspension.',
                    'Tie-breakers are decided by penalty shootout.',
                    'All players must carry valid ID for verification.',
                  ].map((r, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="font-bold text-primary">{i + 1}.</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Fixed Join CTA */}
      <div className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-md px-5 pb-5">
        <Link href={`/tournaments/${id}/register`}>
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="shadow-glow-primary glass-strong flex w-full items-center justify-center gap-2 rounded-[18px] bg-primary py-4 font-semibold text-primary-foreground"
          >
            Join Tournament · {formatCurrency(t.entryFee)}
          </motion.button>
        </Link>
      </div>
    </AppShell>
  )
}
