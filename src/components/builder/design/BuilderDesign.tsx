'use client'
import { useState } from 'react'
import type { Form, DesignConfig } from '@/lib/types'
import { Palette, LayoutDashboard, Hand, CheckCircle2, SwatchBook } from 'lucide-react'
import { PRIMARY_COLORS, BG_COLORS, Tog } from './primitives'
import { ThemesCenter } from './panels/ThemesCenter'
import { LayoutCenter } from './panels/LayoutCenter'
import { FormPreview } from './panels/FormPreview'
import { WelcomePreview, ThankyouPreview } from './panels/screens/ScreenPreviews'
import { WelcomeConfig } from './panels/screens/WelcomeConfig'
import { ThankyouConfig } from './panels/screens/ThankyouConfig'
import { DesignTemplates } from './panels/templates/DesignTemplates'
interface Props {
  form: Form; design: DesignConfig
  onUpdate: (d: DesignConfig) => void
  onFormPatch?: (fn: (f: Form) => Form) => void
}
type Tab = 'templates' | 'themes' | 'layout' | 'welcome' | 'thankyou'

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'templates', label: 'Templates', icon: <SwatchBook className="w-4 h-4" /> },
  { id: 'themes', label: 'Themes', icon: <Palette className="w-4 h-4" /> },
  { id: 'layout', label: 'Layout', icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'welcome', label: 'Welcome', icon: <Hand className="w-4 h-4" /> },
  { id: 'thankyou', label: 'Thank you', icon: <CheckCircle2 className="w-4 h-4" /> },
]

const PREVIEW_TABS: { id: 'preview' | 'welcome' | 'thankyou'; label: string }[] = [
  { id: 'preview', label: 'Form' }, { id: 'welcome', label: 'Welcome' }, { id: 'thankyou', label: 'Thank you' },
]
const PREVIEW_MAP: Record<Tab, 'preview' | 'welcome' | 'thankyou'> = {
  templates: 'preview', themes: 'preview', layout: 'preview', welcome: 'welcome', thankyou: 'thankyou',
}

