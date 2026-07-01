import { BTN_RADIUS } from '../design'
import type { DesignConfig, Question } from '@/lib/types'

interface Props {
  q: Question
  d: DesignConfig
  answers: Record<string, any>
  onAnswer: (key: string, value: any) => void
}

export function Rating({ q, d, answers, onAnswer }: Props) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {Array.from({ length: q.max_rating ?? 5 }).map((_, v) => {
        const active = answers[q.id] === v + 1
        return (
          <button key={v} type="button"
            onClick={() => onAnswer(q.id, v + 1)}
            style={{
              flex: '1 1 0', minWidth: 36, height: 40,
              fontSize: 14, fontWeight: 700,
              borderRadius: BTN_RADIUS[d.button_shape],
              border: `2px solid ${active ? d.primary_color : '#e2e8f0'}`,
              background: active ? d.primary_color : '#fff',
              color: active ? '#fff' : '#64748b',
              cursor: 'pointer', transition: 'all 0.15s',
            }}>
            {v + 1}
          </button>
        )
      })}
    </div>
  )
}
