'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  FileSignature, 
  Plus, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Shield,
  Calendar,
  Fuel,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useTradeEnvironment } from '@/lib/contexts/trade-environment-context';
import { getContracts } from '@/lib/data';

export default function ContractsPage() {
  const { environment } = useTradeEnvironment();
  const contractsData = getContracts(environment);
  
  const mockContracts = contractsData.map(c => ({
    id: c.id,
    commodity: c.commodity,
    locked_price: c.lockedPrice,
    market_price: c.marketPrice,
    volume_allocated: c.volumeAllocated,
    volume_used: c.volumeUsed,
    start_date: c.startDate,
    end_date: c.endDate,
    status: c.status,
    savings: c.savings,
  }));
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value || 0);
  };

  const formatVolume = (value: number | undefined) => {
    if (!value) return '0';
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toString();
  };

  const totalSavings = mockContracts.reduce((acc, c) => acc + (c.savings || 0), 0);
  const activeContracts = mockContracts.filter(c => c.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Fixed-Rate Contracts</h1>
          <p className="text-sm text-muted-foreground mt-1">Lock in fuel prices and hedge against market volatility</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/contracts/new" className="flex items-center gap-2">
            <Plus size={16} />
            New Contract
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <TrendingUp size={20} className="text-green-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Savings</p>
              <p className="text-xl font-semibold text-foreground">{formatCurrency(totalSavings)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileSignature size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Active Contracts</p>
              <p className="text-xl font-semibold text-foreground">{activeContracts}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <Shield size={20} className="text-yellow-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Price Protection</p>
              <p className="text-xl font-semibold text-foreground">100%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contracts Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-foreground">Your Contracts</h2>
        
        <div className="grid gap-4">
          {mockContracts.map((contract) => {
            const usagePercent = (contract.volume_used / contract.volume_allocated) * 100;
            const priceDiff = contract.market_price - contract.locked_price;
            const isProfit = priceDiff > 0;
            
            return (
              <Card key={contract.id} className="hover:border-primary/30 transition-colors">
                <CardContent className="p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Contract Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                          <Fuel size={18} className="text-muted-foreground" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">{contract.commodity}</span>
                            <Badge variant={contract.status === 'active' ? 'default' : 'secondary'}>
                              {contract.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground font-mono">{contract.id}</p>
                        </div>
                      </div>
                      
                      {/* Volume Progress */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Volume Used</span>
                          <span className="font-medium text-foreground">
                            {formatVolume(contract.volume_used)} / {formatVolume(contract.volume_allocated)} MT
                          </span>
                        </div>
                        <Progress value={usagePercent} className="h-2" />
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="flex flex-wrap gap-6 lg:gap-8">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Locked Price</p>
                        <p className="text-lg font-semibold text-foreground">{formatCurrency(contract.locked_price)}</p>
                        <p className="text-xs text-muted-foreground">/MT</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Market Price</p>
                        <p className="text-lg font-semibold text-muted-foreground">{formatCurrency(contract.market_price)}</p>
                        <p className="text-xs text-muted-foreground">/MT</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Savings</p>
                        <p className={`text-lg font-semibold ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
                          {isProfit ? '+' : ''}{formatCurrency(contract.savings)}
                        </p>
                        <p className="text-xs text-muted-foreground">this month</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Info Section */}
      <Card className="border-dashed">
        <CardContent className="p-6 text-center">
          <AlertCircle size={24} className="mx-auto mb-3 text-muted-foreground" />
          <h3 className="font-medium text-foreground mb-1">How Fixed-Rate Contracts Work</h3>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Staunton takes title of the commodity, allowing you to purchase fuel at a locked rate for the contract period. 
            This protects you from market volatility and ensures predictable costs.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
