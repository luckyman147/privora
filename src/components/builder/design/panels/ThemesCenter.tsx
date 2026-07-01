'use client'
import { useState } from 'react'
import type { DesignConfig } from '@/lib/types'
import { THEME_PRESETS, SectionToggle, Row, Select, Tog } from '../primitives'
import { HeaderSettings } from './themes/HeaderSettings'

export function ThemesCenter({ d, set, formId }: { d: DesignConfig; set: (p: Partial<DesignConfig>) => void; formId: string }) {
  const [o, setO] = useState<Record<string,boolean>>({ fonts: true, header: false, questions: false, buttons: false, progress: false, anim: false })
  const tog = (k: string) => setO(p => ({ ...p, [k]: !p[k] }))

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-1">
      <div className="mb-4">
        <h2 className="text-sm font-bold text-slate-900">Customize your form appearance</h2>
        <p className="text-xs text-slate-400 mt-0.5">Changes you make here will be visible to respondents.</p>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {THEME_PRESETS.map(t => (
          <button key={t.id} onClick={() => set({ theme: t.id, ...t.patch })}
            className={`relative flex flex-col items-center gap-2 p-2 rounded-xl border-2 transition ${d.theme === t.id ? 'border-violet-500' : 'border-slate-200 hover:border-slate-300'}`}>
            {d.theme === t.id && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-violet-500 rounded-full flex items-center justify-center">
                <svg viewBox="0 0 20 20" fill="white" className="w-2.5 h-2.5">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
            )}
            <div className="w-full h-12 rounded-lg overflow-hidden border border-slate-100">
              <div className="h-4" style={{ background: `linear-gradient(90deg,${t.p},#a855f7)` }} />
              <div className="p-1 space-y-1" style={{ background: t.bg }}>
                <div className="h-1.5 rounded-full bg-slate-200 w-3/4" />
                <div className="h-1 rounded-full bg-slate-100 w-1/2" />
              </div>
            </div>
            <span className={`text-[11px] font-semibold ${d.theme === t.id ? 'text-violet-700' : 'text-slate-600'}`}>{t.label}</span>
          </button>
        ))}
      </div>

      <div className="border-t border-slate-100" />
      <SectionToggle label="Fonts" open={o.fonts} onToggle={() => tog('fonts')} extra={<span className="text-slate-400">Aa</span>} />
      {o.fonts && (
        <div className="space-y-3 pb-3">
          <Row label="Heading font">
            <Select value={d.heading_font} onChange={v => set({ heading_font: v })}
              options={['Poppins','Inter','Nunito','Roboto','Open Sans','System'].map(v => ({ value: v, label: v }))} />
          </Row>
          <Row label="Body font">
            <Select value={d.body_font} onChange={v => set({ body_font: v })}
              options={['Inter','Poppins','Nunito','Roboto','Open Sans','System'].map(v => ({ value: v, label: v }))} />
          </Row>
          <Row label="Base size">
            <Select value={d.base_size} onChange={v => set({ base_size: v })}
              options={['14px','16px','18px'].map(v => ({ value: v, label: v }))} />
          </Row>
        </div>
      )}

      <div className="border-t border-slate-100" />
      <SectionToggle label="Header style" open={o.header} onToggle={() => tog('header')} />
      {o.header && <HeaderSettings d={d} set={set} formId={formId} />}

      <div className="border-t border-slate-100" />
      <SectionToggle label="Questions style" open={o.questions} onToggle={() => tog('questions')} />
      {o.questions && (
        <div className="space-y-3 pb-3">
          <Row label="Layout">
            <Select value={d.question_layout ?? 'cards'} onChange={v => set({ question_layout: v as any })}
              options={[{value:'cards',label:'Individual cards'},{value:'shared',label:'Shared container'},{value:'minimal',label:'Open / No container'}]} />
          </Row>
          <Row label="Card style">
            <Select value={d.card_style} onChange={v => set({ card_style: v as any })}
              options={[{value:'soft_shadow',label:'Soft shadow'},{value:'border',label:'Border'},{value:'flat',label:'Flat'}]} />
          </Row>
          <Row label="Corner radius">
            <Select value={d.corner_radius} onChange={v => set({ corner_radius: v as any })}
              options={['None','Small','Medium','Large','Full'].map(v => ({ value: v.toLowerCase(), label: v }))} />
          </Row>
        </div>
      )}

      <div className="border-t border-slate-100" />
      <SectionToggle label="Buttons style" open={o.buttons} onToggle={() => tog('buttons')} />
      {o.buttons && (
        <div className="space-y-3 pb-3">
          <Row label="Button shape">
            <Select value={d.button_shape} onChange={v => set({ button_shape: v as any })}
              options={[{value:'rounded',label:'Rounded'},{value:'square',label:'Square'},{value:'pill',label:'Pill'}]} />
          </Row>
          <Row label="Button size">
            <Select value={d.button_size} onChange={v => set({ button_size: v as any })}
              options={['Small','Medium','Large'].map(v => ({ value: v.toLowerCase(), label: v }))} />
          </Row>
          <div className="flex justify-center">
            <button className="text-xs font-semibold text-white px-5 py-2 transition"
              style={{ background: d.primary_color, borderRadius: d.button_shape === 'pill' ? '9999px' : d.button_shape === 'square' ? '0' : '8px' }}>
              Button
            </button>
          </div>
        </div>
      )}

      <div className="border-t border-slate-100" />
      <div className="flex items-center justify-between py-3">
        <span className="text-sm font-semibold text-slate-800">Progress bar</span>
        <Tog checked={d.progress_bar} onChange={v => set({ progress_bar: v })} />
      </div>
      {d.progress_bar && (
        <div className="space-y-3 pb-3">
          <Row label="Style">
            <Select value={d.progress_style} onChange={v => set({ progress_style: v as any })}
              options={[{value:'line',label:'Line'},{value:'bar',label:'Bar'}]} />
          </Row>
          <Row label="Color">
            <div className="flex items-center gap-2">
              <input type="color" value={d.progress_color} onChange={e => set({ progress_color: e.target.value })}
                className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer p-0.5 bg-white" />
              <span className="text-xs text-slate-600 uppercase font-mono">{d.progress_color}</span>
            </div>
          </Row>
        </div>
      )}

      <div className="border-t border-slate-100" />
      <div className="flex items-center justify-between py-3">
        <span className="text-sm font-semibold text-slate-800">Animations</span>
        <Tog checked={d.animations} onChange={v => set({ animations: v })} />
      </div>
      {d.animations && (
        <div className="space-y-3 pb-3">
          <Row label="Page transition">
            <Select value={d.page_transition} onChange={v => set({ page_transition: v as any })}
              options={[{value:'fade',label:'Fade'},{value:'slide',label:'Slide'},{value:'none',label:'None'}]} />
          </Row>
          <Row label="Element animation">
            <Select value={d.element_animation} onChange={v => set({ element_animation: v as any })}
              options={[{value:'slide_up',label:'Slide up'},{value:'fade',label:'Fade'},{value:'none',label:'None'}]} />
          </Row>
        </div>
      )}
    </div>
  )
}
