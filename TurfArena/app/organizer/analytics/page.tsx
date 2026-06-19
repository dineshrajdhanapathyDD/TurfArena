'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Users, Trophy, DollarSign } from 'lucide-react'
import { ProtectedRoute } from '@/components/protected-route'
import { OrganizerLayout } from '@/components/organizer-layout'
import { useAuth } from '@/lib/auth-context'
import { useState } from 'react'

export default function AnalyticsPage() {
  const { user } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  const analyticsData = [
    { month: 'Jan', tournaments: 2, teams: 32, revenue: 45000 },
    { month: 'Feb', tournaments: 2, teams: 40, revenue: 52000 },
    { month: 'Mar', tournaments: 3, teams: 58, revenue: 68000 },
    { month: 'Apr', tournaments: 3, teams: 65, revenue: 75000 },
    { month: 'May', tournaments: 4, teams: 85, revenue: 98000 },
    { month: 'Jun', tournaments: 5, teams: 125, revenue: 142000 },
  ]

  const kpis = [
    {
      label: 'Total Registrations',
      value: '1,847',
      change: 18,
      icon: Users,
      color: 'from-blue-500 to-cyan-600',
    },
    {
      label: 'Avg Tournament Size',
      value: '38 Teams',
      change: 12,
      icon: Trophy,
      color: 'from-purple-500 to-pink-600',
    },
    {
      label: 'Monthly Revenue',
      value: '₹14.2L',
      change: 22,
      icon: DollarSign,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      label: 'Growth Rate',
      value: '+28%',
      change: 15,
      icon: TrendingUp,
      color: 'from-orange-500 to-red-600',
    },
  ]

  return (
    <ProtectedRoute allowedRoles={['organizer']}>
      <OrganizerLayout
        title="Analytics"
        subtitle="Track tournament performance and growth"
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
      >
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon
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
                    <span className="text-sm font-medium text-white/70">{kpi.label}</span>
                    <div className={`p-2.5 rounded-lg bg-gradient-to-br ${kpi.color} text-white`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-3xl font-bold text-white">{kpi.value}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300">
                      <TrendingUp className="w-3 h-3" />
                      +{kpi.change}%
                    </span>
                    <span className="text-xs text-white/60">vs last period</span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 backdrop-blur-xl"
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white">Performance Trend</h3>
            <p className="text-sm text-white/60 mt-1">Last 6 months overview</p>
          </div>

          <div className="space-y-6">
            {/* Revenue Trend */}
            <div>
              <div className="flex items-end justify-between h-32 gap-2 mb-4">
                {analyticsData.map((data, idx) => {
                  const maxRevenue = Math.max(...analyticsData.map(d => d.revenue))
                  return (
                    <motion.div
                      key={idx}
                      initial={{ height: 0 }}
                      animate={{ height: `${(data.revenue / maxRevenue) * 100}%` }}
                      transition={{ delay: 0.5 + idx * 0.05, duration: 0.6 }}
                      whileHover={{ scale: 1.05 }}
                      className="flex-1 rounded-t-lg bg-gradient-to-t from-cyan-500 to-cyan-400 hover:shadow-lg hover:shadow-cyan-500/50 transition-all cursor-pointer group relative"
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 px-3 py-1 rounded-lg whitespace-nowrap text-xs text-white border border-white/10 z-10">
                        ₹{(data.revenue / 1000).toFixed(0)}K
                      </div>
                    </motion.div>
                  )
                })}
              </div>
              <div className="flex justify-between text-xs text-white/60">
                {analyticsData.map((data) => (
                  <span key={data.month}>{data.month}</span>
                ))}
              </div>
              <p className="text-sm text-white/70 mt-4">Revenue by Month</p>
            </div>

            {/* Teams Trend */}
            <div className="pt-6 border-t border-white/10">
              <div className="flex items-end justify-between h-32 gap-2 mb-4">
                {analyticsData.map((data, idx) => {
                  const maxTeams = Math.max(...analyticsData.map(d => d.teams))
                  return (
                    <motion.div
                      key={idx}
                      initial={{ height: 0 }}
                      animate={{ height: `${(data.teams / maxTeams) * 100}%` }}
                      transition={{ delay: 0.5 + idx * 0.05, duration: 0.6 }}
                      whileHover={{ scale: 1.05 }}
                      className="flex-1 rounded-t-lg bg-gradient-to-t from-purple-500 to-purple-400 hover:shadow-lg hover:shadow-purple-500/50 transition-all cursor-pointer group relative"
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 px-3 py-1 rounded-lg whitespace-nowrap text-xs text-white border border-white/10 z-10">
                        {data.teams} teams
                      </div>
                    </motion.div>
                  )
                })}
              </div>
              <div className="flex justify-between text-xs text-white/60">
                {analyticsData.map((data) => (
                  <span key={data.month}>{data.month}</span>
                ))}
              </div>
              <p className="text-sm text-white/70 mt-4">Teams Registered by Month</p>
            </div>
          </div>
        </motion.div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-white mb-4">Key Metrics</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/70">Total Tournaments</span>
                <span className="font-semibold text-white">19</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Total Registrations</span>
                <span className="font-semibold text-white">1,847</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Avg Rating</span>
                <span className="font-semibold text-white">4.8★</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Completion Rate</span>
                <span className="font-semibold text-white">94%</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-white mb-4">Revenue Breakdown</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/70">Registration Fees</span>
                <span className="font-semibold text-cyan-400">₹8.5L</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Prize Pool Contributions</span>
                <span className="font-semibold text-emerald-400">₹4.2L</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Sponsorships</span>
                <span className="font-semibold text-purple-400">₹2.1L</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <span className="text-white/70 font-semibold">Total Revenue</span>
                <span className="font-bold text-white">₹14.8L</span>
              </div>
            </div>
          </div>
        </motion.div>
      </OrganizerLayout>
    </ProtectedRoute>
  )
}
