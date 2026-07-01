'use client'
import { useState } from 'react'
const CATS = [
  { id: 'desktop', label: 'Desktop', n: 69 },
  { id: 'gradient', label: 'Gradient', n: 90 },
  { id: 'minimal', label: 'Minimal', n: 65 },
  { id: 'pattern', label: 'Pattern', n: 49 },
] as const

function build(cat: string, n: number) {
  const a: { id: string; url: string }[] = []
  for (let i = 1; i <= n; i++) {
    const s = String(i).padStart(2, '0')
    a.push({ id: `${cat}-${s}`, url: `/images/backgrounds/${cat}/${cat}-${s}.jpg` })
  }
  return a
}

export function BackgroundGallery({ value, onChange }: { value: string | undefined; onChange: (url: string) => void }) {
  const [cat, setCat] = useState('desktop')
  const c = CATS.find(c => c.id === cat)!
  const images = build(cat, c.n)
  return (
    <div className="space-y-3">
      <div className="flex gap-1.5 flex-wrap">
        {CATS.map(c => (
          <button key={c.id} onClick={() => setCat(c.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
              cat === c.id ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}>
            {c.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-2 max-h-56 overflow-y-auto">
        {images.map(img => (
          <button key={img.id} onClick={() => onChange(img.url)}
            className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition hover:opacity-90 ${
              value === img.url ? 'border-violet-500 ring-2 ring-violet-200' : 'border-transparent'
            }`}>
            <img src={img.url} alt={img.id} className="w-full h-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  )
}
