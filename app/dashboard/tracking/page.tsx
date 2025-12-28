'use client';

import { useState } from 'react';
import { 
  Navigation,
  Ship, 
  Warehouse, 
  Clock, 
  Search,
  RefreshCw,
  Calendar,
  CheckCircle,
  MapPin,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// Mock tracking data
const mockTrackingData = [
  {
    id: '1',
    reference_number: 'STN-2024-001847',
    commodity_type: 'Diesel',
    volume: 50000,
    status: 'injection_in_progress',
    progress: 70,
    vessel_name: 'MT Nordic Star',
    origin_port: 'Houston, TX',
    destination_port: 'Rotterdam, NL',
    eta: '2024-12-30T14:00:00Z',
    injection_facility: 'Vopak Rotterdam Terminal',
    buyer_name: 'EuroFuel Distributors',
  },
  {
    id: '2',
    reference_number: 'STN-2024-001892',
    commodity_type: 'Jet Fuel',
    volume: 35000,
    status: 'in_transit',
    progress: 55,
    vessel_name: 'MT Blue Horizon',
    origin_port: 'Singapore',
    destination_port: 'Fujairah, UAE',
    eta: '2024-12-28T10:00:00Z',
    injection_facility: 'ENOC Fujairah Terminal',
    buyer_name: 'Emirates Aviation Fuel',
  },
  {
    id: '3',
    reference_number: 'STN-2024-001923',
    commodity_type: 'Gasoline',
    volume: 75000,
    status: 'verification',
    progress: 85,
    vessel_name: 'MT Atlantic Carrier',
    origin_port: 'Amsterdam, NL',
    destination_port: 'Lagos, NG',
    eta: '2024-12-25T08:00:00Z',
    injection_facility: 'NNPC Lagos Terminal',
    buyer_name: 'Nigeria National Petroleum',
  },
];

export default function TrackingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShipment, setSelectedShipment] = useState(mockTrackingData[0]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: 'default' | 'secondary' | 'outline'; label: string; dot: string }> = {
      injection_in_progress: { variant: 'default', label: 'Injection In Progress', dot: 'bg-blue-500' },
      in_transit: { variant: 'secondary', label: 'In Transit', dot: 'bg-yellow-500' },
      verification: { variant: 'outline', label: 'Verification', dot: 'bg-green-500' },
    };
    const { variant, label, dot } = config[status] || { variant: 'secondary', label: status, dot: 'bg-gray-500' };
    return (
      <Badge variant={variant} className="font-normal">
        <span className={`w-1.5 h-1.5 rounded-full ${dot} mr-1.5`} />
        {label}
      </Badge>
    );
  };

  const milestones = [
    { label: 'Contract Signed', completed: true },
    { label: 'Vessel Loaded', completed: true },
    { label: 'In Transit', completed: true },
    { label: 'Arrived', completed: selectedShipment.progress >= 70 },
    { label: 'Injection', completed: selectedShipment.progress >= 85 },
    { label: 'Verified', completed: selectedShipment.progress >= 100 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Live Tracking</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time cargo tracking and injection scheduling</p>
        </div>
        
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw size={14} className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Enter reference number (e.g., STN-2024-001847)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10"
              />
            </div>
            <Button>Track Shipment</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shipment List */}
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Ship size={16} className="text-primary" />
            Active Shipments
          </h2>
          {mockTrackingData.map((shipment) => (
            <Card
              key={shipment.id}
              className={`cursor-pointer transition-colors ${
                selectedShipment.id === shipment.id ? 'border-primary' : ''
              }`}
              onClick={() => setSelectedShipment(shipment)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs font-mono text-primary mb-1">{shipment.reference_number}</p>
                    <p className="text-sm font-medium text-foreground">{shipment.vessel_name}</p>
                  </div>
                  {getStatusBadge(shipment.status)}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{shipment.origin_port}</span>
                  <ArrowRight size={12} />
                  <span>{shipment.destination_port}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Clock size={12} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">ETA: {formatDate(shipment.eta)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selected Shipment Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Map Placeholder */}
          <Card>
            <CardContent className="p-0">
              <div className="h-64 bg-secondary rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Ship size={28} className="text-primary" />
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1">{selectedShipment.vessel_name}</p>
                  <p className="text-xs text-muted-foreground">{selectedShipment.commodity_type} · {selectedShipment.volume.toLocaleString()} MT</p>
                </div>
                {/* Route visualization */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-green-500" />
                    <span className="text-xs text-muted-foreground">{selectedShipment.origin_port}</span>
                  </div>
                  <div className="flex-1 mx-4 h-0.5 bg-border relative">
                    <div className="absolute left-0 top-0 h-full bg-primary" style={{ width: `${selectedShipment.progress}%` }} />
                    <div className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-primary border-2 border-background" style={{ left: `${selectedShipment.progress}%` }} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{selectedShipment.destination_port}</span>
                    <MapPin size={14} className="text-red-500" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Progress</CardTitle>
                <span className="text-2xl font-semibold text-foreground">{selectedShipment.progress}%</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-2 rounded-full bg-secondary overflow-hidden mb-4">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${selectedShipment.progress}%` }} />
              </div>
              <div className="flex justify-between">
                {milestones.map((milestone, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-2 ${
                      milestone.completed ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                    }`}>
                      {milestone.completed ? <CheckCircle size={12} /> : <Clock size={12} />}
                    </div>
                    <span className="text-[10px] text-muted-foreground text-center">{milestone.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Ship size={16} className="text-primary" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Vessel</span>
                </div>
                <p className="text-sm font-medium text-foreground">{selectedShipment.vessel_name}</p>
                <p className="text-xs text-muted-foreground">ETA: {formatDate(selectedShipment.eta)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Warehouse size={16} className="text-primary" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Injection</span>
                </div>
                <p className="text-sm font-medium text-foreground">{selectedShipment.injection_facility}</p>
                <p className="text-xs text-muted-foreground">{selectedShipment.volume.toLocaleString()} MT</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
