'use client'
import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import type { DesignConfig } from '@/lib/types'
import { Cards, Row, Select, WidthMock, PaddingMock, SpacingMock, RadiusMock } from '../primitives'
import { BackgroundGallery } from './BackgroundGallery'

export function LayoutCenter({ d, set, formId }: { d: DesignConfig; set: (p: Partial<DesignConfig>) => void; formId: string }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadErr, setUploadErr] = useState('')
  const [showGallery, setShowGallery] = useState(false)
  async function handleImageUpload(file: File) {
    if (!file) return
    setUploading(true); setUploadErr('')
    try {
      const supabase = createClient() as any
      const ext = file.name.split('.').pop() ?? 'jpg'
      const path = `${formId}/bg_${Date.now()}.${ext}`
      const { error } = await supabase.storage.from('form-backgrounds').upload(path, file, { upsert: true })
      if (error) { setUploadErr(error.message); return }
      const { data: { publicUrl } } = supabase.storage.from('form-backgrounds').getPublicUrl(path)
      set({ background_image_url: publicUrl })
    } finally { setUploading(false) }
  }
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-8">
      <div>
        <h2 className="text-sm font-bold text-slate-900 mb-1">Page layout</h2>
        <p className="text-xs text-slate-400">Customize the structure and spacing of your form pages.</p>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-1">Form width</h3>
        <p className="text-xs text-slate-400 mb-3">Control the maximum width of your form on the screen.</p>
        <Cards value={d.form_width} onChange={v => set({ form_width: v })} options={[
          { value: 'narrow',label: 'Narrow',sub: '(600px)',preview: <WidthMock frac={0.45} /> },
          { value: 'medium',label: 'Medium',sub: '(800px)',preview: <WidthMock frac={0.65} /> },
          { value: 'wide',label: 'Wide',sub: '(1000px)',preview: <WidthMock frac={0.82} /> },
          { value: 'full',label: 'Full width',sub: '(1200px)',preview: <WidthMock frac={0.98} /> },
        ]} cols={4} />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-1">Page padding</h3>
        <p className="text-xs text-slate-400 mb-3">Adjust the padding around your form content.</p>
        <Cards value={d.page_padding} onChange={v => set({ page_padding: v })} options={[
          { value: 'none', label: 'None', preview: <PaddingMock p={0} /> },
          { value: 'small', label: 'Small', preview: <PaddingMock p={1} /> },
          { value: 'medium', label: 'Medium', preview: <PaddingMock p={2} /> },
          { value: 'large', label: 'Large', preview: <PaddingMock p={3} /> },
          { value: 'extra_large', label: 'Extra large', preview: <PaddingMock p={4} /> },
        ]} cols={5} />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-1">Question spacing</h3>
        <p className="text-xs text-slate-400 mb-3">Adjust the vertical spacing between questions.</p>
        <Cards value={d.question_spacing} onChange={v => set({ question_spacing: v })} options={[
          { value: 'compact', label: 'Compact', preview: <SpacingMock gap={2} /> },
          { value: 'standard', label: 'Standard', preview: <SpacingMock gap={4} /> },
          { value: 'comfortable', label: 'Comfortable', preview: <SpacingMock gap={6} /> },
          { value: 'spacious', label: 'Spacious', preview: <SpacingMock gap={10} /> },
        ]} cols={4} />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-1">Border radius</h3>
        <p className="text-xs text-slate-400 mb-3">Control the roundness of corners on form elements.</p>
        <Cards value={d.border_radius} onChange={v => set({ border_radius: v })} options={[
          { value: 'none', label: 'None', preview: <RadiusMock r={0} /> },
          { value: 'small', label: 'Small', preview: <RadiusMock r={4} /> },
          { value: 'medium', label: 'Medium', preview: <RadiusMock r={8} /> },
          { value: 'large', label: 'Large', preview: <RadiusMock r={12} /> },
          { value: 'full', label: 'Full', preview: <RadiusMock r={9999} /> },
        ]} cols={5} />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-1">Page background</h3>
        <p className="text-xs text-slate-400 mb-3">Choose a background style for your form pages.</p>
        <Cards value={d.background_type} onChange={v => set({ background_type: v })} options={[
          { value: 'solid', label: 'Solid', preview: <div className="w-12 h-9 rounded-lg border border-slate-200" style={{ background: d.background_color }} /> },
          { value: 'gradient', label: 'Gradient', preview: <div className="w-12 h-9 rounded-lg" style={{ background: `linear-gradient(${d.gradient_angle ?? '135deg'}, ${d.gradient_color_1 ?? d.primary_color}, ${d.gradient_color_2 ?? '#a855f7'})` }} /> },
          { value: 'image', label: 'Image', preview: <div className="w-12 h-9 rounded-lg bg-slate-200 flex items-center justify-center overflow-hidden" style={d.background_image_url ? { backgroundImage: `url(${d.background_image_url})`, backgroundSize:'cover', backgroundPosition:'center' } : {}}>
            {!d.background_image_url && <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-slate-400"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>}
          </div>},
        ]} cols={3} />
        {d.background_type === 'solid' && (
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs text-slate-500">Color</span>
            <label className="flex items-center gap-1.5 border border-slate-200 rounded-lg px-2.5 py-1.5 cursor-pointer hover:border-slate-300 transition">
              <input type="color" value={d.background_color} onChange={e => set({ background_color: e.target.value })}
                className="w-5 h-5 rounded cursor-pointer border-none bg-transparent p-0" />
              <span className="text-xs font-mono text-slate-700 uppercase">{d.background_color}</span>
            </label>
          </div>
        )}
        {d.background_type === 'gradient' && (
          <div className="mt-4 space-y-3">
            <Row label="Color 1">
              <label className="flex items-center gap-1.5 border border-slate-200 rounded-lg px-2.5 py-1.5 cursor-pointer hover:border-slate-300 transition">
                <input type="color" value={d.gradient_color_1 ?? d.primary_color} onChange={e => set({ gradient_color_1: e.target.value })} className="w-5 h-5 rounded cursor-pointer border-none bg-transparent p-0" />
                <span className="text-xs font-mono text-slate-700 uppercase">{d.gradient_color_1 ?? d.primary_color}</span>
              </label>
            </Row>
            <Row label="Color 2">
              <label className="flex items-center gap-1.5 border border-slate-200 rounded-lg px-2.5 py-1.5 cursor-pointer hover:border-slate-300 transition">
                <input type="color" value={d.gradient_color_2 ?? '#a855f7'} onChange={e => set({ gradient_color_2: e.target.value })} className="w-5 h-5 rounded cursor-pointer border-none bg-transparent p-0" />
                <span className="text-xs font-mono text-slate-700 uppercase">{d.gradient_color_2 ?? '#a855f7'}</span>
              </label>
            </Row>
            <Row label="Direction">
              <Select value={d.gradient_angle ?? '135deg'} onChange={v => set({ gradient_angle: v as any })} options={[
                {value:'0deg',label:'Top \u2192 Bottom'},{value:'90deg',label:'Left \u2192 Right'},
                {value:'135deg',label:'Diagonal \u2198'},{value:'45deg',label:'Diagonal \u2197'},
                {value:'180deg',label:'Bottom \u2192 Top'},{value:'225deg',label:'Diagonal \u2199'},
              ]} />
            </Row>
            <div className="h-10 rounded-xl" style={{ background: `linear-gradient(${d.gradient_angle ?? '135deg'}, ${d.gradient_color_1 ?? d.primary_color}, ${d.gradient_color_2 ?? '#a855f7'})` }} />
          </div>
        )}
        {d.background_type === 'image' && (
          <div className="mt-4 space-y-3">
            {d.background_image_url && (
              <div className="relative rounded-xl overflow-hidden h-32 border border-slate-200">
                <img src={d.background_image_url} alt="Background" className="w-full h-full object-cover" />
                <button onClick={() => set({ background_image_url: '' })}
                  className="absolute top-2 right-2 w-6 h-6 bg-black/50 text-white rounded-full text-xs flex items-center justify-center hover:bg-black/70 transition">\u2715</button>
              </div>
            )}
            <label className={`flex flex-col items-center justify-center gap-2 h-24 border-2 border-dashed rounded-xl cursor-pointer transition ${uploading ? 'opacity-50 pointer-events-none' : 'hover:border-violet-400 hover:bg-violet-50/30'} border-slate-300`}>
              {uploading
                ? <div className="w-5 h-5 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
                : <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6 text-slate-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  <span className="text-xs font-semibold text-slate-500">{d.background_image_url ? 'Replace image' : 'Upload background image'}</span>
                  <span className="text-[10px] text-slate-400">JPG, PNG, WEBP \u00b7 max 5 MB</span>
                </>}
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif"
                className="sr-only" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
            </label>
            {uploadErr && <p className="text-xs text-red-500">{uploadErr}</p>}
            <button onClick={() => setShowGallery(true)}
              className="w-full text-xs font-semibold py-2 rounded-lg border-2 border-dashed border-slate-300 text-slate-500 hover:border-violet-400 hover:text-violet-600 hover:bg-violet-50/30 transition">
              Browse gallery
            </button>
          </div>
        )}
      </div>
      {showGallery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowGallery(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-[640px] max-h-[80vh] overflow-y-auto p-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800">Background gallery</h3>
              <button onClick={() => setShowGallery(false)} className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 text-sm flex items-center justify-center hover:bg-slate-200 transition">\u2715</button>
            </div>
            <BackgroundGallery value={d.background_image_url} onChange={url => { set({ background_image_url: url }); setShowGallery(false) }} />
          </div>
        </div>
      )}
    </div>
  )
}
