'use client'
import { Suspense, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AuthForm from '@/components/auth/AuthForm'
import AuthSidePanel from '@/components/auth/AuthSidePanel'
import { createClient } from '@/lib/supabase/browser'

function AuthContent() {
  const router = useRouter()
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace('/dashboard')
    })
  }, [router])
  return (
    <div className='min-h-screen flex bg-slate-50'>
      <AuthForm />
      <AuthSidePanel />
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
