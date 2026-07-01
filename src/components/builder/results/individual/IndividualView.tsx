'use client'
import { useState } from 'react'
import type { Form, Response } from '@/lib/types'
import { fmtDate, getAnswer, qc } from '../resultsUtils'
import { MatrixAnswer } from './MatrixAnswer'
import { FileAnswer } from './FileAnswer'

export function IndividualView({ form, responses, focusId }: { form: Form; responses: Response[]; focusId?: string }) {
  const [idx, setIdx] = useState(() => {
    if (!focusId) return 0
    const i = responses.findIndex(r => r.id === focusId)
    return i >= 0 ? i : 0
  })
  const realQs = form.questions.filter(q => q.type !== 'section' && q.type !== 'page_break')
  const r = responses[idx]

  if (!responses.length) return (
    <div className="flex items-center justify-center h-full">
      <p className="text-slate-400 text-sm">No responses yet.</p>
    </div>
  )

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex-1 p-6 space-y-5 overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Individual responses</h2>
            <p className="text-sm text-slate-400 mt-0.5">{fmtDate(r.submitted_at)}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setIdx(i => i - 1)} disabled={idx === 0}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition">
              ← Prev
            </button>
            <span className="text-sm font-semibold text-slate-500 tabular-nums">
              {idx + 1} / {responses.length}
            </span>
            <button onClick={() => setIdx(i => i + 1)} disabled={idx === responses.length - 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition">
              Next →
            </button>
          </div>
        </div>

        <div className="max-w-5xl space-y-3">
          {realQs.map((q, i) => {
            const c = qc(q.type)
            const answer = getAnswer(r, q.id)
            return (
              <div key={q.id} className="bg-white rounded-2xl border border-slate-200 p-4">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[11px] font-bold shrink-0 mt-0.5"
                    style={{ background: c.accent }}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <p className="text-sm font-semibold text-slate-800">{q.label}</p>
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                        style={{ background: c.light, color: c.accent }}>
                        {c.label}
                      </span>
                    </div>
                    {q.type === 'matrix'
                      ? <MatrixAnswer q={q} r={r} />
                      : q.type === 'file_upload'
                        ? <FileAnswer answers={r.answers[q.id]} />
                        : <p className="text-sm text-slate-600 break-words leading-relaxed">
                            {answer === '—'
                              ? <span className="text-slate-300 italic">No answer</span>
                              : answer}
                          </p>
                    }
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <aside className="w-56 shrink-0 border-l border-slate-200 bg-white overflow-y-auto p-4">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-3">
          All responses
        </p>
        <div className="space-y-1">
          {responses.map((resp, i) => (
            <button key={resp.id} onClick={() => setIdx(i)}
              className={`w-full text-left px-3 py-2.5 rounded-xl transition ${
                i === idx
                  ? 'bg-violet-50 border border-violet-200'
                  : 'hover:bg-slate-50 border border-transparent'
              }`}>
              <p className={`text-xs font-semibold ${i === idx ? 'text-violet-700' : 'text-slate-700'}`}>
                Response #{responses.length - i}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">{fmtDate(resp.submitted_at)}</p>
            </button>
          ))}
        </div>
      </aside>
    </div>
  )
}
