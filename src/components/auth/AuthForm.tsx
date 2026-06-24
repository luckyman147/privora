'use client'

import { useState } from 'react'
import { signIn, signUp, sendMagicLink } from '@/app/auth/actions'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { createClient } from '@/lib/supabase-browser'

type AuthMode = 'signin' | 'signup' | 'magic'

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>('signin')
  const [error, setError] = useState('')
  const [oauthLoading, setOauthLoading] = useState<null | 'google' | 'github'>(
    null,
  )

  async function handleAuthSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    const formData = new FormData(event.currentTarget)
    const action =
      mode === 'signup' ? signUp : mode === 'magic' ? sendMagicLink : signIn
    const result = await action(formData)

    if (result?.error) {
      setError(result.error)
    }
  }

  async function handleOAuth(provider: 'google' | 'github') {
    setError('')
    setOauthLoading(provider)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    })

    if (error) {
      setError(error.message)
      setOauthLoading(null)
    }
  }

  return (
    <div className='bg-white border border-slate-200 rounded-2xl p-8 shadow-sm'>
      <div className='mb-6'>
        <div className='grid grid-cols-3 rounded-full bg-slate-100 p-1 text-sm font-semibold text-slate-600'>
          <button
            type='button'
            onClick={() => {
              setMode('signin')
              setError('')
            }}
            className={`rounded-full px-3 py-2 transition ${mode === 'signin' ? 'bg-white text-slate-900 shadow-sm' : ''}`}
          >
            Sign in
          </button>
          <button
            type='button'
            onClick={() => {
              setMode('signup')
              setError('')
            }}
            className={`rounded-full px-3 py-2 transition ${mode === 'signup' ? 'bg-white text-slate-900 shadow-sm' : ''}`}
          >
            Create account
          </button>
          <button
            type='button'
            onClick={() => {
              setMode('magic')
              setError('')
            }}
            className={`rounded-full px-3 py-2 transition ${mode === 'magic' ? 'bg-white text-slate-900 shadow-sm' : ''}`}
          >
            Magic link
          </button>
        </div>
      </div>

      <div className='mb-8'>
        <h1 className='text-2xl font-800 text-slate-900 mb-2'>
          {mode === 'signin'
            ? 'Welcome back'
            : mode === 'signup'
              ? 'Create your account'
              : 'Send a magic link'}
        </h1>
        <p className='text-sm text-slate-600'>
          {mode === 'signin'
            ? 'Sign in to manage your forms and responses'
            : mode === 'signup'
              ? 'Start building privacy-forward forms in minutes'
              : 'Get a one-time sign-in link by email'}
        </p>
      </div>

      <form onSubmit={handleAuthSubmit} className='space-y-5'>
        {mode === 'signup' && (
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <Input
              name='first_name'
              label='First name'
              placeholder='First name'
              required
            />
            <Input
              name='last_name'
              label='Last name'
              placeholder='Last name'
              required
            />
            <div className='sm:col-span-2'>
              <Input
                name='org_name'
                label='Organization name'
                placeholder='Organization name'
                required
              />
            </div>
          </div>
        )}

        <Input
          name='email'
          type='email'
          label='Email address'
          placeholder='you@university.edu'
          required
        />

        {mode !== 'magic' && (
          <>
            <div className='flex items-center justify-between gap-4'>
              <label
                htmlFor='password'
                className='block text-sm font-semibold text-slate-900'
              >
                Password
              </label>
            </div>
            <Input
              id='password'
              name='password'
              type='password'
              placeholder={
                mode === 'signin' ? '••••••••' : 'Minimum 8 characters'
              }
              required
            />
          </>
        )}

        {mode === 'signin' && (
          <div className='flex items-center'>
            <input
              id='remember'
              name='remember'
              type='checkbox'
              className='h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500'
            />
            <label htmlFor='remember' className='ml-2 text-sm text-slate-600'>
              Keep me signed in
            </label>
          </div>
        )}

        {error ? <p className='text-sm text-red-500'>{error}</p> : null}

        <Button
          type='submit'
          size='lg'
          className='w-full bg-sky-500 text-white hover:bg-sky-600'
        >
          {mode === 'signin'
            ? 'Sign in →'
            : mode === 'signup'
              ? 'Create account →'
              : 'Send magic link →'}
        </Button>
      </form>

      <div className='relative my-6'>
        <div className='absolute inset-0 flex items-center'>
          <div className='w-full border-t border-slate-200' />
        </div>
        <div className='relative flex justify-center text-sm'>
          <span className='px-2 bg-white text-slate-600'>Or continue with</span>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-3'>
        <button
          type='button'
          onClick={() => handleOAuth('google')}
          className='flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition font-medium text-sm text-slate-700'
          disabled={oauthLoading !== null}
        >
          <span className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200'>
            <svg className='h-5 w-5' viewBox='0 0 48 48' aria-hidden='true'>
              <path
                fill='#FFC107'
                d='M43.6 20.5H42V20H24v8h11.3C33.6 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.2-.4-3.5z'
              />
              <path
                fill='#FF3D00'
                d='M6.3 14.7l6.6 4.8C14.7 15 18.9 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.1 29.4 4 24 4 16 4 9 8.5 6.3 14.7z'
              />
              <path
                fill='#4CAF50'
                d='M24 44c5.3 0 10-2 13.5-5.3l-6.2-5.2C29.2 35 26.8 36 24 36c-5.3 0-9.5-3.4-11.1-8.1l-6.6 5.1C8.9 39.1 15.8 44 24 44z'
              />
              <path
                fill='#1976D2'
                d='M43.6 20.5H42V20H24v8h11.3c-1 2.8-3 5.1-5.5 6.5l.1-.1 6.2 5.2C35.7 40.8 44 35.6 44 24c0-1.3-.1-2.2-.4-3.5z'
              />
            </svg>
          </span>
          {oauthLoading === 'google' ? 'Redirecting...' : 'Google'}
        </button>
        <button
          type='button'
          onClick={() => handleOAuth('github')}
          className='flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition font-medium text-sm text-slate-700'
          disabled={oauthLoading !== null}
        >
          <span className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white shadow-sm ring-1 ring-slate-300'>
            <svg
              className='h-4 w-4'
              viewBox='0 0 24 24'
              fill='currentColor'
              aria-hidden='true'
            >
              <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
            </svg>
          </span>
          {oauthLoading === 'github' ? 'Redirecting...' : 'GitHub'}
        </button>
      </div>

      <p className='text-center text-sm text-slate-600 mt-6'>
        {mode === 'signin'
          ? "Don't have an account?"
          : mode === 'signup'
            ? 'Already have an account?'
            : 'Need a password instead?'}{' '}
        <button
          type='button'
          onClick={() => {
            setMode(mode === 'signin' ? 'signup' : 'signin')
            setError('')
          }}
          className='font-semibold text-sky-600 hover:text-sky-700'
        >
          {mode === 'magic'
            ? 'Back to sign in'
            : mode === 'signin'
              ? 'Sign up free'
              : 'Sign in'}
        </button>
      </p>
    </div>
  )
}
