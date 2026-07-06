'use client'
import { useEffect, useRef, useState, Suspense, lazy } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/browser'
import { saveForm, publishForm, unpublishForm } from '../actions'
import { newQuestionId } from '@/lib/utils'
import { toast } from 'sonner'
import { CHOICE_TYPES, TYPE_META } from '@/components/builder/meta'
import { BuilderTopBar } from '@/components/builder/topbar/BuilderTopBar'
import { BuilderLeftPanel } from '@/components/builder/left/BuilderLeftPanel'
import { BuilderCanvas } from '@/components/builder/canvas/BuilderCanvas'
import { DEFAULT_DESIGN } from '@/lib/design'
import type { Form, Question, QuestionType, TrustConfig, DesignConfig } from '@/lib/types'

// Non-default tabs are code-split via React.lazy (not next/dynamic, which triggers a
// _document page-collection bug on this Next version): each pulls in a heavy, independent
// subtree (the Design tab alone is 1500+ lines of panels) that a Build-tab visit never needs.
const TAB_LOADING = (
  <div className="flex-1 flex items-center justify-center">
    <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
  </div>
)
const BuilderDesign = lazy(() => import('@/components/builder/design/BuilderDesign').then(m => ({ default: m.BuilderDesign })))
const BuilderSettings = lazy(() => import('@/components/builder/settings/BuilderSettings').then(m => ({ default: m.BuilderSettings })))
const BuilderShare = lazy(() => import('@/components/builder/share/BuilderShare').then(m => ({ default: m.BuilderShare })))
const BuilderResults = lazy(() => import('@/components/builder/results/BuilderResults').then(m => ({ default: m.BuilderResults })))

const MIN_W = 200, MAX_W = 520

