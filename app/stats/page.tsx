'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, TrendingUp, Target, Clock, Flame, Trophy, Zap } from 'lucide-react'
import { ProtectedRoute } from '@/components/protected-route'
import Link from 'next/link'

const overviewStats = [
  { label: 'Total Matches', value: '47', icon: Target, color: 'bg-green-100 text-green-700', trend: '+3 this month' },
  { label: 'Hours Played', value: '62', icon: Clock, color: 'bg-blue-100 text-blue-700', trend: '+8h this month' },
  { label: 'Win Rate', value: '68%', icon: Trophy, color: 'bg-amber-100 text-amber-700', trend: '+5% vs last month' },
  { label: 'Current Streak', value: '4W', icon: Flame, color: 'bg-red-100 text-red-700', trend: 'Best: 7W' },
]

const monthlyData = [
  { month: 'Jan', matches: 3, wins: 2 },
  { month: 'Feb', matches: 5, wins: 3 },
  { month: 'Mar', matches: 4, wins: 3 },
  { month: 'Apr', matches: 6, wins: 4 },
  { month: 'May', matches: 8, wins: 6 },
  { month: 'Jun', matches: 7, wins: 5 },
]

const sportBreakdown = [
  { sport: '⚽ Football', matches: 32, wins: 22, pct: 69 },
  { sport: '🏏 Cricket', matches: 10, wins: 7, pct: 70 },
  { sport: '🏀 Basketball', matches: 5, wins: 3, pct: 60 },
]

const recentMatches = [
  { id: 'm1', opponent: 'Thunder FC', result: 'W', score: '3-2', date: 'Jun 14', sport: '⚽' },
  { id: 'm2', opponent: 'Street Ballers', result: 'W', score: '24-18', date: 'Jun 12', sport: '🏀' },
  { id: 'm3', opponent: 'Strikers XI', result: 'L', score: '1-3', date: 'Jun 10', sport: '⚽' },
  { id: 'm4', opponent: 'City Warriors', result: 'W', score: '2-0', date: 'Jun 8', sport: '⚽' },
  { id: 'm5', opponent: 'Knight Riders', result: 'W', score: '145-132', date: 'Jun 5', sport: '🏏' },
]

const achievements = [
  { icon: '🏆', title: 'First Win', desc: 'Win your first match', done: true },
  { icon: '🔥', title: '5-Win Streak', desc: 'Win 5 matches in a row', done: true },
  { icon: '⚡', title: '50 Matches', desc: 'Play 50 matches total', done: false, progress: 47, total: 50 },
  { icon: '🎯', title: 'Sharpshooter', desc: '75% win rate over 20+ matches', done: false, progress: 68, total: 75 },
]

export default function StatsPage() {
  const [tab, setTab] = useState<'overview' | 'matches' | 'achievements'>('overview')
  const maxMatches = Math.max(...monthlyData.map(d => d.matches))

  return (
    <ProtectedRoute allowedRoles={['customer', 'captain']}>
      <div className="min-h-screen w-full bg-background">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
            <Link
              href="/customer-dashboard"
              className="p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Statistics</h1>
          </div>

          {/* Tabs */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="flex gap-1">
              {(['overview', 'matches', 'achievements'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`relative px-4 py-2.5 text-sm font-medium capitalize transition-colors ${
                    tab === t ? 'text-green-700' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {t}
                  {tab === t && (
                    <motion.div
                      layoutId="statsTab"
                      className="absolute bottom-0 inset-x-0 h-0.5 bg-green-600 rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          {/* ── Overview Tab ── */}
          {tab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Stat Cards */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {overviewStats.map((stat, idx) => {
                  const Icon = stat.icon
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.06 }}
                      className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm"
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.color} mb-3`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                      <p className="text-[11px] text-green-600 mt-1 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {stat.trend}
                      </p>
                    </motion.div>
                  )
                })}
              </div>

              {/* Monthly Chart */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Monthly Activity</h3>
                <div className="flex items-end gap-3 sm:gap-4 h-40">
                  {monthlyData.map((d, idx) => (
                    <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex flex-col items-center gap-0.5" style={{ height: '120px' }}>
                        <div className="w-full flex-1 flex items-end">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${(d.matches / maxMatches) * 100}%` }}
                            transition={{ delay: idx * 0.08, duration: 0.5 }}
                            className="w-full bg-green-200 rounded-t-lg relative overflow-hidden"
                          >
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${(d.wins / d.matches) * 100}%` }}
                              transition={{ delay: idx * 0.08 + 0.3, duration: 0.4 }}
                              className="absolute bottom-0 inset-x-0 bg-green-500 rounded-t-lg"
                            />
                          </motion.div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{d.month}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-green-500" />
                    <span>Wins</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-green-200" />
                    <span>Total Matches</span>
                  </div>
                </div>
              </div>

              {/* Sport Breakdown */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Sport Breakdown</h3>
                <div className="space-y-4">
                  {sportBreakdown.map(s => (
                    <div key={s.sport}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-gray-800">{s.sport}</span>
                        <span className="text-xs text-gray-500">{s.wins}W / {s.matches - s.wins}L · {s.pct}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${s.pct}%` }}
                          transition={{ duration: 0.8 }}
                          className="h-full bg-green-500 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Matches Tab ── */}
          {tab === 'matches' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <h3 className="font-bold text-gray-900 mb-2">Recent Matches</h3>
              {recentMatches.map((match, idx) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-4"
                >
                  <div className="text-2xl">{match.sport}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">vs {match.opponent}</p>
                    <p className="text-xs text-gray-500">{match.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-gray-900">{match.score}</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      match.result === 'W' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {match.result === 'W' ? 'Win' : 'Loss'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* ── Achievements Tab ── */}
          {tab === 'achievements' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <h3 className="font-bold text-gray-900 mb-2">Achievements</h3>
              {achievements.map((a, idx) => (
                <motion.div
                  key={a.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  className={`bg-white rounded-xl p-4 border shadow-sm flex items-center gap-4 ${
                    a.done ? 'border-green-200' : 'border-gray-100'
                  }`}
                >
                  <div className="text-3xl">{a.icon}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                      {a.title}
                      {a.done && <Zap className="w-3.5 h-3.5 text-green-600 fill-green-600" />}
                    </p>
                    <p className="text-xs text-gray-500">{a.desc}</p>
                    {!a.done && a.progress !== undefined && a.total !== undefined && (
                      <div className="mt-2">
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full transition-all"
                            style={{ width: `${(a.progress / a.total) * 100}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-gray-400 mt-1">{a.progress}/{a.total}</p>
                      </div>
                    )}
                  </div>
                  {a.done && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-600 text-xs font-bold">✓</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
