'use client'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createForm } from '@/app/(app)/dashboard/actions'

export default function CreateFormButton() {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function handleClick() {
    startTransition(async () => {
      const id = await createForm()
      router.push(`/builder/${id}`)
    })
  }

  return (
    <button onClick={handleClick} disabled={pending}
      className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 disabled:bg-sky-400 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition">
      {pending ? (
        <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Creating...</>
      ) : '+ Create form'}
    </button>
  )
}
