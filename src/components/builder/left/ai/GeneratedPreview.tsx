'use client'
import { useState } from 'react'
import { TYPE_META, TYPE_META_EXTRA } from '../../meta'
import type { Question, DesignConfig } from '@/lib/types'

interface Props {
  title:       string
  description?: string
  questions:   Omit<Question, 'id'>[]
  design:      Partial<DesignConfig>
  onApply:     (questions: Omit<Question, 'id'>[]) => void
  onDiscard:   () => void
}

const TYPE_LABELS: Record<string, string> = {
  short_text: 'Short answer', long_text: 'Long answer',
  multiple_choice: 'Multiple choice', checkboxes: 'Checkboxes',
  dropdown: 'Dropdown', rating: 'Rating', date: 'Date',
  section: 'Section', page_break: 'Page break',
}
const CHOICE_TYPES = ['multiple_choice', 'checkboxes', 'dropdown']
const TEXT_TYPES = ['short_text', 'long_text']

function QuestionDetail({ q, onUpdate }: { q: Omit<Question, 'id'>; onUpdate: (patch: Partial<Omit<Question, 'id'>>) => void }) {
  return (
    <div className="space-y-2 mt-2 pt-2 border-t border-slate-100">
      <input value={q.label} onChange={e => onUpdate({ label: e.target.value })}
        className="w-full text-sm font-semibold text-slate-800 bg-transparent border-b border-slate-200 pb-1 focus:outline-none focus:border-sky-400" />
      <textarea value={q.description ?? ''} onChange={e => onUpdate({ description: e.target.value || undefined })} placeholder="Description" rows={1}
        className="w-full text-xs text-slate-500 bg-transparent resize-none border-b border-slate-200 pb-1 focus:outline-none focus:border-sky-400 placeholder:text-slate-300" />
      {CHOICE_TYPES.includes(q.type) && <>
        {q.options?.map((o, j) => (
          <div key={j} className="flex items-center gap-1">
            <input value={o} onChange={e => { const opts = [...(q.options ?? [])]; opts[j] = e.target.value; onUpdate({ options: opts }) }}
              className="flex-1 text-xs px-2 py-1 border border-slate-200 rounded focus:outline-none focus:border-sky-400" />
            <button onClick={() => onUpdate({ options: q.options?.filter((_, k) => k !== j) })} className="text-slate-300 hover:text-red-500 text-xs">✕</button>
          </div>
        ))}
        <button onClick={() => onUpdate({ options: [...(q.options ?? []), `Option ${(q.options?.length ?? 0) + 1}`] })}
          className="text-[11px] font-semibold text-sky-600 hover:text-sky-700">+ Option</button>
      </>}
      <div className="flex items-center gap-3 pt-1">
        <label className="flex items-center gap-1.5 text-[11px] text-slate-500 cursor-pointer">
          <input type="checkbox" checked={q.required} onChange={e => onUpdate({ required: e.target.checked })} className="accent-sky-500" />
          Required
        </label>
        {q.type === 'rating' && <>
          <span className="text-[11px] text-slate-500">Scale:</span>
          <select value={q.max_rating ?? 5} onChange={e => onUpdate({ max_rating: parseInt(e.target.value) })}
            className="text-xs border border-slate-200 rounded px-2 py-0.5 bg-white focus:outline-none focus:border-sky-400">
            {[5, 10, 20].map(n => <option key={n} value={n}>1 – {n}</option>)}
          </select>
        </>}
      </div>
    </div>
  )
}

export function GeneratedPreview({ title, description, questions: initial, design, onApply, onDiscard }: Props) {
  const [questions, setQuestions] = useState(initial)
  const [expanded, setExpanded] = useState<number | null>(null)
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null)

  function updateQuestion(i: number, patch: Partial<Omit<Question, 'id'>>) {
    setQuestions(prev => { const next = [...prev]; next[i] = { ...next[i], ...patch }; return next })
  }

  function remove(i: number) {
    setQuestions(prev => prev.filter((_, j) => j !== i))
    setExpanded(null)
  }

  function drop(to: number) {
    if (dragIdx === null || dragIdx === to) { setDragIdx(null); setDragOverIdx(null); return }
    setQuestions(prev => { const next = [...prev]; const [m] = next.splice(dragIdx, 1); next.splice(to, 0, m); return next })
    setDragIdx(null); setDragOverIdx(null)
  }

  return (
    <div className="p-4 space-y-4">
      <div>
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>

      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
          {questions.length} question{questions.length === 1 ? '' : 's'}
        </p>
        <ul className="space-y-1">
          {questions.map((q, i) => {
            const meta = TYPE_META[q.type] ?? TYPE_META_EXTRA[q.type]
            const isExpanded = expanded === i
            const isDragging = dragIdx === i
            const isDragOver = dragOverIdx === i && !isDragging
            return (
              <li key={i} draggable
                onDragStart={() => setTimeout(() => setDragIdx(i), 0)}
                onDragEnd={() => { setDragIdx(null); setDragOverIdx(null) }}
                onDragOver={e => { e.preventDefault(); setDragOverIdx(i) }}
                onDrop={() => drop(i)}
                className={`rounded-lg border overflow-hidden transition-all cursor-default ${isDragging ? 'opacity-40 scale-[0.97] border-sky-300' : isDragOver ? 'border-sky-400 shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}>
                <div className="flex items-center gap-1.5 px-2 py-2">
                  <span className="text-slate-300 cursor-grab active:cursor-grabbing select-none text-[10px] leading-none tracking-widest shrink-0">⠿⠿</span>
                  {meta && <span className={`w-6 h-6 ${meta.color} rounded flex items-center justify-center shrink-0 text-[10px]`}>{meta.icon}</span>}
                  <button type="button" onClick={() => setExpanded(isExpanded ? null : i)}
                    className="flex-1 text-left min-w-0 py-0.5">
                    <span className="truncate text-slate-700 text-sm block">{q.label}</span>
                  </button>
                  <span className="text-[10px] text-slate-400 shrink-0">{TYPE_LABELS[q.type] ?? q.type}</span>
                  <button type="button" onClick={e => { e.stopPropagation(); setExpanded(isExpanded ? null : i) }}
                    className="p-1 text-slate-300 hover:text-sky-500 transition text-xs leading-none shrink-0">✎</button>
                  <button type="button" onClick={e => { e.stopPropagation(); remove(i) }}
                    className="p-1 text-slate-300 hover:text-red-500 transition text-xs leading-none shrink-0">✕</button>
                </div>
                {isExpanded && <div className="px-2.5 pb-2.5" onClick={e => e.stopPropagation()}><QuestionDetail q={q} onUpdate={patch => updateQuestion(i, patch)} /></div>}
              </li>
            )
          })}
        </ul>
      </div>

      {questions.length === 0 && <p className="text-xs text-slate-400 text-center py-4">All questions removed — discard or go back</p>}

      {(design.theme || design.primary_color) && (
        <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-slate-50 text-xs text-slate-600">
          {design.primary_color && <span className="w-4 h-4 rounded-full border border-slate-200 shrink-0" style={{ backgroundColor: design.primary_color }} />}
          <span>Design: {design.theme ?? 'custom'}</span>
        </div>
      )}

      <div className="flex gap-2">
        <button onClick={onDiscard}
          className="flex-1 py-2 border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 transition">
          Discard
        </button>
        <button onClick={() => onApply(questions)} disabled={questions.length === 0}
          className="flex-1 py-2 bg-violet-500 hover:bg-violet-600 disabled:bg-violet-300 text-white text-sm font-semibold rounded-xl transition">
          Apply
        </button>
      </div>
    </div>
  )
}
