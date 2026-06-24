'use client'

import { useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
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
            <FcGoogle className='h-5 w-5' aria-hidden='true' />
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
            <FaGithub className='h-4 w-4' aria-hidden='true' />
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
