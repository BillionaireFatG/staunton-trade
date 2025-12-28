'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Wifi, WifiOff, Loader2, AlertCircle, Zap } from 'lucide-react';
import { useRealtimeConnection, useRealtimeEvents, RealtimeEvent } from '@/lib/realtime';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Status Indicator Component
export function RealtimeStatusIndicator({ className }: { className?: string }) {
  const { status, connect, disconnect } = useRealtimeConnection();
  const [eventCount, setEventCount] = React.useState(0);
  const [showPulse, setShowPulse] = React.useState(false);

  // Count events
  useRealtimeEvents((event) => {
    setEventCount(prev => prev + 1);
    setShowPulse(true);
    setTimeout(() => setShowPulse(false), 500);
  });

  const statusConfig = {
    connecting: {
      icon: Loader2,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500',
      label: 'Connecting...',
      animate: true,
    },
    connected: {
      icon: Wifi,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500',
      label: 'Live',
      animate: false,
    },
    disconnected: {
      icon: WifiOff,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted-foreground',
      label: 'Offline',
      animate: false,
    },
    error: {
      icon: AlertCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-500',
      label: 'Error',
      animate: false,
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => status === 'disconnected' ? connect() : disconnect()}
            className={cn(
              'relative flex items-center gap-1.5 px-2 py-1 rounded-full transition-colors',
              'hover:bg-muted/50',
              className
            )}
          >
            {/* Status Dot */}
            <span className="relative flex h-2 w-2">
              {status === 'connected' && (
                <span className={cn(
                  'absolute inline-flex h-full w-full rounded-full opacity-75',
                  config.bgColor,
                  showPulse && 'animate-ping'
                )} />
              )}
              <span className={cn(
                'relative inline-flex rounded-full h-2 w-2',
                config.bgColor
              )} />
            </span>

            {/* Label */}
            <span className={cn('text-xs font-medium', config.color)}>
              {config.label}
            </span>

            {/* Icon */}
            <Icon 
              size={12} 
              className={cn(config.color, config.animate && 'animate-spin')} 
            />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-xs">
            <p className="font-medium">Real-time Updates</p>
            <p className="text-muted-foreground">
              {status === 'connected' 
                ? `Connected · ${eventCount} events received`
                : status === 'connecting'
                ? 'Establishing connection...'
                : 'Click to reconnect'}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Live Activity Feed Component
interface LiveActivityFeedProps {
  maxItems?: number;
  className?: string;
}

export function LiveActivityFeed({ maxItems = 5, className }: LiveActivityFeedProps) {
  const [events, setEvents] = React.useState<RealtimeEvent[]>([]);
  const { status } = useRealtimeConnection();

  useRealtimeEvents((event) => {
    setEvents(prev => [event, ...prev].slice(0, maxItems));
  });

  const getEventLabel = (event: RealtimeEvent) => {
    switch (event.type) {
      case 'price:updated':
        return `${event.payload.commodity} price updated to $${event.payload.price.toFixed(2)}`;
      case 'deal:updated':
        return `Deal ${event.payload.reference} updated`;
      case 'user:online':
        return `${event.payload.name} is now online`;
      case 'user:offline':
        return `User went offline`;
      case 'shipment:updated':
        return `Shipment status: ${event.payload.status}`;
      case 'message:received':
        return `New message received`;
      case 'payment:received':
        return `Payment received`;
      default:
        return event.type;
    }
  };

  const getEventIcon = (event: RealtimeEvent) => {
    switch (event.type) {
      case 'price:updated':
        return '📊';
      case 'deal:updated':
        return '📋';
      case 'user:online':
        return '🟢';
      case 'shipment:updated':
        return '🚢';
      case 'message:received':
        return '💬';
      case 'payment:received':
        return '💰';
      default:
        return '⚡';
    }
  };

  if (status !== 'connected') {
    return (
      <div className={cn('p-4 text-center', className)}>
        <WifiOff size={24} className="mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">Not connected</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between px-1 mb-3">
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-primary" />
          <span className="text-xs font-medium text-foreground">Live Feed</span>
        </div>
        <Badge variant="secondary" className="text-[10px]">
          <span className="relative flex h-1.5 w-1.5 mr-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
          </span>
          Live
        </Badge>
      </div>

      <AnimatePresence mode="popLayout">
        {events.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 text-center"
          >
            <p className="text-xs text-muted-foreground">Waiting for updates...</p>
          </motion.div>
        ) : (
          events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, x: 20, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 text-xs"
            >
              <span>{getEventIcon(event)}</span>
              <span className="flex-1 truncate text-muted-foreground">
                {getEventLabel(event)}
              </span>
              <span className="text-[10px] text-muted-foreground/60">
                {new Date(event.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </span>
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  );
}

// Price Ticker Component
export function LivePriceTicker({ className }: { className?: string }) {
  const [prices, setPrices] = React.useState<Record<string, { price: number; change: number; flash: boolean }>>({
    BRENT: { price: 74.82, change: 0, flash: false },
    ULSD: { price: 876.50, change: 0, flash: false },
  });

  useRealtimeEvents((event) => {
    if (event.type === 'price:updated') {
      const { commodity, price, change } = event.payload;
      setPrices(prev => ({
        ...prev,
        [commodity]: { price, change, flash: true },
      }));

      // Remove flash after animation
      setTimeout(() => {
        setPrices(prev => ({
          ...prev,
          [commodity]: { ...prev[commodity], flash: false },
        }));
      }, 500);
    }
  });

  return (
    <div className={cn('flex items-center gap-4', className)}>
      {Object.entries(prices).map(([commodity, data]) => (
        <motion.div
          key={commodity}
          animate={data.flash ? { scale: [1, 1.05, 1] } : {}}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors',
            data.flash && (data.change >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10')
          )}
        >
          <span className="text-xs font-medium text-muted-foreground">{commodity}</span>
          <span className="text-sm font-semibold text-foreground tabular-nums">
            ${data.price.toFixed(2)}
          </span>
          <span className={cn(
            'text-[10px] font-medium tabular-nums',
            data.change >= 0 ? 'text-emerald-500' : 'text-red-500'
          )}>
            {data.change >= 0 ? '+' : ''}{data.change.toFixed(2)}%
          </span>
        </motion.div>
      ))}
    </div>
  );
}

export default RealtimeStatusIndicator;


