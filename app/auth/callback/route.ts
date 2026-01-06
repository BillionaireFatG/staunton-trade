import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/onboarding';

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                // Set cookies with extended expiration for persistent sessions
                cookieStore.set(name, value, {
                  ...options,
                  maxAge: options?.maxAge || 60 * 60 * 24 * 30, // 30 days
                  sameSite: 'lax',
                  secure: process.env.NODE_ENV === 'production',
                });
              });
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Check if profile exists and is complete
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, full_name')
          .eq('id', user.id)
          .single();

        // Always redirect to onboarding if profile is incomplete
        if (!profile || !profile.full_name) {
          return NextResponse.redirect(new URL('/onboarding', requestUrl.origin));
        }

        // Only redirect to dashboard if profile is complete and no custom next URL
        if (next === '/onboarding') {
          return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
        }
      }
      
      // Redirect to the specified next URL
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }
  }

  // If there's an error or no code, redirect to sign-in with error
  return NextResponse.redirect(
    new URL('/sign-in?error=verification_failed', requestUrl.origin)
  );
}

