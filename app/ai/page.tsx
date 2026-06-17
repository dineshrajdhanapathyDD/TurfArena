'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Send, TrendingUp, Target, Brain, Zap } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { BackHeader } from '@/components/back-header'

type Msg = { role: 'user' | 'ai'; text: string }

const suggestions = [
  'How can I improve my finishing?',
  'Predict my next match',
  'Best formation for 5v5?',
]

const cannedReply: Record<string, string> = {
  default:
    'Based on your last 10 matches, your conversion rate is up 12%. Focus on quick one-touch finishes inside the box and keep your shots low. Want a tailored drill plan?',
}

export default function AIPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'ai', text: 'Hey Arjun! I am your AI coach. Ask me anything about your game, tactics, or upcoming matches.' },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)

  function send(text: string) {
    if (!text.trim()) return
    setMessages((m) => [...m, { role: 'user', text }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages((m) => [...m, { role: 'ai', text: cannedReply.default }])
    }, 1100)
  }

  return (
    <AppShell>
      <BackHeader title="AI Insights" />

      {/* Prediction card */}
      <section className="px-5 pt-2">
        <div className="glass shadow-soft relative overflow-hidden rounded-[22px] p-5">
          <div className="absolute -right-6 -top-6 size-28 rounded-full bg-secondary/20 blur-2xl" />
          <div className="flex items-center gap-2">
            <Brain className="size-5 text-secondary" />
            <p className="font-semibold">Match Prediction</p>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Thunder FC vs Strikers United</p>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-primary">Thunder FC</span>
                <span className="text-muted-foreground">Strikers</span>
              </div>
              <div className="mt-1.5 flex h-2.5 overflow-hidden rounded-full bg-surface-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '68%' }}
                  transition={{ duration: 0.8 }}
                  className="bg-primary"
                />
              </div>
              <div className="mt-1.5 flex justify-between text-xs font-bold">
                <span className="text-primary">68%</span>
                <span className="text-muted-foreground">32%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Insight stats */}
      <section className="px-5 pt-4">
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: TrendingUp, label: 'Form', value: 'Hot', color: 'text-success', bg: 'bg-success/15' },
            { icon: Target, label: 'xG', value: '2.4', color: 'text-primary', bg: 'bg-primary/15' },
            { icon: Zap, label: 'Stamina', value: '88%', color: 'text-warning', bg: 'bg-warning/15' },
          ].map((s) => {
            const Icon = s.icon
            return (
              <div key={s.label} className="glass flex flex-col items-center gap-1.5 rounded-[16px] p-3">
                <span className={`flex size-9 items-center justify-center rounded-[11px] ${s.bg}`}>
                  <Icon className={`size-4 ${s.color}`} />
                </span>
                <p className="text-lg font-bold">{s.value}</p>
                <p className="text-[11px] text-muted-foreground">{s.label}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* AI Coach chat */}
      <section className="px-5 pt-6">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="size-5 text-secondary" />
          <h3 className="font-semibold">AI Coach</h3>
        </div>
        <div className="space-y-3">
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-[18px] px-4 py-3 text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'glass text-foreground'
                }`}
              >
                {m.text}
              </div>
            </motion.div>
          ))}
          <AnimatePresence>
            {typing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-start"
              >
                <div className="glass flex gap-1 rounded-[18px] px-4 py-3.5">
                  {[0, 1, 2].map((d) => (
                    <motion.span
                      key={d}
                      animate={{ y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, duration: 0.7, delay: d * 0.15 }}
                      className="size-2 rounded-full bg-muted-foreground"
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Suggestions */}
        <div className="mt-4 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="glass rounded-full px-3 py-2 text-xs font-medium text-muted-foreground"
            >
              {s}
            </button>
          ))}
        </div>
      </section>

      {/* Input bar */}
      <div className="sticky bottom-0 mt-6 border-t border-border bg-background/80 px-5 py-3 backdrop-blur-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            send(input)
          }}
          className="flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your AI coach..."
            className="h-12 flex-1 rounded-full bg-surface-2 px-4 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40"
          />
          <motion.button
            type="submit"
            whileTap={{ scale: 0.9 }}
            className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground"
            aria-label="Send"
          >
            <Send className="size-5" />
          </motion.button>
        </form>
      </div>
    </AppShell>
  )
}
