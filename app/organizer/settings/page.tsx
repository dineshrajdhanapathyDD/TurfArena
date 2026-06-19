'use client'

import { motion } from 'framer-motion'
import { Bell, Lock, Users, Save } from 'lucide-react'
import { ProtectedRoute } from '@/components/protected-route'
import { OrganizerLayout } from '@/components/organizer-layout'
import { useAuth } from '@/lib/auth-context'
import { useState } from 'react'

interface SettingsState {
  notifications: {
    email: boolean
    sms: boolean
    tournamentUpdates: boolean
    paymentReminders: boolean
  }
  security: {
    twoFactor: boolean
  }
  privacy: {
    profilePublic: boolean
    showStats: boolean
  }
}

export default function OrganizerSettingsPage() {
  const { user } = useAuth()
  const [settings, setSettings] = useState<SettingsState>({
    notifications: {
      email: true,
      sms: false,
      tournamentUpdates: true,
      paymentReminders: true,
    },
    security: {
      twoFactor: false,
    },
    privacy: {
      profilePublic: true,
      showStats: true,
    },
  })
  const [saved, setSaved] = useState(false)

  function toggleSetting(category: keyof SettingsState, key: string) {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !(prev[category] as Record<string, boolean>)[key],
      },
    }))
    setSaved(false)
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <ProtectedRoute allowedRoles={['organizer']}>
      <OrganizerLayout title="Settings" subtitle="Manage your organizer preferences">
        <div className="space-y-6">
          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 backdrop-blur-xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
                <Bell className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-semibold text-white">Notifications</h3>
            </div>
            <div className="space-y-4">
              {Object.entries(settings.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-sm text-white/80 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <button
                    onClick={() => toggleSetting('notifications', key)}
                    className={`w-11 h-6 rounded-full transition-colors relative ${value ? 'bg-cyan-500' : 'bg-white/20'}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${value ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Security */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 backdrop-blur-xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 text-white">
                <Lock className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-semibold text-white">Security</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-sm text-white/80">Two-Factor Authentication</span>
                <button
                  onClick={() => toggleSetting('security', 'twoFactor')}
                  className={`w-11 h-6 rounded-full transition-colors relative ${settings.security.twoFactor ? 'bg-cyan-500' : 'bg-white/20'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${settings.security.twoFactor ? 'left-6' : 'left-1'}`} />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Privacy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 backdrop-blur-xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-semibold text-white">Privacy</h3>
            </div>
            <div className="space-y-4">
              {Object.entries(settings.privacy).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-sm text-white/80 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <button
                    onClick={() => toggleSetting('privacy', key)}
                    className={`w-11 h-6 rounded-full transition-colors relative ${value ? 'bg-cyan-500' : 'bg-white/20'}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${value ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Save button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 rounded-2xl py-4 text-white font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <Save className="w-5 h-5" />
            {saved ? 'Saved!' : 'Save Changes'}
          </motion.button>
        </div>
      </OrganizerLayout>
    </ProtectedRoute>
  )
}
