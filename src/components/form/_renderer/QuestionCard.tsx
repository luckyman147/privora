import type { ReactNode } from 'react'
import type { DesignConfig, Question } from '@/lib/types'
import { CARD_RADIUS } from '@/components/form/design'

interface Props {
  q: Question
  index: number
  d: DesignConfig
  children: ReactNode
}

export function QuestionCard({ q, index, d, children }: Props) {
  const layout = d.question_layout ?? 'cards'
  const r = CARD_RADIUS[d.corner_radius]

  const cardStyle: React.CSSProperties =
    layout === 'shared'
      ? { padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }
      : layout === 'minimal'
        ? { padding: '8px 0' }
        : { padding: '20px 24px', backgroundColor: '#fff', borderRadius: r,
            boxShadow: '0 1px 4px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)' }

  return (
    <div style={cardStyle}>
      <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 12, fontFamily: d.body_font }}>
        {index + 1}. {q.label}
        {q.required && <span style={{ color: '#f87171', marginLeft: 4 }}>*</span>}
      </label>
      {q.description && (
        <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 10, marginTop: -6 }}>{q.description}</p>
      )}
      {children}
    </div>
  )
}
