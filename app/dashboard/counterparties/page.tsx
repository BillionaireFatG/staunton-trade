'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Filter,
  MoreHorizontal,
  MessageSquare,
  FileText,
  Ban,
  Star,
  ArrowUpDown,
  Building2,
  User,
  Globe,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TrustScoreCard, TrustBadge, TrustIndicator, StarRating, VerifiedBadge, getTrustLevel, TRUST_LEVELS } from '@/components/TrustScore';

// Sample counterparty data
const SAMPLE_COUNTERPARTIES = [
  {
    id: '1',
    name: 'Petrobras International',
    type: 'Corporate',
    trustScore: 4.9,
    isVerified: true,
    totalDeals: 156,
    successRate: 99.4,
    memberSince: '2019',
    location: 'Rio de Janeiro, Brazil',
    industry: 'Oil & Gas',
    email: 'trade@petrobras.com',
    phone: '+55 21 3224-4477',
    recentTrend: 'up' as const,
    badges: ['Top Trader 2024', 'Fast Payer', '100+ Deals'],
    lastActive: '2 hours ago',
  },
  {
    id: '2',
    name: 'Shell Trading',
    type: 'Corporate',
    trustScore: 4.8,
    isVerified: true,
    totalDeals: 243,
    successRate: 98.8,
    memberSince: '2018',
    location: 'The Hague, Netherlands',
    industry: 'Energy Trading',
    email: 'trading@shell.com',
    phone: '+31 70 377 9111',
    recentTrend: 'stable' as const,
    badges: ['Elite Trader', 'Premium Partner'],
    lastActive: '5 mins ago',
  },
  {
    id: '3',
    name: 'Gulf Energy Partners',
    type: 'Corporate',
    trustScore: 4.2,
    isVerified: true,
    totalDeals: 67,
    successRate: 97.0,
    memberSince: '2021',
    location: 'Dubai, UAE',
    industry: 'Fuel Distribution',
    email: 'info@gulfenergy.ae',
    phone: '+971 4 555 1234',
    recentTrend: 'up' as const,
    badges: ['Fast Growing'],
    lastActive: '1 day ago',
  },
  {
    id: '4',
    name: 'Commodity Traders Ltd',
    type: 'Corporate',
    trustScore: 3.5,
    isVerified: false,
    totalDeals: 23,
    successRate: 91.3,
    memberSince: '2023',
    location: 'Singapore',
    industry: 'Commodities',
    email: 'contact@commtraders.sg',
    phone: '+65 6789 1234',
    recentTrend: 'down' as const,
    badges: [],
    lastActive: '3 days ago',
  },
  {
    id: '5',
    name: 'Lagos Petroleum Co',
    type: 'Corporate',
    trustScore: 2.8,
    isVerified: false,
    hasWarning: true,
    totalDeals: 8,
    successRate: 75.0,
    memberSince: '2024',
    location: 'Lagos, Nigeria',
    industry: 'Fuel Import',
    email: 'trade@lagospetro.ng',
    phone: '+234 1 234 5678',
    recentTrend: 'down' as const,
    badges: [],
    lastActive: '1 week ago',
  },
  {
    id: '6',
    name: 'New Trade Corp',
    type: 'Corporate',
    trustScore: 0,
    isVerified: false,
    totalDeals: 0,
    successRate: 0,
    memberSince: '2024',
    location: 'Unknown',
    industry: 'Trading',
    email: 'info@newtrade.com',
    phone: '',
    recentTrend: 'stable' as const,
    badges: [],
    lastActive: 'Never',
  },
];

