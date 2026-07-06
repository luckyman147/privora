'use client'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, Edit2, BarChart2, FileText } from 'lucide-react'
import CreateFormButton from '@/components/dashboard/buttons/CreateFormButton'
import type { DesignConfig } from '@/lib/types'
import { DEFAULT_DESIGN } from '@/lib/design'

interface FormRow {
  id: string
  title: string
  status: 'draft' | 'active' | 'closed'
  design_config: DesignConfig | null
  questions: { label: string }[]
  updated_at: string
}
interface Props { forms: FormRow[]; countMap: Record<string, number> }

const STATUS_CLS: Record<string, string> = {
  active: 'text-emerald-700 bg-emerald-50 border border-emerald-200',
  closed: 'text-red-600 bg-red-50 border border-red-200',
  draft:  'text-amber-600 bg-amber-50 border border-amber-200',
}
const STATUS_LBL: Record<string, string> = { active: 'Active', closed: 'Closed', draft: 'Draft' }

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function FormCard({ form, count }: { form: FormRow; count: number }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const d = form.design_config ?? DEFAULT_DESIGN
  const primary = d.primary_color ?? '#7C3AED'

  function navTo(href: string) {
    startTransition(() => router.push(href))
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden hover:shadow-lg motion-safe:hover:-translate-y-0.5 transition-all group relative"
      style={{ border: `2px solid ${primary}` }}>
      {pending && (
        <div className="absolute inset-0 z-10 bg-white/70 flex items-center justify-center">
          <span className="w-8 h-8 border-[3px] border-slate-200 border-t-violet-600 rounded-full animate-spin" />
        </div>
      )}
      <button type="button" onClick={() => navTo(`/builder/${form.id}`)} className="block w-full text-left cursor-pointer">
        <div className="bg-slate-50 p-5 h-40">
          {form.questions.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-slate-300 font-medium text-sm">{form.title}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {form.questions.slice(0, 4).map((q, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: i === 0 ? primary : '#cbd5e1' }} />
                  <span className="text-xs font-medium truncate"
                    style={{ color: i === 0 ? primary : '#94a3b8' }}>{q.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </button>
      <div className="px-5 py-4 border-t border-slate-100">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-lg font-bold text-slate-900 truncate">{form.title}</p>
          <span className={`shrink-0 text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-md ${STATUS_CLS[form.status]}`}>
            {STATUS_LBL[form.status]}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm text-slate-400">
            {count} response{count !== 1 ? 's' : ''} &bull; {fmtDate(form.updated_at)}
          </p>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button type="button" onClick={() => navTo(`/results/${form.id}`)}
              className="p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition cursor-pointer">
              <BarChart2 className="w-3.5 h-3.5" />
            </button>
            <button type="button" onClick={() => navTo(`/builder/${form.id}`)}
              className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition cursor-pointer">
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            {form.status === 'active' && (
              <a href={`/form/${form.id}`} target="_blank" rel="noopener noreferrer"
                className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition">
                <Eye className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function FormsList({ forms, countMap }: Props) {
  if (forms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center mb-5">
          <FileText className="w-8 h-8 text-violet-300" />
        </div>
        <h3 className="font-bold text-slate-900 mb-2">No forms yet</h3>
        <p className="text-sm text-slate-500 mb-6 max-w-xs">Create your first form to start collecting trusted responses.</p>
        <CreateFormButton />
      </div>
    )
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {forms.map(form => <FormCard key={form.id} form={form} count={countMap[form.id] ?? 0} />)}
    </div>
  )
}
