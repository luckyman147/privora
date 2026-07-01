'use client'
import { useState } from 'react'
import type { Form, Response } from '@/lib/types'
import { qc, fmtDate, getAnswer } from '../resultsUtils'
import { ResponseModal } from './modals/ResponseModal'

const PAGE = 10
type ModalMode = 'preview' | 'edit' | 'delete'

export function ResponsesTable({ form, responses, onDelete, onUpdate, onPreview }: {
  form: Form; responses: Response[]
  onDelete?: (id: string) => void; onUpdate?: (id: string, answers: Record<string, any>) => void; onPreview?: (id: string) => void
}) {
  const cols = form.questions.filter(q => q.type !== 'section' && q.type !== 'page_break')
  const [page, setPage] = useState(0)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [modalMode, setModalMode] = useState<ModalMode>('preview')
  const total = responses.length
  const slice = responses.slice(page * PAGE, (page + 1) * PAGE)
  const activeResponse = responses.find(r => r.id === activeId)
  function open(id: string, mode: ModalMode) { setActiveId(id); setModalMode(mode) }

  if (!responses.length) return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-slate-300"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
      </div>
      <p className="text-sm font-semibold text-slate-600">No responses yet</p>
      <p className="text-xs text-slate-400">Share your form to start collecting responses.</p>
    </div>
  )

  return (
    <div className="space-y-4">
      {activeResponse && (
        <ResponseModal form={form} response={activeResponse} initialMode={modalMode}
          onClose={() => setActiveId(null)}
          onDelete={() => { onDelete?.(activeResponse.id); setActiveId(null) }}
          onUpdate={onUpdate} />
      )}

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200">
              <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider w-10">#</th>
              <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Submitted</th>
              {cols.slice(0, 5).map(q => (
                <th key={q.id} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider max-w-[180px]" style={{ color: qc(q.type).accent }}>
                  <span className="truncate block">{q.label}</span>
                </th>
              ))}
              <th className="px-4 py-3 w-24" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/60 bg-white">
            {slice.map((r, i) => (
              <tr key={r.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-4 py-3 text-xs text-slate-300 font-mono">{page * PAGE + i + 1}</td>
                <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{fmtDate(r.submitted_at)}</td>
                {cols.slice(0, 5).map(q => (
                  <td key={q.id} className="px-4 py-3 text-xs text-slate-600 max-w-[180px]">
                    <span className="block truncate">{getAnswer(r, q.id)}</span>
                  </td>
                ))}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition">
                    <button title="View" onClick={() => onPreview?.(r.id)} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition"><svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg></button>
                    <button title="Edit" onClick={() => open(r.id, 'edit')} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition"><svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg></button>
                    <button title="Delete" onClick={() => open(r.id, 'delete')} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition"><svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {slice.map((r, i) => (
          <div key={r.id} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-slate-100 text-[10px] font-bold text-slate-400 flex items-center justify-center">{page * PAGE + i + 1}</span>
                <span className="text-xs text-slate-400">{fmtDate(r.submitted_at)}</span>
              </div>
              <div className="flex items-center gap-1">
                <button title="View" onClick={() => onPreview?.(r.id)} className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition"><svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg></button>
                <button title="Edit" onClick={() => open(r.id, 'edit')} className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition"><svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg></button>
                <button title="Delete" onClick={() => open(r.id, 'delete')} className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition"><svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg></button>
              </div>
            </div>
            <div className="space-y-2">
              {cols.map(q => (
                <div key={q.id} className="flex items-start gap-2">
                  <span className="text-[11px] font-semibold text-slate-400 shrink-0 min-w-[80px] truncate">{q.label}</span>
                  <span className="text-xs text-slate-700 break-all">{getAnswer(r, q.id)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {total > PAGE && (
        <div className="flex items-center justify-between pt-1">
          <p className="text-xs text-slate-400">{page * PAGE + 1}–{Math.min((page + 1) * PAGE, total)} of {total}</p>
          <div className="flex gap-1.5">
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition">Prev</button>
            <button disabled={(page + 1) * PAGE >= total} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition">Next</button>
          </div>
        </div>
      )}
    </div>
  )
}
