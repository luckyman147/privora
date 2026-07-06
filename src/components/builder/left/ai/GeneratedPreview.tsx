import type { Question, DesignConfig } from '@/lib/types'

interface Props {
  title:       string
  description?: string
  questions:   Omit<Question, 'id'>[]
  design:      Partial<DesignConfig>
  onApply:     () => void
  onDiscard:   () => void
}

const TYPE_LABELS: Record<string, string> = {
  short_text: 'Short answer', long_text: 'Long answer',
  multiple_choice: 'Multiple choice', checkboxes: 'Checkboxes',
  dropdown: 'Dropdown', rating: 'Rating', date: 'Date',
  section: 'Section', page_break: 'Page break',
}

export function GeneratedPreview({ title, description, questions, design, onApply, onDiscard }: Props) {
  return (
    <div className="p-4 space-y-4">
      <div>
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>

      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
          {questions.length} question{questions.length === 1 ? '' : 's'}
        </p>
        <ul className="space-y-1.5">
          {questions.map((q, i) => (
            <li key={i} className="flex items-center justify-between px-2.5 py-2 rounded-lg border border-slate-200 text-sm">
              <span className="truncate text-slate-700">{q.label}</span>
              <span className="text-[10px] text-slate-400 shrink-0 ml-2">{TYPE_LABELS[q.type] ?? q.type}</span>
            </li>
          ))}
        </ul>
      </div>

      {(design.theme || design.primary_color) && (
        <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-slate-50 text-xs text-slate-600">
          {design.primary_color && (
            <span className="w-4 h-4 rounded-full border border-slate-200 shrink-0" style={{ backgroundColor: design.primary_color }} />
          )}
          <span>Design: {design.theme ?? 'custom'}</span>
        </div>
      )}

      <div className="flex gap-2">
        <button onClick={onDiscard}
          className="flex-1 py-2 border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 transition">
          Discard
        </button>
        <button onClick={onApply}
          className="flex-1 py-2 bg-violet-500 hover:bg-violet-600 text-white text-sm font-semibold rounded-xl transition">
          Apply
        </button>
      </div>
    </div>
  )
}
