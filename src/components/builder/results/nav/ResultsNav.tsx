const P = {
  grid:   'M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
  list:   'M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z',
  chart:  'M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z',
  dl:     'M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z',
  user:   'M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z',
  doc:    'M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z',
  trend:  'M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 012 2v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z',
  switch: 'M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zm-2 10H2.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L2.414 17H6a1 1 0 100-2z',
}

function Ico({ p }: { p: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
      <path fillRule="evenodd" d={p} clipRule="evenodd" />
    </svg>
  )
}

const VIEWS = [
  { key: 'overview',    label: 'Overview',              p: P.grid   },
  { key: 'analytics',   label: 'Analytics',             p: P.chart  },
  { key: 'exports',     label: 'Exports',               p: P.dl     },
]

const INSIGHTS = [
  { key: 'individual',  label: 'Individual responses',  p: P.user   },
  { key: 'reports',     label: 'Reports',               p: P.doc    },
  { key: 'trends',      label: 'Trends',                p: P.trend  },
  { key: 'comparison',  label: 'Comparison',            p: P.switch },
]

function NavBtn({ item, active, onSelect }: {
  item: { key: string; label: string; p: string }
  active: string
  onSelect: (k: string) => void
}) {
  const isActive = active === item.key
  return (
    <button onClick={() => onSelect(item.key)}
      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-sm transition ${
        isActive ? 'bg-violet-50 text-violet-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
      }`}>
      <span style={{ color: isActive ? '#7c3aed' : '#94a3b8' }}>
        <Ico p={item.p} />
      </span>
      {item.label}
    </button>
  )
}

export function ResultsNav({ active, onSelect, onExport }: {
  active: string
  onSelect: (k: string) => void
  onExport: () => void
}) {
  return (
    <nav className="w-52 shrink-0 border-r border-slate-200 bg-white flex flex-col h-full">
      <div className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">Views</p>
        {VIEWS.map(item => <NavBtn key={item.key} item={item} active={active} onSelect={onSelect} />)}

        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mt-4 mb-1">Insights</p>
        {INSIGHTS.map(item => <NavBtn key={item.key} item={item} active={active} onSelect={onSelect} />)}
      </div>
      <div className="border-t border-slate-200 p-3 space-y-0.5">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Quick actions</p>
        <button onClick={onExport}
          className="w-full flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition">
          <Ico p={P.dl} /> Export all responses
        </button>
      </div>
    </nav>
  )
}
