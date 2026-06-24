'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, X, Loader2 } from 'lucide-react'
import { AppShell, PageHeader } from '@/components/app-shell'
import { BottomNav } from '@/components/bottom-nav'
import { TournamentCard } from '@/components/cards/tournament-card'
import { SportIcon } from '@/components/sport-icon'
import { tournaments as mockTournaments, SPORTS, type SportKey } from '@/lib/data'

interface TournamentItem {
  id: string
  name: string
  sport: SportKey
  image: string
  date: string
  venue: string
  city: string
  prizePool: number
  entryFee: number
  teamsJoined: number
  totalSpots: number
  trending?: boolean
  featured?: boolean
  format: string
  startTimestamp: number
  isLive?: boolean
}

export default function DiscoverPage() {
  const [query, setQuery] = useState('')
  const [sport, setSport] = useState<SportKey | 'all'>('all')
  const [allTournaments, setAllTournaments] = useState<TournamentItem[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch tournaments from API (DynamoDB + mock fallback)
  useEffect(() => {
    async function fetchTournaments() {
      try {
        const res = await fetch('/api/tournaments')
        const data = await res.json()
        if (data.success && data.data && data.data.length > 0) {
          const apiItems: TournamentItem[] = data.data.map((t: any) => ({
            id: t.tournamentId || t.id,
            name: t.name,
            sport: (t.sport || 'football') as SportKey,
            image: t.image || '/images/tournament-banner.png',
            date: t.date || 'TBD',
            venue: t.venue || 'TBD',
            city: t.city || '',
            prizePool: t.prizePool || 0,
            entryFee: t.entryFee || 0,
            teamsJoined: t.teamsJoined || 0,
            totalSpots: t.totalSpots || 16,
            trending: t.trending || false,
            featured: t.featured || false,
            format: t.format || 'Knockout',
            startTimestamp: t.startTimestamp || Date.now(),
            isLive: true,
          }))
          // Merge with mock data that doesn't overlap
          const realIds = new Set(apiItems.map(t => t.id))
          const mockFiltered = mockTournaments
            .filter(m => !realIds.has(m.id))
            .map(m => ({ ...m, isLive: false }))
          setAllTournaments([...apiItems, ...mockFiltered])
        } else {
          setAllTournaments(mockTournaments.map(m => ({ ...m, isLive: false })))
        }
      } catch {
        setAllTournaments(mockTournaments.map(m => ({ ...m, isLive: false })))
      } finally {
        setLoading(false)
      }
    }
    fetchTournaments()
  }, [])

  const filtered = allTournaments.filter((t) => {
    const matchSport = sport === 'all' || t.sport === sport
    const matchQuery =
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.city.toLowerCase().includes(query.toLowerCase())
    return matchSport && matchQuery
  })

  return (
    <AppShell>
      <PageHeader
        title="Discover"
        subtitle="Find tournaments near you"
        right={
          <button
            className="flex size-10 items-center justify-center rounded-full bg-surface-2 transition-colors hover:bg-surface-2/80"
            aria-label="Filters"
          >
            <SlidersHorizontal className="size-[18px]" />
          </button>
        }
      />

      {/* Search */}
      <div className="px-5 pt-2">
        <div className="glass flex items-center gap-2.5 rounded-[16px] px-4">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tournaments, cities..."
            className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-muted-foreground"
          />
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setQuery('')}
                className="shrink-0 text-muted-foreground"
                aria-label="Clear search"
              >
                <X className="size-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Sport filter chips */}
      <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto px-5 pb-1">
        <button
          onClick={() => setSport('all')}
          className={`chip ${sport === 'all' ? 'chip-active' : 'chip-inactive'}`}
        >
          All Sports
        </button>
        {SPORTS.map((s) => (
          <button
            key={s.key}
            onClick={() => setSport(s.key)}
            className={`chip flex items-center gap-1.5 ${sport === s.key ? 'chip-active' : 'chip-inactive'}`}
          >
            <SportIcon sport={s.key} className="size-3.5" />
            {s.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div className="px-5 pt-3 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {filtered.length} tournament{filtered.length !== 1 ? 's' : ''} found
          {filtered.filter(t => t.isLive).length > 0 && (
            <span className="ml-1 text-emerald-400">
              ({filtered.filter(t => t.isLive).length} from DB)
            </span>
          )}
        </p>
      </div>

      <section className="px-5 pt-4 pb-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading tournaments...</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-3 py-16 text-center"
              >
                <span className="flex size-16 items-center justify-center rounded-[20px] bg-surface-2">
                  <Search className="size-7 text-muted-foreground" />
                </span>
                <p className="font-medium">No tournaments found</p>
                <p className="text-sm text-muted-foreground">Try a different sport or search term</p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filtered.map((t, i) => (
                  <motion.div
                    key={t.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <TournamentCard t={t} />
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        )}
      </section>

      <BottomNav />
    </AppShell>
  )
}
