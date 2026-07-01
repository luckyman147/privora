import { cn } from '@/lib/utils'

const BADGE_STYLES: Record<string, string> = {
  active:     'bg-emerald-50 text-emerald-700 border-emerald-200',
  draft:      'bg-amber-50  text-amber-700  border-amber-200',
  closed:     'bg-red-50    text-red-600    border-red-200',
}

export function Badge({ variant }: { variant: string }) {
  return (
    <span className={cn('px-2.5 py-0.5 text-xs font-semibold rounded-full border capitalize', BADGE_STYLES[variant] ?? 'bg-slate-100 text-slate-600')}>
      {variant}
    </span>
  )
}
