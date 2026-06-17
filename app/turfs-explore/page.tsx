'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { tournaments, turfs } from '@/lib/data'
import { ProtectedRoute } from '@/components/protected-route'
import { AppShell } from '@/components/app-shell'

export default function TurfsExplorePage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showCalendar, setShowCalendar] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedSport, setSelectedSport] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const generateCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDay = getFirstDayOfMonth(currentMonth)
    const days = []
    
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }
    
    return days
  }

  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const calendarDays = generateCalendar()

  const handleDateSelect = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    setSelectedDate(date.toISOString().split('T')[0])
    setShowCalendar(false)
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const handleSearch = () => {
    let results = turfs
    
    if (selectedLocation) {
      results = results.filter(t => t.area.toLowerCase().includes(selectedLocation.toLowerCase()))
    }
    
    if (selectedSport) {
      results = results.filter(t => t.sports.some((s: any) => s.toLowerCase().includes(selectedSport.toLowerCase())))
    }
    
    setSearchResults(results)
    setHasSearched(true)
  }

  const hasFilters = selectedLocation || selectedDate || selectedSport || selectedTime

  return (
    <ProtectedRoute allowedRoles={['customer']}>
      <AppShell className="pt-0">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-gradient-to-b from-teal-700/30 to-transparent border-b border-white/10">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Book Turfs</h1>
            <p className="text-white/60 text-sm mt-1">Find and book premium sports venues</p>
          </div>
        </header>

        {/* Search Filters */}
        <section className="bg-white/5 border-b border-white/10 px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {/* Location */}
            <select 
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3 py-2 border border-teal-400/30 rounded-lg text-xs bg-teal-500/10 hover:border-teal-400/50 transition font-medium text-white"
            >
              <option value="">Location</option>
              <option>Koramangala</option>
              <option>Indiranagar</option>
              <option>HSR Layout</option>
              <option>Whitefield</option>
            </select>
            
            {/* Date */}
            <div className="relative">
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="w-full px-3 py-2 border border-purple-400/30 rounded-lg text-xs bg-purple-500/10 hover:border-purple-400/50 transition font-medium text-white text-left"
              >
                {selectedDate ? new Date(selectedDate).toLocaleDateString() : 'Date'}
              </button>

              {showCalendar && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-full mt-2 left-0 bg-slate-900 border border-white/20 rounded-lg shadow-2xl p-4 z-50 w-80"
                >
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={handlePrevMonth}
                      className="p-1 hover:bg-white/10 rounded transition"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <h3 className="font-bold text-sm">{monthName}</h3>
                    <button
                      onClick={handleNextMonth}
                      className="p-1 hover:bg-white/10 rounded transition"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-2 mb-3">
                    {dayNames.map((day) => (
                      <div key={day} className="text-center text-xs font-bold text-white/60 py-1">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {calendarDays.map((day, idx) => (
                      <button
                        key={idx}
                        onClick={() => day && handleDateSelect(day)}
                        disabled={!day}
                        className={`h-8 rounded text-xs font-semibold transition-all ${
                          !day ? 'invisible' : 'cursor-pointer'
                        } ${
                          selectedDate === `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                            ? 'bg-purple-600 text-white'
                            : 'bg-white/5 text-white hover:bg-purple-500/30'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowCalendar(false)}
                    className="w-full mt-4 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-medium transition"
                  >
                    Done
                  </button>
                </motion.div>
              )}
            </div>
            
            {/* Sport */}
            <select 
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="px-3 py-2 border border-orange-400/30 rounded-lg text-xs bg-orange-500/10 hover:border-orange-400/50 transition font-medium text-white"
            >
              <option value="">Sport</option>
              <option>Football</option>
              <option>Cricket</option>
              <option>Basketball</option>
              <option>Tennis</option>
            </select>
            
            {/* Time */}
            <select 
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="px-3 py-2 border border-green-400/30 rounded-lg text-xs bg-green-500/10 hover:border-green-400/50 transition font-medium text-white"
            >
              <option value="">Time</option>
              <option>Morning (6-12 AM)</option>
              <option>Afternoon (12-6 PM)</option>
              <option>Evening (6-10 PM)</option>
            </select>

            {/* Search Button */}
            {hasFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleSearch}
                className="px-3 py-2 border border-cyan-400/30 rounded-lg text-xs bg-cyan-500/10 hover:bg-cyan-500/20 transition font-bold text-cyan-400 md:col-span-1"
              >
                Search
              </motion.button>
            )}
          </div>
        </section>

        {/* Search Results */}
        {hasSearched && (
          <section className="px-6 py-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-2">Results</h2>
              <p className="text-white/60 text-sm">
                Found {searchResults.length} turf{searchResults.length !== 1 ? 's' : ''} matching your criteria
              </p>
            </div>

            {searchResults.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-white/60">No turfs found. Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {searchResults.map((turf, idx) => (
                  <motion.div
                    key={turf.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link href={`/turfs/${turf.id}`}>
                      <div className="bg-white/5 border border-white/10 rounded-xl hover:border-cyan-400/50 transition-all overflow-hidden cursor-pointer group">
                        <div className="relative h-40 bg-white/10 overflow-hidden">
                          <Image
                            src={turf.image || '/placeholder.jpg'}
                            alt={turf.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-white text-sm mb-1">{turf.name}</h3>
                          <p className="text-xs text-white/60 mb-3">📍 {turf.area}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-yellow-400 text-xs">★ {turf.rating}</span>
                            <span className="font-bold text-cyan-400 text-sm">₹{turf.pricePerHour}/hr</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Featured Turfs */}
        <section className="px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Popular Turfs</h2>
            <Link href="/turfs" className="text-cyan-400 text-sm hover:text-cyan-300">
              See All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {turfs.map((turf, idx) => (
              <motion.div
                key={turf.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link href={`/turfs/${turf.id}`}>
                  <div className="bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-teal-400/30 rounded-xl hover:border-teal-400/50 transition-all overflow-hidden cursor-pointer group">
                    <div className="relative h-40 bg-white/10 overflow-hidden">
                      <Image
                        src={turf.image}
                        alt={turf.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-white text-sm mb-1">{turf.name}</h3>
                      <p className="text-xs text-white/60 mb-3">{turf.area}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-yellow-400 text-xs">★ {turf.rating}</span>
                        <span className="font-bold text-cyan-400 text-sm">₹{turf.pricePerHour}/hr</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tournaments Section */}
        <section className="px-6 py-8 border-t border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Upcoming Tournaments</h2>
            <Link href="/tournaments" className="text-cyan-400 text-sm hover:text-cyan-300">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tournaments.slice(0, 4).map((tournament, idx) => (
              <motion.div
                key={tournament.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link href={`/tournaments/${tournament.id}`}>
                  <div className="bg-white/5 border border-white/10 rounded-xl hover:border-orange-400/50 transition-all overflow-hidden cursor-pointer group h-full">
                    <div className="relative h-48 bg-white/10 overflow-hidden">
                      <Image
                        src={tournament.image}
                        alt={tournament.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-white text-sm mb-2">{tournament.name}</h3>
                      <p className="text-xs text-white/60 mb-3">{tournament.date}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-orange-400 text-xs font-semibold">Entry: ₹{tournament.entryFee}</span>
                        <span className="text-xs text-white/60">{tournament.teamsJoined}/{tournament.totalSpots}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </AppShell>
    </ProtectedRoute>
  )
}
