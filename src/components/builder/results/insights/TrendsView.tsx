'use client'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { Response } from '@/lib/types'

function buildDaily(responses: Response[], n = 30) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (n - 1 - i))
    const day = d.toISOString().slice(0, 10)
    return {
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      n: responses.filter(r => r.submitted_at.slice(0, 10) === day).length,
    }
  })
}

function buildByDow(responses: Response[]) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const counts = [0, 0, 0, 0, 0, 0, 0]
  responses.forEach(r => counts[new Date(r.submitted_at).getDay()]++)
  return days.map((label, i) => ({ label, n: counts[i] }))
}

function buildCumulative(responses: Response[]) {
  const sorted = [...responses].sort((a, b) => a.submitted_at.localeCompare(b.submitted_at))
  let cum = 0
  return sorted.map(r => ({
    label: new Date(r.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    n: ++cum,
  }))
}

const TT = { contentStyle: { fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' } }

export function TrendsView({ responses }: { responses: Response[] }) {
  if (!responses.length) return (
    <div className="flex items-center justify-center h-full">
      <p className="text-slate-400 text-sm">No data yet to show trends.</p>
    </div>
  )
  const daily = buildDaily(responses)
  const dow = buildByDow(responses)
  const cumul = buildCumulative(responses)

  return (
    <div className="p-6 space-y-5 overflow-y-auto h-full">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Trends</h2>
        <p className="text-sm text-slate-400 mt-0.5">How your responses have changed over time.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <p className="text-sm font-bold text-slate-900 mb-0.5">Daily responses</p>
        <p className="text-xs text-slate-400 mb-4">Last 30 days</p>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={daily} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="tg1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} interval={6} />
            <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip {...TT} formatter={(v: any) => [v, 'Responses']} />
            <Area type="monotone" dataKey="n" stroke="#7c3aed" strokeWidth={2} fill="url(#tg1)" dot={false} activeDot={{ r: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <p className="text-sm font-bold text-slate-900 mb-0.5">By day of week</p>
          <p className="text-xs text-slate-400 mb-4">All-time distribution</p>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={dow} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip {...TT} formatter={(v: any) => [v, 'Responses']} />
              <Bar dataKey="n" fill="#7c3aed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <p className="text-sm font-bold text-slate-900 mb-0.5">Cumulative responses</p>
          <p className="text-xs text-slate-400 mb-4">Total over time</p>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={cumul} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="tg2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} interval={Math.max(1, Math.floor(cumul.length / 5))} />
              <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip {...TT} formatter={(v: any) => [v, 'Total']} />
              <Area type="monotone" dataKey="n" stroke="#22c55e" strokeWidth={2} fill="url(#tg2)" dot={false} activeDot={{ r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
