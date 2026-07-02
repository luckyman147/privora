'use client'
import type { DesignConfig } from '@/lib/types'

interface Template {
  id: string; name: string; desc: string
  colors: string[]; patch: Partial<DesignConfig>
}

const TEMPLATES: Template[] = [
  { id: 'modern', name: 'Modern', desc: 'Clean purple gradient with soft shadows',
    colors: ['#7C3AED','#A855F7','#F6F7FB','#FFFFFF'],
    patch: { primary_color: '#7C3AED', background_color: '#F6F7FB', header_type: 'gradient', header_height: 'medium', header_title_color: '#FFFFFF', header_desc_color: '#E9D5FF', card_style: 'soft_shadow', corner_radius: 'large', border_radius: 'medium', question_layout: 'cards', button_shape: 'rounded', button_size: 'medium', heading_font: 'Poppins', body_font: 'Inter', base_size: '16px', progress_bar: true, progress_style: 'line', progress_color: '#7C3AED', animations: true, page_transition: 'fade', element_animation: 'slide_up', form_width: 'medium', page_padding: 'large', question_spacing: 'comfortable', background_type: 'solid' } },
  { id: 'soft', name: 'Soft', desc: 'Gentle pink with rounded cards',
    colors: ['#F472B6','#F9A8D4','#FFF1F5','#FFFFFF'],
    patch: { primary_color: '#F472B6', background_color: '#FFF1F5', header_type: 'solid', header_height: 'medium', header_title_color: '#FFFFFF', header_desc_color: '#FCE7F3', card_style: 'border', corner_radius: 'full', border_radius: 'large', question_layout: 'cards', button_shape: 'pill', button_size: 'medium', heading_font: 'Inter', body_font: 'Inter', base_size: '16px', progress_bar: true, progress_style: 'bar', progress_color: '#F472B6', animations: true, page_transition: 'fade', element_animation: 'slide_up', form_width: 'medium', page_padding: 'large', question_spacing: 'comfortable', background_type: 'solid' } },
  { id: 'minimal', name: 'Minimal', desc: 'Clean slate with flat design',
    colors: ['#64748B','#94A3B8','#FFFFFF','#F8FAFC'],
    patch: { primary_color: '#64748B', background_color: '#FFFFFF', header_type: 'none', header_height: 'small', card_style: 'flat', corner_radius: 'none', border_radius: 'small', question_layout: 'minimal', button_shape: 'square', button_size: 'small', heading_font: 'Inter', body_font: 'Inter', base_size: '15px', progress_bar: false, progress_style: 'line', progress_color: '#64748B', animations: false, page_transition: 'none', element_animation: 'none', form_width: 'narrow', page_padding: 'small', question_spacing: 'compact', background_type: 'solid' } },
  { id: 'bold', name: 'Bold', desc: 'Dark navy with gradient header',
    colors: ['#1E293B','#334155','#F8FAFC','#E2E8F0'],
    patch: { primary_color: '#1E293B', background_color: '#F8FAFC', header_type: 'gradient', header_height: 'large', header_title_color: '#FFFFFF', header_desc_color: '#CBD5E1', card_style: 'soft_shadow', corner_radius: 'small', border_radius: 'small', question_layout: 'cards', button_shape: 'square', button_size: 'large', heading_font: 'Poppins', body_font: 'Inter', base_size: '17px', progress_bar: true, progress_style: 'line', progress_color: '#1E293B', animations: true, page_transition: 'slide', element_animation: 'fade', form_width: 'wide', page_padding: 'medium', question_spacing: 'standard', background_type: 'solid' } },
  { id: 'ocean', name: 'Ocean', desc: 'Blue tones with smooth gradient',
    colors: ['#3B82F6','#60A5FA','#EFF6FF','#FFFFFF'],
    patch: { primary_color: '#3B82F6', background_color: '#EFF6FF', header_type: 'gradient', header_height: 'medium', header_title_color: '#FFFFFF', header_desc_color: '#BFDBFE', card_style: 'soft_shadow', corner_radius: 'large', border_radius: 'medium', question_layout: 'cards', button_shape: 'rounded', button_size: 'medium', heading_font: 'Inter', body_font: 'Inter', base_size: '16px', progress_bar: true, progress_style: 'line', progress_color: '#3B82F6', animations: true, page_transition: 'fade', element_animation: 'slide_up', form_width: 'medium', page_padding: 'large', question_spacing: 'comfortable', background_type: 'gradient', gradient_color_1: '#3B82F6', gradient_color_2: '#1D4ED8', gradient_angle: '135deg' } },
  { id: 'nature', name: 'Nature', desc: 'Green emerald with organic feel',
    colors: ['#22C55E','#4ADE80','#F0FDF4','#FFFFFF'],
    patch: { primary_color: '#22C55E', background_color: '#F0FDF4', header_type: 'solid', header_height: 'medium', header_title_color: '#FFFFFF', header_desc_color: '#BBF7D0', card_style: 'border', corner_radius: 'medium', border_radius: 'large', question_layout: 'shared', button_shape: 'rounded', button_size: 'medium', heading_font: 'Inter', body_font: 'Inter', base_size: '16px', progress_bar: true, progress_style: 'bar', progress_color: '#22C55E', animations: true, page_transition: 'fade', element_animation: 'slide_up', form_width: 'medium', page_padding: 'large', question_spacing: 'standard', background_type: 'solid' } },
  { id: 'sunset', name: 'Sunset', desc: 'Orange warmth with pill buttons',
    colors: ['#F97316','#FB923C','#FFF7ED','#FFFFFF'],
    patch: { primary_color: '#F97316', background_color: '#FFF7ED', header_type: 'gradient', header_height: 'medium', header_title_color: '#FFFFFF', header_desc_color: '#FED7AA', card_style: 'soft_shadow', corner_radius: 'full', border_radius: 'medium', question_layout: 'cards', button_shape: 'pill', button_size: 'large', heading_font: 'Poppins', body_font: 'Inter', base_size: '16px', progress_bar: true, progress_style: 'line', progress_color: '#F97316', animations: true, page_transition: 'slide', element_animation: 'slide_up', form_width: 'medium', page_padding: 'large', question_spacing: 'comfortable', background_type: 'gradient', gradient_color_1: '#F97316', gradient_color_2: '#EA580C', gradient_angle: '135deg' } },
  { id: 'crimson', name: 'Crimson', desc: 'Red energy with square corners',
    colors: ['#EF4444','#F87171','#FEF2F2','#FFFFFF'],
    patch: { primary_color: '#EF4444', background_color: '#FEF2F2', header_type: 'solid', header_height: 'medium', header_title_color: '#FFFFFF', header_desc_color: '#FECACA', card_style: 'flat', corner_radius: 'none', border_radius: 'small', question_layout: 'shared', button_shape: 'square', button_size: 'medium', heading_font: 'Inter', body_font: 'Inter', base_size: '16px', progress_bar: true, progress_style: 'bar', progress_color: '#EF4444', animations: true, page_transition: 'fade', element_animation: 'fade', form_width: 'medium', page_padding: 'medium', question_spacing: 'compact', background_type: 'solid' } },
]

