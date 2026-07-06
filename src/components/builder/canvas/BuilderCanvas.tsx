'use client'
import { useState } from 'react'
import { TYPE_META, SIDEBAR_TYPES } from '../meta'
import type { QuestionType } from '@/lib/types'
import { SectionCard, PageBreakCard, QuestionCard } from './_cards'

function FormHeader({ title, description, onTitleChange, onDescChange }: {
  title: string; description?: string
  onTitleChange: (v: string) => void; onDescChange: (v: string) => void
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-3">
      <input type="text" value={title} onChange={e => onTitleChange(e.target.value)}
        placeholder="Form title"
        className="w-full text-2xl font-bold text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-300 mb-2" />
      <textarea value={description ?? ''} onChange={e => onDescChange(e.target.value)}
        placeholder="Add a description (optional)…" rows={2}
        className="w-full text-sm text-slate-500 bg-transparent focus:outline-none resize-none placeholder:text-slate-300 leading-relaxed" />
    </div>
  )
}

function WelcomeCard({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 px-5 py-4 flex items-center gap-4 shadow-sm mb-3">
      <span className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" /></svg>
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900">Welcome Screen</p>
        <p className="text-xs text-slate-400 mt-0.5">Introduce your survey and build trust</p>
      </div>
      <button onClick={onToggle}
        className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition shrink-0 ${enabled ? 'text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100' : 'text-slate-400 bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
        {enabled ? 'Enabled' : 'Disabled'}
      </button>
    </div>
  )
}

function QuickAddToolbar({ onAdd }: { onAdd: (t: QuestionType) => void }) {
  return (
    <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-md">
      {SIDEBAR_TYPES.map(type => (
        <button key={type} onClick={() => onAdd(type)} title={TYPE_META[type].label}
          className={`w-8 h-8 ${TYPE_META[type].color} rounded-lg flex items-center justify-center hover:opacity-75 transition`}>
          {TYPE_META[type].icon}
        </button>
      ))}
    </div>
  )
}

function PageBreakSlot({ index, onAdd }: { index: number; onAdd: (afterIndex: number) => void }) {
  const [hover, setHover] = useState(false)
  return (
    <div className="mb-3 flex items-center justify-center" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      {hover ? (
        <button onClick={() => onAdd(index)}
          className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-white border border-slate-300 rounded-full px-3 py-1 shadow-sm hover:border-sky-400 hover:text-sky-600 transition-all">
          + Page break
        </button>
      ) : (
        <div className="h-3 w-full" />
      )}
    </div>
  )
}

export interface DragHandlers {
  isDragging:  boolean; isDragOver:  boolean
  onDragStart: (e: React.DragEvent) => void; onDragEnd: () => void
  onDragOver:  (e: React.DragEvent) => void; onDrop: () => void
}

interface Props {
  title: string; description?: string; questions: import('@/lib/types').Question[]
  selectedId: string | null
  onTitleChange: (v: string) => void; onDescChange: (v: string) => void
  onSelect: (id: string) => void; onAdd: (type: QuestionType) => void; onDelete: (id: string) => void
  onCopy: (id: string) => void; onMove: (id: string, dir: -1 | 1) => void
  onReorder: (questions: import('@/lib/types').Question[]) => void
  onUpdate: (id: string, patch: Partial<import('@/lib/types').Question>) => void
  onAddPageBreakAt?: (afterIndex: number) => void
}

export function BuilderCanvas({ title, description, questions, selectedId, onTitleChange, onDescChange, onSelect, onAdd, onDelete, onCopy, onMove, onReorder, onUpdate, onAddPageBreakAt }: Props) {
  const [welcomeEnabled, setWelcomeEnabled] = useState(true)
  const [dragId, setDragId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)
  let displayIndex = 0

  function makeDragHandlers(id: string): DragHandlers {
    return {
      isDragging: dragId === id, isDragOver: dragOverId === id,
      onDragStart: (e) => { e.dataTransfer.effectAllowed = 'move'; setTimeout(() => setDragId(id), 0) },
      onDragEnd: () => { setDragId(null); setDragOverId(null) },
      onDragOver: (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setDragOverId(id) },
      onDrop: () => {
        if (!dragId || dragId === id) { setDragId(null); setDragOverId(null); return }
        const qs = [...questions]; const from = qs.findIndex(q => q.id === dragId); const to = qs.findIndex(q => q.id === id)
        if (from === -1 || to === -1) return; const [item] = qs.splice(from, 1); qs.splice(to, 0, item)
        onReorder(qs); setDragId(null); setDragOverId(null)
      },
    }
  }

  return (
    <main className="flex-1 bg-slate-50 overflow-y-auto flex flex-col">
      <div className="flex-1 max-w-2xl mx-auto w-full py-8 px-6">
        <FormHeader title={title} description={description} onTitleChange={onTitleChange} onDescChange={onDescChange} />
        <WelcomeCard enabled={welcomeEnabled} onToggle={() => setWelcomeEnabled(v => !v)} />
        {questions.map((q, i) => {
          const drag = makeDragHandlers(q.id)
          const element = q.type === 'page_break'
            ? <PageBreakCard drag={drag} selected={selectedId === q.id} onSelect={() => onSelect(q.id)} onDelete={() => onDelete(q.id)} />
            : q.type === 'section'
            ? <SectionCard drag={drag} question={q} selected={selectedId === q.id} onSelect={() => onSelect(q.id)} onDelete={() => onDelete(q.id)} onUpdate={patch => onUpdate(q.id, patch)} />
            : (() => { const idx = displayIndex++; return <QuestionCard drag={drag} question={q} index={idx} selected={selectedId === q.id} allQuestions={questions} onSelect={() => onSelect(q.id)} onDelete={() => onDelete(q.id)} onCopy={() => onCopy(q.id)} onMoveUp={() => onMove(q.id, -1)} onMoveDown={() => onMove(q.id, 1)} onUpdate={patch => onUpdate(q.id, patch)} /> })()
          return (
            <div key={q.id}>
              {i > 0 && onAddPageBreakAt && <PageBreakSlot index={i - 1} onAdd={onAddPageBreakAt} />}
              <div className="mb-3">{element}</div>
            </div>
          )
        })}
        {questions.length > 0 && onAddPageBreakAt && <PageBreakSlot index={questions.length - 1} onAdd={onAddPageBreakAt} />}
        <button onClick={() => onAdd('short_text')}
          className="w-full py-5 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-sky-400 hover:text-sky-500 hover:bg-sky-50/50 transition flex flex-col items-center gap-1">
          <span className="text-sm font-semibold">+ Add question</span>
          <span className="text-xs">or use the quick-add bar below</span>
        </button>
      </div>
      <div className="sticky bottom-0 pb-5 pt-3 flex justify-center bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent pointer-events-none">
        <div className="pointer-events-auto"><QuickAddToolbar onAdd={onAdd} /></div>
      </div>
    </main>
  )
}
