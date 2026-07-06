import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/supabase/server', () => ({
  requireAuth: vi.fn().mockResolvedValue({ id: 'user-1' }),
}))
vi.mock('@/lib/ai/client', () => ({
  callHuggingFaceChat: vi.fn(),
}))

import { generateFormFromPrompt } from '../ai-actions'
import { callHuggingFaceChat } from '@/lib/ai/client'

describe('generateFormFromPrompt', () => {
  it('returns validated questions and design_config on a valid response', async () => {
    vi.mocked(callHuggingFaceChat).mockResolvedValue(JSON.stringify({
      questions: [{ type: 'short_text', label: 'Your name?', required: true }],
      design_config: { theme: 'modern' },
    }))
    const result = await generateFormFromPrompt('a short survey')
    expect(result.questions).toHaveLength(1)
    expect(result.design_config.theme).toBe('modern')
  })

  it('throws a friendly error when the model returns non-JSON', async () => {
    vi.mocked(callHuggingFaceChat).mockResolvedValue('not json at all')
    await expect(generateFormFromPrompt('a short survey'))
      .rejects.toThrow('AI returned an invalid response, please try again')
  })

  it('throws a friendly error when the JSON fails schema validation', async () => {
    vi.mocked(callHuggingFaceChat).mockResolvedValue(JSON.stringify({ questions: [] }))
    await expect(generateFormFromPrompt('a short survey'))
      .rejects.toThrow('AI returned an invalid response, please try again')
  })

  it('propagates errors thrown by the Hugging Face client', async () => {
    vi.mocked(callHuggingFaceChat).mockRejectedValue(new Error('Invalid credentials'))
    await expect(generateFormFromPrompt('a short survey')).rejects.toThrow('Invalid credentials')
  })
})
