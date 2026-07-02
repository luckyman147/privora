import { Inbox, Zap, TrendingUp, ShieldCheck } from 'lucide-react'

interface Stat { label: string; value: string; color: string }

const CARDS = [
  { Icon: Inbox,       accent: 'text-sky-600',     bg: 'bg-sky-50'      },
  { Icon: Zap,         accent: 'text-violet-600',  bg: 'bg-violet-50'   },
  { Icon: TrendingUp,  accent: 'text-amber-600',   bg: 'bg-amber-50'    },
  { Icon: ShieldCheck, accent: 'text-emerald-600', bg: 'bg-emerald-50'  },
]

export function StatsBar({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-4 gap-5 px-10 pb-8">
      {stats.map((stat, i) => {
        const { Icon, accent, bg } = CARDS[i] ?? CARDS[0]
        return (
          <div key={stat.label} className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-4`}>
              <Icon className={`w-5 h-5 ${accent}`} />
            </div>
            <p className={`text-3xl font-bold mb-1 ${stat.color}`}>{stat.value}</p>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{stat.label}</p>
          </div>
        )
      })}
    </div>
  )
}
