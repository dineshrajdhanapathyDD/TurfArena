'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, User, DollarSign, CheckCircle, AlertCircle, Phone, MoreHorizontal } from 'lucide-react'
import { ProtectedRoute } from '@/components/protected-route'
import { OwnerLayout } from '@/components/owner-layout'
import { useAuth } from '@/TurfArena/lib/auth-context'
import { useState } from 'react'

interface Booking {
  id: string
  turf: string
  date: string
  startTime: string
  endTime: string
  duration: number
  customerName: string
  customerPhone: string
  amount: number
  status: 'completed' | 'confirmed' | 'cancelled'
  paymentStatus: 'paid' | 'pending'
}

export default function BookingsPage() {
  const { user } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  const bookings: Booking[] = [
    {
      id: 'BK001',
      turf: 'Greenfield Arena',
      date: '2024-06-25',
      startTime: '6:00 PM',
      endTime: '7:00 PM',
      duration: 1,
      customerName: 'Arjun Mehta',
      customerPhone: '+91 9876543210',
      amount: 1200,
      status: 'completed',
      paymentStatus: 'paid',
    },
    {
      id: 'BK002',
      turf: 'Downtown Court',
      date: '2024-06-26',
      startTime: '4:00 PM',
      endTime: '5:30 PM',
      duration: 1.5,
      customerName: 'Priya Sharma',
      customerPhone: '+91 9876543211',
      amount: 1350,
      status: 'confirmed',
      paymentStatus: 'paid',
    },
    {
      id: 'BK003',
      turf: 'Turf Park Central',
      date: '2024-06-24',
      startTime: '7:00 PM',
      endTime: '8:30 PM',
      duration: 1.5,
      customerName: 'Rajesh Kumar',
      customerPhone: '+91 9876543212',
      amount: 1650,
      status: 'completed',
      paymentStatus: 'paid',
    },
    {
      id: 'BK004',
      turf: 'Greenfield Arena',
      date: '2024-06-27',
      startTime: '5:00 PM',
      endTime: '6:30 PM',
      duration: 1.5,
      customerName: 'Neha Iyer',
      customerPhone: '+91 9876543213',
      amount: 1800,
      status: 'confirmed',
      paymentStatus: 'pending',
    },
  ]

  const stats = {
    total: bookings.length,
    completed: bookings.filter(b => b.status === 'completed').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    revenue: bookings.filter(b => b.status !== 'cancelled').reduce((sum, b) => sum + b.amount, 0),
  }

  return (
    <ProtectedRoute allowedRoles={['owner']}>
      <OwnerLayout title="Bookings" subtitle="Manage all turf reservations and payments" selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod}>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-white/70">Total Bookings</span>
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
            <p className="text-xs text-white/60 mt-2">This month</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-white/70">Completed</span>
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-3xl font-bold text-white">{stats.completed}</p>
            <p className="text-xs text-emerald-400 mt-2">Successful</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-white/70">Confirmed</span>
              <AlertCircle className="w-5 h-5 text-orange-400" />
            </div>
            <p className="text-3xl font-bold text-white">{stats.confirmed}</p>
            <p className="text-xs text-orange-400 mt-2">Pending</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-white/70">Total Revenue</span>
              <DollarSign className="w-5 h-5 text-cyan-400" />
            </div>
            <p className="text-3xl font-bold text-white">₹{(stats.revenue / 1000).toFixed(0)}K</p>
            <p className="text-xs text-cyan-400 mt-2">Generated</p>
          </motion.div>
        </div>

        {/* Bookings List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 backdrop-blur-xl"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Recent Bookings</h3>

          <div className="space-y-3">
            {bookings.map((booking, idx) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + idx * 0.05 }}
                className="rounded-xl bg-white/5 border border-white/10 hover:border-white/20 p-4 transition-all"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:items-center">
                  {/* Left Section */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-white">{booking.id}</p>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-full ${
                          booking.status === 'completed'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : booking.status === 'confirmed'
                              ? 'bg-orange-500/20 text-orange-300'
                              : 'bg-red-500/20 text-red-300'
                        }`}
                      >
                        {booking.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-white/70">{booking.turf}</p>
                    <div className="flex items-center gap-4 text-xs text-white/60">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(booking.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {booking.startTime} - {booking.endTime}
                      </span>
                    </div>
                  </div>

                  {/* Right Section */}
                  <div className="flex items-center justify-between md:justify-end gap-4">
                    <div className="text-right">
                      <p className="text-sm text-white/70">{booking.customerName}</p>
                      <p className="text-xs text-white/50 flex items-center gap-1 justify-end mt-1">
                        <Phone className="w-3 h-3" />
                        {booking.customerPhone}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-cyan-400 text-lg">₹{booking.amount}</p>
                      <p
                        className={`text-xs font-semibold mt-1 ${
                          booking.paymentStatus === 'paid' ? 'text-emerald-400' : 'text-yellow-400'
                        }`}
                      >
                        {booking.paymentStatus === 'paid' ? 'PAID' : 'PENDING'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                  <button className="flex-1 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium text-white transition-colors">
                    View Details
                  </button>
                  {booking.paymentStatus === 'pending' && (
                    <button className="flex-1 px-3 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 rounded-lg text-xs font-medium transition-colors border border-emerald-400/30">
                      Mark Paid
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </OwnerLayout>
    </ProtectedRoute>
  )
}
