'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { logout } from '@/app/(app)/dashboard/actions'

interface Props {
  displayName: string
  avatarUrl:   string
  planLabel:   string
  formCount:   number
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

const NAV_ITEMS = [
  {
    label: 'Results',
    href: '/results',
    icon: (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
      </svg>
    ),
  },
]

export function Sidebar({ displayName, avatarUrl, planLabel, formCount }: Props) {
  const [open, setOpen] = useState(true)
  const pathname = usePathname()
  const isForms = pathname.startsWith('/dashboard')
  const isResults = pathname.startsWith('/results')

  function itemClass(active: boolean) {
    const base = 'flex items-center gap-3 rounded-lg text-sm transition'
    const size = open ? 'px-3 py-2.5' : 'p-3 justify-center'
    if (active) return `${base} ${size} bg-sky-50 text-sky-700`
    return `${base} ${size} text-slate-600 hover:bg-slate-50`
  }

  return (
    <aside
      className={`border-r border-slate-200 flex flex-col shrink-0 bg-white transition-all duration-200 ${
        open ? 'w-64' : 'w-16'
      }`}
    >
      {/* Logo + toggle */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 shrink-0">
        {open && (
          <div className="flex items-center gap-2 min-w-0">
            <Image src="/images/logo.png" alt="Privora" width={28} height={28} className="shrink-0" />
            <span className="font-bold text-slate-900 text-sm truncate">Privora</span>
          </div>
        )}
        <button
          onClick={() => setOpen(o => !o)}
          title={open ? 'Collapse sidebar' : 'Expand sidebar'}
          className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition shrink-0 ${!open ? 'mx-auto' : ''}`}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            {open ? (
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            ) : (
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            )}
          </svg>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-0.5 overflow-hidden">

        {/* Forms */}
        <Link
          href="/dashboard"
          title={!open ? 'Forms' : undefined}
          className={itemClass(isForms)}
        >
          <svg className={`w-4 h-4 shrink-0 ${isForms ? 'text-sky-500' : 'text-slate-400'}`} viewBox="0 0 20 20" fill="currentColor">
            <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm0 2h12v10H4V5zm2 2v2h8V7H6zm0 4v2h5v-2H6z" />
          </svg>
          {open && (
            <>
              <span className="font-semibold flex-1">Forms</span>
              <span className="text-xs font-bold bg-sky-500 text-white rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                {formCount}
              </span>
            </>
          )}
        </Link>

        {NAV_ITEMS.map(item => (
          <Link
            key={item.label}
            href={item.href}
            title={!open ? item.label : undefined}
            className={itemClass(isResults)}
          >
            <span className={isResults ? 'text-sky-500' : 'text-slate-400'}>{item.icon}</span>
            {open && <span className="font-medium">{item.label}</span>}
          </Link>
        ))}

      </nav>

      {/* User */}
      <div className={`border-t border-slate-100 p-3 flex items-center gap-3 ${!open ? 'justify-center' : ''}`}>
        <div
          title={!open ? displayName : undefined}
          className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center shrink-0 overflow-hidden"
        >
          {avatarUrl
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
            : <span className="text-xs font-bold text-white">{initials(displayName)}</span>}
        </div>

        {open && (
          <>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{displayName}</p>
              <p className="text-xs text-slate-400 truncate">{planLabel}</p>
            </div>
            <form action={logout}>
              <button type="submit" title="Log out" className="text-slate-400 hover:text-slate-600 transition p-1 rounded">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h7a1 1 0 100-2H4V5h6a1 1 0 100-2H3zm11.293 4.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L15.586 11H9a1 1 0 110-2h6.586l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </form>
          </>
        )}
      </div>
    </aside>
  )
}
