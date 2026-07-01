'use client'
import { useState } from 'react'
import type { Form, Response, Question } from '@/lib/types'
import { qc, getAnswer, fmtDate } from '../../resultsUtils'

type Mode = 'preview' | 'edit' | 'delete'
const IC = "w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-violet-400 focus:outline-none"

function EditField({ q, value, onChange }: { q: Question; value: any; onChange: (v: any) => void }) {
  if (q.type === 'rating') return (
    <div className="flex gap-1.5 flex-wrap">
      {Array.from({ length: q.max_rating ?? 5 }, (_, i) => (
        <button key={i} type="button" onClick={() => onChange(i + 1)}
          className={`w-8 h-8 rounded-lg text-xs font-bold border transition ${Number(value) === i + 1 ? 'bg-violet-600 border-violet-600 text-white' : 'border-slate-200 text-slate-500 hover:border-violet-300'}`}>
          {i + 1}
        </button>
      ))}
    </div>
  )
  if (q.type === 'multiple_choice') return (
    <div className="space-y-1.5">
      {q.options?.map(opt => (
        <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="radio" name={q.id} checked={value === opt} onChange={() => onChange(opt)} className="accent-violet-600" />
          {opt}
        </label>
      ))}
    </div>
  )
  if (q.type === 'matrix' || q.type === 'file_upload')
    return <p className="text-xs text-slate-400 italic">{q.type === 'matrix' ? 'Matrix' : 'File upload'} answers are read-only.</p>
  if (q.type === 'long_text') return (
    <textarea value={String(value ?? '')} onChange={e => onChange(e.target.value)} rows={3} className={`${IC} resize-none`} />
  )
  return <input type={q.type === 'date' ? 'date' : 'text'} value={Array.isArray(value) ? (value as string[]).join(', ') : String(value ?? '')} onChange={e => onChange(e.target.value)} className={IC} />
}

export function ResponseModal({ form, response, initialMode = 'preview', onClose, onDelete, onUpdate }: {
  form: Form; response: Response; initialMode?: Mode
  onClose: () => void; onDelete?: () => void
  onUpdate?: (id: string, answers: Record<string, any>) => void
}) {
  const [mode, setMode] = useState<Mode>(initialMode)
  const [draft, setDraft] = useState<Record<string, any>>({ ...response.answers })
  const realQs = form.questions.filter(q => q.type !== 'section' && q.type !== 'page_break')
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 shrink-0">
          {mode === 'delete' ? (
            <p className="font-bold text-slate-900 text-sm">Delete this response?</p>
          ) : (
            <div className="flex items-center gap-1">
              {(['preview', 'edit'] as const).map(m => (
                <button key={m} onClick={() => setMode(m)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition ${mode === m ? 'bg-violet-100 text-violet-700' : 'text-slate-400 hover:text-slate-600'}`}>
                  {m}
                </button>
              ))}
            </div>
          )}
          <div className="flex items-center gap-1">
            {mode !== 'delete' && (
              <button onClick={() => setMode('delete')}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            )}
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition">✕</button>
          </div>
        </div>
        {mode === 'delete' && (
          <div className="p-6">
            <p className="text-sm text-slate-500 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setMode('preview')} className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">Cancel</button>
              <button onClick={onDelete} className="flex-1 px-4 py-2 rounded-xl bg-red-500 text-sm font-semibold text-white hover:bg-red-600 transition">Delete</button>
            </div>
          </div>
        )}
        {mode !== 'delete' && (
          <>
            <div className="overflow-y-auto flex-1 p-5 space-y-2.5">
              <p className="text-[11px] text-slate-400 mb-1">{fmtDate(response.submitted_at)}</p>
              {realQs.map((q, i) => {
                const c = qc(q.type)
                return (
                  <div key={q.id} className="bg-slate-50 rounded-xl p-3.5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-5 h-5 rounded flex items-center justify-center text-white text-[10px] font-black shrink-0" style={{ background: c.accent }}>{i + 1}</span>
                      <p className="text-xs font-semibold text-slate-700 flex-1 min-w-0 truncate">{q.label}</p>
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0" style={{ background: c.light, color: c.accent }}>{c.label}</span>
                    </div>
                    <div className="pl-7">
                      {mode === 'preview'
                        ? <p className="text-sm text-slate-600 leading-relaxed break-words">{getAnswer(response, q.id) === '—' ? <span className="text-slate-300 italic">No answer</span> : getAnswer(response, q.id)}</p>
                        : <EditField q={q} value={draft[q.id]} onChange={v => setDraft(d => ({ ...d, [q.id]: v }))} />}
                    </div>
                  </div>
                )
              })}
            </div>
            {mode === 'edit' && (
              <div className="p-5 border-t border-slate-100 flex gap-3 shrink-0">
                <button onClick={onClose} className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">Cancel</button>
                <button onClick={() => { onUpdate?.(response.id, draft); onClose() }} className="flex-1 px-4 py-2 rounded-xl bg-violet-600 text-sm font-semibold text-white hover:bg-violet-700 transition">Save changes</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
