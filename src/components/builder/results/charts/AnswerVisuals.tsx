import { useState } from 'react'
import type { Question, Response } from '@/lib/types'
import { countOptions, avgRating } from '../resultsUtils'

export function ChoiceChart({ question, responses, accent }: {
  question: Question; responses: Response[]; accent: string
}) {
  const opts   = question.options ?? []
  const counts = countOptions(responses, question.id, opts)
  const total  = Object.values(counts).reduce((a, b) => a + b, 0)
  const peak   = Math.max(...Object.values(counts), 1)
  const maxCount = Math.max(...Object.values(counts), 0)
  const winner = total > 1 && new Set(Object.values(counts)).size > 1
    ? opts.find(o => (counts[o] ?? 0) === maxCount) ?? null : null

  return (
    <div className="space-y-2.5">
      {opts.map(opt => {
        const n   = counts[opt] ?? 0
        const pct = total ? Math.round((n / total) * 100) : 0
        return (
          <div key={opt}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[13px] text-slate-700 truncate max-w-xs">{opt}</span>
              <span className="text-xs font-bold text-slate-500 ml-2 shrink-0">{n} · {pct}%</span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${peak ? (n / peak) * 100 : 0}%`, background: accent, opacity: winner && opt !== winner ? 0.45 : 1 }} />
            </div>
          </div>
        )
      })}
      <p className="text-xs text-slate-400 pt-1">{total} response{total !== 1 ? 's' : ''}</p>
    </div>
  )
}

export function RatingDisplay({ question, responses, accent }: {
  question: Question; responses: Response[]; accent: string
}) {
  const max  = question.max_rating ?? 5
  const avg  = avgRating(responses, question.id)
  const nums = responses.map(r => Number(r.answers[question.id])).filter(n => !isNaN(n) && n >= 1)
  const dist: Record<number, number> = {}
  for (let i = 1; i <= max; i++) dist[i] = 0
  nums.forEach(n => { if (n >= 1 && n <= max) dist[n]++ })
  const peak = Math.max(...Object.values(dist), 1)

  return (
    <div className="space-y-4">
      {avg !== null ? (
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-5xl font-black" style={{ color: accent }}>{avg}</p>
            <p className="text-xs text-slate-400 mt-1">avg / {max}</p>
          </div>
          <div className="flex-1">
            <div className="flex gap-0.5 mb-1.5">
              {Array.from({ length: Math.min(max, 10) }).map((_, i) => (
                <svg key={i} viewBox="0 0 20 20" fill="currentColor"
                  className="w-5 h-5 flex-1 min-w-0"
                  style={{ color: i < Math.round(Number(avg)) ? accent : '#e2e8f0' }}>
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-xs text-slate-400">{nums.length} rating{nums.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-400">No ratings yet.</p>
      )}
      <div className="space-y-1.5">
        {Object.entries(dist).sort((a, b) => Number(b[0]) - Number(a[0])).map(([k, v]) => (
          <div key={k} className="flex items-center gap-2">
            <span className="text-xs text-slate-500 w-5 text-right font-mono">{k}</span>
            <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${(v / peak) * 100}%`, background: accent }} />
            </div>
            <span className="text-xs text-slate-400 w-5 text-right">{v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function TextAnswers({ question, responses, accent }: {
  question: Question; responses: Response[]; accent: string
}) {
  const [expanded, setExpanded] = useState(false)
  const answers = responses
    .map(r => String(r.answers[question.id] ?? ''))
    .filter(Boolean)
  const shown = expanded ? answers : answers.slice(0, 4)

  if (!answers.length) return <p className="text-sm text-slate-400">No responses yet.</p>

  return (
    <div className="space-y-2">
      {shown.map((a, i) => (
        <div key={i} className="px-3.5 py-2.5 rounded-xl text-[13px] text-slate-700 leading-relaxed border-l-3"
          style={{ background: '#f8fafc', borderLeft: `3px solid ${accent}` }}>
          {a}
        </div>
      ))}
      {answers.length > 4 && (
        <button onClick={() => setExpanded(v => !v)}
          className="text-xs font-semibold mt-1 transition"
          style={{ color: accent }}>
          {expanded ? '▲ Show less' : `▼ Show all ${answers.length} responses`}
        </button>
      )}
    </div>
  )
}

export function DateAnswers({ question, responses, accent }: {
  question: Question; responses: Response[]; accent: string
}) {
  const answers = responses
    .map(r => String(r.answers[question.id] ?? ''))
    .filter(Boolean)
  const freq: Record<string, number> = {}
  answers.forEach(d => { freq[d] = (freq[d] ?? 0) + 1 })
  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 5)
  const peak = Math.max(...sorted.map(([, n]) => n), 1)

  if (!answers.length) return <p className="text-sm text-slate-400">No date responses yet.</p>

  return (
    <div className="space-y-2">
      {sorted.map(([date, n]) => (
        <div key={date} className="flex items-center gap-3">
          <span className="text-xs text-slate-600 w-24 shrink-0">{date}</span>
          <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${(n / peak) * 100}%`, background: accent }} />
          </div>
          <span className="text-xs text-slate-500 w-5 text-right">{n}</span>
        </div>
      ))}
      <p className="text-xs text-slate-400 pt-1">{answers.length} date{answers.length !== 1 ? 's' : ''} collected</p>
    </div>
  )
}
