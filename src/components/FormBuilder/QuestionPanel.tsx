'use client'
import type { QuestionType, TrustConfig } from '@/lib/types'

interface Props {
  onAdd: (type: QuestionType) => void
  trustConfig: TrustConfig
  onTrustChange: (cfg: TrustConfig) => void
}

const TYPES: { type: QuestionType; label: string }[] = [
  { type: 'short_text',      label: 'Short text' },
  { type: 'long_text',       label: 'Long text' },
  { type: 'multiple_choice', label: 'Multiple choice' },
  { type: 'checkboxes',      label: 'Checkboxes' },
  { type: 'rating',          label: 'Rating' },
  { type: 'dropdown',        label: 'Dropdown' },
  { type: 'matrix',          label: 'Matrix' },
]

export function QuestionPanel({ onAdd, trustConfig, onTrustChange }: Props) {
  return (
    <div className="w-56 bg-white border-r border-slate-200 p-4 overflow-y-auto shrink-0">
      <button onClick={() => onAdd('short_text')}
        className="w-full mb-4 py-2 text-sm font-bold text-white bg-sky-500 rounded-lg hover:bg-sky-600">
        + Add question
      </button>
      <div className="grid grid-cols-2 gap-2 mb-6">
        {TYPES.map(t => (
          <button key={t.type} onClick={() => onAdd(t.type)}
            className="py-2 text-[11px] font-semibold text-slate-500 bg-slate-50 rounded-lg hover:bg-slate-100 border border-slate-100">
            {t.label}
          </button>
        ))}
      </div>

      <div className="border-t border-slate-200 pt-4">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Trust Config</div>
        <div className="space-y-3">
          <div>
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">Visibility</label>
            <select value={trustConfig.visibility} onChange={e => onTrustChange({ ...trustConfig, visibility: e.target.value as TrustConfig['visibility'] })}
              className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg bg-white">
              <option value="creator_only">Creator only</option>
              <option value="org">Org</option>
              <option value="public">Public</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">Identity</label>
            <select value={trustConfig.identity} onChange={e => onTrustChange({ ...trustConfig, identity: e.target.value as TrustConfig['identity'] })}>
              <option value="anonymous">Anonymous</option>
              <option value="optional">Optional</option>
              <option value="required">Required</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">IP Storage</label>
            <select value={trustConfig.ip_storage} onChange={e => onTrustChange({ ...trustConfig, ip_storage: e.target.value as TrustConfig['ip_storage'] })}>
              <option value="none">None</option>
              <option value="hashed">Hashed</option>
              <option value="stored">Stored</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">Limit</label>
            <select value={trustConfig.submission_limit} onChange={e => onTrustChange({ ...trustConfig, submission_limit: e.target.value as TrustConfig['submission_limit'] })}>
              <option value="one">1 per person</option>
              <option value="unlimited">Unlimited</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">Retention</label>
            <select value={trustConfig.retention_days} onChange={e => onTrustChange({ ...trustConfig, retention_days: Number(e.target.value) as TrustConfig['retention_days'] })}>
              <option value={30}>30d</option>
              <option value={90}>90d</option>
              <option value={180}>180d</option>
              <option value={365}>365d</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
