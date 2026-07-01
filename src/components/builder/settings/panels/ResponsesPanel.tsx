'use client'
import type { Form, ResponsesConfig } from '@/lib/types'

function Tog({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full transition-colors shrink-0 relative ${checked ? 'bg-violet-500' : 'bg-slate-200'}`}>
      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${checked ? 'left-6' : 'left-1'}`} />
    </button>
  )
}

export default function ResponsesPanel({ form, onPatch }: {
  form: Form
  onPatch: (fn: (f: Form) => Form) => void
}) {
  const rc = form.responses_config ?? {} as ResponsesConfig

  function patch(delta: Partial<ResponsesConfig>) {
    onPatch(f => ({
      ...f,
      responses_config: { ...(f.responses_config ?? {} as ResponsesConfig), ...delta },
    }))
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Response management</h2>
        <p className="text-sm text-slate-500 mt-1">Control how and when responses are collected.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 px-6 py-2 divide-y divide-slate-100">
        <div className="py-3.5">
          <p className="text-sm font-medium text-slate-800 mb-1.5">Max total responses</p>
          <div className="flex items-center gap-2">
            <input
              type="number" min={1}
              value={rc.max_total_responses ?? ''}
              onChange={e => patch({ max_total_responses: e.target.value ? parseInt(e.target.value) : null })}
              placeholder="No limit"
              className="w-32 px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-violet-400 bg-white"
            />
            <span className="text-xs text-slate-400">Leave empty for unlimited</span>
          </div>
        </div>

        <div className="flex items-center justify-between py-3.5">
          <div>
            <p className="text-sm font-medium text-slate-800">Auto-close on limit</p>
            <p className="text-xs text-slate-400 mt-0.5">Automatically close the form when the response limit is reached</p>
          </div>
          <Tog checked={rc.auto_close ?? false} onChange={v => patch({ auto_close: v })} />
        </div>

        <div className="flex items-center justify-between py-3.5">
          <div>
            <p className="text-sm font-medium text-slate-800">Allow response editing</p>
            <p className="text-xs text-slate-400 mt-0.5">Let respondents edit their submitted responses</p>
          </div>
          <Tog checked={rc.allow_editing ?? false} onChange={v => patch({ allow_editing: v })} />
        </div>

        <div className="flex items-center justify-between py-3.5">
          <div>
            <p className="text-sm font-medium text-slate-800">Collect respondent emails</p>
            <p className="text-xs text-slate-400 mt-0.5">Ask for an email address alongside the response</p>
          </div>
          <Tog checked={rc.collect_email ?? false} onChange={v => patch({ collect_email: v })} />
        </div>
      </div>
    </div>
  )
}
