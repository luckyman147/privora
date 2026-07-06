export interface ChatMessage {
  role: 'system' | 'user'
  content: string
}

const HF_ROUTER_URL = 'https://router.huggingface.co/v1/chat/completions'
const HF_MODEL = 'meta-llama/Llama-3.1-8B-Instruct'

export async function callHuggingFaceChat(messages: ChatMessage[]): Promise<string> {
  const response = await fetch(HF_ROUTER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
    },
    body: JSON.stringify({ model: HF_MODEL, messages }),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.error ?? `Hugging Face request failed (${response.status})`)
  }

  const data = await response.json()
  const content = data?.choices?.[0]?.message?.content
  if (typeof content !== 'string') {
    throw new Error('Hugging Face returned an empty response')
  }
  return content
}
