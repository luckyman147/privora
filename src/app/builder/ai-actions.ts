'use server'
import { requireAuth } from '@/lib/supabase/server'
import { callHuggingFaceChat } from '@/lib/ai/client'
import { generatedFormSchema, GENERATED_QUESTION_TYPES } from '@/lib/ai/schema'
import type { Question, DesignConfig } from '@/lib/types'

const SYSTEM_PROMPT = `You generate survey forms as strict JSON. Given a user's description, respond with ONLY a JSON object (no prose, no markdown fences) matching this exact shape:

{
  "title": string,
  "description"?: string,
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
    "button_shape"?: "rounded" | "square" | "pill",
    "welcome_title"?: string, "welcome_subtitle"?: string, "welcome_button_label"?: string,
    "thankyou_title"?: string, "thankyou_button_label"?: string
  }
}

"title" must summarize the form's purpose in a few words. "options" is required for multiple_choice, checkboxes, and dropdown questions. "section" and "page_break" questions only need a "label" (no options). Colors must be hex strings. Return ONLY the JSON object, nothing else.`

// Some models wrap JSON in a markdown code fence despite instructions not to.
function stripCodeFence(raw: string): string {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
  return fenced ? fenced[1] : raw
}

export async function generateFormFromPrompt(prompt: string): Promise<{
  title: string
  description?: string
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
    parsed = JSON.parse(stripCodeFence(raw))
  } catch {
    console.error('generateFormFromPrompt: model returned non-JSON:', raw)
    throw new Error('AI returned an invalid response, please try again')
  }

  const result = generatedFormSchema.safeParse(parsed)
  if (!result.success) {
    console.error('generateFormFromPrompt: schema validation failed:', result.error.message, '\nraw:', raw)
    throw new Error('AI returned an invalid response, please try again')
  }

  return {
    title: result.data.title,
    description: result.data.description,
    questions: result.data.questions,
    design_config: result.data.design_config,
  }
}
