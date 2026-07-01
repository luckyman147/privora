'use client'
import { useState } from 'react'
import type { Form, NotificationsConfig } from '@/lib/types'

function Tog({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full transition-colors shrink-0 relative ${checked ? 'bg-violet-500' : 'bg-slate-200'}`}>
      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${checked ? 'left-6' : 'left-1'}`} />
    </button>
  )
}

export default function NotificationsPanel({ form, onPatch }: {
  form: Form
  onPatch: (fn: (f: Form) => Form) => void
}) {
  const nc = form.notifications_config ?? {} as NotificationsConfig
  const enabled = nc.enabled ?? false
  const email = nc.email ?? ''
  const onSubmission = nc.on_submission ?? true

  function patch(delta: Partial<NotificationsConfig>) {
    onPatch(f => ({
      ...f,
      notifications_config: { ...(f.notifications_config ?? {} as NotificationsConfig), ...delta },
    }))
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Notifications</h2>
        <p className="text-sm text-slate-500 mt-1">Configure email alerts for form activity.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 px-6 py-2 divide-y divide-slate-100">
        <div className="flex items-center justify-between py-3.5">
          <div>
            <p className="text-sm font-medium text-slate-800">Email notifications</p>
            <p className="text-xs text-slate-400 mt-0.5">Receive alerts when respondents interact with your form</p>
          </div>
          <Tog checked={enabled} onChange={v => patch({ enabled: v })} />
        </div>

        {enabled && (
          <>
            <div className="py-3.5">
              <p className="text-sm font-medium text-slate-800 mb-1.5">Notification email</p>
              <input
                type="email"
                value={email}
                onChange={e => patch({ email: e.target.value })}
                placeholder="you@example.com"
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-violet-400 bg-white"
              />
              <p className="text-xs text-slate-400 mt-1">Leave blank to use your account email</p>
            </div>

            <div className="flex items-center justify-between py-3.5">
              <div>
                <p className="text-sm font-medium text-slate-800">New submission</p>
                <p className="text-xs text-slate-400 mt-0.5">Send an email each time someone submits a response</p>
              </div>
              <Tog checked={onSubmission} onChange={v => patch({ on_submission: v })} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
