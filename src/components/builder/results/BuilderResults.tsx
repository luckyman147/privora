'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/browser'
import type { Form, Response } from '@/lib/types'
import { exportCsv } from './resultsUtils'
import { ResultsNav } from './nav/ResultsNav'
import { OverviewView } from './views/OverviewView'
import { AnalyticsView } from './views/AnalyticsView'
import { ExportsView } from './exports/ExportsView'
import { IndividualView } from './individual/IndividualView'
import { TrendsView } from './insights/TrendsView'
import { ReportsView } from './insights/ReportsView'
import { ComparisonView } from './insights/ComparisonView'

type NavKey = 'overview' | 'analytics' | 'exports' | 'individual' | 'trends' | 'reports' | 'comparison'

export function BuilderResults({ form }: { form: Form }) {
  const [responses, setResponses] = useState<Response[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeKey, setActiveKey] = useState<NavKey>('overview')
  const [previewId, setPreviewId] = useState<string | null>(null)

  useEffect(() => {
    ;(createClient() as any)
      .from('responses').select('*')
      .eq('form_id', form.id)
      .order('submitted_at', { ascending: false })
      .then(({ data, error }: any) => {
        if (!error) setResponses(data ?? [])
        setIsLoading(false)
      })
  }, [form.id])

  const realQs = form.questions.filter(q => q.type !== 'section' && q.type !== 'page_break')
  const total = responses.length
  const completionRate = total === 0 ? 0 : Math.round(
    (responses.filter(r =>
      realQs.filter(q => q.required).every(q => {
        const v = r.answers[q.id]
        return v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && !v.length)
      })
    ).length / total) * 100
  )

  async function handleDelete(id: string) {
    await (createClient() as any).from('responses').delete().eq('id', id)
    setResponses(prev => prev.filter(r => r.id !== id))
  }

  async function handleUpdate(id: string, answers: Record<string, any>) {
    await (createClient() as any).from('responses').update({ answers }).eq('id', id)
    setResponses(prev => prev.map(r => r.id === id ? { ...r, answers } : r))
  }

  function handlePreview(id: string) {
    setPreviewId(id)
    setActiveKey('individual')
  }

  function handleSelect(k: string) {
    setPreviewId(null)
    setActiveKey(k as NavKey)
  }

  const sharedProps = { form, responses, isLoading }

  return (
    <div className="flex flex-1 overflow-hidden bg-slate-50">
      <ResultsNav
        active={activeKey}
        onSelect={handleSelect}
        onExport={() => exportCsv(form.questions, responses)}
      />

      <div className="flex-1 overflow-hidden">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!isLoading && activeKey === 'overview' && (
          <OverviewView {...sharedProps} completionRate={completionRate} realQs={realQs} />
        )}

{!isLoading && activeKey === 'analytics' && (
          <AnalyticsView questions={form.questions} responses={responses} />
        )}

        {!isLoading && activeKey === 'exports' && (
          <ExportsView form={form} responses={responses} />
        )}

        {!isLoading && activeKey === 'individual' && (
          <IndividualView key={previewId ?? 'individual'} form={form} responses={responses} focusId={previewId ?? undefined} />
        )}

        {!isLoading && activeKey === 'trends' && (
          <TrendsView responses={responses} />
        )}

        {!isLoading && activeKey === 'reports' && (
          <ReportsView form={form} responses={responses} completionRate={completionRate} />
        )}

        {!isLoading && activeKey === 'comparison' && (
          <ComparisonView form={form} responses={responses} />
        )}
      </div>
    </div>
  )
}
