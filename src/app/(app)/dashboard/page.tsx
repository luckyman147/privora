import { redirect } from 'next/navigation'
import Link from 'next/link'
import { requireAuth, getSupabase } from '@/lib/supabase/server'
import { calcTrustScore } from '@/lib/types'
import { StatsBar } from '@/components/dashboard/StatsBar'
import { FormsList } from '@/components/dashboard/FormsList'
import CreateFormButton from '@/components/dashboard/buttons/CreateFormButton'
import { getTemplateIcon } from '@/lib/utils'
import type { Metadata } from 'next'
import type { TrustConfig, FormTemplate } from '@/lib/types'

export const metadata: Metadata = { title: 'Dashboard – Privora' }

export default async function DashboardPage() {
  const user = await requireAuth().catch(() => redirect('/auth'))
  const supabase = await getSupabase()

  const [{ data: _profile }, { data: rawForms }, { data: rawResponses }, { data: rawTemplates }] = await Promise.all([
    supabase.from('profiles').select('plan').eq('id', user.id).maybeSingle(),
    supabase.from('forms').select('id,title,status,design_config,trust_config,questions,updated_at').eq('owner_id', user.id).order('updated_at', { ascending: false }),
    supabase.from('responses').select('form_id'),
    (supabase as any).from('form_templates').select('*').or(`owner_id.eq.${user.id},is_primitive.eq.true`).order('name'),
  ])

  const templates = (rawTemplates ?? []) as FormTemplate[]

  const forms     = (rawForms ?? []) as unknown as { id: string; title: string; status: 'draft' | 'active' | 'closed'; design_config: any; trust_config: TrustConfig; questions: any[]; updated_at: string }[]
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
        <CreateFormButton />
      </div>

      {/* Templates */}
      <div className="px-8 pb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Templates</h2>
          <Link href="/templates" className="text-xs font-semibold text-sky-600 hover:text-sky-700">View all</Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin">
          {templates.map((t) => (
            <Link
              key={t.id}
              href={`/builder?template=${t.id}`}
              className="min-w-[240px] shrink-0 snap-start bg-white border border-slate-200 rounded-xl p-4 hover:border-sky-300 hover:shadow-sm transition"
            >
              <div className="flex items-start gap-3">
                <span className="text-lg shrink-0 mt-0.5">{getTemplateIcon(t.icon)}</span>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-slate-900 truncate">{t.name}</p>
                  {t.description && (
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{t.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                    <span>{t.category}</span>
                    <span>&middot;</span>
                    <span>{t.questions.length} questions</span>
                    {t.is_primitive && (
                      <>
                        <span>&middot;</span>
                        <span className="text-sky-500 font-medium">Official</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <StatsBar stats={stats} />

      <div className="px-8 py-6">
        <FormsList forms={forms} countMap={countMap} />
      </div>
    </>
  )
}
