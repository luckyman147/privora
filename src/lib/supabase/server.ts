import { cache } from 'react'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database, Form, Response } from '../types'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

export const getSupabase = cache(async () => {
  const cookieStore = await cookies()
  return createServerClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set() {},
      remove() {},
    },
  })
})

export async function getSupabaseAction() {
  const cookieStore = await cookies()
  return createServerClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, value: string, options: CookieOptions) {
        cookieStore.set({ name, value: '', ...options })
      },
    },
  })
}

export async function requireAuth() {
  const supabase = await getSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthenticated')
  return user
}

export async function getFormById(id: string) {
  const supabase = await getSupabase()
  const { data, error } = await (supabase as any)
    .from('forms').select('*').eq('id', id).single()
  if (error) throw error
  return data as Form
}

export async function getFormResponses(formId: string, page = 1, limit = 20) {
  const supabase = await getSupabase()
  const from = (page - 1) * limit
  const { data, count, error } = await (supabase as any)
    .from('responses').select('*', { count: 'exact' })
    .eq('form_id', formId)
    .order('submitted_at', { ascending: false })
    .range(from, from + limit - 1)
  if (error) throw error
  return { data: (data ?? []) as Response[], total: count ?? 0 }
}
