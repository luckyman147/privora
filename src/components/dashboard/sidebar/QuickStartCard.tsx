import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import type { FormTemplate } from '@/lib/types'
import { TEMPLATE_ICON_MAP, TEMPLATE_GRADIENTS, FALLBACK_TEMPLATE_ICON } from './icons'

interface Props { templates: FormTemplate[] }

export function QuickStartCard({ templates }: Props) {
  if (templates.length === 0) return null

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Quick start</p>
        <Link href="/templates" className="text-[11px] font-semibold text-violet-600 hover:text-violet-700 transition">
          View all
        </Link>
      </div>
      <div className="space-y-0.5">
        {templates.slice(0, 6).map((template, i) => {
          const [from, to] = TEMPLATE_GRADIENTS[i % TEMPLATE_GRADIENTS.length]
          const Icon = TEMPLATE_ICON_MAP[template.icon] ?? FALLBACK_TEMPLATE_ICON
          return (
            <Link key={template.id} href={`/builder?template=${template.id}`}
              className="flex items-center gap-3 px-2.5 py-2 rounded-xl hover:bg-slate-50 group transition">
              <div className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}>
                <Icon className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-800 truncate group-hover:text-violet-700 transition">
                  {template.name}
                </p>
                <p className="text-[11px] text-slate-400">
                  {template.questions.length} question{template.questions.length !== 1 ? 's' : ''} &middot; {template.category}
                </p>
              </div>
              <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-violet-400 transition shrink-0" />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
