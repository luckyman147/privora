import { hexToRgba } from '../design'
import type { DesignConfig } from '@/lib/types'

interface Props {
  d: DesignConfig
  progress: number
}

export function FormProgress({ d, progress }: Props) {
  if (!d.progress_bar) return null
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      height: d.progress_style === 'line' ? 3 : 8,
      backgroundColor: hexToRgba(d.progress_color, 0.15),
    }}>
      <div style={{
        height: '100%', width: `${progress}%`,
        backgroundColor: d.progress_color,
        borderRadius: d.progress_style === 'bar' ? '0 4px 4px 0' : 0,
        transition: 'width 0.4s ease',
      }} />
    </div>
  )
}
