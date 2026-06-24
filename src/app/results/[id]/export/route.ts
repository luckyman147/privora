import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, createServerSupabaseClient } from '@/lib/supabase'
import { responsesToCSV } from '@/lib/utils'
import type { Form } from '@/lib/types'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user     = await requireAuth()
  const supabase = createServerSupabaseClient()

  const { data: raw } = await (supabase as any)
    .from('forms').select('*')
    .eq('id', params.id).eq('owner_id', user.id).single()
  const form = raw as unknown as Form | null

  if (!form) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { data: responses } = await (supabase as any)
    .from('responses').select('*').eq('form_id', params.id)
    .order('submitted_at', { ascending: false })

  const csv = responsesToCSV(form, responses as any ?? [])
  const filename = `${form.title.replace(/[^a-z0-9]/gi,'_')}_responses.csv`

  return new NextResponse(csv, {
    headers: {
      'Content-Type':        'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
