'use client'

import { motion } from 'framer-motion'
import { DollarSign, Calendar, TrendingUp, Target, Activity, MoreHorizontal, MapPin } from 'lucide-react'
import { ProtectedRoute } from '@/components/protected-route'
import { OwnerLayout } from '@/components/owner-layout'
import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function OwnerDashboard() {
  const { user } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  const kpiCards = [
    {
      label: 'Total Revenue',
      value: '₹3.8L',
      change: 12,
      icon: DollarSign,
      color: 'from-emerald-500 to-teal-600',
      trend: 'up',
    },
    {
      label: 'Total Bookings',
      value: '356',
      change: 8,
      icon: Calendar,
      color: 'from-blue-500 to-cyan-600',
      trend: 'up',
    },
    {
      label: 'Active Turfs',
      value: '3',
      change: 0,
      icon: Target,
      color: 'from-purple-500 to-pink-600',
      trend: 'up',
    },
    {
      label: 'Occupancy Rate',
      value: '78%',
      change: 5,
      icon: Activity,
      color: 'from-orange-500 to-red-600',
      trend: 'up',
    },
  ]

  const turfs = [
    {
      id: '1',
      name: 'Greenfield Arena',
      location: 'Koramangala',
      revenue: 42000,
      occupancy: 85,
      bookings: 142,
      image: '/images/turf-football-night.png',
    },
    {
      id: '2',
      name: 'Downtown Court',
      location: 'Indiranagar',
      revenue: 22500,
      occupancy: 72,
      bookings: 98,
      image: '/images/basketball-court.png',
    },
    {
      id: '3',
      name: 'Turf Park Central',
      location: 'HSR Layout',
      revenue: 31500,
      occupancy: 78,
      bookings: 116,
      image: '/images/turf-arena-1.png',
    },
  ]

  const recentBookings = [
    { id: '1', turf: 'Greenfield Arena', customer: 'Arjun Mehta', amount: 1200, time: '2 min ago' },
    { id: '2', turf: 'Downtown Court', customer: 'Priya Sharma', amount: 900, time: '15 min ago' },
    { id: '3', turf: 'Turf Park Central', customer: 'Rajesh Kumar', amount: 1650, time: '1 hour ago' },
    { id: '4', turf: 'Greenfield Arena', customer: 'Neha Iyer', amount: 1200, time: '3 hours ago' },
  ]

  return (
    <ProtectedRoute allowedRoles={['owner']}>
      <OwnerLayout title="Dashboard" subtitle="Welcome back, manage your turfs and revenue" selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod}>
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((card, idx) => {
            const Icon = card.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 backdrop-blur-xl hover:border-white/30 transition-all"
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-white/70">{card.label}</span>
                    <div className={`p-2.5 rounded-lg bg-gradient-to-br ${card.color} text-white`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-3xl font-bold text-white">{card.value}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300">
                      <TrendingUp className="w-3 h-3" />
                      +{card.change}%
                    </span>
                    <span className="text-xs text-white/60">vs last month</span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Turfs Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">My Turfs</h3>
              <p className="text-sm text-white/60 mt-1">Performance overview</p>
            </div>
            <Link href="/owner/turfs" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {turfs.map((turf, idx) => (
              <motion.div
                key={turf.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="rounded-xl bg-white/5 border border-white/10 overflow-hidden hover:border-white/20 transition-all"
              >
                <div className="relative h-32 bg-white/10">
                  <Image src={turf.image} alt={turf.name} fill className="object-cover" />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-white text-sm">{turf.name}</h4>
                  <p className="text-xs text-white/60 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {turf.location}
                  </p>

                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <div className="bg-white/5 rounded-lg p-2">
                      <p className="text-xs text-white/60">Revenue</p>
                      <p className="text-sm font-bold text-cyan-400">₹{(turf.revenue / 1000).toFixed(0)}K</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2">
                      <p className="text-xs text-white/60">Occupancy</p>
                      <p className="text-sm font-bold text-emerald-400">{turf.occupancy}%</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2">
                      <p className="text-xs text-white/60">Bookings</p>
                      <p className="text-sm font-bold text-purple-400">{turf.bookings}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Recent Bookings</h3>
              <p className="text-sm text-white/60 mt-1">Latest transactions</p>
            </div>
            <Link href="/owner/bookings" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-white/10 hover:border-white/20">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{booking.turf}</p>
                  <p className="text-xs text-white/60">{booking.customer} • {booking.time}</p>
                </div>
                <span className="text-sm font-semibold text-emerald-400 ml-4 flex-shrink-0">+₹{booking.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </OwnerLayout>
    </ProtectedRoute>
  )
}
