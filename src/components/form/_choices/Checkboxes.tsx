import type { DesignConfig, Question } from '@/lib/types'

interface Props {
  q: Question
  d: DesignConfig
  answers: Record<string, any>
  onAnswer: (key: string, value: any) => void
}

export function Checkboxes({ q, d, answers, onAnswer }: Props) {
  return (
    <>
      {q.options?.map(opt => (
        <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', fontSize: 14, color: '#334155', cursor: 'pointer' }}>
          <input type="checkbox" value={opt}
            onChange={e => {
              const cur = (answers[q.id] as string[]) ?? []
              const next = e.target.checked ? [...cur, opt] : cur.filter(v => v !== opt)
              onAnswer(q.id, next)
            }}
            style={{ accentColor: d.primary_color, width: 16, height: 16 }} />
          {opt}
        </label>
      ))}
    </>
  )
}
