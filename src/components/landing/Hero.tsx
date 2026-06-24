import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function Hero() {
  return (
    <section className='bg-white pt-32 pb-24 px-12'>
      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-2 gap-16 items-center'>
          {/* Left: Content */}
          <div>
            {/* Badge */}
            <div className='inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1 mb-8'>
              <div className='w-2 h-2 rounded-full bg-emerald-600' />
              <span className='text-xs font-600 text-emerald-700'>
                Trusted by 2,400+ student organizations
              </span>
            </div>

            {/* Headline */}
            <h1 className='text-6xl font-900 text-slate-900 leading-tight mb-6'>
              Forms people
              <br />
              <span className='text-sky-500 font-extrabold'>actually trust.</span>
            </h1>

            {/* Subheading */}
            <p className='text-lg text-slate-600 mb-8 max-w-sm leading-relaxed'>
              Collect surveys and anonymous elections with a built-in Trust
              Score — a clear privacy contract respondents see before they
              answer anything.
            </p>

            {/* CTA Buttons */}
            <div className='flex gap-4 items-center flex-wrap mb-10'>
              <Link
                href='/auth'
                className='font-700 text-white bg-sky-500 px-8 py-3 rounded-xl hover:bg-sky-600 transition shadow-lg shadow-sky-500/30'
              >
                Get started free
              </Link>
              <Link
                href='#demo'
                className='font-600 text-slate-700 border-2 border-slate-300 px-8 py-3 rounded-xl hover:bg-slate-50 transition'
              >
                See live example →
              </Link>
            </div>

            {/* Social proof */}
            <div className='flex items-center gap-3'>
              <div className='flex -space-x-2'>
                <div className='w-7 h-7 rounded-full bg-purple-600 border-2 border-white flex items-center justify-center text-xs font-700 text-white'>
                  AJ
                </div>
                <div className='w-7 h-7 rounded-full bg-sky-500 border-2 border-white flex items-center justify-center text-xs font-700 text-white'>
                  SR
                </div>
                <div className='w-7 h-7 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-xs font-700 text-white'>
                  MK
                </div>
                <div className='w-7 h-7 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center text-xs font-700 text-white'>
                  +
                </div>
              </div>
              <span className='text-sm text-slate-600'>
                <strong className='text-slate-900 font-600'>2,400+</strong>{' '}
                organizations this year
              </span>
            </div>
          </div>

          {/* Right: Trust Score Card Preview */}
          <div className='bg-slate-50 rounded-2xl p-5 border border-slate-200'>
            <div className='text-xs font-500 text-slate-500 text-center mb-4'>
              Student Satisfaction Survey 2025
            </div>

            <div className='bg-white rounded-xl border-2 border-emerald-200 p-6 shadow-sm'>
              {/* Header */}
              <div className='flex items-center justify-between mb-6'>
                <div className='flex items-center gap-3'>
                  <div className='w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-600 to-sky-500 flex items-center justify-center'>
                    <svg
                      className='w-5 h-5 text-white'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                      />
                    </svg>
                  </div>
                  <div>
                    <div className='font-600 text-sm text-slate-900'>
                      Trust Score
                    </div>
                    <div className='text-xs text-slate-500'>
                      Fully transparent
                    </div>
                  </div>
                </div>
                <div className='bg-emerald-100 text-emerald-700 font-700 text-sm px-3 py-1 rounded-full border border-emerald-200'>
                  5/5
                </div>
              </div>

              {/* Trust Score Items */}
              <div className='space-y-3'>
                {[
                  { label: 'Visibility', value: 'Creator only' },
                  { label: 'Identity', value: 'Anonymous' },
                  { label: 'IP Address', value: 'Not stored' },
                  { label: 'Submissions', value: '1 per person' },
                  { label: 'Data retention', value: '90 days' },
                ].map((item, i) => (
                  <div key={i} className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <div className='w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 text-xs'>
                        {i === 0 && '👁'}
                        {i === 1 && '👤'}
                        {i === 2 && '📍'}
                        {i === 3 && '🔄'}
                        {i === 4 && '📅'}
                      </div>
                      <span className='text-xs text-slate-600'>
                        {item.label}
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <span className='text-xs font-500 text-slate-900'>
                        {item.value}
                      </span>
                      <div className='w-4 h-4 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0'>
                        <svg
                          className='w-2.5 h-2.5 text-white'
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
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer text */}
              <div className='text-xs text-slate-500 mt-4 pt-4 border-t border-slate-100'>
                This form is committed to transparency. Your data will never be
                sold or shared.
              </div>
            </div>

            {/* CTA Button */}
            <button className='w-full mt-4 bg-sky-500 text-white font-600 py-2.5 rounded-lg hover:bg-sky-600 transition'>
              Start survey →
            </button>
          </div>
        </div>
      </div>

      {/* Social proof bar */}
      <div className='border-t border-slate-200 mt-16 pt-6'>
        <div className='text-xs font-500 text-slate-500 text-center mb-4'>
          Used by organizations at
        </div>
        <div className='flex justify-center gap-12 flex-wrap'>
          {[
            'MIT',
            'Stanford',
            'UC Berkeley',
            'Harvard',
            'Columbia',
            'Cornell',
            'NYU',
          ].map((school) => (
            <span key={school} className='text-sm font-700 text-slate-400'>
              {school}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
