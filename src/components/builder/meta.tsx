'use client'
import type { QuestionType } from '@/lib/types'

export const TYPE_META: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  short_text:      { label: 'Short Text',     icon: <span className="font-bold text-sm leading-none">T</span>,  color: 'bg-violet-100 text-violet-600' },
  long_text:       { label: 'Long Text',       icon: <span className="font-bold text-sm leading-none">≡</span>,  color: 'bg-violet-100 text-violet-600' },
  multiple_choice: { label: 'Multiple Choice', icon: <span className="text-sm leading-none">●</span>,            color: 'bg-sky-100 text-sky-600' },
  checkboxes:      { label: 'Checkboxes',      icon: <span className="text-sm leading-none">☑</span>,           color: 'bg-sky-100 text-sky-600' },
  dropdown:        { label: 'Dropdown',         icon: <span className="text-sm leading-none">▾</span>,            color: 'bg-sky-100 text-sky-600' },
  rating:          { label: 'Rating',           icon: <span className="text-sm leading-none">★</span>,            color: 'bg-amber-100 text-amber-500' },
  matrix:          { label: 'Matrix',           icon: <span className="text-sm leading-none">⊞</span>,           color: 'bg-slate-100 text-slate-500' },
  date:            { label: 'Date', icon: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>, color: 'bg-rose-100 text-rose-500' },
  file_upload: { label: 'File Upload', icon: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>, color: 'bg-teal-100 text-teal-600' },
}

export const TYPE_META_EXTRA: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  section:    { label: 'Section',    icon: <span className="font-bold text-xs">§</span>,  color: 'bg-indigo-100 text-indigo-600' },
  page_break: { label: 'Page Break', icon: <span className="font-bold text-xs">—</span>,  color: 'bg-slate-100 text-slate-400' },
}

export const SIDEBAR_TYPES: QuestionType[] = [
  'short_text', 'long_text', 'multiple_choice', 'checkboxes',
  'dropdown', 'rating', 'matrix', 'date', 'file_upload',
]

export const CHOICE_TYPES: QuestionType[] = ['multiple_choice', 'checkboxes', 'dropdown']
export const TEXT_TYPES:   QuestionType[] = ['short_text', 'long_text']

export function TypeBadge({ type, size = 'md' }: { type: string; size?: 'sm' | 'md' }) {
  const meta = TYPE_META[type] ?? TYPE_META.short_text
  const sz = size === 'sm' ? 'w-7 h-7' : 'w-8 h-8'
  return <span className={`${sz} ${meta.color} rounded-lg flex items-center justify-center shrink-0`}>{meta.icon}</span>
}

export function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${checked ? 'bg-sky-500' : 'bg-slate-200'}`}>
      <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  )
}
