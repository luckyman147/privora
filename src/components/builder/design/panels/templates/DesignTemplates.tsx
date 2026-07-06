'use client'
import { useState, useEffect } from 'react'
import type { DesignConfig } from '@/lib/types'
import { Plus, Trash2 } from 'lucide-react'
import { TEMPLATES, CATEGORIES } from './data'
import type { Template } from './data'

const STORAGE_KEY = 'privora_personal_templates'

interface PersonalTemplate {
  id: string; name: string; patch: Partial<DesignConfig>
}

function loadPersonal(): PersonalTemplate[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') }
  catch { return [] }
}

function MiniPreview({ patch, category }: { patch: Partial<DesignConfig>; category?: Template['category'] }) {
  const primary = patch.primary_color || '#7C3AED'
  const bg = patch.background_color || '#F6F7FB'
  const isImage = category === 'image' || patch.background_type === 'image'
  const imgUrl = (patch as any).background_image_url
  const hasGrad = category === 'gradient' || patch.background_type === 'gradient'
  const c1 = (patch as any).gradient_color_1 || primary
  const c2 = (patch as any).gradient_color_2 || '#a855f7'
  const ht = patch.header_type || 'gradient'
  const headerBg = ht === 'none' ? 'transparent'
    : ht === 'image' ? `url(${(patch as any).header_image_url}) center/cover`
    : hasGrad ? `linear-gradient(135deg, ${c1}, ${c2})` : primary
  return (
    <div className="w-full h-24 rounded-lg overflow-hidden border border-slate-200 relative"
      style={{ background: isImage && imgUrl ? `url(${imgUrl}) center/cover` : bg }}>
      {isImage && imgUrl && <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.35)' }} />}
      <div className="relative h-full flex flex-col">
        <div className="h-8 flex items-center px-2.5" style={{ background: headerBg }}>
          <div className="h-2.5 w-16 rounded-sm" style={{ background: 'rgba(255,255,255,0.5)' }} />
          <div className="h-1.5 w-10 rounded-sm ml-2" style={{ background: 'rgba(255,255,255,0.25)' }} />
        </div>
        <div className="flex-1 px-2.5 py-1.5 flex flex-col gap-1">
          <div className="rounded border border-slate-200 p-1.5 flex-1" style={{ background: '#fff' }}>
            <div className="h-1.5 rounded-full w-3/4" style={{ background: '#e2e8f0' }} />
            <div className="h-1 rounded-full w-1/2 mt-1" style={{ background: '#f1f5f9' }} />
          </div>
          <div className="h-4 rounded w-10 self-end" style={{ background: primary }} />
        </div>
      </div>
    </div>
  )
}

export function DesignTemplates({ d, set }: { d: DesignConfig; set: (p: Partial<DesignConfig>) => void }) {
  const [personal, setPersonal] = useState<PersonalTemplate[]>([])
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')

  useEffect(() => { setPersonal(loadPersonal()) }, [])

  function saveTemplate() {
    const n = name.trim() || `My Template ${personal.length + 1}`
    const next = [...personal, { id: `p_${Date.now()}`, name: n, patch: { ...d } }]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setPersonal(next)
    setName('')
    setSaving(false)
  }

  function deleteTemplate(id: string) {
    const next = personal.filter(p => p.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setPersonal(next)
  }

  const isActive = (p: Partial<DesignConfig>) =>
    d.primary_color === p.primary_color && d.card_style === p.card_style

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-bold text-slate-900">Design Templates</h2>
        {saving
          ? <div className="flex items-center gap-2">
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="Template name" autoFocus
                onKeyDown={e => e.key === 'Enter' && saveTemplate()}
                className="w-36 text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-violet-400" />
              <button onClick={saveTemplate} className="text-xs font-semibold text-violet-600 hover:text-violet-700">Save</button>
              <button onClick={() => setSaving(false)} className="text-xs text-slate-400 hover:text-slate-600">Cancel</button>
            </div>
          : <button onClick={() => setSaving(true)}
              className="flex items-center gap-1 text-xs font-semibold text-violet-600 hover:text-violet-700">
              <Plus className="w-3.5 h-3.5" /> Save current
            </button>}
      </div>
      <p className="text-sm text-slate-400 mb-5">Pick a style to instantly transform your form</p>

      {personal.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Personal
          </div>
          <div className="grid grid-cols-2 gap-3">
            {personal.map(p => (
              <div key={p.id} className="relative group">
                <button onClick={() => set(p.patch)}
                  className={`w-full text-left rounded-xl border-2 p-3 transition hover:shadow-md ${isActive(p.patch) ? 'border-violet-500 bg-violet-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                  <MiniPreview patch={p.patch} />
                  <h3 className="text-sm font-semibold text-slate-900 mt-2">{p.name}</h3>
                </button>
                <button onClick={() => deleteTemplate(p.id)}
                  className="absolute top-1 right-1 w-6 h-6 bg-white rounded-full border border-slate-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-red-50 hover:border-red-200 z-10">
                  <Trash2 className="w-3 h-3 text-red-400" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {CATEGORIES.map(cat => {
        const Icon = cat.icon
        const items = TEMPLATES.filter(t => t.category === cat.id)
        return (
          <div key={cat.id} className="mb-6 last:mb-0">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              <Icon className="w-3.5 h-3.5" />{cat.label}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {items.map(t => {
                const active = isActive(t.patch)
                return (
                  <button key={t.id} onClick={() => set(t.patch)}
                    className={`relative text-left rounded-xl border-2 p-3 transition hover:shadow-md ${active ? 'border-violet-500 bg-violet-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                    {active && <span className="absolute top-2 right-2 w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center z-10">
                      <svg viewBox="0 0 20 20" fill="white" className="w-3 h-3"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    </span>}
                    <MiniPreview patch={t.patch} category={t.category} />
                    <h3 className="text-sm font-semibold text-slate-900 mt-2">{t.name}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{t.desc}</p>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
