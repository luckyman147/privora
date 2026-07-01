'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { signIn, signUp, sendMagicLink } from '@/app/auth/actions'
import OAuthButtons from './OAuthButtons'

type Tab = 'signin' | 'signup' | 'magic'
const TABS: Tab[] = ['signin', 'signup', 'magic']
const LABEL: Record<Tab, string> = { signin: 'Sign in', signup: 'Create account', magic: 'Magic link' }
const TITLE: Record<Tab, string> = { signin: 'Welcome back', signup: 'Create your account', magic: 'Send a magic link' }
const SUB: Record<Tab, string> = {
  signin: 'Sign in to manage your forms and responses',
  signup: 'Start building privacy-forward forms in minutes',
  magic: 'Get a one-time sign-in link by email',
}
const ic = 'w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-sky-400'

export default function AuthForm() {
  const [mode, setMode] = useState<Tab>('signin')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const params = useSearchParams()

  useEffect(() => {
    const err = params.get('error')
    if (err) setError(decodeURIComponent(err))
  }, [params])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const fd = new FormData(e.currentTarget)
    const fn = mode === 'signup' ? signUp : mode === 'magic' ? sendMagicLink : signIn
    const result = await fn(fd) as { error?: string; success?: string | boolean } | void
    if (!result) return
    if (result.error) { setError(result.error); return }
    if (result.success === 'verify_email') setSuccess('Account created! Check your email to confirm.')
    else if (result.success) setSuccess('Magic link sent! Check your inbox.')
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
      <div className="w-full max-w-lg">
        <Link href="/" className="flex items-center gap-2 mb-12">
          <Image src="/images/logo.png" alt="Privora logo" width={32} height={32} className="h-8 w-8 rounded-lg object-cover" priority />
          <span className="font-bold text-lg text-slate-900">Privora</span>
        </Link>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <div className="grid grid-cols-3 rounded-full bg-slate-100 p-1 text-sm font-semibold text-slate-600 mb-6">
            {TABS.map(t => (
              <button key={t} type="button" onClick={() => { setMode(t); setError(''); setSuccess('') }}
                className={`rounded-full px-3 py-2 transition ${mode === t ? 'bg-white text-slate-900 shadow-sm' : ''}`}>
                {LABEL[t]}
              </button>
            ))}
          </div>

          {success ? (
            <div className="py-8 text-center">
              <div className="text-5xl mb-4">&#9993;</div>
              <p className="text-sm font-semibold text-slate-800 mb-1">{success}</p>
              <p className="text-xs text-slate-400 mb-4">Didn&apos;t receive it? Check your spam folder.</p>
              <button onClick={() => setSuccess('')} className="text-xs text-sky-500 underline">Back</button>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-extrabold text-slate-900 mb-2">{TITLE[mode]}</h1>
              <p className="text-sm text-slate-600 mb-8">{SUB[mode]}</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div className="grid grid-cols-2 gap-3">
                    <input name="first_name" placeholder="First name" required className={ic} />
                    <input name="last_name" placeholder="Last name" required className={ic} />
                    <div className="col-span-2"><input name="username" placeholder="Username" required className={ic} /></div>
                  </div>
                )}
                <input name="email" type="email" placeholder="Email" required className={ic} />
                {mode !== 'magic' && (
                  <input name="password" type="password"
                    placeholder={mode === 'signin' ? 'Password' : 'Password (min 8 chars)'} required className={ic} />
                )}
                {error && <p className="text-xs text-red-500">{error}</p>}
                <button type="submit" className="w-full py-2.5 text-sm font-bold text-white bg-sky-500 rounded-xl hover:bg-sky-600">
                  {LABEL[mode]}
                </button>
              </form>

              <div className="my-6 flex items-center gap-3 text-xs text-slate-400">
                <div className="flex-1 h-px bg-slate-200" /> or <div className="flex-1 h-px bg-slate-200" />
              </div>
              <OAuthButtons />
            </>
          )}
        </div>

        <p className="text-xs text-slate-500 text-center mt-6">
          By signing in, you agree to our{' '}
          <Link href="/privacy" className="underline hover:text-slate-700">Privacy Policy</Link>
          {' '}and{' '}
          <Link href="/terms" className="underline hover:text-slate-700">Terms of Service</Link>
        </p>
      </div>
    </div>
  )
}
