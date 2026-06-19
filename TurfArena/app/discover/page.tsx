'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { AppShell, PageHeader } from '@/components/app-shell'
import { BottomNav } from '@/components/bottom-nav'
import { TournamentCard } from '@/components/cards/tournament-card'
import { SportIcon } from '@/components/sport-icon'
import { tournaments, SPORTS, type SportKey } from '@/TurfArena/lib/data'

export default function DiscoverPage() {
  const [query, setQuery] = useState('')
  const [sport, setSport] = useState<SportKey | 'all'>('all')

  const filtered = tournaments.filter((t) => {
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
            placeholder="Search tournaments, cities…"
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
      {(query || sport !== 'all') && (
        <div className="px-5 pt-3">
          <p className="text-xs text-muted-foreground">
            {filtered.length} tournament{filtered.length !== 1 ? 's' : ''} found
          </p>
        </div>
      )}

      <section className="space-y-3 px-5 pt-4 pb-4">
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
            filtered.map((t, i) => (
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
            ))
          )}
        </AnimatePresence>
      </section>

      <BottomNav />
    </AppShell>
  )
}
