import { redirect } from 'next/navigation'
import Link from 'next/link'
import { requireAuth, getSupabase } from '@/lib/supabase/server'
import { getTemplateIcon } from '@/lib/utils'
import type { Metadata } from 'next'
import type { FormTemplate } from '@/lib/types'

export const metadata: Metadata = { title: 'Templates' }

export default async function TemplatesPage() {
  const user = await requireAuth().catch(() => redirect('/auth'))
  const supabase = await getSupabase()

  const { data: rawTemplates } = await (supabase as any)
    .from('form_templates')
    .select('*')
    .or(`owner_id.eq.${user.id},is_primitive.eq.true`)
    .order('name', { ascending: true })

  const templates = (rawTemplates ?? []) as FormTemplate[]

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Templates</h1>
          <p className="text-sm text-slate-500 mt-1">Pre-built forms to get started fast</p>
        </div>
      </div>

      {!templates.length ? (
        <div className="text-center py-24 text-slate-400">
          <p className="text-lg font-semibold mb-2">No templates yet</p>
          <p className="text-sm">Save a form as a template from the builder to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((t) => (
            <Link
              key={t.id}
              href={`/builder?template=${t.id}`}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:border-sky-300 hover:shadow-sm transition"
            >
              <div className="text-2xl mb-3">{getTemplateIcon(t.icon)}</div>
              <h3 className="font-semibold text-slate-900 mb-1 truncate">{t.name}</h3>
              {t.description && (
                <p className="text-xs text-slate-500 line-clamp-2">{t.description}</p>
              )}
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                <span>{t.category}</span>
                <span>&middot;</span>
                <span>{t.questions.length} questions</span>
                {t.is_primitive && (
                  <>
                    <span>&middot;</span>
                    <span className="text-sky-500 font-medium">Official</span>
                  </>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
