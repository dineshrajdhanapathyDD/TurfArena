'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Radio, Goal, Footprints, Square, Flag, ChevronLeft, ChevronRight } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { BackHeader } from '@/components/back-header'
import { matchEvents } from '@/TurfArena/lib/data'

type Sport = 'football' | 'cricket'

interface LiveMatch {
  id: string
  sport: Sport
  tournament: string
  homeTeam: string
  awayTeam: string
  homeAbbr: string
  awayAbbr: string
}

const liveMatches: LiveMatch[] = [
  {
    id: 'lm1',
    sport: 'football',
    tournament: 'City Champions League',
    homeTeam: 'Thunder FC',
    awayTeam: 'Strikers',
    homeAbbr: 'T',
    awayAbbr: 'S',
  },
  {
    id: 'lm2',
    sport: 'cricket',
    tournament: 'Box Cricket Blast',
    homeTeam: 'Knight Riders',
    awayTeam: 'Chennai Warriors',
    homeAbbr: 'KR',
    awayAbbr: 'CW',
  },
]

const eventIcon: Record<string, typeof Goal> = {
  Goal: Goal,
  Assist: Footprints,
  'Yellow Card': Square,
  'Red Card': Square,
  Wicket: Flag,
  Boundary: Goal,
  Six: Goal,
}

const cricketEvents = [
  { over: '2.3', type: 'Boundary', team: 'home', player: 'V. Kohli', runs: 4 },
  { over: '4.1', type: 'Wicket', team: 'home', player: 'R. Sharma', bowler: 'J. Bumrah' },
  { over: '6.4', type: 'Six', team: 'home', player: 'V. Kohli', runs: 6 },
  { over: '8.2', type: 'Wicket', team: 'home', player: 'S. Gill', bowler: 'M. Shami' },
  { over: '11.5', type: 'Boundary', team: 'home', player: 'K. Rahul', runs: 4 },
]

