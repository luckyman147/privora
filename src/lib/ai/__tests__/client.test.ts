import { describe, it, expect, vi, afterEach } from 'vitest'
import { callHuggingFaceChat } from '../client'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

describe('callHuggingFaceChat', () => {
  it('returns the message content on success', async () => {
    vi.stubEnv('HUGGINGFACE_API_KEY', 'test-key')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ choices: [{ message: { content: '{"questions":[]}' } }] }),
    }))
    const result = await callHuggingFaceChat([{ role: 'user', content: 'hi' }])
    expect(result).toBe('{"questions":[]}')
  })

  it('throws with the HF error message on a non-OK response', async () => {
    vi.stubEnv('HUGGINGFACE_API_KEY', 'bad-key')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ error: 'Invalid credentials' }),
    }))
    await expect(callHuggingFaceChat([{ role: 'user', content: 'hi' }]))
      .rejects.toThrow('Invalid credentials')
  })

  it('throws a status-based error when the error body cannot be parsed', async () => {
    vi.stubEnv('HUGGINGFACE_API_KEY', 'bad-key')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => { throw new Error('not json') },
    }))
    await expect(callHuggingFaceChat([{ role: 'user', content: 'hi' }]))
      .rejects.toThrow('Hugging Face request failed (500)')
  })
})
