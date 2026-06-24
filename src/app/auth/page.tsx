'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, signUp, sendMagicLink, signInWithProvider } from './actions'

export default function AuthPage() {
  const [tab, setTab] = useState<'signin' | 'signup'>('signin')
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const form = new FormData(e.currentTarget)
    const fn = tab === 'signin' ? signIn : signUp
    const result = await fn(form)
    if (result?.error) setError(result.error)
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex w-1/2 bg-slate-950 items-center justify-center p-12">
        <div className="max-w-sm text-center">
          <div className="text-3xl font-bold text-white mb-2">Privora</div>
          <p className="text-slate-400 text-sm mb-8">Trust by design.</p>
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 text-left">
            <div className="text-emerald-400 text-sm font-semibold mb-3">Trust Score — Survey Mode</div>
            <div className="space-y-2 text-xs text-slate-300">
              <div>👤 Nobody — responses are anonymous</div>
              <div>📍 IP not stored</div>
              <div>🔄 1 submission per browser session</div>
              <div>📅 Data deleted after 90 days</div>
            </div>
          </div>
          <p className="text-slate-500 text-xs mt-6 italic">
            "We ran our first anonymous election in 15 minutes." — Student association, Tunis
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="flex mb-8 bg-slate-100 rounded-lg p-1">
            <button onClick={() => setTab('signin')}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${tab === 'signin' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>
              Sign in
            </button>
            <button onClick={() => setTab('signup')}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${tab === 'signup' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>
              Create account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'signup' && (
              <>
                <div className="flex gap-3">
                  <input name="first_name" placeholder="First name" required
                    className="flex-1 px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-sky-400" />
                  <input name="last_name" placeholder="Last name" required
                    className="flex-1 px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-sky-400" />
                </div>
                <input name="org_name" placeholder="Organization name" required
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-sky-400" />
              </>
            )}
            <input name="email" type="email" placeholder="Email" required
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-sky-400" />
            <input name="password" type="password" placeholder="Password (min 8 chars)" required
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-sky-400" />
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button type="submit"
              className="w-full py-2.5 text-sm font-bold text-white bg-sky-500 rounded-xl hover:bg-sky-600">
              {tab === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-slate-400">
            <div className="flex-1 h-px bg-slate-200" /> or <div className="flex-1 h-px bg-slate-200" />
          </div>

          <div className="space-y-2">
            <form onSubmit={async (e) => {
              e.preventDefault()
              const form = new FormData(e.currentTarget)
              setError('')
              const result = await sendMagicLink(form)
              if (result?.error) setError(result.error)
            }}>
              <input name="email" type="email" placeholder="Email for magic link"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl mb-2 focus:outline-none focus:border-sky-400" />
              <button type="submit"
                className="w-full py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50">
                Send magic link
              </button>
            </form>
            <div className="flex gap-2">
              <button onClick={() => signInWithProvider('google')}
                className="flex-1 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50">
                Google
              </button>
              <button onClick={() => signInWithProvider('github')}
                className="flex-1 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50">
                GitHub
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-400 text-center mt-8">
            By signing up you agree to our Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}
