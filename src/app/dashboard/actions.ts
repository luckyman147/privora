'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAuth, getSupabase } from '@/lib/supabase'
import { DEFAULT_TRUST_CONFIG } from '@/lib/utils'
import type { Form } from '@/lib/types'

export async function createForm(mode: 'survey' | 'election' = 'survey') {
  const user = await requireAuth()
  const supabase = await getSupabase()
  const { data, error } = await (supabase as any).from('forms').insert({
    owner_id:     user.id,
    title:        'Untitled form',
    mode,
    trust_config: DEFAULT_TRUST_CONFIG,
    questions:    [],
    status:       'draft',
  }).select().single()
  if (error) throw new Error(error.message)
  redirect(`/builder/${(data as Form).id}`)
}

export async function deleteForm(formId: string) {
  const user = await requireAuth()
  const supabase = await getSupabase()
  await (supabase as any).from('forms')
    .delete()
    .eq('id', formId)
    .eq('owner_id', user.id)
  revalidatePath('/dashboard')
}

export async function duplicateForm(formId: string) {
  const user = await requireAuth()
  const supabase = await getSupabase()
  const { data: raw } = await (supabase as any)
    .from('forms').select('*').eq('id', formId).single()
  const original = raw as Form | null
  if (!original) return
  await (supabase as any).from('forms').insert({
    ...original,
    id:         undefined,
    owner_id:   user.id,
    title:      `${original.title} (copy)`,
    status:     'draft',
    created_at: undefined,
    updated_at: undefined,
  })
  revalidatePath('/dashboard')
}
