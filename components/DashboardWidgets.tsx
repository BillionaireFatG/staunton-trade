'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Package,
  Users,
  Clock,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Ship,
  Fuel,
  Globe,
  Calendar,
  BarChart3,
  Activity,
  Zap,
  Target,
  Award,
  Bell,
  MessageSquare,
  FileText,
  ChevronRight,
  Sparkles,
  Star,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sparkline, RadialProgress, CHART_COLORS } from '@/components/LazyCharts';
import { TrustBadge } from '@/components/TrustScore';

// Quick Stats Widget
interface QuickStatsProps {
  stats: {
    label: string;
    value: string;
    change: string;
    changeType: 'positive' | 'negative' | 'neutral';
    icon: React.ComponentType<{ size?: number; className?: string }>;
    trend?: number[];
  }[];
}

export function QuickStatsWidget({ stats }: QuickStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center',
                  stat.changeType === 'positive' ? 'bg-emerald-500/10' :
                  stat.changeType === 'negative' ? 'bg-red-500/10' : 'bg-muted'
                )}>
                  <stat.icon size={20} className={cn(
                    stat.changeType === 'positive' ? 'text-emerald-500' :
                    stat.changeType === 'negative' ? 'text-red-500' : 'text-muted-foreground'
                  )} />
                </div>
                <Badge variant="secondary" className={cn(
                  'text-[10px]',
                  stat.changeType === 'positive' ? 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950' :
                  stat.changeType === 'negative' ? 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950' :
                  'text-muted-foreground'
                )}>
                  {stat.changeType === 'positive' ? <ArrowUpRight size={10} className="mr-0.5" /> :
                   stat.changeType === 'negative' ? <ArrowDownRight size={10} className="mr-0.5" /> : null}
                  {stat.change}
                </Badge>
              </div>
              <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              {stat.trend && (
                <div className="mt-3 -mx-1">
                  <Sparkline 
                    data={stat.trend} 
                    height={30} 
                    color={stat.changeType === 'positive' ? CHART_COLORS.success : CHART_COLORS.danger}
                    showDot={false}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

// Active Deals Widget
interface ActiveDeal {
  id: string;
  reference: string;
  commodity: string;
  counterparty: string;
  value: string;
  progress: number;
  status: 'on-track' | 'delayed' | 'attention';
  dueDate: string;
}

export function ActiveDealsWidget({ deals }: { deals: ActiveDeal[] }) {
  const getStatusColor = (status: ActiveDeal['status']) => {
    switch (status) {
      case 'on-track': return 'text-emerald-500 bg-emerald-500';
      case 'delayed': return 'text-amber-500 bg-amber-500';
      case 'attention': return 'text-red-500 bg-red-500';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Active Deals</CardTitle>
            <CardDescription>Deals requiring attention</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/deals">
              View All
              <ChevronRight size={14} className="ml-1" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {deals.map((deal) => (
          <Link
            key={deal.id}
            href={`/dashboard/deals/${deal.id}`}
            className="block p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-foreground">{deal.commodity}</span>
                  <Badge variant="outline" className="text-[10px]">{deal.reference}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{deal.counterparty}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-sm text-foreground">{deal.value}</p>
                <p className="text-[10px] text-muted-foreground">Due {deal.dueDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={deal.progress} className="h-1.5 flex-1" />
              <span className="text-xs font-medium text-muted-foreground">{deal.progress}%</span>
              <div className={cn('w-2 h-2 rounded-full', getStatusColor(deal.status).split(' ')[1])} />
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}

// Recent Activity Widget
interface Activity {
  id: string;
  type: 'deal' | 'message' | 'document' | 'payment' | 'alert';
  title: string;
  description: string;
  time: string;
  user?: {
    name: string;
    avatar?: string;
  };
}

export function RecentActivityWidget({ activities }: { activities: Activity[] }) {
  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'deal': return Package;
      case 'message': return MessageSquare;
      case 'document': return FileText;
      case 'payment': return DollarSign;
      case 'alert': return Bell;
    }
  };

  const getColor = (type: Activity['type']) => {
    switch (type) {
      case 'deal': return 'text-blue-500 bg-blue-500/10';
      case 'message': return 'text-purple-500 bg-purple-500/10';
      case 'document': return 'text-cyan-500 bg-cyan-500/10';
      case 'payment': return 'text-emerald-500 bg-emerald-500/10';
      case 'alert': return 'text-amber-500 bg-amber-500/10';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
            <CardDescription>Latest updates and notifications</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/activity">
              View All
              <ChevronRight size={14} className="ml-1" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = getIcon(activity.type);
          const colorClasses = getColor(activity.type);
          
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex gap-3"
            >
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', colorClasses)}>
                <Icon size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{activity.title}</p>
                <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
              </div>
              <span className="text-[10px] text-muted-foreground flex-shrink-0">{activity.time}</span>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}

// Top Counterparties Widget
interface Counterparty {
  id: string;
  name: string;
  company: string;
  avatar?: string;
  trustScore: number;
  isVerified: boolean;
  dealCount: number;
  totalVolume: string;
}

export function TopCounterpartiesWidget({ counterparties }: { counterparties: Counterparty[] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Top Partners</CardTitle>
            <CardDescription>Most active trading partners</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/counterparties">
              View All
              <ChevronRight size={14} className="ml-1" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {counterparties.map((cp, index) => (
          <div key={cp.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
            <span className="text-sm font-medium text-muted-foreground w-4">{index + 1}</span>
            <Avatar className="h-9 w-9">
              <AvatarImage src={cp.avatar} />
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {cp.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium text-foreground truncate">{cp.name}</span>
                <TrustBadge score={cp.trustScore} isVerified={cp.isVerified} size="sm" showScore={false} />
              </div>
              <p className="text-xs text-muted-foreground truncate">{cp.company}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{cp.totalVolume}</p>
              <p className="text-[10px] text-muted-foreground">{cp.dealCount} deals</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// Market Snapshot Widget
interface MarketPrice {
  commodity: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export function MarketSnapshotWidget({ prices }: { prices: MarketPrice[] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Market Snapshot</CardTitle>
            <CardDescription>Live commodity prices</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/market">
              View Market
              <ChevronRight size={14} className="ml-1" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {prices.map((item) => {
            const isPositive = item.change >= 0;
            return (
              <div key={item.symbol} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    <Fuel size={14} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.commodity}</p>
                    <p className="text-[10px] text-muted-foreground">{item.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground tabular-nums">${item.price.toFixed(2)}</p>
                  <p className={cn(
                    'text-[10px] font-medium tabular-nums',
                    isPositive ? 'text-emerald-500' : 'text-red-500'
                  )}>
                    {isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// Performance Goals Widget
interface Goal {
  id: string;
  title: string;
  current: number;
  target: number;
  unit: string;
  color: string;
}

export function PerformanceGoalsWidget({ goals }: { goals: Goal[] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Performance Goals</CardTitle>
            <CardDescription>Monthly targets progress</CardDescription>
          </div>
          <Badge variant="secondary" className="text-[10px]">
            <Calendar size={10} className="mr-1" />
            Dec 2024
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {goals.map((goal) => {
            const percentage = Math.min((goal.current / goal.target) * 100, 100);
            const isComplete = goal.current >= goal.target;
            
            return (
              <div key={goal.id} className="text-center">
                <RadialProgress
                  value={goal.current}
                  maxValue={goal.target}
                  color={goal.color}
                  size={80}
                  strokeWidth={8}
                  label={`${Math.round(percentage)}%`}
                />
                <p className="text-sm font-medium text-foreground mt-2">{goal.title}</p>
                <p className="text-xs text-muted-foreground">
                  {goal.current.toLocaleString()} / {goal.target.toLocaleString()} {goal.unit}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// Quick Actions Widget
interface QuickAction {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  href: string;
  color: string;
  description?: string;
}

export function QuickActionsWidget({ actions }: { actions: QuickAction[] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {actions.map((action) => (
            <Link key={action.label} href={action.href}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors"
              >
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center mb-2', action.color)}>
                  <action.icon size={16} />
                </div>
                <p className="text-sm font-medium text-foreground">{action.label}</p>
                {action.description && (
                  <p className="text-[10px] text-muted-foreground">{action.description}</p>
                )}
              </motion.div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Alerts & Notifications Widget
interface Alert {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  message: string;
  time: string;
  action?: {
    label: string;
    href: string;
  };
}

export function AlertsWidget({ alerts }: { alerts: Alert[] }) {
  const getAlertStyles = (type: Alert['type']) => {
    switch (type) {
      case 'warning': return 'border-amber-500/30 bg-amber-500/5 text-amber-600 dark:text-amber-400';
      case 'info': return 'border-blue-500/30 bg-blue-500/5 text-blue-600 dark:text-blue-400';
      case 'success': return 'border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400';
      case 'error': return 'border-red-500/30 bg-red-500/5 text-red-600 dark:text-red-400';
    }
  };

  const getIcon = (type: Alert['type']) => {
    switch (type) {
      case 'warning': return AlertCircle;
      case 'info': return Bell;
      case 'success': return CheckCircle2;
      case 'error': return AlertCircle;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Alerts</CardTitle>
            <CardDescription>Important notifications</CardDescription>
          </div>
          <Badge variant="secondary">{alerts.length} active</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {alerts.map((alert) => {
          const Icon = getIcon(alert.type);
          return (
            <div
              key={alert.id}
              className={cn('p-3 rounded-lg border', getAlertStyles(alert.type))}
            >
              <div className="flex gap-2">
                <Icon size={16} className="flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium">{alert.title}</p>
                    <span className="text-[10px] opacity-70">{alert.time}</span>
                  </div>
                  <p className="text-xs opacity-80 mt-0.5">{alert.message}</p>
                  {alert.action && (
                    <Button variant="link" size="sm" asChild className="h-auto p-0 mt-1">
                      <Link href={alert.action.href}>{alert.action.label}</Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

// Export all widgets
export default {
  QuickStatsWidget,
  ActiveDealsWidget,
  RecentActivityWidget,
  TopCounterpartiesWidget,
  MarketSnapshotWidget,
  PerformanceGoalsWidget,
  QuickActionsWidget,
  AlertsWidget,
};

