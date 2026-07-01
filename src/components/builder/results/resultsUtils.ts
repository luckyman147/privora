import type { Question, Response } from '@/lib/types'

export function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  })
}

export function getAnswer(r: Response, qId: string): string {
  const v = r.answers[qId]
  if (v !== undefined && v !== null) {
    if (Array.isArray(v)) return v.join(', ')
    return String(v)
  }
  // Matrix sub-keys: {qId}_{rowIdx}_{colIdx}
  const prefix = qId + '_'
  const parts: string[] = []
  for (const key of Object.keys(r.answers).sort()) {
    if (key.startsWith(prefix)) parts.push(String(r.answers[key]))
  }
  return parts.length ? parts.join(', ') : '—'
}

export function exportCsv(questions: Question[], responses: Response[]) {
  const realQs = questions.filter(q => q.type !== 'section' && q.type !== 'page_break')
  const header = ['#', 'Submitted at', ...realQs.map(q => q.label)]
  const rows = responses.map((r, i) => [
    String(i + 1),
    fmtDate(r.submitted_at),
    ...realQs.map(q => {
      const v = r.answers[q.id]
      if (v === undefined || v === null) return ''
      if (Array.isArray(v)) return v.join('; ')
      return String(v)
    }),
  ])
  const csv = [header, ...rows].map(row =>
    row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
  ).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = 'responses.csv'; a.click()
  URL.revokeObjectURL(url)
}

export function countOptions(responses: Response[], qId: string, options: string[]) {
  const counts: Record<string, number> = {}
  options.forEach(o => (counts[o] = 0))
  responses.forEach(r => {
    const v = r.answers[qId]
    if (Array.isArray(v)) v.forEach(x => { if (x in counts) counts[x]++ })
    else if (typeof v === 'string' && v in counts) counts[v]++
  })
  return counts
}

export function avgRating(responses: Response[], qId: string) {
  const nums = responses.map(r => Number(r.answers[qId])).filter(n => !isNaN(n) && n > 0)
  if (!nums.length) return null
  return (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(1)
}

export function answeredCount(responses: Response[], qId: string) {
  return responses.filter(r => {
    const v = r.answers[qId]
    if (v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && v.length === 0)) return true
    // Matrix sub-keys
    const prefix = qId + '_'
    return Object.keys(r.answers).some(k => k.startsWith(prefix))
  }).length
}

export const Q_COLOR: Record<string, { accent: string; light: string; border: string; label: string }> = {
  short_text:      { accent: '#0ea5e9', light: '#f0f9ff', border: '#bae6fd', label: 'Short text' },
  long_text:       { accent: '#0ea5e9', light: '#f0f9ff', border: '#bae6fd', label: 'Long text' },
  multiple_choice: { accent: '#7c3aed', light: '#faf5ff', border: '#ddd6fe', label: 'Multiple choice' },
  checkboxes:      { accent: '#7c3aed', light: '#faf5ff', border: '#ddd6fe', label: 'Checkboxes' },
  dropdown:        { accent: '#6366f1', light: '#eef2ff', border: '#c7d2fe', label: 'Dropdown' },
  rating:          { accent: '#f59e0b', light: '#fffbeb', border: '#fde68a', label: 'Rating' },
  matrix:          { accent: '#f97316', light: '#fff7ed', border: '#fed7aa', label: 'Matrix' },
  date:            { accent: '#22c55e', light: '#f0fdf4', border: '#bbf7d0', label: 'Date' },
  file_upload:     { accent: '#ec4899', light: '#fdf2f8', border: '#fbcfe8', label: 'File upload' },
}

const fallbackColor = { accent: '#64748b', light: '#f8fafc', border: '#e2e8f0', label: 'Question' }
export const qc = (type: string) => Q_COLOR[type] ?? fallbackColor
