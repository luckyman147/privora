'use client'
import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import type { DesignConfig } from '@/lib/types'
import { Row, Select } from '../../primitives'

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <Row label={label}>
      <label className="flex items-center gap-1.5 border border-slate-200 rounded-lg px-2.5 py-1.5 cursor-pointer hover:border-violet-300 transition">
        <input type="color" value={value} onChange={e => onChange(e.target.value)}
          className="w-5 h-5 rounded cursor-pointer border-none bg-transparent p-0" />
        <span className="text-xs font-mono text-slate-700 uppercase">{value}</span>
      </label>
    </Row>
  )
}

const HEADER_TYPE_OPTS = [
  { value: 'gradient', label: 'Gradient', preview: (c1: string, c2: string) =>
    <div className="w-full h-7 rounded-md" style={{ background: `linear-gradient(135deg,${c1},${c2})` }} /> },
  { value: 'solid', label: 'Solid', preview: (c1: string) =>
    <div className="w-full h-7 rounded-md" style={{ background: c1 }} /> },
  { value: 'image', label: 'Image', preview: (url: string) =>
    <div className="w-full h-7 rounded-md bg-slate-200 flex items-center justify-center overflow-hidden"
      style={url ? { backgroundImage: `url(${url})`, backgroundSize:'cover', backgroundPosition:'center' } : {}}>
      {!url && <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-slate-400"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>}
    </div> },
  { value: 'none', label: 'None', preview: () =>
    <div className="w-full h-7 rounded-md bg-slate-100 flex items-center justify-center"><span className="text-[11px] text-slate-400 font-bold">\u2014</span></div> },
]

export function HeaderSettings({ d, set, formId }: { d: DesignConfig; set: (p: Partial<DesignConfig>) => void; formId: string }) {
  const headerImgRef = useRef<HTMLInputElement>(null)
  const [hu, setHu] = useState(false)
  const [he, setHe] = useState('')

  async function handleHeaderImageUpload(file: File) {
    setHu(true); setHe('')
    try {
      const supabase = createClient() as any
      const ext = file.name.split('.').pop() ?? 'jpg'
      const path = `${formId}/header_${Date.now()}.${ext}`
      const { error } = await supabase.storage.from('form-backgrounds').upload(path, file, { upsert: true })
      if (error) { setHe(error.message); return }
      const { data: { publicUrl } } = supabase.storage.from('form-backgrounds').getPublicUrl(path)
      set({ header_image_url: publicUrl })
    } finally { setHu(false) }
  }

  return (
    <div className="space-y-3 pb-4">
      <div className="grid grid-cols-4 gap-2">
        {HEADER_TYPE_OPTS.map(opt => (
          <button key={opt.value} onClick={() => set({ header_type: opt.value as DesignConfig['header_type'] })}
            className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 text-center transition ${d.header_type === opt.value ? 'border-violet-500 bg-violet-50' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
            {opt.preview(d.primary_color, d.gradient_color_2 ?? '#a855f7')}
            <span className={`text-[10px] font-semibold ${d.header_type === opt.value ? 'text-violet-700' : 'text-slate-500'}`}>{opt.label}</span>
          </button>
        ))}
      </div>
      {d.header_type !== 'none' && (
        <div className="space-y-2">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Header title</label>
            <input type="text" placeholder="Defaults to form title" value={d.header_title ?? ''}
              onChange={e => set({ header_title: e.target.value || undefined })}
              className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:border-violet-400 text-slate-700 placeholder:text-slate-300" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Header description</label>
            <input type="text" placeholder="Optional subtitle" value={d.header_description ?? ''}
              onChange={e => set({ header_description: e.target.value || undefined })}
              className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:border-violet-400 text-slate-700 placeholder:text-slate-300" />
          </div>
          <ColorRow label="Title color" value={d.header_title_color ?? '#ffffff'} onChange={v => set({ header_title_color: v })} />
          <ColorRow label="Desc. color" value={d.header_desc_color ?? '#ffffff'} onChange={v => set({ header_desc_color: v })} />
          <Row label="Title size">
            <Select value={d.header_title_size ?? 'medium'} onChange={v => set({ header_title_size: v as any })}
              options={['Small','Medium','Large'].map(v => ({ value: v.toLowerCase(), label: v }))} />
          </Row>
          <Row label="Title align">
            <Select value={d.header_title_align ?? 'left'} onChange={v => set({ header_title_align: v as any })}
              options={[{value:'left',label:'Left'},{value:'center',label:'Center'}]} />
          </Row>
          <Row label="Height">
            <Select value={d.header_height} onChange={v => set({ header_height: v as any })}
              options={['Small','Medium','Large'].map(v => ({ value: v.toLowerCase(), label: v }))} />
          </Row>
        </div>
      )}
      {d.header_type === 'gradient' && (
        <div className="space-y-3">
          <ColorRow label="Color 1" value={d.primary_color} onChange={v => set({ primary_color: v })} />
          <ColorRow label="Color 2" value={d.gradient_color_2 ?? '#a855f7'} onChange={v => set({ gradient_color_2: v })} />
          <div className="h-8 rounded-xl" style={{ background: `linear-gradient(135deg,${d.primary_color},${d.gradient_color_2 ?? '#a855f7'})` }} />
        </div>
      )}
      {d.header_type === 'solid' && <ColorRow label="Color" value={d.primary_color} onChange={v => set({ primary_color: v })} />}
      {d.header_type === 'image' && (
        <div className="space-y-2">
          {d.header_image_url && (
            <div className="relative rounded-xl overflow-hidden h-20 border border-slate-200">
              <img src={d.header_image_url} alt="Header" className="w-full h-full object-cover" />
              <button onClick={() => set({ header_image_url: '' })}
                className="absolute top-1.5 right-1.5 w-5 h-5 bg-black/50 text-white rounded-full text-xs flex items-center justify-center hover:bg-black/70 transition">\u2715</button>
            </div>
          )}
          <label className={`flex flex-col items-center justify-center gap-1.5 h-20 border-2 border-dashed rounded-xl cursor-pointer transition ${hu ? 'opacity-50 pointer-events-none' : 'hover:border-violet-400 hover:bg-violet-50/30'} border-slate-300`}>
            {hu
              ? <div className="w-4 h-4 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
              : <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 text-slate-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <span className="text-[11px] font-semibold text-slate-500">{d.header_image_url ? 'Replace image' : 'Upload header image'}</span>
                <span className="text-[10px] text-slate-400">JPG, PNG, WEBP</span>
              </>}
            <input ref={headerImgRef} type="file" accept="image/jpeg,image/png,image/webp"
              className="sr-only" onChange={e => e.target.files?.[0] && handleHeaderImageUpload(e.target.files[0])} />
          </label>
          {he && <p className="text-xs text-red-500">{he}</p>}
        </div>
      )}
    </div>
  )
}
