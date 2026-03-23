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
  // 12 months of data for compelling trend charts
  monthlyTrends: [
    { month: 'Apr 2023', volume: 11800, value:  98000000, deals: 17 },
    { month: 'May 2023', volume: 13200, value: 108000000, deals: 19 },
    { month: 'Jun 2023', volume: 14600, value: 119000000, deals: 22 },
    { month: 'Jul 2023', volume: 13900, value: 114000000, deals: 20 },
    { month: 'Aug 2023', volume: 15400, value: 129000000, deals: 24 },
    { month: 'Sep 2023', volume: 16700, value: 139000000, deals: 27 },
    { month: 'Oct 2023', volume: 17200, value: 144000000, deals: 29 },
    { month: 'Nov 2023', volume: 19100, value: 159000000, deals: 33 },
    { month: 'Dec 2023', volume: 17800, value: 148000000, deals: 30 },
    { month: 'Jan 2024', volume: 18200, value: 152000000, deals: 28 },
    { month: 'Feb 2024', volume: 21400, value: 178000000, deals: 32 },
    { month: 'Mar 2024', volume: 24150, value: 201000000, deals: 39 }
  ],
  topCommodities: [
    { name: 'Copper',                  percentage: 48, value: 256000000, authority: 'Ministry of Mines' },
    { name: 'Cobalt',                  percentage: 32, value: 171000000, authority: 'Ministry of Mines — Strategic mineral' },
    { name: 'Gold',                    percentage:  9, value:  48000000, authority: 'CEEC certified' },
    { name: 'Coltan',                  percentage:  5, value:  27000000, authority: 'ITSCI tagged' },
    { name: 'Diamonds',                percentage:  3, value:  16000000, authority: 'Kimberley certified' },
    { name: 'Other (Timber, Agri)',    percentage:  3, value:  13000000, authority: 'Multi-ministry' }
  ],
  weeklyTrends: [
    { name: 'Mon', current: 11200, previous:  9800 },
    { name: 'Tue', current: 13800, previous: 11500 },
    { name: 'Wed', current: 10900, previous: 12100 },
    { name: 'Thu', current: 14500, previous: 13200 },
    { name: 'Fri', current: 16800, previous: 14900 },
    { name: 'Sat', current:  7800, previous:  6500 },
    { name: 'Sun', current:  5600, previous:  4800 }
  ],
  statistics: {
    totalVolume:       '77,550 MT',
    totalValue:        '$531M',
    activeDeals:       39,
    completedDeals:    58,
    averageDealSize:   '$5.5M',
    growthRate:        '+22.8%',
    platformCoverage:  'NCE-ECS Phase 1 — 65% national coverage',
    exportCompliance:  '94% CEEC E-trace verified',
    ministryIntegration: '6 ministries connected'
  },
  ministryBreakdown: [
    { ministry: 'Ministry of Mines',        commodities: ['Copper', 'Cobalt', 'Coltan', 'Gold', 'Diamonds'], percentage: 82 },
    { ministry: 'Ministry of Agriculture',  commodities: ['Palm Oil', 'Coffee', 'Cocoa'],                    percentage:  8 },
    { ministry: 'Ministry of Environment',  commodities: ['Timber', 'Carbon Credits'],                       percentage:  6 },
    { ministry: 'Ministry of Hydrocarbons', commodities: ['Crude Oil', 'Natural Gas'],                       percentage:  4 }
  ],
  performanceMetrics: [
    { name: 'CEEC Compliance',      value: 94, target: 90 },
    { name: 'NCE-ECS Coverage',     value: 65, target: 75 },
    { name: 'Export Certification', value: 88, target: 85 },
    { name: 'Traceability (ITSCI)', value: 82, target: 80 }
  ]
}
