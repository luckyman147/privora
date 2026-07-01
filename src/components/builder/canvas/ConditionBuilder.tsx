'use client'
import type { Question, LogicCondition, LogicGroup, ConditionalLogic, LogicOperator } from '@/lib/types'

function OPTS_FOR_TYPE(t: string): { value: LogicOperator; label: string }[] {
  if (t === 'multiple_choice' || t === 'dropdown') return [{ value:'equals',label:'=' },{ value:'not_equals',label:'≠' }]
  if (t === 'checkboxes') return [{ value:'equals',label:'=' },{ value:'not_equals',label:'≠' },{ value:'is_any_of',label:'any of' },{ value:'is_none_of',label:'none of' }]
  if (t === 'rating') return [{ value:'equals',label:'=' },{ value:'not_equals',label:'≠' },{ value:'greater_than',label:'>' },{ value:'less_than',label:'<' }]
  if (t === 'date') return [{ value:'equals',label:'=' },{ value:'not_equals',label:'≠' },{ value:'before',label:'before' },{ value:'after',label:'after' }]
  return [{ value:'equals',label:'=' },{ value:'not_equals',label:'≠' },{ value:'contains',label:'contains' },{ value:'not_contains',label:'not contains' },{ value:'starts_with',label:'starts with' },{ value:'ends_with',label:'ends with' }]
}

function emptyGroup(): LogicGroup { return { conditions: [{ question_id: '', operator: 'equals', value: '' }], match: 'all' } }

function emptyLogic(): ConditionalLogic { return { groups: [emptyGroup()], match: 'all' } }

