'use client'
import { useEffect } from 'react'
import { createForm } from '@/app/(app)/dashboard/actions'

export default function NewFormPage() {
  useEffect(() => {
    createForm('survey')
  }, [])
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="text-sm text-slate-400">Creating new form...</div>
    </div>
  )
}
