import { requireAuth, getSupabase } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Results' }

interface FormRow {
  id: string; title: string; status: string
  updated_at: string
}

export default async function ResultsPage() {
  const user = await requireAuth().catch(() => redirect('/auth'))
  const supabase = await getSupabase()

  const [{ data: rawForms }, { data: rawCounts }] = await Promise.all([
    (supabase as any)
      .from('forms')
      .select('id, title, status, updated_at')
      .eq('owner_id', user.id)
      .order('updated_at', { ascending: false }),
    (supabase as any)
      .from('responses')
      .select('form_id'),
  ])

  const forms = (rawForms ?? []) as FormRow[]

  const counts: Record<string, number> = {}
  for (const r of (rawCounts ?? []) as { form_id: string }[]) {
    counts[r.form_id] = (counts[r.form_id] ?? 0) + 1
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Results</h1>
            <p className="text-sm text-slate-500 mt-1">Response data for all your forms</p>
          </div>
        </div>

        {!forms.length ? (
          <div className="text-center py-24 text-slate-400">
            <p className="text-lg font-semibold mb-2">No forms yet</p>
            <p className="text-sm">Create a form to start collecting responses.</p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">Form</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">Responses</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">Last updated</th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {forms.map((form, i) => (
                  <tr key={form.id} className={i % 2 ? 'bg-slate-50' : 'bg-white'}>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{form.title}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{counts[form.id] ?? 0}</td>
                    <td className="px-4 py-3"><Badge variant={form.status} /></td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{formatDate(form.updated_at)}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/results/${form.id}`}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-sky-600 hover:text-sky-700"
                      >
                        View results
                        <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
  )
}
