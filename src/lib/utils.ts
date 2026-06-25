import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { TrustConfig, Form, Response, Question } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const TRUST_LABELS = {
  visibility: {
    creator_only: 'Creator only',
    org:          'Organization',
    public:       'Public',
  },
  identity: {
    anonymous: 'Anonymous',
    optional:  'Optional',
    required:  'Required',
  },
  ip_storage: {
    none:   'Not stored',
    hashed: 'Hashed only',
    stored: 'Stored',
  },
  submission_limit: {
    one:       '1 per person',
    unlimited: 'Unlimited',
  },
  retention_days: {},
}

export function trustScoreColor(score: number) {
  if (score === 5) return '#10B981'
  if (score >= 3) return '#F59E0B'
  return '#EF4444'
}

export const DEFAULT_TRUST_CONFIG: TrustConfig = {
  visibility:       'creator_only',
  identity:         'anonymous',
  ip_storage:       'none',
  submission_limit: 'one',
  retention_days:   90,
}

function csvCell(v: string): string {
  // Prefix formula-injection characters so Excel/Sheets treats them as text
  const safe = /^[=+\-@\t\r]/.test(v) ? `\t${v}` : v
  return `"${safe.replace(/"/g, '""')}"`
}

export function responsesToCSV(form: Form, responses: Response[]): string {
  const headers = ['submitted_at', ...form.questions.map(q => q.label)]
  const rows = responses.map(r => [
    r.submitted_at,
    ...form.questions.map(q => {
      const val = r.answers[q.id]
      return Array.isArray(val) ? val.join(';') : String(val ?? '')
    }),
  ])
  return [headers, ...rows]
    .map(r => r.map(v => csvCell(String(v))).join(','))
    .join('\n')
}

export async function hashToken(formId: string, userSeed: string): Promise<string> {
  const raw = `${formId}:${userSeed}`
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw))
  const arr = Array.from(new Uint8Array(buf))
  return arr.map(b => b.toString(16).padStart(2, '0')).join('')
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

export function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)   return 'just now'
  if (m < 60)  return `${m}m ago`
  if (m < 1440) return `${Math.floor(m/60)}h ago`
  return `${Math.floor(m/1440)}d ago`
}

export function newQuestionId(): string {
  return `q_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,6)}`
}

export function completionRate(responses: Response[], questions: Question[]): number {
  if (!responses.length) return 0
  const required = questions.filter(q => q.required)
  const complete = responses.filter(r =>
    required.every(q => r.answers[q.id] !== undefined && r.answers[q.id] !== '')
  )
  return Math.round((complete.length / responses.length) * 100)
}
