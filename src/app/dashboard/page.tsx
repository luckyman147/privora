import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { requireAuth, getSupabase } from '@/lib/supabase'
import { Badge } from '@/components/ui/Badge'
import { DashboardLoading } from './loading'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard' }
export const dynamic = 'force-dynamic'

interface FormRow {
  id: string; title: string; mode: string; status: string; updated_at: string
}

interface CountRow {
  form_id: string
}

async function FormsList({ userId }: { userId: string }) {
  const supabase = await getSupabase()
  const { data: rawForms } = await supabase
    .from('forms')
    .select('id,title,mode,status,updated_at')
    .eq('owner_id', userId)
    .order('updated_at', { ascending: false })

  const forms = (rawForms ?? []) as unknown as FormRow[]

  const { data: rawCounts } = await supabase
    .from('responses')
    .select('form_id')

  const counts = (rawCounts ?? []) as unknown as CountRow[]

  const countMap = counts.reduce((acc, r) => {
    acc[r.form_id] = (acc[r.form_id] ?? 0) + 1; return acc
  }, {} as Record<string, number>)

  if (!forms.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-5 text-2xl">📝</div>
        <h3 className="font-bold text-slate-900 mb-2">No forms yet</h3>
        <p className="text-sm text-slate-500 mb-6">Create your first form to start collecting trusted responses.</p>
        <Link href="/builder" className="px-5 py-2 text-sm font-semibold text-white bg-sky-500 rounded-lg">Create form</Link>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {forms.map(form => (
        <Link key={form.id} href={`/builder/${form.id}`}
          className="flex items-center gap-4 bg-white border border-slate-200 rounded-2xl p-4 hover:border-slate-300 hover:shadow-sm transition-all">
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-slate-900 truncate mb-1">{form.title}</div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Badge variant={form.mode} />
              <span>{countMap[form.id] ?? 0} responses</span>
            </div>
          </div>
          <Badge variant={form.status} />
        </Link>
      ))}
    </div>
  )
}

export default async function DashboardPage() {
  const user = await requireAuth().catch(() => redirect('/auth'))
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-between p-7 bg-white border-b border-slate-200">
          <h1 className="text-xl font-extrabold tracking-tight">My Forms</h1>
          <Link href="/builder" className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-sky-500 rounded-lg shadow-sm">
            + Create form
          </Link>
        </div>
        <div className="p-7">
          <Suspense fallback={<DashboardLoading />}>
            <FormsList userId={user.id} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
