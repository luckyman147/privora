import { z } from 'zod'

export const signInSchema = z.object({
  email:    z.string().email('Valid email required'),
  password: z.string().min(8, 'Min 8 characters'),
})

export const signUpSchema = z.object({
  first_name: z.string().min(1, 'Required'),
  last_name:  z.string().min(1, 'Required'),
  email:      z.string().email('Valid email required'),
  username:   z.string().min(2, 'Username required'),
  password:   z.string().min(8, 'Min 8 characters'),
})

export const magicLinkSchema = z.object({
  email: z.string().email('Valid email required'),
})

export type SignInInput   = z.infer<typeof signInSchema>
export type SignUpInput   = z.infer<typeof signUpSchema>
export type MagicLinkInput = z.infer<typeof magicLinkSchema>
