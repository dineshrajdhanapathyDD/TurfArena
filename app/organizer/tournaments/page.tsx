'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Users, Trophy, DollarSign, Plus, Edit2, Trash2, Calendar, X, Loader2, CheckCircle2 } from 'lucide-react'
import { ProtectedRoute } from '@/components/protected-route'
import { OrganizerLayout } from '@/components/organizer-layout'
import { useAuth } from '@/lib/auth-context'
import { useState, useEffect } from 'react'

interface Tournament {
  id: string
  tournamentId?: string
  name: string
  date: string
  teams: number
  totalSpots: number
  prizePool: number
  status: string
  sport?: string
  venue?: string
  city?: string
  format?: string
  entryFee?: number
  isLive?: boolean
}

export default function TournamentsPage() {
  const { user } = useAuth()
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // Form state
  const [form, setForm] = useState({
    name: '',
    sport: 'football',
    venue: '',
    city: '',
    date: '',
    format: '7v7 · Knockout',
    totalSpots: '16',
    prizePool: '',
    entryFee: '',
  })

  // Fetch tournaments from DynamoDB
  async function fetchTournaments() {
    try {
      setLoading(true)
      const res = await fetch('/api/tournaments')
      const data = await res.json()
      if (data.success && data.data) {
        const mapped = data.data.map((t: any) => ({
          id: t.tournamentId || t.id,
          tournamentId: t.tournamentId,
          name: t.name,
          date: t.date || 'TBD',
          teams: t.teamsJoined || 0,
          totalSpots: t.totalSpots || 16,
          prizePool: t.prizePool || 0,
          status: t.status === 'active' ? 'Active' : t.status === 'completed' ? 'Completed' : 'Upcoming',
          sport: t.sport,
          venue: t.venue,
          city: t.city,
          format: t.format,
          entryFee: t.entryFee,
          isLive: true,
        }))
        setTournaments(mapped)
      }
    } catch (e) {
      console.error('Failed to fetch tournaments:', e)
      setErrorMsg('Failed to load tournaments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTournaments() }, [])

  // Create tournament
  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.venue || !form.sport) {
      setErrorMsg('Name, sport, and venue are required')
      return
    }
    setCreating(true)
    setErrorMsg('')
    try {
      const res = await fetch('/api/tournaments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          sport: form.sport,
          venue: form.venue,
          city: form.city || 'Unknown',
          date: form.date || 'TBD',
          format: form.format,
          totalSpots: parseInt(form.totalSpots) || 16,
          prizePool: parseInt(form.prizePool) || 0,
          entryFee: parseInt(form.entryFee) || 0,
          organizerId: user?.id || 'org1',
        }),
      })
      const data = await res.json()
      if (data.success) {
        setSuccessMsg(`Tournament "${form.name}" created successfully!`)
        setShowCreate(false)
        setForm({ name: '', sport: 'football', venue: '', city: '', date: '', format: '7v7 · Knockout', totalSpots: '16', prizePool: '', entryFee: '' })
        fetchTournaments()
        setTimeout(() => setSuccessMsg(''), 4000)
      } else {
        setErrorMsg(data.error || 'Failed to create tournament')
      }
    } catch {
      setErrorMsg('Network error. Please try again.')
    } finally {
      setCreating(false)
    }
  }

  // Delete tournament
  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete tournament "${name}"? This cannot be undone.`)) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/tournaments/${id}/delete`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setSuccessMsg(`Tournament "${name}" deleted`)
        fetchTournaments()
        setTimeout(() => setSuccessMsg(''), 4000)
      } else {
        setErrorMsg(data.error || 'Failed to delete')
      }
    } catch {
      setErrorMsg('Network error')
    } finally {
      setDeleting(null)
    }
  }

  const stats = {
    total: tournaments.length,
    active: tournaments.filter(t => t.status === 'Active').length,
    totalTeams: tournaments.reduce((sum, t) => sum + (t.teams || 0), 0),
    totalPrize: tournaments.reduce((sum, t) => sum + (t.prizePool || 0), 0),
  }

  return (
    <ProtectedRoute allowedRoles={['organizer']}>
      <OrganizerLayout title="Tournaments" subtitle="Create and manage tournaments">
        {/* Success/Error Messages */}
        <AnimatePresence>
          {successMsg && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 px-4 py-3 text-sm text-emerald-300">
              <CheckCircle2 className="size-4" /> {successMsg}
            </motion.div>
          )}
          {errorMsg && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-4 flex items-center gap-2 rounded-xl bg-red-500/20 border border-red-500/30 px-4 py-3 text-sm text-red-300">
              <X className="size-4" /> {errorMsg}
              <button onClick={() => setErrorMsg('')} className="ml-auto text-red-400 hover:text-red-200"><X className="size-3.5" /></button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: 'Total', value: stats.total, icon: Trophy, color: 'text-purple-400' },
            { label: 'Active', value: stats.active, icon: Calendar, color: 'text-green-400' },
            { label: 'Teams', value: stats.totalTeams, icon: Users, color: 'text-blue-400' },
            { label: 'Prize Pool', value: `₹${(stats.totalPrize / 1000).toFixed(0)}K`, icon: DollarSign, color: 'text-yellow-400' },
          ].map((card, idx) => {
            const Icon = card.icon
            return (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                className="rounded-2xl bg-white/5 border border-white/10 p-4 sm:p-5 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-white/60">{card.label}</span>
                  <Icon className={`size-4 ${card.color}`} />
                </div>
                <p className="text-2xl font-bold text-white">{card.value}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Create Button */}
        <div className="mt-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">All Tournaments</h2>
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 px-4 py-2.5 text-sm font-medium text-white transition-colors">
            <Plus className="size-4" /> Create Tournament
          </motion.button>
        </div>

        {/* Create Tournament Modal */}
        <AnimatePresence>
          {showCreate && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
              onClick={() => setShowCreate(false)}>
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-lg rounded-2xl bg-gray-900 border border-white/10 p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xl font-bold text-white">Create Tournament</h3>
                  <button onClick={() => setShowCreate(false)} className="text-white/50 hover:text-white"><X className="size-5" /></button>
                </div>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-white/70 mb-1 block">Tournament Name *</label>
                    <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="e.g. City Champions League"
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-purple-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-white/70 mb-1 block">Sport *</label>
                      <select value={form.sport} onChange={e => setForm(f => ({ ...f, sport: e.target.value }))}
                        className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white outline-none focus:border-purple-500">
                        <option value="football">Football</option>
                        <option value="cricket">Cricket</option>
                        <option value="basketball">Basketball</option>
                        <option value="volleyball">Volleyball</option>
                        <option value="badminton">Badminton</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-white/70 mb-1 block">Format</label>
                      <select value={form.format} onChange={e => setForm(f => ({ ...f, format: e.target.value }))}
                        className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white outline-none focus:border-purple-500">
                        <option value="7v7 · Knockout">7v7 Knockout</option>
                        <option value="5v5 · League">5v5 League</option>
                        <option value="3v3 · Knockout">3v3 Knockout</option>
                        <option value="T10 · League">T10 League</option>
                        <option value="T20 · Knockout">T20 Knockout</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-white/70 mb-1 block">Venue *</label>
                      <input value={form.venue} onChange={e => setForm(f => ({ ...f, venue: e.target.value }))}
                        placeholder="e.g. Greenfield Arena"
                        className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-purple-500" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-white/70 mb-1 block">City</label>
                      <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                        placeholder="e.g. Bengaluru"
                        className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-purple-500" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-white/70 mb-1 block">Date</label>
                      <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                        className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white outline-none focus:border-purple-500" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-white/70 mb-1 block">Total Spots</label>
                      <input type="number" value={form.totalSpots} onChange={e => setForm(f => ({ ...f, totalSpots: e.target.value }))}
                        className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white outline-none focus:border-purple-500" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-white/70 mb-1 block">Prize Pool (₹)</label>
                      <input type="number" value={form.prizePool} onChange={e => setForm(f => ({ ...f, prizePool: e.target.value }))}
                        placeholder="50000"
                        className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-purple-500" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-white/70 mb-1 block">Entry Fee (₹)</label>
                      <input type="number" value={form.entryFee} onChange={e => setForm(f => ({ ...f, entryFee: e.target.value }))}
                        placeholder="1500"
                        className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-purple-500" />
                    </div>
                  </div>
                  <motion.button whileTap={{ scale: 0.97 }} type="submit" disabled={creating}
                    className="w-full rounded-xl bg-purple-600 hover:bg-purple-500 py-3.5 text-sm font-semibold text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                    {creating ? <><Loader2 className="size-4 animate-spin" /> Creating...</> : <><Plus className="size-4" /> Create Tournament</>}
                  </motion.button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tournament List */}
        <div className="mt-4 space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-6 animate-spin text-purple-400" />
              <span className="ml-2 text-sm text-white/60">Loading tournaments...</span>
            </div>
          ) : tournaments.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="size-12 mx-auto text-white/20 mb-3" />
              <p className="text-white/60">No tournaments yet</p>
              <p className="text-sm text-white/40 mt-1">Create your first tournament to get started</p>
            </div>
          ) : (
            tournaments.map((t, idx) => (
              <motion.div key={t.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                className="rounded-2xl bg-white/5 border border-white/10 p-4 sm:p-5 backdrop-blur-xl">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white truncate">{t.name}</h3>
                      {t.isLive && (
                        <span className="shrink-0 text-[9px] font-bold bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">DB</span>
                      )}
                      <span className={`shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        t.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                        t.status === 'Completed' ? 'bg-gray-500/20 text-gray-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>{t.status}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-white/50">
                      <span className="flex items-center gap-1"><Calendar className="size-3" /> {t.date}</span>
                      <span className="flex items-center gap-1"><Users className="size-3" /> {t.teams}/{t.totalSpots} teams</span>
                      <span className="flex items-center gap-1"><DollarSign className="size-3" /> ₹{(t.prizePool / 1000).toFixed(0)}K prize</span>
                      {t.sport && <span className="capitalize">{t.sport}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button className="rounded-lg bg-white/5 border border-white/10 p-2 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                      title="Edit">
                      <Edit2 className="size-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(t.tournamentId || t.id, t.name)}
                      disabled={deleting === (t.tournamentId || t.id) || t.status === 'Active'}
                      title={t.status === 'Active' ? 'Cannot delete active tournament' : 'Delete'}
                      className="rounded-lg bg-red-500/10 border border-red-500/20 p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                      {deleting === (t.tournamentId || t.id) ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                    </button>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="mt-3 w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${t.totalSpots > 0 ? (t.teams / t.totalSpots) * 100 : 0}%` }} />
                </div>
              </motion.div>
            ))
          )}
        </div>
      </OrganizerLayout>
    </ProtectedRoute>
  )
}
