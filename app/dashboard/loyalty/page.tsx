'use client';

import { useState } from 'react';
import { 
  Gift, 
  Star, 
  Crown, 
  Zap, 
  Award,
  TrendingUp,
  Truck,
  FileCheck,
  Warehouse,
  DollarSign,
  Check
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// Mock user loyalty data
const mockUserLoyalty = {
  tier: 'gold' as const,
  points: 12850,
  pointsToNextTier: 7150,
  totalEarned: 18500,
  totalRedeemed: 5650,
  dealsCompleted: 32,
};

// Redemption options
const redemptionOptions = [
  {
    id: '1',
    name: 'Free Inspection',
    description: 'Complimentary Staunton verification inspection',
    points: 2500,
    icon: FileCheck,
  },
  {
    id: '2',
    name: 'Logistics Credit',
    description: '$500 credit towards logistics services',
    points: 5000,
    icon: Truck,
  },
  {
    id: '3',
    name: 'Tank Storage Credit',
    description: '3 days free tank storage',
    points: 7500,
    icon: Warehouse,
  },
  {
    id: '4',
    name: 'Transaction Fee Waiver',
    description: 'Zero fees on next deal up to $5M',
    points: 10000,
    icon: DollarSign,
  },
];

// Transaction history
const mockTransactions = [
  { id: '1', type: 'earned', points: 500, description: 'Deal completed: STN-2024-001847', date: '2024-12-28' },
  { id: '2', type: 'earned', points: 750, description: 'Monthly trust score bonus', date: '2024-12-25' },
  { id: '3', type: 'redeemed', points: -2500, description: 'Redeemed: Free Inspection', date: '2024-12-20' },
  { id: '4', type: 'earned', points: 500, description: 'Deal completed: STN-2024-001823', date: '2024-12-18' },
  { id: '5', type: 'bonus', points: 2000, description: 'Gold tier monthly bonus', date: '2024-12-01' },
];

const tiers = [
  { name: 'Bronze', icon: Star, min: 0, color: 'text-amber-600' },
  { name: 'Silver', icon: Zap, min: 1000, color: 'text-gray-400' },
  { name: 'Gold', icon: Award, min: 5000, color: 'text-yellow-500' },
  { name: 'Platinum', icon: Crown, min: 20000, color: 'text-slate-300' },
];

export default function LoyaltyPage() {
  const progressToNextTier = (mockUserLoyalty.points / (mockUserLoyalty.points + mockUserLoyalty.pointsToNextTier)) * 100;
  const currentTierIndex = tiers.findIndex(t => t.name.toLowerCase() === mockUserLoyalty.tier);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Loyalty Rewards</h1>
        <p className="text-sm text-muted-foreground mt-1">Earn points on every deal, redeem for valuable services</p>
      </div>

      {/* Points Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <Badge variant="secondary" className="mb-2">
                <Award size={12} className="mr-1 text-yellow-500" />
                Gold Member
              </Badge>
              <p className="text-sm text-muted-foreground">
                {mockUserLoyalty.pointsToNextTier.toLocaleString()} points until Platinum
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Available Points</p>
              <p className="text-3xl font-semibold text-foreground tabular-nums">{mockUserLoyalty.points.toLocaleString()}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>Gold</span>
              <span>Platinum</span>
            </div>
            <Progress value={progressToNextTier} className="h-2" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg bg-secondary">
              <p className="text-lg font-semibold text-foreground">{mockUserLoyalty.dealsCompleted}</p>
              <p className="text-xs text-muted-foreground">Deals</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-secondary">
              <p className="text-lg font-semibold text-foreground tabular-nums">{mockUserLoyalty.totalEarned.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Earned</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-secondary">
              <p className="text-lg font-semibold text-foreground tabular-nums">{mockUserLoyalty.totalRedeemed.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Redeemed</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-secondary">
              <p className="text-lg font-semibold text-foreground">2%</p>
              <p className="text-xs text-muted-foreground">Earn Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tier Benefits */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Tier Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {tiers.map((tier, i) => {
              const Icon = tier.icon;
              const isCurrent = i === currentTierIndex;
              const isUnlocked = i <= currentTierIndex;
              
              return (
                <div 
                  key={tier.name}
                  className={`p-4 rounded-lg border ${isCurrent ? 'border-primary bg-primary/5' : 'border-border'}`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Icon size={16} className={tier.color} />
                    <span className="text-sm font-medium text-foreground">{tier.name}</span>
                    {isCurrent && <Badge variant="secondary" className="text-[10px]">Current</Badge>}
                  </div>
                  <ul className="space-y-1.5 text-xs text-muted-foreground">
                    <li className="flex items-center gap-1.5">
                      <Check size={10} className={isUnlocked ? 'text-green-500' : ''} />
                      {i === 0 ? '1%' : i === 1 ? '1.5%' : i === 2 ? '2%' : '3%'} earn rate
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check size={10} className={isUnlocked ? 'text-green-500' : ''} />
                      {i === 0 ? '0%' : i === 1 ? '5%' : i === 2 ? '15%' : '25%'} discount
                    </li>
                    {i >= 2 && (
                      <li className="flex items-center gap-1.5">
                        <Check size={10} className={isUnlocked ? 'text-green-500' : ''} />
                        Priority support
                      </li>
                    )}
                  </ul>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Redemption Options */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Redeem Points</CardTitle>
          <CardDescription>Exchange your points for valuable services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {redemptionOptions.map((option) => {
              const Icon = option.icon;
              const canAfford = mockUserLoyalty.points >= option.points;
              
              return (
                <div 
                  key={option.id}
                  className={`p-4 rounded-lg border ${canAfford ? 'border-border' : 'border-border opacity-50'}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                      <Icon size={18} className="text-muted-foreground" />
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground tabular-nums">{option.points.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground">points</p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1">{option.name}</p>
                  <p className="text-xs text-muted-foreground mb-3">{option.description}</p>
                  <Button size="sm" className="w-full" disabled={!canAfford}>
                    {canAfford ? 'Redeem' : 'Not Enough Points'}
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {mockTransactions.map((tx) => (
              <div key={tx.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    tx.points > 0 ? 'bg-green-50 dark:bg-green-950' : 'bg-red-50 dark:bg-red-950'
                  }`}>
                    {tx.points > 0 ? (
                      <TrendingUp size={14} className="text-green-600 dark:text-green-400" />
                    ) : (
                      <Gift size={14} className="text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{tx.description}</p>
                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                  </div>
                </div>
                <span className={`text-sm font-semibold tabular-nums ${
                  tx.points > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {tx.points > 0 ? '+' : ''}{tx.points.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
