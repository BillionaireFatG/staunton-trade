'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  RefreshCw, 
  DollarSign,
  Fuel,
  Droplets,
  Flame,
  Globe,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  Bot,
  Sparkles,
  MessageSquare,
  X,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import dynamic from 'next/dynamic';

// Lazy load AI Assistant (heavy component)
const AIAssistant = dynamic(() => import('@/components/AIAssistant').then(mod => ({ default: mod.AIAssistant })), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] rounded-lg border border-border bg-card flex items-center justify-center">
      <div className="text-center">
        <Bot size={32} className="mx-auto text-muted-foreground mb-2 animate-pulse" />
        <p className="text-sm text-muted-foreground">Loading AI Assistant...</p>
      </div>
    </div>
  ),
});

// Mock price data
const mockPriceData = [
  { 
    commodity: 'Diesel', 
    symbol: 'ULSD',
    region: 'ARA', 
    price: 876.50, 
    change24h: 12.35, 
    changePercent: 1.43,
    high24h: 882.00,
    low24h: 861.25,
    volume: '2.4M MT',
    icon: Fuel,
  },
  { 
    commodity: 'Jet Fuel', 
    symbol: 'JET A1',
    region: 'ARA', 
    price: 912.75, 
    change24h: -8.50, 
    changePercent: -0.92,
    high24h: 925.00,
    low24h: 908.00,
    volume: '1.8M MT',
    icon: Droplets,
  },
  { 
    commodity: 'Gasoline', 
    symbol: 'RBOB',
    region: 'ARA', 
    price: 798.25, 
    change24h: 5.75, 
    changePercent: 0.73,
    high24h: 802.50,
    low24h: 790.00,
    volume: '3.1M MT',
    icon: Flame,
  },
  { 
    commodity: 'Crude Oil', 
    symbol: 'BRENT',
    region: 'ICE', 
    price: 74.82, 
    change24h: 1.23, 
    changePercent: 1.67,
    high24h: 75.50,
    low24h: 73.15,
    volume: '12.5M BBL',
    icon: Droplets,
  },
  { 
    commodity: 'LNG', 
    symbol: 'TTF',
    region: 'EU', 
    price: 42.35, 
    change24h: -2.10, 
    changePercent: -4.73,
    high24h: 45.20,
    low24h: 41.80,
    volume: '850K MMBtu',
    icon: Flame,
  },
];

const regions = ['All Regions', 'ARA', 'Singapore', 'Fujairah', 'US Gulf', 'Asia'];
const timeframes = ['Live', '1H', '4H', '8H', '24H', '7D'];

export default function MarketPage() {
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [selectedTimeframe, setSelectedTimeframe] = useState('Live');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [aiExpanded, setAiExpanded] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdate(new Date());
      setIsRefreshing(false);
    }, 1000);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Market Prices</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time commodity price intelligence</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary text-xs text-muted-foreground">
            <Clock size={14} />
            <span>Last update: {formatTime(lastUpdate)}</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw size={14} className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Info Banner */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <DollarSign size={20} className="text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Staunton Price Engine</p>
            <p className="text-xs text-muted-foreground">
              Prices updated every 8 hours. Currently mirroring Platts assessments.
            </p>
          </div>
          <Button size="sm" variant="outline">
            <Bell size={14} className="mr-1.5" />
            Set Alert
          </Button>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <Select value={selectedRegion} onValueChange={setSelectedRegion}>
          <SelectTrigger className="w-40 h-9">
            <Globe size={14} className="mr-2 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {regions.map(region => (
              <SelectItem key={region} value={region}>{region}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center rounded-lg border p-0.5">
          {timeframes.map(tf => (
            <button
              key={tf}
              onClick={() => setSelectedTimeframe(tf)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                selectedTimeframe === tf 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout with AI Panel */}
      <div className={`grid gap-6 ${showAI ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>
        {/* Price Cards */}
        <div className={showAI ? 'lg:col-span-2' : ''}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockPriceData.map((item) => {
              const Icon = item.icon;
              const isPositive = item.change24h >= 0;
              
              return (
                <Card key={item.symbol} className="overflow-hidden">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                          <Icon size={18} className="text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{item.commodity}</p>
                          <p className="text-xs text-muted-foreground">{item.symbol} · {item.region}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center text-xs font-medium px-1.5 py-0.5 rounded ${
                        isPositive 
                          ? 'text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950' 
                          : 'text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950'
                      }`}>
                        {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
                      </span>
                    </div>

                    <div className="mb-4">
                      <p className="text-2xl font-semibold text-foreground tabular-nums">{formatPrice(item.price)}</p>
                      <p className="text-xs text-muted-foreground">/MT</p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 pt-4 border-t">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">24h High</p>
                        <p className="text-sm font-medium text-foreground tabular-nums">{formatPrice(item.high24h)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">24h Low</p>
                        <p className="text-sm font-medium text-foreground tabular-nums">{formatPrice(item.low24h)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Volume</p>
                        <p className="text-sm font-medium text-foreground">{item.volume}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* AI Assistant Panel */}
        {showAI && (
          <div className="lg:col-span-1 h-[600px]">
            <AIAssistant 
              expanded={aiExpanded}
              onToggleExpand={() => setAiExpanded(!aiExpanded)}
            />
          </div>
        )}
      </div>

      {/* Floating AI Button */}
      {!showAI && (
        <Button
          onClick={() => setShowAI(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg shadow-primary/20 z-50"
          size="icon"
        >
          <Sparkles size={24} />
        </Button>
      )}

      {/* AI Close Button when panel is open */}
      {showAI && (
        <Button
          onClick={() => setShowAI(false)}
          variant="outline"
          className="fixed bottom-6 right-6 h-12 gap-2 rounded-full shadow-lg z-50"
        >
          <X size={16} />
          Close AI
        </Button>
      )}
    </div>
  );
}
