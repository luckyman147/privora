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
  email:      string
  username:   string | null
  image_url:  string | null
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
  | 'date' | 'file_upload' | 'section' | 'page_break'

export type MatrixCellType = 'short_answer' | 'rating' | 'date' | 'checkbox' | 'choice'

export interface MatrixColumn {
  name: string
  type: MatrixCellType
}

export type LogicOperator =
  | 'equals' | 'not_equals'
  | 'contains' | 'not_contains'
  | 'starts_with' | 'ends_with'
  | 'greater_than' | 'less_than'
  | 'is_any_of' | 'is_none_of'
  | 'before' | 'after'

export interface LogicCondition {
  question_id: string
  operator: LogicOperator
  value: string | string[]
}

export interface LogicGroup {
  conditions: LogicCondition[]
  match: 'all' | 'any'
}

export interface ConditionalLogic {
  groups: LogicGroup[]
  match: 'all' | 'any'
}

export interface Question {
  id:              string
  type:            QuestionType
  label:           string
  description?:    string
  required:        boolean
  placeholder?:    string
  max_chars?:      number
  options?:        string[]
  rows?:           string[]
  columns?:        string[]       // legacy / non-matrix
  matrix_columns?: MatrixColumn[] // per-column config for matrix
  max_rating?:     number
  cell_type?:      MatrixCellType // legacy fallback
  logic?:          ConditionalLogic
  // file_upload question config
  max_files?:      number         // default 1
  accepted_types?: string[]       // e.g. ['image/*', 'application/pdf']
}

export interface DesignConfig {
  theme:             'modern' | 'soft' | 'minimal' | 'bold'
  primary_color:     string
  background_color:  string
  heading_font:      string
  body_font:         string
  base_size:         string
  header_type:         'gradient' | 'solid' | 'none' | 'image'
  header_title?:         string
  header_description?:   string
  header_image_url?:     string
  header_title_color?:   string
  header_desc_color?:    string
  header_title_size?:    'small' | 'medium' | 'large'
  header_title_align?:   'left' | 'center'
  header_height:     'small' | 'medium' | 'large'
  card_style:        'soft_shadow' | 'border' | 'flat'
  corner_radius:     'none' | 'small' | 'medium' | 'large' | 'full'
  button_shape:      'rounded' | 'square' | 'pill'
  button_size:       'small' | 'medium' | 'large'
  progress_bar:      boolean
  progress_style:    'line' | 'bar'
  progress_color:    string
  animations:        boolean
  page_transition:   'fade' | 'slide' | 'none'
  element_animation: 'slide_up' | 'fade' | 'none'
  form_width:        'narrow' | 'medium' | 'wide' | 'full'
  page_padding:      'none' | 'small' | 'medium' | 'large' | 'extra_large'
  question_spacing:  'compact' | 'standard' | 'comfortable' | 'spacious'
  question_layout?:  'cards' | 'shared' | 'minimal'
  border_radius:     'none' | 'small' | 'medium' | 'large' | 'full'
  background_type:   'solid' | 'gradient' | 'image'
  // gradient background
  gradient_color_1?: string
  gradient_color_2?: string
  gradient_angle?:   '0deg' | '45deg' | '90deg' | '135deg' | '180deg' | '225deg' | '315deg'
  // image background
  background_image_url?: string
  // welcome screen
  welcome_enabled?: boolean
  welcome_title?: string
  welcome_subtitle?: string
  welcome_content?: string
  welcome_button_label?: string
  welcome_logo_url?: string
  welcome_button_color?: string
  welcome_text_color?: string
  welcome_layout?: 'center' | 'left'
  welcome_bg_image?: string
  welcome_button_shape?: 'pill' | 'round' | 'square'
  welcome_button_size?: 'small' | 'medium' | 'large'
  welcome_logo_height?: number
  welcome_logo_preset?: string
  welcome_container_enabled?: boolean
  welcome_container_bg?: string
  welcome_container_content?: string
  welcome_container_border_color?: string
  welcome_container_border_width?: number
  welcome_container_animation?: 'fade' | 'slide_up' | 'none'
  // thank you screen
  thankyou_title?: string
  thankyou_title_color?: string
  thankyou_button_label?: string
  thankyou_button_color?: string
  thankyou_show_button?: boolean
  thankyou_logo_url?: string
  thankyou_logo_height?: number
  thankyou_logo_preset?: string
  thankyou_container_enabled?: boolean
  thankyou_container_bg?: string
  thankyou_container_content?: string
  thankyou_container_border_color?: string
  thankyou_container_border_width?: number
  thankyou_container_animation?: 'fade' | 'slide_up' | 'none'
}

export interface NotificationsConfig {
  enabled:         boolean
  email:           string
  on_submission:   boolean
}

export interface ResponsesConfig {
  max_total_responses: number | null
  auto_close:          boolean
  allow_editing:       boolean
  confirmation_message: string
  collect_email:       boolean
}

export interface IntegrationsWebhook {
  url:     string
  enabled: boolean
}

export interface IntegrationsConfig {
  webhooks:     IntegrationsWebhook[]
  google_sheets: { enabled: boolean; sheet_id: string }
  zapier:       { enabled: boolean; webhook_url: string }
  email_export: { enabled: boolean; schedule: 'daily' | 'weekly' | 'monthly'; email: string }
}

export interface Form {
  id:                    string
  owner_id:              string
  title:                 string
  description?:          string
  trust_config:          TrustConfig
  design_config?:        DesignConfig
  notifications_config?:  NotificationsConfig
  responses_config?:      ResponsesConfig
  integrations_config?:   IntegrationsConfig
  questions:             Question[]
  status:                'draft' | 'active' | 'closed'
  language?:             string
  opens_at?:             string
  closes_at?:            string
  created_at:            string
  updated_at:            string
}

export type FormInsert = Omit<Form, 'id' | 'created_at' | 'updated_at'>

export interface Response {
  id:           string
  form_id:      string
  // file_upload answers are stored as string[] (array of public URLs)
  answers:      Record<string, string | string[] | number>
  submitted_at: string
}

export type ResponseInsert = Omit<Response, 'id' | 'submitted_at'>

export interface ResponseFile {
  id:          string
  response_id: string
  form_id:     string
  question_id: string
  file_url:    string
  file_name:   string | null
  created_at:  string
}

export interface FormListItem {
  id: string; title: string
  status: Form['status']; response_count: number; updated_at: string
}

export interface FormTemplate {
  id: string
  owner_id: string | null
  name: string
  description: string
  icon: string
  category: string
  questions: Question[]
  is_primitive: boolean
  created_at: string
  updated_at: string
}

export type FormTemplateInsert = Omit<FormTemplate, 'id' | 'created_at' | 'updated_at' | 'owner_id' | 'is_primitive'>

export type Plan = 'starter' | 'club' | 'institution'
export interface PlanLimit { forms: number; responses_per_month: number; members: number }
export const PLAN_LIMITS: Record<Plan, PlanLimit> = {
  starter:     { forms: 3,   responses_per_month: 100,  members: 1 },
  club:        { forms: 999, responses_per_month: 5000, members: 5 },
  institution: { forms: 999, responses_per_month: 999999,members: 999 },
}
