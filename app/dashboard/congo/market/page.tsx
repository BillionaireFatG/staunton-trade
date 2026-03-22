'use client'

import { getMarketData } from '@/lib/data'
import dynamic from 'next/dynamic'

// Reuse the market page component logic but force congo environment
const MarketPageContent = dynamic(() => import('../../(main)/market/page'), {
  ssr: false,
})

export default function CongoMarketPage() {
  return <MarketPageContent />
}
