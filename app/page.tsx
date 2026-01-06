'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Navigation from './components/landing/Navigation';
import Hero from './components/landing/Hero';
import Features from './components/landing/Features';
import HowItWorks from './components/landing/HowItWorks';
import Stats from './components/landing/Stats';
import CTA from './components/landing/CTA';
import Footer from './components/landing/Footer';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Check if profile is complete
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, full_name')
          .eq('id', session.user.id)
          .single();

        if (!profile || !profile.full_name) {
          router.push('/onboarding');
        } else {
          router.push('/dashboard');
        }
      }
    };

    checkAuth();
  }, [router]);

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
