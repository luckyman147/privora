import type { Question, ConditionalLogic } from './types'

function getAnswer(answers: Record<string, any>, qId: string): any {
  for (const [k, v] of Object.entries(answers)) {
    if (k === qId) return v
    if (k.startsWith(qId + '_')) return v
  }
  return undefined
}

function evalCondition(q: Question, answers: Record<string, any>, condition: { question_id: string; operator: string; value: string | string[] }): boolean {
  const val = getAnswer(answers, condition.question_id)
  if (val == null || val === '') return false

  const raw = condition.value
  const target = Array.isArray(raw) ? raw : [raw]

  switch (condition.operator) {
    case 'equals':     return String(val) === target[0]
    case 'not_equals': return String(val) !== target[0]
    case 'contains':   return String(val).toLowerCase().includes(target[0].toLowerCase())
    case 'not_contains': return !String(val).toLowerCase().includes(target[0].toLowerCase())
    case 'starts_with': return String(val).toLowerCase().startsWith(target[0].toLowerCase())
    case 'ends_with':   return String(val).toLowerCase().endsWith(target[0].toLowerCase())
    case 'greater_than': return Number(val) > Number(target[0])
    case 'less_than':    return Number(val) < Number(target[0])
    case 'is_any_of':    return target.includes(String(val))
    case 'is_none_of':   return !target.includes(String(val))
    case 'before':       return new Date(String(val)).getTime() < new Date(target[0]).getTime()
    case 'after':        return new Date(String(val)).getTime() > new Date(target[0]).getTime()
    default: return false
  }
}

function evalGroup(questions: Question[], answers: Record<string, any>, group: { conditions: { question_id: string; operator: string; value: string | string[] }[]; match: 'all' | 'any' }): boolean {
  if (!group.conditions.length) return true
  const results = group.conditions.map(c => {
    const src = questions.find(q => q.id === c.question_id)
    if (!src) return false
    return evalCondition(src, answers, c)
  })
  return group.match === 'all' ? results.every(Boolean) : results.some(Boolean)
}

export function isQuestionVisible(q: Question, answers: Record<string, any>, allQuestions: Question[]): boolean {
  if (!q.logic || !q.logic.groups?.length) return true
  if (!q.logic.groups.some(g => g.conditions.length)) return true
  const results = q.logic.groups.map(g => evalGroup(allQuestions, answers, g))
  return q.logic.match === 'all' ? results.every(Boolean) : results.some(Boolean)
}