export default function BuilderPage() {
  const params  = useParams()
  const formId  = params?.id as string
  const [form, setForm]             = useState<Form | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [saving, setSaving]         = useState(false)
  const [activeTab, setActiveTab]   = useState('Build')
  const [sidebarW, setSidebarW]     = useState(288)
  const formRef      = useRef<Form | null>(null)
  const saveTimer    = useRef<ReturnType<typeof setTimeout>>()
  const resizeCleanup = useRef<(() => void) | null>(null)

  // must be above the early-return guard so hook order is stable on every render
  useEffect(() => () => { resizeCleanup.current?.() }, [])

  useEffect(() => {
    if (!formId) return
    ;(createClient() as any).from('forms').select('*').eq('id', formId).single()
      .then(({ data, error }: any) => {
        if (error || !data) {
          // form not found or no permission — redirect to dashboard
          window.location.replace('/dashboard')
          return
        }
        const form: Form = {
          ...data,
          questions: data.questions ?? [],
          trust_config: {
            visibility:       data.trust_config?.visibility       ?? 'creator_only',
            identity:         data.trust_config?.identity         ?? 'anonymous',
            ip_storage:       data.trust_config?.ip_storage       ?? 'none',
            submission_limit: data.trust_config?.submission_limit ?? 'unlimited',
            retention_days:   data.trust_config?.retention_days   ?? 90,
          },
          design_config: data.design_config
            ? { ...DEFAULT_DESIGN, ...data.design_config }
            : DEFAULT_DESIGN,
        }
        setForm(form)
        formRef.current = form
        if (form.questions.length) setSelectedId(form.questions[0].id)
      })
  }, [formId])

  function scheduleAutoSave() {
    clearTimeout(saveTimer.current)
    // always reads latest form from ref — never captures a stale snapshot
    saveTimer.current = setTimeout(async () => {
      if (!formRef.current) return
      try {
        const savedTitle = await saveForm(formRef.current)
        if (savedTitle !== formRef.current.title) {
          formRef.current = { ...formRef.current!, title: savedTitle }
          setForm(formRef.current)
        }
      }
      catch (e) { console.warn('auto-save failed', e) }
    }, 1200)
  }

  function patchForm(fn: (f: Form) => Form) {
    setForm(prev => {
      const next = fn(prev!)
      formRef.current = next      // keep ref in sync before timer fires
      return next
    })
    scheduleAutoSave()
  }

  if (!form) return (
    <div className="flex items-center justify-center h-screen bg-slate-50">
      <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  // ── question mutations ──────────────────────────────────────────────────────

  function addQuestion(type: QuestionType) {
    const q: Question = {
      id: newQuestionId(), type, required: false,
      label: type === 'section' ? 'New Section' : type === 'page_break' ? 'Page Break'
           : `New ${TYPE_META[type]?.label ?? type} question`,
      options: CHOICE_TYPES.includes(type) ? ['Option 1', 'Option 2'] : undefined,
      rows:    type === 'matrix' ? ['Row 1', 'Row 2', 'Row 3'] : undefined,
      matrix_columns: type === 'matrix' ? [
        { name: 'Column 1', type: 'short_answer' },
        { name: 'Column 2', type: 'rating' },
      ] : undefined,
    }
    patchForm(f => ({ ...f, questions: [...f.questions, q] }))
    setSelectedId(q.id)
  }

  function updateQuestion(id: string, patch: Partial<Question>) {
    patchForm(f => ({ ...f, questions: f.questions.map(q => q.id === id ? { ...q, ...patch } : q) }))
  }

  function deleteQuestion(id: string) {
    const f    = formRef.current!
    const idx  = f.questions.findIndex(q => q.id === id)
    const rest = f.questions.filter(q => q.id !== id)
    setSelectedId(rest[Math.max(0, idx - 1)]?.id ?? null)
    patchForm(f => ({ ...f, questions: rest }))
  }

  function copyQuestion(id: string) {
    const f   = formRef.current!
    const src = f.questions.find(q => q.id === id)
    if (!src) return
    const copy = { ...src, id: newQuestionId(), label: src.label + ' (copy)' }
    const idx  = f.questions.findIndex(q => q.id === id)
    const qs   = [...f.questions]
    qs.splice(idx + 1, 0, copy)
    setSelectedId(copy.id)
    patchForm(f => ({ ...f, questions: qs }))
  }

  function addPageBreakAt(afterIndex: number) {
    const section = { id: newQuestionId(), type: 'section' as const, required: false, label: 'New Section' }
    const pageBreak = { id: newQuestionId(), type: 'page_break' as const, required: false, label: 'Page Break' }
    patchForm(f => {
      const qs = [...f.questions]
      qs.splice(afterIndex + 1, 0, pageBreak, section)
      return { ...f, questions: qs }
    })
  }

  function moveQuestion(id: string, dir: -1 | 1) {
    patchForm(f => {
      const qs  = [...f.questions]
      const idx = qs.findIndex(q => q.id === id)
      const to  = idx + dir
      if (to < 0 || to >= qs.length) return f
      ;[qs[idx], qs[to]] = [qs[to], qs[idx]]
      return { ...f, questions: qs }
    })
  }

  function applyTemplate(questions: Omit<Question, 'id'>[]) {
    patchForm(f => ({ ...f, questions: questions.map(q => ({ ...q, id: newQuestionId() })) }))
    toast.success('Template applied')
  }

  function applyGenerated(questions: Omit<Question, 'id'>[], design: Partial<DesignConfig>, title: string, description?: string) {
    patchForm(f => ({
      ...f,
      title,
      description,
      questions: questions.map(q => ({ ...q, id: newQuestionId() })),
      design_config: { ...(f.design_config ?? DEFAULT_DESIGN), ...design },
    }))
    toast.success('AI form applied')
  }

  // ── sidebar resize ──────────────────────────────────────────────────────────

  function startResize(e: React.MouseEvent) {
    e.preventDefault()
    const startX = e.clientX, startW = sidebarW
    const onMove = (e: MouseEvent) => setSidebarW(Math.max(MIN_W, Math.min(MAX_W, startW + e.clientX - startX)))
    const onUp   = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      resizeCleanup.current = null
    }
    resizeCleanup.current = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  // ── top-bar actions ─────────────────────────────────────────────────────────

  async function handleSave() {
    clearTimeout(saveTimer.current)
    setSaving(true)
    try   { await saveForm(formRef.current!); toast.success('Saved') }
    catch { toast.error('Save failed') }
    finally { setSaving(false) }
  }

  async function handlePublish() {
    setSaving(true)
    const isActive = form!.status === 'active'
    try {
      if (isActive) {
        await unpublishForm(form!.id)
        patchForm(f => ({ ...f, status: 'draft' }))
        toast.success('Form unpublished')
      } else {
        await publishForm(form!.id)
        patchForm(f => ({ ...f, status: 'active' }))
        toast.success('Form published!')
      }
    } catch { toast.error(isActive ? 'Unpublish failed' : 'Publish failed') }
    finally { setSaving(false) }
  }

  async function handlePreview() {
    clearTimeout(saveTimer.current)
    try { await saveForm(formRef.current!) } catch {}
    window.open(`/form/${form!.id}?_t=${Date.now()}`, '_blank')
  }

  function handleTabChange(tab: string) {
    setActiveTab(tab)
  }

  // ── render ──────────────────────────────────────────────────────────────────

  const design = form.design_config ?? DEFAULT_DESIGN
  const displayTitle = design.header_title || form.title

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      <BuilderTopBar form={form} saving={saving} activeTab={activeTab}
        onTitleChange={t    => patchForm(f => ({ ...f, title: t }))}
        onSave={handleSave} onPublish={handlePublish} onTabChange={handleTabChange}
        onPreview={handlePreview} />

      {activeTab === 'Design' ? (
        <Suspense fallback={TAB_LOADING}>
          <BuilderDesign
            form={form} design={design}
            onUpdate={d => patchForm(f => ({ ...f, design_config: d }))}
            onFormPatch={patchForm} />
        </Suspense>
      ) : activeTab === 'Settings' ? (
        <Suspense fallback={TAB_LOADING}><BuilderSettings form={form} onPatch={patchForm} /></Suspense>
      ) : activeTab === 'Share' ? (
        <Suspense fallback={TAB_LOADING}><BuilderShare form={form} /></Suspense>
      ) : activeTab === 'Results' ? (
        <Suspense fallback={TAB_LOADING}><BuilderResults form={form} /></Suspense>
      ) : (
        <div className="flex flex-1 overflow-hidden select-none">
          <BuilderLeftPanel style={{ width: sidebarW, minWidth: sidebarW }}
            onAddQuestion={addQuestion} onApplyTemplate={applyTemplate} onApplyGenerated={applyGenerated} />
          <div onMouseDown={startResize}
            className="w-1 hover:w-1.5 bg-slate-200 hover:bg-sky-400 cursor-col-resize shrink-0 transition-all duration-100" />
          <BuilderCanvas
            title={displayTitle} description={form.description}
            questions={form.questions} selectedId={selectedId}
            onTitleChange={t => patchForm(f => ({
              ...f, title: t,
              design_config: f.design_config!.header_title
                ? { ...f.design_config!, header_title: t }
                : f.design_config!,
            }))}
            onDescChange={d  => patchForm(f => ({ ...f, description: d }))}
            onSelect={id => setSelectedId(prev => prev === id ? null : id)}
            onAdd={addQuestion} onDelete={deleteQuestion}
            onCopy={copyQuestion} onMove={moveQuestion}
            onReorder={qs => patchForm(f => ({ ...f, questions: qs }))}
            onUpdate={updateQuestion} onAddPageBreakAt={addPageBreakAt} />
        </div>
      )}
    </div>
  )
}
