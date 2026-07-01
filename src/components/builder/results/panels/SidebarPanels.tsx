import type { Form, Response } from '@/lib/types'
import { calcTrustScore } from '@/lib/types'
import { fmtDate } from '../resultsUtils'

export function RecentResponses({ responses }: { responses: Response[] }) {
  const recent = responses.slice(0, 5)
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-4 py-3 flex items-center justify-between bg-slate-50 border-b border-slate-200">
        <p className="text-xs font-bold text-slate-700">Recent responses</p>
        <span className="flex items-center gap-1.5 text-[11px] font-semibold text-green-600">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />Live
        </span>
      </div>
      <div className="divide-y divide-slate-100">
        {recent.length === 0
          ? <p className="text-xs text-slate-400 px-4 py-3">No responses yet</p>
          : recent.map(r => (
            <div key={r.id} className="px-4 py-2.5 hover:bg-slate-50 transition">
              <p className="text-[11px] font-medium text-slate-600">{fmtDate(r.submitted_at)}</p>
            </div>
          ))}
      </div>
    </div>
  )
}

export function FormSummaryPanel({ form, total, completionRate }: {
  form: Form; total: number; completionRate: number
}) {
  const rq = form.questions.filter(q => q.type !== 'section' && q.type !== 'page_break')
  const rows: [string, string][] = [
    ['Form ID', form.id.slice(0, 8) + '…'],
    ['Created', new Date(form.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })],
    ['Status', form.status],
    ['Total questions', String(rq.length)],
    ['Total responses', String(total)],
    ['Completion rate', `${completionRate}%`],
  ]
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
        <p className="text-xs font-bold text-slate-700">Form summary</p>
      </div>
      {rows.map(([label, value]) => (
        <div key={label} className="px-4 py-2 flex justify-between items-center border-b border-slate-100 last:border-0">
          <span className="text-[11px] text-slate-400">{label}</span>
          <span className="text-[11px] font-semibold text-slate-700 capitalize truncate max-w-[110px] text-right">{value}</span>
        </div>
      ))}
    </div>
  )
}

export function TrustPanel({ form }: { form: Form }) {
  const tc = form.trust_config
  const score = calcTrustScore(tc)
  const features: [string, boolean][] = [
    ['Anonymous responses', tc.identity === 'anonymous'],
    ['IP not stored', tc.ip_storage === 'none'],
    ['Creator only visibility', tc.visibility === 'creator_only'],
    ['One response per person', tc.submission_limit === 'one'],
    [`Data retention ${tc.retention_days}d`, tc.retention_days <= 90],
  ]
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
        <p className="text-xs font-bold text-slate-700">Trust & privacy</p>
        <span className="text-xs font-bold text-green-600">{score}/5</span>
      </div>
      <div className="px-4 py-3 space-y-2">
        {features.map(([label, on]) => (
          <div key={label} className="flex items-center gap-2">
            <span className={`text-sm font-bold leading-none ${on ? 'text-green-500' : 'text-slate-200'}`}>
              {on ? '✓' : '○'}
            </span>
            <span className="text-[11px] text-slate-600 flex-1">{label}</span>
            <span className="text-[10px] font-semibold" style={{ color: on ? '#22c55e' : '#94a3b8' }}>
              {on ? 'Enabled' : 'Off'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
