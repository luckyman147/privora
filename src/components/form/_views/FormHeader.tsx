import { CARD_RADIUS, HEADER_H, SPACING, hexToRgba } from '../design'
import type { DesignConfig, Form } from '@/lib/types'

interface Props {
  d: DesignConfig
  form: Form
  cardStyle: React.CSSProperties
}

export function FormHeader({ d, form, cardStyle }: Props) {
  return (
    <>
      {d.header_type !== 'none' && (
        <div style={{
          height: HEADER_H[d.header_height],
          borderRadius: CARD_RADIUS[d.corner_radius],
          ...(d.header_type === 'gradient' ? {
            background: `linear-gradient(135deg, ${d.primary_color} 0%, ${d.gradient_color_2 ?? '#a855f7'} 100%)`,
          } : d.header_type === 'image' && d.header_image_url ? {
            backgroundImage: `url(${d.header_image_url})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
          } : {
            background: d.primary_color,
          }),
          marginBottom: SPACING[d.question_spacing],
          display: 'flex', alignItems: 'flex-end',
          padding: '0 28px 24px',
        }}>
          <div style={{ width: '100%', textAlign: d.header_title_align ?? 'left' }}>
            <h1 style={{ fontSize: { small: 20, medium: 26, large: 34 }[d.header_title_size ?? 'medium'], fontWeight: 700, fontFamily: d.heading_font, color: d.header_title_color ?? '#fff', marginBottom: (d.header_description ?? form.description) ? 4 : 0, textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
              {d.header_title || form.title}
            </h1>
            {(d.header_description ?? form.description) && (
              <p style={{ fontSize: 14, color: d.header_desc_color ?? 'rgba(255,255,255,0.88)', lineHeight: 1.6 }}>
                {d.header_description ?? form.description}
              </p>
            )}
          </div>
        </div>
      )}

      {d.header_type === 'none' && (
        <div style={{ ...cardStyle, padding: '28px 32px', marginBottom: SPACING[d.question_spacing] }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, fontFamily: d.heading_font, color: '#0f172a', marginBottom: 6 }}>
            {form.title}
          </h1>
          {form.description && (
            <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>{form.description}</p>
          )}
        </div>
      )}
    </>
  )
}
