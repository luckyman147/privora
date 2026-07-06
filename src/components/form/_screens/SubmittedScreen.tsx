'use client'
import { useRouter } from 'next/navigation'
import { renderLogo, resolvePageBg, screenGap } from '@/components/builder/design/primitives'
import type { DesignConfig } from '@/lib/types'

interface Props {
  d: DesignConfig; message?: string; title?: string
}

export function SubmittedScreen({ d, message, title: titleProp }: Props) {
  const router = useRouter()
  const title = titleProp ?? d.thankyou_title ?? 'Thank you!'
  const desc = message || 'Your response has been recorded.'
  const textColor = d.thankyou_title_color || '#0f172a'
  const btnColor = d.thankyou_button_color || d.primary_color
  const gap = screenGap(d.thankyou_spacing)
  const btnR = d.button_shape === 'pill' ? '9999px' : d.button_shape === 'square' ? '0' : '10px'
  const btnPad = d.button_size === 'small' ? '10px 28px' : d.button_size === 'large' ? '18px 44px' : '14px 36px'
  const showContainer = d.thankyou_container_enabled !== false
  const contBg = d.thankyou_container_bg || '#ffffff'
  const contBdr = d.thankyou_container_border_color || '#e2e8f0'
  const contBw = d.thankyou_container_border_width ?? 1

  const content = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap }}>
      <div>{renderLogo(d, 'thankyou')}</div>
      <h2 style={{ fontSize: 24, fontWeight: 700, fontFamily: d.heading_font, color: textColor }}>{title}</h2>
      <p style={{ color: textColor + 'cc', fontSize: 15 }}>{desc}</p>
      {d.thankyou_container_content && <p style={{ color: '#475569', fontSize: 13, lineHeight: 1.5 }}>{d.thankyou_container_content}</p>}
      {d.thankyou_show_button !== false && (
        <button onClick={() => router.push(d.thankyou_redirect_url || '/')} style={{ background: btnColor, color: '#fff', border: 'none', borderRadius: btnR, padding: btnPad, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>
          {d.thankyou_button_label || 'Submit another'}
        </button>
      )}
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', fontFamily: d.body_font, ...resolvePageBg(d) }}>
      <div style={{ maxWidth: '40rem', margin: '0 auto', padding: '96px 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {showContainer ? (
          <div style={{ padding: 32, borderRadius: 12, backgroundColor: contBg, border: contBw > 0 ? `${contBw}px solid ${contBdr}` : 'none', width: '100%', maxWidth: 480 }}>
            {content}
          </div>
        ) : content}
      </div>
    </div>
  )
}
