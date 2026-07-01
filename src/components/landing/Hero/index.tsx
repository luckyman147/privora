import Link from 'next/link'
import TrustScorePreview from './TrustScorePreview'
import StatsBar from './StatsBar'

export default function Hero() {
  return (
    <section className='bg-white pt-32 pb-24 px-12'>
      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-2 gap-16 items-center'>
          <div>
            <div className='inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1 mb-8'>
              <div className='w-2 h-2 rounded-full bg-emerald-600' />
              <span className='text-xs font-600 text-emerald-700'>Trusted by 2,400+ student organizations</span>
            </div>
            <h1 className='text-6xl font-900 text-slate-900 leading-tight mb-6'>
              Forms people<br />
              <span className='text-sky-500 font-extrabold'>actually trust.</span>
            </h1>
            <p className='text-lg text-slate-600 mb-8 max-w-sm leading-relaxed'>
              Collect surveys and anonymous elections with a built-in Trust Score — a
              privacy contract respondents see before they answer anything.
            </p>
            <div className='flex gap-4 items-center flex-wrap mb-10'>
              <Link href='/auth' className='font-700 text-white bg-sky-500 px-8 py-3 rounded-xl hover:bg-sky-600 transition shadow-lg shadow-sky-500/30'>
                Get started free
              </Link>
              <Link href='#demo' className='font-600 text-slate-700 border-2 border-slate-300 px-8 py-3 rounded-xl hover:bg-slate-50 transition'>
                See live example →
              </Link>
            </div>
            <div className='flex items-center gap-3'>
              <div className='flex -space-x-2'>
                {['AJ','SR','MK','+'].map((l, i) => (
                  <div key={i} className={`w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-xs font-700 text-white ${['bg-purple-600','bg-sky-500','bg-emerald-600','bg-amber-500'][i]}`}>
                    {l}
                  </div>
                ))}
              </div>
              <span className='text-sm text-slate-600'>
                <strong className='text-slate-900 font-600'>2,400+</strong> organizations this year
              </span>
            </div>
          </div>
          <TrustScorePreview />
        </div>
      </div>
      <StatsBar />
    </section>
  )
}
