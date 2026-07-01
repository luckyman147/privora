const FEATURES = [
  { icon: '🔒', label: 'Privacy-first' },
  { icon: '⚡', label: 'Build in minutes' },
  { icon: '📊', label: 'Smart insights' },
  { icon: '✓', label: 'GDPR compliant' },
]

const RATINGS = [1, 2, 3, 4, 5]

export default function AuthSidePanel() {
  return (
    <div className="hidden lg:flex flex-1 items-center justify-center px-10 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f0a1e 0%, #0d1b2e 50%, #0a1628 100%)' }}>

      <div className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)' }} />
      <div className="absolute bottom-1/3 left-1/4 w-64 h-64 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)' }} />

      <div className="relative z-10 w-full max-w-xs">

        <div className="flex items-center gap-2.5 mb-10">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(124,58,237,0.9)', boxShadow: '0 0 20px rgba(124,58,237,0.4)' }}>
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="font-bold text-base" style={{ color: 'rgba(255,255,255,0.95)' }}>Privora</span>
        </div>

        <div className="rounded-2xl p-5 mb-7"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}>

          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.6)' }}>Student Feedback Form</p>
            <span className="text-[10px] font-semibold rounded-full px-2.5 py-0.5"
              style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(52,211,153,0.25)' }}>
              Trust 94&#47;100
            </span>
          </div>

          <div className="mb-3.5">
            <p className="text-[11px] mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>How satisfied are you with this course?</p>
            <div className="flex gap-1.5">
              {RATINGS.map(n => (
                <div key={n} className="flex-1 h-7 rounded-lg text-[10px] font-bold flex items-center justify-center transition"
                  style={n <= 4
                    ? { background: 'rgba(124,58,237,0.8)', color: '#fff', boxShadow: '0 2px 8px rgba(124,58,237,0.3)' }
                    : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.25)' }}>
                  {n}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <p className="text-[11px] mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>What would you improve?</p>
            <div className="rounded-lg px-3 py-2 text-[11px]"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.25)' }}>
              Type your answer&hellip;
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div className="h-full rounded-full" style={{ width: '66%', background: 'linear-gradient(90deg, #7c3aed, #818cf8)' }} />
            </div>
            <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>2 of 3</span>
          </div>
        </div>

        <h2 className="text-2xl font-extrabold leading-tight mb-3" style={{ color: '#fff' }}>
          Forms that<br />earn trust
        </h2>
        <p className="text-sm leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.45)' }}>
          Built-in privacy signals boost response rates. Respondents see exactly what you collect&nbsp;&mdash; and why.
        </p>

        <div className="grid grid-cols-2 gap-2">
          {FEATURES.map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <span className="text-sm">{icon}</span>
              <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>{label}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
