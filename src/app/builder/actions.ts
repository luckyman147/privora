'use server'
import { revalidatePath } from 'next/cache'
import { requireAuth, createServerSupabaseClient } from '@/lib/supabase'
import type { Form } from '@/lib/types'

export async function saveForm(form: Form) {
  const user = await requireAuth()
  const supabase = createServerSupabaseClient()
  const { error } = await (supabase as any).from('forms').update({
    title:        form.title,
    mode:         form.mode,
    trust_config: form.trust_config,
    questions:    form.questions,
    updated_at:   new Date().toISOString(),
  }).eq('id', form.id).eq('owner_id', user.id)
  if (error) throw error
  revalidatePath(`/builder/${form.id}`)
}

export async function publishForm(formId: string) {
  const user = await requireAuth()
  const supabase = createServerSupabaseClient()
  const { error } = await (supabase as any).from('forms')
    .update({ status: 'active', updated_at: new Date().toISOString() })
    .eq('id', formId).eq('owner_id', user.id)
  if (error) throw error
  revalidatePath(`/form/${formId}`)
}
