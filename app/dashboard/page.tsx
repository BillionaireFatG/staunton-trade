import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase-server';
import SignOutButton from './SignOutButton';
import DashboardClient from './DashboardClient';
import type { Deal } from '@/types/database';

export default async function Dashboard() {
  const supabase = await createServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/sign-in');
  }

  // Fetch deals for the user
  const { data: deals, error: dealsError } = await supabase
    .from('deals')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (dealsError) {
    console.error('Error fetching deals:', dealsError);
  }

  const dealsData: Deal[] = deals || [];

  // Calculate stats
  const totalDeals = dealsData.length;
  const activeDeals = dealsData.filter(d => d.status === 'in_progress').length;
  const totalVolume = dealsData.reduce((sum, deal) => sum + Number(deal.total_value), 0);
  
  // Completed this month
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const completedThisMonth = dealsData.filter(deal => {
    if (deal.status !== 'completed') return false;
    const completedDate = new Date(deal.updated_at);
    return completedDate >= startOfMonth;
  }).length;

  return (
    <DashboardClient 
      initialDeals={dealsData}
      stats={{
        totalDeals,
        activeDeals,
        totalVolume,
        completedThisMonth,
      }}
    />
  );
}
