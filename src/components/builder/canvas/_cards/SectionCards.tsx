'use client'
import type { Question } from '@/lib/types'
import type { DragHandlers } from '../BuilderCanvas'

export function SectionCard({ question, selected, onSelect, onDelete, onUpdate, drag }: {
  question: Question; selected: boolean; onSelect: () => void; onDelete: () => void
  onUpdate: (patch: Partial<Question>) => void; drag: DragHandlers
}) {
  return (
    <div onClick={onSelect} draggable onDragStart={drag.onDragStart} onDragEnd={drag.onDragEnd} onDragOver={drag.onDragOver} onDrop={drag.onDrop}
      className={`group bg-white rounded-xl border-2 cursor-pointer transition shadow-sm ${drag.isDragging ? 'opacity-40 scale-[0.99]' : ''} ${drag.isDragOver && !drag.isDragging ? 'border-indigo-400 shadow-md' : selected ? 'border-indigo-400' : 'border-transparent hover:border-slate-200'}`}>
      <div className="flex items-center gap-3 px-5 py-3.5">
        <span className="text-[10px] text-slate-300 select-none shrink-0 cursor-grab active:cursor-grabbing">⠿⠿</span>
        <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-md text-xs font-bold flex items-center justify-center shrink-0">§</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-800 truncate">{question.label || 'Section title'}</p>
          {question.description && !selected && <p className="text-xs text-slate-400 truncate">{question.description}</p>}
        </div>
        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider shrink-0">Section</span>
        <button onClick={e => { e.stopPropagation(); onDelete() }}
          className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
        </button>
      </div>
      {selected && (
        <div className="border-t border-slate-100 px-5 pb-4 pt-3 space-y-2" onClick={e => e.stopPropagation()}>
          <input autoFocus value={question.label} onChange={e => onUpdate({ label: e.target.value })} placeholder="Section title"
            className="w-full text-sm font-bold text-slate-800 bg-transparent border-b border-slate-200 pb-1 focus:outline-none focus:border-indigo-400 transition" />
          <textarea value={question.description ?? ''} onChange={e => onUpdate({ description: e.target.value || undefined })} placeholder="Section description (optional)" rows={1}
            className="w-full text-xs text-slate-500 bg-transparent resize-none focus:outline-none border-b border-slate-200 pb-1 focus:border-indigo-400 transition placeholder:text-slate-300" />
        </div>
      )}
    </div>
  )
}

export function PageBreakCard({ selected, onSelect, onDelete, drag }: { selected: boolean; onSelect: () => void; onDelete: () => void; drag: DragHandlers }) {
  return (
    <div onClick={onSelect} draggable onDragStart={drag.onDragStart} onDragEnd={drag.onDragEnd} onDragOver={drag.onDragOver} onDrop={drag.onDrop}
      className={`group flex items-center gap-3 py-1 px-2 -mx-2 rounded-lg cursor-pointer transition ${drag.isDragging ? 'opacity-40' : ''} ${drag.isDragOver && !drag.isDragging ? 'ring-2 ring-sky-400' : selected ? 'ring-2 ring-sky-400 bg-sky-50/30' : 'hover:bg-slate-100/50'}`}>
      <div className="flex-1 border-t-2 border-dashed border-slate-300" />
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Page Break</span>
      <div className="flex-1 border-t-2 border-dashed border-slate-300" />
      <button onClick={e => { e.stopPropagation(); onDelete() }}
        className={`p-1 text-slate-300 hover:text-red-500 transition rounded ${selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
      </button>
    </div>
  )
}
