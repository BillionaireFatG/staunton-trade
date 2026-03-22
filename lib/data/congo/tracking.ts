export const congoShipments = [
  {
    id: 'congo-ship-1',
    trackingNumber: 'CNGO-2024-001',
    commodity: 'Copper Concentrate',
    quantity: '5,000 MT',
    origin: 'Matadi Port, DRC',
    destination: 'Rotterdam, Netherlands',
    status: 'In Transit' as const,
    departureDate: '2024-03-10',
    estimatedArrival: '2024-04-05',
    currentLocation: 'Atlantic Ocean',
    vessel: 'MV Congo Star',
    progress: 65
  },
  {
    id: 'congo-ship-2',
    trackingNumber: 'CNGO-2024-002',
    commodity: 'Cobalt Hydroxide',
    quantity: '250 MT',
    origin: 'Lubumbashi, DRC',
    destination: 'Antwerp, Belgium',
    status: 'At Origin' as const,
    departureDate: '2024-03-25',
    estimatedArrival: '2024-04-20',
    currentLocation: 'Lubumbashi Warehouse',
    vessel: 'TBD',
    progress: 15
  },
  {
    id: 'congo-ship-3',
    trackingNumber: 'CNGO-2024-003',
    commodity: 'Hardwood Timber',
    quantity: '1,200 m3',
    origin: 'Pointe-Noire Port, RC',
    destination: 'Shanghai, China',
    status: 'In Transit' as const,
    departureDate: '2024-02-28',
    estimatedArrival: '2024-03-30',
    currentLocation: 'Indian Ocean',
    vessel: 'MV Forest Express',
    progress: 80
  }
]
