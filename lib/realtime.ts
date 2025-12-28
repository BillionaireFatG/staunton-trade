'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

// Check if we're on client
const isClient = typeof window !== 'undefined';

// Event types
export type RealtimeEventType =
  | 'deal:created'
  | 'deal:updated'
  | 'deal:status_changed'
  | 'message:received'
  | 'price:updated'
  | 'notification:new'
  | 'user:online'
  | 'user:offline'
  | 'shipment:updated'
  | 'payment:received'
  | 'document:uploaded';

export interface RealtimeEvent<T = any> {
  type: RealtimeEventType;
  payload: T;
  timestamp: Date;
  id: string;
}

// Connection status
export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

// WebSocket configuration
const WS_CONFIG = {
  reconnectDelay: 1000,
  maxReconnectDelay: 30000,
  reconnectMultiplier: 1.5,
  heartbeatInterval: 30000,
  maxRetries: 10,
};

// Simulated real-time events for demo
const SIMULATED_EVENTS: (() => RealtimeEvent)[] = [
  () => ({
    type: 'price:updated',
    payload: {
      commodity: 'BRENT',
      price: 74.50 + (Math.random() - 0.5) * 2,
      change: (Math.random() - 0.5) * 1,
    },
    timestamp: new Date(),
    id: Math.random().toString(36).substr(2, 9),
  }),
  () => ({
    type: 'price:updated',
    payload: {
      commodity: 'ULSD',
      price: 876.50 + (Math.random() - 0.5) * 10,
      change: (Math.random() - 0.5) * 5,
    },
    timestamp: new Date(),
    id: Math.random().toString(36).substr(2, 9),
  }),
  () => ({
    type: 'deal:updated',
    payload: {
      id: 'deal-1',
      reference: 'STN-2024-000847',
      field: 'progress',
      value: Math.floor(Math.random() * 30) + 70,
    },
    timestamp: new Date(),
    id: Math.random().toString(36).substr(2, 9),
  }),
  () => ({
    type: 'user:online',
    payload: {
      userId: 'user-1',
      name: 'John Smith',
    },
    timestamp: new Date(),
    id: Math.random().toString(36).substr(2, 9),
  }),
  () => ({
    type: 'shipment:updated',
    payload: {
      dealId: 'deal-1',
      status: 'in_transit',
      location: { lat: 51.9 + Math.random(), lng: 4.5 + Math.random() },
      eta: '2024-12-30T14:00:00Z',
    },
    timestamp: new Date(),
    id: Math.random().toString(36).substr(2, 9),
  }),
];

// Create a simulated real-time service
class RealtimeService {
  private listeners: Map<string, Set<(event: RealtimeEvent) => void>> = new Map();
  private globalListeners: Set<(event: RealtimeEvent) => void> = new Set();
  private status: ConnectionStatus = 'disconnected';
  private statusListeners: Set<(status: ConnectionStatus) => void> = new Set();
  private simulationInterval: NodeJS.Timer | null = null;
  private isSimulating: boolean = false;

  connect() {
    this.setStatus('connecting');
    
    // Simulate connection delay
    setTimeout(() => {
      this.setStatus('connected');
      this.startSimulation();
    }, 500);
  }

  disconnect() {
    this.stopSimulation();
    this.setStatus('disconnected');
  }

  private startSimulation() {
    if (this.isSimulating) return;
    this.isSimulating = true;

    // Emit random events every 3-8 seconds
    const emitRandomEvent = () => {
      if (!this.isSimulating) return;
      
      const eventFn = SIMULATED_EVENTS[Math.floor(Math.random() * SIMULATED_EVENTS.length)];
      const event = eventFn();
      this.emit(event);

      const nextDelay = 3000 + Math.random() * 5000;
      this.simulationInterval = setTimeout(emitRandomEvent, nextDelay);
    };

    // Start after initial delay
    this.simulationInterval = setTimeout(emitRandomEvent, 2000);
  }

  private stopSimulation() {
    this.isSimulating = false;
    if (this.simulationInterval) {
      clearTimeout(this.simulationInterval);
      this.simulationInterval = null;
    }
  }

  private setStatus(status: ConnectionStatus) {
    this.status = status;
    this.statusListeners.forEach(listener => listener(status));
  }

  getStatus(): ConnectionStatus {
    return this.status;
  }

  onStatusChange(callback: (status: ConnectionStatus) => void): () => void {
    this.statusListeners.add(callback);
    return () => this.statusListeners.delete(callback);
  }

