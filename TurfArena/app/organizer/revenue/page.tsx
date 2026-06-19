'use client'

import { motion } from 'framer-motion'
import { DollarSign, TrendingUp, Zap, AlertCircle } from 'lucide-react'
import { ProtectedRoute } from '@/components/protected-route'
import { OrganizerLayout } from '@/components/organizer-layout'
import { useAuth } from '@/TurfArena/lib/auth-context'
import { useState } from 'react'

export default function RevenuePage() {
  const { user } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  const revenues = [
    { source: 'Registration Fees', amount: 850000, percentage: 57, color: 'from-cyan-500 to-blue-600' },
    { source: 'Sponsorships', amount: 210000, percentage: 14, color: 'from-purple-500 to-pink-600' },
    { source: 'Prize Pool Contributions', amount: 420000, percentage: 28, color: 'from-emerald-500 to-teal-600' },
  ]

  const revenueData = [
    { month: 'Jan', amount: 125000 },
    { month: 'Feb', amount: 145000 },
    { month: 'Mar', amount: 175000 },
    { month: 'Apr', amount: 195000 },
    { month: 'May', amount: 225000 },
    { month: 'Jun', amount: 285000 },
  ]

  const totalRevenue = revenues.reduce((sum, r) => sum + r.amount, 0)
  const maxRevenue = Math.max(...revenueData.map(d => d.amount))

  return (
    <ProtectedRoute allowedRoles={['organizer']}>
      <OrganizerLayout
        title="Revenue"
        subtitle="Track all earnings and revenue streams"
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
      >
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-white/70">Total Revenue</span>
              <DollarSign className="w-5 h-5 text-cyan-400" />
            </div>
            <p className="text-3xl font-bold text-white">₹{(totalRevenue / 100000).toFixed(2)}L</p>
            <p className="text-xs text-emerald-400 mt-2">+18% vs last month</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-white/70">This Month</span>
              <Zap className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-3xl font-bold text-white">₹2.85L</p>
            <p className="text-xs text-white/60 mt-2">June 2024</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-white/70">Avg Per Tournament</span>
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-3xl font-bold text-white">₹7.8L</p>
            <p className="text-xs text-white/60 mt-2">Based on 19 tournaments</p>
          </motion.div>
        </div>

        {/* Revenue Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 backdrop-blur-xl"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Revenue Trend</h3>
          <div className="flex items-end justify-between h-64 gap-2">
            {revenueData.map((data, idx) => (
              <motion.div
                key={idx}
                initial={{ height: 0 }}
                animate={{ height: `${(data.amount / maxRevenue) * 100}%` }}
                transition={{ delay: 0.4 + idx * 0.05, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
                className="flex-1 rounded-t-lg bg-gradient-to-t from-cyan-500 to-cyan-400 hover:shadow-lg hover:shadow-cyan-500/50 transition-all cursor-pointer group relative"
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 px-3 py-1 rounded-lg whitespace-nowrap text-xs text-white border border-white/10">
                  ₹{(data.amount / 100000).toFixed(1)}L
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-between mt-6 pt-6 border-t border-white/10 text-xs text-white/60">
            {revenueData.map((data) => (
              <span key={data.month}>{data.month}</span>
            ))}
          </div>
        </motion.div>

        {/* Revenue Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 backdrop-blur-xl"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Revenue by Source</h3>
          <div className="space-y-4">
            {revenues.map((revenue, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/70">{revenue.source}</span>
                  <span className="text-sm font-semibold text-white">₹{(revenue.amount / 100000).toFixed(1)}L ({revenue.percentage}%)</span>
                </div>
                <div className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${revenue.percentage}%` }}
                    transition={{ delay: 0.6 + idx * 0.05, duration: 0.8 }}
                    className={`h-full rounded-full bg-gradient-to-r ${revenue.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </OrganizerLayout>
    </ProtectedRoute>
  )
}
