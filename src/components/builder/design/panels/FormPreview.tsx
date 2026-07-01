'use client'
import type { Form, DesignConfig, Question } from '@/lib/types'
import { resolvePageBg } from '../primitives'

function QuestionPreview({ q, i, d }: { q: Question; i: number; d: DesignConfig }) {
  const layout = d.question_layout ?? 'cards'
  const rStyle = { none: '0', small: '4px', medium: '8px', large: '12px', full: '16px' }[d.corner_radius]
  const spacingCls = layout === 'shared' ? '' : { compact: 'mb-1.5', standard: 'mb-2', comfortable: 'mb-2.5', spacious: 'mb-3.5' }[d.question_spacing]
  const isCard = layout === 'cards'
  const cardBg = isCard ? (d.card_style === 'flat' ? '#f8fafc' : '#fff') : 'transparent'
  const cardShadow = isCard && d.card_style === 'soft_shadow' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
  const cardBorder = isCard && d.card_style === 'border' ? '1px solid #cbd5e1' : 'none'
  const borderStyle = isCard
    ? { border: cardBorder }
    : layout === 'shared'
      ? { borderBottom: '1px solid #f1f5f9' }
      : {}

  return (
    <div className={spacingCls} style={{ background: cardBg, boxShadow: cardShadow, ...borderStyle, borderRadius: isCard ? rStyle : '0', padding: layout === 'minimal' ? '4px 0' : '8px 10px' }}>
      <p className="text-[10px] font-semibold text-slate-800 mb-1.5">{i + 1}. {q.label}</p>
      {(q.type === 'short_text') && (
        <input readOnly placeholder="Type your answer…"
          className="w-full text-[10px] border border-slate-200 px-2 py-1 text-slate-400 placeholder:text-slate-300 focus:outline-none"
          style={{ borderRadius: rStyle }} />
      )}
      {(q.type === 'long_text') && (
        <textarea readOnly rows={2} placeholder="Type your answer…"
          className="w-full text-[10px] border border-slate-200 px-2 py-1 text-slate-400 placeholder:text-slate-300 focus:outline-none resize-none"
          style={{ borderRadius: rStyle }} />
      )}
      {(q.type === 'multiple_choice' || q.type === 'checkboxes' || q.type === 'dropdown') && (
        <div className="space-y-0.5">
          {(q.options ?? ['Option 1', 'Option 2', 'Option 3']).slice(0, 3).map((o, j) => (
            <div key={j} className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full border-2 shrink-0" style={{ borderColor: j === 0 ? d.primary_color : '#d1d5db', background: j === 0 ? d.primary_color + '25' : 'transparent' }} />
              <span className="text-[10px] text-slate-600">{o}</span>
            </div>
          ))}
        </div>
      )}
      {q.type === 'rating' && (
        <div className="flex gap-1 flex-wrap">
          {Array.from({ length: Math.min(q.max_rating ?? 5, 8) }).map((_, j) => (
            <div key={j} className="flex-1 min-w-[14px] h-5 text-[9px] font-bold flex items-center justify-center"
              style={{ borderRadius: { rounded: '4px', square: '0', pill: '9999px' }[d.button_shape], background: j < 2 ? d.primary_color : '#f1f5f9', color: j < 2 ? '#fff' : '#94a3b8' }}>
              {j + 1}
            </div>
          ))}
        </div>
      )}
      {q.type === 'date' && (
        <input readOnly placeholder="DD / MM / YYYY"
          className="w-full text-[10px] border border-slate-200 px-2 py-1 text-slate-300 focus:outline-none"
          style={{ borderRadius: rStyle }} />
      )}
      {q.type === 'file_upload' && (
        <div className="border border-dashed text-[9px] text-center py-1.5 text-slate-400"
          style={{ borderColor: d.primary_color + '50', borderRadius: rStyle }}>&#x2191; Upload file</div>
      )}
      {q.type === 'matrix' && (
        <div className="text-[9px] text-slate-400 italic border border-slate-100 p-1 rounded" style={{ borderRadius: rStyle }}>
          Matrix ({(q.rows?.length ?? 2)} rows &times; {(q.matrix_columns?.length ?? q.columns?.length ?? 1)} cols)
        </div>
      )}
    </div>
  )
}

