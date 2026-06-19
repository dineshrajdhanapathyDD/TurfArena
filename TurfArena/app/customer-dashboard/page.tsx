'use client'

import { motion } from 'framer-motion'
import {
  MapPin, Calendar, Clock, Star, Trophy, ChevronRight,
  Zap, TrendingUp, Bookmark, Search, Bell,
} from 'lucide-react'
import { ProtectedRoute } from '@/components/protected-route'
import { useAuth } from '@/TurfArena/lib/auth-context'
import { turfs, tournaments, formatCurrency } from '@/TurfArena/lib/data'
import Image from 'next/image'
import Link from 'next/link'

const upcomingBookings = [
  {
    id: 'b1',
    turfName: 'Greenfield Arena',
    image: '/images/turf-football-night.png',
    date: 'Sat, 21 Jun',
    time: '6:00 PM',
    sport: '⚽ Football',
    location: 'Koramangala',
  },
  {
    id: 'b2',
    turfName: 'Downtown Court',
    image: '/images/basketball-court.png',
    date: 'Sun, 22 Jun',
    time: '4:00 PM',
    sport: '🏀 Basketball',
    location: 'Indiranagar',
  },
]

const quickActions = [
  { icon: MapPin, label: 'Book Turf', href: '/turfs-explore', color: 'from-green-500 to-emerald-600' },
  { icon: Trophy, label: 'Tournaments', href: '/tournaments', color: 'from-orange-500 to-red-500' },
  { icon: Calendar, label: 'My Bookings', href: '/my-bookings', color: 'from-blue-500 to-indigo-600' },
  { icon: TrendingUp, label: 'Stats', href: '/stats', color: 'from-purple-500 to-violet-600' },
]

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
}

