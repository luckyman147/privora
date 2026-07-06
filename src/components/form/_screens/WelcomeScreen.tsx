import { renderLogo, resolvePageBg, screenGap } from '@/components/builder/design/primitives'
import type { DesignConfig, Form } from '@/lib/types'

interface Props {
  d: DesignConfig; form: Form; onStart: () => void
}

export function WelcomeScreen({ d, form, onStart }: Props) {
  const title = d.welcome_title || form.title
  const subtitle = d.welcome_subtitle || form.description
  const textColor = d.welcome_text_color || '#0f172a'
  const btnColor = d.welcome_button_color || d.primary_color
  const layout = d.welcome_layout ?? 'center'
  const btnShape = d.welcome_button_shape ?? d.button_shape
  const btnSize = d.welcome_button_size ?? d.button_size
  const gap = screenGap(d.welcome_spacing)
  const btnR = btnShape === 'pill' ? '9999px' : btnShape === 'square' ? '0' : '10px'
  const btnPad = btnSize === 'small' ? '10px 28px' : btnSize === 'large' ? '18px 44px' : '14px 36px'
  const bgStyle = d.welcome_bg_image
    ? { backgroundImage: `url(${d.welcome_bg_image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : resolvePageBg(d)
  const showContainer = d.welcome_container_enabled !== false
  const contBg = d.welcome_container_bg || '#ffffff'
  const contBdr = d.welcome_container_border_color || '#e2e8f0'
  const contBw = d.welcome_container_border_width ?? 1

  const content = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: layout === 'left' ? 'flex-start' : 'center', gap }}>
      <div style={{ alignSelf: layout === 'center' ? 'center' : 'flex-start' }}>
        {renderLogo(d, 'welcome')}
      </div>
      <h1 style={{ fontSize: 26, fontWeight: 700, fontFamily: d.heading_font, color: textColor }}>{title}</h1>
      {subtitle && <p style={{ color: textColor + 'cc', fontSize: 15, lineHeight: 1.5 }}>{subtitle}</p>}
      {d.welcome_content && <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{d.welcome_content}</p>}
      {d.welcome_container_content && <p style={{ color: '#475569', fontSize: 13, lineHeight: 1.5 }}>{d.welcome_container_content}</p>}
      <button onClick={onStart} style={{ background: btnColor, color: '#fff', border: 'none', borderRadius: btnR, padding: btnPad, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>
        {d.welcome_button_label || 'Start'}
      </button>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', fontFamily: d.body_font, ...bgStyle }}>
      <div style={{ maxWidth: '36rem', margin: '0 auto', padding: '64px 24px', textAlign: layout, display: 'flex', flexDirection: 'column' }}>
        {showContainer ? (
          <div style={{ padding: 24, borderRadius: 12, backgroundColor: contBg, border: contBw > 0 ? `${contBw}px solid ${contBdr}` : 'none' }}>
            {content}
          </div>
        ) : content}
      </div>
    </div>
  )
}
