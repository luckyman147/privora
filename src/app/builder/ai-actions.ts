'use server'
import { requireAuth, getSupabaseAction } from '@/lib/supabase/server'
import { callHuggingFaceChat } from '@/lib/ai/client'
import { generatedFormSchema, GENERATED_QUESTION_TYPES } from '@/lib/ai/schema'
import type { Question, DesignConfig } from '@/lib/types'

const MAX_DAILY = 2

const SYSTEM_PROMPT = `You generate survey forms as strict JSON. Given a user's description, respond with ONLY a JSON object (no prose, no markdown fences) matching this exact shape:

{
  "title": string,
  "description"?: string,
  "questions": [
    { "type": one of [${GENERATED_QUESTION_TYPES.map(t => `"${t}"`).join(', ')}],
      "label": string, "description"?: string, "required": boolean,
      "placeholder"?: string, "options"?: string[], "max_rating"?: number,
      "rows"?: string[], "columns"?: string[], "max_files"?: number, "accepted_types"?: string[] }
  ],
  "design_config": {
    "theme": "modern" | "soft" | "minimal" | "bold",
    "primary_color"?: string, "background_color"?: string,
    "header_type"?: "gradient" | "solid" | "none" | "image",
    "card_style"?: "soft_shadow" | "border" | "flat",
    "button_shape"?: "rounded" | "square" | "pill",
    "welcome_title"?: string, "welcome_subtitle"?: string, "welcome_button_label"?: string,
    "thankyou_title"?: string, "thankyou_button_label"?: string
  }
}

Pick "theme" by topic: "modern" for tech/corporate, "soft" for health/wellness, "minimal" for professional/consulting, "bold" for creative/entertainment. Pick a matching "primary_color".

Choose question types deliberately based on the question's purpose:
- short_text → name, email, single-line answers
- long_text → feedback, comments, open-ended
- multiple_choice → pick one from a list
- checkboxes → pick multiple from a list
- dropdown → long list of options (use instead of multiple_choice when there are 5+ options)
- rating → satisfaction, difficulty, scoring (1-5 or 1-10)
- date → date picker (birthday, appointment, deadline)
- matrix → grid of rows×columns (e.g. "rate each feature from 1-5")
- file_upload → when files/attachments are needed (resume, photo, document)
- section → visual header to group a set of questions
- page_break → when the form should span multiple pages

"options" required for multiple_choice, checkboxes, dropdown. "rows" and "columns" required for matrix. "section" and "page_break" only need a "label". Colors must be hex strings. Return ONLY the JSON object, nothing else.`

function stripCodeFence(raw: string): string {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
  return fenced ? fenced[1] : raw
}

async function checkRateLimit(userId: string) {
  const supabase = await getSupabaseAction()
  const today = new Date().toISOString().slice(0, 10)
  const { data } = await (supabase
    .from('ai_usage')
    .select('count')
    .eq('user_id', userId)
    .eq('date', today)
    .maybeSingle() as any) as { data: { count: number } | null }
  const count = data?.count ?? 0
  if (count >= MAX_DAILY) {
    const reset = new Date(); reset.setDate(reset.getDate() + 1); reset.setHours(0, 0, 0, 0)
    const hours = Math.ceil((reset.getTime() - Date.now()) / 3_600_000)
    throw new Error(`Daily AI generation limit reached (${MAX_DAILY}/${MAX_DAILY}). Resets in ~${hours}h`)
  }
  return { supabase, today, count }
}

export async function generateFormFromPrompt(prompt: string): Promise<{
  title: string
  description?: string
  questions: Omit<Question, 'id'>[]
  design_config: Partial<DesignConfig>
}> {
  const user = await requireAuth()
  const { supabase, today, count } = await checkRateLimit(user.id)

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
    throw new Error(`AI returned an invalid response: ${result.error.issues.map(i => i.path.join('.') + ' (' + i.message + ')').join('; ')}`)
  }

  await (supabase.from('ai_usage') as any).upsert(
    { user_id: user.id, date: today, count: count + 1 },
    { onConflict: 'user_id,date' }
  )

  return {
    title: result.data.title,
    description: result.data.description,
    questions: result.data.questions,
    design_config: result.data.design_config,
  }
}

export async function getRemainingAiGenerations(): Promise<number> {
  const user = await requireAuth()
  const supabase = await getSupabaseAction()
  const today = new Date().toISOString().slice(0, 10)
  const { data } = await (supabase
    .from('ai_usage')
    .select('count')
    .eq('user_id', user.id)
    .eq('date', today)
    .maybeSingle() as any) as { data: { count: number } | null }
  return Math.max(0, MAX_DAILY - (data?.count ?? 0))
}
