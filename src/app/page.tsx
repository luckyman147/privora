import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

import { HowItWorks } from '@/components/landing/HowItWorks'
import UseCases from '@/components/landing/UseCases'
import Hero from '@/components/landing/Hero'
import Footer from '@/components/landing/Footer'

export default function LandingPage() {
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
            <Link
              href='/pricing'
              className='text-sm font-500 text-slate-700 hover:bg-slate-100 px-3 py-2 rounded-lg'
            >
              Pricing
            </Link>
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

      {/* CTA Section */}
      <section className='bg-gradient-to-br from-slate-900 to-slate-800 py-20 px-12'>
        <div className='max-w-2xl mx-auto text-center'>
          <h2 className='text-4xl font-800 text-white mb-4'>
            Ready to build forms people trust?
          </h2>
          <p className='text-lg text-slate-300 mb-8'>
            Join thousands of organizations collecting honest, anonymous
            responses.
          </p>
          <div className='flex justify-center gap-4'>
            <Link
              href='/auth'
              className='font-600 text-white bg-sky-500 px-8 py-3 rounded-lg hover:bg-sky-600'
            >
              Get started free
            </Link>
            <a
              href='#'
              className='font-600 text-slate-300 border border-slate-600 px-8 py-3 rounded-lg hover:bg-slate-700/50'
            >
              Schedule demo
            </a>
          </div>
          <p className='text-sm text-slate-400 mt-4'>
            No credit card required · Free forever plan
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
