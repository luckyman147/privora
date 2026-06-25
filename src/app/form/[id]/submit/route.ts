import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { hashToken } from '@/lib/utils'
import type { Form } from '@/lib/types'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: formId } = await params
    const supabase = await getSupabase()
    const { data: formData } = await (supabase as any)
      .from('forms')
      .select('*')
      .eq('id', formId)
      .single()

    const form = formData as Form | null
    if (!form || form.status !== 'active') {
      return NextResponse.json({ error: 'Form not available' }, { status: 404 })
    }

    const body = await req.json()
    if (!body || typeof body !== 'object' || Buffer.byteLength(JSON.stringify(body)) > 512_000) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }
    const { answers, submission_token } = body as { answers: Record<string, unknown>; submission_token?: string }
    if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
      return NextResponse.json({ error: 'Invalid answers' }, { status: 400 })
    }
    const validIds = new Set(form.questions.map((q: any) => q.id))
    for (const key of Object.keys(answers)) {
      if (!validIds.has(key)) {
        return NextResponse.json({ error: 'Invalid answer key' }, { status: 400 })
      }
    }

    if (form.trust_config.submission_limit === 'one') {
      if (!submission_token) {
        return NextResponse.json({ error: 'Submission token required' }, { status: 400 })
      }
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
  } catch (err) {
    console.error('[submit]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
