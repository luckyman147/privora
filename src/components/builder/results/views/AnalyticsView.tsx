import type { Question, Response } from '@/lib/types'
import { QuestionAnalyticsCard } from '../charts/QuestionAnalyticsCard'

export function AnalyticsView({ questions, responses }: {
  questions: Question[]
  responses: Response[]
}) {
  const realQs = questions.filter(q => q.type !== 'section' && q.type !== 'page_break')

  return (
    <div className="p-6 space-y-5 overflow-y-auto h-full">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Analytics</h2>
        <p className="text-sm text-slate-400 mt-0.5">Per-question breakdown of all responses.</p>
      </div>

      {responses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
          <p className="text-sm font-semibold text-slate-700">No data yet</p>
          <p className="text-xs text-slate-400">Responses will appear here once your form is submitted.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {realQs.map((q, i) => (
            <QuestionAnalyticsCard key={q.id} question={q} responses={responses} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
