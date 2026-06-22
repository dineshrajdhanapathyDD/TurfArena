'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, MapPin, Users, ChevronLeft, X, RotateCcw } from 'lucide-react'
import { ProtectedRoute } from '@/components/protected-route'
import Image from 'next/image'
import Link from 'next/link'

type Booking = {
  id: string
  turfName: string
  image: string
  date: string
  time: string
  duration: string
  people: number
  sport: string
  location: string
  amount: number
  status: 'upcoming' | 'completed' | 'cancelled'
}

const bookings: Booking[] = [
  {
    id: 'b1',
    turfName: 'Greenfield Arena',
    image: '/images/turf-football-night.png',
    date: 'Sat, 21 Jun 2025',
    time: '6:00 PM',
    duration: '1 hour',
    people: 10,
    sport: '⚽ Football',
    location: 'Koramangala, Bengaluru',
    amount: 1200,
    status: 'upcoming',
  },
  {
    id: 'b2',
    turfName: 'Downtown Court',
    image: '/images/basketball-court.png',
    date: 'Sun, 22 Jun 2025',
    time: '4:00 PM',
    duration: '2 hours',
    people: 6,
    sport: '🏀 Basketball',
    location: 'Indiranagar, Bengaluru',
    amount: 1800,
    status: 'upcoming',
  },
  {
    id: 'b3',
    turfName: 'Turf Park Central',
    image: '/images/turf-arena-1.png',
    date: 'Sat, 14 Jun 2025',
    time: '7:00 PM',
    duration: '1 hour',
    people: 14,
    sport: '⚽ Football',
    location: 'HSR Layout, Bengaluru',
    amount: 1100,
    status: 'completed',
  },
  {
    id: 'b4',
    turfName: 'Stadium Grounds',
    image: '/images/cricket-ground.png',
    date: 'Sun, 8 Jun 2025',
    time: '5:00 PM',
    duration: '2 hours',
    people: 12,
    sport: '🏏 Cricket',
    location: 'Whitefield, Bengaluru',
    amount: 3000,
    status: 'cancelled',
  },
  {
    id: 'b5',
    turfName: 'Greenfield Arena',
    image: '/images/turf-football-night.png',
    date: 'Sat, 31 May 2025',
    time: '8:00 PM',
    duration: '1 hour',
    people: 10,
    sport: '⚽ Football',
    location: 'Koramangala, Bengaluru',
    amount: 1200,
    status: 'completed',
  },
]

const tabs = ['All', 'Upcoming', 'Completed', 'Cancelled'] as const
type Tab = typeof tabs[number]

function statusColor(status: Booking['status']) {
  switch (status) {
    case 'upcoming': return 'bg-green-100 text-green-700 border-green-200'
    case 'completed': return 'bg-blue-100 text-blue-700 border-blue-200'
    case 'cancelled': return 'bg-red-100 text-red-700 border-red-200'
  }
}

export default function MyBookingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('All')

  const filtered = activeTab === 'All'
    ? bookings
    : bookings.filter(b => b.status === activeTab.toLowerCase())

  return (
    <ProtectedRoute allowedRoles={['customer']}>
      <div className="min-h-screen w-full bg-background">
        {/* Header */}
        <div className="bg-surface-2 border-b border-border sticky top-0 z-30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
            <Link
              href="/customer-dashboard"
              className="p-2 -ml-2 rounded-xl hover:bg-surface-2 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </Link>
            <h1 className="text-xl font-bold text-foreground">My Bookings</h1>
          </div>

          {/* Tabs */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="flex gap-1 overflow-x-auto no-scrollbar pb-0">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab ? 'text-green-700' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="bookingTab"
                      className="absolute bottom-0 inset-x-0 h-0.5 bg-green-600 rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {filtered.length === 0 ? (
                <div className="text-center py-16">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground font-medium">No bookings found</p>
                  <p className="text-muted-foreground text-sm mt-1">Your {activeTab.toLowerCase()} bookings will appear here</p>
                </div>
              ) : (
                filtered.map((booking, idx) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-surface-2 rounded-2xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row">
                      {/* Image */}
                      <div className="relative w-full sm:w-44 h-36 sm:h-auto flex-shrink-0">
                        <Image
                          src={booking.image}
                          alt={booking.turfName}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 p-4 sm:p-5">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-foreground text-base">{booking.turfName}</h3>
                            <p className="text-sm text-muted-foreground">{booking.sport}</p>
                          </div>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${statusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{booking.date}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{booking.time} · {booking.duration}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{booking.location}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Users className="w-3.5 h-3.5" />
                            <span>{booking.people} players</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                          <p className="font-bold text-foreground">₹{booking.amount.toLocaleString()}</p>
                          <div className="flex items-center gap-3">
                            {booking.status === 'upcoming' && (
                              <>
                                <button className="flex items-center gap-1.5 text-primary hover:text-primary/80 text-sm font-medium transition-colors">
                                  <RotateCcw className="w-3.5 h-3.5" />
                                  Edit
                                </button>
                                <button className="flex items-center gap-1.5 text-red-500 hover:text-red-600 text-sm font-medium transition-colors">
                                  <X className="w-3.5 h-3.5" />
                                  Cancel
                                </button>
                              </>
                            )}
                            {booking.status === 'completed' && (
                              <button className="flex items-center gap-1.5 text-green-600 hover:text-green-700 text-sm font-medium transition-colors">
                                <RotateCcw className="w-3.5 h-3.5" />
                                Rebook
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </ProtectedRoute>
  )
}
