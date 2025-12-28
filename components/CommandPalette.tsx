'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/ThemeProvider';
import {
  Search,
  LayoutDashboard,
  Briefcase,
  FileText,
  Settings,
  HelpCircle,
  Plus,
  TrendingUp,
  MessageSquare,
  Users,
  Globe,
  Palette,
  Sun,
  Moon,
  Sparkles,
  Clock,
  BarChart3,
  MapPin,
  Award,
  FileSignature,
  ScrollText,
  Shield,
  Building2,
  Command,
  ArrowRight,
  Hash,
  Zap,
  LogOut,
} from 'lucide-react';

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ElementType;
  shortcut?: string[];
  action: () => void;
  category: string;
}

interface CommandPaletteProps {
  onSignOut?: () => void;
}

export function CommandPalette({ onSignOut }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { setTheme } = useTheme();

  // Define all commands
  const commands: CommandItem[] = React.useMemo(() => [
    // Navigation
    {
      id: 'nav-dashboard',
      label: 'Go to Dashboard',
      description: 'View your main dashboard',
      icon: LayoutDashboard,
      shortcut: ['G', 'D'],
      action: () => router.push('/dashboard'),
      category: 'Navigation',
    },
    {
      id: 'nav-deals',
      label: 'Go to Deals',
      description: 'View all deals',
      icon: Briefcase,
      shortcut: ['G', 'E'],
      action: () => router.push('/dashboard/deals'),
      category: 'Navigation',
    },
    {
      id: 'nav-tracking',
      label: 'Go to Tracking',
      description: 'Live shipment tracking',
      icon: MapPin,
      shortcut: ['G', 'T'],
      action: () => router.push('/dashboard/tracking'),
      category: 'Navigation',
    },
    {
      id: 'nav-market',
      label: 'Go to Market',
      description: 'Market data & prices',
      icon: TrendingUp,
      shortcut: ['G', 'M'],
      action: () => router.push('/dashboard/market'),
      category: 'Navigation',
    },
    {
      id: 'nav-reports',
      label: 'Go to Reports',
      description: 'Staunton verification reports',
      icon: ScrollText,
      shortcut: ['G', 'R'],
      action: () => router.push('/dashboard/reports'),
      category: 'Navigation',
    },
    {
      id: 'nav-contracts',
      label: 'Go to Contracts',
      description: 'Fixed-rate contracts',
      icon: FileSignature,
      action: () => router.push('/dashboard/contracts'),
      category: 'Navigation',
    },
    {
      id: 'nav-loyalty',
      label: 'Go to Loyalty',
      description: 'Rewards & points',
      icon: Award,
      action: () => router.push('/dashboard/loyalty'),
      category: 'Navigation',
    },
    {
      id: 'nav-messages',
      label: 'Go to Messages',
      description: 'Chat & communication',
      icon: MessageSquare,
      action: () => router.push('/dashboard/messages'),
      category: 'Navigation',
    },
    {
      id: 'nav-settings',
      label: 'Go to Settings',
      description: 'App preferences',
      icon: Settings,
      shortcut: ['G', 'S'],
      action: () => router.push('/dashboard/settings'),
      category: 'Navigation',
    },
    
    // Actions
    {
      id: 'action-new-deal',
      label: 'Create New Deal',
      description: 'Start a new commodity deal',
      icon: Plus,
      shortcut: ['C'],
      action: () => router.push('/dashboard/deals/new'),
      category: 'Actions',
    },
    {
      id: 'action-lifecycle',
      label: 'View Deal Lifecycle',
      description: 'Track deal progress',
      icon: Clock,
      action: () => router.push('/dashboard/lifecycle'),
      category: 'Actions',
    },
    {
      id: 'action-analytics',
      label: 'View Analytics',
      description: 'Performance metrics',
      icon: BarChart3,
      action: () => router.push('/dashboard/analytics'),
      category: 'Actions',
    },
    {
      id: 'action-counterparties',
      label: 'Manage Counterparties',
      description: 'View & manage contacts',
      icon: Users,
      action: () => router.push('/dashboard/counterparties'),
      category: 'Actions',
    },
    {
      id: 'action-documents',
      label: 'View Documents',
      description: 'All uploaded documents',
      icon: FileText,
      action: () => router.push('/dashboard/documents'),
      category: 'Actions',
    },
    {
      id: 'action-verified',
      label: 'Get Verified',
      description: 'Verify your account',
      icon: Shield,
      action: () => router.push('/dashboard/verified'),
      category: 'Actions',
    },
    
    // Theme
    {
      id: 'theme-light',
      label: 'Light Theme',
      description: 'Switch to light mode',
      icon: Sun,
      action: () => {
        document.documentElement.classList.remove('dark', 'monochrome', 'monochrome-dark', 'purple-hollow', 'purple-hollow-dark', 'sunset', 'sunset-dark', 'ocean', 'ocean-dark');
        setTheme('light');
        localStorage.setItem('staunton-custom-theme', 'light');
      },
      category: 'Theme',
    },
    {
      id: 'theme-dark',
      label: 'Dark Theme',
      description: 'Switch to dark mode',
      icon: Moon,
      action: () => {
        document.documentElement.classList.remove('monochrome', 'monochrome-dark', 'purple-hollow', 'purple-hollow-dark', 'sunset', 'sunset-dark', 'ocean', 'ocean-dark');
        document.documentElement.classList.add('dark');
        setTheme('dark');
        localStorage.setItem('staunton-custom-theme', 'dark');
      },
      category: 'Theme',
    },
    {
      id: 'theme-purple',
      label: 'Purple Hollow Theme',
      description: 'Ethereal purple aesthetic',
      icon: Sparkles,
      action: () => {
        document.documentElement.classList.remove('dark', 'monochrome', 'monochrome-dark', 'sunset', 'sunset-dark', 'ocean', 'ocean-dark');
        document.documentElement.classList.add('purple-hollow-dark');
        setTheme('dark');
        localStorage.setItem('staunton-custom-theme', 'purple-hollow-dark');
      },
      category: 'Theme',
    },
    {
      id: 'theme-ocean',
      label: 'Ocean Theme',
      description: 'Cool blue aesthetic',
      icon: Globe,
      action: () => {
        document.documentElement.classList.remove('dark', 'monochrome', 'monochrome-dark', 'purple-hollow', 'purple-hollow-dark', 'sunset', 'sunset-dark');
        document.documentElement.classList.add('ocean-dark');
        setTheme('dark');
        localStorage.setItem('staunton-custom-theme', 'ocean-dark');
      },
      category: 'Theme',
    },
    {
      id: 'theme-sunset',
      label: 'Sunset Theme',
      description: 'Warm orange aesthetic',
      icon: Zap,
      action: () => {
        document.documentElement.classList.remove('dark', 'monochrome', 'monochrome-dark', 'purple-hollow', 'purple-hollow-dark', 'ocean', 'ocean-dark');
        document.documentElement.classList.add('sunset-dark');
        setTheme('dark');
        localStorage.setItem('staunton-custom-theme', 'sunset-dark');
      },
      category: 'Theme',
    },
    
    // Help
    {
      id: 'help-support',
      label: 'Help & Support',
      description: 'Get assistance',
      icon: HelpCircle,
      shortcut: ['?'],
      action: () => router.push('/dashboard/help'),
      category: 'Help',
    },
    {
      id: 'help-signout',
      label: 'Sign Out',
      description: 'Log out of your account',
      icon: LogOut,
      action: () => onSignOut?.(),
      category: 'Help',
    },
  ], [router, setTheme, onSignOut]);

  // Filter commands based on search
  const filteredCommands = React.useMemo(() => {
    if (!search.trim()) return commands;
    
    const searchLower = search.toLowerCase();
    return commands.filter(
      cmd =>
        cmd.label.toLowerCase().includes(searchLower) ||
        cmd.description?.toLowerCase().includes(searchLower) ||
        cmd.category.toLowerCase().includes(searchLower)
    );
  }, [commands, search]);

  // Group commands by category
  const groupedCommands = React.useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    filteredCommands.forEach(cmd => {
      if (!groups[cmd.category]) groups[cmd.category] = [];
      groups[cmd.category].push(cmd);
    });
    return groups;
  }, [filteredCommands]);

  // Flatten for keyboard navigation
  const flatCommands = React.useMemo(() => {
    return Object.values(groupedCommands).flat();
  }, [groupedCommands]);

  // Keyboard shortcut to open
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘K or Ctrl+K to open
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      
      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus input when opened
  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSearch('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Keyboard navigation within palette
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < flatCommands.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : flatCommands.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (flatCommands[selectedIndex]) {
          flatCommands[selectedIndex].action();
          setIsOpen(false);
        }
        break;
    }
  };

  // Reset selection when search changes
  React.useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-border text-[12px] text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all duration-200"
      >
        <Search size={14} />
        <span>Search...</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-muted text-[10px] font-medium border border-border">
          <Command size={10} />K
        </kbd>
      </button>

      {/* Command Palette Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />

            {/* Palette */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="fixed left-1/2 top-[20%] -translate-x-1/2 w-full max-w-xl z-50"
            >
              <div className="bg-card border border-border rounded-xl shadow-2xl shadow-black/20 overflow-hidden">
                {/* Search Input */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                  <Search size={18} className="text-muted-foreground flex-shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search commands..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent text-foreground text-sm placeholder:text-muted-foreground outline-none"
                  />
                  <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-medium text-muted-foreground border border-border">
                    ESC
                  </kbd>
                </div>

                {/* Commands List */}
                <div className="max-h-[400px] overflow-y-auto p-2">
                  {flatCommands.length === 0 ? (
                    <div className="py-12 text-center text-muted-foreground">
                      <Search size={32} className="mx-auto mb-3 opacity-30" />
                      <p className="text-sm">No commands found</p>
                      <p className="text-xs mt-1">Try a different search term</p>
                    </div>
                  ) : (
                    Object.entries(groupedCommands).map(([category, items]) => (
                      <div key={category} className="mb-2">
                        <div className="px-3 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                          {category}
                        </div>
                        {items.map((cmd) => {
                          const globalIndex = flatCommands.indexOf(cmd);
                          const isSelected = globalIndex === selectedIndex;
                          
                          return (
                            <button
                              key={cmd.id}
                              onClick={() => {
                                cmd.action();
                                setIsOpen(false);
                              }}
                              onMouseEnter={() => setSelectedIndex(globalIndex)}
                              className={cn(
                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                                isSelected 
                                  ? "bg-primary text-primary-foreground" 
                                  : "text-foreground hover:bg-muted"
                              )}
                            >
                              <cmd.icon size={18} className={isSelected ? "text-primary-foreground" : "text-muted-foreground"} />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{cmd.label}</p>
                                {cmd.description && (
                                  <p className={cn(
                                    "text-xs truncate",
                                    isSelected ? "text-primary-foreground/70" : "text-muted-foreground"
                                  )}>
                                    {cmd.description}
                                  </p>
                                )}
                              </div>
                              {cmd.shortcut && (
                                <div className="flex items-center gap-1">
                                  {cmd.shortcut.map((key, i) => (
                                    <kbd
                                      key={i}
                                      className={cn(
                                        "px-1.5 py-0.5 rounded text-[10px] font-medium border",
                                        isSelected 
                                          ? "bg-primary-foreground/20 border-primary-foreground/30 text-primary-foreground" 
                                          : "bg-muted border-border text-muted-foreground"
                                      )}
                                    >
                                      {key}
                                    </kbd>
                                  ))}
                                </div>
                              )}
                              <ArrowRight size={14} className={cn(
                                "flex-shrink-0 opacity-0 transition-opacity",
                                isSelected && "opacity-100"
                              )} />
                            </button>
                          );
                        })}
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="px-4 py-2 border-t border-border bg-muted/30 flex items-center justify-between text-[10px] text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <kbd className="px-1 py-0.5 rounded bg-muted border border-border">↑</kbd>
                      <kbd className="px-1 py-0.5 rounded bg-muted border border-border">↓</kbd>
                      Navigate
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1 py-0.5 rounded bg-muted border border-border">↵</kbd>
                      Select
                    </span>
                  </div>
                  <span className="flex items-center gap-1">
                    <Building2 size={12} />
                    Staunton Trade
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default CommandPalette;


