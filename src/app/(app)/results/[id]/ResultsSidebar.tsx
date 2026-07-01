import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'

interface SidebarForm {
  id: string
  status: string
  created_at: string
  closes_at?: string
  questions: any[]
}

interface Props {
  form: SidebarForm
  responseCount: number
}

function EditIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
    </svg>
  )
}

function ExternalLinkIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  )
}

export function ResultsSidebar({ form, responseCount }: Props) {
  const actionCls = 'flex items-center gap-2.5 text-sm text-slate-600 hover:text-slate-900 py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors w-full'
  const cardCls = 'bg-white border border-slate-200 rounded-xl p-5'
  const labelCls = 'text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3'

  return (
    <aside className="space-y-3">
      <div className={cardCls}>
        <p className={labelCls}>Overview</p>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Status</span>
            <Badge variant={form.status} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Responses</span>
            <span className="text-xs font-semibold text-slate-900">{responseCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Questions</span>
            <span className="text-xs font-semibold text-slate-900">{form.questions.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Created</span>
            <span className="text-xs text-slate-700">{formatDate(form.created_at)}</span>
          </div>
          {form.closes_at && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Closes</span>
              <span className="text-xs text-slate-700">{formatDate(form.closes_at)}</span>
            </div>
          )}
        </div>
      </div>

      <div className={cardCls}>
        <p className={labelCls}>Actions</p>
        <div className="space-y-0.5">
          <Link href={`/builder/${form.id}`} className={actionCls}>
            <EditIcon />Edit form
          </Link>
          <a href={`/form/${form.id}`} target="_blank" rel="noopener noreferrer" className={actionCls}>
            <ExternalLinkIcon />View form
          </a>
          <a href={`/results/${form.id}/export`} className={actionCls}>
            <DownloadIcon />Export CSV
          </a>
        </div>
      </div>
    </aside>
  )
}
