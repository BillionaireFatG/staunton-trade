'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewDealPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the proper deal creation form
    router.replace('/dashboard/deals/new');
  }, [router]);

  return null;
}
