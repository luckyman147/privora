import type { DesignConfig, Question } from '@/lib/types'

interface Props {
  q: Question
  d: DesignConfig
  answers: Record<string, any>
  onAnswer: (key: string, value: any) => void
}

export function DateInput({ q, d, answers, onAnswer }: Props) {
  return (
    <input type="date"
      value={answers[q.id] ?? ''}
      onChange={e => onAnswer(q.id, e.target.value)}
      style={{
        width: '100%', padding: '10px 12px', fontSize: 14,
        border: '1.5px solid #e2e8f0', borderRadius: '6px',
        outline: 'none', background: '#fff', boxSizing: 'border-box',
        fontFamily: d.body_font,
      }}
      onFocus={e => (e.target.style.borderColor = d.primary_color)}
      onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
  )
}
