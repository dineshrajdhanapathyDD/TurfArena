'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Search } from 'lucide-react'
import { turfs } from '@/TurfArena/lib/data'

export default function TurfsPage() {
  const [query, setQuery] = useState('')
  const filtered = turfs.filter(
    (t) =>
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.area.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-white">
      {/* ===== HEADER SECTION ===== */}
      {/* NAVIGATION HEADER */}
      <header className="sticky top-0 z-50 bg-gray-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* LOGO */}
            <Link href="/home" className="text-xl font-bold">
              TurfArena
            </Link>
            
            {/* NAVIGATION MENU */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/home" className="text-sm font-medium hover:text-gray-300 transition">
                Home
              </Link>
              <Link href="/turfs" className="text-sm font-medium hover:text-gray-300 transition text-orange-400">
                Book
              </Link>
              <Link href="/tournaments" className="text-sm font-medium hover:text-gray-300 transition">
                Tournaments
              </Link>
              <Link href="/community" className="text-sm font-medium hover:text-gray-300 transition">
                Contact
              </Link>
            </nav>
            
            {/* USER PROFILE */}
            <div className="flex items-center gap-4">
              <Image
                src="/images/player-1.png"
                alt="Profile"
                width={32}
                height={32}
                className="size-8 rounded-full object-cover"
              />
              <button className="flex items-center gap-1 text-sm font-medium hover:text-gray-300 transition">
                Tani <ChevronDown className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ===== SEARCH SECTION ===== */}
      {/* SEARCH AND FILTER SECTION */}
      <section className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-6">Find Your Perfect Turf</h1>
          
          {/* SEARCH BAR */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400 size-5" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search turfs by name or location..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400"
              />
            </div>
          </div>

          {/* FILTERS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <select className="px-4 py-3 border border-gray-300 rounded-lg text-sm bg-white hover:border-gray-400 transition">
              <option>📍 Location</option>
            </select>
            <select className="px-4 py-3 border border-gray-300 rounded-lg text-sm bg-white hover:border-gray-400 transition">
              <option>📅 Date</option>
            </select>
            <select className="px-4 py-3 border border-gray-300 rounded-lg text-sm bg-white hover:border-gray-400 transition">
              <option>⚽ Sports</option>
            </select>
            <select className="px-4 py-3 border border-gray-300 rounded-lg text-sm bg-white hover:border-gray-400 transition">
              <option>🕐 Time</option>
            </select>
          </div>
        </div>
      </section>

      {/* ===== TURFS LISTING SECTION ===== */}
      {/* TURFS GRID */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">{query ? `Results for "${query}"` : 'All Available Turfs'}</h2>
            <p className="text-gray-600 mt-2">{filtered.length} turfs found</p>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <Search className="size-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No turfs match your search</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((turf, idx) => (
                <motion.div
                  key={turf.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link href={`/turfs/${turf.id}`}>
                    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden cursor-pointer group">
                      {/* TURF IMAGE */}
                      <div className="relative h-48 bg-gray-200 overflow-hidden">
                        <Image
                          src={turf.image || '/placeholder.jpg'}
                          alt={turf.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      
                      {/* TURF INFO */}
                      <div className="p-4">
                        <h3 className="text-lg font-bold mb-2">{turf.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">📍 {turf.area}</p>
                        
                        {/* RATING AND PRICE */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-400">⭐</span>
                            <span className="text-sm font-semibold">{turf.rating}</span>
                            <span className="text-xs text-gray-600">({turf.reviews})</span>
                          </div>
                          <span className="text-lg font-bold text-orange-600">₹{turf.pricePerHour}/hr</span>
                        </div>

                        {/* SPORTS */}
                        <div className="flex gap-2 flex-wrap">
                          {turf.sports.slice(0, 2).map((sport) => (
                            <span key={sport} className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                              {sport}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== FOOTER SECTION ===== */}
      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">&copy; 2024 TurfArena. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
