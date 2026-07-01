'use client'
import { useState } from 'react'
import type { Form, IntegrationsConfig, IntegrationsWebhook } from '@/lib/types'

function Tog({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full transition-colors shrink-0 relative ${checked ? 'bg-violet-500' : 'bg-slate-200'}`}>
      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${checked ? 'left-6' : 'left-1'}`} />
    </button>
  )
}

function Section({ title, desc, open, onToggle, children }: {
  title: string; desc: string; open: boolean; onToggle: () => void; children: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <button onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50/50 transition">
        <div>
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
        </div>
        <svg viewBox="0 0 20 20" fill="currentColor"
          className={`w-5 h-5 text-slate-400 transition-transform shrink-0 ${open ? 'rotate-180' : ''}`}>
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      {open && <div className="px-6 pb-4 border-t border-slate-100">{children}</div>}
    </div>
  )
}

export default function IntegrationsPanel({ form, onPatch }: {
  form: Form
  onPatch: (fn: (f: Form) => Form) => void
}) {
  const [webhooksOpen, setWebhooksOpen] = useState(false)
  const [sheetsOpen, setSheetsOpen] = useState(false)
  const [zapierOpen, setZapierOpen] = useState(false)
  const [emailExportOpen, setEmailExportOpen] = useState(false)

  const ic: IntegrationsConfig = {
    webhooks:      form.integrations_config?.webhooks      ?? [],
    google_sheets: form.integrations_config?.google_sheets ?? { enabled: false, sheet_id: '' },
    zapier:        form.integrations_config?.zapier        ?? { enabled: false, webhook_url: '' },
    email_export:  form.integrations_config?.email_export  ?? { enabled: false, schedule: 'daily' as const, email: '' },
  }

  function patch(delta: Partial<IntegrationsConfig>) {
    onPatch(f => ({
      ...f,
      integrations_config: { ...(f.integrations_config ?? ic), ...delta },
    }))
  }

  function addWebhook() {
    patch({ webhooks: [...ic.webhooks, { url: '', enabled: true }] })
  }

  function updateWebhook(i: number, delta: Partial<IntegrationsWebhook>) {
    const w = [...ic.webhooks]
    w[i] = { ...w[i], ...delta }
    patch({ webhooks: w })
  }

  function removeWebhook(i: number) {
    patch({ webhooks: ic.webhooks.filter((_, idx) => idx !== i) })
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Integrations</h2>
        <p className="text-sm text-slate-500 mt-1">Connect your form to external tools and services.</p>
      </div>

      <Section title="Webhooks" desc="POST new responses to a custom URL" open={webhooksOpen} onToggle={() => setWebhooksOpen(o => !o)}>
        <div className="pt-4 space-y-3">
          {ic.webhooks.map((w, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={w.url}
                onChange={e => updateWebhook(i, { url: e.target.value })}
                placeholder="https://example.com/webhook"
                className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-violet-400 bg-white"
              />
              <Tog checked={w.enabled} onChange={v => updateWebhook(i, { enabled: v })} />
              <button onClick={() => removeWebhook(i)}
                className="text-slate-400 hover:text-red-500 transition p-1">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
              </button>
            </div>
          ))}
          <button onClick={addWebhook}
            className="text-sm font-semibold text-violet-600 hover:text-violet-700 transition">
            + Add webhook
          </button>
          <p className="text-xs text-slate-400">Webhook delivery requires backend processing &mdash; configure the endpoint URL above</p>
        </div>
      </Section>

      <Section title="Google Sheets" desc="Auto-sync responses to a Google Sheet" open={sheetsOpen} onToggle={() => setSheetsOpen(o => !o)}>
        <div className="pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-700">Enable Google Sheets sync</p>
            <Tog checked={ic.google_sheets.enabled} onChange={v => patch({ google_sheets: { ...ic.google_sheets, enabled: v } })} />
          </div>
          {ic.google_sheets.enabled && (
            <input
              value={ic.google_sheets.sheet_id}
              onChange={e => patch({ google_sheets: { ...ic.google_sheets, sheet_id: e.target.value } })}
              placeholder="Google Sheet ID or URL"
              className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-violet-400 bg-white"
            />
          )}
          <p className="text-xs text-slate-400">Requires Google Sheets API setup &mdash; configure credentials separately</p>
        </div>
      </Section>

      <Section title="Zapier / Make" desc="Connect via Zapier or Make.com" open={zapierOpen} onToggle={() => setZapierOpen(o => !o)}>
        <div className="pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-700">Enable Zapier / Make integration</p>
            <Tog checked={ic.zapier.enabled} onChange={v => patch({ zapier: { ...ic.zapier, enabled: v } })} />
          </div>
          {ic.zapier.enabled && (
            <input
              value={ic.zapier.webhook_url}
              onChange={e => patch({ zapier: { ...ic.zapier, webhook_url: e.target.value } })}
              placeholder="Zapier or Make webhook URL"
              className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-violet-400 bg-white"
            />
          )}
          <p className="text-xs text-slate-400">Create a Zap or Scenario in Make that listens for webhook data</p>
        </div>
      </Section>

      <Section title="Email export" desc="Auto-email CSV exports on a schedule" open={emailExportOpen} onToggle={() => setEmailExportOpen(o => !o)}>
        <div className="pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-700">Enable scheduled email export</p>
            <Tog checked={ic.email_export.enabled} onChange={v => patch({ email_export: { ...ic.email_export, enabled: v } })} />
          </div>
          {ic.email_export.enabled && (
            <>
              <input
                value={ic.email_export.email}
                onChange={e => patch({ email_export: { ...ic.email_export, email: e.target.value } })}
                placeholder="Export email recipient"
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-violet-400 bg-white"
              />
              <select
                value={ic.email_export.schedule}
                onChange={e => patch({ email_export: { ...ic.email_export, schedule: e.target.value as 'daily' | 'weekly' | 'monthly' } })}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-violet-400 bg-white"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </>
          )}
        </div>
      </Section>
    </div>
  )
}
