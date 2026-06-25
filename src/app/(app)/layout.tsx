import { redirect } from 'next/navigation'
import { requireAuth, getSupabase } from '@/lib/supabase'
import { Sidebar } from '@/components/dashboard/Sidebar'

export const dynamic = 'force-dynamic'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAuth().catch(() => redirect('/auth'))
  const supabase = await getSupabase()

  const [{ data: rawProfile }, { data: rawForms }] = await Promise.all([
    supabase.from('profiles').select('email,username,image_url,plan').eq('id', user.id).maybeSingle(),
    supabase.from('forms').select('id').eq('owner_id', user.id),
  ])

  const forms = (rawForms ?? []) as { id: string }[]
  const profile = rawProfile as { username: string | null; image_url: string | null; plan: string } | null
  const meta = user.user_metadata ?? {}
  const displayName = meta.full_name ?? meta.name ?? profile?.username ?? user.email ?? 'Account'
  const avatarUrl = profile?.image_url ?? meta.avatar_url ?? meta.picture ?? ''
  const planLabel = profile?.plan ? profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1) + ' plan' : 'Starter plan'

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar displayName={displayName} avatarUrl={avatarUrl} planLabel={planLabel} formCount={forms.length} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
