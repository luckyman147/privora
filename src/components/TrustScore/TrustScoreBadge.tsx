import { trustScoreColor, cn } from '@/lib/utils'

interface Props {
  score: number
  className?: string
}

export function TrustScoreBadge({ score, className }: Props) {
  const color = trustScoreColor(score)
  return (
    <div className={cn('flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold', className)}
      style={{ color, borderColor: color + '30', background: color + '10' }}>
      <span className="w-2 h-2 rounded-full" style={{ background: color }} />
      Trust Score: {score}/5
    </div>
  )
}
