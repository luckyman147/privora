import { requireAuth, getSupabase } from '@/lib/supabase'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { Response } from '@/lib/types'

interface FormRow {
  id: string; title: string; owner_id: string; mode: string; status: string
  questions: any[]; trust_config: any; description?: string
  created_at: string; updated_at: string; closes_at?: string
}

export const metadata: Metadata = { title: 'Results' }
export const dynamic = 'force-dynamic'

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await requireAuth().catch(() => redirect('/auth'))
  const supabase = await getSupabase()

  const { data: rawForm } = await (supabase as any)
    .from('forms').select('*')
    .eq('id', id).eq('owner_id', user.id).single()
  const form = rawForm as unknown as FormRow | null

  if (!form) return redirect('/dashboard')

  const { data: rawResponses } = await (supabase as any)
    .from('responses').select('*')
    .eq('form_id', id)
    .order('submitted_at', { ascending: false })
  const responses = (rawResponses ?? []) as Response[]

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/results" className="text-sm text-slate-400 hover:text-slate-600 mb-2 block">← All Results</Link>
            <h1 className="text-2xl font-extrabold text-slate-900">{form.title}</h1>
            <div className="flex items-center gap-3 mt-2">
              <Badge variant={form.mode} />
              <span className="text-sm text-slate-400">{responses?.length ?? 0} responses</span>
              <Badge variant={form.status} />
            </div>
          </div>
          <a href={`/results/${form.id}/export`}
            className="px-4 py-2 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">
            Export CSV
          </a>
        </div>

        {!responses?.length ? (
          <div className="text-center py-24 text-slate-400">
            <p className="text-lg font-semibold mb-2">No responses yet</p>
            <p className="text-sm">Share your form to start collecting.</p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">Submitted at</th>
                    {(form.questions as any[]).map((q: any) => (
                      <th key={q.id} className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3 min-w-[120px]">
                        {q.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {responses.map((r: Response, i: number) => (
                    <tr key={r.id} className={i % 2 ? 'bg-slate-50' : 'bg-white'}>
                      <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{formatDate(r.submitted_at)}</td>
                      {(form.questions as any[]).map((q: any) => (
                        <td key={q.id} className="px-4 py-3 text-slate-900 max-w-[200px] truncate">
                          {Array.isArray(r.answers[q.id])
                            ? (r.answers[q.id] as string[]).join(', ')
                            : String(r.answers[q.id] ?? '—')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
