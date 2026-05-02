import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const response = NextResponse.next()
  const { pathname } = request.nextUrl

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // ─── PROTECCIÓ ZONA ALUMNES ───────────────────────────────────────────────
  if (pathname.startsWith('/alumnes') && !pathname.startsWith('/alumnes/login')) {
    if (!user) {
      return NextResponse.redirect(new URL('/alumnes/login', request.url))
    }

    // Verificar que és alumne (no admin)
    const { data: alumne } = await supabase
      .from('alumnes_autoritzats')
      .select('id')
      .eq('email', user.email!)
      .single()

    if (!alumne) {
      await supabase.auth.signOut()
      return NextResponse.redirect(new URL('/alumnes/login', request.url))
    }
  }

  // ─── PROTECCIÓ PANEL ADMIN ────────────────────────────────────────────────
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Verificar que és admin
    const { data: admin } = await supabase
      .from('admins')
      .select('id')
      .eq('email', user.email!)
      .single()

    if (!admin) {
      return NextResponse.redirect(new URL('/alumnes/login', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/alumnes/:path*',
    '/admin/:path*',
  ],
}
