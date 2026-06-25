import { redirect } from 'next/navigation'
import { requireAuth, getSupabase } from '@/lib/supabase'
import { calcTrustScore } from '@/lib/types'
import { createForm } from './actions'
import { StatsBar } from '@/components/dashboard/StatsBar'
import { FormsList } from '@/components/dashboard/FormsList'
import type { Metadata } from 'next'
import type { TrustConfig } from '@/lib/types'

export const metadata: Metadata = { title: 'Dashboard – Privora' }
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const user = await requireAuth().catch(() => redirect('/auth'))
  const supabase = await getSupabase()

  const [{ data: _profile }, { data: rawForms }, { data: rawResponses }] = await Promise.all([
    supabase.from('profiles').select('plan').eq('id', user.id).maybeSingle(),
    supabase.from('forms').select('id,title,mode,status,trust_config,updated_at').eq('owner_id', user.id).order('updated_at', { ascending: false }),
    supabase.from('responses').select('form_id'),
  ])

  const forms     = (rawForms ?? []) as unknown as { id: string; title: string; mode: 'survey' | 'election'; status: 'draft' | 'active' | 'closed'; trust_config: TrustConfig; updated_at: string }[]
  const responses = rawResponses ?? []

  const countMap = responses.reduce((acc, r: any) => {
    acc[r.form_id] = (acc[r.form_id] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  const totalResponses = responses.length
  const activeForms    = forms.filter(f => f.status === 'active').length
  const avgCompletion  = forms.length ? Math.round((forms.filter(f => (countMap[f.id] ?? 0) > 0).length / forms.length) * 100) : 0
  const avgTrust       = forms.length ? (forms.reduce((s, f) => s + calcTrustScore(f.trust_config), 0) / forms.length).toFixed(1) : '—'

  const stats = [
    { label: 'TOTAL RESPONSES', value: String(totalResponses), color: 'text-slate-900' },
    { label: 'ACTIVE FORMS',    value: String(activeForms),    color: 'text-slate-900' },
    { label: 'AVG. COMPLETION', value: `${avgCompletion}%`,    color: 'text-slate-900' },
    { label: 'TRUST SCORE AVG', value: `${avgTrust}/5`,        color: 'text-emerald-600' },
  ]

  return (
    <>
      <div className="flex items-start justify-between px-8 pt-8 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Forms</h1>
          <p className="text-sm text-slate-400 mt-1">
            {forms.length} form{forms.length !== 1 ? 's' : ''} · {totalResponses} total response{totalResponses !== 1 ? 's' : ''}
          </p>
        </div>
        <form action={createForm.bind(null, 'survey')}>
          <button type="submit" className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition">
            + Create form
          </button>
        </form>
      </div>

      <StatsBar stats={stats} />

      <div className="px-8 py-6">
        <FormsList forms={forms} countMap={countMap} />
      </div>
    </>
  )
}
