'use client'
import { Suspense, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { signIn, signUp, sendMagicLink, signInWithProvider } from './actions'

type AuthMode = 'signin' | 'signup' | 'magic'

function AuthContent() {
  const [mode, setMode] = useState<AuthMode>('signin')
  const [error, setError] = useState('')
  const searchParams = useSearchParams()

  useEffect(() => {
    const err = searchParams.get('error')
    if (err) setError(decodeURIComponent(err))
  }, [searchParams])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const form = new FormData(e.currentTarget)
    const fn =
      mode === 'signup' ? signUp : mode === 'magic' ? sendMagicLink : signIn
    const result = await fn(form)
    if (result?.error) setError(result.error)
  }

  return (
    <div className='min-h-screen flex bg-slate-50'>
      <div className='flex-1 flex flex-col items-center justify-center px-8 py-12'>
        <div className='w-full max-w-md'>
          <Link href='/' className='flex items-center gap-2 mb-12'>
            <Image
              src='/images/logo.png'
              alt='Privora logo'
              width={32}
              height={32}
              className='h-8 w-8 rounded-lg object-cover'
              priority
            />
            <span className='font-bold text-lg text-slate-900'>Privora</span>
          </Link>

          <div className='bg-white border border-slate-200 rounded-2xl p-8 shadow-sm'>
            <div className='grid grid-cols-3 rounded-full bg-slate-100 p-1 text-sm font-semibold text-slate-600 mb-6'>
              {(['signin', 'signup', 'magic'] as const).map((tab) => (
                <button
                  key={tab}
                  type='button'
                  onClick={() => {
                    setMode(tab)
                    setError('')
                  }}
                  className={`rounded-full px-3 py-2 transition ${mode === tab ? 'bg-white text-slate-900 shadow-sm' : ''}`}
                >
                  {tab === 'signin'
                    ? 'Sign in'
                    : tab === 'signup'
                      ? 'Create account'
                      : 'Magic link'}
                </button>
              ))}
            </div>

            <h1 className='text-2xl font-800 text-slate-900 mb-2'>
              {mode === 'signin'
                ? 'Welcome back'
                : mode === 'signup'
                  ? 'Create your account'
                  : 'Send a magic link'}
            </h1>
            <p className='text-sm text-slate-600 mb-8'>
              {mode === 'signin'
                ? 'Sign in to manage your forms and responses'
                : mode === 'signup'
                  ? 'Start building privacy-forward forms in minutes'
                  : 'Get a one-time sign-in link by email'}
            </p>

            <form onSubmit={handleSubmit} className='space-y-4'>
              {mode === 'signup' && (
                <div className='grid grid-cols-2 gap-3'>
                  <input
                    name='first_name'
                    placeholder='First name'
                    required
                    className='w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-sky-400'
                  />
                  <input
                    name='last_name'
                    placeholder='Last name'
                    required
                    className='w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-sky-400'
                  />
                  <div className='col-span-2'>
                    <input
                      name='username'
                      placeholder='Username'
                      required
                      className='w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-sky-400'
                    />
                  </div>
                </div>
              )}

              <input
                name='email'
                type='email'
                placeholder='Email'
                required
                className='w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-sky-400'
              />

              {mode !== 'magic' && (
                <input
                  name='password'
                  type='password'
                  placeholder={
                    mode === 'signin' ? 'Password' : 'Password (min 8 chars)'
                  }
                  required
                  className='w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-sky-400'
                />
              )}

              {error && <p className='text-xs text-red-500'>{error}</p>}

              <button
                type='submit'
                className='w-full py-2.5 text-sm font-bold text-white bg-sky-500 rounded-xl hover:bg-sky-600'
              >
                {mode === 'signin'
                  ? 'Sign in'
                  : mode === 'signup'
                    ? 'Create account'
                    : 'Send magic link'}
              </button>
            </form>

            <div className='my-6 flex items-center gap-3 text-xs text-slate-400'>
              <div className='flex-1 h-px bg-slate-200' /> or{' '}
              <div className='flex-1 h-px bg-slate-200' />
            </div>

            <div className='grid grid-cols-2 gap-3'>
              <button
                type='button'
                onClick={() => signInWithProvider('google')}
                className='flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 text-sm font-medium text-slate-700'
              >
                <svg viewBox='0 0 24 24' className='w-4 h-4'><path fill='currentColor' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z'/><path fill='currentColor' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'/><path fill='currentColor' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'/><path fill='currentColor' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'/></svg>
                Google
              </button>
              <button
                type='button'
                onClick={() => signInWithProvider('github')}
                className='flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 text-sm font-medium text-slate-700'
              >
                <svg viewBox='0 0 24 24' className='w-4 h-4'><path fill='currentColor' d='M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z'/></svg>
                GitHub
              </button>
            </div>
          </div>

          <p className='text-xs text-slate-500 text-center mt-6'>
            By signing in, you agree to our{' '}
            <Link href='/privacy' className='underline hover:text-slate-700'>
              Privacy Policy
            </Link>{' '}
            and{' '}
            <Link href='/terms' className='underline hover:text-slate-700'>
              Terms of Service
            </Link>
          </p>
        </div>
      </div>

      <div className='hidden lg:flex flex-1 bg-gradient-to-br from-slate-900 via-sky-900 to-emerald-900 items-center justify-center px-12 relative overflow-hidden'>
        <div className='absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl' />
        <div className='absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl' />

        <div className='relative z-10 max-w-sm text-white'>
          <div className='inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur border border-white/20 mb-6'>
            <svg
              className='w-8 h-8 text-emerald-400'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path
                fillRule='evenodd'
                d='M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
              />
            </svg>
          </div>
          <h2 className='text-4xl font-800 mb-6 leading-tight'>
            Privacy people can see
          </h2>
          <p className='text-lg text-slate-300 mb-8 leading-relaxed'>
            Every form includes a Trust Score — a clear privacy contract between
            you and respondents. No surprises. No hidden settings.
          </p>
          <ul className='space-y-4'>
            {[
              'Transparent data handling',
              'Anonymous response options',
              'FERPA-compliant defaults',
              'Audit-ready results',
            ].map((f) => (
              <li key={f} className='flex items-center gap-3 text-sm'>
                <div className='w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center flex-shrink-0'>
                  <svg
                    className='w-3 h-3 text-emerald-400'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={3}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                </div>
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <div className='mt-10 pt-8 border-t border-slate-700/50'>
            <p className='italic text-slate-400 mb-3 text-sm'>
              &ldquo;Privora changed how we run surveys. Our response rate went
              up 34% when students saw our privacy commitment.&rdquo;
            </p>
            <p className='text-xs font-600 text-slate-300'>
              Alex Chen, MIT Student Government
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SignPage() {
  return (
    <Suspense>
      <AuthContent />
    </Suspense>
  )
}
