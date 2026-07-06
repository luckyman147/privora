'use client'
import { useRef, useState, ReactNode } from 'react'
import type { DesignConfig } from '@/lib/types'
import { createClient } from '@/lib/supabase/browser'
import { DEFAULT_DESIGN } from '@/lib/design'
export { DEFAULT_DESIGN }

export const THEME_PRESETS: { id: DesignConfig['theme']; label: string; p: string; bg: string; patch: Partial<DesignConfig> }[] = [
  { id: 'modern',  label: 'Modern',  p: '#7C3AED', bg: '#F6F7FB', patch: { primary_color: '#7C3AED', background_color: '#F6F7FB', header_type: 'gradient', card_style: 'soft_shadow', progress_color: '#7C3AED' } },
  { id: 'soft',    label: 'Soft',    p: '#F472B6', bg: '#FFF1F5', patch: { primary_color: '#F472B6', background_color: '#FFF1F5', header_type: 'solid',    card_style: 'border',      progress_color: '#F472B6' } },
  { id: 'minimal', label: 'Minimal', p: '#64748B', bg: '#FFFFFF', patch: { primary_color: '#64748B', background_color: '#FFFFFF',  header_type: 'none',     card_style: 'flat',        progress_color: '#64748B' } },
  { id: 'bold',    label: 'Bold',    p: '#1E293B', bg: '#F8FAFC', patch: { primary_color: '#1E293B', background_color: '#F8FAFC',  header_type: 'gradient', card_style: 'soft_shadow', progress_color: '#1E293B' } },
]
export const PRIMARY_COLORS = ['#7C3AED','#3B82F6','#22C55E','#F97316','#EF4444']
export const BG_COLORS = ['#FFFFFF','#F1F5F9','#EFF6FF','#F0FDF4','#FEF9C3','#FAF5FF']

export function resolvePageBg(d: DesignConfig): React.CSSProperties {
  if (d.background_type === 'gradient') {
    const c1 = d.gradient_color_1 ?? d.primary_color; const c2 = d.gradient_color_2 ?? '#a855f7'
    return { backgroundImage: `linear-gradient(${d.gradient_angle ?? '135deg'}, ${c1}, ${c2})` }
  }
  if (d.background_type === 'image' && d.background_image_url)
    return { backgroundImage: `url(${d.background_image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
  return { backgroundColor: d.background_color }
}

export function SectionToggle({ label, open, onToggle, extra }: { label: string; open: boolean; onToggle: () => void; extra?: ReactNode }) {
  return (<button onClick={onToggle} className="w-full flex items-center justify-between py-3 text-sm font-semibold text-slate-800 hover:text-slate-900 transition">
    <div className="flex items-center gap-2">{extra}<span>{label}</span></div>
    <svg viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
  </button>)
}

export function Tog({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (<button onClick={() => onChange(!checked)} className={`w-10 h-6 rounded-full transition-colors shrink-0 relative ${checked ? 'bg-violet-500' : 'bg-slate-200'}`}>
    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${checked ? 'left-5' : 'left-1'}`} />
  </button>)
}

export function Row({ label, children }: { label: string; children: ReactNode }) {
  return <div className="flex items-center justify-between gap-3 py-1"><span className="text-xs text-slate-600 shrink-0">{label}</span>{children}</div>
}

export function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (<select value={value} onChange={e => onChange(e.target.value)}
    className="flex-1 text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:border-violet-400 text-slate-700 max-w-[160px]">
    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>)
}

