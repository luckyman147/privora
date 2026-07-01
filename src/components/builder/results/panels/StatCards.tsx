import type { ReactNode } from 'react'
import type { Response, TrustConfig } from '@/lib/types'
import { calcTrustScore } from '@/lib/types'
import { SparkLine } from '../charts/TimelineChart'

interface Props {
  loading: boolean
  total: number
  completionRate: number
  responses: Response[]
  trustConfig: TrustConfig
}

const TRUST_LABEL = ['—', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'] as const
const TRUST_COLOR = ['#94a3b8', '#ef4444', '#f59e0b', '#22c55e', '#22c55e', '#22c55e'] as const

function Card({ label, value, accent, sub, children }: {
  label: string; value: string; accent: string; sub: string; children: ReactNode
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col gap-1 min-h-[120px]">
      <p className="text-[11px] font-semibold text-slate-400">{label}</p>
      <p className="text-3xl font-black tracking-tight" style={{ color: accent }}>{value}</p>
      <p className="text-[11px] text-slate-400">{sub}</p>
      <div className="mt-auto pt-1">{children}</div>
    </div>
  )
}

export function StatCards({ loading, total, completionRate, responses, trustConfig }: Props) {
  const todayStr = new Date().toISOString().slice(0, 10)
  const todayCount = responses.filter(r => r.submitted_at.slice(0, 10) === todayStr).length
  const score = calcTrustScore(trustConfig)

  if (loading) return (
    <div className="grid grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-200 h-32 animate-pulse" />
      ))}
    </div>
  )

  return (
    <div className="grid grid-cols-4 gap-4">
      <Card label="Total responses" value={String(total)} accent="#7c3aed" sub={`${todayCount} new today`}>
        <SparkLine responses={responses} color="#7c3aed" />
      </Card>
      <Card label="Completion rate" value={`${completionRate}%`} accent="#3b82f6" sub={`of ${total} submissions`}>
        <SparkLine responses={responses} color="#3b82f6" />
      </Card>
      <Card label="Trust Score" value={`${score}/5`} accent={TRUST_COLOR[score]} sub={TRUST_LABEL[score]}>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: `${(score / 5) * 100}%`, background: TRUST_COLOR[score] }} />
        </div>
      </Card>
      <Card label="Today" value={String(todayCount)} accent="#f59e0b" sub="new responses">
        <SparkLine responses={responses} color="#f59e0b" />
      </Card>
    </div>
  )
}
