import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  ButtonVariant
  size?:     'sm' | 'md' | 'lg'
  loading?:  boolean
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary:   'bg-sky-500 text-white hover:bg-sky-600 shadow-sm shadow-sky-200',
  secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
  ghost:     'bg-transparent text-slate-500 border border-slate-200 hover:bg-slate-50',
  danger:    'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100',
}
const SIZES = {
  sm: 'px-3 py-1.5 text-xs font-semibold rounded-lg',
  md: 'px-4 py-2 text-sm font-semibold rounded-lg',
  lg: 'px-6 py-3 text-sm font-bold rounded-xl',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, children, className, disabled, ...rest }, ref) => (
    <button ref={ref} disabled={disabled || loading}
      className={cn(VARIANTS[variant], SIZES[size], 'transition-colors disabled:opacity-50', className)} {...rest}>
      {loading ? <span className="animate-spin mr-2">⟳</span> : null}
      {children}
    </button>
  )
)
Button.displayName = 'Button'
