import Link from 'next/link'
import { createForm } from '@/app/(app)/dashboard/actions'

interface FormRow {
  id:        string
  title:     string
  mode:      'survey' | 'election'
  status:    'draft' | 'active' | 'closed'
  updated_at: string
}

interface Props {
  forms:    FormRow[]
  countMap: Record<string, number>
}

const STATUS_STYLE: Record<string, string> = {
  active: 'text-emerald-600',
  closed: 'text-red-500',
  draft:  'text-amber-500',
}

const MODE_STYLE: Record<string, string> = {
  survey:   'bg-sky-100 text-sky-700',
  election: 'bg-emerald-100 text-emerald-700',
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function FormIcon({ mode }: { mode: 'survey' | 'election' }) {
  return (
    <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
      mode === 'survey' ? 'bg-sky-100 text-sky-600' : 'bg-emerald-100 text-emerald-600'
    }`}>
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm0 2h12v10H4V5zm2 2v2h8V7H6zm0 4v2h5v-2H6z" />
      </svg>
    </span>
  )
}

export function FormsList({ forms, countMap }: Props) {
  if (forms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-5 text-2xl">📝</div>
        <h3 className="font-bold text-slate-900 mb-2">No forms yet</h3>
        <p className="text-sm text-slate-500 mb-6">Create your first form to start collecting trusted responses.</p>
        <form action={createForm.bind(null, 'survey')}>
          <button type="submit" className="px-5 py-2 text-sm font-semibold text-white bg-sky-500 rounded-lg hover:bg-sky-600 transition">
            Create form
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
      {forms.map(form => {
        const count = countMap[form.id] ?? 0
        return (
          <Link
            key={form.id}
            href={`/builder/${form.id}`}
            className="flex items-center gap-4 px-5 py-4 bg-white hover:bg-slate-50 transition group"
          >
            <FormIcon mode={form.mode} />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-900 truncate">{form.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${MODE_STYLE[form.mode]}`}>
                  {form.mode.charAt(0).toUpperCase() + form.mode.slice(1)}
                </span>
                <span className="text-xs text-slate-400">{count} response{count !== 1 ? 's' : ''}</span>
                <span className="text-xs text-slate-300">·</span>
                <span className="text-xs text-slate-400">{fmtDate(form.updated_at)}</span>
              </div>
            </div>
            <span className={`text-sm font-semibold ${STATUS_STYLE[form.status]}`}>
              {form.status.charAt(0).toUpperCase() + form.status.slice(1)}
            </span>
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-slate-300 group-hover:text-slate-400 transition shrink-0">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </Link>
        )
      })}
    </div>
  )
}
