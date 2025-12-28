import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase-server';
import DashboardClient from '../../DashboardClient';
import type { Deal } from '@/types/database';
import { Activity } from 'lucide-react';

export default async function ActiveDealsPage() {
  const supabase = await createServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/sign-in');
  }

  const { data: deals, error: dealsError } = await supabase
    .from('deals')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'in_progress')
    .order('created_at', { ascending: false });

  if (dealsError) {
    console.error('Error fetching deals:', dealsError);
  }

  const dealsData: Deal[] = deals || [];

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3b82f6]/20 to-[#3b82f6]/5 flex items-center justify-center">
            <Activity size={18} className="text-[#3b82f6]" />
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Active Deals</h1>
        </div>
        <p className="text-[13px] text-[#666] ml-[52px]">Deals currently in progress</p>
      </div>
      
      <DashboardClient 
        initialDeals={dealsData}
        stats={{
          totalDeals: dealsData.length,
          activeDeals: dealsData.length,
          totalVolume: dealsData.reduce((sum, deal) => sum + Number(deal.total_value), 0),
          completedThisMonth: 0,
        }}
      />
    </div>
  );
}


