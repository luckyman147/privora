import { calcTrustScore } from '@/lib/types'
import { TRUST_LABELS, trustScoreColor, cn } from '@/lib/utils'
import type { TrustConfig } from '@/lib/types'

interface Props {
  config:    TrustConfig
  formTitle?: string
  onAccept?: () => void
  compact?:  boolean
}

const ROWS: Array<{
  key: keyof TrustConfig;
  label: string;
  emoji: string;
  good: string[];
}> = [
  { key: 'visibility',       label: 'Visibility',       emoji: '👁',  good: ['creator_only'] },
  { key: 'identity',         label: 'Identity',         emoji: '👤', good: ['anonymous']   },
  { key: 'ip_storage',      label: 'IP Address',      emoji: '📍', good: ['none']        },
  { key: 'submission_limit', label: 'Submissions',     emoji: '🔄', good: ['one']         },
]

export function TrustScoreCard({ config, formTitle, onAccept, compact }: Props) {
  const score = calcTrustScore(config)
  const color = trustScoreColor(score)

  return (
    <div className={cn(
      'bg-white rounded-2xl border border-emerald-200 shadow-sm shadow-emerald-50',
      compact ? 'p-4' : 'p-6'
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-sky-500 flex items-center justify-center text-white text-sm font-bold">
            ✓
          </div>
          <div>
            <div className="font-bold text-slate-900 text-sm">Trust Score</div>
            {formTitle && <div className="text-xs text-slate-400">{formTitle}</div>}
          </div>
        </div>
        <div className="px-3 py-1 rounded-full text-sm font-bold border"
          style={{ color, borderColor: color + '40', background: color + '12' }}>
          {score} / 5
        </div>
      </div>

      {/* Rows */}
      <div className="space-y-2.5 mb-3">
        {ROWS.map(row => {
          const val      = config[row.key] as string
          const label    = (TRUST_LABELS[row.key] as any)[val] ?? val
          const isGood   = row.good.includes(val)
          return (
            <div key={row.key} className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span className="w-5 h-5 bg-slate-100 rounded flex items-center justify-center text-xs">{row.emoji}</span>
                {row.label}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-700">{label}</span>
                <span className="w-4 h-4 rounded-full flex items-center justify-center text-white text-xs"
                  style={{ background: isGood ? '#10B981' : '#F59E0B' }}>
                  {isGood ? '✓' : '!'}
                </span>
              </div>
            </div>
          )
        })}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="w-5 h-5 bg-slate-100 rounded flex items-center justify-center text-xs">📅</span>
            Data retention
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700">{config.retention_days} days</span>
            <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs">✓</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-400 border-t border-slate-100 pt-3 mb-4">
        This form is committed to transparency. Your data will never be sold or shared.
      </p>
      {onAccept && (
        <button onClick={onAccept}
          className="w-full py-3 text-sm font-bold text-white bg-sky-500 rounded-xl hover:bg-sky-600">
          Start survey →
        </button>
      )}
    </div>
  )
}
