'use client'
import type { Question } from '@/lib/types'

interface Props {
  questions: Question[]
  activeIdx: number
  onSelect: (idx: number) => void
  onAdd: () => void
  mode: string
  title: string
}

export function QuestionCanvas({ questions, activeIdx, onSelect, onAdd, mode, title }: Props) {
  return (
    <div className="flex-1 bg-slate-50 overflow-y-auto px-8 py-6">
      {!questions.length ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 text-2xl">📝</div>
          <p className="text-sm text-slate-500">Click a question type on the left to add your first question</p>
        </div>
      ) : (
        <div className="space-y-4 max-w-2xl mx-auto">
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-2">
            {mode === 'election' ? '🗳 Election Mode' : '📋 Survey Mode'} · {questions.length} questions
          </div>
          {questions.map((q, idx) => (
            <div key={q.id}
              onClick={() => onSelect(idx)}
              className={`bg-white rounded-xl border-2 p-5 cursor-pointer transition ${activeIdx === idx ? 'border-sky-300 shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-slate-400">{idx + 1}.</span>
                <span className="px-2 py-0.5 text-[10px] font-bold text-slate-500 bg-slate-100 rounded uppercase tracking-wide">{q.type.replace('_', ' ')}</span>
                {q.required && <span className="text-[10px] font-bold text-red-400">REQUIRED</span>}
              </div>
              <p className="text-sm font-semibold text-slate-900">{q.label}</p>
            </div>
          ))}
          <button onClick={onAdd}
            className="w-full py-3 text-sm font-medium text-slate-400 border-2 border-dashed border-slate-200 rounded-xl hover:border-sky-300 hover:text-sky-500 transition">
            + Add question
          </button>
        </div>
      )}
    </div>
  )
}
