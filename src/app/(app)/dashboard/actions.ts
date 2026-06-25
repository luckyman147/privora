'use server'
import { redirect } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'

export async function logout() {
  const supabase = await getSupabase()
  await supabase.auth.signOut()
  redirect('/')
}

export async function createForm(mode: 'survey' | 'election') {
  const supabase = await getSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  const { data, error } = await supabase
    .from('forms')
    .insert({ owner_id: user.id, title: 'Untitled', mode, trust_config: {}, questions: [] } as never)
    .select('id')
    .single()
  if (error) throw new Error(error.message)
  redirect(`/builder/${(data as never as { id: string }).id}`)
}
