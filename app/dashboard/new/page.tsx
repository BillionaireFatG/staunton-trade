'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { DealInsert } from '@/types/database';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

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
    const totalValue = volume * pricePerUnit;

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
        total_value: totalValue.toString(),
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

  return (
    <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Card className="bg-[#111111] border-[#ef4444]/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-[#ef4444] text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-[#111111] border-gray-800 rounded-lg">
            <CardContent className="p-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-white mb-6">Deal Information</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="commodity_type" className="text-sm font-normal text-[#a3a3a3] mb-2 block">
                    Commodity Type <span className="text-[#ef4444]">*</span>
                  </Label>
                  <Select
                    value={formData.commodity_type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, commodity_type: value }))}
                    disabled={loading}
                  >
                    <SelectTrigger className="w-full bg-[#0a0a0a] border-gray-800 text-white">
                      <SelectValue placeholder="Select commodity type" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111111] border-gray-800">
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Jet Fuel">Jet Fuel</SelectItem>
                      <SelectItem value="Gasoline">Gasoline</SelectItem>
                      <SelectItem value="Crude Oil">Crude Oil</SelectItem>
                      <SelectItem value="LNG">LNG</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="volume" className="text-sm font-normal text-[#a3a3a3] mb-2 block">
                    Volume <span className="text-[#ef4444]">*</span>
                  </Label>
                  <div className="flex gap-2">
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
                      placeholder="0.00"
                      className="flex-1 bg-[#0a0a0a] border-gray-800 text-white placeholder:text-[#737373] focus:ring-2 focus:ring-[#3b82f6]"
                    />
                    <Select defaultValue="barrels" disabled={loading}>
                      <SelectTrigger className="w-[140px] bg-[#0a0a0a] border-gray-800 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#111111] border-gray-800">
                        <SelectItem value="barrels">Barrels</SelectItem>
                        <SelectItem value="gallons">Gallons</SelectItem>
                        <SelectItem value="tons">Tons</SelectItem>
                        <SelectItem value="cubic_meters">Cubic Meters</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="price_per_unit" className="text-sm font-normal text-[#a3a3a3] mb-2 block">
                    Price per Unit <span className="text-[#ef4444]">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373] pointer-events-none">$</span>
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
                      className="w-full pl-8 bg-[#0a0a0a] border-gray-800 text-white placeholder:text-[#737373] focus:ring-2 focus:ring-[#3b82f6]"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="total_value" className="text-sm font-normal text-[#a3a3a3] mb-2 block">
                    Total Value
                  </Label>
                  <Input
                    type="text"
                    id="total_value"
                    value={new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(totalValue)}
                    readOnly
                    disabled
                    className="w-full bg-[#0a0a0a] border-gray-800 text-white font-semibold cursor-not-allowed"
                  />
                </div>

                <div>
                  <Label htmlFor="buyer_name" className="text-sm font-normal text-[#a3a3a3] mb-2 block">
                    Buyer Name <span className="text-[#ef4444]">*</span>
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
                    className="w-full bg-[#0a0a0a] border-gray-800 text-white placeholder:text-[#737373] focus:ring-2 focus:ring-[#3b82f6]"
                  />
                </div>

                <div>
                  <Label htmlFor="seller_name" className="text-sm font-normal text-[#a3a3a3] mb-2 block">
                    Seller Name <span className="text-[#ef4444]">*</span>
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
                    className="w-full bg-[#0a0a0a] border-gray-800 text-white placeholder:text-[#737373] focus:ring-2 focus:ring-[#3b82f6]"
                  />
                </div>

                <div>
                  <Label htmlFor="contract_date" className="text-sm font-normal text-[#a3a3a3] mb-2 block">
                    Contract Date
                  </Label>
                  <Input
                    type="date"
                    id="contract_date"
                    name="contract_date"
                    value={formData.contract_date}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full bg-[#0a0a0a] border-gray-800 text-white focus:ring-2 focus:ring-[#3b82f6] [color-scheme:dark]"
                  />
                </div>

                <div>
                  <Label htmlFor="injection_date" className="text-sm font-normal text-[#a3a3a3] mb-2 block">
                    Injection Date
                  </Label>
                  <Input
                    type="date"
                    id="injection_date"
                    name="injection_date"
                    value={formData.injection_date}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full bg-[#0a0a0a] border-gray-800 text-white focus:ring-2 focus:ring-[#3b82f6] [color-scheme:dark]"
                  />
                </div>

                <div>
                  <Label htmlFor="delivery_date" className="text-sm font-normal text-[#a3a3a3] mb-2 block">
                    Delivery Date
                  </Label>
                  <Input
                    type="date"
                    id="delivery_date"
                    name="delivery_date"
                    value={formData.delivery_date}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full bg-[#0a0a0a] border-gray-800 text-white focus:ring-2 focus:ring-[#3b82f6] [color-scheme:dark]"
                  />
                </div>

                <div>
                  <Label htmlFor="notes" className="text-sm font-normal text-[#a3a3a3] mb-2 block">
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    disabled={loading}
                    rows={4}
                    placeholder="Additional notes about this deal..."
                    className="w-full bg-[#0a0a0a] border-gray-800 text-white placeholder:text-[#737373] focus:ring-2 focus:ring-[#3b82f6] resize-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push('/dashboard/deals')}
              disabled={loading}
              className="text-[#a3a3a3] hover:text-white hover:bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#3b82f6] hover:bg-[#2563eb] text-white"
            >
              {loading ? 'Saving...' : 'Save Deal'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
