'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Users,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
  Filter,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
// Use lazy-loaded charts
import {
  AreaChartComponent,
  BarChartComponent,
  LineChartComponent,
  PieChartComponent,
  RadialProgress,
  Sparkline,
  ComposedChartComponent,
  CHART_COLORS,
} from '@/components/LazyCharts';

// Sample data
const volumeData = [
  { name: 'Jan', volume: 45000, revenue: 32000000, deals: 12 },
  { name: 'Feb', volume: 52000, revenue: 38000000, deals: 15 },
  { name: 'Mar', volume: 48000, revenue: 35000000, deals: 14 },
  { name: 'Apr', volume: 61000, revenue: 44000000, deals: 18 },
  { name: 'May', volume: 55000, revenue: 40000000, deals: 16 },
  { name: 'Jun', volume: 67000, revenue: 48000000, deals: 20 },
  { name: 'Jul', volume: 72000, revenue: 52000000, deals: 22 },
  { name: 'Aug', volume: 68000, revenue: 49000000, deals: 21 },
  { name: 'Sep', volume: 75000, revenue: 54000000, deals: 24 },
  { name: 'Oct', volume: 82000, revenue: 59000000, deals: 26 },
  { name: 'Nov', volume: 78000, revenue: 56000000, deals: 25 },
  { name: 'Dec', volume: 85000, revenue: 61000000, deals: 28 },
];

const commodityDistribution = [
  { name: 'ULSD', value: 35, color: CHART_COLORS.info },
  { name: 'Jet Fuel', value: 25, color: CHART_COLORS.purple },
  { name: 'Gasoline', value: 20, color: CHART_COLORS.warning },
  { name: 'Fuel Oil', value: 12, color: CHART_COLORS.danger },
  { name: 'Crude', value: 8, color: CHART_COLORS.success },
];

const regionData = [
  { name: 'ARA', volume: 280000, revenue: 210 },
  { name: 'Singapore', volume: 195000, revenue: 145 },
  { name: 'US Gulf', volume: 165000, revenue: 125 },
  { name: 'Fujairah', volume: 120000, revenue: 90 },
  { name: 'West Africa', volume: 85000, revenue: 65 },
  { name: 'Asia Pacific', volume: 72000, revenue: 55 },
];

const weeklyTrends = [
  { day: 'Mon', current: 12500, previous: 11000 },
  { day: 'Tue', current: 14200, previous: 12500 },
  { day: 'Wed', current: 11800, previous: 13200 },
  { day: 'Thu', current: 15600, previous: 14100 },
  { day: 'Fri', current: 18200, previous: 15800 },
  { day: 'Sat', current: 8500, previous: 7200 },
  { day: 'Sun', current: 6200, previous: 5100 },
];

const performanceMetrics = [
  { name: 'Deal Completion', value: 94, target: 90, color: CHART_COLORS.success },
  { name: 'On-Time Delivery', value: 88, target: 85, color: CHART_COLORS.info },
  { name: 'Customer Satisfaction', value: 92, target: 90, color: CHART_COLORS.purple },
  { name: 'Repeat Business', value: 76, target: 70, color: CHART_COLORS.warning },
];

const sparklineData = [12, 15, 18, 14, 22, 19, 24, 28, 25, 32, 29, 35, 38];

