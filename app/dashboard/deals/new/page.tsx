'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { createDeal, COMMODITY_LABELS, CommodityType, searchCounterparties } from '@/lib/supabase/deals';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Check, Loader2, Search, CheckCircle2 } from 'lucide-react';

const STEPS = [
  { id: 1, name: 'Commodity' },
  { id: 2, name: 'Counterparty' },
  { id: 3, name: 'Delivery' },
  { id: 4, name: 'Details' },
  { id: 5, name: 'Review' },
];

const TANK_FARMS = ['KOOLE', 'Vopak', 'Oiltanking', 'HES', 'Other'];

export default function NewDealPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [createdDealId, setCreatedDealId] = useState<string | null>(null);

  // Form state
  const [commodityType, setCommodityType] = useState<CommodityType>('fuel_diesel');
  const [quantity, setQuantity] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [currency, setCurrency] = useState('USD');

  const [userRole, setUserRole] = useState<'buyer' | 'seller'>('buyer');
  const [counterpartySearch, setCounterpartySearch] = useState('');
  const [counterparties, setCounterparties] = useState<any[]>([]);
  const [selectedCounterparty, setSelectedCounterparty] = useState<any>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [tankFarm, setTankFarm] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [expectedCompletion, setExpectedCompletion] = useState('');

  const [vesselName, setVesselName] = useState('');
  const [notes, setNotes] = useState('');

  const totalValue = (parseFloat(quantity) || 0) * (parseFloat(unitPrice) || 0);

  const handleSearch = async (query: string) => {
    setCounterpartySearch(query);
    if (query.length < 2) {
      setCounterparties([]);
      return;
    }
    setSearchLoading(true);
    const results = await searchCounterparties(query);
    setCounterparties(results.filter(p => p.id !== user?.id));
    setSearchLoading(false);
  };

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const deal = await createDeal({
        commodity_type: commodityType,
        quantity: parseFloat(quantity),
        unit_price: parseFloat(unitPrice),
        currency,
        buyer_id: userRole === 'buyer' ? user.id : selectedCounterparty?.id,
        seller_id: userRole === 'seller' ? user.id : selectedCounterparty?.id,
        delivery_location: deliveryLocation,
        tank_farm: tankFarm || undefined,
        scheduled_injection_date: scheduledDate || undefined,
        expected_completion_date: expectedCompletion || undefined,
        vessel_name: vesselName || undefined,
        notes: notes || undefined,
      });

      setCreatedDealId(deal.id);
      setSuccess(true);
    } catch (error) {
      console.error('Error creating deal:', error);
      alert('Failed to create deal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return commodityType && quantity && unitPrice;
      case 2: return selectedCounterparty;
      case 3: return deliveryLocation;
      case 4: return true;
      case 5: return true;
      default: return false;
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Deal Created!</h1>
        <p className="text-muted-foreground mb-8">Your deal has been created successfully.</p>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => router.push(`/dashboard/deals/${createdDealId}`)}>
            View Deal
          </Button>
          <Button variant="outline" onClick={() => {
            setSuccess(false);
            setStep(1);
            setCommodityType('fuel_diesel');
            setQuantity('');
            setUnitPrice('');
            setSelectedCounterparty(null);
            setDeliveryLocation('');
          }}>
            Create Another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/deals')}>
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Create New Deal</h1>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
              step > s.id ? 'bg-primary text-primary-foreground' :
              step === s.id ? 'bg-primary text-primary-foreground' :
              'bg-accent text-muted-foreground'
            }`}>
              {step > s.id ? <Check size={14} /> : s.id}
            </div>
            <span className={`ml-2 text-sm ${step >= s.id ? 'text-foreground' : 'text-muted-foreground'}`}>
              {s.name}
            </span>
            {i < STEPS.length - 1 && (
              <div className={`w-12 h-0.5 mx-4 ${step > s.id ? 'bg-primary' : 'bg-border'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Commodity */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <Label>Commodity Type</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {Object.entries(COMMODITY_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setCommodityType(key as CommodityType)}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    commodityType === key
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity">Quantity (MT)</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="1000"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="unitPrice">Unit Price (USD/MT)</Label>
              <Input
                id="unitPrice"
                type="number"
                placeholder="850"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
              />
            </div>
          </div>

          {totalValue > 0 && (
            <div className="p-4 bg-accent rounded-lg">
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-2xl font-bold">${totalValue.toLocaleString()} {currency}</p>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Counterparty */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <Label>Your Role</Label>
            <div className="flex gap-2 mt-2">
              <Button
                variant={userRole === 'buyer' ? 'default' : 'outline'}
                onClick={() => setUserRole('buyer')}
              >
                I am the Buyer
              </Button>
              <Button
                variant={userRole === 'seller' ? 'default' : 'outline'}
                onClick={() => setUserRole('seller')}
              >
                I am the Seller
              </Button>
            </div>
          </div>

          <div>
            <Label>Find {userRole === 'buyer' ? 'Seller' : 'Buyer'}</Label>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or company..."
                value={counterpartySearch}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {searchLoading && <Loader2 className="h-5 w-5 animate-spin mx-auto" />}

          {counterparties.length > 0 && (
            <div className="space-y-2">
              {counterparties.map((cp) => (
                <button
                  key={cp.id}
                  onClick={() => setSelectedCounterparty(cp)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    selectedCounterparty?.id === cp.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={cp.avatar_url} />
                    <AvatarFallback>{cp.full_name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="font-medium">{cp.full_name}</p>
                    <p className="text-sm text-muted-foreground">{cp.company_name}</p>
                  </div>
                  {cp.verification_status === 'verified' && (
                    <Badge variant="outline" className="bg-green-500/10 text-green-500">Verified</Badge>
                  )}
                </button>
              ))}
            </div>
          )}

          {selectedCounterparty && (
            <div className="p-4 bg-accent rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Selected {userRole === 'buyer' ? 'Seller' : 'Buyer'}</p>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedCounterparty.avatar_url} />
                  <AvatarFallback>{selectedCounterparty.full_name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedCounterparty.full_name}</p>
                  <p className="text-sm text-muted-foreground">{selectedCounterparty.company_name}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Delivery */}
      {step === 3 && (
        <div className="space-y-6">
          <div>
            <Label htmlFor="location">Delivery Location</Label>
            <Input
              id="location"
              placeholder="Rotterdam, Netherlands"
              value={deliveryLocation}
              onChange={(e) => setDeliveryLocation(e.target.value)}
            />
          </div>

          <div>
            <Label>Tank Farm</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {TANK_FARMS.map((farm) => (
                <button
                  key={farm}
                  onClick={() => setTankFarm(farm)}
                  className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                    tankFarm === farm
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {farm}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="scheduledDate">Scheduled Injection</Label>
              <Input
                id="scheduledDate"
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="expectedCompletion">Expected Completion</Label>
              <Input
                id="expectedCompletion"
                type="date"
                value={expectedCompletion}
                onChange={(e) => setExpectedCompletion(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Additional Details */}
      {step === 4 && (
        <div className="space-y-6">
          <div>
            <Label htmlFor="vessel">Vessel Name (Optional)</Label>
            <Input
              id="vessel"
              placeholder="MT Pacific Star"
              value={vesselName}
              onChange={(e) => setVesselName(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any additional details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>
        </div>
      )}

      {/* Step 5: Review */}
      {step === 5 && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">Review Deal</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-accent rounded-lg">
              <p className="text-sm text-muted-foreground">Commodity</p>
              <p className="font-medium">{COMMODITY_LABELS[commodityType]}</p>
              <p className="text-sm">{quantity} MT at ${unitPrice}/MT</p>
              <p className="text-lg font-bold mt-2">${totalValue.toLocaleString()} {currency}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Buyer</p>
                <p className="font-medium">
                  {userRole === 'buyer' ? 'You' : selectedCounterparty?.full_name}
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Seller</p>
                <p className="font-medium">
                  {userRole === 'seller' ? 'You' : selectedCounterparty?.full_name}
                </p>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Delivery</p>
              <p className="font-medium">{deliveryLocation}</p>
              {tankFarm && <p className="text-sm">{tankFarm}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8 pt-6 border-t">
        <Button
          variant="outline"
          onClick={() => setStep(step - 1)}
          disabled={step === 1}
        >
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>

        {step < 5 ? (
          <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}>
            Next
            <ArrowRight size={16} className="ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Create Deal
          </Button>
        )}
      </div>
    </div>
  );
}
