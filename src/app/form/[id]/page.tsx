'use client'
import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/browser'
import { resolveDesign, WIDTHS, PADDING, resolveQContainer } from '@/components/form/design'
import { useFormSubmit } from '@/components/form/useFormSubmit'
import { useFormDraft } from '@/components/form/_hooks/useFormDraft'
import { LoadingScreen } from '@/components/form/_screens/LoadingScreen'
import { WelcomeScreen } from '@/components/form/_screens/WelcomeScreen'
import { SubmittedScreen } from '@/components/form/_screens/SubmittedScreen'
import { FormProgress } from '@/components/form/_screens/FormProgress'
import { FormHeader } from '@/components/form/_views/FormHeader'
import { PageIndicator } from '@/components/form/_views/PageIndicator'
import { FormNav } from '@/components/form/_views/FormNav'
import { QuestionCard } from '@/components/form/_renderer/QuestionCard'
import { QuestionRenderer } from '@/components/form/_renderer/QuestionRenderer'
import { IdentityFields } from '@/components/form/IdentityFields'
import { isQuestionVisible } from '@/lib/logic'
import { animKF } from '@/components/builder/design/primitives'
import type { Form } from '@/lib/types'

export default function FormViewPage() {
  const params = useParams()
  const formId = params?.id as string | undefined
  const searchParams = useSearchParams()
  const cacheKey = searchParams?.get('_t') ?? ''

  const [form, setForm] = useState<Form | null>(null)
  const [closedMsg, setClosedMsg] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [submitted, setSubmitted] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [welcomeDismissed, setWelcomeDismissed] = useState(false)

  useEffect(() => {
    if (!formId) return
    ;(createClient() as any).from('forms').select('*').eq('id', formId).single()
      .then(({ data }: any) => {
        if (!data) return
        const f = data as Form
        setForm(f)
        const now = new Date()
        if (f.opens_at && new Date(f.opens_at) > now)
          setClosedMsg("This form isn't open yet. Please check back later.")
        else if (f.closes_at && new Date(f.closes_at) < now)
          setClosedMsg('This form is no longer accepting responses.')
      })
  }, [formId, cacheKey])

  useEffect(() => {
    if (!form) return
    const d = resolveDesign(form)
    const fonts = [...new Set([d.heading_font, d.body_font])].filter(Boolean)
    if (!fonts.length) return
    const id = 'form-preview-fonts'
    let link = document.getElementById(id) as HTMLLinkElement | null
    if (!link) {
      link = document.createElement('link')
      link.id = id; link.rel = 'stylesheet'
      document.head.appendChild(link)
    }
    link.href = `https://fonts.googleapis.com/css2?${fonts.map(f => `family=${f.replace(/ /g, '+')}:wght@400;600;700`).join('&')}&display=swap`
  }, [form])

  const { clearDraft } = useFormDraft(formId, answers, setAnswers)

  const handleAnswer = (key: string, value: any) =>
    setAnswers(prev => ({ ...prev, [key]: value }))

  const { handleNext, handleSubmit } = useFormSubmit(
    form, answers, () => { setSubmitted(true); clearDraft() }, setUploading, () => setSubmitting(false))

  if (!form) return <LoadingScreen />
  const d = resolveDesign(form)
  if (closedMsg) return <SubmittedScreen d={d} title="Form unavailable" message={closedMsg} />

  const pages = (() => {
    const result: (typeof form.questions[0])[][] = []
    let cur: (typeof form.questions[0])[] = []
    for (const q of form.questions) {
      if (q.type === 'page_break') { result.push(cur); cur = [] }
      else cur.push(q)
    }
    result.push(cur)
    return result.filter(p => p.length > 0)
  })()

  const currentPageQs = pages[currentPage] ?? []

  const absoluteIndex: Record<string, number> = {}
  let qNum = 0
  for (const q of form.questions) {
    if (q.type !== 'section' && q.type !== 'page_break') absoluteIndex[q.id] = qNum++
  }

  const visibleQs = form.questions.filter(q => q.type !== 'section' && q.type !== 'page_break' && isQuestionVisible(q, answers, form.questions))
  const answered = visibleQs.filter(q => {
    if (q.type === 'matrix') return true
    const v = answers[q.id]
    return v != null && v !== '' && !(Array.isArray(v) && v.length === 0)
  })
  const progress = visibleQs.length === 0 ? 100 : Math.round((answered.length / visibleQs.length) * 100)

  const pageBgStyle: React.CSSProperties = (() => {
    if (d.background_type === 'gradient') {
      const c1 = d.gradient_color_1 ?? d.primary_color
      const c2 = d.gradient_color_2 ?? '#a855f7'
      return { backgroundImage: `linear-gradient(${d.gradient_angle ?? '135deg'}, ${c1}, ${c2})` }
    }
    if (d.background_type === 'image' && d.background_image_url) {
      return {
        backgroundImage: `url(${d.background_image_url})`,
        backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
      }
    }
    return { backgroundColor: d.background_color }
  })()

  if (d.welcome_enabled !== false && !welcomeDismissed) {
    return <WelcomeScreen d={d} form={form} onStart={() => setWelcomeDismissed(true)} />
  }

  if (submitted) return <SubmittedScreen d={d} message={form.responses_config?.confirmation_message} />

  return (
    <div style={{ minHeight: '100vh', fontFamily: d.body_font, ...pageBgStyle }}>
      <FormProgress d={d} progress={progress} />

      <div style={{
        maxWidth: WIDTHS[d.form_width], margin: '0 auto',
        padding: PADDING[d.page_padding], fontFamily: d.body_font,
      }}>
        <FormHeader d={d} form={form} cardStyle={{}} />

        <PageIndicator d={d} pages={pages} currentPage={currentPage} />

        <div style={{
          ...resolveQContainer(d),
          ...(d.animations && d.page_transition !== 'none'
            ? { animation: `${d.page_transition === 'slide' ? 'pslide' : 'pfade'} 0.35s ease-out` }
            : {}),
        }} key={currentPage}>
          {currentPage === 0 && (
            <IdentityFields identity={form.trust_config.identity}
              answers={answers} d={d} onAnswer={handleAnswer} />
          )}
          {currentPageQs.filter(q => isQuestionVisible(q, answers, form.questions)).map((q, idx) => {
            const elAnim: React.CSSProperties = d.animations && d.element_animation !== 'none'
              ? { animation: `${d.element_animation === 'slide_up' ? 'wslide' : 'wfade'} 0.3s ease-out ${idx * 0.06}s both` }
              : {}
            if (q.type === 'section') {
              return (
                <div key={q.id} style={{ paddingTop: 8, ...elAnim }}>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', fontFamily: d.heading_font, marginBottom: 2 }}>
                    {q.label}
                  </h2>
                  {q.description && <p style={{ fontSize: 12, color: '#94a3b8' }}>{q.description}</p>}
                </div>
              )
            }
            return (
              <div key={q.id} style={elAnim}>
                <QuestionCard q={q} index={absoluteIndex[q.id]} d={d}>
                  <QuestionRenderer q={q} d={d} answers={answers} onAnswer={handleAnswer} />
                </QuestionCard>
              </div>
            )
          })}
        </div>

        <FormNav d={d} currentPage={currentPage} totalPages={pages.length}
          submitting={submitting} uploading={uploading}
          onBack={() => { setCurrentPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          onNext={() => handleNext(currentPageQs.filter(q => isQuestionVisible(q, answers, form.questions)), () => {
            setCurrentPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' })
          })}
          onSubmit={() => handleSubmit(() => setSubmitting(true))} />
      </div>

      <style>{animKF}</style>
    </div>
  )
}
