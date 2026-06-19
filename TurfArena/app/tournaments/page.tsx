'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { tournaments } from '@/TurfArena/lib/data'

export default function TournamentsPage() {
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
              <Link href="/turfs" className="text-sm font-medium hover:text-gray-300 transition">
                Book
              </Link>
              <Link href="/tournaments" className="text-sm font-medium hover:text-gray-300 transition text-orange-400">
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

      {/* ===== TOURNAMENTS HEADER SECTION ===== */}
      {/* PAGE HEADER */}
      <section className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">🏆 Tournaments</h1>
          <p className="text-lg text-orange-100">Join exciting sports tournaments and showcase your skills</p>
        </div>
      </section>

      {/* ===== TOURNAMENTS GRID SECTION ===== */}
      {/* TOURNAMENTS LISTING */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">All Tournaments</h2>
            <p className="text-gray-600">{tournaments.length} tournaments available</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* TOURNAMENT IMAGES - Replace tournament.image with your tournament images */}
            {tournaments.map((tournament, idx) => (
              <motion.div
                key={tournament.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link href={`/tournaments/${tournament.id}`}>
                  <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden cursor-pointer group">
                    {/* TOURNAMENT IMAGE */}
                    <div className="relative h-56 bg-gray-900 overflow-hidden">
                      <Image
                        src={tournament.image || '/placeholder.jpg'}
                        alt={tournament.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    
                    {/* TOURNAMENT INFO */}
                    <div className="p-4">
                      <h3 className="text-lg font-bold mb-2">{tournament.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">📅 {tournament.date}</p>
                      
                      {/* TOURNAMENT DETAILS */}
                      <div className="space-y-2 text-sm">
                        <p className="text-gray-700">📍 {tournament.venue}</p>
                        <p className="text-orange-600 font-semibold">View Details →</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
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
