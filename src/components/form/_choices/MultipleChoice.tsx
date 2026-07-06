import type { DesignConfig, Question } from '@/lib/types'

interface Props {
  q: Question
  d: DesignConfig
  answers: Record<string, any>
  onAnswer: (key: string, value: any) => void
}

export function MultipleChoice({ q, d, answers, onAnswer }: Props) {
  return (
    <>
      {q.options?.map(opt => (
        <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', fontSize: 14, color: '#334155', cursor: 'pointer' }}>
          <input type="radio" name={q.id} value={opt}
            checked={answers[q.id] === opt}
            onChange={e => onAnswer(q.id, e.target.value)}
            style={{ accentColor: d.primary_color, width: 16, height: 16 }} />
          {opt}
        </label>
      ))}
    </>
  )
}
