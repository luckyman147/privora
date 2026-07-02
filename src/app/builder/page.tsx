'use client'
import { Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { createForm, createFromTemplate } from '@/app/(app)/dashboard/actions'

function NewFormContent() {
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

export default function NewFormPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-slate-50"><div className="text-sm text-slate-400">Loading...</div></div>}>
      <NewFormContent />
    </Suspense>
  )
}
