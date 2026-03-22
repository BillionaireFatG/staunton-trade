import { Fuel, Droplets, Flame } from 'lucide-react'

export const stauntonMarketData = {
  commodities: [
    { 
      name: 'Diesel', 
      symbol: 'ULSD',
      currentPrice: 876.50, 
      change: 12.35, 
      changePercent: 1.43,
      unit: 'USD/mt',
      high24h: 882.00,
      low24h: 861.25,
      volume: '2.4M MT',
      region: 'ARA',
      source: 'Platts',
      icon: 'Fuel'
    },
    { 
      name: 'Jet Fuel', 
      symbol: 'JET A1',
      currentPrice: 912.75, 
      change: -8.50, 
      changePercent: -0.92,
      unit: 'USD/mt',
      high24h: 925.00,
      low24h: 908.00,
      volume: '1.8M MT',
      region: 'ARA',
      source: 'Platts',
      icon: 'Droplets'
    },
    { 
      name: 'Gasoline', 
      symbol: 'RBOB',
      currentPrice: 798.25, 
      change: 5.75, 
      changePercent: 0.73,
      unit: 'USD/mt',
      high24h: 802.50,
      low24h: 790.00,
      volume: '3.1M MT',
      region: 'ARA',
      source: 'Platts',
      icon: 'Flame'
    },
    { 
      name: 'Crude Oil', 
      symbol: 'BRENT',
      currentPrice: 74.82, 
      change: 1.23, 
      changePercent: 1.67,
      unit: 'USD/BBL',
      high24h: 75.50,
      low24h: 73.15,
      volume: '12.5M BBL',
      region: 'ICE',
      source: 'ICE',
      icon: 'Droplets'
    },
    { 
      name: 'LNG', 
      symbol: 'TTF',
      currentPrice: 42.35, 
      change: -2.10, 
      changePercent: -4.73,
      unit: 'EUR/MWh',
      high24h: 44.50,
      low24h: 41.80,
      volume: '850K MWh',
      region: 'EU',
      source: 'ICE',
      icon: 'Flame'
    }
  ]
}
