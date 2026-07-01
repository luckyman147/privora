'use client'
import { useEffect, useState } from 'react'
import { listTemplates, saveAsTemplate, updateTemplate, deleteTemplate } from '@/app/builder/actions'
import { toast } from 'sonner'
import { TYPE_META, TYPE_META_EXTRA } from '../meta'
import type { Question } from '@/lib/types'

interface Tpl { id: string; name: string; description: string; icon: string; category: string; questions: Question[]; is_primitive: boolean }
interface Props { currentQuestions: Question[]; onApplyTemplate: (questions: Omit<Question, 'id'>[]) => void }

const CATS = ['all', 'feedback', 'events', 'hr', 'education', 'general']
const ALL_M = { ...TYPE_META, ...TYPE_META_EXTRA } as Record<string, { label: string; color: string }>

export function TemplateTab({ currentQuestions, onApplyTemplate }: Props) {
  const [templates, setTemplates] = useState<Tpl[]>([])
  const [cat, setCat] = useState('all')
  const [q, setQ] = useState('')
  const [pv, setPv] = useState<Tpl | null>(null)
  const [modal, setModal] = useState<{ mode: 'save' | 'edit'; id?: string } | null>(null)
  const [sName, setSName] = useState('')
  const [sDesc, setSDesc] = useState('')
  const [sync, setSync] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    (async () => { try { setTemplates(await listTemplates() as Tpl[]) } catch { toast.error('Failed to load templates') } })()
  }, [])

  const filtered = templates.filter(t => (cat === 'all' || t.category === cat) && (!q || t.name.toLowerCase().includes(q.toLowerCase())))
  const handleSubmit = async () => {
    if (!sName.trim()) { toast.error('Template name is required'); return }
    setBusy(true)
    try {
      if (modal?.mode === 'save') await saveAsTemplate(sName.trim(), sDesc.trim(), currentQuestions)
      else if (modal?.id) {
        const p: any = { name: sName.trim(), description: sDesc.trim() }
        if (sync) p.questions = currentQuestions
        await updateTemplate(modal.id, p)
      }
      toast.success(modal?.mode === 'save' ? 'Template saved!' : 'Template updated')
      setModal(null); setTemplates(await listTemplates() as Tpl[])
    } catch { toast.error('Operation failed') }
    finally { setBusy(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this template?')) return
    try { await deleteTemplate(id); toast.success('Template deleted'); setTemplates(await listTemplates() as Tpl[]) }
    catch { toast.error('Failed to delete') }
  }

  return (
    <div className="p-4 space-y-3">
      <button onClick={() => { setSName(''); setSDesc(''); setSync(false); setModal({ mode: 'save' }) }}
        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold rounded-xl transition">
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" /></svg>
        Save current as template
      </button>

      <input placeholder="Search templates…" value={q} onChange={e => setQ(e.target.value)}
        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-sky-400" />

      <div className="flex gap-1.5 flex-wrap">
        {CATS.map(c => (
          <button key={c} onClick={() => setCat(c)}
            className={`px-2.5 py-1 text-[10px] font-semibold rounded-full transition capitalize ${cat === c ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>{c}</button>
        ))}
      </div>

      <p className="text-xs text-slate-500">{filtered.length} template{filtered.length !== 1 ? 's' : ''}</p>

      <div className="space-y-2">
        {filtered.map(tpl => (
          <div key={tpl.id} className="p-3 rounded-xl border border-slate-200 hover:border-sky-400 transition group">
            <button onClick={() => setPv(tpl)} className="w-full text-left">
              <div className="flex items-start gap-3">
                <span className="text-lg shrink-0">{tpl.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 group-hover:text-sky-700 transition truncate">{tpl.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{tpl.description}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${tpl.is_primitive ? 'text-amber-600 bg-amber-50 border border-amber-200' : 'text-sky-600 bg-sky-50 border border-sky-200'}`}>{tpl.is_primitive ? 'Primitive' : 'You'}</span>
                    <span className="text-[10px] text-slate-400">{tpl.questions.length} questions</span>
                  </div>
                </div>
              </div>
            </button>
            {!tpl.is_primitive && (
              <div className="flex gap-2 mt-2 pt-2 border-t border-slate-100">
                <button onClick={() => { setSName(tpl.name); setSDesc(tpl.description ?? ''); setSync(false); setModal({ mode: 'edit', id: tpl.id }) }} className="text-xs font-semibold text-slate-500 hover:text-sky-600 transition">Edit</button>
                <button onClick={() => handleDelete(tpl.id)} className="text-xs font-semibold text-slate-500 hover:text-red-600 transition">Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {pv && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)' }} onClick={() => setPv(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, width: 480, maxWidth: '90vw', maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <div style={{ padding: '20px 24px 0' }}>
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl shrink-0">{pv.icon}</span>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>{pv.name}</h3>
                  {pv.description && <p style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{pv.description}</p>}
                  <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{pv.questions.length} question{pv.questions.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px' }}>
              {pv.questions.map((q, i) => {
                const m = ALL_M[q.type]
                return (
                  <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', minWidth: 20 }}>{i + 1}.</span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${m?.color ?? 'bg-slate-100 text-slate-500'}`}>{m?.label ?? q.type}</span>
                      {q.required && <span style={{ fontSize: 11, color: '#f87171' }}>*</span>}
                    </div>
                    <p style={{ fontSize: 13, color: '#0f172a', paddingLeft: 20 }}>{q.label}</p>
                    {q.options && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, paddingLeft: 20, marginTop: 4 }}>
                        {q.options.map(o => <span key={o} style={{ fontSize: 11, color: '#64748b', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 4, padding: '1px 6px' }}>{o}</span>)}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: 12 }}>
              <button onClick={() => setPv(null)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">Cancel</button>
              <button onClick={() => { setPv(null); onApplyTemplate(pv.questions) }} className="flex-1 py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold rounded-xl transition">Apply template</button>
            </div>
          </div>
        </div>
      )}

      {modal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)' }} onClick={() => setModal(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, padding: 24, width: 400, maxWidth: '90vw', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>{modal.mode === 'save' ? 'Save as template' : 'Edit template'}</h3>
            <input placeholder="Template name" value={sName} onChange={e => setSName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm mb-3 focus:outline-none focus:border-sky-400" />
            <textarea placeholder="Description (optional)" value={sDesc} onChange={e => setSDesc(e.target.value)} rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm mb-4 focus:outline-none focus:border-sky-400 resize-none" />
            {modal.mode === 'edit' && (
              <label className="flex items-center gap-2 mb-4 cursor-pointer">
                <input type="checkbox" checked={sync} onChange={e => setSync(e.target.checked)}
                  className="accent-sky-500 w-4 h-4" />
                <span className="text-xs text-slate-600">Replace questions with current form questions</span>
              </label>
            )}
            <div className="flex gap-3">
              <button onClick={() => setModal(null)} className="flex-1 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">Cancel</button>
              <button onClick={handleSubmit} disabled={busy} className="flex-1 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold rounded-lg transition disabled:opacity-50">{busy ? 'Saving…' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
