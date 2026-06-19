'use client'

import { use, useState } from 'react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Star, MapPin, Phone, Mail, ChevronDown } from 'lucide-react'
import { turfs, formatCurrency } from '@/TurfArena/lib/data'

const facilities = [
  { name: 'Parking Area', icon: '🅿️' },
  { name: 'Restrooms', icon: '🚻' },
  { name: 'First Aid', icon: '🩹' },
  { name: 'Changing Room', icon: '👕' },
  { name: 'Drinking Water', icon: '💧' },
]

export default function TurfDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const turf = turfs.find((t) => t.id === id)
  const [date, setDate] = useState<string | null>(null)
  const [time, setTime] = useState<string | null>(null)
  const [duration, setDuration] = useState<string | null>(null)

  if (!turf) notFound()

  const timeSlots = ['6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM']
  const durationOptions = ['1 hour', '2 hours', '3 hours']

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* ===== HEADER SECTION ===== */}
      {/* NAVIGATION HEADER */}
      <header className="bg-white shadow-md sticky top-0 z-50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* LOGO */}
            <Link href="/home" className="flex items-center gap-2">
              <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">TurfArena</div>
            </Link>
            
            {/* NAVIGATION MENU */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/home" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition">Home</Link>
              <Link href="/turfs" className="text-sm font-medium text-blue-600 font-semibold">Book</Link>
              <Link href="/tournaments" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition">Tournaments</Link>
              <Link href="/community" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition">Contact</Link>
            </nav>
            
            {/* USER PROFILE */}
            <div className="flex items-center gap-4">
              <Image
                src="/images/player-1.png"
                alt="Profile"
                width={32}
                height={32}
                className="size-8 rounded-full object-cover border-2 border-blue-200"
              />
              <button className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition">
                Tani <ChevronDown className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Turf Details */}
          <div className="lg:col-span-2">
            {/* TURF IMAGE GALLERY - Replace turf.image with your turf images */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl overflow-hidden mb-6 bg-gray-200"
            >
              <Image
                src={turf.image || '/placeholder.jpg'}
                alt={turf.name}
                width={600}
                height={300}
                className="w-full h-64 object-cover"
              />
              {/* Image slider dots */}
              <div className="flex justify-center gap-2 p-4 bg-white/50">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-gray-400" />
                ))}
              </div>
            </motion.div>

            {/* Turf Title and Rating */}
            <div className="mb-6">
              <h1 className="text-4xl font-bold mb-2">{turf.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="size-5 fill-orange-400 text-orange-400" />
                  <span className="font-semibold text-lg">4.0</span>
                  <span className="text-gray-600 text-sm">({turf.reviews} reviews)</span>
                </div>
              </div>
            </div>

            {/* Price and Location */}
            <div className="bg-yellow-100 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Rate per hour</p>
                  <p className="text-lg font-bold">₹{turf.pricePerHour}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-semibold flex items-center gap-2">
                    <MapPin className="size-4" /> {turf.area}
                  </p>
                </div>
              </div>
            </div>

            {/* Location Details Box */}
            <div className="bg-yellow-100 rounded-lg p-4 mb-6">
              <h3 className="font-bold mb-3">Location</h3>
              <p className="text-sm mb-3">
                • Opposite Sri Atma College, Bengaluru<br />
                • Near Sr. Mary's Catholic Church, C-block<br />
                • https://maps.google.com/...
              </p>
              <div className="h-40 bg-gray-300 rounded mb-3 flex items-center justify-center">
                <div className="text-gray-600">📍 Map View</div>
              </div>
            </div>

            {/* Rules Section */}
            <div className="bg-yellow-100 rounded-lg p-4 mb-6">
              <h3 className="font-bold mb-3">Rules to follow</h3>
              <ul className="text-sm space-y-2">
                <li>• Arrive 15 mins prior to your booked time</li>
                <li>• Extra time will not be given. Overstay fee is 20 you</li>
                <li>• Booking cancellation is non-refundable</li>
                <li>• Boots are recommended</li>
                <li>• Head gear must be worn in all times</li>
                <li>• Smoking and alcohol is strictly prohibited inside and near the premises of the turf.</li>
              </ul>
            </div>

            {/* AVAILABLE SPORTS SECTION - Replace sport icons and names */}
            <div className="bg-yellow-100 rounded-lg p-4 mb-6">
              <h3 className="font-bold mb-4">Available For</h3>
              <div className="flex gap-8">
                {/* SPORT 1: FOOTBALL - Replace icon/image */}
                {[
                  { icon: '⚽', name: 'Football' },
                  { icon: '🏏', name: 'Cricket' },
                ].map((sport) => (
                  <div key={sport.name} className="text-center">
                    <div className="text-4xl mb-2">{sport.icon}</div>
                    <p className="text-sm">{sport.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* FACILITIES SECTION - Replace facility icons */}
            <div className="bg-yellow-100 rounded-lg p-4">
              <h3 className="font-bold mb-4">Facilities</h3>
              <div className="grid grid-cols-2 gap-4">
                {/* FACILITY ICONS - Replace with your icons/images */}
                {facilities.map((facility) => (
                  <div key={facility.name} className="flex items-center gap-2 text-sm">
                    <span className="text-xl">{facility.icon}</span>
                    <span>{facility.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-lg sticky top-24">
              <h2 className="text-xl font-bold mb-6">Book Now</h2>

              {/* Date Selector */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  📅 Date
                </label>
                <select
                  value={date || ''}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-400"
                >
                  <option value="">Select a date</option>
                  <option value="2024-01-20">Jan 20, 2024</option>
                  <option value="2024-01-21">Jan 21, 2024</option>
                  <option value="2024-01-22">Jan 22, 2024</option>
                </select>
              </div>

              {/* Time Selector */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  🕐 Time
                </label>
                <select
                  value={time || ''}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-400"
                >
                  <option value="">Select a time</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              {/* Duration Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  ⏱️ Duration
                </label>
                <select
                  value={duration || ''}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-400"
                >
                  <option value="">Select duration</option>
                  {durationOptions.map((dur) => (
                    <option key={dur} value={dur}>{dur}</option>
                  ))}
                </select>
              </div>

              {/* Book Button */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-lg font-bold mb-6 transition"
              >
                Book Turf
              </motion.button>

              {/* Contact Section */}
              <div className="border-t pt-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  📞 Contact
                </h3>
                <div className="space-y-3 text-sm">
                  <p className="flex items-center gap-2">
                    <Phone className="size-4" /> 9876543210
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="size-4" /> 9876543210
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="size-4" /> info@turfarena.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
