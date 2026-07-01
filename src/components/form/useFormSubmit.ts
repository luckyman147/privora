'use client'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/browser'
import { newQuestionId } from '@/lib/utils'
import { hasMatrixAnswer } from './design'
import { isQuestionVisible } from '@/lib/logic'
import type { Form } from '@/lib/types'
import { KEY_NAME, KEY_EMAIL } from './IdentityFields'

const TOAST_ERROR = { style: { background: '#991B1B', border: '1px solid #DC2626', color: '#F8FAFC' } }
const TOAST_SUCCESS = { style: { background: '#065F46', border: '1px solid #059669', color: '#F8FAFC' } }

function findMissing(form: Form, answers: Record<string, any>, allQuestions?: Form['questions']) {
  const all = allQuestions ?? form.questions
  const missing = form.questions.filter(q => {
    if (allQuestions && !isQuestionVisible(q, answers, allQuestions)) return false
    if (!q.required || q.type === 'section' || q.type === 'page_break') return false
    if (q.type === 'matrix') return !hasMatrixAnswer(q, answers)
    const v = answers[q.id]
    return v == null || v === '' || (Array.isArray(v) && v.length === 0)
  })
  if (form.trust_config.identity === 'required') {
    if (!answers[KEY_NAME]?.trim()) missing.push({ id: KEY_NAME, label: 'Name' } as any)
    if (!answers[KEY_EMAIL]?.trim()) missing.push({ id: KEY_EMAIL, label: 'Email' } as any)
  }
  return missing
}

export function useFormSubmit(form: Form | null, answers: Record<string, any>,
  onSubmitted: () => void, setUploading: (v: boolean) => void) {

  function handleNext(currentPageQs: any[], nextPage: () => void) {
    const missing = findMissing({ ...form!, questions: currentPageQs }, answers)
    if (missing.length > 0) {
      toast.error(`Please answer: "${missing[0].label}"`, TOAST_ERROR)
      return
    }
    nextPage()
  }

  async function handleSubmit(submittingDone: () => void) {
    if (!form) return
    const missing = findMissing(form, answers, form.questions)
    if (missing.length > 0) {
      toast.error(`Please answer: "${missing[0].label}"`, TOAST_ERROR)
      return
    }

    submittingDone()
    const storageKey = `token_${form.id}`
    let token = localStorage.getItem(storageKey)
    if (!token) { token = newQuestionId(); localStorage.setItem(storageKey, token) }

    const processedAnswers: Record<string, any> = {}
    const hasFiles = Object.values(answers).some(
      v => v instanceof File || (Array.isArray(v) && v[0] instanceof File)
    )
    if (hasFiles) setUploading(true)

    try {
      const supabase = createClient() as any
      for (const [qId, value] of Object.entries(answers)) {
        const files: File[] = value instanceof File ? [value]
          : Array.isArray(value) && value[0] instanceof File ? value : []
        if (files.length > 0) {
          const urls: string[] = []
          for (const file of files) {
            const path = `${form.id}/${qId}/${Date.now()}_${file.name}`
            const { error: uploadErr } = await supabase.storage
              .from('response-uploads').upload(path, file, { upsert: false })
            if (uploadErr) {
              toast.error(`File upload failed: ${uploadErr.message}`, TOAST_ERROR)
              setUploading(false)
              return
            }
            const { data: { publicUrl } } = supabase.storage.from('response-uploads').getPublicUrl(path)
            urls.push(publicUrl)
          }
          processedAnswers[qId] = urls
        } else {
          processedAnswers[qId] = value
        }
      }
    } finally { setUploading(false) }

    const res = await fetch(`/form/${form.id}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: processedAnswers, submission_token: token }),
    })
    if (!res.ok) { const err = await res.json(); toast.error(err.error, TOAST_ERROR); return }
    toast.success('Response submitted!', TOAST_SUCCESS)
    onSubmitted()
  }

  return { handleNext, handleSubmit }
}
