import type { ComponentType } from 'react'
import { MessageSquare, Calendar, Briefcase, BookOpen, User, BarChart2, ClipboardList } from 'lucide-react'

type IconProps = { className?: string }

export const TEMPLATE_ICON_MAP: Record<string, ComponentType<IconProps>> = {
  '📋': MessageSquare,
  '🎫': Calendar,
  '💼': Briefcase,
  '📝': BookOpen,
  '📇': User,
  '📊': BarChart2,
}

export const FALLBACK_TEMPLATE_ICON = ClipboardList

export const TEMPLATE_GRADIENTS: [string, string][] = [
  ['#7c3aed', '#a855f7'],
  ['#0ea5e9', '#38bdf8'],
  ['#10b981', '#34d399'],
  ['#f59e0b', '#fbbf24'],
  ['#ef4444', '#f87171'],
  ['#6366f1', '#818cf8'],
]