// Stats cards
function StatsCards() {
  const stats = [
    { label: 'Total Counterparties', value: '127', icon: Users, trend: '+12 this month' },
    { label: 'Verified Partners', value: '89', icon: CheckCircle, trend: '70% verified' },
    { label: 'Active This Week', value: '54', icon: TrendingUp, trend: '+8 vs last week' },
    { label: 'Avg Trust Score', value: '4.2', icon: Star, trend: 'Premium tier' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card className="bg-card hover:shadow-md transition-shadow">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon size={20} className="text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

// Counterparty Detail Dialog
function CounterpartyDetailDialog({ counterparty }: { counterparty: typeof SAMPLE_COUNTERPARTIES[0] }) {
  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          {counterparty.name}
          <VerifiedBadge isVerified={counterparty.isVerified} size="md" />
        </DialogTitle>
        <DialogDescription>{counterparty.industry}</DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        {/* Trust Score Card */}
        <TrustScoreCard
          name={counterparty.name}
          score={counterparty.trustScore}
          totalDeals={counterparty.totalDeals}
          successRate={counterparty.successRate}
          memberSince={counterparty.memberSince}
          isVerified={counterparty.isVerified}
          hasWarning={counterparty.hasWarning}
          recentTrend={counterparty.recentTrend}
          badges={counterparty.badges}
        />

        {/* Contact Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <MapPin size={16} className="text-muted-foreground" />
              <span className="text-foreground">{counterparty.location}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail size={16} className="text-muted-foreground" />
              <a href={`mailto:${counterparty.email}`} className="text-primary hover:underline">
                {counterparty.email}
              </a>
            </div>
            {counterparty.phone && (
              <div className="flex items-center gap-3 text-sm">
                <Phone size={16} className="text-muted-foreground" />
                <span className="text-foreground">{counterparty.phone}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button className="flex-1">
            <MessageSquare size={16} className="mr-2" />
            Send Message
          </Button>
          <Button variant="outline" className="flex-1">
            <FileText size={16} className="mr-2" />
            View Deals
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}

export default function CounterpartiesPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterType, setFilterType] = React.useState('all');
  const [filterTrust, setFilterTrust] = React.useState('all');
  const [sortBy, setSortBy] = React.useState('trustScore');
  const [selectedCounterparty, setSelectedCounterparty] = React.useState<typeof SAMPLE_COUNTERPARTIES[0] | null>(null);

  const filteredCounterparties = React.useMemo(() => {
    return SAMPLE_COUNTERPARTIES
      .filter(cp => {
        if (searchQuery && !cp.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
        if (filterType === 'verified' && !cp.isVerified) return false;
        if (filterType === 'unverified' && cp.isVerified) return false;
        
        if (filterTrust !== 'all') {
          const level = getTrustLevel(cp.trustScore, cp.hasWarning);
          if (filterTrust !== level) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'trustScore') return b.trustScore - a.trustScore;
        if (sortBy === 'deals') return b.totalDeals - a.totalDeals;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [searchQuery, filterType, filterTrust, sortBy]);

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Counterparties</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your trading partners and view trust scores
          </p>
        </div>
        <Button>
          <Plus size={16} className="mr-2" />
          Add Counterparty
        </Button>
      </div>

      {/* Stats */}
      <StatsCards />

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search counterparties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="verified">Verified Only</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterTrust} onValueChange={setFilterTrust}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Trust Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="elite">Elite</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="new">New</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-40">
                <ArrowUpDown size={14} className="mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trustScore">Trust Score</SelectItem>
                <SelectItem value="deals">Total Deals</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[300px]">Counterparty</TableHead>
                <TableHead>Trust Score</TableHead>
                <TableHead className="hidden md:table-cell">Deals</TableHead>
                <TableHead className="hidden lg:table-cell">Success Rate</TableHead>
                <TableHead className="hidden lg:table-cell">Last Active</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCounterparties.map((cp, i) => (
                <motion.tr
                  key={cp.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group cursor-pointer hover:bg-muted/50"
                >
                  <Dialog>
                    <DialogTrigger asChild>
                      <TableCell 
                        className="cursor-pointer"
                        onClick={() => setSelectedCounterparty(cp)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Building2 size={18} className="text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-foreground">{cp.name}</span>
                              <VerifiedBadge isVerified={cp.isVerified} size="sm" />
                            </div>
                            <p className="text-xs text-muted-foreground">{cp.location}</p>
                          </div>
                        </div>
                      </TableCell>
                    </DialogTrigger>
                    <CounterpartyDetailDialog counterparty={cp} />
                  </Dialog>
                  <TableCell>
                    <TrustBadge 
                      score={cp.trustScore} 
                      isVerified={cp.isVerified}
                      hasWarning={cp.hasWarning}
                      size="md"
                    />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="font-medium text-foreground tabular-nums">{cp.totalDeals}</span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span className={cn(
                      "font-medium tabular-nums",
                      cp.successRate >= 95 ? 'text-green-500' : 
                      cp.successRate >= 80 ? 'text-amber-500' : 'text-red-500'
                    )}>
                      {cp.successRate}%
                    </span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock size={12} />
                      <span className="text-xs">{cp.lastActive}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <MessageSquare size={14} className="mr-2" />
                          Send Message
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText size={14} className="mr-2" />
                          View Deals
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Star size={14} className="mr-2" />
                          Add to Favorites
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Ban size={14} className="mr-2" />
                          Block
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>

          {filteredCounterparties.length === 0 && (
            <div className="py-12 text-center">
              <Users size={40} className="mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">No counterparties found</p>
              <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}
