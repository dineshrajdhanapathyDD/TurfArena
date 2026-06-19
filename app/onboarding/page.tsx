'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, MapPin, BarChart3, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { AppShell } from '@/components/app-shell'

const slides = [
  {
    Icon: Trophy,
    title: 'Join Tournaments',
    desc: 'Compete in exciting local tournaments, challenge other players, and showcase your skills on the platform.',
    color: 'from-teal-500/20 to-teal-600/10',
    border: 'border-teal-400/30',
    accent: 'text-teal-400',
  },
  {
    Icon: MapPin,
    title: 'Book Premium Turfs',
    desc: 'Reserve the best turfs in your area at unbeatable prices. Quality venues available at your fingertips.',
    color: 'from-cyan-500/20 to-cyan-600/10',
    border: 'border-cyan-400/30',
    accent: 'text-cyan-400',
  },
  {
    Icon: BarChart3,
    title: 'Track Performance',
    desc: 'Monitor your stats, improve your game, and build your sports identity on the platform.',
    color: 'from-emerald-500/20 to-emerald-600/10',
    border: 'border-emerald-400/30',
    accent: 'text-emerald-400',
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [i, setI] = useState(0)
  const last = i === slides.length - 1

  function next() {
    if (last) router.push('/auth')
    else setI((v) => v + 1)
  }

  function prev() {
    if (i > 0) setI((v) => v - 1)
  }

  const slide = slides[i]
  const Icon = slide.Icon

  return (
    <AppShell withNav={false} className="flex min-h-dvh flex-col relative overflow-hidden">
      {/* Background with gradient overlay */}
      <div 
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/images/auth-bg.png)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/70" />
      </div>

      <div className="flex items-center justify-between px-6 pt-6 relative z-10">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm font-semibold text-white"
        >
          Turf<span className="text-cyan-400">Arena</span>
        </motion.span>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => router.push('/auth')}
          className="text-sm text-white/60 hover:text-white transition-colors"
        >
          Skip
        </motion.button>
      </div>

      <div className="flex flex-1 items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.35 }}
            className="w-full text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className={`mx-auto flex w-20 h-20 items-center justify-center rounded-3xl bg-gradient-to-br ${slide.color} ${slide.border} border backdrop-blur`}
            >
              <Icon className={`w-10 h-10 ${slide.accent}`} />
            </motion.div>
            
            <motion.h2
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="mt-8 text-3xl font-bold text-white text-balance"
            >
              {slide.title}
            </motion.h2>
            
            <motion.p
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mx-auto mt-4 max-w-md text-white/75 text-pretty text-base leading-relaxed"
            >
              {slide.desc}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative z-10 px-6 pb-12">
        <div className="mb-8 flex justify-center gap-2">
          {slides.map((_, idx) => (
            <motion.span
              key={idx}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`h-2 rounded-full transition-all ${
                idx === i ? 'w-8 bg-cyan-400' : 'w-2 bg-white/30'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-4">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={prev}
            disabled={i === 0}
            className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all ${
              i === 0
                ? 'bg-white/10 text-white/40 cursor-not-allowed'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileTap={{ scale: 0.97 }}
            onClick={next}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 py-4 font-semibold text-white transition-colors shadow-lg"
          >
            {last ? 'Start Exploring' : 'Continue'}
            <ArrowRight className="size-5" />
          </motion.button>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={next}
            disabled={last}
            className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all ${
              last
                ? 'bg-white/10 text-white/40 cursor-not-allowed'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </AppShell>
  )
}
