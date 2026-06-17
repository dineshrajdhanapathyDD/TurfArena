'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ChevronRight,
  Moon,
  Bell,
  Shield,
  CreditCard,
  Globe,
  HelpCircle,
  LogOut,
  Building2,
  Trophy,
} from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { BottomNav } from '@/components/bottom-nav'
import { BackHeader } from '@/components/back-header'

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={on}
      className={`relative h-6 w-11 rounded-full transition-colors ${on ? 'bg-primary' : 'bg-surface-3'}`}
    >
      <motion.span
        layout
        className="absolute top-0.5 size-5 rounded-full bg-foreground"
        animate={{ left: on ? 22 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  )
}

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true)
  const [push, setPush] = useState(true)

  const dashboards = [
    { label: 'Organizer Dashboard', desc: 'Manage your tournaments', href: '/organizer', icon: Trophy },
    { label: 'Turf Owner Dashboard', desc: 'Manage venues & bookings', href: '/owner', icon: Building2 },
  ]

  const items = [
    { label: 'Privacy & Security', icon: Shield, href: '#' },
    { label: 'Payment Methods', icon: CreditCard, href: '#' },
    { label: 'Language & Region', icon: Globe, href: '#' },
    { label: 'Help & Support', icon: HelpCircle, href: '#' },
  ]

  return (
    <AppShell>
      <BackHeader title="Settings" />

      <section className="px-5 pt-2">
        <Link href="/profile">
          <div className="glass flex items-center gap-3 rounded-[20px] p-4">
            <Image
              src="/images/player-1.png"
              alt="Arjun Mehta"
              width={56}
              height={56}
              className="size-14 rounded-full object-cover ring-2 ring-primary/40"
            />
            <div className="flex-1">
              <p className="font-bold">Arjun Mehta</p>
              <p className="text-sm text-muted-foreground">View and edit profile</p>
            </div>
            <ChevronRight className="size-5 text-muted-foreground" />
          </div>
        </Link>
      </section>

      <section className="px-5 pt-6">
        <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Switch Mode</h3>
        <div className="space-y-3">
          {dashboards.map((d) => {
            const Icon = d.icon
            return (
              <Link key={d.label} href={d.href}>
                <motion.div whileTap={{ scale: 0.98 }} className="glass flex items-center gap-3 rounded-[18px] p-4">
                  <span className="flex size-10 items-center justify-center rounded-[12px] bg-secondary/15">
                    <Icon className="size-5 text-secondary" />
                  </span>
                  <div className="flex-1">
                    <p className="font-medium">{d.label}</p>
                    <p className="text-xs text-muted-foreground">{d.desc}</p>
                  </div>
                  <ChevronRight className="size-5 text-muted-foreground" />
                </motion.div>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="px-5 pt-6">
        <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Preferences</h3>
        <div className="glass divide-y divide-border rounded-[18px]">
          <div className="flex items-center gap-3 p-4">
            <span className="flex size-10 items-center justify-center rounded-[12px] bg-surface-3">
              <Moon className="size-5" />
            </span>
            <p className="flex-1 font-medium">Dark Mode</p>
            <Toggle on={darkMode} onChange={() => setDarkMode((v) => !v)} />
          </div>
          <div className="flex items-center gap-3 p-4">
            <span className="flex size-10 items-center justify-center rounded-[12px] bg-surface-3">
              <Bell className="size-5" />
            </span>
            <p className="flex-1 font-medium">Push Notifications</p>
            <Toggle on={push} onChange={() => setPush((v) => !v)} />
          </div>
        </div>
      </section>

      <section className="px-5 pt-6">
        <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Account</h3>
        <div className="glass divide-y divide-border rounded-[18px]">
          {items.map((it) => {
            const Icon = it.icon
            return (
              <Link key={it.label} href={it.href} className="flex items-center gap-3 p-4">
                <span className="flex size-10 items-center justify-center rounded-[12px] bg-surface-3">
                  <Icon className="size-5" />
                </span>
                <p className="flex-1 font-medium">{it.label}</p>
                <ChevronRight className="size-5 text-muted-foreground" />
              </Link>
            )
          })}
        </div>
      </section>

      <section className="px-5 pt-6">
        <Link href="/auth">
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="flex w-full items-center justify-center gap-2 rounded-[18px] bg-danger/15 p-4 font-semibold text-danger"
          >
            <LogOut className="size-5" /> Log Out
          </motion.button>
        </Link>
        <p className="mt-4 text-center text-xs text-muted-foreground">TurfArena v1.0.0</p>
      </section>

      <BottomNav />
    </AppShell>
  )
}
