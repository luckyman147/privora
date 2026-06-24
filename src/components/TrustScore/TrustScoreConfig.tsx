'use client'
import type { TrustConfig } from '@/lib/types'

interface Props {
  config: TrustConfig
  onChange: (config: TrustConfig) => void
}

export function TrustScoreConfig({ config, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 block">Visibility</label>
        <select value={config.visibility} onChange={e => onChange({ ...config, visibility: e.target.value as TrustConfig['visibility'] })}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white">
          <option value="creator_only">Creator only</option>
          <option value="org">Organization</option>
          <option value="public">Public</option>
        </select>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 block">Identity</label>
        <select value={config.identity} onChange={e => onChange({ ...config, identity: e.target.value as TrustConfig['identity'] })}>
          <option value="anonymous">Anonymous</option>
          <option value="optional">Optional</option>
          <option value="required">Required</option>
        </select>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 block">IP Storage</label>
        <select value={config.ip_storage} onChange={e => onChange({ ...config, ip_storage: e.target.value as TrustConfig['ip_storage'] })}>
          <option value="none">Not stored</option>
          <option value="hashed">Hashed only</option>
          <option value="stored">Stored</option>
        </select>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 block">Submission Limit</label>
        <select value={config.submission_limit} onChange={e => onChange({ ...config, submission_limit: e.target.value as TrustConfig['submission_limit'] })}>
          <option value="one">1 per person</option>
          <option value="unlimited">Unlimited</option>
        </select>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 block">Retention</label>
        <select value={config.retention_days} onChange={e => onChange({ ...config, retention_days: Number(e.target.value) as TrustConfig['retention_days'] })}>
          <option value={30}>30 days</option>
          <option value={90}>90 days</option>
          <option value={180}>180 days</option>
          <option value={365}>365 days</option>
        </select>
      </div>
    </div>
  )
}