export default function CustomerDashboard() {
  const { user } = useAuth()
  const firstName = user?.name?.split(' ')[0] || 'Player'

  return (
    <ProtectedRoute allowedRoles={['customer', 'captain']}>
      <div className="min-h-screen w-full bg-[#f0f4ff]">

        {/* ═══════════════════════════════════════════
            HERO HEADER
        ═══════════════════════════════════════════ */}
        <div className="relative bg-gradient-to-br from-[#0f1b2d] via-[#132a3e] to-[#0a2318] overflow-hidden">
          {/* Ambient glows */}
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-green-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-blue-500/10 rounded-full blur-3xl" />

          <div className="relative max-w-5xl mx-auto px-5 sm:px-8 pt-16 pb-8">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <motion.p
                  {...fadeUp}
                  transition={{ delay: 0.05 }}
                  className="text-green-400 text-sm font-medium mb-1"
                >
                  Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'} 👋
                </motion.p>
                <motion.h1
                  {...fadeUp}
                  transition={{ delay: 0.1 }}
                  className="text-2xl sm:text-3xl font-bold text-white"
                >
                  {firstName}
                </motion.h1>
              </div>
              <motion.div
                {...fadeUp}
                transition={{ delay: 0.15 }}
                className="flex items-center gap-3"
              >
                <Link
                  href="/notifications"
                  className="relative p-2.5 rounded-xl bg-white/10 hover:bg-white/15 transition-colors"
                >
                  <Bell className="w-5 h-5 text-white" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                </Link>
                <Link href="/profile">
                  <Image
                    src={user?.avatar || '/images/player-1.png'}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-green-500/40"
                  />
                </Link>
              </motion.div>
            </div>

            {/* Credit Card */}
            <motion.div
              {...fadeUp}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-green-600/20 to-emerald-600/10 border border-green-500/20 rounded-2xl p-5 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-300/80 text-xs font-medium mb-1">Available Credits</p>
                  <p className="text-3xl sm:text-4xl font-bold text-white">
                    ₹{(user?.credits || 5000).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500/30">
                    <span className="text-green-400 text-xs font-semibold flex items-center gap-1">
                      <Zap className="w-3 h-3" /> Active
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/10 text-xs text-white/50">
                <span>47 Matches Played</span>
                <span>·</span>
                <span>68% Win Rate</span>
                <span>·</span>
                <span>4 Win Streak 🔥</span>
              </div>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              {...fadeUp}
              transition={{ delay: 0.25 }}
              className="mt-5"
            >
              <Link href="/turfs-explore">
                <div className="flex items-center gap-3 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl px-4 py-3 transition-colors cursor-pointer">
                  <Search className="w-4 h-4 text-white/50" />
                  <span className="text-sm text-white/50">Search turfs, tournaments...</span>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            QUICK ACTIONS
        ═══════════════════════════════════════════ */}
        <div className="max-w-5xl mx-auto px-5 sm:px-8 -mt-1">
          <motion.div
            {...fadeUp}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-4 gap-3 sm:gap-4"
          >
            {quickActions.map((action, idx) => {
              const Icon = action.icon
              return (
                <Link key={action.label} href={action.href}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + idx * 0.05 }}
                    className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:shadow-md transition-shadow group"
                  >
                    <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-[11px] sm:text-xs font-medium text-gray-700 text-center leading-tight">
                      {action.label}
                    </span>
                  </motion.div>
                </Link>
              )
            })}
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════════
            UPCOMING BOOKINGS
        ═══════════════════════════════════════════ */}
        <div className="max-w-5xl mx-auto px-5 sm:px-8 mt-7">
          <motion.div {...fadeUp} transition={{ delay: 0.35 }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Upcoming Bookings</h2>
              <Link href="/my-bookings" className="text-sm font-medium text-green-600 hover:text-green-700 flex items-center gap-0.5 transition-colors">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-3">
              {upcomingBookings.map((booking, idx) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + idx * 0.08 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center">
                    <div className="relative w-24 h-20 sm:w-28 sm:h-24 flex-shrink-0">
                      <Image
                        src={booking.image}
                        alt={booking.turfName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 p-3 sm:p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{booking.turfName}</h3>
                          <p className="text-xs text-gray-500 mt-0.5">{booking.sport} · {booking.location}</p>
                        </div>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200 flex-shrink-0">
                          Upcoming
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {booking.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {booking.time}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════════
            POPULAR TURFS
        ═══════════════════════════════════════════ */}
        <div className="max-w-5xl mx-auto px-5 sm:px-8 mt-8">
          <motion.div {...fadeUp} transition={{ delay: 0.45 }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Popular Turfs</h2>
              <Link href="/turfs-explore" className="text-sm font-medium text-green-600 hover:text-green-700 flex items-center gap-0.5 transition-colors">
                See All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
              {turfs.slice(0, 4).map((turf, idx) => (
                <motion.div
                  key={turf.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + idx * 0.07 }}
                  className="min-w-[200px] sm:min-w-[240px] flex-shrink-0"
                >
                  <Link href="/customer-dashboard">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
                      <div className="relative h-32 sm:h-36 bg-gray-900">
                        <Image
                          src={turf.image}
                          alt={turf.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="text-white text-xs font-semibold">{turf.rating}</span>
                        </div>
                      </div>
                      <div className="p-3 sm:p-4">
                        <h3 className="font-semibold text-gray-900 text-sm">{turf.name}</h3>
                        <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {turf.area} · {turf.distanceKm} km
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-bold text-gray-900">{formatCurrency(turf.pricePerHour)}<span className="text-xs text-gray-400 font-normal">/hr</span></span>
                          <span className="text-[10px] text-gray-400">{turf.reviews} reviews</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════════
            FEATURED TOURNAMENTS
        ═══════════════════════════════════════════ */}
        <div className="max-w-5xl mx-auto px-5 sm:px-8 mt-8 pb-10">
          <motion.div {...fadeUp} transition={{ delay: 0.55 }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Featured Tournaments</h2>
              <Link href="/tournaments" className="text-sm font-medium text-green-600 hover:text-green-700 flex items-center gap-0.5 transition-colors">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tournaments.slice(0, 2).map((t, idx) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + idx * 0.08 }}
                >
                  <Link href={`/tournaments/${t.id}`}>
                    <div className="relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
                      <div className="relative h-40 sm:h-48 bg-gray-900">
                        <Image
                          src={t.image}
                          alt={t.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        {t.trending && (
                          <div className="absolute top-3 left-3 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            🔥 Trending
                          </div>
                        )}
                        <div className="absolute bottom-3 left-3 right-3">
                          <h3 className="font-bold text-white text-base sm:text-lg">{t.name}</h3>
                          <p className="text-xs text-white/80 mt-0.5">{t.format} · {t.city}</p>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between text-sm">
                          <div>
                            <p className="text-gray-500 text-xs">Prize Pool</p>
                            <p className="font-bold text-gray-900">{formatCurrency(t.prizePool)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Entry Fee</p>
                            <p className="font-bold text-gray-900">{formatCurrency(t.entryFee)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Spots</p>
                            <p className="font-bold text-gray-900">{t.teamsJoined}/{t.totalSpots}</p>
                          </div>
                        </div>
                        {/* Progress bar */}
                        <div className="mt-3 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-orange-500 rounded-full transition-all"
                            style={{ width: `${(t.teamsJoined / t.totalSpots) * 100}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-gray-400 mt-1.5 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {t.date}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
