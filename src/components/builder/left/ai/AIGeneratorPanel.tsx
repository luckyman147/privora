'use client'
import { useState, useEffect } from 'react'
import { generateFormFromPrompt, getRemainingAiGenerations } from '@/app/builder/ai-actions'
import { GeneratedPreview } from './GeneratedPreview'
import type { Question, DesignConfig } from '@/lib/types'

type Generated = {
  title: string
  description?: string
  questions: Omit<Question, 'id'>[]
  design_config: Partial<DesignConfig>
}

interface Props {
  onApplyGenerated: (questions: Omit<Question, 'id'>[], design: Partial<DesignConfig>, title: string, description?: string) => void
}

export function AIGeneratorPanel({ onApplyGenerated }: Props) {
  const [prompt, setPrompt]   = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [result, setResult]   = useState<Generated | null>(null)
  const [remaining, setRemaining] = useState(0)

  useEffect(() => {
    getRemainingAiGenerations().then(setRemaining).catch(() => {})
  }, [])

  async function handleGenerate() {
    setLoading(true)
    setError(null)
    try {
      const generated = await generateFormFromPrompt(prompt)
      setResult(generated)
      getRemainingAiGenerations().then(setRemaining).catch(() => {})
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI generation failed')
    } finally {
      setLoading(false)
    }
  }

  if (result) {
    return (
      <GeneratedPreview
        title={result.title} description={result.description}
        questions={result.questions} design={result.design_config}
        onApply={(questions) => {
          onApplyGenerated(questions, result.design_config, result.title, result.description)
          setResult(null); setPrompt('')
        }}
        onDiscard={() => setResult(null)}
      />
    )
  }

  return (
    <div className="p-6 flex flex-col items-center text-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center text-2xl">✦</div>
      <div>
        <p className="text-sm font-semibold text-slate-900 mb-1">AI Form Generator</p>
        <p className="text-xs text-slate-500">Describe what you want to survey and we&apos;ll build it for you.</p>
      </div>
      <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
        placeholder="e.g. A 5-question satisfaction survey for a university course…" rows={4}
        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-violet-400 resize-none" />
      <button onClick={handleGenerate} disabled={loading || !prompt.trim() || remaining === 0}
        className="w-full py-2.5 bg-violet-500 hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition">
        {loading ? 'Generating…' : remaining === 0 ? 'Daily limit reached' : 'Generate form'}
      </button>
      {remaining === 0
        ? <p className="text-xs text-amber-600">Daily limit reached — resets tomorrow</p>
        : <p className="text-xs text-slate-400">{remaining} of 2 AI generations remaining today</p>}
      {error && (
        <p className="text-xs text-red-500">
          {error} — <button onClick={handleGenerate} className="underline">Try again</button>
        </p>
      )}
    </div>
  )
}
