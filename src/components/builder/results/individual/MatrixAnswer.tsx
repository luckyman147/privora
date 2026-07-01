import type { Question, Response } from '@/lib/types'

function cellDisplay(colType: string, ri: number, ci: number, qId: string, r: Response) {
  if (colType === 'choice') {
    return r.answers[`${qId}_${ri}`] === ci ? '✓' : null
  }
  const val = r.answers[`${qId}_${ri}_${ci}`]
  if (val == null || val === '') return null
  if (colType === 'checkbox') return (val as unknown) ? '✓' : '✗'
  return String(val)
}

export function MatrixAnswer({ q, r }: { q: Question; r: Response }) {
  const rows = q.rows?.length ? q.rows : ['Row 1', 'Row 2']
  const cols = q.matrix_columns?.length
    ? q.matrix_columns
    : (q.columns?.length ? q.columns : ['Column 1']).map(c => ({ name: c, type: 'short_answer' as const }))

  if (!rows.length || !cols.length) return (
    <p className="text-xs text-slate-400 italic">No matrix data</p>
  )

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 -mx-0.5">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-slate-50">
            <th className="py-2 px-3 text-left font-semibold text-slate-400 min-w-[90px]" />
            {cols.map((col, ci) => (
              <th key={ci} className="py-2 px-3 text-center font-semibold text-slate-600 border-l border-slate-100 whitespace-nowrap">
                {col.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="border-t border-slate-100 even:bg-slate-50/40">
              <td className="py-2 px-3 font-semibold text-slate-700 whitespace-nowrap">{row}</td>
              {cols.map((col, ci) => {
                const cell = cellDisplay(col.type, ri, ci, q.id, r)
                return (
                  <td key={ci} className={`py-2 px-3 text-center border-l border-slate-100 ${cell && col.type === 'choice' ? 'text-violet-600 font-black' : 'text-slate-600'}`}>
                    {cell ?? <span className="text-slate-200">—</span>}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
