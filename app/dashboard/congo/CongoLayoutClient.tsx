'use client';

import { ReactNode, useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  TrendingUp,
  FileText,
  ArrowLeft,
  Settings,
  HelpCircle,
  LogOut,
  Gift,
  MoreHorizontal,
  Bell,
  BarChart3,
  Building2,
  Map,
  Layers,
  Plus,
  Search,
  Clock,
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ThemeCustomizer } from '@/components/ThemeCustomizer';
import { LogoIcon } from '@/components/Logo';

interface CongoLayoutClientProps {
  children: ReactNode;
}

const NAV_GROUPS = [
  {
    label: 'Platform',
    items: [
      { href: '/dashboard/congo',        icon: LayoutDashboard, label: 'Overview',     exact: true },
      { href: '/dashboard/congo/market', icon: TrendingUp,      label: 'Market Data'             },
    ],
  },
  {
    label: 'Trade',
    items: [
      { href: '/dashboard/congo/analytics',      icon: BarChart3,  label: 'Analytics'      },
      { href: '/dashboard/congo/contracts',      icon: FileText,   label: 'Contracts'      },
      { href: '/dashboard/congo/counterparties', icon: Building2,  label: 'Counterparties' },
    ],
  },
  {
    label: 'Logistics',
    items: [
      { href: '/dashboard/congo/tracking', icon: Map,    label: 'Tracking' },
      { href: '/dashboard/congo/reports',  icon: Layers, label: 'Reports'  },
    ],
  },
];

const STATUS = [
  { label: 'Core',    ok: true  },
  { label: 'CEEC',    ok: true  },
  { label: 'DGDA',    ok: true  },
  { label: 'Exports', ok: false },
];

