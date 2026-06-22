'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Send, TrendingUp, Target, Brain, Zap, Trophy, Users } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { BackHeader } from '@/components/back-header'

type Msg = { role: 'user' | 'ai'; text: string }

const suggestions = [
  'Give me coaching tips',
  'Predict my next match',
  'Generate my performance report',
  'Suggest a team strategy',
  'Best formation for 5v5?',
]

export default function AIPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'ai', text: 'Hey! I\'m your AI Coach powered by Amazon Bedrock. I can analyze your stats, predict match outcomes, give training tips, and suggest strategies. What would you like to know?' },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)

  async function send(text: string) {
    if (!text.trim()) return
    setMessages((m) => [...m, { role: 'user', text }])
    setInput('')
    setTyping(true)

    try {
      // Determine which AI action to call based on user message
      let action = 'coach'
      let body: Record<string, unknown> = { action: 'coach', playerId: 'p1', playerName: 'Arjun Mehta' }

      const lowerText = text.toLowerCase()
      if (lowerText.includes('predict') || lowerText.includes('prediction') || lowerText.includes('next match')) {
        action = 'predict'
        body = {
          action: 'predict',
          tournamentData: {
            tournamentName: 'City Champions League',
            format: '7v7 Knockout',
            teams: ['Thunder FC', 'Strikers United', 'Phoenix XI', 'Royal Kickers'],
            sport: 'football',
          },
        }
      } else if (lowerText.includes('report') || lowerText.includes('performance') || lowerText.includes('summary')) {
        action = 'report'
        body = { action: 'report', playerId: 'p1', playerName: 'Arjun Mehta' }
      } else if (lowerText.includes('strategy') || lowerText.includes('formation') || lowerText.includes('tactic')) {
        action = 'strategy'
        body = {
          action: 'strategy',
          teamData: {
            teamName: 'Thunder FC',
            sport: 'football',
            formation: '4-3-3',
            strengths: ['fast counter-attacks', 'strong finishing', 'team chemistry'],
            opponentName: 'Strikers United',
          },
        }
      } else if (lowerText.includes('commentary') || lowerText.includes('live')) {
        action = 'commentary'
        body = {
          action: 'commentary',
          matchData: {
            homeTeam: 'Thunder FC',
            awayTeam: 'Strikers United',
            homeScore: 2,
            awayScore: 1,
            minute: 78,
            lastEvent: 'Goal by A. Mehta',
            sport: 'football',
          },
        }
      }

      const res = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (data.success && data.data?.response) {
        setMessages((m) => [...m, { role: 'ai', text: data.data.response }])
      } else {
        setMessages((m) => [...m, { role: 'ai', text: data.data?.response || 'Sorry, I couldn\'t process that. Try asking about your performance, predictions, or training tips.' }])
      }
    } catch (error) {
      setMessages((m) => [...m, { role: 'ai', text: 'Connection error. Please try again.' }])
    } finally {
      setTyping(false)
    }
  }

  return (
    <AppShell>
      <BackHeader title="AI Coach" />

      {/* AI Feature Cards */}
      <section className="px-5 pt-2">
        <div className="glass shadow-soft relative overflow-hidden rounded-[22px] p-5">
          <div className="absolute -right-6 -top-6 size-28 rounded-full bg-secondary/20 blur-2xl" />
          <div className="flex items-center gap-2 mb-3">
            <Brain className="size-5 text-secondary" />
            <p className="font-semibold">Powered by Amazon Bedrock</p>
            <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">Nova Micro</span>
          </div>
          <p className="text-xs text-muted-foreground">Real AI-generated insights using your actual match data from DynamoDB.</p>
        </div>
      </section>

      {/* AI Capability Cards */}
      <section className="px-5 pt-4">
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: TrendingUp, label: 'Performance', desc: 'Stats analysis', color: 'text-success bg-success/15' },
            { icon: Target, label: 'Predictions', desc: 'Win probability', color: 'text-primary bg-primary/15' },
            { icon: Users, label: 'Strategy', desc: 'Team tactics', color: 'text-secondary bg-secondary/15' },
            { icon: Trophy, label: 'Coach', desc: 'Training tips', color: 'text-warning bg-warning/15' },
          ].map((s) => {
            const Icon = s.icon
            return (
              <div key={s.label} className="glass flex items-center gap-2.5 rounded-[16px] p-3">
                <span className={`flex size-9 items-center justify-center rounded-[11px] ${s.color}`}>
                  <Icon className="size-4" />
                </span>
                <div>
                  <p className="text-xs font-semibold">{s.label}</p>
                  <p className="text-[10px] text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* AI Chat */}
      <section className="px-5 pt-5">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="size-5 text-secondary" />
          <h3 className="font-semibold">Chat with AI Coach</h3>
        </div>
        <div className="space-y-3 max-h-[40vh] overflow-y-auto">
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-[18px] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
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
              className="glass rounded-full px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
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
            className="h-12 flex-1 rounded-full bg-surface-2 px-4 text-sm outline-none placeholder:text-muted-foreground text-foreground focus:ring-2 focus:ring-primary/40"
          />
          <motion.button
            type="submit"
            whileTap={{ scale: 0.9 }}
            disabled={typing}
            className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"
            aria-label="Send"
          >
            <Send className="size-5" />
          </motion.button>
        </form>
      </div>
    </AppShell>
  )
}
