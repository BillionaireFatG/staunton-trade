export const congoAnalytics = {
  volumeByRegion: [
    {
      region: 'Katanga (Haut-Katanga & Lualaba)',
      volume: 52000,
      value: 445000000,
      deals: 34,
      primaryCommodity: 'Copper & Cobalt',
      authority: 'Ministry of Mines - ARECOMS regulated'
    },
    {
      region: 'North & South Kivu',
      volume: 4200,
      value: 156000000,
      deals: 18,
      primaryCommodity: 'Coltan, Gold, Cassiterite',
      authority: 'CEEC E-trace mandatory'
    },
    {
      region: 'Kinshasa (Capital Region)',
      volume: 8500,
      value: 42000000,
      deals: 22,
      primaryCommodity: 'Trading Hub & Re-exports',
      authority: 'DGDA customs clearance'
    },
    {
      region: 'Congo Basin (Équateur & Mai-Ndombe)',
      volume: 12000,
      value: 28000000,
      deals: 16,
      primaryCommodity: 'Timber & Palm Oil',
      authority: 'Ministry of Environment & Agriculture'
    },
    {
      region: 'Kasai Region',
      volume: 850,
      value: 98000000,
      deals: 9,
      primaryCommodity: 'Diamonds',
      authority: 'Kimberley Process certified'
    }
  ],
  monthlyTrends: [
    { month: 'Jan 2024', volume: 18200, value: 152000000, deals: 28 },
    { month: 'Feb 2024', volume: 21400, value: 178000000, deals: 32 },
    { month: 'Mar 2024', volume: 24150, value: 201000000, deals: 39 }
  ],
  topCommodities: [
    { name: 'Copper', percentage: 48, value: 256000000, authority: 'Ministry of Mines' },
    { name: 'Cobalt', percentage: 32, value: 171000000, authority: 'Ministry of Mines - Strategic mineral' },
    { name: 'Gold', percentage: 9, value: 48000000, authority: 'CEEC certified' },
    { name: 'Coltan', percentage: 5, value: 27000000, authority: 'ITSCI tagged' },
    { name: 'Diamonds', percentage: 3, value: 16000000, authority: 'Kimberley certified' },
    { name: 'Other (Timber, Agricultural)', percentage: 3, value: 15000000, authority: 'Multi-ministry' }
  ],
  statistics: {
    totalVolume: '77,550 MT',
    totalValue: '$531M',
    activeDeals: 39,
    completedDeals: 58,
    averageDealSize: '$5.5M',
    growthRate: '+22.8%',
    platformCoverage: 'NCE-ECS Phase 1 - 65% national coverage',
    exportCompliance: '94% CEEC E-trace verified',
    ministryIntegration: '6 ministries connected'
  },
  ministryBreakdown: [
    { ministry: 'Ministry of Mines', commodities: ['Copper', 'Cobalt', 'Coltan', 'Gold', 'Diamonds'], percentage: 82 },
    { ministry: 'Ministry of Agriculture', commodities: ['Palm Oil', 'Coffee', 'Cocoa'], percentage: 8 },
    { ministry: 'Ministry of Environment', commodities: ['Timber', 'Carbon Credits'], percentage: 6 },
    { ministry: 'Ministry of Hydrocarbons', commodities: ['Crude Oil', 'Natural Gas'], percentage: 4 }
  ]
}
