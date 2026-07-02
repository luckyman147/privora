'use client'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
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
      className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition">
      {pending
        ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
        : <Plus className="w-4 h-4" />}
      {pending ? 'Creating…' : 'New form'}
    </button>
  )
}
