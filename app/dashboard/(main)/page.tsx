'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import DashboardClient from './DashboardClient'
import type { Deal } from '@/types/database'
import { Loader2 } from 'lucide-react'

export default function Dashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [deals, setDeals] = useState<Deal[]>([])
  const [stats, setStats] = useState({
    totalDeals: 0,
    activeDeals: 0,
    totalVolume: 0,
    completedThisMonth: 0,
  })

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          router.replace('/sign-in')
          return
        }

        // Fetch deals
        const { data: dealsData } = await supabase
          .from('deals')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })

        const dealsArray: Deal[] = dealsData || []
        setDeals(dealsArray)

        // Calculate stats
        const totalDeals = dealsArray.length
        const activeDeals = dealsArray.filter(d => d.status === 'in_progress').length
        const totalVolume = dealsArray.reduce((sum, deal) => sum + Number(deal.total_value), 0)
        
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const completedThisMonth = dealsArray.filter(deal => {
          if (deal.status !== 'completed') return false
          const completedDate = new Date(deal.updated_at)
          return completedDate >= startOfMonth
        }).length

        setStats({
          totalDeals,
          activeDeals,
          totalVolume,
          completedThisMonth,
        })
      } catch (error) {
        console.error('Error loading dashboard:', error)
        router.replace('/sign-in')
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndLoadData()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <DashboardClient 
      initialDeals={deals}
      stats={stats}
    />
  )
}
