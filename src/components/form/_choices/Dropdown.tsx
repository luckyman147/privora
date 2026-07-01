import type { DesignConfig, Question } from '@/lib/types'

interface Props {
  q: Question
  d: DesignConfig
  onAnswer: (key: string, value: any) => void
}

export function Dropdown({ q, d, onAnswer }: Props) {
  return (
    <select onChange={e => onAnswer(q.id, e.target.value)}
      style={{
        width: '100%', padding: '10px 12px', fontSize: 14,
        border: '1.5px solid #e2e8f0', borderRadius: '6px',
        outline: 'none', background: '#fff', boxSizing: 'border-box',
        fontFamily: d.body_font,
      }}
      onFocus={e => (e.target.style.borderColor = d.primary_color)}
      onBlur={e => (e.target.style.borderColor = '#e2e8f0')}>
      <option value="">Select…</option>
      {q.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  )
}
