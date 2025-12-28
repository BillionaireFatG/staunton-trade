'use client';

import { useRouter } from 'next/navigation';
import { Onboarding } from '@/components/Onboarding';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function OnboardingPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
      }
    };
    getUser();
  }, []);

  const handleComplete = () => {
    // In production, save onboarding completion status
    localStorage.setItem('onboarding_complete', 'true');
    router.push('/dashboard');
  };

  const handleSkip = () => {
    localStorage.setItem('onboarding_complete', 'true');
    router.push('/dashboard');
  };

  return (
    <Onboarding 
      userEmail={userEmail}
      onComplete={handleComplete}
      onSkip={handleSkip}
    />
  );
}


