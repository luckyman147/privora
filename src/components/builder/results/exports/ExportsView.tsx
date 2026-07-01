'use client'
import { useState, useCallback } from 'react'
import type { Form, Response } from '@/lib/types'
import { fmtDate, exportCsv } from '../resultsUtils'

function IndeterminateCheckbox({ checked, indeterminate, onChange }: {
  checked: boolean; indeterminate: boolean; onChange: () => void
}) {
  return (
    <input type="checkbox" checked={checked}
      ref={el => { if (el) el.indeterminate = indeterminate }}
      onChange={onChange}
      className="w-4 h-4 accent-violet-600 cursor-pointer shrink-0" />
  )
}

function ResponseRow({ r, idx, total, previewText, isSelected, onToggle }: {
  r: Response; idx: number; total: number; previewText: string
  isSelected: boolean; onToggle: () => void
}) {
  return (
    <div onClick={onToggle}
      className={`flex items-center gap-4 px-4 py-3.5 cursor-pointer transition hover:bg-slate-50 ${isSelected ? 'bg-violet-50/50' : ''}`}>
      <input type="checkbox" checked={isSelected}
        onChange={onToggle} onClick={e => e.stopPropagation()}
        className="w-4 h-4 accent-violet-600 cursor-pointer shrink-0" />
      <div className="w-7 h-7 rounded-lg bg-violet-100 text-violet-700 text-xs font-bold flex items-center justify-center shrink-0">
        {total - idx}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-700">Response #{total - idx}</p>
        {previewText && (
          <p className="text-xs text-slate-400 truncate mt-0.5">{previewText}</p>
        )}
      </div>
      <span className="text-xs text-slate-400 shrink-0 tabular-nums">{fmtDate(r.submitted_at)}</span>
    </div>
  )
}

export function ExportsView({ form, responses }: { form: Form; responses: Response[] }) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set(responses.map(r => r.id)))

  const allSelected = selected.size === responses.length && responses.length > 0
  const someSelected = selected.size > 0 && !allSelected

  const toggleAll = useCallback(() => {
    setSelected(allSelected ? new Set() : new Set(responses.map(r => r.id)))
  }, [allSelected, responses])

  const toggleOne = useCallback((id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  const previewQ = form.questions.find(q => q.type !== 'section' && q.type !== 'page_break')

  function getPreview(r: Response) {
    if (!previewQ) return ''
    const v = r.answers[previewQ.id]
    if (v == null) return ''
    return Array.isArray(v) ? v.join(', ') : String(v)
  }

  function handleExport() {
    const toExport = responses.filter(r => selected.has(r.id))
    exportCsv(form.questions, toExport)
  }

  return (
    <div className="p-6 space-y-5 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Export</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            {selected.size} of {responses.length} response{responses.length !== 1 ? 's' : ''} selected
          </p>
        </div>
        <div className="flex items-center gap-3">
          {selected.size > 0 && selected.size < responses.length && (
            <button onClick={() => setSelected(new Set(responses.map(r => r.id)))}
              className="text-xs text-violet-600 font-semibold hover:underline">
              Select all
            </button>
          )}
          <button onClick={handleExport} disabled={selected.size === 0}
            className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Export {selected.size > 0 ? `${selected.size} ` : ''}as CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 bg-slate-50/80">
          <IndeterminateCheckbox checked={allSelected} indeterminate={someSelected} onChange={toggleAll} />
          <span className="text-xs font-semibold text-slate-500 select-none">
            {allSelected ? 'Deselect all' : someSelected ? `${selected.size} selected` : 'Select all'}
          </span>
          {someSelected && (
            <button onClick={() => setSelected(new Set())}
              className="ml-auto text-xs text-slate-400 hover:text-red-500 transition">
              Clear
            </button>
          )}
        </div>

        {!responses.length ? (
          <div className="flex items-center justify-center py-14">
            <p className="text-sm text-slate-400">No responses yet to export.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {responses.map((r, i) => (
              <ResponseRow key={r.id} r={r} idx={i} total={responses.length}
                previewText={getPreview(r)}
                isSelected={selected.has(r.id)}
                onToggle={() => toggleOne(r.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
