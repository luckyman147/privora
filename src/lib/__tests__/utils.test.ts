import { describe, it, expect } from 'vitest'
import { cn, formatDate, newQuestionId, trustScoreColor } from '../utils'
import { calcTrustScore } from '../types'
import type { TrustConfig } from '../types'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2')
  })
})

describe('formatDate', () => {
  it('formats ISO date string', () => {
    const result = formatDate('2026-06-24T12:00:00Z')
    expect(result).toContain('Jun')
    expect(result).toContain('24')
    expect(result).toContain('2026')
  })
})

describe('newQuestionId', () => {
  it('returns a unique id starting with q_', () => {
    const id = newQuestionId()
    expect(id).toMatch(/^q_/)
  })
})

describe('trustScoreColor', () => {
  it('returns green for score 5', () => expect(trustScoreColor(5)).toBe('#10B981'))
  it('returns amber for score 3', () => expect(trustScoreColor(3)).toBe('#F59E0B'))
  it('returns red for score 0', () => expect(trustScoreColor(0)).toBe('#EF4444'))
})

describe('calcTrustScore', () => {
  const fullPrivacy: TrustConfig = {
    visibility: 'creator_only',
    identity: 'anonymous',
    ip_storage: 'none',
    submission_limit: 'one',
    retention_days: 30,
  }
  it('scores 5 for full privacy config', () => {
    expect(calcTrustScore(fullPrivacy)).toBe(5)
  })
  it('scores 0 for no privacy config', () => {
    const none: TrustConfig = {
      visibility: 'public',
      identity: 'required',
      ip_storage: 'stored',
      submission_limit: 'unlimited',
      retention_days: 365,
    }
    expect(calcTrustScore(none)).toBe(0)
  })
})
