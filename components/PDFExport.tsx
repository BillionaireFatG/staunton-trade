'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  FileText,
  Loader2,
  Check,
  X,
  File,
  Calendar,
  DollarSign,
  Package,
  User,
  Building2,
  Ship,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

// Report types
export type ReportType = 
  | 'deal_summary'
  | 'deal_full'
  | 'monthly_report'
  | 'transaction_history'
  | 'analytics';

export interface ReportConfig {
  type: ReportType;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  sections: string[];
}

const REPORT_TYPES: ReportConfig[] = [
  {
    type: 'deal_summary',
    title: 'Deal Summary',
    description: 'One-page overview of a single deal',
    icon: FileText,
    sections: ['basic_info', 'parties', 'value', 'status'],
  },
  {
    type: 'deal_full',
    title: 'Full Deal Report',
    description: 'Comprehensive deal documentation',
    icon: File,
    sections: ['basic_info', 'parties', 'value', 'status', 'timeline', 'documents', 'notes'],
  },
  {
    type: 'monthly_report',
    title: 'Monthly Report',
    description: 'Summary of all trading activity',
    icon: Calendar,
    sections: ['summary', 'deals', 'volume', 'revenue', 'partners'],
  },
  {
    type: 'transaction_history',
    title: 'Transaction History',
    description: 'Detailed transaction log',
    icon: Clock,
    sections: ['transactions', 'payments', 'documents'],
  },
  {
    type: 'analytics',
    title: 'Analytics Report',
    description: 'Performance metrics and insights',
    icon: Package,
    sections: ['overview', 'charts', 'trends', 'recommendations'],
  },
];

// Generate PDF content (simulated - in production use react-pdf)
async function generatePDFBlob(type: ReportType, data: any, sections: string[]): Promise<Blob> {
  // Simulate PDF generation delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Create a simple text-based PDF placeholder
  // In production, use @react-pdf/renderer to create actual PDFs
  const content = `
STAUNTON TRADE - ${REPORT_TYPES.find(r => r.type === type)?.title.toUpperCase()}
${'='.repeat(60)}

Generated: ${new Date().toLocaleString()}
Report Type: ${type}

INCLUDED SECTIONS:
${sections.map(s => `• ${s.replace(/_/g, ' ').toUpperCase()}`).join('\n')}

---

[PDF Content would be generated here using @react-pdf/renderer]

This is a placeholder for the actual PDF content.
In production, this would contain:
- Formatted headers and branding
- Data tables and charts
- Professional styling
- Digital signatures where applicable

---

© ${new Date().getFullYear()} Staunton Trade. All rights reserved.
  `.trim();

  return new Blob([content], { type: 'application/pdf' });
}

// Download helper
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Export Status Component
type ExportStatus = 'idle' | 'preparing' | 'generating' | 'complete' | 'error';

function ExportStatusIndicator({ status, progress }: { status: ExportStatus; progress: number }) {
  const statusConfig = {
    idle: { icon: FileText, label: 'Ready to export', color: 'text-muted-foreground', animate: false },
    preparing: { icon: Loader2, label: 'Preparing data...', color: 'text-amber-500', animate: true },
    generating: { icon: Loader2, label: `Generating PDF (${progress}%)...`, color: 'text-blue-500', animate: true },
    complete: { icon: Check, label: 'Export complete!', color: 'text-emerald-500', animate: false },
    error: { icon: AlertCircle, label: 'Export failed', color: 'text-red-500', animate: false },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
      <Icon 
        size={18} 
        className={cn(config.color, config.animate && 'animate-spin')} 
      />
      <span className={cn('text-sm font-medium', config.color)}>{config.label}</span>
    </div>
  );
}

// Section Selector Component
function SectionSelector({
  sections,
  selectedSections,
  onToggle,
}: {
  sections: string[];
  selectedSections: string[];
  onToggle: (section: string) => void;
}) {
  const sectionLabels: Record<string, string> = {
    basic_info: 'Basic Information',
    parties: 'Parties & Counterparties',
    value: 'Value & Pricing',
    status: 'Current Status',
    timeline: 'Deal Timeline',
    documents: 'Documents',
    notes: 'Notes & Comments',
    summary: 'Executive Summary',
    deals: 'Deal Breakdown',
    volume: 'Volume Analysis',
    revenue: 'Revenue Metrics',
    partners: 'Partner Performance',
    transactions: 'Transaction Log',
    payments: 'Payment History',
    overview: 'Overview',
    charts: 'Charts & Graphs',
    trends: 'Trend Analysis',
    recommendations: 'AI Recommendations',
  };

  return (
    <div className="space-y-2">
      {sections.map((section) => (
        <div key={section} className="flex items-center space-x-2">
          <Checkbox
            id={section}
            checked={selectedSections.includes(section)}
            onCheckedChange={() => onToggle(section)}
          />
          <Label htmlFor={section} className="text-sm cursor-pointer">
            {sectionLabels[section] || section}
          </Label>
        </div>
      ))}
    </div>
  );
}

