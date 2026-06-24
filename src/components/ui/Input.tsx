import { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?:   string
  error?:   string
  hint?:    string
}

export function Input({ label, error, hint, className, ...rest }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</label>}
      <input
        className={cn(
          'w-full px-3.5 py-2.5 text-sm border rounded-xl bg-white text-slate-900',
          'placeholder:text-slate-400 transition-colors',
          'focus:outline-none focus:border-sky-400 focus:ring-3 focus:ring-sky-100',
          error ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : 'border-slate-200',
          className
        )}
        {...rest}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint  && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  )
}
