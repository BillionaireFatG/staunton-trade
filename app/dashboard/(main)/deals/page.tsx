'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getDeals, Deal, DealStatus, STATUS_LABELS, COMMODITY_LABELS } from '@/lib/supabase/deals';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, Loader2, Search, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

const STATUS_TABS: { value: DealStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'disputed', label: 'Disputed' },
];

const STATUS_COLORS: Record<DealStatus, string> = {
  draft: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  injecting: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  inspection: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  completed: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  disputed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function DealsPage() {
  const router = useRouter();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<DealStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadDeals();
  }, [statusFilter]);

  const loadDeals = async () => {
    setLoading(true);
    const data = await getDeals(
      statusFilter === 'all' ? undefined : { status: statusFilter }
    );
    setDeals(data);
    setLoading(false);
  };

  const filteredDeals = deals.filter((deal) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      deal.reference_number?.toLowerCase().includes(q) ||
      deal.buyer?.full_name?.toLowerCase().includes(q) ||
      deal.seller?.full_name?.toLowerCase().includes(q) ||
      deal.buyer?.company_name?.toLowerCase().includes(q) ||
      deal.seller?.company_name?.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Deals</h1>
        <Button onClick={() => router.push('/dashboard/deals/new')}>
          <Plus size={16} className="mr-2" />
          New Deal
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex gap-1 overflow-x-auto pb-2">
          {STATUS_TABS.map((tab) => (
            <Button
              key={tab.value}
              size="sm"
              variant={statusFilter === tab.value ? 'default' : 'ghost'}
              onClick={() => setStatusFilter(tab.value)}
            >
              {tab.label}
            </Button>
          ))}
        </div>
        <div className="relative flex-1 max-w-sm ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by reference or counterparty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Deals Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredDeals.length === 0 ? (
        <div className="text-center py-20">
          <h3 className="text-lg font-semibold mb-2">No deals yet</h3>
          <p className="text-muted-foreground mb-6">Create your first deal to get started</p>
          <Button onClick={() => router.push('/dashboard/deals/new')}>
            <Plus size={16} className="mr-2" />
            Create Deal
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDeals.map((deal) => (
            <button
              key={deal.id}
              onClick={() => router.push(`/dashboard/deals/${deal.id}`)}
              className="p-4 rounded-lg border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all text-left"
            >
              {/* Reference */}
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-sm font-medium">{deal.reference_number}</span>
                <Badge className={STATUS_COLORS[deal.status]}>{STATUS_LABELS[deal.status]}</Badge>
              </div>

              {/* Commodity */}
              <p className="font-medium mb-1">
                {COMMODITY_LABELS[deal.commodity_type]} · {deal.quantity?.toLocaleString()} MT
              </p>

              {/* Parties */}
              <div className="flex items-center gap-4 my-3 text-sm">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={deal.buyer?.avatar_url} />
                    <AvatarFallback className="text-[10px]">
                      {deal.buyer?.full_name?.substring(0, 2).toUpperCase() || 'B'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-muted-foreground">Buyer:</span>
                  <span>{deal.buyer?.full_name || 'TBD'}</span>
                  {deal.buyer?.verification_status === 'verified' && (
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={deal.seller?.avatar_url} />
                    <AvatarFallback className="text-[10px]">
                      {deal.seller?.full_name?.substring(0, 2).toUpperCase() || 'S'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-muted-foreground">Seller:</span>
                  <span>{deal.seller?.full_name || 'TBD'}</span>
                  {deal.seller?.verification_status === 'verified' && (
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                  )}
                </div>
              </div>

              {/* Progress */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Progress</span>
                  <span>{deal.progress_percentage}%</span>
                </div>
                <div className="h-1.5 bg-accent rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${deal.progress_percentage}%` }}
                  />
                </div>
              </div>

              {/* Value & Location */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t text-sm">
                <span className="font-semibold">${deal.total_value?.toLocaleString()}</span>
                <span className="text-muted-foreground">{deal.delivery_location}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
