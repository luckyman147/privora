'use client'
import type { Form, DesignConfig } from '@/lib/types'
import { resolvePageBg, renderLogo, screenGap } from '../../primitives'

function contAnim(a?: string): React.CSSProperties {
  if (!a || a === 'none') return {}
  if (a === 'fade') return { animation: 'pfade 0.5s ease' }
  if (a === 'slide_up') return { animation: 'pslide 0.5s ease' }
  return {}
}

export function WelcomePreview({ form, design }: { form: Form; design: DesignConfig }) {
  const title = design.welcome_title || form.title
  const subtitle = design.welcome_subtitle || form.description
  const textColor = design.welcome_text_color || '#0f172a'
  const btnColor = design.welcome_button_color || design.primary_color
  const layout = design.welcome_layout ?? 'center'
  const btnShape = design.welcome_button_shape ?? design.button_shape
  const btnSize = design.welcome_button_size ?? design.button_size
  const btnR = btnShape === 'pill' ? '9999px' : btnShape === 'square' ? '0' : '10px'
  const btnPad = btnSize === 'small' ? '10px 28px' : btnSize === 'large' ? '18px 44px' : '14px 36px'
  const pageBg = design.welcome_bg_image
    ? { backgroundImage: `url(${design.welcome_bg_image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : resolvePageBg(design)
  const showContainer = design.welcome_container_enabled !== false
  const ca = contAnim(design.welcome_container_animation)
  const contBg = design.welcome_container_bg || '#ffffff'
  const contBdr = design.welcome_container_border_color || '#e2e8f0'
  const contBw = design.welcome_container_border_width ?? 1
  const gap = screenGap(design.welcome_spacing)

  const inner = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: layout === 'left' ? 'flex-start' : 'center', gap }}>
      <div style={{ display: 'flex', justifyContent: layout === 'center' ? 'center' : 'flex-start' }}>
        {renderLogo(design, 'welcome')}
      </div>
      <h1 className="text-xl font-bold" style={{ color: textColor }}>{title}</h1>
      {subtitle && <p className="text-sm" style={{ color: textColor + 'cc' }}>{subtitle}</p>}
      {design.welcome_content && <p className="text-sm text-slate-500">{design.welcome_content}</p>}
      {design.welcome_container_content && <p className="text-xs text-slate-600">{design.welcome_container_content}</p>}
      <button className="text-sm font-semibold text-white" style={{ background: btnColor, borderRadius: btnR, padding: btnPad, border: 'none', cursor: 'pointer' }}>
        {design.welcome_button_label || 'Start'}
      </button>
    </div>
  )

  return (
    <div className="flex-1 overflow-y-auto flex items-center p-6" style={{ ...pageBg, justifyContent: layout === 'left' ? 'flex-start' : 'center' }}>
      <div className="max-w-sm" style={{ textAlign: layout }}>
        {showContainer ? <div style={{ padding: 20, borderRadius: 12, backgroundColor: contBg, border: contBw > 0 ? `${contBw}px solid ${contBdr}` : 'none', ...ca }}>{inner}</div> : inner}
      </div>
    </div>
  )
}

export function ThankyouPreview({ form, design }: { form: Form; design: DesignConfig }) {
  const title = design.thankyou_title || 'Thank you!'
  const msg = form.responses_config?.confirmation_message || 'Your response has been recorded.'
  const textColor = design.thankyou_title_color || '#0f172a'
  const btnColor = design.thankyou_button_color || design.primary_color
  const btnR = design.button_shape === 'pill' ? '9999px' : design.button_shape === 'square' ? '0' : '10px'
  const btnPad = design.button_size === 'small' ? '10px 28px' : design.button_size === 'large' ? '18px 44px' : '14px 36px'
  const pageBg = resolvePageBg(design)
  const showContainer = design.thankyou_container_enabled !== false
  const ca = contAnim(design.thankyou_container_animation)
  const contBg = design.thankyou_container_bg || '#ffffff'
  const contBdr = design.thankyou_container_border_color || '#e2e8f0'
  const contBw = design.thankyou_container_border_width ?? 1
  const gap = screenGap(design.thankyou_spacing)

  const inner = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>{renderLogo(design, 'thankyou')}</div>
      <h2 className="text-lg font-bold" style={{ color: textColor }}>{title}</h2>
      <p className="text-sm" style={{ color: textColor + 'cc' }}>{msg}</p>
      {design.thankyou_container_content && <p className="text-xs text-slate-600">{design.thankyou_container_content}</p>}
      {design.thankyou_show_button !== false && (
        <button className="text-xs font-semibold text-white" style={{ background: btnColor, borderRadius: btnR, padding: btnPad, border: 'none', cursor: 'pointer' }}>
          {design.thankyou_button_label || 'Submit another'}
        </button>
      )}
    </div>
  )

  return (
    <div className="flex-1 overflow-y-auto flex items-center justify-center p-6" style={pageBg}>
      <div className="text-center max-w-sm space-y-3" style={{ width: '100%' }}>
        {showContainer ? <div style={{ padding: 24, borderRadius: 12, backgroundColor: contBg, border: contBw > 0 ? `${contBw}px solid ${contBdr}` : 'none', ...ca }}>{inner}</div> : inner}
      </div>
    </div>
  )
}
