import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string) {
          response.cookies.set(name, value)
        },
        remove(name: string) {
          response.cookies.set(name, '')
        },
      },
    }
  )
  const protectedRoutes = ['/dashboard', '/builder', '/results']
  const isProtected = protectedRoutes.some(p => request.nextUrl.pathname.startsWith(p))

  if (isProtected) {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return NextResponse.redirect(new URL('/auth', request.url))
  }

  return response
}

export const config = { matcher: ['/dashboard/:path*', '/builder/:path*', '/results/:path*', '/templates/:path*'] }
