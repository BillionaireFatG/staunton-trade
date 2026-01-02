'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { getDeal, updateDeal, createDealEvent, subscribeToDeal, Deal, DealStatus, STATUS_LABELS, COMMODITY_LABELS } from '@/lib/supabase/deals';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArrowLeft, Loader2, CheckCircle2, MessageSquare, FileText, MapPin, ChevronDown, Clock, Upload } from 'lucide-react';
import { format } from 'date-fns';

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

const NEXT_STATUSES: Record<DealStatus, DealStatus[]> = {
  draft: ['pending', 'cancelled'],
  pending: ['active', 'cancelled'],
  active: ['injecting', 'cancelled', 'disputed'],
  injecting: ['inspection', 'disputed'],
  inspection: ['completed', 'disputed'],
  completed: [],
  cancelled: [],
  disputed: ['active', 'cancelled'],
};

export default function DealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const dealId = params.id as string;

  useEffect(() => {
    loadDeal();
  }, [dealId]);

  useEffect(() => {
    if (!dealId) return;
    const unsubscribe = subscribeToDeal(dealId, loadDeal);
    return () => unsubscribe();
  }, [dealId]);

  const loadDeal = async () => {
    const data = await getDeal(dealId);
    setDeal(data);
    setLoading(false);
  };

  const handleStatusChange = async (newStatus: DealStatus) => {
    if (!deal) return;
    setUpdating(true);
    await updateDeal(deal.id, { status: newStatus });
    await loadDeal();
    setUpdating(false);
  };

  const handleProgressUpdate = async (percentage: number) => {
    if (!deal) return;
    await updateDeal(deal.id, { progress_percentage: percentage });
    await createDealEvent(deal.id, 'progress_updated', `Progress updated to ${percentage}%`);
    await loadDeal();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold mb-2">Deal not found</h2>
        <Button onClick={() => router.push('/dashboard/deals')}>Back to Deals</Button>
      </div>
    );
  }

  const nextStatuses = NEXT_STATUSES[deal.status];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/deals')}>
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
      </div>

      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b">
        <div>
          <h1 className="text-2xl font-bold font-mono">{deal.reference_number}</h1>
          <div className="flex items-center gap-3 mt-2">
            <Badge className={STATUS_COLORS[deal.status]}>{STATUS_LABELS[deal.status]}</Badge>
            <span className="text-muted-foreground">{deal.progress_percentage}% complete</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {nextStatuses.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" disabled={updating}>
                  Update Status
                  <ChevronDown size={16} className="ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {nextStatuses.map((status) => (
                  <DropdownMenuItem key={status} onClick={() => handleStatusChange(status)}>
                    {STATUS_LABELS[status]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button variant="outline">
            <Upload size={16} className="mr-2" />
            Upload Document
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Parties */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Parties</h2>

          {/* Buyer */}
          <div className="p-4 rounded-lg border">
            <p className="text-xs text-muted-foreground mb-2">Buyer</p>
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={deal.buyer?.avatar_url} />
                <AvatarFallback>{deal.buyer?.full_name?.substring(0, 2).toUpperCase() || 'B'}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{deal.buyer?.full_name || 'Not assigned'}</p>
                  {deal.buyer?.verification_status === 'verified' && (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{deal.buyer?.company_name}</p>
              </div>
            </div>
            {deal.buyer && (
              <Button variant="ghost" size="sm" className="mt-2 w-full" onClick={() => router.push(`/messages?user=${deal.buyer.id}`)}>
                <MessageSquare size={14} className="mr-2" />
                Send Message
              </Button>
            )}
          </div>

          {/* Seller */}
          <div className="p-4 rounded-lg border">
            <p className="text-xs text-muted-foreground mb-2">Seller</p>
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={deal.seller?.avatar_url} />
                <AvatarFallback>{deal.seller?.full_name?.substring(0, 2).toUpperCase() || 'S'}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{deal.seller?.full_name || 'Not assigned'}</p>
                  {deal.seller?.verification_status === 'verified' && (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{deal.seller?.company_name}</p>
              </div>
            </div>
            {deal.seller && (
              <Button variant="ghost" size="sm" className="mt-2 w-full" onClick={() => router.push(`/messages?user=${deal.seller.id}`)}>
                <MessageSquare size={14} className="mr-2" />
                Send Message
              </Button>
            )}
          </div>

          {/* Commodity Details */}
          <div className="p-4 rounded-lg border">
            <h3 className="font-semibold mb-3">Commodity</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type</span>
                <span>{COMMODITY_LABELS[deal.commodity_type]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Quantity</span>
                <span>{deal.quantity?.toLocaleString()} MT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Unit Price</span>
                <span>${deal.unit_price?.toLocaleString()}/MT</span>
              </div>
              <div className="flex justify-between font-semibold pt-2 border-t">
                <span>Total Value</span>
                <span>${deal.total_value?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column: Timeline */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Progress & Timeline</h2>

          {/* Progress Bar */}
          <div className="p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Deal Progress</span>
              <span className="text-sm text-muted-foreground">{deal.progress_percentage}%</span>
            </div>
            <Progress value={deal.progress_percentage} className="h-2" />
            <div className="flex gap-1 mt-3">
              {[0, 25, 50, 75, 100].map((p) => (
                <button
                  key={p}
                  onClick={() => handleProgressUpdate(p)}
                  className={`flex-1 py-1 text-xs rounded transition-colors ${
                    deal.progress_percentage >= p
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-accent hover:bg-accent/80'
                  }`}
                >
                  {p}%
                </button>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="p-4 rounded-lg border">
            <h3 className="font-semibold mb-4">Timeline</h3>
            <div className="space-y-4">
              {deal.events && deal.events.length > 0 ? (
                deal.events.map((event, i) => (
                  <div key={event.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      {i < deal.events!.length - 1 && <div className="w-0.5 h-full bg-border mt-1" />}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-sm font-medium">{event.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(event.created_at), 'MMM d, yyyy h:mm a')}
                        {event.created_by_profile?.full_name && ` by ${event.created_by_profile.full_name}`}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No events yet</p>
              )}
            </div>
          </div>

          {/* Key Dates */}
          <div className="p-4 rounded-lg border">
            <h3 className="font-semibold mb-3">Key Dates</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-muted-foreground">Created</p>
                  <p>{format(new Date(deal.created_at), 'MMM d, yyyy')}</p>
                </div>
              </div>
              {deal.scheduled_injection_date && (
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-muted-foreground">Scheduled Injection</p>
                    <p>{format(new Date(deal.scheduled_injection_date), 'MMM d, yyyy')}</p>
                  </div>
                </div>
              )}
              {deal.expected_completion_date && (
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-muted-foreground">Expected Completion</p>
                    <p>{format(new Date(deal.expected_completion_date), 'MMM d, yyyy')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Tracking & Documents */}
        <div className="space-y-4">
          {/* Location */}
          <div className="p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={16} className="text-muted-foreground" />
              <h3 className="font-semibold">Delivery</h3>
            </div>
            <p className="font-medium">{deal.delivery_location}</p>
            {deal.tank_farm && <p className="text-sm text-muted-foreground">{deal.tank_farm}</p>}
            {deal.vessel_name && (
              <p className="text-sm text-muted-foreground mt-2">Vessel: {deal.vessel_name}</p>
            )}
          </div>

          {/* Documents */}
          <div className="p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={16} className="text-muted-foreground" />
              <h3 className="font-semibold">Documents</h3>
            </div>
            <div className="space-y-2">
              {deal.contract_url ? (
                <a href={deal.contract_url} className="flex items-center gap-2 p-2 rounded hover:bg-accent text-sm">
                  <FileText size={14} />
                  Contract
                </a>
              ) : (
                <p className="text-sm text-muted-foreground">No contract uploaded</p>
              )}
              {deal.inspection_report_url && (
                <a href={deal.inspection_report_url} className="flex items-center gap-2 p-2 rounded hover:bg-accent text-sm">
                  <FileText size={14} />
                  Inspection Report
                </a>
              )}
              {deal.quality_certificate_url && (
                <a href={deal.quality_certificate_url} className="flex items-center gap-2 p-2 rounded hover:bg-accent text-sm">
                  <FileText size={14} />
                  Quality Certificate
                </a>
              )}
              {deal.bill_of_lading_url && (
                <a href={deal.bill_of_lading_url} className="flex items-center gap-2 p-2 rounded hover:bg-accent text-sm">
                  <FileText size={14} />
                  Bill of Lading
                </a>
              )}
            </div>
          </div>

          {/* Notes */}
          {deal.notes && (
            <div className="p-4 rounded-lg border">
              <h3 className="font-semibold mb-2">Notes</h3>
              <p className="text-sm text-muted-foreground">{deal.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