// Stat Card Component
function StatCard({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon,
  sparkline,
}: {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: any;
  sparkline?: number[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="relative overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{title}</p>
              <p className="text-2xl font-bold text-foreground">{value}</p>
              <div className="flex items-center gap-1 mt-1">
                {changeType === 'positive' ? (
                  <ArrowUpRight size={14} className="text-emerald-500" />
                ) : (
                  <ArrowDownRight size={14} className="text-red-500" />
                )}
                <span className={`text-xs font-medium ${
                  changeType === 'positive' ? 'text-emerald-500' : 'text-red-500'
                }`}>
                  {change}
                </span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon size={20} className="text-primary" />
            </div>
          </div>
          
          {sparkline && (
            <div className="mt-4 -mx-2">
              <Sparkline data={sparkline} height={40} color={changeType === 'positive' ? CHART_COLORS.success : CHART_COLORS.danger} />
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = React.useState('12m');
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  const formatVolume = (value: number) => {
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K MT`;
    return `${value} MT`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Trading performance and market insights
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 h-9">
              <Calendar size={14} className="mr-2 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" className="h-9">
            <Download size={14} className="mr-2" />
            Export
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw size={14} className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value="$61.2M"
          change="+12.5%"
          changeType="positive"
          icon={DollarSign}
          sparkline={sparklineData}
        />
        <StatCard
          title="Trading Volume"
          value="847K MT"
          change="+8.3%"
          changeType="positive"
          icon={Package}
          sparkline={sparklineData.map(v => v * 1.2)}
        />
        <StatCard
          title="Active Deals"
          value="156"
          change="+23"
          changeType="positive"
          icon={TrendingUp}
        />
        <StatCard
          title="Counterparties"
          value="89"
          change="+7"
          changeType="positive"
          icon={Users}
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Volume & Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Volume & Revenue</CardTitle>
                <CardDescription>Monthly trading performance</CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span className="text-xs text-muted-foreground">Volume (MT)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-xs text-muted-foreground">Revenue ($M)</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ComposedChartComponent
              data={volumeData}
              bars={[{ key: 'volume', color: CHART_COLORS.info, name: 'Volume' }]}
              lines={[{ key: 'revenue', color: CHART_COLORS.success, name: 'Revenue' }]}
              height={320}
              formatter={(value, name) => 
                name === 'Revenue' ? formatCurrency(value) : formatVolume(value)
              }
            />
          </CardContent>
        </Card>

        {/* Commodity Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Commodity Mix</CardTitle>
            <CardDescription>Distribution by product type</CardDescription>
          </CardHeader>
          <CardContent>
            <PieChartComponent
              data={commodityDistribution}
              height={260}
              innerRadius={50}
              outerRadius={90}
              showLegend={false}
            />
            <div className="mt-4 space-y-2">
              {commodityDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regional Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Regional Performance</CardTitle>
            <CardDescription>Volume by trading region</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChartComponent
              data={regionData}
              dataKeys={[
                { key: 'volume', color: CHART_COLORS.info, name: 'Volume (MT)' },
              ]}
              height={280}
              horizontal
              formatter={(value) => formatVolume(value)}
            />
          </CardContent>
        </Card>

        {/* Weekly Comparison */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Weekly Trend</CardTitle>
                <CardDescription>This week vs last week</CardDescription>
              </div>
              <Badge variant="secondary" className="text-[10px]">
                +18.5% avg
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <LineChartComponent
              data={weeklyTrends}
              dataKeys={[
                { key: 'current', color: CHART_COLORS.info, name: 'This Week' },
                { key: 'previous', color: CHART_COLORS.purple, name: 'Last Week', dashed: true },
              ]}
              xAxisKey="day"
              height={280}
              formatter={(value) => formatVolume(value)}
            />
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Performance Metrics</CardTitle>
          <CardDescription>Key performance indicators vs targets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {performanceMetrics.map((metric) => (
              <div key={metric.name} className="flex flex-col items-center text-center">
                <RadialProgress
                  value={metric.value}
                  maxValue={100}
                  color={metric.color}
                  size={100}
                  strokeWidth={10}
                  label={`${metric.value}%`}
                />
                <p className="text-sm font-medium text-foreground mt-3">{metric.name}</p>
                <p className="text-xs text-muted-foreground">
                  Target: {metric.target}%
                  {metric.value >= metric.target ? (
                    <span className="text-emerald-500 ml-1">✓</span>
                  ) : (
                    <span className="text-amber-500 ml-1">⚠</span>
                  )}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Deal Activity Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Deal Activity</CardTitle>
              <CardDescription>Monthly deal count and success rate</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <AreaChartComponent
            data={volumeData}
            dataKeys={[
              { key: 'deals', color: CHART_COLORS.purple, name: 'Deals Closed' },
            ]}
            height={200}
            gradientFill
          />
        </CardContent>
      </Card>
    </div>
  );
}
