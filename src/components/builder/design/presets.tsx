'use client'
import { type ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  Activity, Album, BookOpen, Brain, CheckCircle, Cloud, Coffee, Compass, Crown, Droplets, Eye,
  Feather, Flame, Flag, Gem, Globe, HeartHandshake, Key, Lamp, Leaf, Lightbulb, Map, Mountain,
  Music, Palette, Puzzle, Scroll, Shield, Sparkles, Sun, Sword, Telescope, Trophy, Waves, Wind, Zap,
} from 'lucide-react'
import type { DesignConfig } from '@/lib/types'

export type Preset = { id: string; label: string; render: (c: string, h?: number) => ReactNode }

const icon = (c: string, El: LucideIcon, h = 32) => <El size={h} stroke={c} fill={c + '22'} strokeWidth={1.5} />

export const LOGO_PRESETS: Preset[] = [
  { id: 'checkmark', label: 'Check', render: (c, h = 32) => <svg viewBox="0 0 24 24" fill="none" style={{ width: h, height: h }}><circle cx="12" cy="12" r="10" stroke={c} strokeWidth={2} /><path d="M9 12l2 2 4-4" stroke={c} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" /></svg> },
  { id: 'star', label: 'Star', render: (c, h = 32) => <svg viewBox="0 0 24 24" fill="none" style={{ width: h, height: h }}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke={c} strokeWidth={2} fill={c + '22'} /></svg> },
  { id: 'heart', label: 'Heart', render: (c, h = 32) => <svg viewBox="0 0 24 24" fill="none" style={{ width: h, height: h }}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke={c} strokeWidth={2} fill={c + '22'} /></svg> },
  { id: 'thumbsup', label: 'Thumbs up', render: (c, h = 32) => <svg viewBox="0 0 24 24" fill="none" style={{ width: h, height: h }}><path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg> },
  { id: 'award', label: 'Award', render: (c, h = 32) => <svg viewBox="0 0 24 24" fill="none" style={{ width: h, height: h }}><circle cx="12" cy="8" r="6" stroke={c} strokeWidth={2} /><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.11" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg> },
  { id: 'smiley', label: 'Smiley', render: (c, h = 32) => <svg viewBox="0 0 24 24" fill="none" style={{ width: h, height: h }}><circle cx="12" cy="12" r="10" stroke={c} strokeWidth={2} /><path d="M8 14s1.5 2 4 2 4-2 4-2" stroke={c} strokeWidth={2} strokeLinecap="round" /><circle cx="9" cy="9" r="1" fill={c} /><circle cx="15" cy="9" r="1" fill={c} /></svg> },
  { id: 'rocket', label: 'Rocket', render: (c, h = 32) => <svg viewBox="0 0 24 24" fill="none" style={{ width: h, height: h }}><path d="M12 15l-3-3m0 0l3-3m-3 3H3m3-6.5A9 9 0 0112 3a9 9 0 016 2.5M15 12l3 3m0 0l-3 3m3-3h3" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="12" r="2" fill={c} /></svg> },
  { id: 'gift', label: 'Gift', render: (c, h = 32) => <svg viewBox="0 0 24 24" fill="none" style={{ width: h, height: h }}><rect x="3" y="8" width="18" height="4" rx="1" stroke={c} strokeWidth={2} /><path d="M12 8v13M12 8H7.5a2.5 2.5 0 010-5C10 3 12 5.5 12 8zM12 8h4.5a2.5 2.5 0 000-5C14 3 12 5.5 12 8z" stroke={c} strokeWidth={2} strokeLinecap="round" /></svg> },
  { id: 'checkcircle', label: 'Check', render: (c, h) => icon(c, CheckCircle, h) },
  { id: 'sparkles', label: 'Sparkles', render: (c, h) => icon(c, Sparkles, h) },
  { id: 'zap', label: 'Zap', render: (c, h) => icon(c, Zap, h) },
  { id: 'crown', label: 'Crown', render: (c, h) => icon(c, Crown, h) },
  { id: 'flag', label: 'Flag', render: (c, h) => icon(c, Flag, h) },
  { id: 'shield', label: 'Shield', render: (c, h) => icon(c, Shield, h) },
  { id: 'leaf', label: 'Leaf', render: (c, h) => icon(c, Leaf, h) },
  { id: 'sun', label: 'Sun', render: (c, h) => icon(c, Sun, h) },
  { id: 'activity', label: 'Activity', render: (c, h) => icon(c, Activity, h) },
  { id: 'album', label: 'Album', render: (c, h) => icon(c, Album, h) },
  { id: 'book', label: 'Book', render: (c, h) => icon(c, BookOpen, h) },
  { id: 'brain', label: 'Brain', render: (c, h) => icon(c, Brain, h) },
  { id: 'cloud', label: 'Cloud', render: (c, h) => icon(c, Cloud, h) },
  { id: 'coffee', label: 'Coffee', render: (c, h) => icon(c, Coffee, h) },
  { id: 'compass', label: 'Compass', render: (c, h) => icon(c, Compass, h) },
  { id: 'droplets', label: 'Droplets', render: (c, h) => icon(c, Droplets, h) },
  { id: 'eye', label: 'Eye', render: (c, h) => icon(c, Eye, h) },
  { id: 'feather', label: 'Feather', render: (c, h) => icon(c, Feather, h) },
  { id: 'flame', label: 'Flame', render: (c, h) => icon(c, Flame, h) },
  { id: 'gem', label: 'Gem', render: (c, h) => icon(c, Gem, h) },
  { id: 'globe', label: 'Globe', render: (c, h) => icon(c, Globe, h) },
  { id: 'handshake', label: 'Handshake', render: (c, h) => icon(c, HeartHandshake, h) },
  { id: 'key', label: 'Key', render: (c, h) => icon(c, Key, h) },
  { id: 'lamp', label: 'Lamp', render: (c, h) => icon(c, Lamp, h) },
  { id: 'lightbulb', label: 'Lightbulb', render: (c, h) => icon(c, Lightbulb, h) },
  { id: 'map', label: 'Map', render: (c, h) => icon(c, Map, h) },
  { id: 'mountain', label: 'Mountain', render: (c, h) => icon(c, Mountain, h) },
  { id: 'music', label: 'Music', render: (c, h) => icon(c, Music, h) },
  { id: 'palette', label: 'Palette', render: (c, h) => icon(c, Palette, h) },
  { id: 'puzzle', label: 'Puzzle', render: (c, h) => icon(c, Puzzle, h) },
  { id: 'scroll', label: 'Scroll', render: (c, h) => icon(c, Scroll, h) },
  { id: 'sword', label: 'Sword', render: (c, h) => icon(c, Sword, h) },
  { id: 'telescope', label: 'Telescope', render: (c, h) => icon(c, Telescope, h) },
  { id: 'trophy', label: 'Trophy', render: (c, h) => icon(c, Trophy, h) },
  { id: 'waves', label: 'Waves', render: (c, h) => icon(c, Waves, h) },
  { id: 'wind', label: 'Wind', render: (c, h) => icon(c, Wind, h) },
]

export function renderLogo(d: DesignConfig, page: 'welcome' | 'thankyou', color: string): ReactNode | null {
  const preset = page === 'welcome' ? d.welcome_logo_preset : d.thankyou_logo_preset
  const url = page === 'welcome' ? d.welcome_logo_url : d.thankyou_logo_url
  const h = page === 'welcome' ? (d.welcome_logo_height ?? 56) : (d.thankyou_logo_height ?? 56)
  if (url) return <img src={url} alt="" style={{ height: h, maxHeight: 200, objectFit: 'contain', marginBottom: 24 }} />
  const found = LOGO_PRESETS.find(p => p.id === preset)
  if (found) return <div style={{ marginBottom: 24, display: 'inline-flex', maxHeight: 200 }}>{found.render(color, h)}</div>
  return null
}

export function PresetIcons({ value, onChange, color }: { value: string | undefined; onChange: (id: string | undefined) => void; color: string }) {
  return (<div className="grid grid-cols-5 gap-2">
    {LOGO_PRESETS.map(p => (
      <button key={p.id} onClick={() => onChange(value === p.id ? undefined : p.id)}
        className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg border-2 transition ${value === p.id ? 'border-violet-500 bg-violet-50' : 'border-slate-200 hover:border-slate-300'}`}>
        {p.render(color)}
        <span className="text-[9px] font-medium text-slate-500">{p.label}</span>
      </button>
    ))}
  </div>)
}
