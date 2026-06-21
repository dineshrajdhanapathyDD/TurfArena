'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Trophy, MapPin, Calendar, Users } from 'lucide-react'
import { AppShell, PageHeader } from '@/components/app-shell'
import { BottomNav } from '@/components/bottom-nav'
import { tournaments, formatCurrency } from '@/lib/data'

export default function TournamentsPage() {
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
          <p className="text-lg font-bold text-primary">{tournaments.filter(t => t.trending).length}</p>
          <p className="text-[11px] text-muted-foreground">Trending</p>
        </div>
        <div className="glass rounded-[14px] px-4 py-2.5 flex-1 text-center">
          <p className="text-lg font-bold text-accent">{tournaments.filter(t => t.featured).length}</p>
          <p className="text-[11px] text-muted-foreground">Featured</p>
        </div>
      </div>

      {/* Tournament list */}
      <section className="px-4 sm:px-5 pt-5 space-y-4">
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
                    src={tournament.image || '/placeholder.jpg'}
                    alt={tournament.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  {tournament.trending && (
                    <span className="absolute top-3 left-3 bg-accent/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                      🔥 Trending
                    </span>
                  )}
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
      </section>

      <BottomNav />
    </AppShell>
  )
}
