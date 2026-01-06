import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            // Ensure cookies persist for 30 days
            response.cookies.set(name, value, {
              ...options,
              maxAge: options?.maxAge || 60 * 60 * 24 * 30, // 30 days
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production',
            });
          });
        },
      },
    }
  );

  // Allow auth callback and onboarding routes to proceed without checks
  if (pathname === '/auth/callback' || pathname === '/onboarding') {
    return response;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/profile') || pathname.startsWith('/messages') || pathname.startsWith('/voice-rooms')) {
    if (!user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/sign-in';
      return NextResponse.redirect(redirectUrl);
    }

    // Check if profile is complete, redirect to onboarding if not
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, full_name')
      .eq('id', user.id)
      .single();

    if (!profile || !profile.full_name) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/onboarding';
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Redirect authenticated users away from auth pages
  if (pathname === '/sign-in' || pathname === '/sign-up') {
    if (user) {
      // Check if profile is complete
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('id', user.id)
        .single();

      const redirectUrl = request.nextUrl.clone();
      if (!profile || !profile.full_name) {
        redirectUrl.pathname = '/onboarding';
      } else {
        redirectUrl.pathname = '/dashboard';
      }
      return NextResponse.redirect(redirectUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

