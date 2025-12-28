'use client';

import { Check, Clock, AlertCircle, Truck, FileCheck, Ship, Warehouse, ArrowRight } from 'lucide-react';
import type { DealStatus } from '@/types/database';
import { DEAL_STAGES } from '@/types/database';

interface DealProgressProps {
  status: DealStatus;
  referenceNumber: string;
  showMilestones?: boolean;
}

const milestones = [
  { status: 'draft', label: 'Draft', icon: Clock },
  { status: 'pending', label: 'Pending', icon: Clock },
  { status: 'counterparty_review', label: 'Review', icon: FileCheck },
  { status: 'in_progress', label: 'In Progress', icon: ArrowRight },
  { status: 'injection_scheduled', label: 'Scheduled', icon: Warehouse },
  { status: 'injection_in_progress', label: 'Injection', icon: Truck },
  { status: 'verification', label: 'Verification', icon: FileCheck },
  { status: 'completed', label: 'Completed', icon: Check },
];

export function DealProgress({ status, referenceNumber, showMilestones = true }: DealProgressProps) {
  const progress = DEAL_STAGES[status] || 0;
  const isCompleted = status === 'completed';
  const isCancelled = status === 'cancelled' || status === 'disputed';

  const getProgressColor = () => {
    if (isCancelled) return 'bg-[#ef4444]';
    if (isCompleted) return 'bg-[#10b981]';
    return 'bg-gradient-to-r from-[#3b82f6] to-[#60a5fa]';
  };

  const currentMilestoneIndex = milestones.findIndex(m => m.status === status);

  return (
    <div className="space-y-4">
      {/* Reference Number & Progress Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-[#555] uppercase tracking-wider">Reference</span>
            <span className="px-2 py-0.5 rounded bg-[#1a1a1a] border border-[#262626] font-mono text-[13px] text-white">
              {referenceNumber}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-bold ${isCompleted ? 'text-[#10b981]' : isCancelled ? 'text-[#ef4444]' : 'text-white'}`}>
              {progress}%
            </span>
            <span className="text-[11px] text-[#555]">complete</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-2 rounded-full bg-[#1a1a1a] overflow-hidden">
          <div 
            className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${getProgressColor()}`}
            style={{ width: `${progress}%` }}
          />
          {/* Animated pulse for active deals */}
          {!isCompleted && !isCancelled && (
            <div 
              className="absolute top-0 h-full w-8 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"
              style={{ left: `${progress - 4}%` }}
            />
          )}
        </div>
      </div>

      {/* Milestones */}
      {showMilestones && (
        <div className="relative pt-4">
          <div className="flex justify-between">
            {milestones.slice(0, -1).map((milestone, index) => {
              const Icon = milestone.icon;
              const isPast = index < currentMilestoneIndex;
              const isCurrent = index === currentMilestoneIndex;
              const isFuture = index > currentMilestoneIndex;

              return (
                <div key={milestone.status} className="flex flex-col items-center relative z-10">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center transition-all
                    ${isPast ? 'bg-[#10b981] text-white' : 
                      isCurrent ? 'bg-[#3b82f6] text-white ring-4 ring-[#3b82f6]/20' : 
                      'bg-[#1a1a1a] text-[#555] border border-[#262626]'}
                  `}>
                    {isPast ? <Check size={14} /> : <Icon size={14} />}
                  </div>
                  <span className={`
                    mt-2 text-[10px] font-medium
                    ${isPast ? 'text-[#10b981]' : isCurrent ? 'text-white' : 'text-[#555]'}
                  `}>
                    {milestone.label}
                  </span>
                </div>
              );
            })}
            {/* Completed milestone */}
            <div className="flex flex-col items-center relative z-10">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center transition-all
                ${isCompleted ? 'bg-[#10b981] text-white ring-4 ring-[#10b981]/20' : 
                  'bg-[#1a1a1a] text-[#555] border border-[#262626]'}
              `}>
                <Check size={14} />
              </div>
              <span className={`
                mt-2 text-[10px] font-medium
                ${isCompleted ? 'text-[#10b981]' : 'text-[#555]'}
              `}>
                Completed
              </span>
            </div>
          </div>
          
          {/* Connecting line */}
          <div className="absolute top-8 left-4 right-4 h-0.5 bg-[#1a1a1a] -z-0" />
          <div 
            className="absolute top-8 left-4 h-0.5 bg-[#10b981] transition-all duration-500 -z-0"
            style={{ width: `${(currentMilestoneIndex / (milestones.length - 1)) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
}

// Compact version for table cells
export function DealProgressBadge({ status, progress }: { status: DealStatus; progress: number }) {
  const getStatusConfig = () => {
    switch (status) {
      case 'completed':
        return { bg: 'bg-[#10b981]/10', text: 'text-[#10b981]', border: 'border-[#10b981]/20' };
      case 'cancelled':
      case 'disputed':
        return { bg: 'bg-[#ef4444]/10', text: 'text-[#ef4444]', border: 'border-[#ef4444]/20' };
      case 'injection_in_progress':
      case 'verification':
        return { bg: 'bg-[#3b82f6]/10', text: 'text-[#3b82f6]', border: 'border-[#3b82f6]/20' };
      default:
        return { bg: 'bg-[#f59e0b]/10', text: 'text-[#f59e0b]', border: 'border-[#f59e0b]/20' };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border ${config.bg} ${config.border}`}>
      <div className="w-12 h-1.5 rounded-full bg-[#1a1a1a] overflow-hidden">
        <div 
          className={`h-full rounded-full ${config.text.replace('text-', 'bg-')}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className={`text-[11px] font-semibold ${config.text}`}>{progress}%</span>
    </div>
  );
}


