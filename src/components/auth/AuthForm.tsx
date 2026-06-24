'use client'

import { useState } from 'react'
import { signIn, signUp, sendMagicLink, signInWithProvider } from '@/app/auth/actions'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

type AuthMode = 'signin' | 'signup' | 'magic'

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>('signin')
  const [error, setError] = useState('')

  async function handleAuthSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    const formData = new FormData(event.currentTarget)
    const action = mode === 'signup' ? signUp : mode === 'magic' ? sendMagicLink : signIn
    const result = await action(formData)

    if (result?.error) {
      setError(result.error)
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
      <div className="mb-6">
        <div className="grid grid-cols-3 rounded-full bg-slate-100 p-1 text-sm font-semibold text-slate-600">
          <button
            type="button"
            onClick={() => {
              setMode('signin')
              setError('')
            }}
            className={`rounded-full px-3 py-2 transition ${mode === 'signin' ? 'bg-white text-slate-900 shadow-sm' : ''}`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup')
              setError('')
            }}
            className={`rounded-full px-3 py-2 transition ${mode === 'signup' ? 'bg-white text-slate-900 shadow-sm' : ''}`}
          >
            Create account
          </button>
          <button
            type="button"
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

      <div className="mb-8">
        <h1 className="text-2xl font-800 text-slate-900 mb-2">
          {mode === 'signin' ? 'Welcome back' : mode === 'signup' ? 'Create your account' : 'Send a magic link'}
        </h1>
        <p className="text-sm text-slate-600">
          {mode === 'signin'
            ? 'Sign in to manage your forms and responses'
            : mode === 'signup'
              ? 'Start building privacy-forward forms in minutes'
              : 'Get a one-time sign-in link by email'}
        </p>
      </div>

      <form onSubmit={handleAuthSubmit} className="space-y-5">
        {mode === 'signup' && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input name="first_name" label="First name" placeholder="First name" required />
            <Input name="last_name" label="Last name" placeholder="Last name" required />
            <div className="sm:col-span-2">
              <Input name="org_name" label="Organization name" placeholder="Organization name" required />
            </div>
          </div>
        )}

        <Input
          name="email"
          type="email"
          label="Email address"
          placeholder="you@university.edu"
          required
        />

        {mode !== 'magic' && (
          <>
            <div className="flex items-center justify-between gap-4">
              <label htmlFor="password" className="block text-sm font-semibold text-slate-900">
                Password
              </label>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder={mode === 'signin' ? '••••••••' : 'Minimum 8 characters'}
              required
            />
          </>
        )}

        {mode === 'signin' && (
          <div className="flex items-center">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            />
            <label htmlFor="remember" className="ml-2 text-sm text-slate-600">
              Keep me signed in
            </label>
          </div>
        )}

        {error ? <p className="text-sm text-red-500">{error}</p> : null}

        <Button type="submit" size="lg" className="w-full bg-sky-500 text-white hover:bg-sky-600">
          {mode === 'signin' ? 'Sign in →' : mode === 'signup' ? 'Create account →' : 'Send magic link →'}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-slate-600">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => signInWithProvider('google')}
          className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition font-medium text-sm text-slate-700"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Google
        </button>
        <button
          type="button"
          onClick={() => signInWithProvider('github')}
          className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition font-medium text-sm text-slate-700"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          GitHub
        </button>
      </div>

      <p className="text-center text-sm text-slate-600 mt-6">
        {mode === 'signin'
          ? "Don't have an account?"
          : mode === 'signup'
            ? 'Already have an account?'
            : 'Need a password instead?'}{' '}
        <button
          type="button"
          onClick={() => {
            setMode(mode === 'signin' ? 'signup' : 'signin')
            setError('')
          }}
          className="font-semibold text-sky-600 hover:text-sky-700"
        >
          {mode === 'magic' ? 'Back to sign in' : mode === 'signin' ? 'Sign up free' : 'Sign in'}
        </button>
      </p>
    </div>
  )
}