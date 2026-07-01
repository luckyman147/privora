import { BTN_RADIUS, hexToRgba } from '../design'
import type { DesignConfig, Question, MatrixColumn } from '@/lib/types'

interface Props {
  q: Question
  d: DesignConfig
  answers: Record<string, any>
  onAnswer: (key: string, value: any) => void
}

export function MatrixQuestion({ q, d, answers, onAnswer }: Props) {
  const rows: string[] = q.rows?.length ? q.rows : ['Row 1', 'Row 2']
  const matCols: MatrixColumn[] = q.matrix_columns?.length
    ? q.matrix_columns
    : (q.columns?.length ? q.columns : ['Column 1']).map((c: string) => ({ name: c, type: 'short_answer' as const }))

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', fontSize: 13, borderCollapse: 'separate', borderSpacing: 0 }}>
        <thead>
          <tr style={{ background: hexToRgba(d.primary_color, 0.06) }}>
            <th style={{ textAlign: 'left', padding: '8px 12px', color: '#64748b', fontWeight: 600, minWidth: 120 }} />
            {matCols.map((col, ci) => (
              <th key={ci} style={{ textAlign: 'center', padding: '8px 12px', color: '#334155', fontWeight: 600, fontSize: 12, borderLeft: '1px solid #f1f5f9' }}>
                {col.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} style={{ background: ri % 2 === 0 ? '#fff' : hexToRgba(d.background_color, 0.5) }}>
              <td style={{ padding: '8px 12px', fontSize: 12, fontWeight: 600, color: '#334155', borderTop: '1px solid #f1f5f9' }}>{row}</td>
              {matCols.map((col, ci) => {
                const key = `${q.id}_${ri}_${ci}`
                return (
                  <td key={ci} style={{ textAlign: 'center', padding: '8px 12px', borderLeft: '1px solid #f1f5f9', borderTop: '1px solid #f1f5f9' }}>
                    {col.type === 'short_answer' && (
                      <input type="text" onChange={e => onAnswer(key, e.target.value)}
                        style={{ width: '100%', maxWidth: 110, padding: '4px 8px', fontSize: 12, border: '1px solid #e2e8f0', borderRadius: 6, outline: 'none' }}
                        onFocus={e => (e.target.style.borderColor = d.primary_color)}
                        onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
                    )}
                    {col.type === 'rating' && (
                      <div style={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
                        {[1, 2, 3, 4, 5].map(v => {
                          const active = answers[key] === v
                          return (
                            <button key={v} type="button" onClick={() => onAnswer(key, v)}
                              style={{ flex: '1 1 0', minWidth: 20, height: 24, fontSize: 11, fontWeight: 700, borderRadius: BTN_RADIUS[d.button_shape], border: `1.5px solid ${active ? d.primary_color : '#e2e8f0'}`, background: active ? d.primary_color : '#fff', color: active ? '#fff' : '#94a3b8', cursor: 'pointer' }}>
                              {v}
                            </button>
                          )
                        })}
                      </div>
                    )}
                    {col.type === 'checkbox' && (
                      <input type="checkbox" onChange={e => onAnswer(key, e.target.checked)}
                        style={{ width: 16, height: 16, accentColor: d.primary_color }} />
                    )}
                    {col.type === 'date' && (
                      <input type="date" onChange={e => onAnswer(key, e.target.value)}
                        style={{ fontSize: 11, padding: '3px 6px', border: '1px solid #e2e8f0', borderRadius: 6, outline: 'none' }}
                        onFocus={e => (e.target.style.borderColor = d.primary_color)}
                        onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
                    )}
                    {col.type === 'choice' && (
                      <input type="radio" name={`${q.id}_${ri}`}
                        onChange={() => onAnswer(`${q.id}_${ri}`, ci)}
                        style={{ width: 16, height: 16, accentColor: d.primary_color }} />
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
