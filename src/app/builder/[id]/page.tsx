'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { QuestionCanvas } from '@/components/FormBuilder/QuestionCanvas'
import { QuestionPanel } from '@/components/FormBuilder/QuestionPanel'
import { SettingsPanel } from '@/components/FormBuilder/SettingsPanel'
import { TrustScoreBadge } from '@/components/TrustScore/TrustScoreBadge'
import { saveForm, publishForm } from '../actions'
import { calcTrustScore } from '@/lib/types'
import { newQuestionId } from '@/lib/utils'
import { createClient } from '@/lib/supabase-browser'
import type { Form, Question, QuestionType } from '@/lib/types'
import { toast } from 'sonner'

export default function BuilderPage() {
  const params = useParams()
  const formId = params?.id as string | undefined
  const [form, setForm] = useState<Form | null>(null)
  const [activeIdx, setActive] = useState(0)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!formId) return
    ;(createClient() as any).from('forms').select('*').eq('id', formId).single()
      .then(({ data }: any) => setForm(data as unknown as Form))
  }, [formId])

  if (!form) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const trustScore = calcTrustScore(form.trust_config)

  function addQuestion(type: QuestionType) {
    if (!form) return
    const q: Question = {
      id: newQuestionId(), type, required: false,
      label: `New ${type.replace('_',' ')} question`,
      options: ['multiple_choice','checkboxes','dropdown'].includes(type)
        ? ['Option 1','Option 2'] : undefined,
    }
    setForm(f => ({ ...f!, questions: [...f!.questions, q] }))
    setActive(form!.questions.length)
  }

  function updateQuestion(id: string, patch: Partial<Question>) {
    setForm(f => ({
      ...f!,
      questions: f!.questions.map(q => q.id === id ? { ...q, ...patch } : q),
    }))
  }

  function removeQuestion(id: string) {
    setForm(f => ({ ...f!, questions: f!.questions.filter(q => q.id !== id) }))
    setActive(Math.max(0, activeIdx - 1))
  }

  async function handleSave() {
    if (!form) return
    setSaving(true)
    try {
      await saveForm(form)
      toast.success('Draft saved')
    } catch { toast.error('Save failed') }
    finally { setSaving(false) }
  }

  async function handlePublish() {
    if (!form) return
    setSaving(true)
    try {
      await publishForm(form.id)
      toast.success('Form published!')
    } catch { toast.error('Publish failed') }
    finally { setSaving(false) }
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      {/* Top bar */}
      <div className="h-14 bg-white border-b border-slate-200 flex items-center px-5 gap-4 shrink-0">
        <input value={form.title} onChange={e => setForm(f => ({...f!, title: e.target.value}))}
          className="flex-1 text-sm font-semibold bg-transparent focus:outline-none" />
        <TrustScoreBadge score={trustScore} />
        <button onClick={handleSave} disabled={saving}
          className="px-4 py-1.5 text-sm font-medium border border-slate-200 rounded-lg hover:bg-slate-50">
          {saving ? 'Saving…' : 'Save draft'}
        </button>
        <button onClick={handlePublish} disabled={saving}
          className="px-4 py-1.5 text-sm font-semibold text-white bg-sky-500 rounded-lg hover:bg-sky-600">
          Publish
        </button>
      </div>
      {/* 3-column body */}
      <div className="flex flex-1 overflow-hidden">
        <QuestionPanel onAdd={addQuestion} trustConfig={form.trust_config}
          onTrustChange={cfg => setForm(f => ({...f!, trust_config: cfg}))} />
        <QuestionCanvas questions={form.questions} activeIdx={activeIdx}
          onSelect={setActive} onAdd={() => addQuestion('short_text')} mode={form.mode} title={form.title} />
        <SettingsPanel question={form.questions[activeIdx]}
          onUpdate={patch => updateQuestion(form.questions[activeIdx].id, patch)}
          onDelete={() => removeQuestion(form.questions[activeIdx].id)} />
      </div>
    </div>
  )
}