export default function LivePage() {
  const [matchIdx, setMatchIdx] = useState(0)
  const match = liveMatches[matchIdx]

  // Football state
  const [minute, setMinute] = useState(82)
  const [homeGoals, setHomeGoals] = useState(2)
  const [awayGoals, setAwayGoals] = useState(1)
  const [possession, setPossession] = useState(58)

  // Cricket state
  const [runs, setRuns] = useState(145)
  const [wickets, setWickets] = useState(4)
  const [overs, setOvers] = useState(14.3)
  const [awayRuns, setAwayRuns] = useState(132)
  const [awayWickets, setAwayWickets] = useState(6)
  const [awayOvers, setAwayOvers] = useState(15.1)
  const [runRate, setRunRate] = useState(10.1)

  useEffect(() => {
    const id = setInterval(() => {
      if (match.sport === 'football') {
        setMinute((m) => (m >= 90 ? 90 : m + 1))
        setPossession((p) => Math.min(70, Math.max(40, p + (Math.random() > 0.5 ? 1 : -1))))
      } else {
        setRuns((r) => r + Math.floor(Math.random() * 3))
        setOvers((o) => {
          const ball = Math.round((o % 1) * 10)
          if (ball >= 5) return Math.floor(o) + 1
          return +(o + 0.1).toFixed(1)
        })
        setRunRate(+(runs / (Math.floor(overs) || 1)).toFixed(1))
      }
    }, 3000)
    return () => clearInterval(id)
  }, [match.sport, runs, overs])

  function prevMatch() {
    setMatchIdx((i) => (i > 0 ? i - 1 : liveMatches.length - 1))
  }

  function nextMatch() {
    setMatchIdx((i) => (i < liveMatches.length - 1 ? i + 1 : 0))
  }

  return (
    <AppShell withNav={false} className="pb-10">
      <BackHeader
        title="Live Match Center"
        right={
          <span className="flex items-center gap-1.5 rounded-full bg-danger/15 px-2.5 py-1 text-xs font-semibold text-danger">
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="size-2 rounded-full bg-danger"
            />
            LIVE
          </span>
        }
      />

      {/* Match switcher */}
      <div className="flex items-center justify-between px-5 pt-3">
        <button onClick={prevMatch} className="flex size-8 items-center justify-center rounded-full bg-surface-2">
          <ChevronLeft className="size-4" />
        </button>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">{match.tournament}</p>
          <p className="text-[10px] text-muted-foreground/70 mt-0.5">
            {matchIdx + 1} of {liveMatches.length} live matches
          </p>
        </div>
        <button onClick={nextMatch} className="flex size-8 items-center justify-center rounded-full bg-surface-2">
          <ChevronRight className="size-4" />
        </button>
      </div>

      {/* Sport badge */}
      <div className="flex justify-center mt-2">
        <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
          match.sport === 'football' ? 'bg-success/15 text-success' : 'bg-primary/15 text-primary'
        }`}>
          {match.sport === 'football' ? '⚽ Football' : '🏏 Cricket'}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {match.sport === 'football' ? (
          <motion.div
            key="football"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {/* Football Score Card */}
            <section className="px-5 pt-4">
              <div className="glass shadow-soft rounded-[24px] p-6">
                <div className="mb-4 text-center">
                  <span className="rounded-full bg-surface-2 px-3 py-1 text-xs text-muted-foreground">
                    {minute}&apos; min
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-1 flex-col items-center gap-2">
                    <span className="flex size-14 items-center justify-center rounded-[18px] bg-primary/15 text-xl font-bold text-primary">
                      {match.homeAbbr}
                    </span>
                    <span className="text-sm font-medium">{match.homeTeam}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <AnimatedScore value={homeGoals} />
                    <span className="text-2xl font-bold text-muted-foreground">:</span>
                    <AnimatedScore value={awayGoals} />
                  </div>
                  <div className="flex flex-1 flex-col items-center gap-2">
                    <span className="flex size-14 items-center justify-center rounded-[18px] bg-secondary/15 text-xl font-bold text-secondary">
                      {match.awayAbbr}
                    </span>
                    <span className="text-sm font-medium">{match.awayTeam}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Football Live Stats */}
            <section className="px-5 pt-5">
              <div className="glass rounded-[20px] p-5">
                <h3 className="mb-4 font-semibold">Live Statistics</h3>
                <StatBar label="Possession" home={possession} away={100 - possession} suffix="%" />
                <StatBar label="Shots" home={12} away={8} />
                <StatBar label="Corners" home={6} away={3} />
                <StatBar label="Fouls" home={4} away={7} />
              </div>
            </section>

            {/* Football Events */}
            <section className="px-5 pt-6">
              <h3 className="mb-3 font-semibold">Match Events</h3>
              <div className="relative space-y-3 pl-6">
                <div className="absolute left-2 top-2 bottom-2 w-px bg-border" />
                {[...matchEvents].reverse().map((e, i) => {
                  const Icon = eventIcon[e.type] ?? Flag
                  const color =
                    e.type === 'Goal'
                      ? 'text-success bg-success/15'
                      : e.type === 'Red Card'
                        ? 'text-danger bg-danger/15'
                        : e.type === 'Yellow Card'
                          ? 'text-warning bg-warning/15'
                          : 'text-secondary bg-secondary/15'
                  return (
                    <motion.div
                      key={`${e.minute}-${i}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="relative flex items-center gap-3"
                    >
                      <span className={`absolute -left-6 flex size-5 items-center justify-center rounded-full ${color}`}>
                        <Icon className="size-3" />
                      </span>
                      <div className="glass flex flex-1 items-center gap-3 rounded-[14px] px-4 py-2.5">
                        <span className="font-mono text-sm font-bold text-muted-foreground">
                          {e.minute}&apos;
                        </span>
                        <div>
                          <p className="text-sm font-medium">{e.type}</p>
                          <p className="text-xs text-muted-foreground">
                            {e.player} &middot; {e.team === 'home' ? match.homeTeam : match.awayTeam}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </section>
          </motion.div>
        ) : (
          <motion.div
            key="cricket"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {/* Cricket Score Card */}
            <section className="px-5 pt-4">
              <div className="glass shadow-soft rounded-[24px] p-6">
                <div className="space-y-4">
                  {/* Batting team */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex size-12 items-center justify-center rounded-[14px] bg-primary/15 text-sm font-bold text-primary">
                        {match.homeAbbr}
                      </span>
                      <div>
                        <p className="text-sm font-semibold">{match.homeTeam}</p>
                        <p className="text-[11px] text-muted-foreground">Batting</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">
                        {runs}<span className="text-base text-muted-foreground">/{wickets}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">({overs} ov)</p>
                    </div>
                  </div>

                  <div className="border-t border-border" />

                  {/* Bowling team */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex size-12 items-center justify-center rounded-[14px] bg-secondary/15 text-sm font-bold text-secondary">
                        {match.awayAbbr}
                      </span>
                      <div>
                        <p className="text-sm font-semibold">{match.awayTeam}</p>
                        <p className="text-[11px] text-muted-foreground">Completed</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-muted-foreground">
                        {awayRuns}<span className="text-base">/{awayWickets}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">({awayOvers} ov)</p>
                    </div>
                  </div>
                </div>

                {/* Target info */}
                <div className="mt-4 rounded-[14px] bg-surface-2 p-3 text-center">
                  <p className="text-xs text-muted-foreground">
                    {match.homeTeam} need <span className="font-bold text-foreground">{awayRuns - runs + 1} runs</span> from{' '}
                    <span className="font-bold text-foreground">{Math.round((20 - overs) * 6)} balls</span>
                  </p>
                </div>
              </div>
            </section>

            {/* Cricket Stats */}
            <section className="px-5 pt-5">
              <div className="glass rounded-[20px] p-5">
                <h3 className="mb-4 font-semibold">Match Stats</h3>
                <div className="grid grid-cols-4 gap-3 text-center">
                  {[
                    { label: 'Run Rate', value: runRate.toString() },
                    { label: 'Req. Rate', value: ((awayRuns - runs + 1) / (20 - overs) || 0).toFixed(1) },
                    { label: 'Boundaries', value: '14' },
                    { label: 'Sixes', value: '6' },
                  ].map((s) => (
                    <div key={s.label} className="glass rounded-[12px] p-2.5">
                      <p className="text-lg font-bold">{s.value}</p>
                      <p className="text-[9px] text-muted-foreground">{s.label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <StatBar label="Run Rate" home={runRate} away={+(awayRuns / (Math.floor(awayOvers) || 1)).toFixed(1)} />
                  <StatBar label="Wickets" home={wickets} away={awayWickets} />
                  <StatBar label="Extras" home={8} away={12} />
                </div>
              </div>
            </section>

            {/* Cricket Events */}
            <section className="px-5 pt-6">
              <h3 className="mb-3 font-semibold">Ball-by-Ball</h3>
              <div className="relative space-y-3 pl-6">
                <div className="absolute left-2 top-2 bottom-2 w-px bg-border" />
                {[...cricketEvents].reverse().map((e, i) => {
                  const color =
                    e.type === 'Wicket'
                      ? 'text-danger bg-danger/15'
                      : e.type === 'Six'
                        ? 'text-warning bg-warning/15'
                        : 'text-success bg-success/15'
                  return (
                    <motion.div
                      key={`${e.over}-${i}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="relative flex items-center gap-3"
                    >
                      <span className={`absolute -left-6 flex size-5 items-center justify-center rounded-full ${color}`}>
                        <span className="text-[8px] font-bold">
                          {e.type === 'Wicket' ? 'W' : e.type === 'Six' ? '6' : '4'}
                        </span>
                      </span>
                      <div className="glass flex flex-1 items-center gap-3 rounded-[14px] px-4 py-2.5">
                        <span className="font-mono text-sm font-bold text-muted-foreground">
                          {e.over}
                        </span>
                        <div>
                          <p className="text-sm font-medium">{e.type}</p>
                          <p className="text-xs text-muted-foreground">
                            {e.player}
                            {e.type === 'Wicket' && e.bowler && ` · b. ${e.bowler}`}
                            {e.runs && ` · ${e.runs} runs`}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  )
}

function AnimatedScore({ value }: { value: number }) {
  return (
    <div className="relative flex size-12 items-center justify-center overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -30, opacity: 0 }}
          className="text-4xl font-bold tabular-nums"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

function StatBar({
  label,
  home,
  away,
  suffix = '',
}: {
  label: string
  home: number
  away: number
  suffix?: string
}) {
  const total = home + away
  const homePct = total > 0 ? (home / total) * 100 : 50
  return (
    <div className="mb-4 last:mb-0">
      <div className="mb-1.5 flex justify-between text-sm">
        <span className="font-semibold text-primary">
          {home}
          {suffix}
        </span>
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold text-secondary">
          {away}
          {suffix}
        </span>
      </div>
      <div className="flex h-1.5 overflow-hidden rounded-full bg-surface-2">
        <motion.div
          className="h-full bg-primary"
          animate={{ width: `${homePct}%` }}
          transition={{ duration: 0.6 }}
        />
        <div className="h-full flex-1 bg-secondary" />
      </div>
    </div>
  )
}
