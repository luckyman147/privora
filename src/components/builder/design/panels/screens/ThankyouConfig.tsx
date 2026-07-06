'use client'
import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import type { Form, DesignConfig } from '@/lib/types'
import { Tog, Row, ColorInput, BgUpload, ImgPreview, PresetIcons, LOGO_PRESETS } from '../../primitives'

export function ThankyouConfig({ design, form, onFormPatch, onDesignPatch }: {
  design: DesignConfig; form: Form
  onFormPatch: (fn: (f: Form) => Form) => void
  onDesignPatch: (p: Partial<DesignConfig>) => void
}) {
  const [uploading, setUploading] = useState(false)
  const [logoMode, setLogoMode] = useState<'upload' | 'preset'>(design.thankyou_logo_preset && !design.thankyou_logo_url ? 'preset' : 'upload')
  const [showPresets, setShowPresets] = useState(false)
  const logoRef = useRef<HTMLInputElement>(null)
  async function handleLogoUpload(file: File) {
    setUploading(true)
    const supabase = createClient() as any; const ext = file.name.split('.').pop() ?? 'png'
    const path = `${form.id}/thankyou_logo_${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('form-backgrounds').upload(path, file, { upsert: true })
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from('form-backgrounds').getPublicUrl(path)
      onDesignPatch({ thankyou_logo_url: publicUrl })
    }
    setUploading(false)
  }
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-5">
      <div>
        <h2 className="text-sm font-bold text-slate-900">Thank you page</h2>
        <p className="text-xs text-slate-400 mt-0.5">Customize what respondents see after submitting.</p>
      </div>
      <div>
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Title</label>
        <input type="text" value={design.thankyou_title ?? ''} placeholder="Thank you!"
          onChange={e => onDesignPatch({ thankyou_title: e.target.value || undefined })}
          className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:border-violet-400 text-slate-700 placeholder:text-slate-300" />
      </div>
      <div>
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Message</label>
        <textarea value={form.responses_config?.confirmation_message ?? ''}
          onChange={e => onFormPatch(f => ({ ...f, responses_config: { ...f.responses_config ?? {} as any, confirmation_message: e.target.value } }))}
          placeholder="Your response has been recorded." rows={4}
          className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:border-violet-400 text-slate-700 placeholder:text-slate-300 resize-none" />
        <p className="text-xs text-slate-400 mt-1">Shown after a successful submission.</p>
      </div>
      <div>
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Logo</label>
        <div className="flex gap-2 mb-2">
          {(['upload','preset'] as const).map(t => (
            <button key={t} onClick={() => setLogoMode(t)}
              className={`flex-1 text-xs font-semibold py-1.5 rounded-lg border-2 capitalize transition ${logoMode === t ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
              {t === 'upload' ? 'Upload' : 'Preset icons'}
            </button>
          ))}
        </div>
        {logoMode === 'upload' ? (
          <>{design.thankyou_logo_url && <ImgPreview url={design.thankyou_logo_url} onRemove={() => onDesignPatch({ thankyou_logo_url: '' })} />}
            <label className={`flex flex-col items-center justify-center gap-1.5 h-14 border-2 border-dashed rounded-xl cursor-pointer transition ${uploading ? 'opacity-50 pointer-events-none' : 'hover:border-violet-400 hover:bg-violet-50/30'} border-slate-300`}>
              {uploading ? <div className="w-4 h-4 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" /> : <span className="text-[11px] font-semibold text-slate-500">{design.thankyou_logo_url ? 'Replace' : 'Upload logo'}</span>}
              <input ref={logoRef} type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" className="sr-only" onChange={e => e.target.files?.[0] && handleLogoUpload(e.target.files[0])} />
            </label></>
        ) : (
          <div>
            {!!design.thankyou_logo_preset && <div className="flex items-center gap-3 mb-2">
              {LOGO_PRESETS.find(x => x.id === design.thankyou_logo_preset)?.render(design.thankyou_logo_color || design.primary_color, 32)}
              <button onClick={() => setShowPresets(true)} className="text-xs font-semibold text-violet-600 hover:text-violet-700">Change</button>
              <button onClick={() => onDesignPatch({ thankyou_logo_preset: '' })} className="text-xs text-slate-400 hover:text-slate-600">Remove</button>
            </div>}
            {!design.thankyou_logo_preset && <button onClick={() => setShowPresets(true)}
              className="w-full text-xs font-semibold py-2 rounded-lg border-2 border-dashed border-slate-300 text-slate-500 hover:border-violet-400 hover:text-violet-600 hover:bg-violet-50/30 transition mb-2">
              Choose icon
            </button>}
            {showPresets && <PresetIcons value={design.thankyou_logo_preset} onChange={id => onDesignPatch({ thankyou_logo_preset: id || '' })} color={design.thankyou_logo_color || design.primary_color} onClose={() => setShowPresets(false)} />}
          </div>)}</div>
      <ColorInput label="Logo color" value={design.thankyou_logo_color || design.primary_color} onChange={v => onDesignPatch({ thankyou_logo_color: v })} />
      <div>
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Logo height (px)</label>
        <input type="number" min={24} max={200} value={design.thankyou_logo_height ?? 56}
          onChange={e => onDesignPatch({ thankyou_logo_height: Number(e.target.value) || 56 })}
          className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:border-violet-400" />
      </div>
      <div>
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Button label</label>
        <input type="text" value={design.thankyou_button_label ?? 'Submit another'}
          onChange={e => onDesignPatch({ thankyou_button_label: e.target.value })}
          className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:border-violet-400 text-slate-700" />
      </div>
      <Row label="Show submit button">
        <Tog checked={design.thankyou_show_button !== false} onChange={v => onDesignPatch({ thankyou_show_button: v })} />
      </Row>
      <ColorInput label="Text color" value={design.thankyou_title_color || '#0f172a'} onChange={v => onDesignPatch({ thankyou_title_color: v })} />
      <ColorInput label="Button color" value={design.thankyou_button_color || design.primary_color} onChange={v => onDesignPatch({ thankyou_button_color: v })} />
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-t border-slate-100 pt-2">Container</p>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-600">Show content container</span>
        <Tog checked={design.thankyou_container_enabled !== false} onChange={v => onDesignPatch({ thankyou_container_enabled: v })} />
      </div>
      {design.thankyou_container_enabled !== false && (
        <>
          <ColorInput label="Container background" value={design.thankyou_container_bg || '#ffffff'} onChange={v => onDesignPatch({ thankyou_container_bg: v })} />
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Content text</label>
            <textarea value={design.thankyou_container_content ?? ''} placeholder="Extra text inside container"
              onChange={e => onDesignPatch({ thankyou_container_content: e.target.value || undefined })}
              rows={2} className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:border-violet-400 text-slate-700 placeholder:text-slate-300 resize-none" />
          </div>
          <ColorInput label="Border color" value={design.thankyou_container_border_color || '#e2e8f0'} onChange={v => onDesignPatch({ thankyou_container_border_color: v })} />
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Border width (px)</label>
            <input type="number" min={0} max={8} value={design.thankyou_container_border_width ?? 1}
              onChange={e => onDesignPatch({ thankyou_container_border_width: Number(e.target.value) || 0 })}
              className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:border-violet-400" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Animation</label>
            <div className="flex gap-2">
              {(['none','fade','slide_up'] as const).map(a => (
                <button key={a} onClick={() => onDesignPatch({ thankyou_container_animation: a })}
                  className={`flex-1 text-xs font-semibold py-2 rounded-lg border-2 capitalize transition ${(design.thankyou_container_animation ?? 'fade') === a ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                  {a === 'slide_up' ? 'Slide up' : a === 'fade' ? 'Fade in' : 'None'}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
