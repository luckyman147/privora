export interface Database {
  public: {
    Tables: {
      profiles:  { Row: Profile;  Insert: Partial<Profile>;  Update: Partial<Profile>  }
      forms:     { Row: Form;     Insert: FormInsert;         Update: Partial<FormInsert> }
      responses: { Row: Response; Insert: ResponseInsert;     Update: Partial<ResponseInsert> }
      submission_tokens: {
        Row: { hash: string; form_id: string; created_at: string }
        Insert: { hash: string; form_id: string; created_at?: string }
        Update: Partial<{ hash: string; form_id: string; created_at: string }>
      }
    }
  }
}

export interface Profile {
  id:         string
  org_name:   string
  plan:       'starter' | 'club' | 'institution'
  created_at: string
}

export interface TrustConfig {
  visibility:       'creator_only' | 'org' | 'public'
  identity:         'anonymous' | 'optional' | 'required'
  ip_storage:       'none' | 'hashed' | 'stored'
  submission_limit: 'one' | 'unlimited'
  retention_days:   30 | 90 | 180 | 365
}

export function calcTrustScore(cfg: TrustConfig): number {
  let score = 0
  if (cfg.visibility === 'creator_only') score++
  if (cfg.identity    === 'anonymous')   score++
  if (cfg.ip_storage  === 'none')        score++
  if (cfg.submission_limit === 'one')    score++
  if (cfg.retention_days  <= 90)         score++
  return score
}

export type QuestionType =
  | 'short_text' | 'long_text' | 'multiple_choice'
  | 'checkboxes' | 'dropdown'   | 'rating' | 'matrix'

export interface Question {
  id:          string
  type:        QuestionType
  label:       string
  required:    boolean
  options?:    string[]
  rows?:       string[]
  columns?:    string[]
  max_rating?: number
  logic?:      ConditionalLogic
}

export interface ConditionalLogic {
  show_if_question_id: string
  show_if_answer:      string
}

export interface Form {
  id:           string
  owner_id:     string
  title:        string
  description?: string
  mode:         'survey' | 'election'
  trust_config: TrustConfig
  questions:    Question[]
  status:       'draft' | 'active' | 'closed'
  created_at:   string
  updated_at:   string
  closes_at?:   string
}

export type FormInsert = Omit<Form, 'id' | 'created_at' | 'updated_at'>

export interface Response {
  id:           string
  form_id:      string
  answers:      Record<string, string | string[] | number>
  submitted_at: string
}

export type ResponseInsert = Omit<Response, 'id' | 'submitted_at'>

export interface FormListItem {
  id: string; title: string; mode: Form['mode']
  status: Form['status']; response_count: number; updated_at: string
}

export type Plan = 'starter' | 'club' | 'institution'
export interface PlanLimit { forms: number; responses_per_month: number; members: number }
export const PLAN_LIMITS: Record<Plan, PlanLimit> = {
  starter:     { forms: 3,   responses_per_month: 100,  members: 1 },
  club:        { forms: 999, responses_per_month: 5000, members: 5 },
  institution: { forms: 999, responses_per_month: 999999,members: 999 },
}
