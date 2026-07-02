import { Eye, Edit2, BarChart2, FileText } from 'lucide-react'
import Link from 'next/link'
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
  const d = form.design_config ?? DEFAULT_DESIGN
  const primary = d.primary_color ?? '#7C3AED'
  return (
    <div className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all group"
      style={{ border: `2px solid ${primary}` }}>
      <Link href={`/builder/${form.id}`} className="block">
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
      </Link>
      <div className="px-5 py-4 border-t border-slate-100">
        <p className="text-base font-bold text-slate-900 truncate mb-0.5">{form.title}</p>
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm text-slate-400">
            {count} response{count !== 1 ? 's' : ''} &bull; {fmtDate(form.updated_at)}
          </p>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Link href={`/results/${form.id}`}
              className="p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition">
              <BarChart2 className="w-3.5 h-3.5" />
            </Link>
            <Link href={`/builder/${form.id}`}
              className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition">
              <Edit2 className="w-3.5 h-3.5" />
            </Link>
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
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-5">
          <FileText className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="font-bold text-slate-900 mb-2">No forms yet</h3>
        <p className="text-sm text-slate-500 mb-6">Create your first form to start collecting trusted responses.</p>
        <CreateFormButton />
      </div>
    )
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {forms.map(form => <FormCard key={form.id} form={form} count={countMap[form.id] ?? 0} />)}
    </div>
  )
}
