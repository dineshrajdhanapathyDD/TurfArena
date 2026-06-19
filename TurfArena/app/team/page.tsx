'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Crown, UserPlus, Settings2, Trophy, Target, Users } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { BottomNav } from '@/components/bottom-nav'
import { teamRoster } from '@/TurfArena/lib/data'

// 4-2-1 style positions on the pitch (percentages)
const formation = [
  { x: 50, y: 88, label: 'GK' },
  { x: 22, y: 66, label: 'DEF' },
  { x: 42, y: 70, label: 'DEF' },
  { x: 58, y: 70, label: 'DEF' },
  { x: 78, y: 66, label: 'DEF' },
  { x: 35, y: 44, label: 'MID' },
  { x: 65, y: 44, label: 'MID' },
  { x: 50, y: 18, label: 'ST' },
]

export default function TeamPage() {
  return (
    <AppShell>
      {/* Banner */}
      <div className="relative h-40">
        <Image
          src="/images/turf-football-night.png"
          alt="Team banner"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/20" />
        <div className="absolute bottom-4 left-5 flex items-center gap-3">
          <span className="flex size-14 items-center justify-center rounded-[18px] bg-primary text-2xl font-bold text-primary-foreground">
            T
          </span>
          <div>
            <h1 className="text-xl font-bold">Thunder FC</h1>
            <p className="text-sm text-muted-foreground">Bengaluru · Est. 2022</p>
          </div>
        </div>
      </div>

      {/* Captain controls */}
      <div className="flex gap-3 px-5 pt-4">
        <button className="glass flex flex-1 items-center justify-center gap-2 rounded-[16px] py-3 text-sm font-semibold">
          <UserPlus className="size-4 text-primary" /> Invite Players
        </button>
        <button className="glass flex size-11 items-center justify-center rounded-[16px]">
          <Settings2 className="size-5" />
        </button>
      </div>

      {/* Team stats */}
      <section className="grid grid-cols-3 gap-3 px-5 pt-4">
        {[
          { icon: Trophy, label: 'Trophies', value: 5, c: 'text-warning' },
          { icon: Target, label: 'Win Rate', value: '64%', c: 'text-success' },
          { icon: Users, label: 'Squad', value: teamRoster.length, c: 'text-secondary' },
        ].map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="glass rounded-[16px] p-3 text-center">
              <Icon className={`mx-auto size-5 ${s.c}`} />
              <p className="mt-1.5 font-bold">{s.value}</p>
              <p className="text-[11px] text-muted-foreground">{s.label}</p>
            </div>
          )
        })}
      </section>

      {/* Formation view */}
      <section className="px-5 pt-6">
        <h3 className="mb-3 font-semibold">Formation · 4-2-1</h3>
        <div className="relative h-72 overflow-hidden rounded-[20px] border border-border bg-gradient-to-b from-success/15 to-primary/10">
          {/* pitch markings */}
          <div className="absolute inset-4 rounded-[12px] border border-foreground/15" />
          <div className="absolute left-1/2 top-1/2 size-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground/15" />
          <div className="absolute left-4 right-4 top-1/2 h-px bg-foreground/15" />
          {formation.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06, type: 'spring' }}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-soft">
                {p.label}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Roster */}
      <section className="px-5 pt-6">
        <h3 className="mb-3 font-semibold">Roster</h3>
        <div className="space-y-2">
          {teamRoster.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass flex items-center gap-3 rounded-[16px] p-3"
            >
              <span className="w-6 text-center font-mono font-bold text-muted-foreground">
                {p.number}
              </span>
              <Image
                src={p.avatar}
                alt={p.name}
                width={40}
                height={40}
                className="size-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="flex items-center gap-1.5 font-medium">
                  {p.name}
                  {p.captain && <Crown className="size-3.5 text-warning" />}
                </p>
                <p className="text-xs text-muted-foreground">{p.position}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <BottomNav />
    </AppShell>
  )
}
