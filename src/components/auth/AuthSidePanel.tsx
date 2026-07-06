import { Shield, Zap, BarChart3, BadgeCheck } from 'lucide-react'

const FEATURES = [
  { icon: Shield, label: 'Privacy-first' },
  { icon: Zap, label: 'Build in minutes' },
  { icon: BarChart3, label: 'Smart insights' },
  { icon: BadgeCheck, label: 'GDPR compliant' },
]

const RATINGS = [1, 2, 3, 4, 5]

export default function AuthSidePanel() {
  return (
    <div className="hidden lg:flex flex-1 items-center justify-center px-10 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0e0720 0%, #1a0a2e 30%, #0d0d1a 70%, #050510 100%)' }}>

      <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)' }} />
      <div className="absolute bottom-1/4 left-1/4 w-72 h-72 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)' }} />

      <div className="relative z-10 w-full max-w-xs">

        <div className="rounded-2xl p-5 mb-7"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)' }}>

          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.55)' }}>Student Feedback Form</p>
            <span className="text-[10px] font-semibold rounded-full px-2.5 py-0.5"
              style={{ background: 'rgba(124,58,237,0.15)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.2)' }}>
              Trust 94/100
            </span>
          </div>

          <div className="mb-3.5">
            <p className="text-[11px] mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>How satisfied are you with this course?</p>
            <div className="flex gap-1.5">
              {RATINGS.map(n => (
                <div key={n} className="flex-1 h-7 rounded-lg text-[10px] font-bold flex items-center justify-center transition"
                  style={n <= 4
                    ? { background: 'linear-gradient(180deg, #7c3aed, #6d28d9)', color: '#fff', boxShadow: '0 2px 12px rgba(124,58,237,0.35)' }
                    : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.2)' }}>
                  {n}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <p className="text-[11px] mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>What would you improve?</p>
            <div className="rounded-lg px-3 py-2 text-[11px]"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.2)' }}>
              Type your answer&hellip;
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div className="h-full rounded-full" style={{ width: '66%', background: 'linear-gradient(90deg, #7c3aed, #a78bfa)' }} />
            </div>
            <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.25)' }}>2 of 3</span>
          </div>
        </div>

        <h2 className="text-2xl font-extrabold leading-tight mb-3" style={{ color: '#f8fafc' }}>
          Forms that<br />earn trust
        </h2>
        <p className="text-sm leading-relaxed mb-8" style={{ color: 'rgba(248,250,252,0.4)' }}>
          Built-in privacy signals boost response rates. Respondents see exactly what you collect&nbsp;&mdash; and why.
        </p>

        <div className="grid grid-cols-2 gap-2">
          {FEATURES.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <Icon className="w-4 h-4" style={{ color: '#a78bfa' }} />
              <span className="text-xs font-medium" style={{ color: 'rgba(248,250,252,0.55)' }}>{label}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
