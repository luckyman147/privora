import { describe, it, expect } from 'vitest'
import { generatedFormSchema } from '../schema'

describe('generatedFormSchema', () => {
  it('accepts a valid generated form payload', () => {
    const result = generatedFormSchema.safeParse({
      title: 'Course Feedback',
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
      title: 'x',
      questions: [{ type: 'signature_pad', label: 'Sign here', required: true }],
      design_config: {},
    })
    expect(result.success).toBe(false)
  })

  it('rejects a question missing a label', () => {
    const result = generatedFormSchema.safeParse({
      title: 'x',
      questions: [{ type: 'short_text', required: true }],
      design_config: {},
    })
    expect(result.success).toBe(false)
  })

  it('rejects an empty questions array', () => {
    const result = generatedFormSchema.safeParse({ title: 'x', questions: [], design_config: {} })
    expect(result.success).toBe(false)
  })

  it('rejects a payload missing a title', () => {
    const result = generatedFormSchema.safeParse({
      questions: [{ type: 'short_text', label: 'Name?', required: true }],
      design_config: {},
    })
    expect(result.success).toBe(false)
  })

  it('accepts a payload without a description', () => {
    const result = generatedFormSchema.safeParse({
      title: 'Course Feedback',
      questions: [{ type: 'short_text', label: 'Name?', required: true }],
      design_config: {},
    })
    expect(result.success).toBe(true)
  })

  it('accepts section and page_break question types', () => {
    const result = generatedFormSchema.safeParse({
      title: 'Course Feedback',
      questions: [
        { type: 'section', label: 'Part 1', required: false },
        { type: 'page_break', label: 'Page Break', required: false },
      ],
      design_config: {},
    })
    expect(result.success).toBe(true)
  })

  it('accepts welcome/thankyou copy fields', () => {
    const result = generatedFormSchema.safeParse({
      title: 'Course Feedback',
      description: 'A short survey about your course experience.',
      questions: [{ type: 'short_text', label: 'Name?', required: true }],
      design_config: {
        welcome_title: 'Welcome!', welcome_subtitle: 'Takes 2 minutes',
        welcome_button_label: 'Begin', thankyou_title: 'Thanks!', thankyou_button_label: 'Done',
      },
    })
    expect(result.success).toBe(true)
  })
})
