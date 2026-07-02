'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/browser'
import { formatDate } from '@/lib/utils'
import { Bell } from 'lucide-react'
import type { Notification } from '@/lib/types'

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [unread, setUnread] = useState(0)
  const [notifs, setNotifs] = useState<Notification[]>([])
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    const supabase = createClient()
    async function fetchNotifs() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await (supabase as any)
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)
      if (data) {
        setNotifs(data)
        setUnread(data.filter((n: Notification) => !n.read).length)
      }
    }
    fetchNotifs()
    const interval = setInterval(fetchNotifs, 30000)
    return () => clearInterval(interval)
  }, [])

  async function markAllRead() {
    const supabase = createClient()
    const ids = notifs.filter(n => !n.read).map(n => n.id)
    if (!ids.length) return
    await (supabase as any).from('notifications').update({ read: true }).in('id', ids)
    setNotifs(prev => prev.map(n => ({ ...n, read: true })))
    setUnread(0)
  }

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className="relative p-1.5 rounded-lg hover:bg-slate-100 transition">
        <Bell className="w-5 h-5 text-slate-500" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <p className="text-sm font-semibold text-slate-900">Notifications</p>
            {unread > 0 && (
              <button onClick={markAllRead} className="text-xs font-semibold text-sky-600 hover:text-sky-700">
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifs.length === 0 ? (
              <div className="text-center py-8 text-sm text-slate-400">No notifications yet</div>
            ) : (
              notifs.map(n => (
                <Link key={n.id} href={`/results/${n.form_id}`}
                  onClick={() => setOpen(false)}
                  className={`flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition ${!n.read ? 'bg-sky-50/60' : ''}`}>
                  <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${!n.read ? 'bg-sky-500' : 'bg-transparent'}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-700">
                      New response received for <span className="font-semibold text-slate-900">{n.form_title}</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{formatDate(n.created_at)}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
