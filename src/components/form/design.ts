import { DEFAULT_DESIGN } from '@/lib/design'
import type { Form, DesignConfig, MatrixColumn } from '@/lib/types'

export function resolveDesign(form: Form): DesignConfig {
  return form.design_config
    ? { ...DEFAULT_DESIGN, ...form.design_config }
    : DEFAULT_DESIGN
}

export const WIDTHS: Record<DesignConfig['form_width'], string> = {
  narrow: '36rem', medium: '42rem', wide: '56rem', full: '100%',
}
export const PADDING: Record<DesignConfig['page_padding'], string> = {
  none: '16px 0', small: '24px 8px', medium: '48px 16px',
  large: '64px 24px', extra_large: '96px 32px',
}
export const SPACING: Record<DesignConfig['question_spacing'], string> = {
  compact: '12px', standard: '24px', comfortable: '32px', spacious: '48px',
}
export const CARD_RADIUS: Record<DesignConfig['corner_radius'], string> = {
  none: '0', small: '6px', medium: '12px', large: '16px', full: '24px',
}
export const BTN_RADIUS: Record<DesignConfig['button_shape'], string> = {
  rounded: '10px', square: '0', pill: '9999px',
}
export const BTN_PADDING: Record<DesignConfig['button_size'], string> = {
  small: '10px 28px', medium: '14px 36px', large: '18px 44px',
}
export const BTN_FONT_SIZE: Record<DesignConfig['button_size'], string> = {
  small: '14px', medium: '16px', large: '18px',
}
export const HEADER_H: Record<DesignConfig['header_height'], string> = {
  small: '90px', medium: '150px', large: '220px',
}

export function resolveQContainer(d: DesignConfig): React.CSSProperties {
  const layout = d.question_layout ?? 'cards'
  const base: React.CSSProperties = { display: 'flex', flexDirection: 'column' }
  if (layout === 'shared') return {
    ...base, gap: 0, backgroundColor: '#fff',
    borderRadius: CARD_RADIUS[d.corner_radius], border: '1px solid #e2e8f0', overflow: 'hidden',
  }
  return { ...base, gap: SPACING[d.question_spacing] }
}

export function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

export function hasMatrixAnswer(q: any, answers: Record<string, any>): boolean {
  const rows: string[] = q.rows?.length ? q.rows : ['Row 1', 'Row 2']
  const cols: MatrixColumn[] = q.matrix_columns?.length
    ? q.matrix_columns
    : (q.columns?.length ? q.columns : ['Column 1']).map((c: string) => ({ name: c, type: 'short_answer' as const }))
  for (let ri = 0; ri < rows.length; ri++) {
    for (let ci = 0; ci < cols.length; ci++) {
      const key = `${q.id}_${ri}_${ci}`
      const val = answers[key]
      if (val != null && val !== '' && val !== false) return true
      if (cols[ci].type === 'choice') {
        if (answers[`${q.id}_${ri}`] != null) return true
      }
    }
  }
  return false
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
