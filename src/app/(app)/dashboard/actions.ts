'use server'
import { redirect } from 'next/navigation'
import { getSupabaseAction as getSupabase } from '@/lib/supabase/server'
import type { Question } from '@/lib/types'

function uniqueTitle(desired: string, existing: string[]): string {
  if (!existing.includes(desired)) return desired
  let n = 2
  while (existing.includes(`${desired} (${n})`)) n++
  return `${desired} (${n})`
}

export async function logout() {
  const supabase = await getSupabase()
  await supabase.auth.signOut()
  redirect('/')
}

export async function createForm() {
  const supabase = await getSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  const { data: existing } = await (supabase as any)
    .from('forms').select('title').eq('owner_id', user.id)
  const titles = (existing ?? []).map((r: any) => r.title)
  const title = uniqueTitle('Untitled', titles)
  const { data, error } = await supabase
    .from('forms')
    .insert({ owner_id: user.id, title, mode: 'survey', trust_config: {}, questions: [] } as never)
    .select('id')
    .single()
  if (error) throw new Error(error.message)
  return (data as never as { id: string }).id
}

export async function createFromTemplate(templateId: string) {
  const supabase = await getSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: tpl, error: tplErr } = await (supabase as any)
    .from('form_templates')
    .select('*')
    .eq('id', templateId)
    .or(`owner_id.eq.${user.id},is_primitive.eq.true`)
    .single()
  if (tplErr || !tpl) throw new Error('Template not found')

  const questions: Question[] = (tpl.questions as Question[]).map((q: Question) => {
    const { id: _id, ...rest } = q
    return { ...rest, id: `q_${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}` }
  })

  const { data: existing } = await (supabase as any)
    .from('forms').select('title').eq('owner_id', user.id)
  const titles = (existing ?? []).map((r: any) => r.title)
  const title = uniqueTitle(tpl.name, titles)

  const { data, error } = await supabase
    .from('forms')
    .insert({ owner_id: user.id, title, mode: 'survey', trust_config: {}, questions } as never)
    .select('id')
    .single()
  if (error) throw new Error(error.message)
  redirect(`/builder/${(data as never as { id: string }).id}`)
}
