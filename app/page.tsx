import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Navigation from './components/landing/Navigation';
import Hero from './components/landing/Hero';
import Features from './components/landing/Features';
import HowItWorks from './components/landing/HowItWorks';
import Stats from './components/landing/Stats';
import CTA from './components/landing/CTA';
import Footer from './components/landing/Footer';

export default async function Home() {
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
              cookieStore.set(name, value, options);
            });
          } catch {}
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  
  if (session) {
    // Check if profile is complete
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, full_name')
      .eq('id', session.user.id)
      .single();

    if (!profile || !profile.full_name) {
      redirect('/onboarding');
    } else {
      redirect('/dashboard');
    }
  }

  return (
    <main>
      <Navigation />
      <Hero />
      <Features />
      <HowItWorks />
      <Stats />
      <CTA />
      <Footer />
    </main>
  );
}
