import Link from 'next/link'
import { TrustScoreCard } from '@/components/TrustScore/TrustScoreCard'
import { DEFAULT_TRUST_CONFIG } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Privora — Forms people actually trust' }

const HOW_IT_WORKS = [
  { step: '01', title: 'Create your form',
    desc: 'Build surveys or elections using our Typeform-style builder with 7+ question types.' },
  { step: '02', title: 'Configure Trust Score',
    desc: 'Set visibility, anonymity, IP storage, submission limits, and retention.' },
  { step: '03', title: 'Share and collect',
    desc: 'Respondents see the Trust Score before answering. Export results anytime.' },
]

const USE_CASES = [
  { label: 'Student Clubs', tags: ['Elections', 'Surveys', 'Anonymous'],
    desc: 'Run elections, collect event feedback, and survey members.' },
  { label: 'Student Government', tags: ['Auditable', 'Referendums'],
    desc: 'Conduct anonymous votes with audit-ready results.' },
  { label: 'Universities', tags: ['FERPA-aligned', 'Multi-team'],
    desc: 'Course evaluations and institutional research.' },
]

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100 h-16 flex items-center px-12">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg mr-10">
          <span className="text-[#1B2D6B]">Privo</span><span className="text-emerald-500">ra</span>
        </Link>
        <div className="flex items-center gap-1 flex-1 text-sm font-medium text-slate-500">
          <Link href="#features" className="px-3 py-2 rounded-lg hover:bg-slate-50">Features</Link>
          <Link href="/pricing" className="px-3 py-2 rounded-lg hover:bg-slate-50">Pricing</Link>
          <Link href="/docs" className="px-3 py-2 rounded-lg hover:bg-slate-50">Docs</Link>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/auth" className="px-4 py-2 text-sm font-medium text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50">Sign in</Link>
          <Link href="/auth?tab=signup" className="px-4 py-2 text-sm font-semibold text-white bg-sky-500 rounded-lg hover:bg-sky-600 shadow-sm shadow-sky-200">Start free →</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="max-w-7xl mx-auto px-12 py-24 flex items-center gap-20">
        <div className="flex-1 min-w-0">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-7">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            Trusted by 2,400+ student organizations
          </div>
          <h1 className="text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.06] mb-5">
            Forms people<br/>
            <span className="text-sky-500">actually trust.</span>
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed max-w-md mb-9">
            Collect surveys and anonymous elections with a built-in Trust Score —
            a clear privacy contract respondents see before they answer anything.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link href="/auth?tab=signup"
              className="px-7 py-3 text-sm font-bold text-white bg-sky-500 rounded-xl hover:bg-sky-600 shadow-lg shadow-sky-200">
              Get started free
            </Link>
            <Link href="/form/demo"
              className="px-6 py-3 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50">
              See live example →
            </Link>
          </div>
        </div>
        <div className="w-96 shrink-0">
          <TrustScoreCard config={DEFAULT_TRUST_CONFIG} formTitle="Student Satisfaction Survey 2025" />
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="features" className="max-w-7xl mx-auto px-12 py-20">
        <h2 className="text-4xl font-extrabold tracking-tight text-center mb-14">Three steps to a trusted form</h2>
        <div className="grid grid-cols-3 gap-6">
          {HOW_IT_WORKS.map(item => (
            <div key={item.step} className="bg-white border border-slate-200 rounded-2xl p-8">
              <div className="text-4xl font-black text-slate-100 mb-4">{item.step}</div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </main>
  )
}
