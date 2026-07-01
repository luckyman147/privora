import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAction as getSupabase } from '@/lib/supabase/server'
import { hashToken } from '@/lib/utils'
import { isQuestionVisible } from '@/lib/logic'
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
    if (!form) {
      return NextResponse.json({ error: 'Form not available' }, { status: 404 })
    }
    if (form.status !== 'active') {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || user.id !== form.owner_id) {
        return NextResponse.json({ error: 'Form not available' }, { status: 404 })
      }
    }

    const body = await req.json()
    if (!body || typeof body !== 'object' || Buffer.byteLength(JSON.stringify(body)) > 512_000) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }
    const { answers, submission_token } = body as { answers: Record<string, unknown>; submission_token?: string }
    if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
      return NextResponse.json({ error: 'Invalid answers' }, { status: 400 })
    }
    const validIds = new Set<string>(form.questions.map((q: any) => q.id))
    const isValidKey = (key: string) =>
      key.startsWith('__identity_') || validIds.has(key) || [...validIds].some(id => key.startsWith(id + '_'))
    for (const key of Object.keys(answers)) {
      if (!isValidKey(key)) {
        return NextResponse.json({ error: 'Invalid answer key' }, { status: 400 })
      }
    }

    if ((form.trust_config?.submission_limit ?? 'unlimited') === 'one') {
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

    const required = form.questions.filter((q: any) => q.required && isQuestionVisible(q, answers as Record<string, any>, form.questions))
    for (const q of required) {
      const isAnswered = q.type === 'matrix'
        ? Object.keys(answers).some(k => k.startsWith(q.id + '_') && answers[k] != null && answers[k] !== '' && answers[k] !== false)
        : answers[q.id] != null && answers[q.id] !== ''
      if (!isAnswered) {
        return NextResponse.json({ error: `"${q.label}" is required` }, { status: 400 })
      }
    }

    const { data: inserted, error: insertErr } = await (supabase as any)
      .from('responses')
      .insert({ form_id: form.id, answers, submitted_at: new Date().toISOString() })
      .select('id')
      .single()
    if (insertErr) throw insertErr
    const responseId: string = inserted.id

    // Populate response_files for every file_upload answer
    const fileQuestionIds = new Set(
      form.questions
        .filter((q: any) => q.type === 'file_upload')
        .map((q: any) => q.id)
    )
    const fileRows: { response_id: string; form_id: string; question_id: string; file_url: string; file_name: string | null }[] = []
    for (const [qId, value] of Object.entries(answers)) {
      if (!fileQuestionIds.has(qId)) continue
      const urls: string[] = Array.isArray(value) ? value : typeof value === 'string' ? [value] : []
      for (const url of urls) {
        if (!url) continue
        const fileName = url.split('/').pop()?.split('?')[0] ?? null
        fileRows.push({ response_id: responseId, form_id: form.id, question_id: qId, file_url: url, file_name: fileName })
      }
    }
    if (fileRows.length > 0) {
      await (supabase as any).from('response_files').insert(fileRows)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[submit]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
