'use client'

import { motion } from 'framer-motion'
import { Users, Trophy } from 'lucide-react'
import { ProtectedRoute } from '@/components/protected-route'
import { OrganizerLayout } from '@/components/organizer-layout'
import { useAuth } from '@/TurfArena/lib/auth-context'
import { useState } from 'react'

export default function TeamsPage() {
  const { user } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  const teams = [
    {
      id: '1',
      name: 'Phoenix Rising',
      tournament: 'City Champions League',
      members: 11,
      requiredMembers: 11,
      wins: 8,
      losses: 2,
      registeredOn: 'Jun 15, 2024',
      status: 'Complete',
    },
    {
      id: '2',
      name: 'Thunder Squad',
      tournament: 'Weekend Premier Cup',
      members: 9,
      requiredMembers: 11,
      wins: 6,
      losses: 1,
      registeredOn: 'Jun 18, 2024',
      status: 'Incomplete',
    },
    {
      id: '3',
      name: 'Victory United',
      tournament: 'City Champions League',
      members: 13,
      requiredMembers: 11,
      wins: 7,
      losses: 3,
      registeredOn: 'Jun 12, 2024',
      status: 'Complete',
    },
    {
      id: '4',
      name: 'Dragons FC',
      tournament: 'Weekend Premier Cup',
      members: 10,
      requiredMembers: 11,
      wins: 5,
      losses: 2,
      registeredOn: 'Jun 20, 2024',
      status: 'Incomplete',
    },
  ]

  return (
    <ProtectedRoute allowedRoles={['organizer']}>
      <OrganizerLayout
        title="Teams"
        subtitle="Manage registered teams across all tournaments"
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
      >
        {/* Teams List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">All Teams</h3>
              <p className="text-sm text-white/60 mt-1">Manage all registered teams</p>
            </div>
          </div>

          <div className="space-y-3">
            {teams.map((team, idx) => {
              const memberPercentage = (team.members / team.requiredMembers) * 100
              const isComplete = team.members >= team.requiredMembers
              return (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all p-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:items-center">
                    <div>
                      <h4 className="font-semibold text-white text-sm">{team.name}</h4>
                      <p className="text-xs text-white/60 mt-1">{team.tournament}</p>
                      <span
                        className={`inline-block text-xs font-semibold mt-2 px-2.5 py-1 rounded-full ${
                          isComplete
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-orange-500/20 text-orange-300'
                        }`}
                      >
                        {team.status}
                      </span>
                    </div>

                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-xs text-white/60 mb-1">Members Required</p>
                      <p className="text-sm font-bold text-white">{team.members}/{team.requiredMembers}</p>
                      <div className="w-full bg-white/10 rounded-full h-1.5 mt-2">
                        <div 
                          className={`h-full rounded-full transition-all ${isComplete ? 'bg-gradient-to-r from-emerald-500 to-teal-600' : 'bg-gradient-to-r from-orange-500 to-yellow-500'}`} 
                          style={{ width: `${Math.min(memberPercentage, 100)}%` }} 
                        />
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-xs text-white/60 mb-1">Wins</p>
                      <p className="text-sm font-bold text-emerald-400">{team.wins}</p>
                    </div>

                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-xs text-white/60 mb-1">Losses</p>
                      <p className="text-sm font-bold text-red-400">{team.losses}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-white/60">Registered</p>
                      <p className="text-sm font-semibold text-white mt-1">{team.registeredOn}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </OrganizerLayout>
    </ProtectedRoute>
  )
}
