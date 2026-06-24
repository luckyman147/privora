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
  id: string
  title: string
  mode: string
  status: string
  updated_at: string
}

interface CountRow {
  form_id: string
}

interface ProfileRow {
  org_name: string
}

async function FormsList({ userId }: { userId: string }) {
  const supabase = await getSupabase()
  const { data: rawForms } = await supabase
    .from('forms')
    .select('id,title,mode,status,updated_at')
    .eq('owner_id', userId)
    .order('updated_at', { ascending: false })

  const forms = (rawForms ?? []) as unknown as FormRow[]

  const { data: rawCounts } = await supabase.from('responses').select('form_id')

  const counts = (rawCounts ?? []) as unknown as CountRow[]

  const countMap = counts.reduce(
    (acc, r) => {
      acc[r.form_id] = (acc[r.form_id] ?? 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  if (!forms.length) {
    return (
      <div className='flex flex-col items-center justify-center py-24 text-center'>
        <div className='w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-5 text-2xl'>
          📝
        </div>
        <h3 className='font-bold text-slate-900 mb-2'>No forms yet</h3>
        <p className='text-sm text-slate-500 mb-6'>
          Create your first form to start collecting trusted responses.
        </p>
        <Link
          href='/builder'
          className='px-5 py-2 text-sm font-semibold text-white bg-sky-500 rounded-lg'
        >
          Create form
        </Link>
      </div>
    )
  }

  return (
    <div className='space-y-2'>
      {forms.map((form) => (
        <Link
          key={form.id}
          href={`/builder/${form.id}`}
          className='flex items-center gap-4 bg-white border border-slate-200 rounded-2xl p-4 hover:border-slate-300 hover:shadow-sm transition-all'
        >
          <div className='flex-1 min-w-0'>
            <div className='font-semibold text-slate-900 truncate mb-1'>
              {form.title}
            </div>
            <div className='flex items-center gap-2 text-xs text-slate-400'>
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
  const supabase = await getSupabase()
  const { data: profile } = await supabase
    .from('profiles')
    .select('org_name')
    .eq('id', user.id)
    .maybeSingle()

  const metadata = user.user_metadata ?? {}
  const displayName =
    metadata.full_name ??
    metadata.name ??
    metadata.user_name ??
    (profile as ProfileRow | null | undefined)?.org_name ??
    user.email ??
    'Account'
  const avatarUrl = metadata.avatar_url ?? metadata.picture ?? ''

  return (
    <div className='flex h-screen bg-slate-50 overflow-hidden'>
      <div className='flex-1 overflow-y-auto'>
        <div className='border-b border-slate-200 bg-white px-7 py-6'>
          <div className='flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between'>
            <div className='flex items-center gap-4'>
              <div className='h-14 w-14 overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200'>
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className='h-full w-full object-cover'
                  />
                ) : (
                  <div className='flex h-full w-full items-center justify-center text-lg font-bold text-slate-600'>
                    {displayName.slice(0, 1).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <p className='text-xs font-semibold uppercase tracking-[0.2em] text-slate-400'>
                  Signed in as
                </p>
                <h1 className='text-2xl font-extrabold tracking-tight text-slate-900'>
                  {displayName}
                </h1>
                <p className='text-sm text-slate-500'>{user.email}</p>
              </div>
            </div>

            <div className='flex items-center gap-3'>
              <div className='rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm'>
                <p className='text-xs font-semibold uppercase tracking-[0.16em] text-slate-400'>
                  Organization
                </p>
                <p className='font-semibold text-slate-900'>
                  {(profile as ProfileRow | null | undefined)?.org_name ??
                    'My Organization'}
                </p>
              </div>
              <Link
                href='/builder'
                className='flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600'
              >
                + Create form
              </Link>
            </div>
          </div>
        </div>

        <div className='p-7'>
          <div className='mb-6 grid gap-4 sm:grid-cols-3'>
            <div className='rounded-2xl border border-slate-200 bg-white p-4'>
              <p className='text-xs font-semibold uppercase tracking-[0.16em] text-slate-400'>
                Email
              </p>
              <p className='mt-2 break-all text-sm font-semibold text-slate-900'>
                {user.email}
              </p>
            </div>
            <div className='rounded-2xl border border-slate-200 bg-white p-4'>
              <p className='text-xs font-semibold uppercase tracking-[0.16em] text-slate-400'>
                Name
              </p>
              <p className='mt-2 text-sm font-semibold text-slate-900'>
                {displayName}
              </p>
            </div>
            <div className='rounded-2xl border border-slate-200 bg-white p-4'>
              <p className='text-xs font-semibold uppercase tracking-[0.16em] text-slate-400'>
                Status
              </p>
              <p className='mt-2 text-sm font-semibold text-emerald-600'>
                Authenticated
              </p>
            </div>
          </div>

          <Suspense fallback={<DashboardLoading />}>
            <FormsList userId={user.id} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
