'use server'
import { revalidatePath } from 'next/cache'
import { requireAuth, getSupabaseAction as getSupabase } from '@/lib/supabase/server'
import type { Form } from '@/lib/types'

export async function saveForm(form: Form) {
  const user = await requireAuth()
  const supabase = await getSupabase()
  const { data: sameName } = await (supabase as any)
    .from('forms').select('id').eq('owner_id', user.id).eq('title', form.title).neq('id', form.id).maybeSingle()
  const title = sameName ? `${form.title} (2)` : form.title
  const { error } = await (supabase as any).from('forms').update({
    title,
    description:   form.description ?? null,
    status:        form.status,
    language:      form.language ?? null,
    opens_at:      form.opens_at  ?? null,
    closes_at:     form.closes_at ?? null,
    trust_config:        form.trust_config,
    design_config:       form.design_config ?? null,
    notifications_config: form.notifications_config ?? null,
    responses_config:    form.responses_config ?? null,
    integrations_config: form.integrations_config ?? null,
    questions:           form.questions,
    updated_at:    new Date().toISOString(),
  }).eq('id', form.id).eq('owner_id', user.id)
  if (error) throw error
  revalidatePath(`/builder/${form.id}`)
  revalidatePath(`/form/${form.id}`)
  return title
}

export async function publishForm(formId: string) {
  const user = await requireAuth()
  const supabase = await getSupabase()
  const { error } = await (supabase as any).from('forms')
    .update({ status: 'active', updated_at: new Date().toISOString() })
    .eq('id', formId).eq('owner_id', user.id)
  if (error) throw error
  revalidatePath(`/form/${formId}`)
}

export async function unpublishForm(formId: string) {
  const user = await requireAuth()
  const supabase = await getSupabase()
  const { error } = await (supabase as any).from('forms')
    .update({ status: 'draft', updated_at: new Date().toISOString() })
    .eq('id', formId).eq('owner_id', user.id)
  if (error) throw error
  revalidatePath(`/form/${formId}`)
}

export async function archiveForm(formId: string) {
  const user = await requireAuth()
  const supabase = await getSupabase()
  const { error } = await (supabase as any).from('forms')
    .update({ status: 'closed', updated_at: new Date().toISOString() })
    .eq('id', formId).eq('owner_id', user.id)
  if (error) throw error
  revalidatePath(`/builder/${formId}`)
}

export async function deleteForm(formId: string) {
  const user = await requireAuth()
  const supabase = await getSupabase()
  const { error } = await (supabase as any).from('forms')
    .delete().eq('id', formId).eq('owner_id', user.id)
  if (error) throw error
}

export async function listTemplates() {
  const user = await requireAuth()
  const supabase = await getSupabase()
  const { data, error } = await (supabase as any)
    .from('form_templates')
    .select('*')
    .or(`is_primitive.eq.true,owner_id.eq.${user.id}`)
    .order('is_primitive', { ascending: false })
    .order('name')
  if (error) throw new Error(error.message)
  return data as any[]
}

export async function saveAsTemplate(name: string, description: string, questions: any[]) {
  const user = await requireAuth()
  const supabase = await getSupabase()
  const clean = questions.map((q: any) => { const { id, ...rest } = q; return rest })
  const { data, error } = await (supabase as any)
    .from('form_templates')
    .insert({ owner_id: user.id, name, description, questions: clean, is_primitive: false })
    .select('id')
    .single()
  if (error) throw new Error(error.message)
  return data as { id: string }
}

export async function saveAsTemplateFromForm(name: string, description: string, formId: string) {
  const user = await requireAuth()
  const supabase = await getSupabase()
  const { data: form } = await (supabase as any).from('forms').select('questions').eq('id', formId).eq('owner_id', user.id).single()
  if (!form) throw new Error('Form not found')
  const clean = form.questions.map((q: any) => { const { id, ...rest } = q; return rest })
  const { data, error } = await (supabase as any)
    .from('form_templates')
    .insert({ owner_id: user.id, name, description, questions: clean, is_primitive: false })
    .select('id')
    .single()
  if (error) throw new Error(error.message)
  return data as { id: string }
}

export async function updateTemplate(id: string, data: { name?: string; description?: string; icon?: string; questions?: any[] }) {
  const user = await requireAuth()
  const supabase = await getSupabase()
  const clean: any = { ...data, updated_at: new Date().toISOString() }
  if (clean.questions) {
    clean.questions = clean.questions.map((q: any) => { const { id, ...rest } = q; return rest })
  }
  const { error } = await (supabase as any)
    .from('form_templates')
    .update(clean)
    .eq('id', id).eq('owner_id', user.id).eq('is_primitive', false)
  if (error) throw new Error(error.message)
}

export async function deleteTemplate(id: string) {
  const user = await requireAuth()
  const supabase = await getSupabase()
  const { data: tpl } = await (supabase as any)
    .from('form_templates').select('is_primitive').eq('id', id).single()
  if (tpl?.is_primitive) throw new Error('Cannot delete a primitive template')
  const { error } = await (supabase as any)
    .from('form_templates').delete().eq('id', id).eq('owner_id', user.id)
  if (error) throw new Error(error.message)
}