function ValueInput({ qType, operator, value, questionId, allQuestions, onChange }: {
  qType: string; operator: string; value: string | string[]; questionId: string; allQuestions: Question[]; onChange: (v: string | string[]) => void
}) {
  const src = allQuestions.find(q => q.id === questionId)
  const isMulti = operator === 'is_any_of' || operator === 'is_none_of'
  if (src?.options?.length && !isMulti) return (
    <select value={String(value)} onChange={e => onChange(e.target.value)} className="flex-1 min-w-0 px-2 py-1 border border-slate-200 rounded text-[10px] bg-white focus:outline-none focus:border-violet-400">
      <option value="">Select…</option>
      {src.options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  )
  if (src?.options?.length && isMulti) return (
    <div className="flex-1 min-w-0 flex flex-wrap gap-1">
      {src.options.map(o => {
        const arr = Array.isArray(value) ? value : []
        const on = arr.includes(o)
        return <button key={o} onClick={() => onChange(on ? arr.filter(x => x !== o) : [...arr, o])}
          className={`text-[10px] px-1.5 py-0.5 rounded border transition ${on ? 'bg-violet-100 border-violet-300 text-violet-700' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}>{o}</button>
      })}
    </div>
  )
  if (qType === 'rating') return (
    <select value={String(value)} onChange={e => onChange(e.target.value)} className="w-20 shrink-0 px-1.5 py-1 border border-slate-200 rounded text-[10px] bg-white focus:outline-none focus:border-violet-400">
      {Array.from({ length: src?.max_rating ?? 5 }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
    </select>
  )
  if (qType === 'date') return <input type="date" value={String(value)} onChange={e => onChange(e.target.value)} className="flex-1 min-w-0 px-2 py-1 border border-slate-200 rounded text-[10px] bg-white focus:outline-none focus:border-violet-400" />
  return <input value={String(value)} onChange={e => onChange(e.target.value)} placeholder="Value…" className="flex-1 min-w-0 px-2 py-1 border border-slate-200 rounded text-[10px] bg-white focus:outline-none focus:border-violet-400" />
}

export function LogicSection({ question, questionIndex, allQuestions, onUpdate }: {
  question: Question; questionIndex: number; allQuestions: Question[]; onUpdate: (patch: Partial<Question>) => void
}) {
  const logic = questionIndex === 0 ? undefined : question.logic
  const sources = allQuestions.slice(0, questionIndex).filter(q => q.type !== 'section' && q.type !== 'page_break')
  return (
    <div className="space-y-3">
      {questionIndex !== 0 && <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-700">Enable conditional logic</span>
        <button onClick={() => onUpdate({ logic: logic ? undefined : emptyLogic() })}
          className={`w-11 h-6 rounded-full transition-colors shrink-0 relative ${logic ? 'bg-violet-500' : 'bg-slate-200'}`}>
          <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${logic ? 'left-6' : 'left-1'}`} />
        </button>
      </div>}
      {logic && (logic.groups ?? [emptyGroup()]).map((g, i) => (
        <div key={i} className="border border-slate-200 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Group {i + 1}</span>
            <div className="flex items-center gap-2">
              <select value={g.match} onChange={e => onUpdate({ logic: { ...logic, groups: (logic.groups ?? []).map((x, j) => j === i ? { ...g, match: e.target.value as 'all' | 'any' } : x) } })}
                className="text-[10px] border border-slate-200 rounded px-1.5 py-0.5 bg-white focus:outline-none font-medium">
                <option value="all">AND</option><option value="any">OR</option>
              </select>
              {(logic.groups?.length ?? 0) > 1 && (
                <button onClick={() => onUpdate({ logic: { ...logic, groups: (logic.groups ?? []).filter((_, k) => k !== i) } })}
                  className="text-slate-400 hover:text-red-500 transition p-0.5">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </button>
              )}
            </div>
          </div>
          {g.conditions.map((c, j) => {
            const srcType = sources.find(s => s.id === c.question_id)?.type ?? 'short_text'
            const updC = (delta: Partial<LogicCondition>) => onUpdate({ logic: { ...logic, groups: (logic.groups ?? []).map((x, k) => k === i ? { ...g, conditions: g.conditions.map((y, l) => l === j ? { ...y, ...delta } : y) } : x) } })
            return (
              <div key={j} className="flex items-center gap-1.5">
                <select value={c.question_id} onChange={e => updC({ question_id: e.target.value, operator: 'equals', value: '' })}
                  className="flex-1 min-w-0 px-2 py-1 border border-slate-200 rounded text-[10px] bg-white focus:outline-none focus:border-violet-400">
                  <option value="">Select question…</option>
                  {sources.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
                {c.question_id && (
                  <>
                    <select value={c.operator} onChange={e => updC({ operator: e.target.value as LogicOperator, value: '' })}
                      className="w-20 shrink-0 px-1.5 py-1 border border-slate-200 rounded text-[10px] bg-white focus:outline-none focus:border-violet-400">
                      {OPTS_FOR_TYPE(srcType).map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    <ValueInput qType={srcType} operator={c.operator} value={c.value} questionId={c.question_id} allQuestions={allQuestions} onChange={v => updC({ value: v })} />
                    <button onClick={() => { const cs = g.conditions.filter((_, k) => k !== j); onUpdate({ logic: { ...logic, groups: (logic.groups ?? []).map((x, k) => k === i ? { ...g, conditions: cs.length ? cs : [{ question_id: '', operator: 'equals', value: '' }] } : x) } }) }}
                      className="text-slate-400 hover:text-red-500 transition p-0.5 shrink-0">
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </button>
                  </>
                )}
              </div>
            )
          })}
          <button onClick={() => onUpdate({ logic: { ...logic, groups: (logic.groups ?? []).map((x, k) => k === i ? { ...g, conditions: [...g.conditions, { question_id: '', operator: 'equals', value: '' }] } : x) } })}
            className="text-[10px] font-semibold text-violet-500 hover:text-violet-600 transition">+ Add condition</button>
        </div>
      ))}
      {logic && <button onClick={() => onUpdate({ logic: { ...logic, groups: [...(logic.groups ?? []), emptyGroup()] } })}
        className="text-xs font-semibold text-violet-500 hover:text-violet-600 transition flex items-center gap-1">
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
        Add OR group
      </button>}
    </div>
  )
}
