'use client'
import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

export function QrCodeCard({ url }: { url: string | null }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!url) return
    QRCode.toDataURL(url, {
      width: 200,
      margin: 2,
      color: { dark: '#1e293b', light: '#ffffff' },
    }).then(setDataUrl).catch(() => {})
  }, [url])

  function download() {
    if (!dataUrl) return
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = 'form-qr.png'
    a.click()
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <h3 className="text-sm font-bold text-slate-800 mb-1">QR Code</h3>
      <p className="text-xs text-slate-400 mb-4">Let respondents scan to open the form on their phone.</p>
      <div className="flex items-center gap-6">
        <div className="w-[120px] h-[120px] shrink-0 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center bg-white">
          {dataUrl
            ? <img src={dataUrl} alt="QR code" width={120} height={120} className="block" />
            : <div className="w-full h-full bg-slate-100 animate-pulse rounded-xl" />
          }
        </div>
        <div className="space-y-3">
          <p className="text-sm text-slate-600">
            Print it, add it to posters, or include it in presentations for offline sharing.
          </p>
          <button onClick={download} disabled={!dataUrl}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition disabled:opacity-40 disabled:cursor-not-allowed">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Download PNG
          </button>
        </div>
      </div>
    </div>
  )
}
