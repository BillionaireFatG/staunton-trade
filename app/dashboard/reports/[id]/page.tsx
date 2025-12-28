'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  ArrowLeft, 
  Download, 
  Share2, 
  Shield,
  CheckCircle,
  Clock,
  Ship,
  Warehouse,
  Users,
  MapPin,
  Calendar,
  FileCheck,
  AlertCircle,
  Copy,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TrustScoreBadge } from '@/components/TrustScore';

// Mock Staunton Report data
const mockReport = {
  id: 'STR-2024-001847',
  deal_id: 'STN-2024-001847',
  status: 'verified' as const,
  report_type: 'vessel_to_tank' as const,
  generated_at: '2024-12-28T10:30:00Z',
  verified_at: '2024-12-28T14:15:00Z',
  blockchain_hash: '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
  commodity_details: {
    type: 'Diesel',
    grade: 'Ultra Low Sulfur Diesel (ULSD)',
    sulfur_content: '10 ppm max',
    volume: 50000,
    unit: 'MT',
    specifications: [
      { name: 'Density @ 15°C', value: '835.0 kg/m³', status: 'pass' },
      { name: 'Flash Point', value: '62°C', status: 'pass' },
      { name: 'Cetane Number', value: '51', status: 'pass' },
      { name: 'Viscosity @ 40°C', value: '2.8 cSt', status: 'pass' },
      { name: 'Sulfur Content', value: '8 ppm', status: 'pass' },
    ]
  },
  parties: {
    buyer: {
      name: 'EuroFuel Distributors GmbH',
      country: 'Germany',
      trust_score: 4.5,
      verified: true,
    },
    seller: {
      name: 'Gulf Energy Corporation',
      country: 'UAE',
      trust_score: 4.8,
      verified: true,
    },
    inspector: {
      name: 'Staunton Verification Services',
      certification: 'ISO 17020 Accredited',
    }
  },
  logistics: {
    vessel_name: 'MT Nordic Star',
    vessel_imo: '9876543',
    origin_port: 'Houston, TX, USA',
    destination_port: 'Rotterdam, Netherlands',
    injection_facility: 'Vopak Rotterdam Terminal',
    departed_at: '2024-12-18T08:00:00Z',
    arrived_at: '2024-12-29T14:00:00Z',
    injection_started: '2024-12-30T08:00:00Z',
    injection_completed: '2024-12-30T20:00:00Z',
  },
  milestones: [
    { label: 'Contract Executed', date: '2024-12-15T10:00:00Z', status: 'completed', verified: true },
    { label: 'Vessel Loaded', date: '2024-12-18T08:00:00Z', status: 'completed', verified: true },
    { label: 'Pre-Shipment Inspection', date: '2024-12-18T06:00:00Z', status: 'completed', verified: true },
    { label: 'Vessel Departed', date: '2024-12-18T12:00:00Z', status: 'completed', verified: true },
    { label: 'In Transit', date: '2024-12-20T00:00:00Z', status: 'completed', verified: true },
    { label: 'Arrived at Port', date: '2024-12-29T14:00:00Z', status: 'completed', verified: true },
    { label: 'Injection Started', date: '2024-12-30T08:00:00Z', status: 'completed', verified: true },
    { label: 'Injection Completed', date: '2024-12-30T20:00:00Z', status: 'completed', verified: true },
    { label: 'Post-Injection Inspection', date: '2024-12-30T22:00:00Z', status: 'completed', verified: true },
    { label: 'Report Verified', date: '2024-12-28T14:15:00Z', status: 'completed', verified: true },
  ],
  documents: [
    { name: 'Bill of Lading', type: 'B/L', verified: true, date: '2024-12-18' },
    { name: 'Certificate of Origin', type: 'COO', verified: true, date: '2024-12-17' },
    { name: 'Quality Certificate', type: 'QC', verified: true, date: '2024-12-18' },
    { name: 'Inspection Report', type: 'IR', verified: true, date: '2024-12-30' },
    { name: 'Tank Storage Receipt', type: 'TSR', verified: true, date: '2024-12-30' },
    { name: 'Commercial Invoice', type: 'INV', verified: true, date: '2024-12-30' },
  ],
  financial: {
    total_value: 43750000,
    price_per_unit: 875,
    currency: 'USD',
    payment_status: 'settled',
    settled_at: '2024-12-31T09:00:00Z',
  }
};

