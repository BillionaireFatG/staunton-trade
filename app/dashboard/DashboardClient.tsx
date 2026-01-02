'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import type { Deal } from '@/types/database';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  Plus,
  Search,
  Eye,
  MoreHorizontal,
  FileText,
  DollarSign,
  Zap,
  CheckCircle,
  Columns,
  ChevronDown,
  Globe2,
  Ship,
  Fuel,
  MapPin,
  Activity
} from 'lucide-react';
import { DealProgressBadge } from '@/components/DealProgress';
import { DEAL_STAGES } from '@/types/database';
import type { DealStatus } from '@/types/database';
import { TrustIndicator, TrustBadge } from '@/components/TrustScore';

// Dynamically import the globe to avoid SSR issues with d3
const CommodityGlobe = dynamic(() => import('@/components/CommodityGlobe'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] rounded-xl bg-gradient-to-br from-muted to-muted/30 animate-pulse flex items-center justify-center">
      <Globe2 size={48} className="text-muted-foreground/30" />
    </div>
  ),
});

interface DashboardStats {
  totalDeals: number;
  activeDeals: number;
  totalVolume: number;
  completedThisMonth: number;
}

interface DashboardClientProps {
  initialDeals: Deal[];
  stats: DashboardStats;
}

// Mock trust scores for counterparties (in production, this would come from the database)
const getTrustScore = (name: string): { score: number; isVerified: boolean } => {
  // Generate consistent scores based on name hash
  const hash = name.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0);
  const normalizedHash = Math.abs(hash % 100) / 100;
  const score = 2.5 + normalizedHash * 2.5; // Range: 2.5 - 5.0
  const isVerified = score >= 4.0 || name.toLowerCase().includes('shell') || name.toLowerCase().includes('petro');
  return { score: Math.round(score * 10) / 10, isVerified };
};

