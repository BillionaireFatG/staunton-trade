'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Bell,
  BellRing,
  X,
  Check,
  CheckCheck,
  AlertCircle,
  Info,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  FileText,
  DollarSign,
  Package,
  Shield,
  Sparkles,
  Clock,
  ChevronRight,
  Settings,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';

// Notification Types
export type NotificationType = 
  | 'deal_update'
  | 'message'
  | 'price_alert'
  | 'document'
  | 'payment'
  | 'shipment'
  | 'verification'
  | 'system'
  | 'success'
  | 'warning'
  | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, any>;
}

// Icon mapping for notification types
const notificationIcons: Record<NotificationType, React.ComponentType<any>> = {
  deal_update: Package,
  message: MessageSquare,
  price_alert: TrendingUp,
  document: FileText,
  payment: DollarSign,
  shipment: Package,
  verification: Shield,
  system: Info,
  success: Check,
  warning: AlertCircle,
  error: AlertCircle,
};

// Color mapping for notification types
const notificationColors: Record<NotificationType, { icon: string; bg: string; border: string }> = {
  deal_update: { icon: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  message: { icon: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  price_alert: { icon: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  document: { icon: 'text-cyan-500', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
  payment: { icon: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' },
  shipment: { icon: 'text-indigo-500', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
  verification: { icon: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  system: { icon: 'text-slate-500', bg: 'bg-slate-500/10', border: 'border-slate-500/20' },
  success: { icon: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' },
  warning: { icon: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  error: { icon: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' },
};

// Format relative time
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

// Single Notification Item
interface NotificationItemProps {
  notification: Notification;
  onMarkRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: (notification: Notification) => void;
}

function NotificationItem({ 
  notification, 
  onMarkRead, 
  onDelete,
  onClick 
}: NotificationItemProps) {
  const Icon = notificationIcons[notification.type];
  const colors = notificationColors[notification.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className={cn(
        'group relative p-3 border-b border-border last:border-b-0 cursor-pointer transition-colors',
        notification.read ? 'bg-transparent' : 'bg-primary/5',
        'hover:bg-muted/50'
      )}
      onClick={() => onClick?.(notification)}
    >
      <div className="flex gap-3">
        {/* Icon */}
        <div className={cn(
          'flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center',
          colors.bg
        )}>
          <Icon size={16} className={colors.icon} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className={cn(
              'text-sm truncate',
              notification.read ? 'text-muted-foreground' : 'text-foreground font-medium'
            )}>
              {notification.title}
            </p>
            <span className="text-[10px] text-muted-foreground flex-shrink-0">
              {formatRelativeTime(notification.timestamp)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
            {notification.message}
          </p>
          
          {notification.actionLabel && (
            <Button 
              variant="link" 
              size="sm" 
              className="h-auto p-0 mt-1.5 text-xs text-primary hover:text-primary/80"
            >
              {notification.actionLabel}
              <ChevronRight size={12} className="ml-0.5" />
            </Button>
          )}
        </div>

        {/* Unread indicator */}
        {!notification.read && (
          <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
        )}
      </div>

      {/* Actions on hover */}
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        {!notification.read && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation();
              onMarkRead?.(notification.id);
            }}
          >
            <Check size={12} />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-destructive hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(notification.id);
          }}
        >
          <X size={12} />
        </Button>
      </div>
    </motion.div>
  );
}

// Notification Bell Button
interface NotificationBellProps {
  notifications: Notification[];
  onMarkRead?: (id: string) => void;
  onMarkAllRead?: () => void;
  onDelete?: (id: string) => void;
  onClick?: (notification: Notification) => void;
  className?: string;
}

export function NotificationBell({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onDelete,
  onClick,
  className,
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn('relative', className)}
        >
          <motion.div
            animate={unreadCount > 0 ? { rotate: [0, 15, -15, 0] } : {}}
            transition={{ duration: 0.5, repeat: unreadCount > 0 ? Infinity : 0, repeatDelay: 3 }}
          >
            {unreadCount > 0 ? (
              <BellRing size={18} className="text-foreground" />
            ) : (
              <Bell size={18} className="text-muted-foreground" />
            )}
          </motion.div>
          
          {/* Badge */}
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-destructive flex items-center justify-center"
              >
                <span className="text-[10px] font-bold text-destructive-foreground">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="end" 
        className="w-80 p-0 overflow-hidden"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-xs"
                onClick={onMarkAllRead}
              >
                <CheckCheck size={12} className="mr-1" />
                Mark all read
              </Button>
            )}
          </div>
        </div>

        {/* Notification List */}
        <ScrollArea className="max-h-96">
          {notifications.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                <Bell size={20} className="text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No notifications yet</p>
              <p className="text-xs text-muted-foreground mt-1">We'll notify you when something happens</p>
            </div>
          ) : (
            <AnimatePresence>
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkRead={onMarkRead}
                  onDelete={onDelete}
                  onClick={onClick}
                />
              ))}
            </AnimatePresence>
          )}
        </ScrollArea>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="px-4 py-2 border-t border-border bg-muted/30">
            <Button variant="ghost" size="sm" className="w-full h-8 text-xs">
              View all notifications
              <ChevronRight size={12} className="ml-1" />
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Toast Notifications
interface ToastProps {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  onClose?: (id: string) => void;
}

export function Toast({ id, type, title, message, duration = 5000, onClose }: ToastProps) {
  const Icon = notificationIcons[type];
  const colors = notificationColors[type];
  const [progress, setProgress] = React.useState(100);

  React.useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      
      if (remaining <= 0) {
        clearInterval(interval);
        onClose?.(id);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [id, duration, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className={cn(
        'relative overflow-hidden rounded-lg border bg-card shadow-lg',
        colors.border
      )}
    >
      <div className="p-4 flex gap-3">
        <div className={cn(
          'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
          colors.bg
        )}>
          <Icon size={16} className={colors.icon} />
        </div>
        <div className="flex-1 min-w-0 pr-6">
          <p className="text-sm font-medium text-foreground">{title}</p>
          {message && (
            <p className="text-xs text-muted-foreground mt-0.5">{message}</p>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1 h-7 w-7"
          onClick={() => onClose?.(id)}
        >
          <X size={14} />
        </Button>
      </div>
      
      {/* Progress bar */}
      <div className="h-0.5 bg-muted">
        <motion.div
          className={cn('h-full', colors.bg.replace('/10', ''))}
          style={{ width: `${progress}%` }}
        />
      </div>
    </motion.div>
  );
}

// Toast Container
interface ToastContainerProps {
  toasts: ToastProps[];
  onClose: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export function ToastContainer({ 
  toasts, 
  onClose,
  position = 'bottom-right' 
}: ToastContainerProps) {
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  return (
    <div className={cn(
      'fixed z-50 flex flex-col gap-2 w-80',
      positionClasses[position]
    )}>
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={onClose} />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Hook for managing notifications
export function useNotifications() {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  const addNotification = React.useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
    return newNotification.id;
  }, []);

  const markRead = React.useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllRead = React.useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const deleteNotification = React.useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const showToast = React.useCallback((toast: Omit<ToastProps, 'id' | 'onClose'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
    return id;
  }, []);

  const closeToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return {
    notifications,
    toasts,
    addNotification,
    markRead,
    markAllRead,
    deleteNotification,
    showToast,
    closeToast,
  };
}

export default NotificationBell;