export function FormPreview({ form, design }: { form: Form; design: DesignConfig }) {
  const widthCls = { narrow:'max-w-xs', medium:'max-w-sm', wide:'max-w-md', full:'max-w-full' }[design.form_width]
  const paddingCls = { none:'p-0', small:'p-3', medium:'p-4', large:'p-5', extra_large:'p-7' }[design.page_padding]
  const hCls = { small:'h-16', medium:'h-24', large:'h-32' }[design.header_height]
  const rCls = { none:'', small:'rounded-sm', medium:'rounded-md', large:'rounded-lg', full:'rounded-xl' }[design.corner_radius]
  const btnPad = { small:'px-3 py-1', medium:'px-4 py-1.5', large:'px-6 py-2' }[design.button_size]
  const btnR   = { rounded:'rounded-md', square:'rounded-none', pill:'rounded-full' }[design.button_shape]
  const visibleQs = (form.questions ?? []).filter(q => q.type !== 'section' && q.type !== 'page_break').slice(0, 4)
  const pageBg = resolvePageBg(design)

  return (
    <div className="flex-1 overflow-y-auto flex justify-center py-4 px-3 relative" style={pageBg}>
      {design.progress_bar && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: design.progress_style === 'line' ? 3 : 7, background: design.progress_color + '28' }}>
          <div style={{ height: '100%', width: '35%', background: design.progress_color, borderRadius: design.progress_style === 'bar' ? '0 3px 3px 0' : 0 }} />
        </div>
      )}
      <div className={`${widthCls} w-full`} style={{ paddingTop: design.progress_bar ? 6 : 0 }}>
        {design.header_type !== 'none' && (
          <div className={`${hCls} flex items-end overflow-hidden`}
            style={{
              ...(design.header_type === 'gradient' ? { background: `linear-gradient(135deg,${design.primary_color},${design.gradient_color_2 ?? '#a855f7'})` }
                : design.header_type === 'image' && design.header_image_url ? { backgroundImage: `url(${design.header_image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                : { background: design.primary_color }),
              borderRadius: { none:'0', small:'4px', medium:'8px', large:'12px', full:'16px' }[design.corner_radius],
              marginBottom: 8, padding: '0 10px 8px',
            }}>
            <div className="min-w-0 w-full" style={{ textAlign: design.header_title_align ?? 'left' }}>
              <p className="font-bold leading-tight truncate"
                style={{ fontSize: { small:'10px', medium:'11px', large:'13px' }[design.header_title_size ?? 'medium'], color: design.header_title_color ?? '#ffffff', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                {design.header_title || form.title}
              </p>
              {design.header_description && (
                <p className="text-[9px] leading-tight mt-0.5 truncate" style={{ color: design.header_desc_color ?? 'rgba(255,255,255,0.88)' }}>
                  {design.header_description}
                </p>
              )}
            </div>
          </div>
        )}
        <div className={paddingCls}>
          {design.header_type === 'none' && (
            <div className="mb-3">
              <h1 className="text-sm font-bold mb-0.5" style={{ color: '#0f172a' }}>{form.title}</h1>
              {form.description && <p className="text-[11px] text-slate-500">{form.description}</p>}
            </div>
          )}
          {(design.question_layout ?? 'cards') === 'shared' ? (
            <div className={`${rCls} mb-4`} style={{
              overflow: 'hidden',
              background: design.card_style === 'flat' ? '#f8fafc' : '#fff',
              ...(design.card_style === 'soft_shadow' ? { boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } : {}),
              ...(design.card_style === 'border' ? { border: '1px solid #cbd5e1' } : {}),
            }}>
              {visibleQs.map((q, i) => <QuestionPreview key={q.id} q={q} i={i} d={design} />)}
            </div>
          ) : (
            <div className="mb-4">
              {visibleQs.map((q, i) => <QuestionPreview key={q.id} q={q} i={i} d={design} />)}
            </div>
          )}
          <button className={`text-[11px] font-semibold text-white ${btnPad} ${btnR}`} style={{ background: design.primary_color }}>
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}
