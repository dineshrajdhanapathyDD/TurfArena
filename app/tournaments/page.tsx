'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Trophy, MapPin, Calendar, Users, Loader2, RefreshCw } from 'lucide-react'
import { AppShell, PageHeader } from '@/components/app-shell'
import { BottomNav } from '@/components/bottom-nav'
import { tournaments as mockTournaments, formatCurrency } from '@/lib/data'
import { useState, useEffect } from 'react'

interface TournamentItem {
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
  trending?: boolean
  featured?: boolean
  format: string
  isLive?: boolean
}

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<TournamentItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTournaments() {
      try {
        const res = await fetch('/api/tournaments')
        const data = await res.json()
        if (data.success && data.data && data.data.length > 0) {
          const apiTournaments: TournamentItem[] = data.data.map((t: any) => ({
            id: t.tournamentId || t.id,
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
            trending: t.trending || false,
            featured: t.featured || false,
            format: t.format || 'Knockout',
            isLive: true,
          }))
          // Merge: real DynamoDB data first, then mock data that doesn't overlap
          const realIds = new Set(apiTournaments.map(t => t.id))
          const mockFiltered = mockTournaments
            .filter(m => !realIds.has(m.id))
            .map(m => ({ ...m, isLive: false }))
          setTournaments([...apiTournaments, ...mockFiltered])
        } else {
          // Fallback to mock data
          setTournaments(mockTournaments.map(m => ({ ...m, isLive: false })))
        }
      } catch {
        setTournaments(mockTournaments.map(m => ({ ...m, isLive: false })))
      } finally {
        setLoading(false)
      }
    }
    fetchTournaments()
  }, [])

  const liveCount = tournaments.filter(t => t.isLive).length
  const trendingCount = tournaments.filter(t => t.trending).length

  return (
    <AppShell>
      <PageHeader title="Tournaments" subtitle="Join exciting competitions and showcase your skills" />

      {/* Stats bar */}
      <div className="flex gap-3 px-4 sm:px-5 pt-3">
        <div className="glass rounded-[14px] px-4 py-2.5 flex-1 text-center">
          <p className="text-lg font-bold text-foreground">{tournaments.length}</p>
          <p className="text-[11px] text-muted-foreground">Available</p>
        </div>
        <div className="glass rounded-[14px] px-4 py-2.5 flex-1 text-center">
          <p className="text-lg font-bold text-primary">{liveCount}</p>
          <p className="text-[11px] text-muted-foreground">From DB</p>
        </div>
        <div className="glass rounded-[14px] px-4 py-2.5 flex-1 text-center">
          <p className="text-lg font-bold text-accent">{trendingCount}</p>
          <p className="text-[11px] text-muted-foreground">Trending</p>
        </div>
      </div>

      {/* Tournament list */}
      <section className="px-4 sm:px-5 pt-5 pb-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading tournaments...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tournaments.map((tournament, idx) => (
            <motion.div
              key={tournament.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
            >
              <Link href={`/tournaments/${tournament.id}`}>
                <div className="glass rounded-[20px] overflow-hidden group hover:border-primary/30 transition-colors">
                  {/* Image */}
                  <div className="relative h-40 sm:h-48 bg-surface-2 overflow-hidden">
                    <Image
                      src={tournament.image || '/images/tournament-banner.png'}
                      alt={tournament.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      {tournament.isLive && (
                        <span className="bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          LIVE DB
                        </span>
                      )}
                      {tournament.trending && (
                        <span className="bg-accent/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                          Trending
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-lg font-bold text-white">{tournament.name}</h3>
                      <p className="text-xs text-white/80 mt-0.5">{tournament.format}</p>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3.5" /> {tournament.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3.5" /> {tournament.venue}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[11px] text-muted-foreground">Prize Pool</p>
                        <p className="text-sm font-bold text-primary">{formatCurrency(tournament.prizePool)}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-muted-foreground">Entry</p>
                        <p className="text-sm font-bold text-foreground">{formatCurrency(tournament.entryFee)}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-muted-foreground">Spots</p>
                        <p className="text-sm font-bold text-foreground">
                          {tournament.teamsJoined}<span className="text-muted-foreground">/{tournament.totalSpots}</span>
                        </p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-1.5 bg-surface-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${(tournament.teamsJoined / tournament.totalSpots) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
          </div>
        )}
      </section>

      <BottomNav />
    </AppShell>
  )
}