// ── DRC / Kinshasa live clock ─────────────────────────────────────────────────
function useDrcClock() {
  const [time, setTime] = useState('');

  const tick = useCallback(() => {
    setTime(
      new Intl.DateTimeFormat('en-US', {
        timeZone: 'Africa/Kinshasa',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
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

// ── Key DRC commodity snapshot (static demo prices) ──────────────────────────
const PRICE_PILLS = [
  { symbol: 'CU',  label: 'Copper',  price: '9,847',  unit: '/t',   change: '+1.2', up: true  },
  { symbol: 'CO',  label: 'Cobalt',  price: '29,420', unit: '/t',   change: '+0.8', up: true  },
  { symbol: 'AU',  label: 'Gold',    price: '2,341',  unit: '/oz',  change: '-0.3', up: false },
  { symbol: 'COL', label: 'Coltan',  price: '73,500', unit: '/t',   change: '+2.1', up: true  },
];

export default function CongoLayoutClient({ children }: CongoLayoutClientProps) {
  const pathname = usePathname();
  const [userEmail, setUserEmail] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const drcTime = useDrcClock();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) setUserEmail(user.email);
    });
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/sign-in';
  };

  const getPageTitle = () => {
    const map: Record<string, string> = {
      '/dashboard/congo':                'Congo Overview',
      '/dashboard/congo/market':         'Market Data',
      '/dashboard/congo/analytics':      'Analytics',
      '/dashboard/congo/contracts':      'Contracts',
      '/dashboard/congo/counterparties': 'Counterparties',
      '/dashboard/congo/tracking':       'Tracking',
      '/dashboard/congo/reports':        'Reports',
    };
    return map[pathname ?? ''] ?? 'Congo';
  };

  return (
    <div className="min-h-screen bg-background">

      {/* ── Sidebar ────────────────────────────────────────────────────────────── */}
      <aside className="fixed left-0 top-0 bottom-0 w-60 z-50 border-r border-border bg-card hidden md:flex flex-col">

        {/* Logo */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-border flex-shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <LogoIcon size={30} />
            <span className="font-semibold text-sm text-foreground">Staunton Trade</span>
          </Link>
          <Link
            href="/dashboard"
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            title="Back to main"
          >
            <ArrowLeft size={14} />
          </Link>
        </div>

        {/* Section label */}
        <div className="px-4 py-2.5 flex-shrink-0">
          <p className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
            Congo NCE-ECS Platform
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 space-y-4 overflow-y-auto min-h-0 pb-2">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="text-[10px] font-semibold text-muted-foreground/40 uppercase tracking-widest px-2 mb-1">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = item.exact
                    ? pathname === item.href
                    : pathname?.startsWith(item.href) ?? false;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium transition-colors ${
                        active
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
                      }`}
                    >
                      <item.icon size={15} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* System status dots */}
        <div className="px-4 py-2.5 border-t border-border/50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground/40 font-medium uppercase tracking-widest">Systems</span>
            <div className="flex items-center gap-1.5">
              {STATUS.map(({ label, ok }) => (
                <div key={label} className="group relative">
                  <span className={`w-1.5 h-1.5 rounded-full block ${ok ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 bg-popover border border-border rounded text-[10px] text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-2 border-t border-border flex-shrink-0 space-y-0.5">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
          >
            <Settings size={14} />
            Settings
          </Link>
          <Link
            href="/dashboard/help"
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
          >
            <HelpCircle size={14} />
            Help
          </Link>

          {/* User */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md hover:bg-accent/60 transition-colors"
            >
              <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground flex-shrink-0">
                {userEmail ? userEmail.substring(0, 2).toUpperCase() : 'ST'}
              </div>
              <span className="flex-1 text-left text-[13px] font-medium text-foreground truncate">
                {userEmail ? userEmail.split('@')[0] : 'Operator'}
              </span>
              <MoreHorizontal size={13} className="text-muted-foreground flex-shrink-0" />
            </button>

            {showUserMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-popover border border-border rounded-lg shadow-lg py-1 z-50">
                <Link href="/dashboard/settings" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors">
                  <Settings size={13} /> Settings
                </Link>
                <Link href="/dashboard/loyalty" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors">
                  <Gift size={13} /> Rewards
                </Link>
                <hr className="my-1 border-border" />
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-accent transition-colors"
                >
                  <LogOut size={13} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main ───────────────────────────────────────────────────────────────── */}
      <div className="md:pl-60">

        {/* ── Congo top header ──────────────────────────────────────────────────── */}
        <header className="sticky top-0 z-40 h-14 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 hidden md:flex items-center gap-3 px-5">

          {/* Page title */}
          <span className="text-sm font-semibold text-foreground flex-shrink-0 mr-1">
            {getPageTitle()}
          </span>

          {/* Search */}
          <div className="w-48 xl:w-64 flex-shrink-0">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 pointer-events-none" />
              <input
                type="text"
                placeholder="Search…"
                className="w-full h-8 pl-8 pr-10 text-[13px] bg-muted/40 border border-border/60 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 placeholder:text-muted-foreground/40 transition-colors"
              />
              <kbd className="absolute right-2 top-1/2 -translate-y-1/2 hidden xl:inline-flex items-center px-1 py-0.5 rounded border border-border/60 bg-muted/60 text-[10px] font-medium text-muted-foreground/50 select-none pointer-events-none">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* ── Commodity price pills ───────────────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-1.5 flex-shrink-0">
            {PRICE_PILLS.map(({ symbol, label, price, unit, change, up }) => (
              <div
                key={symbol}
                title={`${label} · USD${unit}`}
                className="flex items-center gap-1.5 h-8 px-2.5 rounded-lg border border-border/60 bg-muted/30 font-mono text-[11px] select-none cursor-default hover:bg-muted/60 transition-colors"
              >
                <span className="font-bold text-muted-foreground/60 text-[10px] tracking-wider">{symbol}</span>
                <span className="font-semibold text-foreground/80 tabular-nums">{price}</span>
                <span className={`font-semibold tabular-nums text-[10px] ${up ? 'text-emerald-500' : 'text-red-400'}`}>
                  {up ? '▲' : '▼'}{change}%
                </span>
              </div>
            ))}
          </div>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-2 flex-shrink-0">

            {/* DRC / Kinshasa live clock */}
            <div className="hidden xl:flex items-center gap-1.5 h-8 px-2.5 rounded-lg border border-border/60 bg-muted/30 font-mono text-[11px] select-none">
              <Clock size={11} className="text-muted-foreground/50" />
              <span className="text-muted-foreground/60 font-bold tracking-wider">DRC</span>
              <span className="text-foreground/70 tabular-nums">{drcTime}</span>
            </div>

            {/* New Deal */}
            <Link
              href="/dashboard/congo/market"
              className="flex items-center gap-1.5 h-8 px-3 bg-primary text-primary-foreground rounded-lg text-[13px] font-semibold hover:bg-primary/90 active:scale-95 transition-all"
            >
              <Plus size={14} />
              New Deal
            </Link>

            <ThemeCustomizer variant="dropdown" />

            <button className="relative p-2 rounded-lg hover:bg-accent transition-colors">
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
            </button>
          </div>
        </header>

        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
