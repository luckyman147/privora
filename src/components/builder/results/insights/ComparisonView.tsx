import type { Form, Response } from '@/lib/types'
import { qc, answeredCount, avgRating } from '../resultsUtils'

function splitByWeek(responses: Response[]) {
  const now = new Date()
  const weekAgo = new Date(now); weekAgo.setDate(now.getDate() - 7)
  const twoWeeksAgo = new Date(now); twoWeeksAgo.setDate(now.getDate() - 14)
  return {
    thisWeek: responses.filter(r => new Date(r.submitted_at) >= weekAgo),
    lastWeek: responses.filter(r => {
      const d = new Date(r.submitted_at)
      return d >= twoWeeksAgo && d < weekAgo
    }),
  }
}

function delta(a: number, b: number) {
  if (b === 0) return null
  const d = Math.round((a - b) / b * 100)
  return { d, up: d >= 0 }
}

function Badge({ d, up }: { d: number; up: boolean }) {
  return (
    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${up ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
      {up ? '+' : ''}{d}%
    </span>
  )
}

export function ComparisonView({ form, responses }: { form: Form; responses: Response[] }) {
  const realQs = form.questions.filter(q => q.type !== 'section' && q.type !== 'page_break')
  const { thisWeek, lastWeek } = splitByWeek(responses)
  const pct = (n: number, total: number) => total ? `${Math.round(n / total * 100)}%` : '—'

  if (!responses.length) return (
    <div className="flex items-center justify-center h-full">
      <p className="text-slate-400 text-sm">No responses yet to compare.</p>
    </div>
  )

  return (
    <div className="p-6 space-y-5 overflow-y-auto h-full">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Comparison</h2>
        <p className="text-sm text-slate-400 mt-0.5">This week vs last week</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-100">
          <div className="px-5 py-3 text-xs font-bold text-slate-500">Metric</div>
          <div className="px-5 py-3 text-xs font-bold text-violet-600 border-l border-slate-200">
            This week ({thisWeek.length})
          </div>
          <div className="px-5 py-3 text-xs font-bold text-slate-400 border-l border-slate-200">
            Last week ({lastWeek.length})
          </div>
        </div>

        {/* Total row */}
        {(() => {
          const d = delta(thisWeek.length, lastWeek.length)
          return (
            <div className="grid grid-cols-3 border-b border-slate-50 hover:bg-slate-50/50 transition">
              <div className="px-5 py-3.5 text-sm font-semibold text-slate-700">Responses</div>
              <div className="px-5 py-3.5 border-l border-slate-100 flex items-center gap-2">
                <span className="text-sm font-bold text-violet-700">{thisWeek.length}</span>
                {d && <Badge d={d.d} up={d.up} />}
              </div>
              <div className="px-5 py-3.5 text-sm text-slate-400 border-l border-slate-100">{lastWeek.length}</div>
            </div>
          )
        })()}

        {realQs.map((q, i) => {
          const c = qc(q.type)
          const isRating = q.type === 'rating'
          const tw = isRating ? avgRating(thisWeek, q.id) : answeredCount(thisWeek, q.id)
          const lw = isRating ? avgRating(lastWeek, q.id) : answeredCount(lastWeek, q.id)
          const twNum = isRating ? (tw ? Number(tw) : 0) : (tw as number)
          const lwNum = isRating ? (lw ? Number(lw) : 0) : (lw as number)
          const d = delta(twNum, lwNum)

          return (
            <div key={q.id} className="grid grid-cols-3 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition">
              <div className="px-5 py-3 flex items-center gap-2 min-w-0">
                <span className="w-4 h-4 rounded flex items-center justify-center text-white text-[9px] font-black shrink-0"
                  style={{ background: c.accent }}>{i + 1}</span>
                <span className="text-xs font-medium text-slate-700 truncate">{q.label}</span>
              </div>
              <div className="px-5 py-3 border-l border-slate-100 flex items-center gap-2">
                <span className="text-sm font-bold text-violet-700">
                  {isRating ? (tw ?? '—') : pct(tw as number, thisWeek.length)}
                </span>
                {d && !isRating && <Badge d={d.d} up={d.up} />}
              </div>
              <div className="px-5 py-3 text-sm text-slate-400 border-l border-slate-100">
                {isRating ? (lw ?? '—') : pct(lw as number, lastWeek.length)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
