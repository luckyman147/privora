'use client'
import { useState, useEffect } from 'react'
import type { Form } from '@/lib/types'
import { QrCodeCard } from './QrCodeCard'

const SI = {
  x:  'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.258 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z',
  li: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  wa: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z',
  em: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
}

const SOCIALS = [
  { label: 'X / Twitter', cl: 'hover:bg-black hover:text-white',       p: SI.x,  href: (u: string, t: string) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent(u)}` },
  { label: 'LinkedIn',    cl: 'hover:bg-[#0077B5] hover:text-white',   p: SI.li, href: (u: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(u)}` },
  { label: 'WhatsApp',    cl: 'hover:bg-[#25D366] hover:text-white',   p: SI.wa, href: (u: string, t: string) => `https://wa.me/?text=${encodeURIComponent(t + ' ' + u)}` },
  { label: 'Email',       cl: 'hover:bg-violet-600 hover:text-white',  p: SI.em, href: (u: string, t: string) => `mailto:?subject=${encodeURIComponent(t)}&body=${encodeURIComponent('Fill out this form: ' + u)}` },
]

function CopyBtn({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [done, setDone] = useState(false)
  const copy = () => navigator.clipboard.writeText(text).then(() => { setDone(true); setTimeout(() => setDone(false), 2000) })
  return (
    <button onClick={copy} className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition ${done ? 'bg-emerald-500 text-white' : 'bg-violet-600 hover:bg-violet-700 text-white'}`}>
      {done ? '✓ Copied!' : label}
    </button>
  )
}

export function BuilderShare({ form }: { form: Form }) {
  const [url, setUrl] = useState<string | null>(null)
  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin
    setUrl(`${base}/form/${form.id}`)
  }, [form.id])

  const isActive  = form.status === 'active'
  const embedCode = url ? `<iframe\n  src="${url}"\n  width="100%"\n  height="640"\n  frameborder="0"\n  style="border-radius:12px;"\n></iframe>` : ''

  return (
    <div className="flex flex-1 overflow-hidden bg-slate-50">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto py-10 px-6 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Share your form</h2>
            <p className="text-sm text-slate-500 mt-1">Send this link to respondents or embed it in your site.</p>
          </div>

          {!isActive && (
            <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-amber-500 shrink-0"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              Form is in <strong className="mx-1">Draft</strong> — publish before sharing so responses can be collected.
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Direct link</h3>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 min-w-0">
                <span className="text-sm text-slate-600 truncate font-mono">{url ?? 'Loading…'}</span>
              </div>
              <CopyBtn text={url ?? ''} />
              <a href={url ?? '#'} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" /><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" /></svg>
                Open
              </a>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-2">Share via</p>
              <div className="flex flex-wrap gap-2">
                {SOCIALS.map(s => (
                  <a key={s.label} href={url ? s.href(url, form.title) : '#'} target="_blank" rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 transition ${s.cl}`}>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d={s.p} /></svg>
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Embed on your website</h3>
                <p className="text-xs text-slate-400 mt-0.5">Paste this snippet in your HTML.</p>
              </div>
              <CopyBtn text={embedCode} label="Copy code" />
            </div>
            <pre className="bg-slate-900 text-slate-300 text-xs rounded-xl p-4 overflow-x-auto leading-relaxed font-mono whitespace-pre">{embedCode}</pre>
          </div>

          <QrCodeCard url={url} />
        </div>
      </div>

      <aside className="w-64 shrink-0 border-l border-slate-200 bg-white overflow-y-auto p-5 space-y-5">
        <p className="text-sm font-bold text-slate-900">Form info</p>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-400' : 'bg-amber-400'}`} />
          <span className={`text-xs font-semibold ${isActive ? 'text-emerald-700' : 'text-amber-700'}`}>
            {isActive ? 'Active — accepting responses' : form.status === 'closed' ? 'Archived' : 'Draft — not published'}
          </span>
        </div>
        <div className="border-t border-slate-100" />
        <div className="space-y-2.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Access &amp; Schedule</p>
          {([
            ['Who can respond', form.trust_config.visibility === 'public' ? 'Anyone with the link' : form.trust_config.visibility === 'org' ? 'Org members' : 'Creator only'],
            ['Identity',        form.trust_config.identity === 'anonymous' ? 'Anonymous' : form.trust_config.identity === 'required' ? 'Required' : 'Optional'],
            ['Limit',           form.trust_config.submission_limit === 'one' ? '1 per person' : 'Unlimited'],
            ['Opens',           form.opens_at  ? new Date(form.opens_at).toLocaleDateString()  : 'Immediately'],
            ['Closes',          form.closes_at ? new Date(form.closes_at).toLocaleDateString() : 'Never'],
          ] as [string, string][]).map(([l, v]) => (
            <div key={l} className="flex items-start justify-between gap-2">
              <span className="text-xs text-slate-500 shrink-0">{l}</span>
              <span className="text-xs font-semibold text-slate-700 text-right">{v}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-100" />
        <div className="bg-violet-50 border border-violet-100 rounded-xl p-3 space-y-1.5">
          <p className="text-[10px] font-bold text-violet-800 uppercase tracking-wider">Tips</p>
          {['Publish before sharing to collect responses.', 'Embed the form on your website with the iframe snippet.', 'WhatsApp and email get the highest response rates.'].map(t => (
            <p key={t} className="text-xs text-violet-700 flex gap-1.5"><span className="text-violet-400 shrink-0">•</span>{t}</p>
          ))}
        </div>
      </aside>
    </div>
  )
}
