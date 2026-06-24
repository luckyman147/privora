import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Pricing' }

const PLANS = [
  {
    name: 'Starter',
    badge: 'For individuals',
    price: '$0',
    popular: false,
    features: ['Unlimited surveys', '100 responses/month', '6 question types',
      'Trust Score badge', 'Share by link', '30-day data retention'],
    cta: 'Start for free',
    href: '/auth?tab=signup',
    outline: true,
  },
  {
    name: 'Club',
    badge: 'Most popular',
    price: '$9',
    popular: true,
    features: ['Everything in Starter', 'Election mode (email-verified voting)',
      'Send by email (up to 100 recipients)', 'Unlimited responses', 'Matrix questions',
      'Conditional logic', 'Custom retention period', 'CSV export'],
    cta: 'Start free trial',
    href: '/auth?tab=signup',
    outline: false,
  },
  {
    name: 'Institution',
    badge: 'For universities',
    price: 'Custom',
    popular: false,
    features: ['Everything in Club', 'Multi-admin access', 'SSO/SAML',
      'Dedicated Supabase EU region (GDPR)', 'Priority support', 'White-label option'],
    cta: 'Contact us',
    href: '/contact',
    outline: true,
  },
]

const FAQS = [
  { q: 'Is my data really private?',
    a: 'Yes. We never store IP addresses. All responses are decoupled from identity. Our Trust Score is a verifiable contract shown to every respondent.' },
  { q: 'Can I run an official club election with this?',
    a: 'Yes. Election mode enforces one vote per verified email. Voter tokens are used once and decoupled from responses. You get an audit log of token usage without exposing voter identities.' },
  { q: 'What happens to responses after the retention period?',
    a: 'They are permanently deleted from our database. A scheduled cleanup runs nightly. You can export your data before the retention period ends.' },
  { q: 'Is the free plan really free?',
    a: 'Yes. No credit card required. The Starter plan is free forever — unlimited surveys, 100 responses/month, with full Trust Score display.' },
]

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white">
      <nav className="h-16 border-b border-slate-100 flex items-center px-12">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-[#1B2D6B]">Privo</span><span className="text-emerald-500">ra</span>
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-20">
        <h1 className="text-4xl font-extrabold text-center mb-2">Simple, transparent pricing</h1>
        <p className="text-slate-500 text-center mb-16">Free to start. Upgrade when you need more.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {PLANS.map(plan => (
            <div key={plan.name} className={`relative bg-white border rounded-2xl p-8 ${plan.popular ? 'border-sky-500 ring-1 ring-sky-200 shadow-lg' : 'border-slate-200'}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-sky-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                  {plan.badge}
                </div>
              )}
              {!plan.popular && (
                <div className="text-xs font-semibold text-sky-500 mb-1 uppercase tracking-wide">{plan.badge}</div>
              )}
              <div className="text-4xl font-extrabold text-slate-900 mb-6">
                {plan.price}<span className="text-base font-medium text-slate-400">{plan.price !== 'Custom' ? '/month' : ''}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-emerald-500 mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={plan.href}
                className={`block text-center py-3 text-sm font-bold rounded-xl ${plan.outline ? 'border border-slate-200 text-slate-600 hover:bg-slate-50' : 'bg-sky-500 text-white hover:bg-sky-600'}`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-center mb-8">Frequently asked questions</h2>
          <div className="space-y-4">
            {FAQS.map(faq => (
              <details key={faq.q} className="group bg-slate-50 rounded-xl p-5 cursor-pointer">
                <summary className="text-sm font-semibold text-slate-900 list-none flex items-center justify-between">
                  {faq.q}
                  <span className="text-slate-400 group-open:rotate-180 transition">▼</span>
                </summary>
                <p className="text-sm text-slate-500 mt-3 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
