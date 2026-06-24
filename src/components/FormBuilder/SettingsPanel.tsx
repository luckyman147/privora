'use client'
import type { Question, QuestionType } from '@/lib/types'

interface Props {
  question?: Question
  onUpdate: (patch: Partial<Question>) => void
  onDelete: () => void
}

export function SettingsPanel({ question, onUpdate, onDelete }: Props) {
  if (!question) {
    return (
      <div className="w-64 bg-white border-l border-slate-200 p-4 shrink-0">
        <p className="text-sm text-slate-400 text-center mt-20">Select a question to edit its settings</p>
      </div>
    )
  }

  return (
    <div className="w-64 bg-white border-l border-slate-200 p-4 overflow-y-auto shrink-0">
      <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4">Question Settings</div>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1">Label</label>
          <input value={question.label} onChange={e => onUpdate({ label: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-sky-400" />
        </div>
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-500">Required</label>
          <input type="checkbox" checked={question.required} onChange={e => onUpdate({ required: e.target.checked })}
            className="accent-sky-500" />
        </div>
        {question.type === 'rating' && (
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">Max rating</label>
            <select value={question.max_rating ?? 5} onChange={e => onUpdate({ max_rating: Number(e.target.value) })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white">
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={7}>7</option>
              <option value={10}>10</option>
            </select>
          </div>
        )}
        {['multiple_choice', 'checkboxes', 'dropdown'].includes(question.type) && (
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">Options</label>
            {question.options?.map((opt, i) => (
              <div key={i} className="flex gap-1 mb-1">
                <input value={opt} onChange={e => {
                  const next = [...(question.options ?? [])]
                  next[i] = e.target.value
                  onUpdate({ options: next })
                }}
                  className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded" />
                <button onClick={() => onUpdate({ options: question.options?.filter((_, j) => j !== i) })}
                  className="text-red-400 text-xs">✕</button>
              </div>
            ))}
            <button onClick={() => onUpdate({ options: [...(question.options ?? []), `Option ${(question.options?.length ?? 0) + 1}`] })}
              className="text-xs text-sky-500 font-semibold">+ Add option</button>
          </div>
        )}
        {question.type === 'matrix' && (
          <>
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Rows</label>
              {question.rows?.map((r, i) => (
                <div key={i} className="flex gap-1 mb-1">
                  <input value={r} onChange={e => {
                    const next = [...(question.rows ?? [])]; next[i] = e.target.value
                    onUpdate({ rows: next })
                  }} className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded" />
                  <button onClick={() => onUpdate({ rows: question.rows?.filter((_, j) => j !== i) })}
                    className="text-red-400 text-xs">✕</button>
                </div>
              ))}
              <button onClick={() => onUpdate({ rows: [...(question.rows ?? []), `Row ${(question.rows?.length ?? 0) + 1}`] })}
                className="text-xs text-sky-500 font-semibold">+ Row</button>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Columns</label>
              {question.columns?.map((c, i) => (
                <div key={i} className="flex gap-1 mb-1">
                  <input value={c} onChange={e => {
                    const next = [...(question.columns ?? [])]; next[i] = e.target.value
                    onUpdate({ columns: next })
                  }} className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded" />
                  <button onClick={() => onUpdate({ columns: question.columns?.filter((_, j) => j !== i) })}
                    className="text-red-400 text-xs">✕</button>
                </div>
              ))}
              <button onClick={() => onUpdate({ columns: [...(question.columns ?? []), `Col ${(question.columns?.length ?? 0) + 1}`] })}
                className="text-xs text-sky-500 font-semibold">+ Column</button>
            </div>
          </>
        )}
        <button onClick={onDelete}
          className="w-full py-2 text-sm font-semibold text-red-500 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100">
          Delete question
        </button>
      </div>
    </div>
  )
}
