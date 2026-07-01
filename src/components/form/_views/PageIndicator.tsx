import { hexToRgba, SPACING } from '../design'
import type { DesignConfig } from '@/lib/types'

interface Props {
  d: DesignConfig
  pages: any[][]
  currentPage: number
}

export function PageIndicator({ d, pages, currentPage }: Props) {
  if (pages.length <= 1) return null
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: SPACING[d.question_spacing] }}>
      {pages.map((_, pi) => (
        <div key={pi} style={{
          height: 4, flex: 1, borderRadius: 9999,
          background: pi <= currentPage ? d.progress_color : hexToRgba(d.progress_color, 0.15),
          opacity: pi === currentPage ? 1 : pi < currentPage ? 0.6 : 1,
          transition: 'background 0.3s',
        }} />
      ))}
      <span style={{ fontSize: 12, color: '#94a3b8', whiteSpace: 'nowrap', marginLeft: 4 }}>
        {currentPage + 1} / {pages.length}
      </span>
    </div>
  )
}
