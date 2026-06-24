'use client'

import { use, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Users, MapPin, Calendar, Radio, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { BackHeader } from '@/components/back-header'
import { tournaments as mockTournaments, playerRanks, formatCurrency } from '@/lib/data'
import { AIInsightCard } from '@/components/ai-insight-card'
import { useAuth } from '@/lib/auth-context'

const tabs = ['Overview', 'Teams', 'Fixtures', 'Leaderboard', 'Rules'] as const
type Tab = (typeof tabs)[number]

interface TournamentData {
  id: string
  name: string
  sport: string
  image: string
  date: string
  venue: string
  city: string
  prizePool: number
  entryFee: number
  teamsJoined: number
  totalSpots: number
  format: string
  status?: string
  isLive?: boolean
}

export default function TournamentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { user } = useAuth()
  const [tab, setTab] = useState<Tab>('Overview')
  const [tournament, setTournament] = useState<TournamentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)
  const [regSuccess, setRegSuccess] = useState(false)
  const [regError, setRegError] = useState('')

  // Fetch tournament from API (DynamoDB) with mock fallback
  useEffect(() => {
    async function fetchTournament() {
      try {
        const res = await fetch(`/api/tournaments/${id}`)
        const data = await res.json()
        if (data.success && data.data) {
          const t = data.data
          setTournament({
            id: t.tournamentId || t.id || id,
            name: t.name,
            sport: t.sport || 'football',
            image: t.image || '/images/tournament-banner.png',
            date: t.date || 'TBD',
            venue: t.venue || 'TBD',
            city: t.city || '',
            prizePool: t.prizePool || 0,
            entryFee: t.entryFee || 0,
            teamsJoined: t.teamsJoined || 0,
            totalSpots: t.totalSpots || 16,
            format: t.format || 'Knockout',
            status: t.status,
            isLive: true,
          })
        } else {
          // Fallback to mock data
          const mock = mockTournaments.find(x => x.id === id)
          if (mock) setTournament({ ...mock, isLive: false })
        }
      } catch {
        const mock = mockTournaments.find(x => x.id === id)
        if (mock) setTournament({ ...mock, isLive: false })
      } finally {
        setLoading(false)
      }
    }
    fetchTournament()
  }, [id])

  // Register for tournament
  async function handleRegister() {
    if (!tournament) return
    setRegistering(true)
    setRegError('')
    try {
      const res = await fetch(`/api/tournaments/${id}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamName: `${user?.name || 'Player'}'s Team`,
          playerIds: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'],
          captainId: user?.id || 'p1',
          paymentId: `pay_${Date.now()}`,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setRegSuccess(true)
        // Update local state
        setTournament(prev => prev ? { ...prev, teamsJoined: prev.teamsJoined + 1 } : prev)
      } else {
        setRegError(data.error || 'Registration failed')
      }
    } catch {
      setRegError('Network error. Please try again.')
    } finally {
      setRegistering(false)
    }
  }

  if (loading) {
    return (
      <AppShell withNav={false}>
        <div className="flex flex-col items-center justify-center min-h-screen gap-3">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading tournament...</p>
        </div>
      </AppShell>
    )
  }

  if (!tournament) {
    return (
      <AppShell withNav={false}>
        <div className="flex flex-col items-center justify-center min-h-screen gap-3">
          <AlertCircle className="size-8 text-red-400" />
          <p className="text-sm text-muted-foreground">Tournament not found</p>
          <Link href="/tournaments" className="text-sm text-primary underline">Back to tournaments</Link>
        </div>
      </AppShell>
    )
  }

  const t = tournament

  return (
    <AppShell withNav={false} className="pb-28">
      <div className="relative h-56">
        <Image src={t.image || '/images/tournament-banner.png'} alt={t.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-background/40" />
        <div className="absolute inset-x-0 top-0">
          <BackHeader />
        </div>
        <div className="absolute bottom-4 left-5 right-5">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-accent-foreground">
              {t.format}
            </span>
            {t.isLive && (
              <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white">
                LIVE DB
              </span>
            )}
          </div>
          <h1 className="mt-2 text-2xl font-bold text-balance text-white">{t.name}</h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-white/80">
            <MapPin className="size-3.5" /> {t.venue}{t.city ? `, ${t.city}` : ''}
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

      {/* Registration Success/Error */}
      <AnimatePresence>
        {regSuccess && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mx-5 mt-4 flex items-center gap-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 px-4 py-3 text-sm text-emerald-300">
            <CheckCircle2 className="size-4" /> Registration successful! Your team is in.
          </motion.div>
        )}
        {regError && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mx-5 mt-4 flex items-center gap-2 rounded-xl bg-red-500/20 border border-red-500/30 px-4 py-3 text-sm text-red-300">
            <AlertCircle className="size-4" /> {regError}
          </motion.div>
        )}
      </AnimatePresence>

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
                  {t.isLive && (
                    <p className="mt-2 text-xs text-emerald-400 flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Data from Amazon DynamoDB (real-time)
                    </p>
                  )}
                </div>
                <Link href="/live">
                  <div className="glass flex items-center gap-3 rounded-[18px] p-4">
                    <span className="flex size-10 items-center justify-center rounded-full bg-danger/15">
                      <Radio className="size-5 text-danger" />
                    </span>
                    <div>
                      <p className="font-semibold">Watch live matches</p>
                      <p className="text-xs text-muted-foreground">
                        Real-time scores and stats
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
                {t.teamsJoined > 4 && (
                  <p className="text-center text-xs text-muted-foreground py-2">
                    +{t.teamsJoined - 4} more teams registered
                  </p>
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

      {/* AI Tournament Prediction */}
      <div className="px-5 pt-4">
        <AIInsightCard
          title="AI Tournament Prediction"
          action="predict"
          body={{
            tournamentData: {
              tournamentName: t.name,
              format: t.format,
              teams: ['Thunder FC', 'Strikers United', 'Phoenix XI', 'Royal Kickers'],
              sport: t.sport,
            },
          }}
        />
      </div>

      {/* Fixed Join CTA */}
      <div className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-md px-5 pb-5">
        {regSuccess ? (
          <div className="glass-strong flex w-full items-center justify-center gap-2 rounded-[18px] bg-emerald-600 py-4 font-semibold text-white">
            <CheckCircle2 className="size-5" /> Registered Successfully
          </div>
        ) : t.teamsJoined >= t.totalSpots ? (
          <div className="glass-strong flex w-full items-center justify-center gap-2 rounded-[18px] bg-gray-600 py-4 font-semibold text-white/70">
            Tournament Full
          </div>
        ) : (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleRegister}
            disabled={registering}
            className="shadow-glow-primary glass-strong flex w-full items-center justify-center gap-2 rounded-[18px] bg-primary py-4 font-semibold text-primary-foreground disabled:opacity-60"
          >
            {registering ? (
              <><Loader2 className="size-5 animate-spin" /> Registering...</>
            ) : (
              <>Join Tournament · {formatCurrency(t.entryFee)}</>
            )}
          </motion.button>
        )}
      </div>
    </AppShell>
  )
}
