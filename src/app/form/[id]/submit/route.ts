import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { hashToken } from '@/lib/utils'
import type { Form } from '@/lib/types'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: formId } = await params
    const supabase = await createServerSupabaseClient()
    const { data: raw } = await (supabase as any)
      .from('forms')
      .select('*')
      .eq('id', formId)
      .single()

    const form = raw as Form | null
    if (!form || form.status !== 'active') {
      return NextResponse.json({ error: 'Form not available' }, { status: 404 })
    }

    const body = await req.json()
    const { answers, submission_token } = body

    if (form.trust_config.submission_limit === 'one' && submission_token) {
      const tokenHash = await hashToken(form.id, submission_token)
      const { data: existing } = await (supabase as any)
        .from('submission_tokens')
        .select('hash')
        .eq('hash', tokenHash)
        .eq('form_id', form.id)
        .maybeSingle()
      if (existing) {
        return NextResponse.json({ error: 'Already submitted' }, { status: 409 })
      }
      await (supabase as any).from('submission_tokens').insert({ hash: tokenHash, form_id: form.id })
    }

    const required = form.questions.filter((q: any) => q.required)
    for (const q of required) {
      if (!answers[q.id] || answers[q.id] === '') {
        return NextResponse.json({ error: `"${q.label}" is required` }, { status: 400 })
      }
    }

    await (supabase as any).from('responses').insert({
      form_id:      form.id,
      answers:      answers,
      submitted_at: new Date().toISOString(),
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
