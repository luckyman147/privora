'use client'

function isImage(url: string) {
  return /\.(jpg|jpeg|png|gif|webp|svg|avif)(\?|$)/i.test(url)
}

function FileIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
    </svg>
  )
}

export function FileAnswer({ answers }: { answers: string | string[] | number | undefined }) {
  const urls: string[] = Array.isArray(answers)
    ? (answers as string[])
    : answers ? [String(answers)] : []

  if (!urls.length) return <span className="text-slate-300 italic text-sm">No file</span>

  return (
    <div className="flex flex-wrap gap-2 mt-1">
      {urls.map(url => {
        const name = decodeURIComponent(url.split('/').pop()?.split('?')[0] ?? 'file')
        return isImage(url) ? (
          <a key={url} href={url} target="_blank" rel="noopener noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={name} className="max-h-44 rounded-xl object-cover border border-slate-200 hover:opacity-90 transition" />
          </a>
        ) : (
          <a key={url} href={url} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-sky-600 hover:underline px-3 py-1.5 bg-sky-50 rounded-lg border border-sky-200">
            <FileIcon />{name}
          </a>
        )
      })}
    </div>
  )
}
