'use client'

import { use, useState } from 'react'
import { useRouter, notFound } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, CheckCircle2, ChevronRight, AlertCircle, Trophy, UserPlus, X } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { BackHeader } from '@/components/back-header'
import { tournaments, teamRoster, formatCurrency } from '@/lib/data'

type Step = 'team' | 'players' | 'review' | 'success'

export default function TournamentRegisterPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const tournament = tournaments.find((t) => t.id === id)

  const [step, setStep] = useState<Step>('team')
  const [teamName, setTeamName] = useState('')
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([])
  const [captainId, setCaptainId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!tournament) notFound()

  const availablePlayers = teamRoster

  function togglePlayer(playerId: string) {
    setSelectedPlayers((prev) =>
      prev.includes(playerId) ? prev.filter((id) => id !== playerId) : [...prev, playerId]
    )
  }

  function canProceed(): boolean {
    switch (step) {
      case 'team':
        return teamName.trim().length >= 3
      case 'players':
        return selectedPlayers.length >= 5 && captainId !== ''
      case 'review':
        return true
      default:
        return false
    }
  }

  function nextStep() {
    switch (step) {
      case 'team':
        setStep('players')
        break
      case 'players':
        setStep('review')
        break
      case 'review':
        handleSubmit()
        break
    }
  }

  async function handleSubmit() {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setStep('success')
  }

  const stepIndex = step === 'team' ? 0 : step === 'players' ? 1 : step === 'review' ? 2 : 3

  return (
    <AppShell withNav={false} className="pb-28">
      <BackHeader title="Register Team" />

      {/* Progress */}
      {step !== 'success' && (
        <div className="px-5 pt-4">
          <div className="flex items-center gap-2">
            {['Team Info', 'Players', 'Review'].map((label, i) => (
              <div key={label} className="flex flex-1 flex-col items-center gap-1.5">
                <div className="flex w-full items-center">
                  <div
                    className={`size-7 shrink-0 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      i <= stepIndex
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-surface-2 text-muted-foreground'
                    }`}
                  >
                    {i < stepIndex ? <CheckCircle2 className="size-4" /> : i + 1}
                  </div>
                  {i < 2 && (
                    <div className={`h-0.5 flex-1 transition-colors ${i < stepIndex ? 'bg-primary' : 'bg-surface-2'}`} />
                  )}
                </div>
                <span className="text-[10px] text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tournament header */}
      {step !== 'success' && (
        <div className="mx-5 mt-4 glass rounded-[16px] p-4 flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-primary/15">
            <Trophy className="size-5 text-primary" />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{tournament.name}</p>
            <p className="text-xs text-muted-foreground">{tournament.format} &middot; Entry: {formatCurrency(tournament.entryFee)}</p>
          </div>
        </div>
      )}

      <div className="px-5 pt-5">
        <AnimatePresence mode="wait">
          {/* ── Step 1: Team Info ── */}
          {step === 'team' && (
            <motion.div
              key="team"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div>
                <h2 className="text-lg font-bold">Team Information</h2>
                <p className="text-sm text-muted-foreground mt-1">Enter your team details to register</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Team Name</label>
                  <input
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="e.g. Thunder FC"
                    className="w-full h-12 rounded-[14px] bg-surface-2 px-4 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40"
                  />
                  {teamName.length > 0 && teamName.length < 3 && (
                    <p className="text-xs text-danger mt-1 flex items-center gap-1">
                      <AlertCircle className="size-3" /> Minimum 3 characters
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-1.5 block">Team Logo (Optional)</label>
                  <div className="flex h-20 items-center justify-center rounded-[14px] border-2 border-dashed border-border bg-surface-2 text-sm text-muted-foreground cursor-pointer hover:border-primary/40 transition-colors">
                    Tap to upload logo
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Step 2: Player Selection ── */}
          {step === 'players' && (
            <motion.div
              key="players"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div>
                <h2 className="text-lg font-bold">Select Players</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose at least 5 players and assign a captain
                </p>
              </div>

              <div className="flex items-center justify-between glass rounded-[14px] p-3">
                <span className="text-sm text-muted-foreground">Selected</span>
                <span className={`text-sm font-bold ${selectedPlayers.length >= 5 ? 'text-success' : 'text-foreground'}`}>
                  {selectedPlayers.length} / {availablePlayers.length}
                </span>
              </div>

              <div className="space-y-2">
                {availablePlayers.map((player) => {
                  const selected = selectedPlayers.includes(player.id)
                  const isCaptain = captainId === player.id
                  return (
                    <motion.div
                      key={player.id}
                      layout
                      className={`glass flex items-center gap-3 rounded-[16px] p-3 transition-colors cursor-pointer ${
                        selected ? 'ring-2 ring-primary/40' : ''
                      }`}
                      onClick={() => togglePlayer(player.id)}
                    >
                      <div className={`size-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        selected ? 'bg-primary border-primary' : 'border-muted-foreground/40'
                      }`}>
                        {selected && <CheckCircle2 className="size-3.5 text-primary-foreground" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{player.name}</p>
                        <p className="text-xs text-muted-foreground">{player.position} &middot; #{player.number}</p>
                      </div>
                      {selected && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setCaptainId(isCaptain ? '' : player.id)
                          }}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors ${
                            isCaptain
                              ? 'bg-warning/20 text-warning'
                              : 'bg-surface-2 text-muted-foreground hover:bg-primary/15 hover:text-primary'
                          }`}
                        >
                          {isCaptain ? 'Captain' : 'Set Captain'}
                        </button>
                      )}
                    </motion.div>
                  )
                })}
              </div>

              {selectedPlayers.length >= 5 && !captainId && (
                <p className="text-xs text-warning flex items-center gap-1">
                  <AlertCircle className="size-3" /> Please assign a captain
                </p>
              )}
            </motion.div>
          )}

          {/* ── Step 3: Review ── */}
          {step === 'review' && (
            <motion.div
              key="review"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div>
                <h2 className="text-lg font-bold">Review Registration</h2>
                <p className="text-sm text-muted-foreground mt-1">Confirm your details before submitting</p>
              </div>

              <div className="glass rounded-[18px] p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Team Name</span>
                  <span className="text-sm font-semibold">{teamName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Players</span>
                  <span className="text-sm font-semibold">{selectedPlayers.length} selected</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Captain</span>
                  <span className="text-sm font-semibold">
                    {availablePlayers.find((p) => p.id === captainId)?.name || '-'}
                  </span>
                </div>
                <div className="border-t border-border pt-3 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Entry Fee</span>
                  <span className="text-base font-bold text-primary">{formatCurrency(tournament.entryFee)}</span>
                </div>
              </div>

              <div className="glass rounded-[18px] p-4">
                <h3 className="text-sm font-semibold mb-3">Selected Players</h3>
                <div className="space-y-2">
                  {availablePlayers
                    .filter((p) => selectedPlayers.includes(p.id))
                    .map((player) => (
                      <div key={player.id} className="flex items-center gap-2 text-sm">
                        <span className="font-mono text-muted-foreground w-5">#{player.number}</span>
                        <span className="font-medium">{player.name}</span>
                        <span className="text-xs text-muted-foreground">({player.position})</span>
                        {captainId === player.id && (
                          <span className="ml-auto text-[10px] font-semibold text-warning bg-warning/15 px-2 py-0.5 rounded-full">
                            Captain
                          </span>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Success ── */}
          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center pt-12 space-y-5"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
                className="flex size-20 items-center justify-center rounded-full bg-success/15"
              >
                <CheckCircle2 className="size-10 text-success" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold">Registration Successful!</h2>
                <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                  <strong>{teamName}</strong> has been registered for{' '}
                  <strong>{tournament.name}</strong>. You will receive a confirmation notification shortly.
                </p>
              </div>

              <div className="glass rounded-[18px] p-4 w-full text-left space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tournament</span>
                  <span className="font-medium">{tournament.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">{tournament.date}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Venue</span>
                  <span className="font-medium">{tournament.venue}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount Paid</span>
                  <span className="font-bold text-primary">{formatCurrency(tournament.entryFee)}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 w-full pt-4">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => router.push(`/tournaments/${id}`)}
                  className="w-full rounded-[16px] bg-primary py-3.5 font-semibold text-primary-foreground"
                >
                  View Tournament
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => router.push('/tournaments')}
                  className="w-full rounded-[16px] bg-surface-2 py-3.5 font-semibold text-foreground"
                >
                  Browse More Tournaments
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fixed bottom CTA */}
      {step !== 'success' && (
        <div className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-md px-5 pb-5">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={nextStep}
            disabled={!canProceed() || isSubmitting}
            className="shadow-glow-primary glass-strong flex w-full items-center justify-center gap-2 rounded-[18px] bg-primary py-4 font-semibold text-primary-foreground disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="inline-block size-4 rounded-full border-2 border-primary-foreground border-t-transparent"
                />
                Processing Payment...
              </span>
            ) : step === 'review' ? (
              <>Pay {formatCurrency(tournament.entryFee)} &amp; Register</>
            ) : (
              <>
                Continue <ChevronRight className="size-4" />
              </>
            )}
          </motion.button>
        </div>
      )}
    </AppShell>
  )
}
