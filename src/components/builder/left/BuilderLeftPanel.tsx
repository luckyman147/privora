'use client'
import { useState } from 'react'
import { SIDEBAR_TYPES, TYPE_META } from '../meta'
import { TemplateTab } from './TemplateTab'
import type { QuestionType, Question } from '@/lib/types'

const QUICK_ADD = [
  { label: 'Add Welcome screen', key: 'welcome', shortcut: null },
  { label: 'Add Section',        key: 'section', shortcut: 'Alt+S' },
  { label: 'Add Page Break',     key: 'page_break', shortcut: null },
]

interface Props {
  style?:           React.CSSProperties
  onAddQuestion:    (type: QuestionType) => void
  onApplyTemplate:  (questions: Omit<Question, 'id'>[]) => void
  currentQuestions?: Question[]
}

export function BuilderLeftPanel({ style, onAddQuestion, onApplyTemplate, currentQuestions = [] }: Props) {
  const [tab, setTab] = useState(0)

  return (
    <aside className="border-r border-slate-200 bg-white flex flex-col shrink-0 overflow-hidden" style={style}>
      <div className="flex border-b border-slate-200 px-4 pt-3 gap-4 shrink-0">
        {['Add question', 'Templates', '✦ AI'].map((t, i) => (
          <button key={t} onClick={() => setTab(i)}
            className={`pb-3 text-sm font-semibold border-b-2 -mb-px transition whitespace-nowrap ${tab === i ? 'text-sky-600 border-sky-500' : 'text-slate-500 border-transparent hover:text-slate-700'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {tab === 0 && (
          <div className="p-4 space-y-5">
            <div className="grid grid-cols-2 gap-1">
              {SIDEBAR_TYPES.map(type => {
                const meta = TYPE_META[type]
                return (
                  <button key={type} onClick={() => onAddQuestion(type)}
                    className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition border border-transparent hover:border-slate-200 text-left">
                    <span className={`w-7 h-7 ${meta.color} rounded-md flex items-center justify-center shrink-0`}>{meta.icon}</span>
                    <span className="text-xs font-medium truncate">{meta.label}</span>
                  </button>
                )
              })}
            </div>

            <div className="border-t border-slate-100" />

            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Quick add</p>
              <div className="space-y-0.5">
                {QUICK_ADD.map(item => (
                  <button key={item.key}
                    onClick={() => onAddQuestion(item.key as QuestionType)}
                    className="w-full flex items-center justify-between px-2 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition text-left">
                    <span className="flex items-center gap-2">
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-slate-300 shrink-0">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                      {item.label}
                    </span>
                    {item.shortcut && <span className="text-[10px] text-slate-300">{item.shortcut}</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 1 && (
          <TemplateTab currentQuestions={currentQuestions} onApplyTemplate={onApplyTemplate} />
        )}

        {tab === 2 && (
          <div className="p-6 flex flex-col items-center text-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center text-2xl">✦</div>
            <div>
              <p className="text-sm font-semibold text-slate-900 mb-1">AI Form Generator</p>
              <p className="text-xs text-slate-500">Describe what you want to survey and we&apos;ll build it for you.</p>
            </div>
            <textarea placeholder="e.g. A 5-question satisfaction survey for a university course…" rows={4}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-violet-400 resize-none" />
            <button className="w-full py-2.5 bg-violet-500 hover:bg-violet-600 text-white text-sm font-semibold rounded-xl transition">
              Generate form
            </button>
            <p className="text-[10px] text-slate-400">AI generation coming soon — stay tuned.</p>
          </div>
        )}
      </div>
    </aside>
  )
}
