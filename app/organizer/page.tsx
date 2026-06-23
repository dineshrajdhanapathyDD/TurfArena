'use client'

import { motion } from 'framer-motion'
import { Trophy, Users, TrendingUp, DollarSign, Plus, Calendar } from 'lucide-react'
import { ProtectedRoute } from '@/components/protected-route'
import { OrganizerLayout } from '@/components/organizer-layout'
import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function OrganizerDashboard() {
  const { user } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [liveTournaments, setLiveTournaments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch real tournaments from DynamoDB
  useEffect(() => {
    async function fetchTournaments() {
      try {
        const res = await fetch('/api/tournaments')
        const data = await res.json()
        if (data.success && data.data) {
          setLiveTournaments(data.data)
        }
      } catch (e) {
        console.error('Failed to fetch tournaments:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchTournaments()
  }, [])

  const tournaments = liveTournaments.length > 0
    ? liveTournaments.map((t: any) => ({
        id: t.tournamentId,
        name: t.name,
        date: t.date || 'TBD',
        teams: t.teamsJoined || 0,
        totalSpots: t.totalSpots || 16,
        prizePool: t.prizePool || 0,
        status: t.status === 'active' ? 'Active' : t.status === 'completed' ? 'Completed' : 'Upcoming',
        participants: (t.teamsJoined || 0) * 7,
      }))
    : [
      { id: 1, name: 'City Champions League', date: 'Sat, 28 Jun', teams: 14, totalSpots: 16, prizePool: 50000, status: 'Active', participants: 125 },
      { id: 2, name: 'Weekend Premier Cup', date: 'Sun, 29 Jun', teams: 8, totalSpots: 12, prizePool: 25000, status: 'Upcoming', participants: 68 },
    ]

  const kpiCards = [
    {
      label: 'Total Tournaments',
      value: String(tournaments.length),
      change: 3,
      icon: Trophy,
      color: 'from-purple-500 to-pink-600',
      trend: 'up',
    },
    {
      label: 'Active Teams',
      value: String(tournaments.reduce((sum: number, t: any) => sum + (t.teams || 0), 0)),
      change: 12,
      icon: Users,
      color: 'from-blue-500 to-cyan-600',
      trend: 'up',
    },
    {
      label: 'Total Prize Pool',
      value: '₹' + (tournaments.reduce((sum: number, t: any) => sum + (t.prizePool || 0), 0) / 1000).toFixed(0) + 'K',
      change: 8,
      icon: DollarSign,
      color: 'from-emerald-500 to-teal-600',
      trend: 'up',
    },
    {
      label: 'Avg Rating',
      value: '4.8★',
      change: 2,
      icon: TrendingUp,
      color: 'from-orange-500 to-red-600',
      trend: 'up',
    },
  ]

  const recentActivity = [
    { id: '1', event: 'Team registered', tournament: 'City Champions League', time: '2 min ago' },
    { id: '2', event: 'Payment received', tournament: 'Weekend Premier Cup', amount: 5000, time: '15 min ago' },
    { id: '3', event: 'Tournament started', tournament: 'City Champions League', time: '1 hour ago' },
    { id: '4', event: 'New tournament created', tournament: 'Summer Finals', time: '3 hours ago' },
  ]

  return (
    <ProtectedRoute allowedRoles={['organizer']}>
      <OrganizerLayout
        title="Dashboard"
        subtitle="Manage tournaments and track performance"
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
      >
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

        {/* Tournaments Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">My Tournaments</h3>
              <p className="text-sm text-white/60 mt-1">Active and completed tournaments</p>
            </div>
            <Link href="/organizer/tournaments" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {tournaments.map((tournament, idx) => (
              <motion.div
                key={tournament.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all p-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:items-center">
                  <div>
                    <h4 className="font-semibold text-white text-sm">{tournament.name}</h4>
                    <p className="text-xs text-white/60 flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3" />
                      {tournament.date}
                    </p>
                    <span
                      className={`inline-block text-xs font-semibold mt-2 px-2.5 py-1 rounded-full ${
                        tournament.status === 'Completed'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-purple-500/20 text-purple-300'
                      }`}
                    >
                      {tournament.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-xs text-white/60 mb-1">Teams</p>
                      <p className="text-sm font-bold text-white">{tournament.teams}/{tournament.totalSpots}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-xs text-white/60 mb-1">Occupancy</p>
                      <p className="text-sm font-bold text-purple-400">{Math.round((tournament.teams / tournament.totalSpots) * 100)}%</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-xs text-white/60 mb-1">Participants</p>
                      <p className="text-sm font-bold text-pink-400">{tournament.participants}</p>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-xs text-white/60 mb-1">Prize Pool</p>
                    <p className="text-lg font-bold text-cyan-400">₹{(tournament.prizePool / 1000).toFixed(0)}K</p>
                  </div>

                  <div className="flex flex-col gap-2 justify-self-end">
                    <button className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-medium rounded-lg transition-colors">
                      Edit
                    </button>
                    <button className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-medium rounded-lg transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
              <p className="text-sm text-white/60 mt-1">Latest tournament updates</p>
            </div>
            <Link href="/organizer/tournaments" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
              View More
            </Link>
          </div>

          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-white/10 hover:border-white/20">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{activity.event}</p>
                  <p className="text-xs text-white/60">{activity.tournament}</p>
                </div>
                <div className="text-right">
                  {activity.amount && <span className="text-sm font-semibold text-emerald-400 ml-4 block">₹{activity.amount.toLocaleString()}</span>}
                  <span className="text-xs text-white/60 ml-4">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <Link href="/organizer/tournaments">
            <button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 rounded-2xl py-4 text-white font-semibold flex items-center justify-center gap-2 transition-all">
              <Plus className="w-5 h-5" />
              Create Tournament
            </button>
          </Link>
          <Link href="/organizer/analytics">
            <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 rounded-2xl py-4 text-white font-semibold flex items-center justify-center gap-2 transition-all">
              <TrendingUp className="w-5 h-5" />
              View Analytics
            </button>
          </Link>
        </motion.div>
      </OrganizerLayout>
    </ProtectedRoute>
  )
}
