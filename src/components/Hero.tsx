import Link from 'next/link'
import { calcTrustScore, type TrustConfig } from '@/lib/types'

const DEMO_CONFIG: TrustConfig = {
  visibility: 'creator_only',
  identity: 'anonymous',
  ip_storage: 'none',
  submission_limit: 'one',
  retention_days: 90,
}

export function Hero() {
  const score = calcTrustScore(DEMO_CONFIG)
  return (
    <section className='py-20 px-12'>
      <div className='max-w-5xl mx-auto flex items-center gap-16'>
        <div className='flex-1'>
          <div className='text-xs font-bold text-sky-600 uppercase tracking-widest mb-4'>
            Privacy-first forms
          </div>
          <h1 className='text-6xl font-800 text-slate-900 leading-tight mb-6'>
            Trust by
            <br />
            <span className='bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent'>
              design
            </span>
            .
          </h1>
          <p className='text-lg text-slate-600 mb-8 max-w-md leading-relaxed'>
            Build forms with configurable privacy controls — anonymous responses,
            IP protection, duplicate detection, and data retention policies
            built in.
          </p>
          <div className='flex gap-4'>
            <Link
              href='/auth'
              className='font-600 text-white bg-sky-500 px-6 py-3 rounded-lg hover:bg-sky-600'
            >
              Start building free
            </Link>
            <Link
              href='/pricing'
              className='font-600 text-slate-700 border border-slate-300 px-6 py-3 rounded-lg hover:bg-slate-50'
            >
              View pricing
            </Link>
          </div>
        </div>

        <div className='w-72 bg-slate-900 text-white rounded-3xl p-7 shadow-2xl'>
          <div className='text-emerald-400 text-sm font-bold mb-1'>Trust Score</div>
          <div className='text-5xl font-black mb-1'>{score}/5</div>
          <div className='text-xs text-slate-400 mb-6'>Survey mode</div>
          <div className='space-y-2 text-xs text-slate-300'>
            <div className='flex items-center gap-2'>
              <span className='text-emerald-400'>✓</span> Anonymous responses
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-emerald-400'>✓</span> IP not stored
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-emerald-400'>✓</span> 1 per person
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-emerald-400'>✓</span> Auto-delete 90d
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
