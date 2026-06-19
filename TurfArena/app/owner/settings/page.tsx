'use client'

import { motion } from 'framer-motion'
import { Settings, Bell, Lock, Users, Zap, ToggleRight, Save } from 'lucide-react'
import { ProtectedRoute } from '@/components/protected-route'
import { OwnerLayout } from '@/components/owner-layout'
import { useAuth } from '@/lib/auth-context'
import { useState } from 'react'

interface SettingsState {
  notifications: {
    email: boolean
    sms: boolean
    bookingUpdates: boolean
    paymentReminders: boolean
  }
  security: {
    twoFactor: boolean
  }
  privacy: {
    profileVisible: boolean
    showStats: boolean
  }
}

export default function SettingsPage() {
  const { user } = useAuth()
  const [settings, setSettings] = useState<SettingsState>({
    notifications: {
      email: true,
      sms: true,
      bookingUpdates: true,
      paymentReminders: true,
    },
    security: {
      twoFactor: false,
    },
    privacy: {
      profileVisible: true,
      showStats: true,
    },
  })

  const settingGroups = [
    {
      title: 'Notifications',
      icon: Bell,
      key: 'notifications' as const,
      settings: [
        { key: 'email', label: 'Email Notifications', description: 'Receive booking and payment updates via email' },
        { key: 'sms', label: 'SMS Notifications', description: 'Get important alerts via SMS' },
        { key: 'bookingUpdates', label: 'Booking Updates', description: 'New booking alerts' },
        { key: 'paymentReminders', label: 'Payment Reminders', description: 'Reminders for pending payments' },
      ],
    },
    {
      title: 'Security',
      icon: Lock,
      key: 'security' as const,
      settings: [
        { key: 'twoFactor', label: 'Two-Factor Authentication', description: 'Add an extra layer of security' },
      ],
    },
    {
      title: 'Privacy',
      icon: Users,
      key: 'privacy' as const,
      settings: [
        { key: 'profileVisible', label: 'Public Profile', description: 'Show your profile to other users' },
        { key: 'showStats', label: 'Show Statistics', description: 'Display your performance stats publicly' },
      ],
    },
  ]

  const handleToggle = (group: keyof SettingsState, key: string) => {
    setSettings(prev => ({
      ...prev,
      [group]: {
        ...prev[group],
        [key]: !(prev[group] as Record<string, boolean>)[key],
      },
    }))
  }

  return (
    <ProtectedRoute allowedRoles={['owner']}>
      <OwnerLayout title="Settings" subtitle="Manage your account and preferences">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 backdrop-blur-xl"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Profile Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-white/70 font-medium">Full Name</label>
              <input
                type="text"
                defaultValue={user?.name}
                className="w-full mt-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-sm text-white/70 font-medium">Email</label>
              <input
                type="email"
                defaultValue={user?.email}
                disabled
                className="w-full mt-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/60 cursor-not-allowed"
              />
            </div>
          </div>
        </motion.div>

        {/* Settings Groups */}
        {settingGroups.map((group, groupIdx) => {
          const Icon = group.icon
          return (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (groupIdx + 1) }}
              className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 backdrop-blur-xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-cyan-500/20">
                  <Icon className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">{group.title}</h3>
              </div>

              <div className="space-y-4">
                {group.settings.map((setting) => {
                  const isEnabled = (settings[group.key] as Record<string, boolean>)[setting.key]
                  return (
                    <div key={setting.key} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-all">
                      <div>
                        <p className="text-white font-medium">{setting.label}</p>
                        <p className="text-sm text-white/60 mt-1">{setting.description}</p>
                      </div>
                      <button
                        onClick={() => handleToggle(group.key, setting.key)}
                        className={`relative w-12 h-6 rounded-full transition-all ${
                          isEnabled ? 'bg-cyan-500' : 'bg-white/10'
                        } border border-white/20`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            isEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )
        })}

        {/* Save Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-2xl py-4 text-white font-semibold flex items-center justify-center gap-2 transition-all"
        >
          <Save className="w-5 h-5" />
          Save Changes
        </motion.button>
      </OwnerLayout>
    </ProtectedRoute>
  )
}