export default function DashboardClient({ initialDeals, stats }: DashboardClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('outline');
  const [showGlobe, setShowGlobe] = useState(true);

  const filteredDeals = useMemo(() => {
    return initialDeals.filter(deal => {
      const matchesSearch = 
        deal.buyer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.seller_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.commodity_type.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || deal.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [initialDeals, searchQuery, statusFilter]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const statCards = [
    {
      title: 'Total Volume',
      value: formatCurrency(stats.totalVolume),
      change: '+12.5%',
      changeType: 'positive',
      subtitle: 'Trending up this month',
      icon: DollarSign,
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-500',
    },
    {
      title: 'Active Deals',
      value: formatNumber(stats.activeDeals),
      change: '+8%',
      changeType: 'positive',
      subtitle: 'New deals this week',
      icon: Activity,
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-500',
    },
    {
      title: 'Total Deals',
      value: formatNumber(stats.totalDeals),
      change: '+15%',
      changeType: 'positive',
      subtitle: 'Strong performance',
      icon: FileText,
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-500',
    },
    {
      title: 'Completion Rate',
      value: stats.totalDeals > 0 ? `${((stats.completedThisMonth / stats.totalDeals) * 100).toFixed(1)}%` : '0%',
      change: '+4.5%',
      changeType: 'positive',
      subtitle: 'Above target',
      icon: CheckCircle,
      iconBg: 'bg-orange-500/10',
      iconColor: 'text-orange-500',
    },
  ];

  const tabs = [
    { id: 'outline', label: 'All Deals' },
    { id: 'past-performance', label: 'Active', count: stats.activeDeals },
    { id: 'key-personnel', label: 'Completed', count: stats.completedThisMonth },
    { id: 'focus-documents', label: 'Pending' },
  ];

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string; dotColor: string }> = {
      pending: { variant: 'secondary', label: 'Pending', dotColor: 'bg-yellow-500' },
      in_progress: { variant: 'default', label: 'In Progress', dotColor: 'bg-blue-500' },
      completed: { variant: 'outline', label: 'Completed', dotColor: 'bg-green-500' },
    };
    
    const { variant, label, dotColor } = config[status] || { variant: 'secondary', label: status, dotColor: 'bg-gray-500' };
    
    return (
      <Badge variant={variant} className="font-normal gap-1.5">
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
        {label}
      </Badge>
    );
  };

  // Live trading activity mock data
  const liveActivity = [
    { id: 1, type: 'New Deal', commodity: 'Diesel', route: 'Rotterdam → Lagos', time: '2 min ago' },
    { id: 2, type: 'Shipment', commodity: 'Jet Fuel', route: 'Singapore → Mumbai', time: '5 min ago' },
    { id: 3, type: 'Completed', commodity: 'Crude Oil', route: 'Ras Tanura → Qingdao', time: '12 min ago' },
  ];

  return (
    <div className="space-y-6 min-w-0 w-full">
      {/* Hero Section with Globe */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-w-0">
        {/* Globe Section */}
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Globe2 size={18} className="text-primary" />
                Global Trade Network
              </CardTitle>
              <CardDescription>
                Real-time commodity flows and trading hotspots
              </CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowGlobe(!showGlobe)}
              className="text-xs"
            >
              {showGlobe ? 'Minimize' : 'Expand'}
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {showGlobe && (
              <div className="h-[400px]">
                <CommodityGlobe 
                  className="h-full" 
                  onHotspotClick={(hotspot) => {
                    console.log('Selected hotspot:', hotspot);
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Live Activity Feed */}
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Activity size={18} className="text-primary animate-pulse" />
              Live Activity
            </CardTitle>
            <CardDescription>Real-time trading updates</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-3">
            {liveActivity.map((activity, index) => (
              <div 
                key={activity.id}
                className="p-3 rounded-lg bg-muted/50 border border-border/50 space-y-2 animate-slideUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-[10px] font-medium">
                    {activity.type}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">{activity.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Fuel size={14} className="text-primary" />
                  <span className="text-sm font-medium">{activity.commodity}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin size={10} />
                  {activity.route}
                </div>
              </div>
            ))}

            {/* Quick Stats */}
            <div className="pt-3 border-t border-border/50 mt-auto">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-2 rounded-lg bg-primary/5">
                  <p className="text-xl font-bold text-primary">{stats.activeDeals}</p>
                  <p className="text-[10px] text-muted-foreground">Active Now</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-emerald-500/5">
                  <p className="text-xl font-bold text-emerald-500">8</p>
                  <p className="text-[10px] text-muted-foreground">Routes Live</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg ${stat.iconBg} flex items-center justify-center`}>
                  <stat.icon size={20} className={stat.iconColor} />
                </div>
                <span className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded-full ${
                  stat.changeType === 'positive' 
                    ? 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950' 
                    : 'text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950'
                }`}>
                  {stat.changeType === 'positive' ? <ArrowUpRight size={12} className="mr-0.5" /> : <ArrowDownRight size={12} className="mr-0.5" />}
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground tabular-nums mb-1">{stat.value}</p>
              <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart Section */}
      <Card className="min-w-0">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between pb-2 gap-3">
          <div>
            <CardTitle className="text-base font-semibold">Trading Volume</CardTitle>
            <CardDescription>Daily volume over the last 90 days</CardDescription>
          </div>
          <div className="flex items-center gap-1 p-1 bg-muted rounded-lg overflow-x-auto w-full md:w-auto">
            {['Last 90 days', 'Last 30 days', 'Last 7 days'].map((period, i) => (
              <button
                key={period}
                className={`px-2 md:px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  i === 0 
                    ? 'bg-background text-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="pb-4 overflow-x-auto">
          {/* Interactive chart visualization */}
          <div className="h-48 flex items-end gap-px group min-w-[600px]">
            {Array.from({ length: 90 }).map((_, i) => {
              const baseHeight = 30 + Math.sin(i * 0.15) * 25;
              const noise = Math.random() * 20;
              const height = Math.min(95, baseHeight + noise);
              const isHighlight = i > 75;
              return (
                <div
                  key={i}
                  className={`flex-1 rounded-t cursor-pointer transition-all duration-200 
                    ${isHighlight ? 'bg-primary/60 hover:bg-primary' : 'bg-muted-foreground/20 hover:bg-primary/40'}`}
                  style={{ height: `${height}%` }}
                  title={`Day ${i + 1}: ${Math.round(height * 100)}K BBL`}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-3 text-xs text-muted-foreground">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map(month => (
              <span key={month}>{month}</span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Deals Table */}
      <Card className="min-w-0">
        <CardHeader className="pb-3">
          {/* Tabs */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-1 overflow-x-auto pb-2 md:pb-0 -mx-2 px-2 md:mx-0 md:px-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 md:px-4 py-2 text-xs md:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className={`ml-1.5 px-1.5 py-0.5 text-xs rounded-full ${
                      activeTab === tab.id ? 'bg-primary-foreground/20' : 'bg-muted'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:flex-initial">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search deals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-8 w-full md:w-48 text-sm"
                />
              </div>
              <Button asChild size="sm" className="h-8 text-xs whitespace-nowrap">
                <Link href="/dashboard/deals/new">
                  <Plus size={14} className="mr-1.5" />
                  <span className="hidden sm:inline">New Deal</span>
                  <span className="sm:hidden">New</span>
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <div className="min-w-[800px]">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                <TableHead className="w-8 pl-4">
                  <input type="checkbox" className="rounded border-border" />
                </TableHead>
                <TableHead className="font-medium">Commodity</TableHead>
                <TableHead className="font-medium">Buyer</TableHead>
                <TableHead className="font-medium">Status</TableHead>
                <TableHead className="font-medium text-right">Volume</TableHead>
                <TableHead className="font-medium text-right">Value</TableHead>
                <TableHead className="font-medium">Seller</TableHead>
                <TableHead className="w-8"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Ship size={32} className="mb-2 opacity-30" />
                      <p className="text-sm font-medium">No deals found</p>
                      <p className="text-xs">Create your first deal to get started</p>
                      <Button asChild size="sm" className="mt-3">
                        <Link href="/dashboard/deals/new">
                          <Plus size={14} className="mr-1.5" />
                          Create Deal
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredDeals.map((deal, index) => {
                  const refNumber = (deal as any).reference_number || `STN-2024-${String(index + 1).padStart(6, '0')}`;
                  const dealStatus = deal.status as DealStatus;
                  
                  return (
                    <TableRow key={deal.id} className="group">
                      <TableCell className="pl-4">
                        <input type="checkbox" className="rounded border-border" />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Fuel size={14} className="text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{deal.commodity_type}</p>
                            <p className="text-xs text-muted-foreground font-mono">{refNumber}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <span className="font-medium">{deal.buyer_name}</span>
                          <div className="flex items-center gap-1">
                            <TrustIndicator 
                              score={getTrustScore(deal.buyer_name).score}
                              isVerified={getTrustScore(deal.buyer_name).isVerified}
                              size="sm"
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(deal.status)}</TableCell>
                      <TableCell className="text-right tabular-nums font-medium">
                        {Number(deal.volume).toLocaleString()} BBL
                      </TableCell>
                      <TableCell className="text-right tabular-nums font-semibold text-primary">
                        {formatCurrency(Number(deal.total_value))}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <span className="text-muted-foreground">{deal.seller_name}</span>
                          <div className="flex items-center gap-1">
                            <TrustIndicator 
                              score={getTrustScore(deal.seller_name).score}
                              isVerified={getTrustScore(deal.seller_name).isVerified}
                              size="sm"
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link href={`/dashboard/deals/${deal.id}`}>
                            <Eye size={14} />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
