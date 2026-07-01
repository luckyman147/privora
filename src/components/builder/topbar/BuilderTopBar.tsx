'use client'
import Link from 'next/link'
import { calcTrustScore } from '@/lib/types'
import type { Form } from '@/lib/types'

const TABS = ['Build', 'Design', 'Settings', 'Share', 'Results']

interface Props {
  form:          Form
  saving:        boolean
  activeTab:     string
  onTitleChange: (t: string) => void
  onSave:        () => void
  onPublish:     () => void
  onTabChange:   (tab: string) => void
  onPreview:     () => void
}

export function BuilderTopBar({ form, saving, activeTab, onTitleChange, onSave, onPublish, onTabChange, onPreview }: Props) {
  const score = calcTrustScore(form.trust_config)
  const trustCls = score === 5
    ? 'text-emerald-600 border-emerald-200 bg-emerald-50'
    : score >= 3 ? 'text-amber-600 border-amber-200 bg-amber-50'
    : 'text-red-600 border-red-200 bg-red-50'

  return (
    <header className="h-14 border-b border-slate-200 flex items-center px-4 gap-3 shrink-0 bg-white z-10">
      <Link href="/dashboard" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition shrink-0 whitespace-nowrap">
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Back to forms
      </Link>

      <div className="w-px h-5 bg-slate-200 shrink-0" />

      <div className="min-w-0 mr-1 shrink-0">
        <input type="text" value={form.title}
          onChange={e => onTitleChange(e.target.value)}
          onBlur={onSave}
          className="text-sm font-semibold text-slate-900 bg-transparent focus:outline-none w-44 truncate" />
        <p className="text-[11px] text-slate-400 leading-none mt-0.5">
          {saving ? 'Saving…' : '✓ Auto-saved · All changes saved'}
        </p>
      </div>

      <nav className="flex items-center mx-auto shrink-0">
        {TABS.map(tab => (
          <button key={tab} onClick={() => onTabChange(tab)}
            title={tab === 'Share' ? 'Copy share link' : tab === 'Results' ? 'View results' : undefined}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition ${
              activeTab === tab ? 'text-sky-600 bg-sky-50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}>
            {tab}
          </button>
        ))}
      </nav>

      <div className={`flex items-center gap-1.5 text-xs font-bold border rounded-full px-2.5 py-1.5 shrink-0 ${trustCls}`}>
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        Trust {score}/5
      </div>

      <button onClick={onPreview}
        title="Preview form"
        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition shrink-0">
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
        </svg>
      </button>

      <button onClick={onPublish}
        className={`flex items-center gap-1.5 text-white text-sm font-semibold px-4 py-2 rounded-lg transition shrink-0 ${
          form.status === 'active'
            ? 'bg-emerald-500 hover:bg-red-500'
            : 'bg-sky-500 hover:bg-sky-600'
        }`}
        title={form.status === 'active' ? 'Unpublish form' : 'Publish form'}>
        {form.status === 'active' ? 'Published' : 'Publish'}
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </header>
  )
}
