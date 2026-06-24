import Link from 'next/link'

export function Footer() {
  return (
    <footer className='bg-slate-50 border-t border-slate-200 py-12 px-12'>
      <div className='max-w-5xl mx-auto flex items-center justify-between'>
        <div className='flex items-center gap-2 text-sm text-slate-500'>
          <div className='w-6 h-6 rounded bg-gradient-to-br from-blue-600 to-emerald-600' />
          Privora &copy; {new Date().getFullYear()}
        </div>
        <div className='flex gap-6 text-sm text-slate-500'>
          <Link href='/pricing' className='hover:text-slate-800'>Pricing</Link>
          <Link href='/auth' className='hover:text-slate-800'>Sign in</Link>
          <a href='#' className='hover:text-slate-800'>Privacy</a>
          <a href='#' className='hover:text-slate-800'>Terms</a>
        </div>
      </div>
    </footer>
  )
}
