import { z } from 'zod'

export const GENERATED_QUESTION_TYPES = [
  'short_text', 'long_text', 'multiple_choice',
  'checkboxes', 'dropdown', 'rating', 'date',
  'section', 'page_break',
] as const

export const generatedQuestionSchema = z.object({
  type:        z.enum(GENERATED_QUESTION_TYPES),
  label:       z.string().min(1),
  description: z.string().optional(),
  required:    z.boolean(),
  placeholder: z.string().optional(),
  options:     z.array(z.string()).optional(),
  max_rating:  z.number().optional(),
})

export const generatedDesignSchema = z.object({
  theme:                 z.enum(['modern', 'soft', 'minimal', 'bold']).optional(),
  primary_color:         z.string().optional(),
  background_color:      z.string().optional(),
  header_type:           z.enum(['gradient', 'solid', 'none', 'image']).optional(),
  card_style:            z.enum(['soft_shadow', 'border', 'flat']).optional(),
  button_shape:          z.enum(['rounded', 'square', 'pill']).optional(),
  welcome_title:         z.string().optional(),
  welcome_subtitle:      z.string().optional(),
  welcome_button_label:  z.string().optional(),
  thankyou_title:        z.string().optional(),
  thankyou_button_label: z.string().optional(),
})

export const generatedFormSchema = z.object({
  title:         z.string().min(1),
  description:   z.string().optional(),
  questions:     z.array(generatedQuestionSchema).min(1),
  design_config: generatedDesignSchema,
})

export type GeneratedQuestion = z.infer<typeof generatedQuestionSchema>
export type GeneratedDesign   = z.infer<typeof generatedDesignSchema>
export type GeneratedForm     = z.infer<typeof generatedFormSchema>
