import { BTN_FONT_SIZE, BTN_PADDING, BTN_RADIUS, hexToRgba } from '../design'
import type { DesignConfig } from '@/lib/types'

interface Props {
  d: DesignConfig
  currentPage: number
  totalPages: number
  submitting: boolean
  uploading: boolean
  onBack: () => void
  onNext: () => void
  onSubmit: () => void
}

export function FormNav({ d, currentPage, totalPages, submitting, uploading, onBack, onNext, onSubmit }: Props) {
  const isLastPage = currentPage >= totalPages - 1
  const disabled = submitting || uploading

  const btnColor = d.button_color || d.primary_color
  const btnBase: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flex: 1,
    padding: BTN_PADDING[d.button_size],
    fontSize: BTN_FONT_SIZE[d.button_size],
    fontWeight: 700, fontFamily: d.body_font,
    borderRadius: BTN_RADIUS[d.button_shape],
  }

  return (
    <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
      {currentPage > 0 && d.back_button_style !== 'hidden' && (
        <button type="button" onClick={onBack}
          style={{
            ...btnBase, flex: undefined, cursor: 'pointer',
            ...(d.back_button_style === 'solid'
              ? { background: btnColor, color: '#fff', border: 'none' }
              : d.back_button_style === 'text'
              ? { background: 'transparent', color: btnColor, border: 'none' }
              : { background: 'transparent', color: btnColor, border: `2px solid ${hexToRgba(btnColor, 0.35)}` }),
          }}>
          ← Back
        </button>
      )}
      {!isLastPage ? (
        <button type="button" onClick={onNext}
          style={{
            ...btnBase, background: btnColor, color: '#fff', border: 'none', cursor: 'pointer',
          }}>
          Next →
        </button>
      ) : (
        <button type="button" onClick={onSubmit} disabled={disabled}
          style={{
            ...btnBase, background: btnColor, color: '#fff', border: 'none',
            cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.75 : 1,
            transition: 'opacity 0.15s',
          }}>
          {(submitting || uploading) && (
            <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
          )}
          {submitting ? 'Submitting…' : uploading ? 'Uploading…' : 'Submit'}
        </button>
      )}
    </div>
  )
}
