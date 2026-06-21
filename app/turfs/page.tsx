'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Star, MapPin, X } from 'lucide-react'
import { AppShell, PageHeader } from '@/components/app-shell'
import { BottomNav } from '@/components/bottom-nav'
import { turfs, formatCurrency } from '@/lib/data'

export default function TurfsPage() {
  const [query, setQuery] = useState('')
  const filtered = turfs.filter(
    (t) =>
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.area.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <AppShell>
      <PageHeader title="Book a Turf" subtitle="Find your perfect venue" />

      {/* Search */}
      <div className="px-4 sm:px-5 pt-2">
        <div className="glass flex items-center gap-2.5 rounded-[16px] px-4">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search turfs by name or location..."
            className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-muted-foreground text-foreground"
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

      {/* Results count */}
      <div className="px-4 sm:px-5 pt-3">
        <p className="text-xs text-muted-foreground">
          {filtered.length} turf{filtered.length !== 1 ? 's' : ''} {query ? `matching "${query}"` : 'available'}
        </p>
      </div>

      {/* Turf list */}
      <section className="px-4 sm:px-5 pt-4 space-y-4 pb-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="flex size-16 items-center justify-center rounded-[20px] bg-surface-2">
              <Search className="size-7 text-muted-foreground" />
            </span>
            <p className="font-medium text-foreground">No turfs found</p>
            <p className="text-sm text-muted-foreground">Try a different search term</p>
          </div>
        ) : (
          filtered.map((turf, idx) => (
            <motion.div
              key={turf.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
            >
              <Link href={`/turfs/${turf.id}`}>
                <div className="glass rounded-[20px] overflow-hidden group hover:border-primary/30 transition-colors">
                  {/* Image */}
                  <div className="relative h-36 sm:h-44 bg-surface-2 overflow-hidden">
                    <Image
                      src={turf.image || '/placeholder.jpg'}
                      alt={turf.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1">
                      <Star className="size-3 fill-warning text-warning" />
                      <span className="text-white text-xs font-semibold">{turf.rating}</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-foreground">{turf.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <MapPin className="size-3" /> {turf.area} · {turf.distanceKm} km away
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-lg font-bold text-primary">
                        {formatCurrency(turf.pricePerHour)}
                        <span className="text-xs text-muted-foreground font-normal">/hr</span>
                      </span>
                      <div className="flex gap-1.5">
                        {turf.sports.slice(0, 2).map((sport) => (
                          <span key={sport} className="text-[10px] bg-primary/15 text-primary px-2 py-0.5 rounded-full font-medium">
                            {sport}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Slots */}
                    <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
                      {turf.slots.slice(0, 3).map((slot) => (
                        <span key={slot} className="text-[10px] bg-surface-2 text-muted-foreground px-2.5 py-1 rounded-full whitespace-nowrap">
                          {slot}
                        </span>
                      ))}
                      {turf.slots.length > 3 && (
                        <span className="text-[10px] text-muted-foreground py-1">
                          +{turf.slots.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
        )}
      </section>

      <BottomNav />
    </AppShell>
  )
}
