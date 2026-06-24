import Link from 'next/link'

interface PricingCardProps {
  name: string
  price: string
  features: string[]
  cta: string
  href: string
  popular?: boolean
}

export function PricingCard({ name, price, features, cta, href, popular }: PricingCardProps) {
  return (
    <div className={`relative bg-white border rounded-2xl p-8 ${popular ? 'border-sky-500 ring-1 ring-sky-200 shadow-lg' : 'border-slate-200'}`}>
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-sky-500 text-white text-xs font-bold px-4 py-1 rounded-full">
          Most popular
        </div>
      )}
      <div className="text-4xl font-extrabold text-slate-900 mb-6">
        {price}<span className="text-base font-medium text-slate-400">/month</span>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map(f => (
          <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
            <span className="text-emerald-500 mt-0.5">✓</span>
            {f}
          </li>
        ))}
      </ul>
      <Link href={href}
        className={`block text-center py-3 text-sm font-bold rounded-xl ${popular ? 'bg-sky-500 text-white hover:bg-sky-600' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
        {cta}
      </Link>
    </div>
  )
}
