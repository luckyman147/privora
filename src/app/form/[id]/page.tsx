'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { TrustScoreCard } from '@/components/TrustScore/TrustScoreCard'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase-browser'
import { newQuestionId } from '@/lib/utils'
import type { Form } from '@/lib/types'

export default function FormViewPage() {
  const params = useParams()
  const formId = params?.id as string | undefined
  const [form, setForm] = useState<Form | null>(null)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!formId) return
    ;(createClient() as any).from('forms')
      .select('*')
      .eq('id', formId)
      .single()
      .then(({ data }: any) => setForm(data as unknown as Form))
  }, [formId])

  if (!form) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto pt-24 px-4 text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl text-emerald-600">✓</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Response submitted.</h2>
        <p className="text-slate-500 mb-8">Your response has been recorded anonymously.</p>
      </div>
    )
  }

  async function handleSubmit() {
    if (!form) return
    if (form.mode === 'election') {
      const token = newQuestionId()
      const res = await fetch(`/form/${form.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, submission_token: token }),
      })
      if (!res.ok) {
        const err = await res.json()
        setError(err.error)
        return
      }
      setSubmitted(true)
      return
    }

    let token = localStorage.getItem(`token_${form.id}`)
    if (!token) {
      token = newQuestionId()
      localStorage.setItem(`token_${form.id}`, token)
    }
    const res = await fetch(`/form/${form.id}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers, submission_token: token }),
    })
    if (!res.ok) {
      const err = await res.json()
      setError(err.error)
      return
    }
    setSubmitted(true)
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <TrustScoreCard config={form.trust_config} formTitle={form.title} />

      <h1 className="text-2xl font-bold text-slate-900 mt-8 mb-6">{form.title}</h1>

      <div className="space-y-6">
        {form.questions.map((q, i) => (
          <div key={q.id} className="bg-white border border-slate-200 rounded-xl p-5">
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              {i + 1}. {q.label}
              {q.required && <span className="text-red-400 ml-1">*</span>}
            </label>

            {q.type === 'short_text' && (
              <input onChange={e => setAnswers(a => ({...a, [q.id]: e.target.value}))}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-sky-400" />
            )}

            {q.type === 'long_text' && (
              <textarea onChange={e => setAnswers(a => ({...a, [q.id]: e.target.value}))}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-sky-400 min-h-[80px]" />
            )}

            {q.type === 'multiple_choice' && q.options?.map(opt => (
              <label key={opt} className="flex items-center gap-2 py-1.5 text-sm text-slate-700 cursor-pointer">
                <input type="radio" name={q.id} value={opt}
                  onChange={e => setAnswers(a => ({...a, [q.id]: e.target.value}))}
                  className="accent-sky-500" />
                {opt}
              </label>
            ))}

            {q.type === 'checkboxes' && q.options?.map(opt => (
              <label key={opt} className="flex items-center gap-2 py-1.5 text-sm text-slate-700 cursor-pointer">
                <input type="checkbox" value={opt}
                  onChange={e => {
                    const current = (answers[q.id] as string[]) ?? []
                    const next = e.target.checked ? [...current, opt] : current.filter(v => v !== opt)
                    setAnswers(a => ({...a, [q.id]: next}))
                  }}
                  className="accent-sky-500" />
                {opt}
              </label>
            ))}

            {q.type === 'dropdown' && (
              <select onChange={e => setAnswers(a => ({...a, [q.id]: e.target.value}))}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-sky-400">
                <option value="">Select...</option>
                {q.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            )}

            {q.type === 'rating' && (
              <div className="flex gap-2">
                {Array.from({ length: q.max_rating ?? 5 }).map((_, v) => (
                  <button key={v} type="button" onClick={() => setAnswers(a => ({...a, [q.id]: v + 1}))}
                    className={`w-9 h-9 rounded-lg text-sm font-bold border transition ${answers[q.id] === v + 1 ? 'bg-sky-500 text-white border-sky-500' : 'bg-white text-slate-500 border-slate-200 hover:border-sky-300'}`}>
                    {v + 1}
                  </button>
                ))}
              </div>
            )}

            {q.type === 'matrix' && q.rows && q.columns && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left text-slate-400 font-medium p-2" />
                      {q.columns.map(col => (
                        <th key={col} className="text-center text-slate-400 font-medium p-2 text-xs">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {q.rows.map(row => (
                      <tr key={row}>
                        <td className="text-slate-700 p-2 text-xs">{row}</td>
                        {q.columns!.map(col => (
                          <td key={col} className="text-center p-2">
                            <input type="radio" name={`${q.id}_${row}`} value={col}
                              onChange={() => setAnswers(a => ({...a, [`${q.id}_${row}`]: col}))}
                              className="accent-sky-500" />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>

      {error && <p className="text-xs text-red-500 mt-4">{error}</p>}

      <Button onClick={handleSubmit} size="lg" className="w-full mt-8">
        Submit
      </Button>
    </div>
  )
}
