'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Star, MapPin, Clock, IndianRupee } from 'lucide-react'
import { type Turf, formatCurrency } from '@/TurfArena/lib/data'
import { SportIcon } from '@/components/sport-icon'

export function TurfCard({ turf }: { turf: Turf }) {
  return (
    <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.985 }}>
      <Link
        href={`/turfs/${turf.id}`}
        className="glass shadow-soft flex gap-4 overflow-hidden rounded-[20px] p-3"
      >
        {/* Thumbnail */}
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[14px]">
          <Image
            src={turf.image || '/placeholder.svg'}
            alt={turf.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-0.5 bg-background/70 py-1 backdrop-blur-sm">
            {turf.sports.slice(0, 2).map((s) => (
              <SportIcon key={s} sport={s} className="size-3 text-primary" />
            ))}
            {turf.sports.length > 2 && (
              <span className="text-[9px] text-muted-foreground">+{turf.sports.length - 2}</span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col justify-between py-0.5">
          <div>
            <div className="flex items-start justify-between gap-1">
              <h3 className="text-sm font-bold leading-snug">{turf.name}</h3>
              <div className="flex items-center gap-0.5 text-[11px] font-semibold">
                <Star className="size-3 fill-warning text-warning" />
                {turf.rating}
              </div>
            </div>
            <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
              <MapPin className="size-3" /> {turf.area} · {turf.distanceKm} km
            </p>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Clock className="size-3" />
              {turf.slots.length} slots today
            </span>
            <span className="flex items-baseline gap-0.5">
              <span className="text-sm font-bold text-primary">{formatCurrency(turf.pricePerHour)}</span>
              <span className="text-[10px] text-muted-foreground">/hr</span>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
