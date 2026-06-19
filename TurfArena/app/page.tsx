'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import Image from 'next/image'

export default function SplashPage() {
  return (
    <AppShell withNav={false} className="flex min-h-dvh flex-col relative overflow-hidden">
      {/* Stadium background with overlay */}
      <div 
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/images/auth-bg.png)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/70" />
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center px-6 text-center">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 16 }}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center mb-4 shadow-lg"
        >
          <span className="text-2xl font-bold text-white">T</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-[11px] uppercase tracking-[0.2em] text-white/60"
        >
          Welcome to
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-2 text-5xl font-black tracking-tight text-white"
        >
          Turf<span className="text-cyan-400">Arena</span>
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-5 text-lg font-semibold leading-snug text-balance text-white"
        >
          Your Sports Journey Starts Here
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-3 max-w-[320px] text-sm text-white/75 text-pretty"
        >
          Join tournaments. Track performance. Build your sports identity.
        </motion.p>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mt-10 grid grid-cols-3 gap-3 w-full max-w-sm"
        >
          <div className="bg-gradient-to-br from-teal-500/20 to-teal-600/10 backdrop-blur border border-teal-400/30 rounded-2xl p-4 text-center hover:border-teal-400/50 transition-all">
            <div className="text-2xl font-bold text-cyan-400">🏆</div>
            <p className="mt-2 text-xs font-semibold text-white">Join Tournaments</p>
          </div>
          <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 backdrop-blur border border-cyan-400/30 rounded-2xl p-4 text-center hover:border-cyan-400/50 transition-all">
            <div className="text-2xl font-bold text-green-400">⚽</div>
            <p className="mt-2 text-xs font-semibold text-white">Book Turfs</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 backdrop-blur border border-emerald-400/30 rounded-2xl p-4 text-center hover:border-emerald-400/50 transition-all">
            <div className="text-2xl font-bold text-blue-400">📊</div>
            <p className="mt-2 text-xs font-semibold text-white">Track Stats</p>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="px-6 pb-12"
      >
        <Link href="/onboarding">
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="shadow-glow-primary flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 py-4 text-base font-semibold text-white transition-colors"
          >
            Get Started
            <ArrowRight className="size-5" />
          </motion.button>
        </Link>
        <Link
          href="/auth"
          className="mt-4 block text-center text-sm text-white/60 hover:text-white transition-colors"
        >
          I already have an account
        </Link>
      </motion.div>
    </AppShell>
  )
}
