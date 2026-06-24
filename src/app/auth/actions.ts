'use server'
import { redirect } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'
import { signInSchema, signUpSchema, magicLinkSchema } from './schema'

export async function signIn(formData: FormData) {
  const parsed = signInSchema.safeParse({
    email:    formData.get('email'),
    password: formData.get('password'),
  })
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }
  const supabase = await getSupabase()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)
  if (error) return { error: error.message }
  redirect('/dashboard')
}

export async function signUp(formData: FormData) {
  const parsed = signUpSchema.safeParse({
    first_name: formData.get('first_name'),
    last_name:  formData.get('last_name'),
    email:      formData.get('email'),
    org_name:   formData.get('org_name'),
    password:   formData.get('password'),
  })
  if (!parsed.success) return { error: parsed.error.errors[0].message }
  const supabase = await getSupabase()
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        first_name: parsed.data.first_name,
        last_name:  parsed.data.last_name,
        org_name:   parsed.data.org_name,
      },
    },
  })
  if (error) return { error: error.message }
  redirect('/dashboard')
}

export async function sendMagicLink(formData: FormData) {
  const parsed = magicLinkSchema.safeParse({ email: formData.get('email') })
  if (!parsed.success) return { error: parsed.error.errors[0].message }
  const supabase = await getSupabase()
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback` },
  })
  if (error) return { error: error.message }
  return { success: true }
}

export async function signOut() {
  const supabase = await getSupabase()
  await supabase.auth.signOut()
  redirect('/')
}

export async function signInWithProvider(provider: 'google' | 'github') {
  const supabase = await getSupabase()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback` },
  })
  if (error) return { error: error.message }
  if (data.url) redirect(data.url)
}
