import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase-server';
import Link from 'next/link';
import DocumentsSection from './DocumentsSection';
import type { Document } from '@/types/database';
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  Package, 
  User, 
  Users, 
  FileText,
  Clock,
  TrendingUp
} from 'lucide-react';

export default async function DealDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/sign-in');
  }

  const { data: deal, error: dealError } = await supabase
    .from('deals')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (dealError || !deal) {
    redirect('/dashboard');
  }

  const { data: documents, error: documentsError } = await supabase
    .from('documents')
    .select('*')
    .eq('deal_id', id)
    .order('uploaded_at', { ascending: false });

  const documentsData: Document[] = documents || [];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { bg: string; text: string; dot: string; label: string }> = {
      pending: { bg: 'bg-[#f59e0b]/10', text: 'text-[#f59e0b]', dot: 'bg-[#f59e0b]', label: 'Pending' },
      in_progress: { bg: 'bg-[#3b82f6]/10', text: 'text-[#3b82f6]', dot: 'bg-[#3b82f6]', label: 'In Progress' },
      completed: { bg: 'bg-[#10b981]/10', text: 'text-[#10b981]', dot: 'bg-[#10b981]', label: 'Completed' },
    };
    return configs[status] || { bg: 'bg-[#666]/10', text: 'text-[#666]', dot: 'bg-[#666]', label: status };
  };

  const statusConfig = getStatusConfig(deal.status);

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <Link 
          href="/dashboard/deals" 
          className="inline-flex items-center gap-2 text-[13px] text-[#666] hover:text-white transition-colors mb-4"
        >
          <ArrowLeft size={14} />
          Back to Deals
        </Link>
        
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-semibold text-white tracking-tight">{deal.commodity_type} Deal</h1>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                {statusConfig.label}
              </span>
            </div>
            <p className="text-[13px] text-[#666]">
              Created on {formatDate(deal.created_at)}
            </p>
          </div>
          
          <div className="text-right">
            <p className="text-[11px] font-medium text-[#666] uppercase tracking-wider mb-1">Total Value</p>
            <p className="text-2xl font-semibold text-white tracking-tight">{formatCurrency(Number(deal.total_value))}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Parties Card */}
        <div className="rounded-xl bg-[#111113] border border-[#1a1a1a] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1a1a1a]">
            <h2 className="text-[13px] font-semibold text-white flex items-center gap-2">
              <Users size={16} className="text-[#3b82f6]" />
              Parties
            </h2>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-[#0a0a0a] border border-[#1a1a1a]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3b82f6]/20 to-[#3b82f6]/5 flex items-center justify-center">
                    <User size={14} className="text-[#3b82f6]" />
                  </div>
                  <p className="text-[11px] font-medium text-[#555] uppercase tracking-wider">Buyer</p>
                </div>
                <p className="text-[15px] font-semibold text-white">{deal.buyer_name}</p>
              </div>
              <div className="p-4 rounded-lg bg-[#0a0a0a] border border-[#1a1a1a]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8b5cf6]/20 to-[#8b5cf6]/5 flex items-center justify-center">
                    <User size={14} className="text-[#8b5cf6]" />
                  </div>
                  <p className="text-[11px] font-medium text-[#555] uppercase tracking-wider">Seller</p>
                </div>
                <p className="text-[15px] font-semibold text-white">{deal.seller_name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Deal Details Card */}
        <div className="rounded-xl bg-[#111113] border border-[#1a1a1a] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1a1a1a]">
            <h2 className="text-[13px] font-semibold text-white flex items-center gap-2">
              <TrendingUp size={16} className="text-[#10b981]" />
              Deal Details
            </h2>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-[#0a0a0a] border border-[#1a1a1a]">
                <div className="flex items-center gap-2 mb-2">
                  <Package size={14} className="text-[#666]" />
                  <p className="text-[11px] font-medium text-[#555] uppercase tracking-wider">Commodity</p>
                </div>
                <p className="text-[14px] font-semibold text-white">{deal.commodity_type}</p>
              </div>
              <div className="p-4 rounded-lg bg-[#0a0a0a] border border-[#1a1a1a]">
                <div className="flex items-center gap-2 mb-2">
                  <FileText size={14} className="text-[#666]" />
                  <p className="text-[11px] font-medium text-[#555] uppercase tracking-wider">Volume</p>
                </div>
                <p className="text-[14px] font-semibold text-white font-mono">{Number(deal.volume).toLocaleString()} BBL</p>
              </div>
              <div className="p-4 rounded-lg bg-[#0a0a0a] border border-[#1a1a1a]">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign size={14} className="text-[#666]" />
                  <p className="text-[11px] font-medium text-[#555] uppercase tracking-wider">Price/Unit</p>
                </div>
                <p className="text-[14px] font-semibold text-white">{formatCurrency(Number(deal.price_per_unit))}</p>
              </div>
              <div className="p-4 rounded-lg bg-[#0a0a0a] border border-[#1a1a1a]">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign size={14} className="text-[#10b981]" />
                  <p className="text-[11px] font-medium text-[#555] uppercase tracking-wider">Total Value</p>
                </div>
                <p className="text-[14px] font-semibold text-[#10b981]">{formatCurrency(Number(deal.total_value))}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Card */}
        <div className="rounded-xl bg-[#111113] border border-[#1a1a1a] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1a1a1a]">
            <h2 className="text-[13px] font-semibold text-white flex items-center gap-2">
              <Calendar size={16} className="text-[#f59e0b]" />
              Timeline
            </h2>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative p-4 rounded-lg bg-[#0a0a0a] border border-[#1a1a1a]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-[#3b82f6]" />
                  <p className="text-[11px] font-medium text-[#555] uppercase tracking-wider">Contract Date</p>
                </div>
                <p className="text-[14px] font-medium text-white">{formatDate(deal.contract_date)}</p>
              </div>
              <div className="relative p-4 rounded-lg bg-[#0a0a0a] border border-[#1a1a1a]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                  <p className="text-[11px] font-medium text-[#555] uppercase tracking-wider">Injection Date</p>
                </div>
                <p className="text-[14px] font-medium text-white">{formatDate(deal.injection_date)}</p>
              </div>
              <div className="relative p-4 rounded-lg bg-[#0a0a0a] border border-[#1a1a1a]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-[#10b981]" />
                  <p className="text-[11px] font-medium text-[#555] uppercase tracking-wider">Delivery Date</p>
                </div>
                <p className="text-[14px] font-medium text-white">{formatDate(deal.delivery_date)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notes Card */}
        {deal.notes && (
          <div className="rounded-xl bg-[#111113] border border-[#1a1a1a] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#1a1a1a]">
              <h2 className="text-[13px] font-semibold text-white flex items-center gap-2">
                <FileText size={16} className="text-[#888]" />
                Notes
              </h2>
            </div>
            <div className="p-5">
              <p className="text-[14px] text-[#888] leading-relaxed">{deal.notes}</p>
            </div>
          </div>
        )}

        {/* Documents Section */}
        <DocumentsSection dealId={id} initialDocuments={documentsData} />
      </div>
    </div>
  );
}
