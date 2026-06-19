'use client'

import { motion } from 'framer-motion'
import { Users, Trophy, DollarSign, TrendingUp, Plus, Edit2, Trash2, Calendar } from 'lucide-react'
import { ProtectedRoute } from '@/components/protected-route'
import { OrganizerLayout } from '@/components/organizer-layout'
import { useAuth } from '@/TurfArena/lib/auth-context'
import Link from 'next/link'
import { useState } from 'react'

export default function TournamentsPage() {
  const { user } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  const tournaments = [
    {
      id: '1',
      name: 'City Champions League',
      date: 'Sat, 28 Jun 2024',
      teams: 14,
      totalSpots: 16,
      prizePool: 50000,
      registrations: 125,
      status: 'Active',
      revenue: 45000,
    },
    {
      id: '2',
      name: 'Weekend Premier Cup',
      date: 'Sun, 29 Jun 2024',
      teams: 8,
      totalSpots: 12,
      prizePool: 25000,
      registrations: 68,
      status: 'Active',
      revenue: 22000,
    },
    {
      id: '3',
      name: 'Summer Finals',
      date: 'Sat, 21 Jul 2024',
      teams: 0,
      totalSpots: 20,
      prizePool: 75000,
      registrations: 0,
      status: 'Upcoming',
      revenue: 0,
    },
  ]

  const stats = {
    total: tournaments.length,
    active: tournaments.filter(t => t.status === 'Active').length,
    totalTeams: tournaments.reduce((sum, t) => sum + t.teams, 0),
    totalRevenue: tournaments.reduce((sum, t) => sum + t.revenue, 0),
  }

  return (
    <ProtectedRoute allowedRoles={['organizer']}>
      <OrganizerLayout
        title="Tournaments"
        subtitle="Create and manage all your tournaments"
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
      >
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-white/70">Total Tournaments</span>
              <Trophy className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
            <p className="text-xs text-white/60 mt-2">{stats.active} active</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-white/70">Teams Registered</span>
              <Users className="w-5 h-5 text-pink-400" />
            </div>
            <p className="text-3xl font-bold text-white">{stats.totalTeams}</p>
            <p className="text-xs text-white/60 mt-2">Across all tournaments</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-white/70">Total Revenue</span>
              <DollarSign className="w-5 h-5 text-cyan-400" />
            </div>
            <p className="text-3xl font-bold text-white">₹{(stats.totalRevenue / 100000).toFixed(2)}L</p>
            <p className="text-xs text-emerald-400 mt-2">+12% vs last month</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-white/70">Avg Rating</span>
              <TrendingUp className="w-5 h-5 text-orange-400" />
            </div>
            <p className="text-3xl font-bold text-white">4.8★</p>
            <p className="text-xs text-white/60 mt-2">Based on 1.2K reviews</p>
          </motion.div>
        </div>

        {/* Tournaments List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">All Tournaments</h3>
              <p className="text-sm text-white/60 mt-1">View and manage all your tournaments</p>
            </div>
          </div>

          <div className="space-y-3">
            {tournaments.map((tournament, idx) => (
              <motion.div
                key={tournament.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.05 }}
                className="rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all p-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:items-center">
                  <div>
                    <h4 className="font-semibold text-white text-sm">{tournament.name}</h4>
                    <p className="text-xs text-white/60 flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3" />
                      {tournament.date}
                    </p>
                    <span
                      className={`inline-block text-xs font-semibold mt-2 px-2.5 py-1 rounded-full ${
                        tournament.status === 'Active'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-blue-500/20 text-blue-300'
                      }`}
                    >
                      {tournament.status}
                    </span>
                  </div>

                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-xs text-white/60 mb-1">Teams</p>
                    <p className="text-sm font-bold text-white">{tournament.teams}/{tournament.totalSpots}</p>
                  </div>

                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-xs text-white/60 mb-1">Prize Pool</p>
                    <p className="text-sm font-bold text-cyan-400">₹{(tournament.prizePool / 1000).toFixed(0)}K</p>
                  </div>

                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-xs text-white/60 mb-1">Revenue</p>
                    <p className="text-sm font-bold text-emerald-400">₹{(tournament.revenue / 1000).toFixed(0)}K</p>
                  </div>

                  <div className="flex gap-2 md:justify-end">
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4 text-white/60" />
                    </button>
                    <button className="p-2 hover:bg-red-500/10 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4 text-white/60" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </OrganizerLayout>
    </ProtectedRoute>
  )
}
