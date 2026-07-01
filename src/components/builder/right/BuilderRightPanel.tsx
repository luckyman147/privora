'use client'
import type { TrustConfig } from '@/lib/types'

const TRUST_FIELDS: {
  key: keyof TrustConfig
  label: string
  options: { value: string; label: string }[]
}[] = [
  {
    key: 'visibility',
    label: 'Results visibility',
    options: [
      { value: 'creator_only', label: 'Creator only' },
      { value: 'org',          label: 'Organization' },
      { value: 'public',       label: 'Public' },
    ],
  },
  {
    key: 'identity',
    label: 'Respondent identity',
    options: [
      { value: 'anonymous', label: 'Anonymous' },
      { value: 'optional',  label: 'Optional' },
      { value: 'required',  label: 'Required' },
    ],
  },
  {
    key: 'ip_storage',
    label: 'IP address',
    options: [
      { value: 'none',   label: 'Not stored' },
      { value: 'hashed', label: 'Hashed only' },
      { value: 'stored', label: 'Stored' },
    ],
  },
  {
    key: 'submission_limit',
    label: 'Submission limit',
    options: [
      { value: 'one',       label: '1 per person' },
      { value: 'unlimited', label: 'Unlimited' },
    ],
  },
  {
    key: 'retention_days',
    label: 'Data retention',
    options: [
      { value: '30',  label: '30 days' },
      { value: '90',  label: '90 days' },
      { value: '180', label: '6 months' },
      { value: '365', label: '1 year' },
    ],
  },
]

interface Props {
  trustConfig:   TrustConfig
  onUpdateTrust: (patch: Partial<TrustConfig>) => void
}

export function BuilderRightPanel({ trustConfig, onUpdateTrust }: Props) {
  if (!trustConfig) return <aside className="w-60 border-l border-slate-200 bg-white shrink-0" />

  return (
    <aside className="w-60 border-l border-slate-200 bg-white flex flex-col shrink-0 overflow-y-auto">
      <div className="p-5 space-y-6">
        <h2 className="text-sm font-bold text-slate-900">Form Settings</h2>

        <div className="space-y-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Privacy &amp; Trust</p>
          {TRUST_FIELDS.map(field => (
            <div key={field.key as string}>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">{field.label}</label>
              <select
                value={String(trustConfig[field.key])}
                onChange={e => {
                  const raw = e.target.value
                  const val = field.key === 'retention_days' ? (parseInt(raw) as 30 | 90 | 180 | 365) : raw
                  onUpdateTrust({ [field.key]: val } as Partial<TrustConfig>)
                }}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-sky-400 bg-white">
                {field.options.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-100" />

        <div className="space-y-2.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Score preview</p>
          {[
            { label: 'Visibility',  good: trustConfig.visibility === 'creator_only', text: (trustConfig.visibility ?? '').replace('_', ' ') },
            { label: 'Identity',    good: trustConfig.identity === 'anonymous',        text: trustConfig.identity ?? '' },
            { label: 'IP',          good: trustConfig.ip_storage === 'none',           text: (trustConfig.ip_storage ?? '').replace('_', ' ') },
            { label: 'Submissions', good: trustConfig.submission_limit === 'one',      text: trustConfig.submission_limit ?? '' },
            { label: 'Retention',   good: (trustConfig.retention_days ?? 999) <= 90,  text: trustConfig.retention_days ? `${trustConfig.retention_days}d` : '—' },
          ].map(row => (
            <div key={row.label} className="flex items-center justify-between gap-2">
              <span className="text-xs text-slate-500">{row.label}</span>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-700 capitalize">{row.text}</span>
                <span className={`w-2 h-2 rounded-full shrink-0 ${row.good ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
