import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getSupabase } from '@/lib/supabase/server'

import { HowItWorks } from '@/components/landing/HowItWorks'
import UseCases from '@/components/landing/UseCases'
import Hero from '@/components/landing/Hero'
import Footer from '@/components/landing/Footer'

export default async function LandingPage() {
  let user = null
  try {
    const supabase = await getSupabase()
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch {}
  if (user) redirect('/dashboard')
  return (
    <main className='min-h-screen bg-white'>
      {/* Navigation */}
      <nav className='sticky top-0 z-50 bg-white/96 backdrop-blur border-b border-slate-200 h-16 flex items-center px-12'>
        <div className='max-w-7xl w-full mx-auto flex items-center justify-between'>
          <Link href='/' className='flex items-center gap-2'>
            <Image src='/images/logo.png' alt='Privora' width={32} height={32} className='h-8 w-auto' />
            <span className='font-bold text-lg'>Privora</span>
          </Link>

          <div className='flex items-center gap-1'>
            <a
              href='#features'
              className='text-sm font-500 text-slate-700 hover:bg-slate-100 px-3 py-2 rounded-lg'
            >
              Features
            </a>
            <a
              href='#faq'
              className='text-sm font-500 text-slate-700 hover:bg-slate-100 px-3 py-2 rounded-lg'
            >
              Docs
            </a>
          </div>

          <div className='flex items-center gap-3'>
            <Link
              href='/auth'
              className='text-sm font-500 text-slate-700 border border-slate-300 px-4 py-2 rounded-lg hover:bg-slate-50'
            >
              Sign in
            </Link>
            <Link
              href='/auth'
              className='text-sm font-600 text-white bg-sky-500 px-5 py-2 rounded-lg hover:bg-sky-600'
            >
              Start free →
            </Link>
          </div>
        </div>
      </nav>

      <Hero />
      <UseCases />
      <HowItWorks />

      <Footer />
    </main>
  )
}
