'use client'

import { motion } from 'framer-motion'
import { MapPin, Star, BarChart3, Users, DollarSign, TrendingUp, Plus, Clock, Edit2, Trash2 } from 'lucide-react'
import { ProtectedRoute } from '@/components/protected-route'
import { OwnerLayout } from '@/components/owner-layout'
import { useAuth } from '@/TurfArena/lib/auth-context'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function TurfsPage() {
  const { user } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  const turfs = [
    {
      id: '1',
      name: 'Greenfield Arena',
      location: 'Koramangala',
      image: '/images/turf-football-night.png',
      rating: 4.9,
      reviews: 312,
      totalBookings: 142,
      revenue: 170400,
      occupancy: 85,
      capacity: 100,
      sports: ['Football', 'Cricket'],
      thisMonthRevenue: 42000,
      status: 'active',
    },
    {
      id: '2',
      name: 'Downtown Court',
      location: 'Indiranagar',
      image: '/images/basketball-court.png',
      rating: 4.7,
      reviews: 188,
      totalBookings: 98,
      revenue: 88200,
      occupancy: 72,
      capacity: 80,
      sports: ['Basketball', 'Volleyball'],
      thisMonthRevenue: 22500,
      status: 'active',
    },
    {
      id: '3',
      name: 'Turf Park Central',
      location: 'HSR Layout',
      image: '/images/turf-arena-1.png',
      rating: 4.8,
      reviews: 256,
      totalBookings: 116,
      revenue: 127600,
      occupancy: 78,
      capacity: 90,
      sports: ['Football', 'Badminton'],
      thisMonthRevenue: 31500,
      status: 'active',
    },
  ]

  const totalRevenue = turfs.reduce((sum, t) => sum + t.thisMonthRevenue, 0)
  const avgRating = (turfs.reduce((sum, t) => sum + t.rating, 0) / turfs.length).toFixed(1)
  const avgOccupancy = Math.round(turfs.reduce((sum, t) => sum + t.occupancy, 0) / turfs.length)

  return (
    <ProtectedRoute allowedRoles={['owner']}>
      <OwnerLayout title="My Turfs" subtitle="Manage and monitor all your venues" selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod}>
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-white/70">Total Turfs</span>
              <div className="p-2.5 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{turfs.length}</p>
            <p className="text-xs text-white/60 mt-2">All active venues</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-white/70">Revenue (This Month)</span>
              <div className="p-2.5 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">₹{(totalRevenue / 100000).toFixed(2)}L</p>
            <p className="text-xs text-emerald-400 mt-2">+8% vs last month</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-white/70">Avg Rating</span>
              <div className="p-2.5 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 text-white">
                <Star className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{avgRating}★</p>
            <p className="text-xs text-white/60 mt-2">Based on {turfs.reduce((sum, t) => sum + t.reviews, 0)} reviews</p>
          </motion.div>
        </div>

        {/* Turfs List */}
        <div className="space-y-4">
          {turfs.map((turf, idx) => (
            <motion.div
              key={turf.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
              className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 backdrop-blur-xl hover:border-white/30 transition-all"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Image and Basic Info */}
                <div>
                  <div className="relative h-40 bg-white/10 rounded-xl overflow-hidden mb-4">
                    <Image src={turf.image} alt={turf.name} fill className="object-cover" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{turf.name}</h3>
                  <p className="text-sm text-white/60 flex items-center gap-1 mt-1">
                    <MapPin className="w-4 h-4" />
                    {turf.location}
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="md:col-span-3">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    <div className="bg-white/5 rounded-lg p-4">
                      <p className="text-xs text-white/60 mb-2">Rating</p>
                      <p className="text-xl font-bold text-white">{turf.rating}★</p>
                      <p className="text-xs text-white/50 mt-1">{turf.reviews} reviews</p>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4">
                      <p className="text-xs text-white/60 mb-2">Revenue</p>
                      <p className="text-xl font-bold text-cyan-400">₹{(turf.thisMonthRevenue / 1000).toFixed(0)}K</p>
                      <p className="text-xs text-white/50 mt-1">This month</p>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4">
                      <p className="text-xs text-white/60 mb-2">Occupancy</p>
                      <p className="text-xl font-bold text-emerald-400">{turf.occupancy}%</p>
                      <div className="w-full bg-white/10 rounded-full h-1.5 mt-2">
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full rounded-full" style={{ width: `${turf.occupancy}%` }} />
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4">
                      <p className="text-xs text-white/60 mb-2">Bookings</p>
                      <p className="text-xl font-bold text-purple-400">{turf.totalBookings}</p>
                      <p className="text-xs text-white/50 mt-1">All time</p>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4">
                      <p className="text-xs text-white/60 mb-2">Total Revenue</p>
                      <p className="text-xl font-bold text-blue-400">₹{(turf.revenue / 100000).toFixed(1)}L</p>
                      <p className="text-xs text-white/50 mt-1">Since opening</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                    <button className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium text-white transition-colors flex items-center justify-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Analytics
                    </button>
                    <button className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium text-white transition-colors flex items-center justify-center gap-2">
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button className="px-4 py-2 bg-white/10 hover:bg-red-500/20 rounded-lg text-sm font-medium text-white hover:text-red-300 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add New Turf */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-2xl py-4 text-white font-semibold flex items-center justify-center gap-2 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add New Turf
        </motion.button>
      </OwnerLayout>
    </ProtectedRoute>
  )
}
