'use client';

import { ReactNode, useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Briefcase, 
  MessageSquare, 
  TrendingUp, 
  Clock,
  BarChart3,
  Users,
  FileText,
  Settings,
  HelpCircle,
  LogOut,
  Gift,
  Plus,
  MoreHorizontal,
  Bell,
  Search,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { ThemeCustomizer } from '@/components/ThemeCustomizer';
import { LogoIcon } from '@/components/Logo';

interface DashboardLayoutClientProps {
  children: ReactNode;
}

function useEstClock() {
  const [time, setTime] = useState('');
  const tick = useCallback(() => {
    setTime(
      new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
      }).format(new Date())
    );
  }, []);
  useEffect(() => {
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tick]);
  return time;
}

export default function DashboardLayoutClient({ children }: DashboardLayoutClientProps) {
  const pathname = usePathname();
  const [userEmail, setUserEmail] = useState<string>('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const estTime = useEstClock();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
      }
    };
    fetchUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/sign-in';
  };

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/messages', icon: MessageSquare, label: 'Messages' },
    { href: '/dashboard/deals', icon: Briefcase, label: 'Deals' },
    { href: '/dashboard/counterparties', icon: Users, label: 'Counterparties' },
    { href: '/dashboard/lifecycle', icon: Clock, label: 'Lifecycle' },
    { href: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
  ];

  const documentsItems = [
    { href: '/dashboard/documents', icon: FileText, label: 'Documents' },
    { href: '/dashboard/reports', icon: FileText, label: 'Reports' },
    { href: '/dashboard/market', icon: TrendingUp, label: 'Market Data' },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname?.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-60 z-50 border-r border-border bg-card hidden md:flex flex-col">
        {/* Logo */}
        <div className="h-14 flex items-center px-4 border-b border-border flex-shrink-0">
          <a href="/dashboard" className="flex items-center gap-2.5">
            <LogoIcon size={28} className="rounded-lg" />
            <span className="font-semibold text-foreground">Staunton Trade</span>
          </a>
        </div>

        {/* Quick Create Button */}
        <div className="p-3 flex-shrink-0">
          <a 
            href="/dashboard/deals/new"
            className="flex items-center justify-center gap-2 h-9 w-full bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90"
          >
            <Plus size={16} />
            Quick Create
          </a>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </a>
          ))}

          <div className="pt-4 pb-2">
            <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Documents
            </p>
          </div>
          
          {documentsItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </a>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="p-3 border-t border-border space-y-1 flex-shrink-0">
          <a
            href="/dashboard/settings"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive('/dashboard/settings')
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            <Settings size={18} />
            Settings
          </a>
          <a
            href="/dashboard/help"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive('/dashboard/help')
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            <HelpCircle size={18} />
            Get Help
          </a>
          
          {/* User Menu */}
          <div className="relative mt-2">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-xs font-semibold text-white">
                {userEmail ? userEmail.substring(0, 2).toUpperCase() : 'ST'}
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {userEmail ? userEmail.split('@')[0] : 'User'}
                </p>
              </div>
              <MoreHorizontal size={16} className="text-muted-foreground" />
            </button>
            
            {showUserMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-popover border border-border rounded-lg shadow-lg py-1 z-50">
                <a href="/dashboard/settings" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent">
                  <Settings size={14} />
                  Settings
                </a>
                <a href="/dashboard/loyalty" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent">
                  <Gift size={14} />
                  Rewards
                </a>
                <hr className="my-1 border-border" />
                <button 
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-accent"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="md:pl-60">
        {/* Top Header */}
        <header className="sticky top-0 z-40 h-14 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 hidden md:flex items-center gap-4 px-5">

          {/* Page title */}
          <span className="text-sm font-semibold text-foreground flex-shrink-0">
            {pathname === '/dashboard' ? 'Dashboard' :
             pathname?.split('/').pop()?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Dashboard'}
          </span>

          {/* Search */}
          <div className="flex-1 max-w-sm">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 pointer-events-none" />
              <input
                type="text"
                placeholder="Search deals, counterparties, documents…"
                className="w-full h-8 pl-8 pr-10 text-[13px] bg-muted/40 border border-border/60 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 placeholder:text-muted-foreground/40 transition-colors"
              />
              <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 inline-flex items-center px-1 py-0.5 rounded border border-border/60 bg-muted/60 text-[10px] font-medium text-muted-foreground/50 select-none pointer-events-none">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-2 flex-shrink-0">

            {/* EST clock */}
            <div className="hidden lg:flex items-center gap-1.5 h-8 px-2.5 rounded-lg border border-border/60 bg-muted/30 font-mono text-[11px] select-none">
              <Clock size={11} className="text-muted-foreground/50" />
              <span className="text-muted-foreground/60 font-semibold tracking-wider">EST</span>
              <span className="text-foreground/70 tabular-nums">{estTime}</span>
            </div>

            {/* New Deal */}
            <a
              href="/dashboard/deals/new"
              className="flex items-center gap-1.5 h-8 px-3 bg-primary text-primary-foreground rounded-lg text-[13px] font-semibold hover:bg-primary/90 active:scale-95 transition-all"
            >
              <Plus size={14} />
              New Deal
            </a>

            <ThemeCustomizer variant="dropdown" />

            <button className="relative p-2 rounded-lg hover:bg-accent transition-colors">
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
