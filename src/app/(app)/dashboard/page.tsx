import { redirect } from 'next/navigation'
import { requireAuth, getSupabase } from '@/lib/supabase/server'
import { calcTrustScore } from '@/lib/types'
import { FormsList } from '@/components/dashboard/FormsList'
import { OverviewCard } from '@/components/dashboard/sidebar/OverviewCard'
import { QuickStartCard } from '@/components/dashboard/sidebar/QuickStartCard'
import CreateFormButton from '@/components/dashboard/buttons/CreateFormButton'
import type { Metadata } from 'next'
import type { TrustConfig, FormTemplate } from '@/lib/types'

export const metadata: Metadata = { title: 'Dashboard – Privora' }

export default async function DashboardPage() {
  const user = await requireAuth().catch(() => redirect('/auth'))
  const supabase = await getSupabase()

  const [{ data: rawForms }, { data: rawResponses }, { data: rawTemplates }] = await Promise.all([
    supabase.from('forms').select('id,title,status,design_config,trust_config,questions,updated_at').eq('owner_id', user.id).order('updated_at', { ascending: false }),
    (supabase as any).from('responses').select('form_id, forms!inner(owner_id)').eq('forms.owner_id', user.id),
    (supabase as any).from('form_templates').select('*').or(`owner_id.eq.${user.id},is_primitive.eq.true`).order('name'),
  ])

  const templates = (rawTemplates ?? []) as FormTemplate[]
  const forms = (rawForms ?? []) as unknown as {
    id: string; title: string; status: 'draft' | 'active' | 'closed'
    design_config: any; trust_config: TrustConfig; questions: any[]; updated_at: string
  }[]
  const responses = (rawResponses ?? []) as { form_id: string }[]
  const countMap = responses.reduce((acc, r: any) => { acc[r.form_id] = (acc[r.form_id] ?? 0) + 1; return acc }, {} as Record<string, number>)

  const totalResponses = responses.length
  const activeForms    = forms.filter(f => f.status === 'active').length
  const avgCompletion  = forms.length ? Math.round((forms.filter(f => (countMap[f.id] ?? 0) > 0).length / forms.length) * 100) : 0
  const avgTrust       = forms.length ? (forms.reduce((s, f) => s + calcTrustScore(f.trust_config), 0) / forms.length).toFixed(1) : '-'

  const stats = [
    { label: 'Total responses', value: String(totalResponses) },
    { label: 'Active forms',    value: String(activeForms) },
    { label: 'Avg. completion', value: `${avgCompletion}%` },
    { label: 'Trust score avg', value: `${avgTrust}/5`, accentClass: 'text-emerald-600' },
  ]

  return (
    <>
      <div className="flex items-center justify-between px-10 pt-12 pb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Forms</h1>
          <p className="text-sm text-slate-400 mt-1.5">
            {forms.length} form{forms.length !== 1 ? 's' : ''} &middot; {totalResponses} response{totalResponses !== 1 ? 's' : ''}
          </p>
        </div>
        <CreateFormButton />
      </div>

      <div className="flex flex-col lg:flex-row gap-8 px-10 pb-12 items-start">
        <div className="flex-1 min-w-0">
          <FormsList forms={forms} countMap={countMap} />
        </div>

        <div className="w-full lg:w-64 shrink-0 space-y-4">
          <OverviewCard stats={stats} />
          <QuickStartCard templates={templates} />
        </div>
      </div>
    </>
  )
}