  subscribe(eventType: RealtimeEventType, callback: (event: RealtimeEvent) => void): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(callback);
    return () => this.listeners.get(eventType)?.delete(callback);
  }

  subscribeAll(callback: (event: RealtimeEvent) => void): () => void {
    this.globalListeners.add(callback);
    return () => this.globalListeners.delete(callback);
  }

  private emit(event: RealtimeEvent) {
    // Notify type-specific listeners
    const typeListeners = this.listeners.get(event.type);
    if (typeListeners) {
      typeListeners.forEach(listener => listener(event));
    }

    // Notify global listeners
    this.globalListeners.forEach(listener => listener(event));
  }

  // Manual event trigger for testing
  trigger(event: RealtimeEvent) {
    this.emit(event);
  }
}

// Singleton instance (only create on client)
let realtimeInstance: RealtimeService | null = null;

export function getRealtimeService(): RealtimeService | null {
  if (!isClient) return null;
  if (!realtimeInstance) {
    realtimeInstance = new RealtimeService();
  }
  return realtimeInstance;
}

// React Hooks

// Hook for connection status
export function useRealtimeStatus(): ConnectionStatus {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');

  useEffect(() => {
    const service = getRealtimeService();
    if (!service) return;
    setStatus(service.getStatus());
    return service.onStatusChange(setStatus);
  }, []);

  return status;
}

// Hook for connecting to realtime service
export function useRealtimeConnection(): {
  status: ConnectionStatus;
  connect: () => void;
  disconnect: () => void;
} {
  const status = useRealtimeStatus();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const connect = useCallback(() => {
    const service = getRealtimeService();
    if (service) service.connect();
  }, []);

  const disconnect = useCallback(() => {
    const service = getRealtimeService();
    if (service) service.disconnect();
  }, []);

  // Auto-connect on mount (deferred to avoid blocking initial render)
  useEffect(() => {
    if (!mounted) return;
    // Defer connection to avoid blocking initial render
    const timer = setTimeout(() => {
      if (status === 'disconnected') {
        connect();
      }
    }, 1000); // Wait 1 second after mount
    
    return () => clearTimeout(timer);
  }, [mounted, status, connect]);

  return { status, connect, disconnect };
}

// Hook for subscribing to specific event types
export function useRealtimeEvent<T = any>(
  eventType: RealtimeEventType,
  callback: (event: RealtimeEvent<T>) => void,
  deps: React.DependencyList = []
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const service = getRealtimeService();
    if (!service) return;
    return service.subscribe(eventType, (event) => {
      callbackRef.current(event as RealtimeEvent<T>);
    });
  }, [eventType, ...deps]);
}

// Hook for subscribing to all events
export function useRealtimeEvents(
  callback: (event: RealtimeEvent) => void,
  deps: React.DependencyList = []
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const service = getRealtimeService();
    if (!service) return;
    return service.subscribeAll((event) => {
      callbackRef.current(event);
    });
  }, deps);
}

// Hook for live price updates
export function useLivePrices() {
  const [prices, setPrices] = useState<Record<string, { price: number; change: number }>>({
    BRENT: { price: 74.82, change: 0 },
    ULSD: { price: 876.50, change: 0 },
    'JET A1': { price: 912.75, change: 0 },
    RBOB: { price: 798.25, change: 0 },
  });

  useRealtimeEvent<{ commodity: string; price: number; change: number }>(
    'price:updated',
    (event) => {
      setPrices(prev => ({
        ...prev,
        [event.payload.commodity]: {
          price: event.payload.price,
          change: event.payload.change,
        },
      }));
    }
  );

  return prices;
}

// Hook for online users
export function useOnlineUsers() {
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  useRealtimeEvent<{ userId: string; name: string }>(
    'user:online',
    (event) => {
      setOnlineUsers(prev => new Set([...prev, event.payload.userId]));
    }
  );

  useRealtimeEvent<{ userId: string }>(
    'user:offline',
    (event) => {
      setOnlineUsers(prev => {
        const next = new Set(prev);
        next.delete(event.payload.userId);
        return next;
      });
    }
  );

  return onlineUsers;
}

// Export for manual testing
export function triggerTestEvent(type: RealtimeEventType, payload: any) {
  const service = getRealtimeService();
  if (!service) return;
  service.trigger({
    type,
    payload,
    timestamp: new Date(),
    id: Math.random().toString(36).substr(2, 9),
  });
}

