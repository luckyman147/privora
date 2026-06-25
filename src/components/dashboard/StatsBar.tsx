interface Stat { label: string; value: string; color: string }

export function StatsBar({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-4 border-y border-slate-200 mx-8">
      {stats.map((stat, i) => (
        <div key={stat.label} className={`py-5 px-4 ${i > 0 ? 'border-l border-slate-200' : ''}`}>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{stat.label}</p>
          <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
        </div>
      ))}
    </div>
  )
}
