import type { Form, Response } from '@/lib/types'
import { qc, answeredCount, avgRating, countOptions } from '../resultsUtils'
import { calcTrustScore } from '@/lib/types'

export function ReportsView({ form, responses, completionRate }: {
  form: Form; responses: Response[]; completionRate: number
}) {
  const realQs = form.questions.filter(q => q.type !== 'section' && q.type !== 'page_break')
  const score = calcTrustScore(form.trust_config)
  const total = responses.length

  const STATS = [
    { label: 'Total responses', value: String(total), accent: '#7c3aed' },
    { label: 'Completion rate', value: `${completionRate}%`, accent: '#3b82f6' },
    { label: 'Trust score', value: `${score}/5`, accent: '#22c55e' },
    { label: 'Questions', value: String(realQs.length), accent: '#f59e0b' },
  ]

  return (
    <div className="p-6 space-y-5 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Report</h2>
          <p className="text-sm text-slate-400 mt-0.5">Summary of &ldquo;{form.title}&rdquo;</p>
        </div>
        <button onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v5a2 2 0 002 2h1v2a1 1 0 001 1h8a1 1 0 001-1v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a1 1 0 00-1-1H6a1 1 0 00-1 1zm2 0h6v3H7V4zm-1 9a1 1 0 100-2 1 1 0 000 2zm1 2v-1h6v1H7z" clipRule="evenodd" />
          </svg>
          Print
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {STATS.map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
            <p className="text-2xl font-black" style={{ color: s.accent }}>{s.value}</p>
            <p className="text-xs text-slate-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {!total ? (
        <div className="flex items-center justify-center py-16">
          <p className="text-slate-400 text-sm">No responses yet. Share your form to collect data.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Question breakdown</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {realQs.map((q, i) => {
              const c = qc(q.type)
              const n = answeredCount(responses, q.id)
              const pct = Math.round(n / total * 100)
              const isChoice = ['multiple_choice', 'checkboxes', 'dropdown'].includes(q.type)
              const isRating = q.type === 'rating'
              const avg = isRating ? avgRating(responses, q.id) : null
              const topChoice = isChoice && q.options?.length
                ? Object.entries(countOptions(responses, q.id, q.options!)).sort((a, b) => b[1] - a[1])[0]
                : null

              return (
                <div key={q.id} className="px-5 py-4">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-5 h-5 rounded flex items-center justify-center text-white text-[10px] font-black shrink-0"
                        style={{ background: c.accent }}>{i + 1}</span>
                      <p className="text-sm font-semibold text-slate-800 truncate">{q.label}</p>
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 hidden sm:inline"
                        style={{ background: c.light, color: c.accent }}>{c.label}</span>
                    </div>
                    <span className="text-sm font-bold shrink-0" style={{ color: c.accent }}>{n} ({pct}%)</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-1.5">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: c.accent }} />
                  </div>
                  {avg && <p className="text-xs text-slate-500">Avg rating: <strong>{avg}</strong></p>}
                  {topChoice && topChoice[1] > 0 && (
                    <p className="text-xs text-slate-500">Top answer: <strong>{topChoice[0]}</strong> ({topChoice[1]})</p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
