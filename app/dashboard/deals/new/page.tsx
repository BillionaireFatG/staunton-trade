'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { DealInsert } from '@/types/database';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  AlertCircle, 
  Loader2,
  Package,
  DollarSign,
  Users,
  Calendar,
  FileText,
  Sparkles
} from 'lucide-react';

export default function NewDealPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    commodity_type: '',
    volume: '',
    price_per_unit: '',
    buyer_name: '',
    seller_name: '',
    contract_date: '',
    injection_date: '',
    delivery_date: '',
    notes: '',
  });

  const totalValue = useMemo(() => {
    const volume = parseFloat(formData.volume) || 0;
    const price = parseFloat(formData.price_per_unit) || 0;
    return volume * price;
  }, [formData.volume, formData.price_per_unit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.commodity_type || !formData.volume || !formData.price_per_unit || 
        !formData.buyer_name || !formData.seller_name) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    const volume = parseFloat(formData.volume);
    const pricePerUnit = parseFloat(formData.price_per_unit);
    const calculatedTotal = volume * pricePerUnit;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/sign-in');
        return;
      }

      const dealData: DealInsert = {
        user_id: user.id,
        commodity_type: formData.commodity_type,
        volume: volume.toString(),
        price_per_unit: pricePerUnit.toString(),
        total_value: calculatedTotal.toString(),
        buyer_name: formData.buyer_name,
        seller_name: formData.seller_name,
        contract_date: formData.contract_date || null,
        injection_date: formData.injection_date || null,
        delivery_date: formData.delivery_date || null,
        notes: formData.notes || null,
        status: 'pending',
      };

      const { error: insertError } = await supabase
        .from('deals')
        .insert([dealData]);

      if (insertError) {
        setError(insertError.message);
        setLoading(false);
        return;
      }

      router.push('/dashboard/deals');
      router.refresh();
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/dashboard/deals" 
          className="inline-flex items-center gap-2 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft size={14} />
          Back to Deals
        </Link>
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
            <Sparkles size={18} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">Create New Deal</h1>
            <p className="text-[13px] text-muted-foreground mt-0.5">Fill in the details to create a new commodity deal</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 dark:bg-red-500/10 border border-red-500/20 flex items-center gap-3">
            <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
            <p className="text-[13px] text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Commodity Section */}
        <div className="rounded-xl bg-card border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-[13px] font-semibold text-foreground flex items-center gap-2">
              <Package size={16} className="text-primary" />
              Commodity Details
            </h2>
          </div>
          <div className="p-5 space-y-5">
            <div>
              <Label htmlFor="commodity_type" className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                Commodity Type <span className="text-red-500">*</span>
              </Label>
              <select
                id="commodity_type"
                name="commodity_type"
                value={formData.commodity_type}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Select commodity type</option>
                <option value="Diesel">Diesel</option>
                <option value="Jet Fuel">Jet Fuel</option>
                <option value="Gasoline">Gasoline</option>
                <option value="Crude Oil">Crude Oil</option>
                <option value="LNG">LNG</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="volume" className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                  Volume (BBL) <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  id="volume"
                  name="volume"
                  value={formData.volume}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  disabled={loading}
                  placeholder="0"
                  className="h-10"
                />
              </div>
              <div>
                <Label htmlFor="price_per_unit" className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                  Price per Unit <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[14px]">$</span>
                  <Input
                    type="number"
                    id="price_per_unit"
                    name="price_per_unit"
                    value={formData.price_per_unit}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    disabled={loading}
                    placeholder="0.00"
                    className="h-10 pl-7"
                  />
                </div>
              </div>
            </div>

            {/* Total Value Display */}
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign size={16} className="text-primary" />
                  <span className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Total Value</span>
                </div>
                <span className="text-xl font-semibold text-foreground">{formatCurrency(totalValue)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Parties Section */}
        <div className="rounded-xl bg-card border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-[13px] font-semibold text-foreground flex items-center gap-2">
              <Users size={16} className="text-purple-500" />
              Parties
            </h2>
          </div>
          <div className="p-5 grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="buyer_name" className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                Buyer Name <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                id="buyer_name"
                name="buyer_name"
                value={formData.buyer_name}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Enter buyer name"
                className="h-10"
              />
            </div>
            <div>
              <Label htmlFor="seller_name" className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                Seller Name <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                id="seller_name"
                name="seller_name"
                value={formData.seller_name}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Enter seller name"
                className="h-10"
              />
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="rounded-xl bg-card border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-[13px] font-semibold text-foreground flex items-center gap-2">
              <Calendar size={16} className="text-amber-500" />
              Timeline
            </h2>
          </div>
          <div className="p-5 grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="contract_date" className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                Contract Date
              </Label>
              <Input
                type="date"
                id="contract_date"
                name="contract_date"
                value={formData.contract_date}
                onChange={handleChange}
                disabled={loading}
                className="h-10"
              />
            </div>
            <div>
              <Label htmlFor="injection_date" className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                Injection Date
              </Label>
              <Input
                type="date"
                id="injection_date"
                name="injection_date"
                value={formData.injection_date}
                onChange={handleChange}
                disabled={loading}
                className="h-10"
              />
            </div>
            <div>
              <Label htmlFor="delivery_date" className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                Delivery Date
              </Label>
              <Input
                type="date"
                id="delivery_date"
                name="delivery_date"
                value={formData.delivery_date}
                onChange={handleChange}
                disabled={loading}
                className="h-10"
              />
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="rounded-xl bg-card border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-[13px] font-semibold text-foreground flex items-center gap-2">
              <FileText size={16} className="text-muted-foreground" />
              Additional Notes
            </h2>
          </div>
          <div className="p-5">
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              disabled={loading}
              rows={4}
              placeholder="Add any additional notes about this deal..."
              className="resize-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-[12px] text-muted-foreground">
            <span className="text-red-500">*</span> Required fields
          </p>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push('/dashboard/deals')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Deal'
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
