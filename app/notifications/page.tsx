'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Radio, Trophy, CalendarCheck, Users, Bell } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { BackHeader } from '@/components/back-header'
import { notifications, type NotificationItem } from '@/lib/data'

const cats = ['All', 'Matches', 'Tournaments', 'Bookings', 'Community'] as const

const catIcon: Record<string, typeof Bell> = {
  Matches: Radio,
  Tournaments: Trophy,
  Bookings: CalendarCheck,
  Community: Users,
}
const catColor: Record<string, string> = {
  Matches: 'bg-danger/15 text-danger',
  Tournaments: 'bg-warning/15 text-warning',
  Bookings: 'bg-primary/15 text-primary',
  Community: 'bg-secondary/15 text-secondary',
}

export default function NotificationsPage() {
  const [cat, setCat] = useState<(typeof cats)[number]>('All')

  const filtered =
    cat === 'All'
      ? notifications
      : notifications.filter((n) => n.category === cat)

  const grouped = filtered.reduce<Record<string, NotificationItem[]>>((acc, n) => {
    ;(acc[n.category] ||= []).push(n)
    return acc
  }, {})

  return (
    <AppShell withNav={false}>
      <BackHeader title="Notifications" />

      <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 pt-4 pb-1">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              cat === c
                ? 'bg-primary text-primary-foreground'
                : 'bg-surface-2 text-muted-foreground'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="space-y-6 px-5 pt-4">
        {Object.entries(grouped).map(([group, items]) => {
          const Icon = catIcon[group] ?? Bell
          return (
            <div key={group}>
              <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
                {group}
              </h3>
              <div className="space-y-2">
                {items.map((n, i) => (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`glass flex items-start gap-3 rounded-[16px] p-3.5 ${
                      n.unread ? 'ring-1 ring-primary/30' : ''
                    }`}
                  >
                    <span
                      className={`flex size-10 items-center justify-center rounded-[12px] ${catColor[n.category]}`}
                    >
                      <Icon className="size-5" />
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{n.title}</p>
                      <p className="text-xs text-muted-foreground">{n.desc}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[11px] text-muted-foreground">
                        {n.time}
                      </span>
                      {n.unread && (
                        <span className="size-2 rounded-full bg-primary" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </AppShell>
  )
}
