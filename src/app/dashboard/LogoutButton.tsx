import { getSupabase } from '@/lib/supabase'
import { redirect } from 'next/navigation'

export default function LogoutButton() {
  return (
    <form
      action={async () => {
        'use server'
        const supabase = await getSupabase()
        await supabase.auth.signOut()
        redirect('/')
      }}
    >
      <button
        type='submit'
        className='flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50'
      >
        Log out
      </button>
    </form>
  )
}
