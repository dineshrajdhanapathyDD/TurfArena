'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Bell, Plus, Search, Settings, TrendingUp, Calendar, Filter, MoreHorizontal, DollarSign, Users, ShoppingCart, Target, BookOpen, AreaChart, LogOut, Home } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

interface SidebarItem {
  label: string
  href: string
  icon: any
  active?: boolean
}

interface OwnerLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
  selectedPeriod?: string
  onPeriodChange?: (period: string) => void
}

export function OwnerLayout({ children, title, subtitle, selectedPeriod, onPeriodChange }: OwnerLayoutProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/auth')
  }

  const sidebarItems: SidebarItem[] = useMemo(() => [
    { label: 'Dashboard', href: '/owner', icon: BarChart3 },
    { label: 'Revenue', href: '/owner/revenue', icon: DollarSign },
    { label: 'Bookings', href: '/owner/bookings', icon: Calendar },
    { label: 'Turfs', href: '/owner/turfs', icon: Target },
    { label: 'Expenses', href: '/owner/expenses', icon: ShoppingCart },
    { label: 'Settings', href: '/owner/settings', icon: Settings },
  ], [])

  // Set active state based on current page
  const getCurrentPage = () => {
    if (typeof window !== 'undefined') {
      return window.location.pathname
    }
    return ''
  }

  const currentPage = getCurrentPage()

  return (
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
            <h1 className="text-lg sm:text-xl font-bold text-white hidden sm:block">{title}</h1>
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
            <Link
              href="/owner/settings"
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5 text-white/60 hover:text-white" />
            </Link>
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center cursor-pointer hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
              >
                <span className="text-sm font-bold text-white">{user?.name.charAt(0).toUpperCase()}</span>
              </button>

              {/* User Dropdown Menu */}
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-slate-800 border border-white/20 rounded-lg shadow-xl z-50"
                >
                  <button
                    onClick={() => {
                      setUserMenuOpen(false)
                      handleLogout()
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors rounded-lg"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
        {/* Sidebar */}
        <div
          className={`fixed lg:relative z-30 w-64 bg-slate-900/95 backdrop-blur border-r border-white/10 overflow-y-auto transition-all duration-300 ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          } flex flex-col`}
        >
          <nav className="p-4 space-y-2 flex-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
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

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-white/10 space-y-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 space-y-8">
            {/* Header with Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white">{title}</h2>
                <p className="text-white/60 mt-1">{subtitle}</p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                {selectedPeriod && onPeriodChange && (
                  <select
                    value={selectedPeriod}
                    onChange={(e) => onPeriodChange(e.target.value)}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                  >
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                  </select>
                )}
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <Filter className="w-5 h-5 text-white/60" />
                </button>
              </div>
            </div>

            {children}
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  )
}
