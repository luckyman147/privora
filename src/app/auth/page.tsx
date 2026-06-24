import Link from 'next/link'
import { AuthForm } from '@/components/auth/AuthForm'

export default function SignPage() {
  return (
    <div className="min-h-screen flex bg-slate-50">
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-12">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-emerald-600" />
            <span className="font-bold text-lg text-slate-900">Privora</span>
          </Link>

          <AuthForm />

          <p className="text-xs text-slate-500 text-center mt-6 max-w-sm">
            By signing in, you agree to our{' '}
            <Link href="/privacy" className="underline hover:text-slate-700">
              Privacy Policy
            </Link>{' '}
            and{' '}
            <Link href="/terms" className="underline hover:text-slate-700">
              Terms of Service
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-slate-900 via-sky-900 to-emerald-900 items-center justify-center px-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-sm text-white">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur border border-white/20 mb-6">
            <svg className="w-8 h-8 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
            </svg>
          </div>

          <h2 className="text-4xl font-800 mb-6 leading-tight">
            Privacy people can see
          </h2>
          <p className="text-lg text-slate-300 mb-8 leading-relaxed">
            Every form includes a Trust Score — a clear privacy contract between you and respondents. No surprises. No hidden settings.
          </p>

          <ul className="space-y-4">
            {[
              'Transparent data handling',
              'Anonymous response options',
              'FERPA-compliant defaults',
              'Audit-ready results',
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-sm">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 pt-8 border-t border-slate-700/50">
            <p className="italic text-slate-400 mb-3 text-sm">
              &ldquo;Privora changed how we run surveys. Our response rate went up 34% when students saw our privacy commitment.&rdquo;
            </p>
            <p className="text-xs font-600 text-slate-300">
              Alex Chen, MIT Student Government
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
