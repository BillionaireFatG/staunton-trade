import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: 'pkce',
    autoRefreshToken: true,
    detectSessionInUrl: true,
    persistSession: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'staunton-auth-token',
  },
  cookieOptions: {
    maxAge: 60 * 60 * 24 * 30, // 30 days in seconds
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  },
});



