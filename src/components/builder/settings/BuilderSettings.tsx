'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { archiveForm, deleteForm } from '@/app/builder/actions'
import type { Form, TrustConfig, DesignConfig } from '@/lib/types'
import { DEFAULT_DESIGN } from '../design'
import NotificationsPanel from './panels/NotificationsPanel'
import ResponsesPanel from './panels/ResponsesPanel'
import IntegrationsPanel from './panels/IntegrationsPanel'

function Tog({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full transition-colors shrink-0 relative ${checked ? 'bg-violet-500' : 'bg-slate-200'}`}>
      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${checked ? 'left-6' : 'left-1'}`} />
    </button>
  )
}

function FieldRow({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-6 py-3.5 border-b border-slate-100 last:border-none">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-800">{label}</p>
        {desc && <p className="text-xs text-slate-400 mt-0.5">{desc}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

function Section({ title, open, onToggle, children }: {
  title: string; open: boolean; onToggle: () => void; children: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <button onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50/50 transition">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        <svg viewBox="0 0 20 20" fill="currentColor"
          className={`w-5 h-5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}>
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      {open && <div className="px-6 pb-4 border-t border-slate-100">{children}</div>}
    </div>
  )
}

const NAV = [
  { id: 'general',       label: 'General',          sub: 'Basic form settings',       icon: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    </svg>
  )},
  { id: 'privacy',       label: 'Privacy & Security',sub: 'Control data and responses', icon: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  )},
  { id: 'notifications', label: 'Notifications',     sub: 'Email and alerts',           icon: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
    </svg>
  )},
  { id: 'responses',     label: 'Responses',         sub: 'Submission settings',        icon: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
    </svg>
  )},
  { id: 'integrations',  label: 'Integrations',      sub: 'Connect your tools',         icon: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  )},
  { id: 'premium',       label: 'Premium & Limits',  sub: 'Usage and plan',             icon: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  )},
  { id: 'advanced',      label: 'Advanced',          sub: 'Developer and other options', icon: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
    </svg>
  )},
]

function GeneralPanel({ form, onPatch }: {
  form: Form
  onPatch: (fn: (f: Form) => Form) => void
}) {
  const [open, setOpen] = useState({ details: true, submission: true })
  const tog = (k: keyof typeof open) => setOpen(o => ({ ...o, [k]: !o[k] }))

  const d = form.design_config ?? DEFAULT_DESIGN
  const tc = form.trust_config

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">General settings</h2>
        <p className="text-sm text-slate-500 mt-1">Manage the basic information and behavior of your form.</p>
      </div>

      <Section title="Form details" open={open.details} onToggle={() => tog('details')}>
        <div className="pt-4 space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-slate-700">Form title</label>
              <span className="text-xs text-slate-400">{form.title.length}/100</span>
            </div>
            <input value={form.title} maxLength={100}
              onChange={e => onPatch(f => ({ ...f, title: e.target.value }))}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition" />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-slate-700">Form description <span className="text-slate-400 font-normal">(optional)</span></label>
              <span className="text-xs text-slate-400">{(form.description ?? '').length}/500</span>
            </div>
            <textarea value={form.description ?? ''} rows={3} maxLength={500}
              onChange={e => onPatch(f => ({ ...f, description: e.target.value || undefined }))}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Form language</label>
              <select value={form.language ?? 'en'}
                onChange={e => onPatch(f => ({ ...f, language: e.target.value }))}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-violet-400 bg-white">
                {[['en','English'],['fr','French'],['ar','Arabic'],['es','Spanish'],['de','German'],['zh','Chinese']].map(([v,l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Form status</label>
              <div className="flex items-center justify-between px-3.5 py-2.5 border border-slate-200 rounded-xl">
                <span className={`text-sm font-semibold ${form.status === 'active' ? 'text-emerald-600' : 'text-slate-500'}`}>
                  {form.status === 'active' ? 'Active' : form.status === 'closed' ? 'Archived' : 'Draft'}
                </span>
                <Tog checked={form.status === 'active'}
                  onChange={v => onPatch(f => ({ ...f, status: v ? 'active' : 'draft' }))} />
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Submission settings" open={open.submission} onToggle={() => tog('submission')}>
        <div className="divide-y divide-slate-100">
          <div className="py-3.5 border-b border-slate-100">
            <p className="text-sm font-medium text-slate-800 mb-3">Response start date</p>
            <input type="datetime-local" value={form.opens_at ? form.opens_at.slice(0,16) : ''}
              onChange={e => onPatch(f => ({ ...f, opens_at: e.target.value ? new Date(e.target.value).toISOString() : undefined }))}
              className="px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-violet-400 bg-white" />
          </div>
          <div className="py-3.5 border-b border-slate-100">
            <p className="text-sm font-medium text-slate-800 mb-3">Response end date</p>
            <input type="datetime-local" value={form.closes_at ? form.closes_at.slice(0,16) : ''}
              onChange={e => onPatch(f => ({ ...f, closes_at: e.target.value ? new Date(e.target.value).toISOString() : undefined }))}
              className="px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-violet-400 bg-white" />
          </div>
        </div>
      </Section>
    </div>
  )
}

function PrivacyPanel({ form, onPatch }: { form: Form; onPatch: (fn: (f: Form) => Form) => void }) {
  const tc = form.trust_config
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Privacy &amp; Security</h2>
        <p className="text-sm text-slate-500 mt-1">Control how respondent data is handled and stored.</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 px-6 py-2 divide-y divide-slate-100">
        {[
          { key: 'identity',         label: 'Respondent identity',   opts: [['anonymous','Anonymous'],['optional','Optional (ask)'],['required','Required']] as [string,string][] },
          { key: 'submission_limit', label: 'Submission limit',       opts: [['unlimited','Unlimited'],['one','1 per person']] as [string,string][] },
        ].map(({ key, label, opts }) => (
          <div key={key} className="flex items-center justify-between py-3.5">
            <p className="text-sm font-medium text-slate-800">{label}</p>
            <select value={String(tc[key as keyof TrustConfig])}
              onChange={e => {
                const v = e.target.value
                onPatch(f => ({ ...f, trust_config: { ...f.trust_config, [key]: v } }))
              }}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-violet-400 bg-white">
              {opts.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
        ))}
        <div className="py-3.5 flex items-center justify-between">
          <p className="text-sm font-medium text-slate-800">Data retention period</p>
          <select value={String(tc.retention_days)}
            onChange={e => onPatch(f => ({ ...f, trust_config: { ...f.trust_config, retention_days: parseInt(e.target.value) as any } }))}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-violet-400 bg-white">
            {[['30','30 days'],['90','90 days'],['180','6 months'],['365','1 year']].map(([v,l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

function PlaceholderPanel({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-80 text-center gap-3">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-7 h-7 text-slate-300">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      </div>
      <p className="text-base font-semibold text-slate-700">{title}</p>
      <p className="text-sm text-slate-400">{sub}</p>
      <span className="text-xs font-semibold text-violet-600 bg-violet-50 border border-violet-200 px-3 py-1 rounded-full">Coming soon</span>
    </div>
  )
}

function FormSummary({ form, onArchive, onDelete }: {
  form: Form
  onArchive: () => Promise<void>
  onDelete: () => Promise<void>
}) {
  const [archiving, setArchiving] = useState(false)
  const [deleting,  setDeleting]  = useState(false)
  const [confirmDel, setConfirmDel] = useState(false)

  const realQs = (form.questions ?? []).filter(q => q.type !== 'section' && q.type !== 'page_break')
  const estMin = Math.max(1, Math.ceil(realQs.length * 0.5))

  const fmtDate = (iso?: string) => {
    if (!iso) return '—'
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  }
  const fmtFull = (iso?: string) => {
    if (!iso) return '—'
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
      ', ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }

  const shortId = (form.id ?? '').replace(/[^a-zA-Z0-9]/g, '').slice(0, 10)

  return (
    <aside className="w-72 shrink-0 border-l border-slate-200 bg-white flex flex-col overflow-y-auto">
      <div className="p-6 space-y-5">
        <h3 className="text-base font-bold text-slate-900">Form summary</h3>
        <div className="space-y-3">
          {[
            { icon: (
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-slate-400">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
              ), label: `${realQs.length}`, sub: 'Questions' },
            { icon: (
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-slate-400">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              ), label: `~ ${estMin} min`, sub: 'Estimated time' },
            { icon: (
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-slate-400">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              ), label: form.trust_config.identity === 'anonymous' ? 'Anonymous' : form.trust_config.identity === 'required' ? 'Identified' : 'Optional', sub: 'Response type' },
          ].map((row, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                {row.icon}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{row.label}</p>
                <p className="text-xs text-slate-400">{row.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-100 mx-6" />

      <div className="px-6 py-5 space-y-3">
        {[
          { label: 'Created',        value: fmtDate(form.created_at) },
          { label: 'Last updated',   value: fmtFull(form.updated_at) },
          { label: 'Total responses', value: '—' },
        ].map(row => (
          <div key={row.label} className="flex items-center justify-between">
            <span className="text-xs text-slate-500">{row.label}</span>
            <span className="text-xs font-semibold text-slate-700">{row.value}</span>
          </div>
        ))}
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">Form ID</span>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-mono font-semibold text-slate-700">f_{shortId}</span>
            <button onClick={() => { navigator.clipboard.writeText(form.id); toast.success('ID copied') }}
              className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-600 transition">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" /><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1" />

      <div className="border-t border-slate-200 p-6 space-y-3">
        <p className="text-sm font-bold text-red-600">Danger zone</p>
        <p className="text-xs text-slate-400">These actions can&apos;t be undone.</p>
        <button onClick={async () => {
          setArchiving(true)
          try { await onArchive(); toast.success('Form archived') }
          catch { toast.error('Failed to archive') }
          finally { setArchiving(false) }
        }} disabled={archiving}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition text-sm font-semibold disabled:opacity-50">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0 text-red-400">
            <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" /><path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
          {archiving ? 'Archiving…' : 'Archive form'}
        </button>
        {!confirmDel ? (
          <button onClick={() => setConfirmDel(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition text-sm font-semibold">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0 text-red-400">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Delete form
          </button>
        ) : (
          <div className="rounded-xl border-2 border-red-300 bg-red-50 p-3 space-y-2">
            <p className="text-xs font-semibold text-red-700">Delete this form permanently?</p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmDel(false)}
                className="flex-1 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-white transition">
                Cancel
              </button>
              <button onClick={async () => {
                setDeleting(true)
                try { await onDelete() }
                catch { toast.error('Failed to delete'); setDeleting(false); setConfirmDel(false) }
              }} disabled={deleting}
                className="flex-1 py-1.5 rounded-lg bg-red-600 text-xs font-semibold text-white hover:bg-red-700 transition disabled:opacity-50">
                {deleting ? 'Deleting…' : 'Yes, delete'}
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

interface Props {
  form:    Form
  onPatch: (fn: (f: Form) => Form) => void
}

export function BuilderSettings({ form, onPatch }: Props) {
  const router = useRouter()
  const [section, setSection] = useState('general')

  const panels: Record<string, React.ReactNode> = {
    general:       <GeneralPanel  form={form} onPatch={onPatch} />,
    privacy:       <PrivacyPanel  form={form} onPatch={onPatch} />,
    notifications: <NotificationsPanel form={form} onPatch={onPatch} />,
    responses:     <ResponsesPanel form={form} onPatch={onPatch} />,
    integrations:  <IntegrationsPanel form={form} onPatch={onPatch} />,
    premium:       <PlaceholderPanel title="Premium & Limits" sub="View your plan usage, upgrade, and manage billing." />,
    advanced:      <PlaceholderPanel title="Advanced options" sub="Embed code, API access, and developer settings." />,
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      <aside className="w-60 shrink-0 border-r border-slate-200 bg-white flex flex-col overflow-y-auto">
        <nav className="p-3 space-y-0.5 flex-1">
          {NAV.map(n => (
            <button key={n.id} onClick={() => setSection(n.id)}
              className={`w-full flex items-start gap-3 px-3 py-3 rounded-xl transition text-left ${
                section === n.id
                  ? 'bg-violet-50 text-violet-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}>
              <span className={`mt-0.5 shrink-0 ${section === n.id ? 'text-violet-500' : 'text-slate-400'}`}>
                {n.icon}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-tight">{n.label}</p>
                <p className="text-[11px] mt-0.5 leading-tight text-slate-400">{n.sub}</p>
              </div>
            </button>
          ))}
        </nav>

        <div className="m-3 mt-0 p-4 rounded-xl bg-violet-50 border border-violet-100">
          <p className="text-xs font-bold text-violet-800 mb-1">Quick help</p>
          <p className="text-[11px] text-violet-600 leading-relaxed mb-3">
            Learn more about each setting and how it affects your form.
          </p>
          <button className="flex items-center gap-1.5 text-xs font-semibold text-violet-700 hover:text-violet-900 transition">
            View docs
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" /><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
            </svg>
          </button>
        </div>
      </aside>

      <div className="flex-1 overflow-y-auto bg-slate-50">
        <div className="max-w-2xl mx-auto py-8 px-6">
          {panels[section]}
        </div>
      </div>

      <FormSummary
        form={form}
        onArchive={async () => {
          await archiveForm(form.id)
          onPatch(f => ({ ...f, status: 'closed' }))
        }}
        onDelete={async () => {
          await deleteForm(form.id)
          router.push('/dashboard')
        }}
      />
    </div>
  )
}
