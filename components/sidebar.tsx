'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LogOut, Home, BarChart3, Trophy, Settings, Heart, Clock } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'
import Image from 'next/image'

const menuItems = {
  customer: [
    { icon: Home, label: 'Home', href: '/customer-dashboard' },
    { icon: Heart, label: 'My Bookings', href: '/my-bookings' },
    { icon: BarChart3, label: 'Statistics', href: '/stats' },
    { icon: Trophy, label: 'Tournaments', href: '/tournaments' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ],
  organizer: [
    { icon: Home, label: 'Dashboard', href: '/organizer' },
    { icon: Trophy, label: 'My Tournaments', href: '/organizer/tournaments' },
    { icon: BarChart3, label: 'Analytics', href: '/organizer/analytics' },
    { icon: Clock, label: 'Bookings', href: '/organizer/bookings' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ],
  owner: [
    { icon: Home, label: 'Dashboard', href: '/owner' },
    { icon: Heart, label: 'My Turfs', href: '/owner/turfs' },
    { icon: BarChart3, label: 'Revenue', href: '/owner/revenue' },
    { icon: Clock, label: 'Bookings', href: '/owner/bookings' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ],
}

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()

  if (!user) return null

  const items = menuItems[user.role]

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  return (
    <>
      {/* Hamburger button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-40 p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </motion.button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-30"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed left-0 top-0 h-screen w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-white/10 z-40 overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Turf<span className="text-cyan-400">Arena</span>
                </h2>
              </div>

              {/* User Profile */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-teal-500/20 to-teal-600/10 border border-teal-400/30 rounded-2xl p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{user.name}</h3>
                    <p className="text-xs text-cyan-300 capitalize">{user.role}</p>
                  </div>
                </div>
                <div className="bg-black/20 rounded-lg p-3">
                  <p className="text-xs text-white/60 mb-1">Available Credits</p>
                  <p className="text-lg font-bold text-cyan-400">₹{user.credits.toLocaleString()}</p>
                </div>
              </motion.div>

              {/* Navigation Menu */}
              <nav className="space-y-2">
                {items.map((item, idx) => {
                  const Icon = item.icon
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + idx * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </Link>
                    </motion.div>
                  )
                })}
              </nav>

              {/* Logout button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-400/30 transition-colors mt-auto"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
