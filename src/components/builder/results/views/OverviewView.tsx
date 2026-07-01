import type { Form, Question, Response } from '@/lib/types'
import { StatCards } from '../panels/StatCards'
import { TrendChart } from '../charts/TimelineChart'
import { RecentResponses, FormSummaryPanel, TrustPanel } from '../panels/SidebarPanels'
import { qc, answeredCount } from '../resultsUtils'

interface Props {
  form: Form
  responses: Response[]
  isLoading: boolean
  completionRate: number
  realQs: Question[]
}

export function OverviewView({ form, responses, isLoading, completionRate, realQs }: Props) {
  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-6 space-y-5">

          <div>
            <h2 className="text-xl font-bold text-slate-900">Overview</h2>
            <p className="text-sm text-slate-400 mt-0.5">
              Real-time summary of your form performance and responses.
            </p>
          </div>

          <StatCards
            loading={isLoading} total={responses.length}
            completionRate={completionRate} responses={responses}
            trustConfig={form.trust_config}
          />

          {!isLoading && responses.length > 0 && <TrendChart responses={responses} />}

          {!isLoading && realQs.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Question summary</h3>
                <span className="text-xs text-slate-400">{realQs.length} questions</span>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-5 py-2.5 text-slate-500 font-semibold">Question</th>
                    <th className="text-left px-4 py-2.5 text-slate-500 font-semibold">Type</th>
                    <th className="text-right px-5 py-2.5 text-slate-500 font-semibold">Responses</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {realQs.map((q, i) => {
                    const c = qc(q.type)
                    const n = answeredCount(responses, q.id)
                    return (
                      <tr key={q.id} className="hover:bg-slate-50/60 transition">
                        <td className="px-5 py-3 font-medium text-slate-700">
                          <span className="text-slate-400 mr-2 tabular-nums">{i + 1}.</span>
                          {q.label}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold"
                            style={{ background: c.light, color: c.accent }}>
                            {c.label}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right font-bold" style={{ color: c.accent }}>{n}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {!isLoading && responses.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-violet-50 border-2 border-violet-100 flex items-center justify-center text-3xl">
                📊
              </div>
              <div>
                <p className="text-base font-bold text-slate-800">No responses yet</p>
                <p className="text-sm text-slate-400 mt-1">Share your form to start collecting data.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <aside className="w-72 shrink-0 border-l border-slate-200 bg-white overflow-y-auto p-4 space-y-4">
        <RecentResponses responses={responses} />
        <FormSummaryPanel form={form} total={responses.length} completionRate={completionRate} />
        <TrustPanel form={form} />
      </aside>
    </div>
  )
}