export function DesignTemplates({ d, set }: { d: DesignConfig; set: (p: Partial<DesignConfig>) => void }) {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <h2 className="text-lg font-bold text-slate-900 mb-1">Design Templates</h2>
      <p className="text-sm text-slate-400 mb-6">Choose a pre-made design to instantly style your form</p>
      <div className="grid grid-cols-2 gap-4">
        {TEMPLATES.map(t => {
          const active = d.primary_color === t.patch.primary_color && d.card_style === t.patch.card_style
          return (
            <button key={t.id} onClick={() => set(t.patch)}
              className={`relative text-left rounded-xl border-2 p-4 transition hover:shadow-md ${active ? 'border-violet-500 bg-violet-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
              {active && <span className="absolute top-2 right-2 w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center">
                <svg viewBox="0 0 20 20" fill="white" className="w-3 h-3"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              </span>}
              <div className="flex gap-1.5 mb-3">
                {t.colors.map((c, i) => (
                  <div key={i} className="h-8 flex-1 rounded-lg first:rounded-l-xl last:rounded-r-xl" style={{ background: c }} />
                ))}
              </div>
              <h3 className="text-sm font-semibold text-slate-900">{t.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{t.desc}</p>
              <p className="text-[10px] text-slate-400 mt-1.5 font-medium tracking-wide">{t.colors[0]} · {t.patch.heading_font}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
