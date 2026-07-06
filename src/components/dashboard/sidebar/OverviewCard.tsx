import type { ComponentType } from 'react'
import { Inbox, Zap, TrendingUp, ShieldCheck } from 'lucide-react'

type IconProps = { className?: string }
interface Stat { label: string; value: string; accentClass?: string }
interface Props { stats: Stat[] }

const TILES: { Icon: ComponentType<IconProps>; iconClass: string; bgClass: string }[] = [
  { Icon: Inbox,      iconClass: 'text-sky-600',     bgClass: 'bg-sky-50' },
  { Icon: Zap,        iconClass: 'text-violet-600',  bgClass: 'bg-violet-50' },
  { Icon: TrendingUp, iconClass: 'text-amber-600',   bgClass: 'bg-amber-50' },
  { Icon: ShieldCheck,iconClass: 'text-emerald-600', bgClass: 'bg-emerald-50' },
]

export function OverviewCard({ stats }: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Overview</p>
      <div className="space-y-3.5">
        {stats.map((stat, i) => {
          const { Icon, iconClass, bgClass } = TILES[i] ?? TILES[0]
          return (
            <div key={stat.label} className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl ${bgClass} flex items-center justify-center shrink-0`}>
                <Icon className={`w-4 h-4 ${iconClass}`} />
              </div>
              <div className="min-w-0">
                <p className={`text-lg font-bold leading-none tracking-tight ${stat.accentClass ?? 'text-slate-900'}`}>
                  {stat.value}
                </p>
                <p className="text-[11px] text-slate-400 mt-1.5 truncate">{stat.label}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
