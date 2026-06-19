'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Flame, Star, Users, MapPin, Trophy } from 'lucide-react'
import { type Tournament, formatCurrency } from '@/TurfArena/lib/data'
import { SportIcon } from '@/components/sport-icon'

export function TournamentCard({ t }: { t: Tournament }) {
  const spotsLeft = t.totalSpots - t.teamsJoined
  const pct = Math.round((t.teamsJoined / t.totalSpots) * 100)
  const almostFull = pct >= 75

  return (
    <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.985 }}>
      <Link
        href={`/tournaments/${t.id}`}
        className="glass shadow-soft block overflow-hidden rounded-[20px]"
      >
        <div className="relative h-40 w-full">
          <Image
            src={t.image || '/placeholder.svg'}
            alt={t.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

          {/* Badges */}
          <div className="absolute left-3 top-3 flex gap-1.5">
            {t.trending && (
              <span className="flex items-center gap-1 rounded-full bg-accent/90 px-2.5 py-1 text-[11px] font-semibold text-accent-foreground backdrop-blur-sm">
                <Flame className="size-3" /> Hot
              </span>
            )}
            {t.featured && (
              <span className="flex items-center gap-1 rounded-full bg-secondary/90 px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground backdrop-blur-sm">
                <Star className="size-3" /> Featured
              </span>
            )}
          </div>

          {/* Sport + format badge */}
          <div className="absolute bottom-3 left-3 right-3">
            <div className="mb-1.5 flex items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-background/70 px-2.5 py-1 text-[11px] backdrop-blur-sm">
                <SportIcon sport={t.sport} className="size-3 text-primary" />
                <span className="text-foreground/80">{t.format}</span>
              </span>
              <span className="flex items-center gap-1 rounded-full bg-background/70 px-2.5 py-1 text-[11px] backdrop-blur-sm">
                <MapPin className="size-3 text-muted-foreground" />
                <span className="text-foreground/80">{t.city}</span>
              </span>
            </div>
            <h3 className="text-base font-bold leading-snug text-balance drop-shadow-sm">
              {t.name}
            </h3>
          </div>
        </div>

        <div className="p-4 pt-3">
          {/* Prize + entry row */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5">
              <Trophy className="size-3.5 text-success" />
              <span className="font-bold text-success">{formatCurrency(t.prizePool)}</span>
              <span className="text-[11px] text-muted-foreground">prize pool</span>
            </div>
            <span className="rounded-full bg-surface-2 px-2.5 py-1 text-[11px] font-medium">
              {formatCurrency(t.entryFee)} entry
            </span>
          </div>

          {/* Spots progress */}
          <div className="mt-3">
            <div className="mb-1.5 flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Users className="size-3" />
                {t.teamsJoined}/{t.totalSpots} teams
              </span>
              <span className={almostFull ? 'font-medium text-warning' : 'text-muted-foreground'}>
                {almostFull ? `${spotsLeft} spots left!` : `${spotsLeft} spots open`}
              </span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-surface-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={`h-full rounded-full ${almostFull ? 'bg-warning' : 'bg-primary'}`}
              />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
