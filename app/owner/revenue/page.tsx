'use client'

import { motion } from 'framer-motion'
import { BarChart3, Bell, Plus, Search, Settings, TrendingUp, Calendar, Filter, MoreHorizontal, DollarSign, Users, ShoppingCart, Target } from 'lucide-react'
import { ProtectedRoute } from '@/components/protected-route'
import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'
import { useState } from 'react'

interface KPICard {
  label: string
  value: string
  change: number
  icon: any
  color: string
  trend: 'up' | 'down'
}

interface RevenueData {
  month: string
  revenue: number
}

interface ActivityItem {
  id: string
  type: 'booking' | 'payment' | 'refund'
  description: string
  amount: number
  time: string
}

export default function RevenueDashboard() {
  const { user } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const kpiCards: KPICard[] = [
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
      value: '1,240',
      change: 8,
      icon: Target,
      color: 'from-blue-500 to-cyan-600',
      trend: 'up',
    },
    {
      label: 'Avg Order Value',
      value: '₹3.2K',
      change: 5,
      icon: ShoppingCart,
      color: 'from-purple-500 to-pink-600',
      trend: 'up',
    },
    {
      label: 'Active Customers',
      value: '856',
      change: -2,
      icon: Users,
      color: 'from-orange-500 to-red-600',
      trend: 'down',
    },
  ]

  const revenueData: RevenueData[] = [
    { month: 'Jan', revenue: 32000 },
    { month: 'Feb', revenue: 38000 },
    { month: 'Mar', revenue: 42000 },
    { month: 'Apr', revenue: 45000 },
    { month: 'May', revenue: 48000 },
    { month: 'Jun', revenue: 52000 },
  ]

  const activityItems: ActivityItem[] = [
    { id: '1', type: 'booking', description: 'Greenfield Arena booking', amount: 1200, time: '2 min ago' },
    { id: '2', type: 'payment', description: 'Payment received', amount: 5000, time: '15 min ago' },
    { id: '3', type: 'booking', description: 'Downtown Court booking', amount: 900, time: '1 hour ago' },
    { id: '4', type: 'refund', description: 'Refund processed', amount: -800, time: '3 hours ago' },
    { id: '5', type: 'booking', description: 'Turf Park booking', amount: 1650, time: '5 hours ago' },
  ]

  const revenueByCategory = [
    { name: 'Turf Bookings', value: 245000, percentage: 65 },
    { name: 'Merchandise', value: 85000, percentage: 22 },
    { name: 'Coaching', value: 38000, percentage: 10 },
    { name: 'Events', value: 12000, percentage: 3 },
  ]

  const maxRevenue = Math.max(...revenueData.map(d => d.revenue))

  const sidebarItems = [
    { label: 'Dashboard', href: '/owner', icon: BarChart3 },
    { label: 'Revenue', href: '/owner/revenue', icon: DollarSign, active: true },
    { label: 'Bookings', href: '/owner/bookings', icon: Calendar },
    { label: 'Customers', href: '/owner/customers', icon: Users },
    { label: 'Analytics', href: '/owner/analytics', icon: TrendingUp },
    { label: 'Settings', href: '/owner/settings', icon: Settings },
  ]

  return (
    <ProtectedRoute allowedRoles={['owner']}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
        {/* Top Navigation Bar */}
        <div className="sticky top-0 z-40 backdrop-blur-xl bg-slate-900/80 border-b border-white/10">
          <div className="h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
            {/* Left section */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <BarChart3 className="w-5 h-5 text-white" />
              </button>
              <h1 className="text-lg sm:text-xl font-bold text-white hidden sm:block">Revenue</h1>
            </div>

            {/* Center - Search */}
            <div className="hidden md:flex flex-1 max-w-xs">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-500/50 transition-colors"
                />
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5 text-white/60 hover:text-white" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-500 rounded-full" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-white/60 hover:text-white" />
              </button>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center cursor-pointer">
                <span className="text-sm font-bold text-white">{user?.name.charAt(0).toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
          {/* Sidebar */}
          <div
            className={`fixed lg:relative z-30 w-64 bg-slate-900/95 backdrop-blur border-r border-white/10 overflow-y-auto transition-all duration-300 ${
              mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            }`}
          >
            <nav className="p-4 space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      item.active
                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 text-cyan-300'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6 lg:p-8 space-y-8">
              {/* Header with Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-white">Revenue Analytics</h2>
                  <p className="text-white/60 mt-1">Track your income and business metrics</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                  >
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                  </select>
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <Filter className="w-5 h-5 text-white/60" />
                  </button>
                  <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg text-sm font-medium text-white transition-all">
                    <Plus className="w-4 h-4 inline mr-2" />
                    Export
                  </button>
                </div>
              </div>

              {/* KPI Cards Grid */}
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
                      {/* Gradient background */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-0 group-hover:opacity-10 rounded-full -mr-16 -mt-16 transition-opacity duration-500" />

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
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                              card.trend === 'up'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-red-500/20 text-red-300'
                            }`}
                          >
                            <TrendingUp className="w-3 h-3" />
                            {card.trend === 'up' ? '+' : '-'}{card.change}%
                          </span>
                          <span className="text-xs text-white/60">vs last month</span>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Trend Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 backdrop-blur-xl"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Revenue Trend</h3>
                      <p className="text-sm text-white/60 mt-1">Last 6 months performance</p>
                    </div>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <MoreHorizontal className="w-5 h-5 text-white/60" />
                    </button>
                  </div>

                  <div className="flex items-end justify-between h-64 gap-2">
                    {revenueData.map((data, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ height: 0 }}
                        animate={{ height: `${(data.revenue / maxRevenue) * 100}%` }}
                        transition={{ delay: 0.5 + idx * 0.05, duration: 0.6 }}
                        whileHover={{ scale: 1.05 }}
                        className="flex-1 rounded-t-lg bg-gradient-to-t from-cyan-500 to-cyan-400 hover:shadow-lg hover:shadow-cyan-500/50 transition-all cursor-pointer group relative"
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 px-3 py-1 rounded-lg whitespace-nowrap text-xs text-white border border-white/10">
                          ₹{(data.revenue / 1000).toFixed(0)}K
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
                    <div className="flex gap-4">
                      {revenueData.map((data, idx) => (
                        <div key={idx} className="text-center">
                          <p className="text-xs text-white/60">{data.month}</p>
                          <p className="text-sm font-semibold text-white mt-1">₹{(data.revenue / 1000).toFixed(0)}K</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Revenue Distribution */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 backdrop-blur-xl"
                >
                  <h3 className="text-lg font-semibold text-white mb-6">Revenue by Source</h3>

                  <div className="space-y-4">
                    {revenueByCategory.map((category, idx) => (
                      <div key={idx}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-white/70">{category.name}</span>
                          <span className="text-sm font-semibold text-white">₹{(category.value / 1000).toFixed(0)}K</span>
                        </div>
                        <div className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${category.percentage}%` }}
                            transition={{ delay: 0.6 + idx * 0.05, duration: 0.8 }}
                            className={`h-full rounded-full bg-gradient-to-r ${
                              idx === 0
                                ? 'from-cyan-500 to-blue-600'
                                : idx === 1
                                  ? 'from-purple-500 to-pink-600'
                                  : idx === 2
                                    ? 'from-emerald-500 to-teal-600'
                                    : 'from-orange-500 to-red-600'
                            }`}
                          />
                        </div>
                        <div className="text-xs text-white/50 mt-1">{category.percentage}% of total</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/70">Total Revenue</span>
                      <span className="text-lg font-bold text-white">₹{(revenueByCategory.reduce((sum, cat) => sum + cat.value, 0) / 100000).toFixed(1)}L</span>
                    </div>
                  </div>
                </motion.div>
              </div>

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
                    <p className="text-sm text-white/60 mt-1">Latest transactions</p>
                  </div>
                  <button className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">View All</button>
                </div>

                <div className="space-y-3">
                  {activityItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-white/10 hover:border-white/20">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div
                          className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            item.type === 'booking'
                              ? 'bg-cyan-500'
                              : item.type === 'payment'
                                ? 'bg-emerald-500'
                                : 'bg-red-500'
                          }`}
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white truncate">{item.description}</p>
                          <p className="text-xs text-white/60">{item.time}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-semibold ml-4 flex-shrink-0 ${item.amount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {item.amount > 0 ? '+' : ''}₹{Math.abs(item.amount).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
