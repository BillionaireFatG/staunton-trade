'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  MessageSquare,
  Briefcase,
  TrendingUp,
  Plus,
  User,
  Menu,
  X,
  Home,
  Search,
  Bell,
  Settings,
  LogOut,
  Building2,
  ChevronRight,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Navigation items
const BOTTOM_NAV_ITEMS = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/dashboard/deals', icon: Briefcase, label: 'Deals' },
  { href: '/dashboard/deals/new', icon: Plus, label: 'Create', isAction: true },
  { href: '/dashboard/messages', icon: MessageSquare, label: 'Messages', badge: 3 },
  { href: '/dashboard/market', icon: TrendingUp, label: 'Market' },
];

const MENU_ITEMS = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/deals', icon: Briefcase, label: 'Deals' },
  { href: '/dashboard/messages', icon: MessageSquare, label: 'Messages' },
  { href: '/dashboard/market', icon: TrendingUp, label: 'Market' },
  { href: '/dashboard/counterparties', icon: User, label: 'Counterparties' },
  { href: '/dashboard/analytics', icon: Sparkles, label: 'Analytics' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
  { href: '/dashboard/help', icon: HelpCircle, label: 'Help & Support' },
];

// Bottom Navigation Bar
interface BottomNavProps {
  className?: string;
}

export function BottomNav({ className }: BottomNavProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname?.startsWith(href);
  };

  return (
    <nav className={cn(
      'fixed bottom-0 left-0 right-0 z-50 md:hidden',
      'bg-background/95 backdrop-blur-lg border-t border-border',
      'safe-area-pb',
      className
    )}>
      <div className="flex items-center justify-around h-16 px-2">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          
          if (item.isAction) {
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="relative -mt-6"
                >
                  <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                    <item.icon size={24} className="text-primary-foreground" />
                  </div>
                </motion.div>
              </Link>
            );
          }

          return (
            <Link key={item.href} href={item.href} className="flex-1">
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={cn(
                  'flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-colors',
                  active ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                <div className="relative">
                  <item.icon size={22} />
                  {item.badge && (
                    <Badge className="absolute -top-1.5 -right-1.5 h-4 min-w-[16px] px-1 text-[10px]">
                      {item.badge}
                    </Badge>
                  )}
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
                {active && (
                  <motion.div
                    layoutId="bottom-nav-indicator"
                    className="absolute bottom-0 w-12 h-0.5 rounded-full bg-primary"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

// Mobile Menu Drawer
interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user?: {
    email: string;
    name?: string;
    avatar?: string;
  };
  onSignOut?: () => void;
}

export function MobileMenu({ isOpen, onClose, user, onSignOut }: MobileMenuProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname?.startsWith(href);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border md:hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Building2 size={16} className="text-primary-foreground" />
                </div>
                <span className="font-semibold text-foreground">Staunton Trade</span>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X size={20} />
              </Button>
            </div>

            {/* User */}
            {user && (
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user.email.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {user.name || user.email.split('@')[0]}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="p-4 border-b border-border">
              <div className="grid grid-cols-3 gap-2">
                <Link href="/dashboard/deals/new" onClick={onClose}>
                  <div className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-muted hover:bg-accent transition-colors">
                    <Plus size={20} className="text-primary" />
                    <span className="text-[10px] font-medium text-muted-foreground">New Deal</span>
                  </div>
                </Link>
                <button className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-muted hover:bg-accent transition-colors">
                  <Search size={20} className="text-muted-foreground" />
                  <span className="text-[10px] font-medium text-muted-foreground">Search</span>
                </button>
                <button className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-muted hover:bg-accent transition-colors relative">
                  <Bell size={20} className="text-muted-foreground" />
                  <Badge className="absolute top-2 right-3 h-4 min-w-[16px] px-1 text-[10px]">5</Badge>
                  <span className="text-[10px] font-medium text-muted-foreground">Alerts</span>
                </button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-2">
              {MENU_ITEMS.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                      active
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    )}
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.label}</span>
                    <ChevronRight size={16} className="ml-auto opacity-50" />
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-border">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                onClick={() => {
                  onSignOut?.();
                  onClose();
                }}
              >
                <LogOut size={18} />
                Sign Out
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Mobile Header
interface MobileHeaderProps {
  title?: string;
  onMenuClick: () => void;
  notificationCount?: number;
}

export function MobileHeader({ title, onMenuClick, notificationCount = 0 }: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-40 md:hidden bg-background/95 backdrop-blur-lg border-b border-border">
      <div className="flex items-center justify-between h-14 px-4">
        <Button variant="ghost" size="icon" onClick={onMenuClick}>
          <Menu size={22} />
        </Button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <Building2 size={14} className="text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground">
            {title || 'Staunton Trade'}
          </span>
        </div>

        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} />
          {notificationCount > 0 && (
            <Badge className="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] px-1 text-[10px]">
              {notificationCount}
            </Badge>
          )}
        </Button>
      </div>
    </header>
  );
}

// Hook to detect mobile
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

export default BottomNav;