export default function StauntonReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [copied, setCopied] = useState(false);

  const copyHash = () => {
    navigator.clipboard.writeText(mockReport.blockchain_hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link href="/dashboard/deals" className="inline-flex items-center gap-2 text-[13px] text-[#666] hover:text-white transition-colors mb-3">
            <ArrowLeft size={14} />
            Back to Deals
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8b5cf6]/20 to-[#8b5cf6]/5 flex items-center justify-center">
              <FileText size={22} className="text-[#8b5cf6]" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-semibold text-white tracking-tight">Staunton Report</h1>
                <span className="px-2.5 py-1 rounded-full bg-[#10b981]/10 text-[#10b981] text-[11px] font-semibold border border-[#10b981]/20 flex items-center gap-1">
                  <Shield size={12} />
                  VERIFIED
                </span>
              </div>
              <p className="text-[13px] text-[#666] font-mono">{mockReport.id}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 px-3 bg-[#111113] border-[#262626] text-[#888] hover:text-white hover:bg-[#1a1a1a]">
            <Share2 size={14} className="mr-2" />
            Share
          </Button>
          <Button size="sm" className="h-9 px-3 bg-[#3b82f6] hover:bg-[#2563eb] text-white">
            <Download size={14} className="mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Blockchain Verification */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-[#10b981]/10 to-[#3b82f6]/10 border border-[#10b981]/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield size={18} className="text-[#10b981]" />
            <div>
              <p className="text-[13px] font-medium text-white">Blockchain Verified</p>
              <p className="text-[11px] text-[#666]">This report is cryptographically signed and immutable</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <code className="px-3 py-1.5 rounded-lg bg-[#0a0a0a] border border-[#1a1a1a] text-[11px] font-mono text-[#888]">
              {mockReport.blockchain_hash.slice(0, 20)}...{mockReport.blockchain_hash.slice(-8)}
            </code>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={copyHash}
              className="h-8 px-2 text-[#888] hover:text-white"
            >
              {copied ? <CheckCircle size={14} className="text-[#10b981]" /> : <Copy size={14} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="col-span-2 space-y-6">
          {/* Commodity Details */}
          <div className="p-5 rounded-xl bg-[#111113] border border-[#1a1a1a]">
            <h2 className="text-[14px] font-semibold text-white flex items-center gap-2 mb-4">
              <FileCheck size={16} className="text-[#3b82f6]" />
              Commodity Details
            </h2>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-[10px] text-[#555] uppercase tracking-wider mb-1">Type</p>
                <p className="text-[14px] font-medium text-white">{mockReport.commodity_details.type}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#555] uppercase tracking-wider mb-1">Grade</p>
                <p className="text-[14px] font-medium text-white">{mockReport.commodity_details.grade}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#555] uppercase tracking-wider mb-1">Volume</p>
                <p className="text-[14px] font-medium text-white">{mockReport.commodity_details.volume.toLocaleString()} {mockReport.commodity_details.unit}</p>
              </div>
            </div>
            
            {/* Specifications */}
            <div className="border-t border-[#1a1a1a] pt-4">
              <p className="text-[11px] text-[#666] uppercase tracking-wider mb-3">Quality Specifications</p>
              <div className="space-y-2">
                {mockReport.commodity_details.specifications.map((spec, i) => (
                  <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg bg-[#0a0a0a]">
                    <span className="text-[12px] text-[#888]">{spec.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[12px] font-mono text-white">{spec.value}</span>
                      <span className="flex items-center gap-1 text-[10px] font-medium text-[#10b981]">
                        <CheckCircle size={12} />
                        PASS
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Logistics */}
          <div className="p-5 rounded-xl bg-[#111113] border border-[#1a1a1a]">
            <h2 className="text-[14px] font-semibold text-white flex items-center gap-2 mb-4">
              <Ship size={16} className="text-[#06b6d4]" />
              Logistics
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-[#555] uppercase tracking-wider mb-1">Vessel</p>
                <p className="text-[14px] font-medium text-white">{mockReport.logistics.vessel_name}</p>
                <p className="text-[11px] text-[#666]">IMO: {mockReport.logistics.vessel_imo}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#555] uppercase tracking-wider mb-1">Injection Facility</p>
                <p className="text-[14px] font-medium text-white">{mockReport.logistics.injection_facility}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#555] uppercase tracking-wider mb-1">Origin</p>
                <p className="text-[14px] font-medium text-white">{mockReport.logistics.origin_port}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#555] uppercase tracking-wider mb-1">Destination</p>
                <p className="text-[14px] font-medium text-white">{mockReport.logistics.destination_port}</p>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="p-5 rounded-xl bg-[#111113] border border-[#1a1a1a]">
            <h2 className="text-[14px] font-semibold text-white flex items-center gap-2 mb-4">
              <FileText size={16} className="text-[#f59e0b]" />
              Attached Documents
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {mockReport.documents.map((doc, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[#0a0a0a] border border-[#1a1a1a]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] flex items-center justify-center">
                      <FileText size={14} className="text-[#888]" />
                    </div>
                    <div>
                      <p className="text-[12px] font-medium text-white">{doc.name}</p>
                      <p className="text-[10px] text-[#555]">{doc.type} • {doc.date}</p>
                    </div>
                  </div>
                  {doc.verified && (
                    <CheckCircle size={14} className="text-[#10b981]" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Parties */}
          <div className="p-5 rounded-xl bg-[#111113] border border-[#1a1a1a]">
            <h2 className="text-[14px] font-semibold text-white flex items-center gap-2 mb-4">
              <Users size={16} className="text-[#8b5cf6]" />
              Parties
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-[#555] uppercase tracking-wider mb-2">Buyer</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-medium text-white">{mockReport.parties.buyer.name}</p>
                    <p className="text-[11px] text-[#666]">{mockReport.parties.buyer.country}</p>
                  </div>
                  <TrustScoreBadge score={mockReport.parties.buyer.trust_score} verified={mockReport.parties.buyer.verified} />
                </div>
              </div>
              <div>
                <p className="text-[10px] text-[#555] uppercase tracking-wider mb-2">Seller</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-medium text-white">{mockReport.parties.seller.name}</p>
                    <p className="text-[11px] text-[#666]">{mockReport.parties.seller.country}</p>
                  </div>
                  <TrustScoreBadge score={mockReport.parties.seller.trust_score} verified={mockReport.parties.seller.verified} />
                </div>
              </div>
              <div className="pt-3 border-t border-[#1a1a1a]">
                <p className="text-[10px] text-[#555] uppercase tracking-wider mb-2">Inspector</p>
                <p className="text-[13px] font-medium text-white">{mockReport.parties.inspector.name}</p>
                <p className="text-[11px] text-[#666]">{mockReport.parties.inspector.certification}</p>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="p-5 rounded-xl bg-[#111113] border border-[#1a1a1a]">
            <h2 className="text-[14px] font-semibold text-white flex items-center gap-2 mb-4">
              <FileText size={16} className="text-[#10b981]" />
              Financial Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-[12px] text-[#666]">Total Value</span>
                <span className="text-[14px] font-semibold text-white">{formatCurrency(mockReport.financial.total_value)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[12px] text-[#666]">Price per MT</span>
                <span className="text-[12px] text-white">{formatCurrency(mockReport.financial.price_per_unit)}</span>
              </div>
              <div className="pt-3 border-t border-[#1a1a1a] flex justify-between">
                <span className="text-[12px] text-[#666]">Payment Status</span>
                <span className="text-[11px] font-medium text-[#10b981] uppercase flex items-center gap-1">
                  <CheckCircle size={12} />
                  SETTLED
                </span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="p-5 rounded-xl bg-[#111113] border border-[#1a1a1a]">
            <h2 className="text-[14px] font-semibold text-white flex items-center gap-2 mb-4">
              <Clock size={16} className="text-[#f59e0b]" />
              Timeline
            </h2>
            <div className="space-y-3">
              {mockReport.milestones.slice(0, 6).map((milestone, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center ${
                    milestone.status === 'completed' 
                      ? 'bg-[#10b981]/20 text-[#10b981]' 
                      : 'bg-[#1a1a1a] text-[#555]'
                  }`}>
                    {milestone.status === 'completed' ? <CheckCircle size={10} /> : <Clock size={10} />}
                  </div>
                  <div className="flex-1">
                    <p className="text-[12px] font-medium text-white">{milestone.label}</p>
                    <p className="text-[10px] text-[#555]">{formatDate(milestone.date)}</p>
                  </div>
                </div>
              ))}
              {mockReport.milestones.length > 6 && (
                <button className="w-full py-2 text-center text-[11px] text-[#666] hover:text-white transition-colors">
                  View all {mockReport.milestones.length} milestones
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


