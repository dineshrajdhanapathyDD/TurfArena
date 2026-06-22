'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ChevronDown, Loader2 } from 'lucide-react'

interface AIInsightCardProps {
  title: string
  action: string
  body: Record<string, unknown>
  className?: string
}

export function AIInsightCard({ title, action, body, className = '' }: AIInsightCardProps) {
  const [insight, setInsight] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(false)

  async function fetchInsight() {
    if (insight) {
      setExpanded(!expanded)
      return
    }
    setLoading(true)
    setExpanded(true)
    try {
      const res = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...body }),
      })
      const data = await res.json()
      setInsight(data.data?.response || 'Unable to generate insight.')
    } catch {
      setInsight('AI service unavailable. Try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`glass rounded-[18px] overflow-hidden ${className}`}>
      <button
        onClick={fetchInsight}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/5 transition-colors"
      >
        <span className="flex size-9 items-center justify-center rounded-[11px] bg-secondary/15 shrink-0">
          <Sparkles className="size-4 text-secondary" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="text-[11px] text-muted-foreground">Powered by Amazon Bedrock</p>
        </div>
        {loading ? (
          <Loader2 className="size-4 text-muted-foreground animate-spin" />
        ) : (
          <ChevronDown className={`size-4 text-muted-foreground transition-transform ${expanded ? 'rotate-180' : ''}`} />
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0">
              {loading ? (
                <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
                  <Loader2 className="size-3 animate-spin" />
                  Generating AI insight...
                </div>
              ) : (
                <div className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap bg-surface-2/50 rounded-[12px] p-3">
                  {insight}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
