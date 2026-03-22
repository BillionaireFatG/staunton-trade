'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  FileText,
  Globe2,
  MapPin,
  Fuel,
  DollarSign,
  Package,
  TrendingUp,
  Building2
} from 'lucide-react'
import { getAnalytics, getDeals } from '@/lib/data'
import dynamic from 'next/dynamic'
import {
  BarChartComponent,
  PieChartComponent,
  CHART_COLORS,
} from '@/components/LazyCharts'

const CommodityGlobe = dynamic(() => import('@/components/CommodityGlobe'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] rounded-xl bg-gradient-to-br from-muted to-muted/30 animate-pulse flex items-center justify-center">
      <Globe2 size={48} className="text-muted-foreground/30" />
    </div>
  ),
})

export default function CongoOverviewPage() {
  const analytics = getAnalytics('congo')
  const congoDealsData = getDeals('congo') || []
  const [showGlobe, setShowGlobe] = useState(true)

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(2)}B`;
    }
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string; dotColor: string }> = {
      pending: { variant: 'secondary', label: 'Pending', dotColor: 'bg-yellow-500' },
      active: { variant: 'default', label: 'Active', dotColor: 'bg-blue-500' },
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

  const statCards = [
    {
      title: 'Total Volume',
      value: analytics.statistics.totalVolume,
      change: analytics.statistics.growthRate,
      changeType: 'positive' as const,
      subtitle: 'Minerals & commodities',
      icon: Package,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      title: 'Active Deals',
      value: formatNumber(analytics.statistics.activeDeals),
      change: '+18%',
      changeType: 'positive' as const,
      subtitle: 'Mining operations',
      icon: Activity,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      title: 'Total Value',
      value: analytics.statistics.totalValue,
      change: analytics.statistics.growthRate,
      changeType: 'positive' as const,
      subtitle: 'NCE-ECS platform',
      icon: DollarSign,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      title: 'Completed Deals',
      value: formatNumber(analytics.statistics.completedDeals),
      change: '+15%',
      changeType: 'positive' as const,
      subtitle: 'CEEC certified',
      icon: CheckCircle,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
    },
  ];

  const liveActivity = [
    { id: 1, type: 'CEEC Certified', commodity: 'Copper', route: 'Lubumbashi → Matadi', time: '2 min ago' },
    { id: 2, type: 'Shipment', commodity: 'Cobalt', route: 'Matadi → Antwerp', time: '5 min ago' },
    { id: 3, type: 'New Deal', commodity: 'Coltan', route: 'Goma → Singapore', time: '12 min ago' },
  ];

  const commodityChartData = analytics.topCommodities.map((c, idx) => ({
    name: c.name,
    value: c.percentage,
    color: [CHART_COLORS.primary, CHART_COLORS.info, CHART_COLORS.warning, CHART_COLORS.success, CHART_COLORS.purple, CHART_COLORS.danger][idx % 6]
  }));

  const regionChartData = analytics.volumeByRegion.slice(0, 5).map(r => ({
    name: r.region.split('(')[0].trim(),
    volume: r.volume,
    value: r.value / 1000000
  }));

  return (
    <div className="space-y-6">
      {/* Hero Section with Globe */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Globe Section */}
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Globe2 size={18} className="text-primary" />
                DRC Commodity Network
              </CardTitle>
              <CardDescription>
                National mineral trade routes and export corridors
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
            <CardDescription>Real-time platform updates</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-3">
            {liveActivity.map((activity, index) => (
              <div 
                key={activity.id}
                className="p-3 rounded-lg bg-muted/50 border border-border/50 space-y-2"
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
                  <p className="text-xl font-bold text-primary">{analytics.statistics.activeDeals}</p>
                  <p className="text-[10px] text-muted-foreground">Active Now</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-primary/5">
                  <p className="text-xl font-bold text-primary">12</p>
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Commodity Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Commodity Distribution</CardTitle>
            <CardDescription>By trade value (%)</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[380px] flex items-center justify-center">
              <PieChartComponent
                data={commodityChartData}
                height={380}
                innerRadius={70}
                outerRadius={130}
                showLegend={false}
              />
            </div>
          </CardContent>
        </Card>

        {/* Regional Volume */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Volume by Region</CardTitle>
            <CardDescription>Top producing regions (MT)</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[380px]">
              <BarChartComponent
                data={regionChartData}
                xAxisKey="name"
                dataKeys={[{ key: 'volume', name: 'Volume (MT)', color: CHART_COLORS.primary }]}
                height={380}
                showLegend={false}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ministry Integration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Ministry Integration Status</span>
            <Badge variant="outline">{(analytics.statistics as any).ministryIntegration || '6 ministries connected'}</Badge>
          </CardTitle>
          <CardDescription>Connected government systems and regulatory bodies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {((analytics as any).ministryBreakdown || []).map((ministry: any, idx: number) => (
              <div key={idx} className="p-4 rounded-lg border border-border bg-muted/30">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Building2 size={20} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground mb-1 truncate">{ministry.ministry}</p>
                    <p className="text-xs text-muted-foreground mb-2">{ministry.percentage}% of trade</p>
                    <div className="flex flex-wrap gap-1">
                      {ministry.commodities.slice(0, 2).map((c: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-[10px] px-1.5 py-0">
                          {c}
                        </Badge>
                      ))}
                      {ministry.commodities.length > 2 && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          +{ministry.commodities.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Deals Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Deals</CardTitle>
            <CardDescription>Latest commodity transactions on NCE-ECS</CardDescription>
          </div>
          <Link href="/dashboard/congo/market">
            <Button variant="outline" size="sm">
              View All
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Commodity</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price/Unit</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Certification</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {congoDealsData.slice(0, 5).map((deal: any) => (
                  <TableRow key={deal.id} className="group">
                    <TableCell className="font-medium">
                      {deal.commodity.charAt(0).toUpperCase() + deal.commodity.slice(1)}
                    </TableCell>
                    <TableCell>
                      {deal.quantity.toLocaleString()} {deal.quantity_unit}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(deal.price_per_unit)}/{deal.quantity_unit}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(deal.price_per_unit * deal.quantity)}
                    </TableCell>
                    <TableCell>{getStatusBadge(deal.status)}</TableCell>
                    <TableCell className="max-w-[300px]">
                      <p className="text-xs text-muted-foreground truncate">
                        {deal.notes}
                      </p>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Platform Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Platform Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-foreground mb-2">{(analytics.statistics as any).platformCoverage || 'NCE-ECS Phase 1 - 65% national coverage'}</p>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '65%' }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Export Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-foreground mb-2">{(analytics.statistics as any).exportCompliance || '94% CEEC E-trace verified'}</p>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '94%' }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Deal Size</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-foreground mb-2">{analytics.statistics.averageDealSize}</p>
            <p className="text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
