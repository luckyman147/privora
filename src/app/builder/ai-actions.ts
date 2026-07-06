'use server'
import { requireAuth } from '@/lib/supabase/server'
import { callHuggingFaceChat } from '@/lib/ai/client'
import { generatedFormSchema, GENERATED_QUESTION_TYPES } from '@/lib/ai/schema'
import type { Question, DesignConfig } from '@/lib/types'

const SYSTEM_PROMPT = `You generate survey forms as strict JSON. Given a user's description, respond with ONLY a JSON object (no prose, no markdown fences) matching this exact shape:

{
  "questions": [
    { "type": one of [${GENERATED_QUESTION_TYPES.map(t => `"${t}"`).join(', ')}],
      "label": string, "description"?: string, "required": boolean,
      "placeholder"?: string, "options"?: string[], "max_rating"?: number }
  ],
  "design_config": {
    "theme"?: "modern" | "soft" | "minimal" | "bold",
    "primary_color"?: string, "background_color"?: string,
    "header_type"?: "gradient" | "solid" | "none" | "image",
    "card_style"?: "soft_shadow" | "border" | "flat",
    "button_shape"?: "rounded" | "square" | "pill"
  }
}

"options" is required for multiple_choice, checkboxes, and dropdown questions. Colors must be hex strings. Return ONLY the JSON object, nothing else.`

export async function generateFormFromPrompt(prompt: string): Promise<{
  questions: Omit<Question, 'id'>[]
  design_config: Partial<DesignConfig>
}> {
  await requireAuth()

  const raw = await callHuggingFaceChat([
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: prompt },
  ])

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new Error('AI returned an invalid response, please try again')
  }

  const result = generatedFormSchema.safeParse(parsed)
  if (!result.success) {
    throw new Error('AI returned an invalid response, please try again')
  }

  return {
    questions: result.data.questions,
    design_config: result.data.design_config,
  }
}
