export const congoMarketData = {
  commodities: [
    {
      name: 'Copper',
      symbol: 'CU',
      currentPrice: 8650,
      change: 150,
      changePercent: 1.8,
      unit: 'USD/mt',
      lastUpdated: '2024-03-15T15:30:00Z',
      source: 'LME',
      description: 'DRC National Exchange - Katanga Province primary production'
    },
    {
      name: 'Cobalt',
      symbol: 'CO',
      currentPrice: 32500,
      change: -800,
      changePercent: -2.4,
      unit: 'USD/mt',
      lastUpdated: '2024-03-15T15:30:00Z',
      source: 'LME',
      description: 'DRC produces 70%+ of global cobalt - battery grade pricing'
    },
    {
      name: 'Coltan (Tantalite)',
      symbol: 'COLT',
      currentPrice: 180,
      change: 5,
      changePercent: 2.9,
      unit: 'USD/kg',
      lastUpdated: '2024-03-15T15:30:00Z',
      source: 'DRC-NMECS',
      description: 'Electronics industry critical - North & South Kivu production'
    },
    {
      name: 'Gold',
      symbol: 'AU',
      currentPrice: 62000,
      change: 1200,
      changePercent: 2.0,
      unit: 'USD/kg',
      lastUpdated: '2024-03-15T15:30:00Z',
      source: 'LBMA',
      description: 'ASM and industrial production - CEEC certified conflict-free'
    },
    {
      name: 'Timber (Hardwood)',
      symbol: 'TIM',
      currentPrice: 460,
      change: 10,
      changePercent: 2.2,
      unit: 'USD/m3',
      lastUpdated: '2024-03-15T15:30:00Z',
      source: 'DRC-NMECS',
      description: 'Congo Basin sustainable forestry - FSC certified'
    },
    {
      name: 'Diamonds',
      symbol: 'DIA',
      currentPrice: 125,
      change: 3,
      changePercent: 2.5,
      unit: 'USD/carat',
      lastUpdated: '2024-03-15T15:30:00Z',
      source: 'DRC-NMECS',
      description: 'Industrial & gem quality - Kimberley Process certified'
    },
    {
      name: 'Palm Oil',
      symbol: 'PALM',
      currentPrice: 920,
      change: -15,
      changePercent: -1.6,
      unit: 'USD/mt',
      lastUpdated: '2024-03-15T15:30:00Z',
      source: 'DRC-NMECS',
      description: 'Agricultural commodity - Ministry of Agriculture tracked'
    }
  ],
  priceHistory: [
    { date: 'Jan 2024', copper: 8200, cobalt: 34000, coltan: 170, gold: 59500, timber: 440, diamonds: 120, palmOil: 950 },
    { date: 'Feb 2024', copper: 8400, cobalt: 33500, coltan: 175, gold: 60800, timber: 445, diamonds: 122, palmOil: 935 },
    { date: 'Mar 2024', copper: 8650, cobalt: 32500, coltan: 180, gold: 62000, timber: 460, diamonds: 125, palmOil: 920 }
  ],
  exchangeInfo: {
    name: 'DRC National Commodity Exchange & Export Clearing System',
    abbreviation: 'NCE-ECS',
    tradingHours: '08:00 - 17:00 CAT (Mon-Fri)',
    clearingSystem: 'CEEC E-trace Integration',
    exportControl: 'ARECOMS regulated, DGDA customs integrated'
  }
}
