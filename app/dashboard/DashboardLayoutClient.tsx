'use client';

import { ReactNode, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
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
  Mic,
  Search,
  ChevronDown,
  CheckCircle2,
  Upload,
  Menu,
  X
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { supabase } from '@/lib/supabase';
import { ThemeCustomizer } from '@/components/ThemeCustomizer';
import { useUnreadMessages } from '@/lib/useUnreadMessages';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useProfile } from '@/components/ProfileProvider';

interface DashboardLayoutClientProps {
  children: ReactNode;
}

export default function DashboardLayoutClient({ children }: DashboardLayoutClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile } = useProfile();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNewMenu, setShowNewMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const { unreadCount } = useUnreadMessages();

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
      if (e.key === 'Escape') {
        setShowSearch(false);
        setShowUserMenu(false);
        setShowNewMenu(false);
        setShowNotifications(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSignOut = async () => {
    try {
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Clear all auth-related data from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('staunton-auth-token');
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('sb-') || key.includes('supabase')) {
            localStorage.removeItem(key);
          }
        });
      }
      
      // Hard redirect to sign-in page
      window.location.href = '/sign-in';
    } catch (error) {
      console.error('Error signing out:', error);
      // Force redirect even if sign out fails
      window.location.href = '/sign-in';
    }
  };

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/voice-rooms', icon: Mic, label: 'Voice Rooms' },
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getContextDisplay = () => {
    if (pathname?.includes('/deals/') && pathname !== '/dashboard/deals') {
      const dealId = pathname.split('/').pop();
      return (
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm font-medium">Deal View</span>
          <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">Active</Badge>
        </div>
      );
    }
    if (pathname === '/dashboard') {
      return (
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">Dashboard</span>
          <span className="text-muted-foreground">•</span>
          <span className="font-medium">Ready for trading</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-3 text-sm">
        <span className="font-medium capitalize">{pathname?.split('/').pop()?.replace(/-/g, ' ') || 'Dashboard'}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-60 z-50 border-r border-border bg-card hidden md:flex flex-col">
        <div className="h-16 flex items-center px-4 border-b border-border flex-shrink-0">
          <a href="/dashboard" className="flex items-center">
            <Logo size="sm" />
          </a>
        </div>

        <div className="p-3 flex-shrink-0">
          <button 
            onClick={() => router.push('/dashboard/deals/new')}
            className="flex items-center justify-center gap-2 h-10 w-full bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus size={16} />
            New Deal
          </button>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive(item.href)
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              <item.icon size={18} />
              <span className="flex-1">{item.label}</span>
              {item.href === '/dashboard/messages' && unreadCount > 0 && (
                <span className="h-5 min-w-[20px] px-1.5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </a>
          ))}

          <div className="pt-6 pb-2">
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Resources
            </p>
          </div>
          
          {documentsItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive(item.href)
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </a>
          ))}
        </nav>

        <div className="p-3 border-t border-border space-y-1 flex-shrink-0">
          <a
            href="/dashboard/loyalty"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive('/dashboard/loyalty')
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            <Gift size={18} />
            Rewards
          </a>
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
            Support
          </a>
          
          <div className="relative mt-3 pt-3 border-t border-border">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-accent transition-colors"
            >
              <Avatar className="h-9 w-9">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground text-sm font-semibold">
                  {profile?.full_name?.substring(0, 2).toUpperCase() || 'ST'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {profile?.full_name || 'Trader'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {profile?.company_name || 'Staunton Trade'}
                </p>
              </div>
              <ChevronDown size={14} className="text-muted-foreground" />
            </button>
            
            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-popover border border-border rounded-xl shadow-xl py-2 z-50 animate-in slide-in-from-bottom-2">
                  <div className="px-3 py-2 border-b border-border mb-1">
                    <p className="text-sm font-medium">{profile?.full_name}</p>
                    <p className="text-xs text-muted-foreground">{profile?.company_name}</p>
                    {profile?.verification_status === 'verified' && (
                      <Badge variant="outline" className="mt-2 bg-green-500/10 text-green-600 border-green-500/20">
                        <CheckCircle2 size={12} className="mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <a href="/profile/edit" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors">
                    <Users size={14} />
                    View Profile
                  </a>
                  <a href="/dashboard/settings" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors">
                    <Settings size={14} />
                    Settings
                  </a>
                  <a href="/dashboard/loyalty" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors">
                    <Gift size={14} />
                    Rewards
                  </a>
                  <div className="px-3 py-2">
                    <ThemeCustomizer variant="inline" />
                  </div>
                  <hr className="my-1 border-border" />
                  <button 
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-background/95 backdrop-blur border-b border-border z-50 flex items-center justify-between px-4">
        <button onClick={() => setShowMobileMenu(true)} className="p-2 -ml-2 hover:bg-accent rounded-lg">
          <Menu size={20} />
        </button>
        <Logo size="sm" />
        <div className="flex items-center gap-1">
          <button onClick={() => setShowSearch(true)} className="p-2 hover:bg-accent rounded-lg">
            <Search size={18} />
          </button>
          <a href="/dashboard/messages" className="p-2 hover:bg-accent rounded-lg relative">
            <MessageSquare size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
            )}
          </a>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowMobileMenu(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-card border-r border-border animate-in slide-in-from-left">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <Logo size="sm" />
              <button onClick={() => setShowMobileMenu(false)} className="p-2 hover:bg-accent rounded-lg">
                <X size={20} />
              </button>
            </div>
            <nav className="p-3 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setShowMobileMenu(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <item.icon size={20} />
                  {item.label}
                </a>
              ))}
              <a
                href="/dashboard/loyalty"
                onClick={() => setShowMobileMenu(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/dashboard/loyalty')
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                <Gift size={20} />
                Rewards & Loyalty
              </a>
            </nav>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
              <button 
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 h-10 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="md:pl-60 pt-14 md:pt-0 min-w-0 w-full overflow-x-hidden">
        {/* Desktop Top Bar - Command Center */}
        <header className="sticky top-0 z-40 h-16 border-b border-border bg-background/95 backdrop-blur hidden md:flex items-center px-6">
          {/* Left: Search */}
          <div className="flex-1 max-w-xl">
            <button 
              onClick={() => setShowSearch(true)}
              className="w-full flex items-center gap-3 h-10 px-4 rounded-lg bg-accent/50 hover:bg-accent border border-transparent hover:border-border transition-all text-left"
            >
              <Search size={16} className="text-muted-foreground" />
              <span className="flex-1 text-sm text-muted-foreground">Search deals, traders, documents...</span>
              <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] text-muted-foreground">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>
          </div>

          {/* Center: Context Display */}
          <div className="flex-1 flex items-center justify-center">
            {getContextDisplay()}
          </div>

          {/* Right: Actions */}
          <div className="flex-1 flex items-center justify-end gap-2">
            {/* New Button */}
            <div className="relative">
              <button 
                onClick={() => setShowNewMenu(!showNewMenu)}
                className="flex items-center gap-2 h-9 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus size={16} />
                <span className="hidden lg:inline">New</span>
                <ChevronDown size={14} />
              </button>
              {showNewMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNewMenu(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-xl shadow-xl py-2 z-50 animate-in slide-in-from-top-2">
                    <a href="/dashboard/deals/new" className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent transition-colors">
                      <Briefcase size={16} />
                      New Deal
                    </a>
                    <a href="/dashboard/messages" className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent transition-colors">
                      <MessageSquare size={16} />
                      New Message
                    </a>
                    <a href="/voice-rooms" className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent transition-colors">
                      <Mic size={16} />
                      Join Voice Room
                    </a>
                    <a href="/dashboard/documents" className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent transition-colors">
                      <Upload size={16} />
                      Upload Document
                    </a>
                  </div>
                </>
              )}
            </div>

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-lg hover:bg-accent transition-colors"
              >
                <Bell size={18} />
              </button>
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                  <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-xl shadow-xl z-50 animate-in slide-in-from-top-2">
                    <div className="p-4 border-b border-border">
                      <h3 className="font-semibold">Notifications</h3>
                    </div>
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No new notifications
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Messages */}
            <a href="/dashboard/messages" className="relative p-2.5 rounded-lg hover:bg-accent transition-colors">
              <MessageSquare size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-4 min-w-[16px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </a>

            {/* Voice */}
            <a href="/voice-rooms" className="p-2.5 rounded-lg hover:bg-accent transition-colors">
              <Mic size={18} />
            </a>

            {/* Time */}
            <div className="hidden xl:flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-mono text-foreground">{currentTime}</span>
            </div>

            {/* Profile */}
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-accent transition-colors"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground text-xs font-semibold">
                  {profile?.full_name?.substring(0, 2).toUpperCase() || 'ST'}
                </AvatarFallback>
              </Avatar>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6 lg:p-8 min-w-0 w-full">
          {children}
        </main>
      </div>

      {/* Global Search Modal */}
      {showSearch && (
        <div className="fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowSearch(false)} />
          <div className="absolute left-1/2 top-20 -translate-x-1/2 w-full max-w-2xl px-4">
            <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-top-4">
              <div className="flex items-center gap-3 p-4 border-b border-border">
                <Search size={20} className="text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search deals, traders, companies, documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-base"
                  autoFocus
                />
                <kbd className="px-2 py-1 text-xs bg-accent rounded border border-border">ESC</kbd>
              </div>
              <div className="p-4 max-h-[60vh] overflow-y-auto">
                {searchQuery ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No results for "{searchQuery}"
                  </p>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Quick Actions</p>
                      <div className="space-y-1">
                        <button onClick={() => { router.push('/dashboard/deals/new'); setShowSearch(false); }} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors text-left">
                          <Plus size={16} />
                          <span className="text-sm">Create New Deal</span>
                        </button>
                        <button onClick={() => { router.push('/voice-rooms'); setShowSearch(false); }} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors text-left">
                          <Mic size={16} />
                          <span className="text-sm">Join Voice Room</span>
                        </button>
                        <button onClick={() => { router.push('/dashboard/messages'); setShowSearch(false); }} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors text-left">
                          <MessageSquare size={16} />
                          <span className="text-sm">View Messages</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
