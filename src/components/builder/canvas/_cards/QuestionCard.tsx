'use client'
import { useState, useRef, useEffect } from 'react'
import { TYPE_META, SIDEBAR_TYPES, CHOICE_TYPES, TEXT_TYPES, Toggle } from '../../meta'
import type { Question, QuestionType, MatrixCellType, MatrixColumn } from '@/lib/types'
import type { DragHandlers } from '../BuilderCanvas'
import { LogicSection } from '../ConditionBuilder'

const CELL_META: Record<MatrixCellType, { label: string; preview: string }> = {
  short_answer: { label: 'Text',     preview: '────────' },
  rating:       { label: 'Rating',   preview: '★ ★ ★'   },
  date:         { label: 'Date',     preview: '📅 ──────' },
  checkbox:     { label: 'Checkbox', preview: '☐'        },
  choice:       { label: 'Choice',   preview: '◉  ○  ○'  },
}

export function MatrixEditor({ question, onUpdate }: { question: Question; onUpdate: (patch: Partial<Question>) => void }) {
  const rows = question.rows ?? ['Row 1', 'Row 2']
  const cols: MatrixColumn[] = question.matrix_columns ?? (question.columns ?? ['Column 1']).map(c => ({ name: c, type: 'short_answer' as MatrixCellType }))
  const setRows = (r: string[]) => onUpdate({ rows: r }); const setCols = (c: MatrixColumn[]) => onUpdate({ matrix_columns: c })
  function updateColName(i: number, name: string) { const next = [...cols]; next[i] = { ...next[i], name }; setCols(next) }
  function updateColType(i: number, type: MatrixCellType) { const next = [...cols]; next[i] = { ...next[i], type }; setCols(next) }
  function updateRow(i: number, name: string) { const next = [...rows]; next[i] = name; setRows(next) }
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 text-xs">
      <table className="border-collapse w-full">
        <thead><tr className="bg-slate-50">
          <th className="w-28 px-2.5 py-2 border-r border-b border-slate-200 text-slate-400 font-medium text-left shrink-0">Row / Col</th>
          {cols.map((col, ci) => (
            <th key={ci} className="px-2 py-1.5 border-r border-b border-slate-200 last:border-r-0 min-w-[110px]">
              <div className="flex items-center gap-1 mb-1.5">
                <input value={col.name} onChange={e => updateColName(ci, e.target.value)} placeholder={`Col ${ci + 1}`}
                  className="flex-1 text-xs font-semibold text-slate-700 bg-transparent focus:outline-none border-b border-transparent focus:border-sky-400 pb-0.5 min-w-0 w-full" />
                <button onClick={() => setCols(cols.filter((_, j) => j !== ci))} className="text-slate-200 hover:text-red-400 transition shrink-0 text-[10px] leading-none">✕</button>
              </div>
              <select value={col.type} onChange={e => updateColType(ci, e.target.value as MatrixCellType)}
                className="w-full text-[10px] border border-slate-200 rounded px-1.5 py-0.5 bg-white text-slate-500 focus:outline-none focus:border-sky-400 cursor-pointer">
                {(Object.keys(CELL_META) as MatrixCellType[]).map(t => <option key={t} value={t}>{CELL_META[t].label}</option>)}
              </select>
            </th>
          ))}
          <th className="px-2 py-2 border-b border-slate-200 w-9">
            <button onClick={() => setCols([...cols, { name: `Col ${cols.length + 1}`, type: 'short_answer' }])}
              className="w-6 h-6 rounded-lg bg-sky-50 text-sky-500 hover:bg-sky-100 transition flex items-center justify-center font-bold text-base leading-none">+</button>
          </th>
        </tr></thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="border-b border-slate-100 last:border-b-0 group/row">
              <td className="px-2.5 py-2 border-r border-slate-200 bg-slate-50">
                <div className="flex items-center gap-1">
                  <input value={row} onChange={e => updateRow(ri, e.target.value)} placeholder={`Row ${ri + 1}`}
                    className="flex-1 text-xs font-semibold text-slate-700 bg-transparent focus:outline-none border-b border-transparent focus:border-sky-400 pb-0.5 min-w-0" />
                  <button onClick={() => setRows(rows.filter((_, j) => j !== ri))} className="text-slate-200 hover:text-red-400 transition shrink-0 text-[10px] opacity-0 group-hover/row:opacity-100 leading-none">✕</button>
                </div>
              </td>
              {cols.map((col, ci) => (
                <td key={ci} className="px-2 py-3 text-center border-r border-slate-100 last:border-r-0">
                  <span className={`select-none ${col.type === 'rating' ? 'text-amber-200' : col.type === 'checkbox' ? 'text-slate-300 text-base' : 'text-slate-200'}`}>{CELL_META[col.type].preview}</span>
                </td>
              ))}
              <td />
            </tr>
          ))}
          <tr className="bg-slate-50">
            <td className="px-2.5 py-2 border-r border-slate-200">
              <button onClick={() => setRows([...rows, `Row ${rows.length + 1}`])} className="text-xs font-semibold text-sky-600 hover:text-sky-700 transition flex items-center gap-1"><span className="text-sm font-bold leading-none">+</span> Add row</button>
            </td><td colSpan={cols.length + 1} />
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export function QuestionCard({ question, index, selected, allQuestions, onSelect, onDelete, onCopy, onMoveUp, onMoveDown, onUpdate, drag }: {
  question: Question; index: number; selected: boolean; allQuestions: Question[]
  onSelect: () => void; onDelete: () => void; onCopy: () => void
  onMoveUp: () => void; onMoveDown: () => void; onUpdate: (patch: Partial<Question>) => void; drag: DragHandlers
}) {
  const meta = TYPE_META[question.type]; const isText = TEXT_TYPES.includes(question.type); const isChoice = CHOICE_TYPES.includes(question.type)
  const [moreOpen, setMoreOpen] = useState(false); const [logicOpen, setLogicOpen] = useState(false)
  const moreRef = useRef<HTMLDivElement>(null); const labelRef = useRef<HTMLTextAreaElement>(null)
  useEffect(() => { if (!moreOpen) return; function close(e: MouseEvent) { if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false) }; document.addEventListener('mousedown', close); return () => document.removeEventListener('mousedown', close) }, [moreOpen])
  useEffect(() => { if (selected && labelRef.current) { const el = labelRef.current; el.focus(); el.selectionStart = el.selectionEnd = el.value.length } }, [selected])

  return (
    <div onClick={onSelect} draggable onDragStart={drag.onDragStart} onDragEnd={drag.onDragEnd} onDragOver={drag.onDragOver} onDrop={drag.onDrop}
      className={`group bg-white rounded-xl border-2 cursor-pointer transition shadow-sm ${drag.isDragging ? 'opacity-40 scale-[0.99]' : ''} ${drag.isDragOver && !drag.isDragging ? 'border-sky-400 shadow-md' : selected ? 'border-sky-400' : 'border-transparent hover:border-slate-200'}`}>
      <div className="flex items-center gap-3 px-5 py-4">
        <span className="text-[10px] text-slate-300 select-none shrink-0 tracking-tight cursor-grab active:cursor-grabbing">⠿⠿</span>
        <span className="text-xs font-bold text-slate-400 w-3 shrink-0">{index + 1}</span>
        <span className={`w-8 h-8 ${meta?.color ?? 'bg-slate-100 text-slate-500'} rounded-lg flex items-center justify-center shrink-0`}>{meta?.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">{question.label}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-slate-400">{meta?.label ?? question.type}</span>
            <span className={`text-xs font-semibold ${question.required ? 'text-sky-600' : 'text-slate-400'}`}>{question.required ? 'Required' : 'Optional'}</span>
          </div>
        </div>
        <div className={`flex items-center gap-0.5 transition-opacity ${selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} onClick={e => e.stopPropagation()}>
          <button title="Duplicate" onClick={onCopy} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"><svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" /><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" /></svg></button>
          <button title="Delete" onClick={onDelete} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"><svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg></button>
          <div ref={moreRef} className="relative">
            <button title="More" onClick={() => setMoreOpen(v => !v)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"><svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" /></svg></button>
            {moreOpen && (
              <div className="absolute right-0 top-8 w-40 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-20">
                <button onClick={() => { onMoveUp(); setMoreOpen(false) }} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"><svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-slate-400"><path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" /></svg>Move up</button>
                <button onClick={() => { onMoveDown(); setMoreOpen(false) }} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"><svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-slate-400"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>Move down</button>
                <button onClick={() => { onCopy(); setMoreOpen(false) }} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"><svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-slate-400"><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" /><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" /></svg>Duplicate</button>
                <div className="border-t border-slate-100 my-1" />
                <button onClick={() => { onDelete(); setMoreOpen(false) }} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition"><svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>Delete</button>
              </div>
            )}
          </div>
        </div>
      </div>
      {selected && (
        <div className="border-t border-slate-100 px-5 pb-5 pt-4 space-y-4" onClick={e => e.stopPropagation()}>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Label</label>
            <textarea ref={labelRef} rows={2} value={question.label} onChange={e => onUpdate({ label: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-400 resize-none transition" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Description</label>
            <textarea rows={1} value={question.description ?? ''} onChange={e => onUpdate({ description: e.target.value || undefined })} placeholder="Help text (optional)"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-400 resize-none placeholder:text-slate-300 transition" />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0 w-10">Type</label>
            <div className="flex items-center gap-2 flex-1 border border-slate-200 rounded-lg px-2.5 py-2 bg-white">
              <span className={`w-5 h-5 ${meta?.color ?? 'bg-slate-100'} rounded flex items-center justify-center text-xs shrink-0`}>{meta?.icon}</span>
              <select value={question.type} onChange={e => onUpdate({ type: e.target.value as QuestionType })}
                className="flex-1 text-sm text-slate-700 bg-transparent focus:outline-none cursor-pointer">
                {SIDEBAR_TYPES.map(t => <option key={t} value={t}>{TYPE_META[t]?.label ?? t}</option>)}
              </select>
            </div>
          </div>
          {isChoice && (
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Options</label>
              <div className="space-y-2">
                {question.options?.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input value={opt} onChange={e => { const opts = [...(question.options ?? [])]; opts[i] = e.target.value; onUpdate({ options: opts }) }}
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-sky-400" />
                    <button onClick={() => onUpdate({ options: question.options?.filter((_, j) => j !== i) })} className="text-slate-300 hover:text-red-500 transition shrink-0 text-sm">✕</button>
                  </div>
                ))}
                <button onClick={() => onUpdate({ options: [...(question.options ?? []), `Option ${(question.options?.length ?? 0) + 1}`] })}
                  className="text-xs font-semibold text-sky-600 hover:text-sky-700 transition">+ Add option</button>
              </div>
            </div>
          )}
          {question.type === 'matrix' && <MatrixEditor question={question} onUpdate={onUpdate} />}
          <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <Toggle checked={question.required} onChange={v => onUpdate({ required: v })} />
              <span className="text-xs font-medium text-slate-600">Required</span>
            </div>
            <div className="flex items-center gap-3">
              {isText && (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-400">Max chars</span>
                  <input type="number" min={1} value={question.max_chars ?? 255} onChange={e => onUpdate({ max_chars: parseInt(e.target.value) || undefined })}
                    className="w-16 px-2 py-1 border border-slate-200 rounded-lg text-xs text-right focus:outline-none focus:border-sky-400" />
                </div>
              )}
              {question.type === 'rating' && (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-400">Scale</span>
                  <select value={question.max_rating ?? 5} onChange={e => onUpdate({ max_rating: parseInt(e.target.value) })}
                    className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:border-sky-400">
                    {[5, 10, 20].map(n => <option key={n} value={n}>1 – {n}</option>)}
                  </select>
                </div>
              )}
            </div>
          </div>
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <button onClick={() => setLogicOpen(v => !v)}
              className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition select-none">
              Conditional Logic
              {question.logic && <span className="text-[10px] bg-sky-100 text-sky-600 px-1.5 py-0.5 rounded font-bold mr-auto ml-2">ON</span>}
              <svg viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 text-slate-400 transition-transform ${logicOpen ? 'rotate-180' : ''}`}><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </button>
            {logicOpen && <div className="px-3 pb-3 pt-1 space-y-3 border-t border-slate-100"><LogicSection question={question} questionIndex={index} allQuestions={allQuestions} onUpdate={onUpdate} /></div>}
          </div>
        </div>
      )}
    </div>
  )
}

