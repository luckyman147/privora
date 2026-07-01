'use client'
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { createForm, createFromTemplate } from '@/app/(app)/dashboard/actions'

export default function NewFormPage() {
  const searchParams = useSearchParams()
  const template = searchParams.get('template')

  useEffect(() => {
    if (template) {
      createFromTemplate(template)
    } else {
      createForm()
    }
  }, [template])

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="text-sm text-slate-400">Creating new form...</div>
    </div>
  )
}
