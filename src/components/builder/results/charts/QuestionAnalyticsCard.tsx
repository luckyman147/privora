import { useState, Fragment } from 'react'
import type { Question, Response, MatrixColumn } from '@/lib/types'
import { qc, answeredCount } from '../resultsUtils'
import { ChoiceChart, RatingDisplay, TextAnswers, DateAnswers } from './AnswerVisuals'

export function QuestionAnalyticsCard({ question, responses, index }: {
  question: Question; responses: Response[]; index: number
}) {
  const colors  = qc(question.type)
  const count   = answeredCount(responses, question.id)
  const pct     = responses.length ? Math.round((count / responses.length) * 100) : 0
  const isChoice = ['multiple_choice', 'checkboxes', 'dropdown'].includes(question.type)

  return (
    <div className="rounded-2xl overflow-hidden border-2" style={{ borderColor: colors.border }}>
      <div className="px-5 py-3.5 flex items-center justify-between gap-4"
        style={{ background: colors.light, borderBottom: `1.5px solid ${colors.border}` }}>
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ background: colors.accent }}>
            {index + 1}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 leading-snug truncate">{question.label}</p>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: colors.accent + '22', color: colors.accent }}>
              {colors.label}
            </span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-2xl font-black" style={{ color: colors.accent }}>{count}</p>
          <p className="text-[11px] text-slate-400">{pct}% answered</p>
        </div>
      </div>

      <div className="h-1" style={{ background: '#f1f5f9' }}>
        <div className="h-full transition-all duration-700"
          style={{ width: `${pct}%`, background: colors.accent }} />
      </div>

      <div className="p-5 bg-white">
        {isChoice && <ChoiceChart question={question} responses={responses} accent={colors.accent} />}
        {question.type === 'rating' && <RatingDisplay question={question} responses={responses} accent={colors.accent} />}
        {(question.type === 'short_text' || question.type === 'long_text') && (
          <TextAnswers question={question} responses={responses} accent={colors.accent} />
        )}
        {question.type === 'date' && <DateAnswers question={question} responses={responses} accent={colors.accent} />}
        {question.type === 'file_upload' && (
          <p className="text-sm text-slate-400">
            {count} file{count !== 1 ? 's' : ''} uploaded. View in the Responses tab.
          </p>
        )}
        {question.type === 'matrix' && <MatrixTable question={question} responses={responses} accent={colors.accent} />}
      </div>
    </div>
  )
}

function MatrixTable({ question, responses, accent }: {
  question: Question; responses: Response[]; accent: string
}) {
  const rows = question.rows ?? []
  const cols: { name: string; type: string }[] = question.matrix_columns?.length
    ? question.matrix_columns
    : (question.columns?.length ? question.columns.map(c => ({ name: c, type: 'short_answer' })) : [{ name: 'Column 1', type: 'short_answer' }])

  // Aggregate per-cell data
  const cellMap: Record<string, { total: number; nums: number[] }> = {}
  responses.forEach(r => {
    rows.forEach((_, ri) => {
      cols.forEach((_, ci) => {
        const k = `${question.id}_${ri}_${ci}`
        const v = r.answers[k]
        if (v == null) return
        if (!cellMap[k]) cellMap[k] = { total: 0, nums: [] }
        cellMap[k].total++
        const n = Number(v)
        if (!isNaN(n)) cellMap[k].nums.push(n)
      })
    })
  })

  const hasData = Object.keys(cellMap).length > 0
  if (!hasData) return <p className="text-sm text-slate-400">No matrix responses yet.</p>

  const [expanded, setExpanded] = useState(false)

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr>
              <th className="text-left p-1.5 text-slate-500 font-semibold" />
              {cols.map((col, ci) => (
                <th key={ci} className="p-1.5 text-slate-600 font-semibold text-center border-l border-slate-200 min-w-[80px]">
                  {col.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className="border-t border-slate-100">
                <td className="p-1.5 text-slate-600 font-medium text-[11px]">{row}</td>
                {cols.map((col, ci) => {
                  const d = cellMap[`${question.id}_${ri}_${ci}`]
                  return (
                    <td key={ci} className="p-1.5 text-center border-l border-slate-100">
                      {!d ? <span className="text-slate-300">—</span>
                        : col.type === 'rating' && d.nums.length
                          ? <><span className="font-bold" style={{ color: accent }}>{(d.nums.reduce((a, b) => a + b, 0) / d.nums.length).toFixed(1)}</span><span className="text-slate-400 ml-1">avg</span></>
                          : <span className="font-semibold text-slate-700">{d.total}</span>}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={() => setExpanded(v => !v)}
        className="w-full text-xs font-semibold pt-2 pb-1 text-center transition"
        style={{ color: accent }}>
        {expanded ? '▲ Hide details' : `▼ Show all ${responses.length} responses`}
      </button>
      {expanded && responses.map((r, i) => (
        <div key={r.id} className="text-xs text-slate-600 border-t border-slate-100 py-2 px-1 space-y-1">
          <span className="font-semibold text-slate-400">#{i + 1}</span>
          <div className="grid gap-x-3 gap-y-1" style={{ gridTemplateColumns: `auto repeat(${cols.length}, 1fr)` }}>
            <span />
            {cols.map((col, ci) => <span key={ci} className="text-slate-400 font-medium text-[10px]">{col.name}</span>)}
            {rows.map((row, ri) => <Fragment key={ri}>
              <span className="text-slate-500 text-[10px]">{row}</span>
              {cols.map((col, ci) => {
                const v = r.answers[`${question.id}_${ri}_${ci}`]
                return <span key={ci} className="text-slate-700">{v != null ? String(v) : '—'}</span>
              })}
            </Fragment>)}
          </div>
        </div>
      ))}
    </div>
  )
}
