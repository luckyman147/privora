import type { Form, Response } from '@/lib/types'
import { ResponsesTable } from '../panels/ResponsesTable'
import { exportCsv } from '../resultsUtils'

export function ResponsesView({ form, responses, onDelete, onUpdate, onPreview }: {
  form: Form
  responses: Response[]
  onDelete: (id: string) => void
  onUpdate: (id: string, answers: Record<string, any>) => void
  onPreview: (id: string) => void
}) {
  return (
    <div className="p-6 space-y-5 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Responses</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            {responses.length} response{responses.length !== 1 ? 's' : ''} collected
          </p>
        </div>
        <button
          onClick={() => exportCsv(form.questions, responses)}
          disabled={!responses.length}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Export CSV
        </button>
      </div>
      <ResponsesTable form={form} responses={responses} onDelete={onDelete} onUpdate={onUpdate} onPreview={onPreview} />
    </div>
  )
}
