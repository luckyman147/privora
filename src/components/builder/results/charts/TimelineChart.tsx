'use client'
import { useState, useMemo } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import type { Response } from '@/lib/types'

const PERIODS = [{ label: '7d', days: 7 }, { label: '14d', days: 14 }, { label: '30d', days: 30 }]

function buildDays(responses: Response[], n: number) {
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

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-lg">
      <p className="text-[11px] text-slate-400 mb-0.5">{label}</p>
      <p className="text-base font-black text-violet-600">{payload[0].value}</p>
      <p className="text-[10px] text-slate-400">response{payload[0].value !== 1 ? 's' : ''}</p>
    </div>
  )
}

export function TrendChart({ responses }: { responses: Response[] }) {
  const [days, setDays] = useState(14)
  const data = useMemo(() => buildDays(responses, days), [responses, days])
  const total = data.reduce((s, d) => s + d.n, 0)
  const avg = data.length ? +(total / data.length).toFixed(1) : 0

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Response trend</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {avg > 0 ? `${avg} avg/day · ${total} total` : 'No responses in this window'}
          </p>
        </div>
        <div className="flex items-center gap-0.5 bg-slate-100 rounded-lg p-0.5">
          {PERIODS.map(p => (
            <button key={p.label} onClick={() => setDays(p.days)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                days === p.days
                  ? 'bg-white text-violet-600 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              }`}>
              {p.label}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 8, right: 4, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.18} />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94a3b8' }}
            axisLine={false} tickLine={false}
            interval={days === 7 ? 0 : days === 14 ? 1 : 4} />
          <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false}
            tickLine={false} allowDecimals={false} width={28} />
          {avg > 0 && (
            <ReferenceLine y={avg} stroke="#7c3aed" strokeDasharray="4 3" strokeOpacity={0.35} />
          )}
          <Tooltip content={<CustomTooltip />}
            cursor={{ stroke: '#7c3aed', strokeWidth: 1, strokeDasharray: '4 3', strokeOpacity: 0.4 }} />
          <Area type="monotone" dataKey="n" stroke="#7c3aed" strokeWidth={2.5}
            fill="url(#tg)" dot={false}
            activeDot={{ r: 5, fill: '#7c3aed', strokeWidth: 2.5, stroke: '#fff' }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function SparkLine({ responses, color = '#7c3aed' }: { responses: Response[]; color?: string }) {
  const data = useMemo(() => buildDays(responses, 7), [responses])
  const id = `sg${color.replace(/[^a-z0-9]/gi, '')}`
  return (
    <ResponsiveContainer width="100%" height={36}>
      <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.2} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="n" stroke={color} strokeWidth={1.5}
          fill={`url(#${id})`} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
