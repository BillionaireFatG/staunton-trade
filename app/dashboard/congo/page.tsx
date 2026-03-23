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
  DollarSign,
  Package,
  TrendingUp,
  Building2,
  Zap,
  Shield,
  Truck,
  BarChart3,
  Users,
  AlertCircle,
  ChevronRight,
  Gem,
  Wheat,
  Fuel,
  Trees,
  Factory,
  Ship,
  Layers,
  Target,
} from 'lucide-react'
import { getAnalytics, getDeals } from '@/lib/data'
import dynamic from 'next/dynamic'
import {
  BarChartComponent,
  PieChartComponent,
  AreaChartComponent,
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

// ── Ministry "Power Blocks" ──────────────────────────────────────────────────
const MINISTRY_BLOCKS = [
  {
    id: 'mines',
    label: 'Mines',
    icon: Gem,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    ministries: ['Ministry of Mines'],
    commodities: ['Copper', 'Cobalt', 'Coltan', 'Gold', 'Diamonds', 'Lithium'],
    pct: 82,
    value: '$437M',
    status: 'connected',
  },
  {
    id: 'agri',
    label: 'Agriculture & Fisheries',
    icon: Wheat,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    ministries: ['Ministry of Agriculture', 'Ministry of Fisheries'],
    commodities: ['Coffee', 'Cocoa', 'Palm Oil', 'Rubber', 'Cassava'],
    pct: 8,
    value: '$42M',
    status: 'connected',
  },
  {
    id: 'energy',
    label: 'Hydrocarbons & Energy',
    icon: Fuel,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    ministries: ['Ministry of Hydrocarbons', 'Ministry of Energy'],
    commodities: ['Crude Oil', 'Natural Gas', 'Electricity'],
    pct: 4,
    value: '$21M',
    status: 'partial',
  },
  {
    id: 'forest',
    label: 'Forestry & Environment',
    icon: Trees,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    ministries: ['Ministry of Environment'],
    commodities: ['Timber', 'Carbon Credits', 'Rubber'],
    pct: 6,
    value: '$32M',
    status: 'connected',
  },
  {
    id: 'industry',
    label: 'Industrial Materials',
    icon: Factory,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    ministries: ['Ministry of Industry'],
    commodities: ['Cement', 'Limestone', 'Phosphate', 'Salt'],
    pct: 2,
    value: '$11M',
    status: 'pending',
  },
  {
    id: 'finance',
    label: 'Finance & Markets',
    icon: DollarSign,
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    ministries: ['Ministry of Finance', 'Banque Centrale du Congo'],
    commodities: ['Carbon Credits', 'Freight Derivatives', 'FX'],
    pct: 3,
    value: '$16M',
    status: 'partial',
  },
]

// ── NCE-ECS Phase timeline ───────────────────────────────────────────────────
const PHASES = [
  {
    phase: 'Phase 1',
    label: 'MVP / Pilot',
    budget: '$5M',
    year: 'Yr 1',
    status: 'active',
    color: 'bg-emerald-500',
    desc: 'Core platform + copper/cobalt corridor live',
  },
  {
    phase: 'Phase 2',
    label: 'Full Technical Build',
    budget: '$120M',
    year: 'Yr 2–4',
    status: 'upcoming',
    color: 'bg-blue-500',
    desc: 'Full stack Layer 1–3, AI pricing, national rollout',
  },
  {
    phase: 'Phase 2b',
    label: 'Ops Buffer',
    budget: '$50M',
    year: 'Yr 2–8',
    status: 'upcoming',
    color: 'bg-indigo-400',
    desc: '$16M/yr ops: staffing, tech refresh, market dev',
  },
  {
    phase: 'Phase 3',
    label: 'Flagship Building',
    budget: '$80M',
    year: 'Yr 3–5',
    status: 'upcoming',
    color: 'bg-amber-500',
    desc: 'Govt-funded 10–20k m² exchange in Gombe district',
  },
]

// ── Live activity feed ───────────────────────────────────────────────────────
const LIVE_ACTIVITY = [
  { id: 1, type: 'CEEC Certified',  commodity: 'Copper',   route: 'Lubumbashi → Matadi',   time: '2m ago',  amount: '$2.4M'  },
  { id: 2, type: 'Export Cleared',  commodity: 'Cobalt',   route: 'Matadi → Antwerp',       time: '5m ago',  amount: '$1.8M'  },
  { id: 3, type: 'New Deal',        commodity: 'Coltan',   route: 'Goma → Singapore',       time: '12m ago', amount: '$780K'  },
  { id: 4, type: 'ITSCI Tagged',    commodity: 'Gold',     route: 'Bukavu → Dubai',         time: '18m ago', amount: '$3.1M'  },
  { id: 5, type: 'KP Certified',    commodity: 'Diamonds', route: 'Mbuji-Mayi → Antwerp',   time: '31m ago', amount: '$5.2M'  },
]

export default function CongoOverviewPage() {
  const analytics = getAnalytics('congo')
  const congoDealsData = getDeals('congo') || []
  const [showGlobe, setShowGlobe] = useState(true)
  const [activeMinistry, setActiveMinistry] = useState<string | null>(null)

  const formatCurrency = (value: number) => {
    if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`
    if (value >= 1_000_000)     return `$${(value / 1_000_000).toFixed(1)}M`
    if (value >= 1_000)         return `$${(value / 1_000).toFixed(0)}K`
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value)
  }

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; cls: string }> = {
      pending:   { label: 'Pending',   cls: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20' },
      active:    { label: 'Active',    cls: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
      completed: { label: 'Completed', cls: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
    }
    const c = config[status] ?? { label: status, cls: 'bg-muted text-muted-foreground border-border' }
    return (
      <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${c.cls}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
        {c.label}
      </span>
    )
  }

  const statCards = [
    {
      title: 'Total Volume',
      value: analytics.statistics.totalVolume,
      change: analytics.statistics.growthRate,
      up: true,
      subtitle: 'Minerals & commodities',
      icon: Package,
      accent: 'text-blue-500',
      accentBg: 'bg-blue-500/10',
    },
    {
      title: 'Active Deals',
      value: String(analytics.statistics.activeDeals),
      change: '+18%',
      up: true,
      subtitle: 'Mining operations',
      icon: Activity,
      accent: 'text-purple-500',
      accentBg: 'bg-purple-500/10',
    },
    {
      title: 'Platform Value',
      value: analytics.statistics.totalValue,
      change: analytics.statistics.growthRate,
      up: true,
      subtitle: 'NCE-ECS total value',
      icon: DollarSign,
      accent: 'text-emerald-500',
      accentBg: 'bg-emerald-500/10',
    },
    {
      title: 'Completed Deals',
      value: String(analytics.statistics.completedDeals),
      change: '+15%',
      up: true,
      subtitle: 'CEEC certified',
      icon: CheckCircle,
      accent: 'text-amber-500',
      accentBg: 'bg-amber-500/10',
    },
  ]

  const commodityChartData = analytics.topCommodities.map((c, idx) => ({
    name: c.name,
    value: c.percentage,
    color: [CHART_COLORS.primary, CHART_COLORS.info, CHART_COLORS.warning, CHART_COLORS.success, CHART_COLORS.purple, CHART_COLORS.danger][idx % 6],
  }))

  const regionChartData = analytics.volumeByRegion.slice(0, 5).map(r => ({
    name: r.region.split('(')[0].trim(),
    volume: r.volume,
    value: r.value / 1_000_000,
  }))

  const monthlyAreaData = analytics.monthlyTrends.map(m => ({
    name: m.month,
    value: m.value / 1_000_000,
  }))

  return (
    <div className="space-y-6">

      {/* ── Hero Banner ──────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-gradient-to-r from-blue-600/8 via-transparent to-red-600/5 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 via-yellow-500 to-red-600 flex items-center justify-center shadow-lg flex-shrink-0">
            <Globe2 size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground leading-tight">DRC National Commodity Exchange</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Export Clearing System (NCE-ECS) — Phase 1 MVP Active
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Platform Live
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/60 border border-border text-xs font-medium text-muted-foreground">
            <Shield size={12} className="text-blue-500" />
            6 Ministries
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/60 border border-border text-xs font-medium text-muted-foreground">
            <Zap size={12} className="text-amber-500" />
            $255M Program
          </div>
          <Link href="/dashboard/congo/market">
            <Button size="sm" className="h-8 text-xs gap-1.5">
              View Markets <ArrowUpRight size={13} />
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Globe + Live Feed ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Globe */}
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Globe2 size={16} className="text-primary" />
                DRC Commodity Network
              </CardTitle>
              <CardDescription>National mineral trade routes &amp; export corridors</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowGlobe(!showGlobe)} className="text-xs h-7">
              {showGlobe ? 'Minimize' : 'Expand'}
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {showGlobe && (
              <div className="h-[380px]">
                <CommodityGlobe
                  className="h-full"
                  onHotspotClick={(hotspot) => console.log('hotspot:', hotspot)}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Live Activity Feed */}
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Activity size={16} className="text-primary animate-pulse" />
              Live Activity
            </CardTitle>
            <CardDescription>Real-time NCE-ECS transactions</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-2 overflow-y-auto">
            {LIVE_ACTIVITY.map((a) => (
              <div key={a.id} className="flex items-start gap-3 p-2.5 rounded-lg bg-muted/30 border border-border/40 hover:border-border transition-colors">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="text-[11px] font-semibold text-muted-foreground">{a.type}</span>
                    <span className="text-[10px] text-muted-foreground/60 flex-shrink-0">{a.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">{a.commodity}</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{a.amount}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5 text-[10px] text-muted-foreground/70">
                    <MapPin size={8} />
                    <span className="truncate">{a.route}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
          <div className="px-4 pb-4 pt-2 border-t border-border/50">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center p-2 rounded-lg bg-primary/5 border border-primary/10">
                <p className="text-lg font-bold text-primary">{analytics.statistics.activeDeals}</p>
                <p className="text-[10px] text-muted-foreground">Active Now</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-primary/5 border border-primary/10">
                <p className="text-lg font-bold text-primary">12</p>
                <p className="text-[10px] text-muted-foreground">Routes Live</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* ── KPI Stats ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <Card key={i} className="relative overflow-hidden group hover:shadow-md transition-all duration-200">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-lg ${stat.accentBg} flex items-center justify-center`}>
                  <stat.icon size={18} className={stat.accent} />
                </div>
                <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  stat.up
                    ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                    : 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400'
                }`}>
                  {stat.up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground tabular-nums">{stat.value}</p>
              <p className="text-sm font-medium text-muted-foreground mt-0.5">{stat.title}</p>
              <p className="text-[11px] text-muted-foreground/70 mt-0.5">{stat.subtitle}</p>
            </CardContent>
            {/* Decorative gradient */}
            <div className={`absolute bottom-0 right-0 w-24 h-24 rounded-tl-full opacity-5 ${stat.accentBg} pointer-events-none`} />
          </Card>
        ))}
      </div>

      {/* ── Charts Row ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Value Trend */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Monthly Platform Value</CardTitle>
                <CardDescription>USD millions processed through NCE-ECS</CardDescription>
              </div>
              <Badge variant="secondary" className="text-[10px]">+22.8% YoY</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <AreaChartComponent
              data={monthlyAreaData}
              dataKeys={[{ key: 'value', color: CHART_COLORS.primary, name: 'Value ($M)' }]}
              height={220}
              gradientFill
            />
          </CardContent>
        </Card>

        {/* Commodity Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Commodity Mix</CardTitle>
            <CardDescription>By trade value share</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[160px] flex items-center justify-center">
              <PieChartComponent
                data={commodityChartData}
                height={160}
                innerRadius={45}
                outerRadius={70}
                showLegend={false}
              />
            </div>
            <div className="space-y-1.5 mt-2">
              {commodityChartData.map((c) => (
                <div key={c.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                    <span className="text-xs text-muted-foreground">{c.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-foreground">{c.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Ministry Power Blocks ────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building2 size={18} className="text-primary" />
                Ministry Integration — 6 Power Blocks
              </CardTitle>
              <CardDescription>
                Connected government systems across 100% of DRC commodity universe
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[11px] border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5">
                4 Online
              </Badge>
              <Badge variant="outline" className="text-[11px] border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/5">
                2 Partial
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {MINISTRY_BLOCKS.map((block) => {
              const Icon = block.icon
              const isSelected = activeMinistry === block.id
              return (
                <button
                  key={block.id}
                  onClick={() => setActiveMinistry(isSelected ? null : block.id)}
                  className={`text-left p-4 rounded-xl border transition-all duration-200 hover:shadow-sm ${
                    isSelected
                      ? `${block.border} ${block.bg} shadow-sm`
                      : 'border-border/60 bg-muted/20 hover:border-border hover:bg-muted/40'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-9 h-9 rounded-lg ${block.bg} ${block.border} border flex items-center justify-center flex-shrink-0`}>
                      <Icon size={17} className={block.color} />
                    </div>
                    <div className="flex items-center gap-1">
                      {block.status === 'connected' ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      ) : block.status === 'partial' ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                      )}
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-foreground mb-1">{block.label}</p>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-bold ${block.color}`}>{block.value}</span>
                    <span className="text-[11px] text-muted-foreground">{block.pct}% of trade</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {block.commodities.slice(0, 3).map((c) => (
                      <span key={c} className="text-[10px] px-1.5 py-0.5 rounded bg-background/60 border border-border/40 text-muted-foreground">
                        {c}
                      </span>
                    ))}
                    {block.commodities.length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-background/60 border border-border/40 text-muted-foreground">
                        +{block.commodities.length - 3}
                      </span>
                    )}
                  </div>
                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-border/50 space-y-1">
                      {block.ministries.map((m) => (
                        <div key={m} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <Building2 size={10} />
                          {m}
                        </div>
                      ))}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* ── NCE-ECS Phase Timeline ───────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target size={18} className="text-primary" />
            NCE-ECS Deployment Roadmap
          </CardTitle>
          <CardDescription>$255M full program — private + government PPP structure</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PHASES.map((phase, i) => (
              <div
                key={phase.phase}
                className={`relative p-4 rounded-xl border ${
                  phase.status === 'active'
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : 'border-border/60 bg-muted/20'
                }`}
              >
                {/* Timeline connector */}
                {i < PHASES.length - 1 && (
                  <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10">
                    <ChevronRight size={16} className="text-muted-foreground/30" />
                  </div>
                )}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] h-5 ${
                        phase.status === 'active'
                          ? 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
                          : 'border-border text-muted-foreground'
                      }`}
                    >
                      {phase.phase}
                    </Badge>
                  </div>
                  {phase.status === 'active' ? (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      LIVE
                    </span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground/50 font-medium">{phase.year}</span>
                  )}
                </div>
                <p className="text-sm font-bold text-foreground mb-1">{phase.label}</p>
                <p className={`text-xl font-bold mb-2 ${phase.status === 'active' ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`}>
                  {phase.budget}
                </p>
                <div className={`h-1 rounded-full mb-2 ${phase.color} ${phase.status !== 'active' ? 'opacity-20' : ''}`} />
                <p className="text-[11px] text-muted-foreground leading-snug">{phase.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-border/50 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-6 text-sm">
              <div>
                <span className="text-muted-foreground">Private Investment: </span>
                <span className="font-bold text-foreground">$175M</span>
              </div>
              <div>
                <span className="text-muted-foreground">Government Contribution: </span>
                <span className="font-bold text-foreground">$80M</span>
              </div>
              <div>
                <span className="text-muted-foreground">Total Program: </span>
                <span className="font-bold text-primary">$255M</span>
              </div>
            </div>
            <Badge variant="outline" className="text-[11px]">PPP Structure</Badge>
          </div>
        </CardContent>
      </Card>

      {/* ── Regional Volume + Compliance Row ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regional Volume */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Volume by Region</CardTitle>
            <CardDescription>Top producing regions (metric tonnes)</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <BarChartComponent
              data={regionChartData}
              xAxisKey="name"
              dataKeys={[{ key: 'volume', name: 'Volume (MT)', color: CHART_COLORS.primary }]}
              height={250}
              showLegend={false}
            />
          </CardContent>
        </Card>

        {/* Compliance + Platform Metrics */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Platform Metrics</CardTitle>
            <CardDescription>NCE-ECS key performance indicators</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 space-y-4">
            {(analytics.performanceMetrics ?? []).map((m) => (
              <div key={m.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-foreground">{m.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground tabular-nums">{m.value}%</span>
                    {m.value >= m.target ? (
                      <CheckCircle size={14} className="text-emerald-500" />
                    ) : (
                      <AlertCircle size={14} className="text-amber-500" />
                    )}
                  </div>
                </div>
                <div className="relative h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all duration-700"
                    style={{ width: `${m.value}%` }}
                  />
                  {/* Target marker */}
                  <div
                    className="absolute inset-y-0 w-0.5 bg-muted-foreground/40"
                    style={{ left: `${m.target}%` }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">Target: {m.target}%</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ── Recent Deals Table ───────────────────────────────────────────────── */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Deals</CardTitle>
            <CardDescription>Latest commodity transactions on NCE-ECS</CardDescription>
          </div>
          <Link href="/dashboard/congo/market">
            <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs">
              View All <ArrowUpRight size={13} />
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
                  <TableHead>Price / Unit</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Certification</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {congoDealsData.slice(0, 6).map((deal: any) => (
                  <TableRow key={deal.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-semibold">
                      {deal.commodity_type.charAt(0).toUpperCase() + deal.commodity_type.slice(1)}
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {deal.volume.toLocaleString()} {deal.volume_unit}
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {formatCurrency(deal.price_per_unit)}/{deal.volume_unit}
                    </TableCell>
                    <TableCell className="font-bold tabular-nums">
                      {formatCurrency(deal.total_value)}
                    </TableCell>
                    <TableCell>{getStatusBadge(deal.status)}</TableCell>
                    <TableCell className="max-w-[220px]">
                      <p className="text-xs text-muted-foreground truncate">{deal.notes}</p>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
