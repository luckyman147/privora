import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Inbox, Zap, TrendingUp, ShieldCheck } from 'lucide-react'
import { FiMessageSquare, FiCalendar, FiBriefcase, FiBookOpen, FiUser, FiBarChart2, FiClipboard } from 'react-icons/fi'
import { requireAuth, getSupabase } from '@/lib/supabase/server'
import { calcTrustScore } from '@/lib/types'
import { FormsList } from '@/components/dashboard/FormsList'
import CreateFormButton from '@/components/dashboard/buttons/CreateFormButton'
import type { Metadata } from 'next'
import type { TrustConfig, FormTemplate } from '@/lib/types'
import type { ComponentType } from 'react'

type IconProps = { className?: string }
const ICON_MAP: Record<string, ComponentType<IconProps>> = {
  '📋': FiMessageSquare, '🎫': FiCalendar, '💼': FiBriefcase,
  '📝': FiBookOpen,      '📇': FiUser,     '📊': FiBarChart2,
}
const P: [string, string][] = [
  ['#7c3aed', '#a855f7'], ['#0ea5e9', '#38bdf8'], ['#10b981', '#34d399'],
  ['#f59e0b', '#fbbf24'], ['#ef4444', '#f87171'], ['#6366f1', '#818cf8'],
]
const SC = [
  { Icon: Inbox,       accent: 'text-sky-600',     bg: 'bg-sky-50'     },
  { Icon: Zap,         accent: 'text-violet-600',  bg: 'bg-violet-50'  },
  { Icon: TrendingUp,  accent: 'text-amber-600',   bg: 'bg-amber-50'   },
  { Icon: ShieldCheck, accent: 'text-emerald-600', bg: 'bg-emerald-50' },
]

export const metadata: Metadata = { title: 'Dashboard – Privora' }

export default async function DashboardPage() {
  const user = await requireAuth().catch(() => redirect('/auth'))
  const supabase = await getSupabase()

  const [{ data: _p }, { data: rawForms }, { data: rawResponses }, { data: rawTemplates }] = await Promise.all([
    supabase.from('profiles').select('plan').eq('id', user.id).maybeSingle(),
    supabase.from('forms').select('id,title,status,design_config,trust_config,questions,updated_at').eq('owner_id', user.id).order('updated_at', { ascending: false }),
    supabase.from('responses').select('form_id'),
    (supabase as any).from('form_templates').select('*').or(`owner_id.eq.${user.id},is_primitive.eq.true`).order('name'),
  ])

  const templates = (rawTemplates ?? []) as FormTemplate[]
  const forms = (rawForms ?? []) as unknown as {
    id: string; title: string; status: 'draft' | 'active' | 'closed'
    design_config: any; trust_config: TrustConfig; questions: any[]; updated_at: string
  }[]
  const responses = rawResponses ?? []
  const countMap = responses.reduce((acc, r: any) => { acc[r.form_id] = (acc[r.form_id] ?? 0) + 1; return acc }, {} as Record<string, number>)

  const totalResponses = responses.length
  const activeForms    = forms.filter(f => f.status === 'active').length
  const avgCompletion  = forms.length ? Math.round((forms.filter(f => (countMap[f.id] ?? 0) > 0).length / forms.length) * 100) : 0
  const avgTrust       = forms.length ? (forms.reduce((s, f) => s + calcTrustScore(f.trust_config), 0) / forms.length).toFixed(1) : '—'

  const stats = [
    { label: 'Total responses', value: String(totalResponses), color: 'text-slate-900' },
    { label: 'Active forms',    value: String(activeForms),    color: 'text-slate-900' },
    { label: 'Avg. completion', value: `${avgCompletion}%`,    color: 'text-slate-900' },
    { label: 'Trust score avg', value: `${avgTrust}/5`,        color: 'text-emerald-600' },
  ]

  return (
    <>
      <div className="flex items-center justify-between px-10 pt-10 pb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Forms</h1>
          <p className="text-sm text-slate-400 mt-1">
            {forms.length} form{forms.length !== 1 ? 's' : ''} &middot; {totalResponses} response{totalResponses !== 1 ? 's' : ''}
          </p>
        </div>
        <CreateFormButton />
      </div>

      <div className="flex flex-col lg:flex-row gap-6 px-10 pb-10 items-start">
        <div className="flex-1 min-w-0">
          <FormsList forms={forms} countMap={countMap} />
        </div>

        <div className="w-full lg:w-64 shrink-0 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Overview</p>
            <div className="space-y-3">
              {stats.map((s, i) => {
                const { Icon, accent, bg } = SC[i]
                return (
                  <div key={s.label} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-4 h-4 ${accent}`} />
                    </div>
                    <div>
                      <p className={`text-sm font-bold leading-none ${s.color}`}>{s.value}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{s.label}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {templates.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Quick Start</p>
                <Link href="/templates" className="text-[11px] font-semibold text-violet-600 hover:text-violet-700">View all</Link>
              </div>
              <div className="space-y-0.5">
                {templates.slice(0, 6).map((t, idx) => {
                  const [c1, c2] = P[idx % P.length]
                  const I = ICON_MAP[t.icon] ?? FiClipboard
                  return (
                    <Link key={t.id} href={`/builder?template=${t.id}`}
                      className="flex items-center gap-3 px-2.5 py-2 rounded-xl hover:bg-slate-50 group transition">
                      <div className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>
                        <I className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-800 truncate group-hover:text-violet-700 transition">{t.name}</p>
                        <p className="text-[11px] text-slate-400">{t.questions.length}q &middot; {t.category}</p>
                      </div>
                      <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-violet-400 transition shrink-0" />
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
