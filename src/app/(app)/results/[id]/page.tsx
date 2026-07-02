import { requireAuth, getSupabase } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { Response } from '@/lib/types'
import { ResultsSidebar } from './ResultsSidebar'

function formatAnswer(q: any, answers: Record<string, any>): string {
  if (q.type === 'matrix') {
    const rows: string[] = q.rows?.length ? q.rows : ['Row 1', 'Row 2']
    const matCols: { name: string; type: string }[] = q.matrix_columns?.length
      ? q.matrix_columns
      : (q.columns ?? ['Column 1']).map((c: string) => ({ name: c, type: 'short_answer' }))
    const parts = rows.map((row: string, ri: number) => {
      const cells = matCols.map((col: { name: string; type: string }, ci: number) => {
        if (col.type === 'choice') {
          const chosen = answers[`${q.id}_${ri}`]
          return chosen != null ? (matCols[Number(chosen)]?.name ?? String(chosen)) : null
        }
        const val = answers[`${q.id}_${ri}_${ci}`]
        if (val == null || val === '' || val === false) return null
        return col.type === 'checkbox' ? col.name : `${col.name}: ${val}`
      }).filter(Boolean)
      return cells.length ? `${row} → ${cells.join(', ')}` : null
    }).filter(Boolean)
    return parts.length ? (parts as string[]).join(' | ') : '—'
  }
  if (Array.isArray(answers[q.id])) return (answers[q.id] as string[]).join(', ') || '—'
  return String(answers[q.id] ?? '—')
}

interface FormRow {
  id: string; title: string; owner_id: string; status: string
  questions: any[]; trust_config: any; description?: string
  created_at: string; updated_at: string; closes_at?: string
}

export const metadata: Metadata = { title: 'Results' }

export default async function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await requireAuth().catch(() => redirect('/auth'))
  const supabase = await getSupabase()

  const { data: rawForm } = await (supabase as any)
    .from('forms').select('*').eq('id', id).eq('owner_id', user.id).single()
  const form = rawForm as unknown as FormRow | null
  if (!form) return redirect('/dashboard')

  const { data: rawResponses } = await (supabase as any)
    .from('responses').select('*').eq('form_id', id)
    .order('submitted_at', { ascending: false })
  const responses = (rawResponses ?? []) as Response[]

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="mb-6">
        <Link href="/results" className="text-sm text-slate-400 hover:text-slate-600 mb-2 block">
          ← All Results
        </Link>
        <h1 className="text-2xl font-extrabold text-slate-900">{form.title}</h1>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-sm text-slate-400">{responses.length} responses</span>
          <Badge variant={form.status} />
        </div>
      </div>

      <div className="flex gap-6 items-start">
        <div className="flex-1 min-w-0">
          {!responses.length ? (
            <div className="text-center py-24 text-slate-400">
              <p className="text-lg font-semibold mb-2">No responses yet</p>
              <p className="text-sm">Share your form to start collecting.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {responses.map((r: Response, idx: number) => (
                <div key={r.id} className="bg-white border border-slate-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      Response #{responses.length - idx}
                    </span>
                    <span className="text-xs text-slate-400">{formatDate(r.submitted_at)}</span>
                  </div>
                  <div className="space-y-4">
                    {(form.questions as any[]).map((q: any) => (
                      <div key={q.id}>
                        <p className="text-xs font-semibold text-slate-400 mb-1">{q.label}</p>
                        <p className="text-sm text-slate-900 break-words">
                          {formatAnswer(q, r.answers)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="w-60 shrink-0">
          <ResultsSidebar form={form} responseCount={responses.length} />
        </div>
      </div>
    </div>
  )
}
