'use client'
import { logout } from './actions'

export default function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type='submit'
        className='flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50'
      >
        Log out
      </button>
    </form>
  )
}
