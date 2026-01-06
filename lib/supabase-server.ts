import { createServerClient as createSupabaseServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

/**
 * Creates a Supabase client for server-side operations
 * This client is configured to work with Next.js 16 App Router server components and API routes
 */
export async function createServerClient() {
  const cookieStore = await cookies();
  
  return createSupabaseServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            // Ensure cookies persist for 30 days
            cookieStore.set(name, value, {
              ...options,
              maxAge: options?.maxAge || 60 * 60 * 24 * 30, // 30 days
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production',
            });
          });
        } catch (error) {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
}