export function BuilderDesign({ form, design, onUpdate, onFormPatch }: Props) {
  const [subTab, setSubTab] = useState<Tab>('themes')
  const [previewTab, setPreviewTab] = useState<'preview' | 'welcome' | 'thankyou'>('preview')
  const set = (patch: Partial<DesignConfig>) => onUpdate({ ...design, ...patch })
  const handleTab = (id: Tab) => { setSubTab(id); setPreviewTab(PREVIEW_MAP[id]) }
  const handlePreview = (id: typeof previewTab) => { setPreviewTab(id); if (id !== 'preview') setSubTab(id) }
  return (
    <div className="flex flex-1 overflow-hidden">
      <aside className="w-48 border-r border-slate-200 bg-white flex flex-col shrink-0 overflow-y-auto">
        <nav className="p-3 space-y-0.5">
          {TABS.map(({ id, label, icon }) => (
            <button key={id} onClick={() => handleTab(id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition text-left ${
                subTab === id ? 'bg-violet-50 text-violet-700' : 'text-slate-600 hover:bg-slate-50'
              }`}>
              {icon}
              {label}
            </button>
          ))}
        </nav>
        <div className="border-t border-slate-100 p-4 space-y-4 mt-2">
          {subTab === 'themes' && (
            <>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Primary color</p>
                <div className="flex flex-wrap gap-2">
                  {PRIMARY_COLORS.map(c => (
                    <button key={c} onClick={() => set({ primary_color: c })} style={{ background: c }}
                      className="w-7 h-7 rounded-full border-2 transition flex items-center justify-center" title={c}>
                      {design.primary_color === c && (
                        <svg viewBox="0 0 20 20" fill="white" className="w-3 h-3">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
                <label className="flex items-center gap-1.5 border border-slate-200 rounded-lg px-2 py-1.5 mt-2 cursor-pointer hover:border-violet-300 transition">
                  <input type="color" value={design.primary_color}
                    onChange={e => set({ primary_color: e.target.value })}
                    className="w-5 h-5 rounded cursor-pointer border-none bg-transparent p-0 shrink-0" />
                  <input type="text" value={design.primary_color} maxLength={7}
                    onChange={e => { const v = e.target.value; if (/^#[0-9a-fA-F]{6}$/.test(v)) set({ primary_color: v }) }}
                    className="flex-1 text-xs font-mono uppercase text-slate-700 outline-none bg-transparent w-0" />
                </label>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Background</p>
                <div className="flex flex-wrap gap-2">
                  {BG_COLORS.map(c => (
                    <button key={c} onClick={() => set({ background_color: c })}
                      style={{ background: c, border: design.background_color === c ? '2.5px solid #7C3AED' : '2px solid #E2E8F0' }}
                      className="w-7 h-7 rounded-full transition" title={c} />
                  ))}
                </div>
              </div>
            </>
          )}
          {subTab === 'layout' && (
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Page layout</p>
              {([
                ['form_width','Form width',[['narrow','Narrow (600px)'],['medium','Medium (800px)'],['wide','Wide (1000px)'],['full','Full width']]],
                ['page_padding','Page padding',[['none','None'],['small','Small'],['medium','Medium'],['large','Large'],['extra_large','Extra large']]],
                ['question_spacing','Question spacing',[['compact','Compact'],['standard','Standard'],['comfortable','Comfortable'],['spacious','Spacious']]],
                ['border_radius','Border radius',[['none','None'],['small','Small'],['medium','Medium'],['large','Large'],['full','Full']]],
              ] as [keyof DesignConfig, string, [string,string][]][]).map(([key,label,opts]) => (
                <div key={key as string}>
                  <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
                  <select value={String(design[key])} onChange={e => set({ [key]: e.target.value } as any)}
                    className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:border-violet-400">
                    {opts.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
              ))}
            </div>
          )}
          {subTab === 'welcome' && (
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Show welcome screen</label>
              <Tog checked={design.welcome_enabled !== false}
                onChange={v => set({ welcome_enabled: v })} />
            </div>
          )}
          {subTab === 'thankyou' && (
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Show submit button</label>
              <Tog checked={design.thankyou_show_button !== false}
                onChange={v => set({ thankyou_show_button: v })} />
            </div>
          )}
        </div>
      </aside>

      {subTab === 'templates' ? <DesignTemplates d={design} set={set} /> :
       subTab === 'themes' ? <ThemesCenter d={design} set={set} formId={form.id} hasPageBreaks={form.questions.some(q => q.type === 'page_break')} /> :
       subTab === 'layout' ? <LayoutCenter d={design} set={set} formId={form.id} /> :
       subTab === 'welcome' ? <WelcomeConfig design={design} formId={form.id} onDesignPatch={set} /> :
       subTab === 'thankyou' && onFormPatch ?
         <ThankyouConfig design={design} form={form} onFormPatch={onFormPatch} onDesignPatch={set} /> : null}

      <aside className="w-64 border-l border-slate-200 bg-white flex flex-col shrink-0 overflow-hidden">
        <div className="flex border-b border-slate-200 shrink-0">
          {PREVIEW_TABS.map(t => (
            <button key={t.id} onClick={() => handlePreview(t.id)}
              className={`flex-1 py-3 text-xs font-semibold border-b-2 -mb-px transition ${
                previewTab === t.id ? 'text-violet-600 border-violet-500' : 'text-slate-500 border-transparent hover:text-slate-700'
              }`}>
              {t.label}
            </button>
          ))}
        </div>
        {previewTab === 'preview' && <FormPreview form={form} design={design} />}
        {previewTab === 'welcome' && <WelcomePreview form={form} design={design} />}
        {previewTab === 'thankyou' && <ThankyouPreview form={form} design={design} />}
      </aside>
    </div>)
}