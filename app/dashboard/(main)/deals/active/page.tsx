'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import DashboardClient from '../../DashboardClient'
import type { Deal } from '@/types/database'
import { Activity, Loader2 } from 'lucide-react'

export default function ActiveDealsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [deals, setDeals] = useState<Deal[]>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          router.replace('/sign-in')
          return
        }

        const { data: dealsData } = await supabase
          .from('deals')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('status', 'in_progress')
          .order('created_at', { ascending: false })

        setDeals(dealsData || [])
      } catch (error) {
        console.error('Error:', error)
        router.replace('/sign-in')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const dealsData: Deal[] = deals || [];

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


