'use client';

import { useState } from 'react';
import { 
  Clock, 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  AlertCircle,
  FileText,
  Ship,
  Building,
  DollarSign,
  Shield
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// Mock lifecycle data
const mockDeals = [
  {
    id: 'STN-2024-001847',
    commodity: 'Diesel',
    buyer: 'EuroFuel Distributors',
    seller: 'Gulf Energy Corp',
    volume: 50000,
    value: 43750000,
    currentStage: 3,
    stages: [
      { name: 'Contract Signed', status: 'completed', date: '2024-12-15', icon: FileText },
      { name: 'Payment Received', status: 'completed', date: '2024-12-17', icon: DollarSign },
      { name: 'Tank Farm Loading', status: 'in_progress', date: '2024-12-20', icon: Building },
      { name: 'Vessel Transit', status: 'pending', date: null, icon: Ship },
      { name: 'Delivery Complete', status: 'pending', date: null, icon: CheckCircle },
      { name: 'Final Settlement', status: 'pending', date: null, icon: Shield },
    ],
  },
  {
    id: 'STN-2024-001823',
    commodity: 'Jet Fuel',
    buyer: 'Emirates Aviation Fuel',
    seller: 'Singapore Partners',
    volume: 35000,
    value: 31937500,
    currentStage: 5,
    stages: [
      { name: 'Contract Signed', status: 'completed', date: '2024-12-10', icon: FileText },
      { name: 'Payment Received', status: 'completed', date: '2024-12-11', icon: DollarSign },
      { name: 'Tank Farm Loading', status: 'completed', date: '2024-12-12', icon: Building },
      { name: 'Vessel Transit', status: 'completed', date: '2024-12-18', icon: Ship },
      { name: 'Delivery Complete', status: 'in_progress', date: '2024-12-25', icon: CheckCircle },
      { name: 'Final Settlement', status: 'pending', date: null, icon: Shield },
    ],
  },
];

export default function LifecyclePage() {
  const [selectedDeal, setSelectedDeal] = useState(mockDeals[0]);

  const getStageIcon = (status: string, Icon: any) => {
    if (status === 'completed') {
      return <CheckCircle size={20} className="text-green-500" />;
    }
    if (status === 'in_progress') {
      return <Clock size={20} className="text-yellow-500 animate-pulse" />;
    }
    return <Circle size={20} className="text-muted-foreground" />;
  };

  const getProgress = (deal: typeof mockDeals[0]) => {
    const completed = deal.stages.filter(s => s.status === 'completed').length;
    const inProgress = deal.stages.filter(s => s.status === 'in_progress').length;
    return ((completed + inProgress * 0.5) / deal.stages.length) * 100;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Deal Lifecycle</h1>
        <p className="text-sm text-muted-foreground mt-1">Track every stage of your active commodity deals</p>
      </div>

      {/* Deal Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockDeals.map((deal) => (
          <Card
            key={deal.id}
            className={`cursor-pointer transition-all hover:border-primary/50 ${
              selectedDeal.id === deal.id ? 'border-primary ring-1 ring-primary' : ''
            }`}
            onClick={() => setSelectedDeal(deal)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-mono text-sm text-primary">{deal.id}</p>
                  <p className="font-medium text-foreground">{deal.commodity}</p>
                  <p className="text-xs text-muted-foreground">{deal.buyer}</p>
                </div>
                <Badge variant="secondary">{Math.round(getProgress(deal))}%</Badge>
              </div>
              <Progress value={getProgress(deal)} className="h-1.5" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Deal Details */}
      <Card>
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-mono">{selectedDeal.id}</CardTitle>
              <CardDescription>
                {selectedDeal.commodity} • {selectedDeal.volume.toLocaleString()} MT • {formatCurrency(selectedDeal.value)}
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{selectedDeal.buyer}</p>
              <p className="text-xs text-muted-foreground">from {selectedDeal.seller}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Lifecycle Timeline */}
          <div className="relative">
            {selectedDeal.stages.map((stage, index) => (
              <div key={stage.name} className="flex items-start gap-4 pb-8 last:pb-0">
                {/* Timeline Line */}
                <div className="relative flex flex-col items-center">
                  <div className={`z-10 rounded-full p-1 ${
                    stage.status === 'completed' ? 'bg-green-500/10' :
                    stage.status === 'in_progress' ? 'bg-yellow-500/10' : 'bg-muted'
                  }`}>
                    {getStageIcon(stage.status, stage.icon)}
                  </div>
                  {index < selectedDeal.stages.length - 1 && (
                    <div className={`absolute top-10 w-0.5 h-full ${
                      stage.status === 'completed' ? 'bg-green-500/30' : 'bg-border'
                    }`} />
                  )}
                </div>

                {/* Stage Content */}
                <div className="flex-1 pt-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-medium ${
                        stage.status === 'completed' ? 'text-foreground' :
                        stage.status === 'in_progress' ? 'text-yellow-500' : 'text-muted-foreground'
                      }`}>
                        {stage.name}
                      </p>
                      {stage.date && (
                        <p className="text-xs text-muted-foreground">{stage.date}</p>
                      )}
                    </div>
                    {stage.status === 'in_progress' && (
                      <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                        In Progress
                      </Badge>
                    )}
                    {stage.status === 'completed' && (
                      <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                        Completed
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Info */}
      <Card className="border-dashed">
        <CardContent className="p-6 text-center">
          <AlertCircle size={24} className="mx-auto mb-3 text-muted-foreground" />
          <h3 className="font-medium text-foreground mb-1">Real-Time Tracking</h3>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Each stage is updated in real-time by Staunton's verified inspection teams and logistics partners. 
            All updates are cryptographically signed and stored on-chain.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}


