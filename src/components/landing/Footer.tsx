import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: [
      { label: 'Features', href: '#' },
      { label: 'Trust Score', href: '#' },
      { label: 'Changelog', href: '#' },
      { label: 'Integrations', href: '#' },
    ],
    resources: [
      { label: 'Docs', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Templates', href: '#' },
      { label: 'Status', href: '#' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms', href: '#' },
      { label: 'FERPA', href: '#' },
      { label: 'Security', href: '#' },
    ],
  }

  return (
    <footer className='bg-slate-900 border-t border-slate-800 text-slate-400'>
      {/* Main Footer Content */}
      <div className='max-w-7xl mx-auto px-12 py-16'>
        <div className='grid grid-cols-5 gap-12 mb-12'>
          {/* Brand Column */}
          <div className='col-span-2'>
            <Link href='/' className='flex items-center gap-2 mb-4'>
              <Image src='/images/logo.png' alt='Privora' width={32} height={32} className='h-8 w-auto' />
              <span className='font-bold text-lg text-white'>Privora</span>
            </Link>
            <p className='text-sm text-slate-400 leading-relaxed max-w-xs'>
              Privacy-first forms for clubs, organizations, and universities.
              Every form comes with a Trust Score.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className='text-xs font-700 uppercase tracking-widest text-slate-300 mb-4'>
              Product
            </h3>
            <ul className='space-y-3'>
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className='text-sm text-slate-400 hover:text-slate-200 transition'
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className='text-xs font-700 uppercase tracking-widest text-slate-300 mb-4'>
              Resources
            </h3>
            <ul className='space-y-3'>
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className='text-sm text-slate-400 hover:text-slate-200 transition'
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className='text-xs font-700 uppercase tracking-widest text-slate-300 mb-4'>
              Legal
            </h3>
            <ul className='space-y-3'>
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className='text-sm text-slate-400 hover:text-slate-200 transition'
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className='border-t border-slate-800 pt-8'>
          {/* Bottom Content */}
          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
            {/* Copyright */}
            <p className='text-xs text-slate-500'>
              © {currentYear} Privora, Inc. All rights reserved.
            </p>

            {/* Tagline */}
            <p className='text-xs text-slate-500'>
              Built for open, honest communities.
            </p>

            {/* Social Links (optional) */}
            <div className='flex gap-4'>
              <a
                href='#'
                aria-label='Twitter'
                className='w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 transition text-sm'
              >
                𝕏
              </a>
              <a
                href='#'
                aria-label='GitHub'
                className='w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 transition text-sm'
              >
                ⚙
              </a>
              <a
                href='#'
                aria-label='Discord'
                className='w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 transition text-sm'
              >
                💬
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Banner */}
      <div className='bg-slate-800/50 border-t border-slate-800 py-4 px-12'>
        <div className='max-w-7xl mx-auto flex items-center justify-between text-xs text-slate-500'>
          <div className='flex items-center gap-2'>
            <span className='w-1.5 h-1.5 rounded-full bg-emerald-500' />
            <span>All systems operational</span>
          </div>
          <div className='flex items-center gap-6'>
            <span>🔒 SOC 2 Type II Certified</span>
            <span>⚡ 99.99% Uptime SLA</span>
            <span>🇺🇸 Data in US</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
