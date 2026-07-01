import type { DesignConfig } from '@/lib/types'

const KEY_NAME = '__identity_name'
const KEY_EMAIL = '__identity_email'

interface Props {
  identity: 'anonymous' | 'optional' | 'required'
  answers: Record<string, any>
  d: DesignConfig
  onAnswer: (key: string, value: any) => void
}

export function IdentityFields({ identity, answers, d, onAnswer }: Props) {
  if (identity === 'anonymous') return null

  return (
    <div style={{
      padding: '20px 24px', backgroundColor: '#fff',
      borderRadius: '6px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
      fontFamily: d.body_font,
    }}>
      <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 12 }}>
        Your information
        {identity === 'required' && <span style={{ color: '#f87171', marginLeft: 4 }}>*</span>}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input placeholder={`Name${identity === 'required' ? ' *' : ''}`}
          value={answers[KEY_NAME] ?? ''}
          onChange={e => onAnswer(KEY_NAME, e.target.value)}
          style={{
            width: '100%', padding: '10px 12px', fontSize: 14,
            border: '1.5px solid #e2e8f0', borderRadius: '6px',
            outline: 'none', background: '#fff', boxSizing: 'border-box',
            fontFamily: d.body_font,
          }}
          onFocus={e => (e.target.style.borderColor = d.primary_color)}
          onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
        <input type="email" placeholder={`Email${identity === 'required' ? ' *' : ''}`}
          value={answers[KEY_EMAIL] ?? ''}
          onChange={e => onAnswer(KEY_EMAIL, e.target.value)}
          style={{
            width: '100%', padding: '10px 12px', fontSize: 14,
            border: '1.5px solid #e2e8f0', borderRadius: '6px',
            outline: 'none', background: '#fff', boxSizing: 'border-box',
            fontFamily: d.body_font,
          }}
          onFocus={e => (e.target.style.borderColor = d.primary_color)}
          onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
      </div>
    </div>
  )
}

export { KEY_NAME, KEY_EMAIL }
