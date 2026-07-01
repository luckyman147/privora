import Link from 'next/link'
import { createForm } from '@/app/(app)/dashboard/actions'
import type { DesignConfig } from '@/lib/types'
import { DEFAULT_DESIGN } from '@/lib/design'

interface FormRow {
  id:            string
  title:         string
  status:        'draft' | 'active' | 'closed'
  design_config: DesignConfig | null
  questions:     { label: string }[]
  updated_at:    string
}

interface Props {
  forms:    FormRow[]
  countMap: Record<string, number>
}

const STATUS_STYLE: Record<string, string> = {
  active: 'text-emerald-600 bg-emerald-50',
  closed: 'text-red-500 bg-red-50',
  draft:  'text-amber-500 bg-amber-50',
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const COUNT_COLORS = [
  { bg: '#F1F5F9', text: '#475569' },
  { bg: '#FEF3C7', text: '#92400E' },
  { bg: '#DBEAFE', text: '#1E40AF' },
  { bg: '#EDE9FE', text: '#5B21B6' },
  { bg: '#D1FAE5', text: '#065F46' },
]

function FormCard({ form, count }: { form: FormRow; count: number }) {
  const d = form.design_config ?? DEFAULT_DESIGN
  const bg = d.background_color ?? '#F6F7FB'
  const primary = d.primary_color ?? '#7C3AED'
  const ci = count === 0 ? 0 : count <= 10 ? 1 : count <= 50 ? 2 : count <= 200 ? 3 : 4
  const cc = COUNT_COLORS[ci]
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-sky-300 hover:shadow-sm transition group">
      {/* Preview area */}
      <Link href={`/builder/${form.id}`} className="block relative">
        <div
          className="h-40 p-5 flex flex-col justify-end relative"
          style={{ backgroundColor: bg }}
        >
          <div className="bg-white/90 backdrop-blur rounded-lg p-3">
            <p className="font-bold text-sm truncate" style={{ color: primary }}>
              {form.title}
            </p>
            <div className="mt-2 space-y-1">
              {form.questions.slice(0, 3).map((q, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: primary }} />
                  <span className="text-xs text-slate-600 truncate">{q.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div
            className="mt-2 w-20 h-6 rounded text-xs font-semibold text-white flex items-center justify-center"
            style={{ backgroundColor: primary }}
          >
            Submit
          </div>
        </div>
      </Link>

      {/* Info bar */}
      <div className="px-4 py-3 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-slate-900 truncate group-hover:text-sky-600 transition">
            {form.title}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-slate-400">{fmtDate(form.updated_at)}</span>
          </div>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_STYLE[form.status]}`}>
          {form.status}
        </span>
        <span className="text-xs font-bold px-2 py-1 rounded-full shadow-sm" style={{ backgroundColor: cc.bg, color: cc.text }}>
          {count}
        </span>
        {form.status === 'active' && (
          <a href={`/form/${form.id}`} target="_blank" rel="noopener noreferrer"
            className="shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
          </a>
        )}
      </div>
    </div>
  )
}

export function FormsList({ forms, countMap }: Props) {
  if (forms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-5 text-2xl">📝</div>
        <h3 className="font-bold text-slate-900 mb-2">No forms yet</h3>
        <p className="text-sm text-slate-500 mb-6">Create your first form to start collecting trusted responses.</p>
        <form action={createForm}>
          <button type="submit" className="px-5 py-2 text-sm font-semibold text-white bg-sky-500 rounded-lg hover:bg-sky-600 transition">
            Create form
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {forms.map(form => (
        <FormCard key={form.id} form={form} count={countMap[form.id] ?? 0} />
      ))}
    </div>
  )
}