// Export Button Component
interface ExportButtonProps {
  data?: any;
  defaultType?: ReportType;
  dealId?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function ExportButton({
  data,
  defaultType = 'deal_summary',
  dealId,
  variant = 'outline',
  size = 'default',
  className,
}: ExportButtonProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedType, setSelectedType] = React.useState<ReportType>(defaultType);
  const [selectedSections, setSelectedSections] = React.useState<string[]>([]);
  const [status, setStatus] = React.useState<ExportStatus>('idle');
  const [progress, setProgress] = React.useState(0);

  const reportConfig = REPORT_TYPES.find(r => r.type === selectedType)!;

  // Initialize sections when type changes
  React.useEffect(() => {
    setSelectedSections(reportConfig.sections);
  }, [selectedType, reportConfig.sections]);

  const toggleSection = (section: string) => {
    setSelectedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleExport = async () => {
    try {
      setStatus('preparing');
      setProgress(0);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      setStatus('generating');
      
      const blob = await generatePDFBlob(selectedType, data, selectedSections);
      
      clearInterval(progressInterval);
      setProgress(100);
      setStatus('complete');

      // Generate filename
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = dealId 
        ? `staunton_${selectedType}_${dealId}_${timestamp}.pdf`
        : `staunton_${selectedType}_${timestamp}.pdf`;

      downloadBlob(blob, filename);

      // Reset after delay
      setTimeout(() => {
        setStatus('idle');
        setProgress(0);
        setOpen(false);
      }, 1500);
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Download size={size === 'icon' ? 16 : 14} className={size !== 'icon' ? 'mr-1.5' : ''} />
          {size !== 'icon' && 'Export'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Export Report</DialogTitle>
          <DialogDescription>
            Generate and download a PDF report
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Report Type Selection */}
          <div className="space-y-2">
            <Label>Report Type</Label>
            <Select value={selectedType} onValueChange={(v) => setSelectedType(v as ReportType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REPORT_TYPES.map((report) => (
                  <SelectItem key={report.type} value={report.type}>
                    <div className="flex items-center gap-2">
                      <report.icon size={14} />
                      <span>{report.title}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">{reportConfig.description}</p>
          </div>

          {/* Section Selection */}
          <div className="space-y-2">
            <Label>Include Sections</Label>
            <div className="max-h-48 overflow-y-auto p-3 rounded-lg border border-border">
              <SectionSelector
                sections={reportConfig.sections}
                selectedSections={selectedSections}
                onToggle={toggleSection}
              />
            </div>
          </div>

          {/* Status */}
          {status !== 'idle' && (
            <ExportStatusIndicator status={status} progress={progress} />
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleExport} 
            disabled={status !== 'idle' && status !== 'error' || selectedSections.length === 0}
            className="gap-2"
          >
            {status === 'idle' || status === 'error' ? (
              <>
                <Download size={14} />
                Generate PDF
              </>
            ) : status === 'complete' ? (
              <>
                <Check size={14} />
                Downloaded!
              </>
            ) : (
              <>
                <Loader2 size={14} className="animate-spin" />
                Generating...
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Quick Export Button (no dialog)
interface QuickExportProps {
  type: ReportType;
  data?: any;
  filename?: string;
  className?: string;
}

export function QuickExportButton({ type, data, filename, className }: QuickExportProps) {
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'done'>('idle');

  const handleExport = async () => {
    setStatus('loading');
    
    try {
      const reportConfig = REPORT_TYPES.find(r => r.type === type)!;
      const blob = await generatePDFBlob(type, data, reportConfig.sections);
      
      const timestamp = new Date().toISOString().split('T')[0];
      const defaultFilename = `staunton_${type}_${timestamp}.pdf`;
      
      downloadBlob(blob, filename || defaultFilename);
      
      setStatus('done');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (error) {
      setStatus('idle');
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleExport}
      disabled={status === 'loading'}
      className={cn('gap-1.5', className)}
    >
      {status === 'loading' ? (
        <Loader2 size={14} className="animate-spin" />
      ) : status === 'done' ? (
        <Check size={14} className="text-emerald-500" />
      ) : (
        <Download size={14} />
      )}
      {status === 'done' ? 'Downloaded' : 'PDF'}
    </Button>
  );
}

export default ExportButton;