export function Cards<T extends string>({ options, value, onChange, cols = 4 }: {
  options: { value: T; label: string; sub?: string; preview: ReactNode }[]; value: T; onChange: (v: T) => void; cols?: number
}) {
  return (<div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
    {options.map(opt => (
      <button key={opt.value} onClick={() => onChange(opt.value)}
        className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition text-center ${value === opt.value ? 'border-violet-500 bg-violet-50' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
        {value === opt.value && <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-violet-500 rounded-full flex items-center justify-center">
          <svg viewBox="0 0 20 20" fill="white" className="w-2.5 h-2.5"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
        </span>}
        {opt.preview}
        <span className={`text-[11px] font-semibold ${value === opt.value ? 'text-violet-700' : 'text-slate-600'}`}>{opt.label}</span>
        {opt.sub && <span className="text-[10px] text-slate-400 -mt-1.5">{opt.sub}</span>}
      </button>
    ))}
  </div>)
}

export const WidthMock = ({ frac }: { frac: number }) => (<div className="w-16 h-10 bg-slate-100 rounded flex items-center justify-center">
  <div className="h-6 bg-slate-300 rounded" style={{ width: `${frac * 100}%` }} /></div>)
export const PaddingMock = ({ p }: { p: number }) => (<div className="w-12 h-9 bg-slate-100 rounded flex items-center justify-center">
  <div className="bg-white rounded border border-slate-200" style={{ width: `${90 - p * 14}%`, height: `${90 - p * 14}%` }} /></div>)
export const SpacingMock = ({ gap }: { gap: number }) => (<div className="w-12 h-9 flex flex-col items-center justify-center gap-0">
  {[0,1,2].map(i => <div key={i} className="w-8 h-1 bg-slate-300 rounded-full" style={{ marginBottom: gap }} />)}</div>)
export const RadiusMock = ({ r }: { r: number }) => <div className="w-10 h-8 bg-slate-300" style={{ borderRadius: r }} />

export function BgUpload({ formId, prefix, onUpload }: { formId: string; prefix: string; onUpload: (url: string) => void }) {
  const ref = useRef<HTMLInputElement>(null); const [uploading, setUploading] = useState(false)
  async function handle(file: File) {
    setUploading(true); const supabase = createClient() as any; const ext = file.name.split('.').pop() ?? 'png'
    const path = `${formId}/${prefix}_${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('form-backgrounds').upload(path, file, { upsert: true })
    if (!error) { const { data: { publicUrl } } = supabase.storage.from('form-backgrounds').getPublicUrl(path); onUpload(publicUrl) }
    setUploading(false)
  }
  return (<label className={`flex flex-col items-center justify-center gap-1.5 h-16 border-2 border-dashed rounded-xl cursor-pointer transition ${uploading ? 'opacity-50 pointer-events-none' : 'hover:border-violet-400 hover:bg-violet-50/30'} border-slate-300`}>
    {uploading ? <div className="w-4 h-4 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" /> : <span className="text-[11px] font-semibold text-slate-500">Upload image</span>}
    <input ref={ref} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={e => e.target.files?.[0] && handle(e.target.files[0])} />
  </label>)
}

export function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (<div><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{label}</label>
    <label className="flex items-center gap-1.5 border border-slate-200 rounded-lg px-2.5 py-1.5 cursor-pointer hover:border-violet-300 transition">
      <input type="color" value={value} onChange={e => onChange(e.target.value)} className="w-5 h-5 rounded cursor-pointer border-none bg-transparent p-0" />
      <span className="text-xs font-mono text-slate-700 uppercase">{value}</span>
    </label>
  </div>)
}

export function ImgPreview({ url, onRemove }: { url: string; onRemove: () => void }) {
  return (<div className="relative rounded-xl overflow-hidden h-20 border border-slate-200 mb-2">
    <img src={url} alt="" className="w-full h-full object-contain bg-slate-50" />
    <button onClick={onRemove} className="absolute top-1.5 right-1.5 w-5 h-5 bg-black/50 text-white rounded-full text-xs flex items-center justify-center hover:bg-black/70 transition">\u2715</button>
  </div>)
}

export { LOGO_PRESETS, renderLogo, PresetIcons } from './presets'

export function screenGap(s?: 'compact' | 'standard' | 'comfortable' | 'spacious') {
  switch (s) {
    case 'compact': return 8
    case 'comfortable': return 24
    case 'spacious': return 32
    default: return 16
  }
}

export const animKF = `@keyframes spin { to { transform: rotate(360deg); } } @keyframes wfade { from { opacity: 0; } to { opacity: 1; } } @keyframes wslide { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } } @keyframes tfade { from { opacity: 0; } to { opacity: 1; } } @keyframes tslide { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } } @keyframes pfade { from { opacity: 0; } to { opacity: 1; } } @keyframes pslide { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`
