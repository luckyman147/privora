import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Privora — Privacy-first forms',
    template: '%s · Privora',
  },
  description: 'Collect trusted surveys and anonymous elections with a built-in Trust Score.',
  keywords: ['survey', 'election', 'privacy', 'forms', 'student organizations'],
  openGraph: {
    title: 'Privora — Privacy-first forms',
    description: 'Forms people actually trust.',
    url: 'https://privora.app',
    siteName: 'Privora',
    images: [{ url: '/og.png', width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privora — Privacy-first forms',
    creator: '@privorahq',
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-white text-slate-900 antialiased">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1E293B',
              color:      '#F8FAFC',
              border:     '1px solid #334155',
              borderRadius: '10px',
            },
          }}
        />
      </body>
    </html>
  )
}
