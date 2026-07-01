import { CARD_RADIUS, hexToRgba, formatBytes } from '../design'
import type { DesignConfig, Question } from '@/lib/types'

interface Props {
  q: Question
  d: DesignConfig
  answers: Record<string, any>
  onAnswer: (key: string, value: any) => void
}

export function FileUpload({ q, d, answers, onAnswer }: Props) {
  const maxFiles = q.max_files ?? 1
  const accept = q.accepted_types?.join(',') ?? undefined
  const picked: File[] = Array.isArray(answers[q.id])
    ? answers[q.id] as File[]
    : answers[q.id] instanceof File ? [answers[q.id] as File] : []

  const removeFile = (idx: number) => {
    const next = picked.filter((_, i) => i !== idx)
    onAnswer(q.id, next.length ? next : undefined)
  }

  const addFiles = (files: FileList | null) => {
    if (!files) return
    onAnswer(q.id, [...picked, ...Array.from(files)].slice(0, maxFiles))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {picked.map((f, idx) => (
        <div key={idx} style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
          background: hexToRgba(d.primary_color, 0.06),
          border: `1px solid ${hexToRgba(d.primary_color, 0.2)}`,
          borderRadius: CARD_RADIUS[d.corner_radius],
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            backgroundColor: hexToRgba(d.primary_color, 0.12),
          }}>
            <svg viewBox="0 0 20 20" fill={d.primary_color} style={{ width: 18, height: 18 }}>
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</p>
            <p style={{ fontSize: 11, color: '#94a3b8' }}>{formatBytes(f.size)}</p>
          </div>
          <button type="button" onClick={() => removeFile(idx)}
            style={{ color: '#cbd5e1', fontSize: 16, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>✕</button>
        </div>
      ))}
      {picked.length < maxFiles && (
        <label style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          height: 108, border: `2px dashed ${hexToRgba(d.primary_color, 0.3)}`,
          borderRadius: CARD_RADIUS[d.corner_radius], cursor: 'pointer',
          transition: 'all 0.15s',
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke={d.primary_color} strokeWidth={1.5} style={{ width: 28, height: 28, marginBottom: 6, opacity: 0.7 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <span style={{ fontSize: 13, fontWeight: 600, color: d.primary_color }}>
            {picked.length === 0 ? 'Click to upload' : 'Add another file'}
          </span>
          <span style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
            {accept ?? 'Any file type'} · max 50 MB{maxFiles > 1 ? ` · up to ${maxFiles} files` : ''}
          </span>
          <input type="file" style={{ display: 'none' }} accept={accept}
            multiple={maxFiles > 1}
            onChange={e => addFiles(e.target.files)} />
        </label>
      )}
    </div>
  )
}
