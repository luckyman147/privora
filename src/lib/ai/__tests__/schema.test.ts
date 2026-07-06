import { describe, it, expect } from 'vitest'
import { generatedFormSchema } from '../schema'

describe('generatedFormSchema', () => {
  it('accepts a valid generated form payload', () => {
    const result = generatedFormSchema.safeParse({
      questions: [
        { type: 'short_text', label: 'What is your name?', required: true },
        { type: 'rating', label: 'Rate your experience', required: false, max_rating: 5 },
      ],
      design_config: { theme: 'modern', primary_color: '#7C3AED' },
    })
    expect(result.success).toBe(true)
  })

  it('rejects an unknown question type', () => {
    const result = generatedFormSchema.safeParse({
      questions: [{ type: 'signature_pad', label: 'Sign here', required: true }],
      design_config: {},
    })
    expect(result.success).toBe(false)
  })

  it('rejects a question missing a label', () => {
    const result = generatedFormSchema.safeParse({
      questions: [{ type: 'short_text', required: true }],
      design_config: {},
    })
    expect(result.success).toBe(false)
  })

  it('rejects an empty questions array', () => {
    const result = generatedFormSchema.safeParse({ questions: [], design_config: {} })
    expect(result.success).toBe(false)
  })
})
