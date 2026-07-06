'use client'
import { useEffect, useCallback, useRef } from 'react'

const KEY = (id: string) => `form_draft_${id}`

export function useFormDraft(
  formId: string | undefined,
  answers: Record<string, any>,
  setAnswers: (fn: (prev: Record<string, any>) => Record<string, any>) => void
) {
  const loaded = useRef(false)

  useEffect(() => {
    if (!formId || loaded.current) return
    loaded.current = true
    try {
      const saved = localStorage.getItem(KEY(formId))
      if (!saved) return
      const parsed = JSON.parse(saved)
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed))
        setAnswers(() => parsed)
    } catch { /* ignore corrupt draft */ }
  }, [formId])

  useEffect(() => {
    if (!formId || !loaded.current || Object.keys(answers).length === 0) return
    const timer = setTimeout(() => {
      try {
        const clean: Record<string, any> = {}
        for (const [k, v] of Object.entries(answers))
          if (!(v instanceof File || (Array.isArray(v) && v[0] instanceof File)))
            clean[k] = v
        localStorage.setItem(KEY(formId), JSON.stringify(clean))
      } catch { /* storage full */ }
    }, 300)
    return () => clearTimeout(timer)
  }, [formId, answers])

  const clearDraft = useCallback(() => {
    if (!formId) return
    localStorage.removeItem(KEY(formId))
  }, [formId])

  return { clearDraft }
}
