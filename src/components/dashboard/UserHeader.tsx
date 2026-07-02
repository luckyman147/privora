'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/browser'
import { logout } from '@/app/(app)/dashboard/actions'

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export default function UserHeader() {
  const [displayName, setDisplayName] = useState('Account')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [planLabel, setPlanLabel] = useState('Starter plan')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const meta = user.user_metadata ?? {}
      const { data: profile } = await (supabase as any)
        .from('profiles').select('email,username,image_url,plan').eq('id', user.id).maybeSingle()
      setDisplayName(meta.full_name ?? meta.name ?? profile?.username ?? user.email ?? 'Account')
      setAvatarUrl(profile?.image_url ?? meta.avatar_url ?? meta.picture ?? '')
      setPlanLabel(profile?.plan ? profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1) + ' plan' : 'Starter plan')
    })
  }, [])

  return (
    <header className="h-16 shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      <Link href="/dashboard" className="flex items-center gap-2">
        <Image src="/images/logo.png" alt="Privora" width={28} height={28} className="shrink-0" />
        <span className="font-bold text-slate-900 text-sm">Privora</span>
      </Link>

      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center shrink-0 overflow-hidden">
          {avatarUrl
            ? // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
            : <span className="text-xs font-bold text-white">{initials(displayName)}</span>}
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-slate-900 leading-tight">{displayName}</p>
          <p className="text-xs text-slate-400 leading-tight">{planLabel}</p>
        </div>
        <form action={logout}>
          <button type="submit" title="Log out" className="text-slate-400 hover:text-slate-600 transition p-1.5 rounded-lg hover:bg-slate-100">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h7a1 1 0 100-2H4V5h6a1 1 0 100-2H3zm11.293 4.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L15.586 11H9a1 1 0 110-2h6.586l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </form>
      </div>
    </header>
  )
}
