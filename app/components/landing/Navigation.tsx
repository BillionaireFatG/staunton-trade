'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, Building2, User, Gift, Settings, LogOut, ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-neutral-900 flex items-center justify-center">
              <Building2 size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-neutral-900 tracking-tight">Staunton Trade</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
              How It Works
            </a>
            <a href="#stats" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
              Industry Facts
            </a>
            <a href="#contact" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
              Contact
            </a>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-neutral-200 animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 h-10 px-3 hover:bg-neutral-100">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neutral-700 to-neutral-900 flex items-center justify-center text-xs font-bold text-white">
                      {user.email?.substring(0, 2).toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium text-neutral-700 max-w-[120px] truncate">
                      {user.email?.split('@')[0] || 'User'}
                    </span>
                    <ChevronDown size={14} className="text-neutral-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-xs text-neutral-500">
                    {user.email}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <Building2 size={14} className="mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="cursor-pointer">
                      <User size={14} className="mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/loyalty" className="cursor-pointer">
                      <Gift size={14} className="mr-2" />
                      Your Rewards
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="cursor-pointer">
                      <Settings size={14} className="mr-2" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer">
                    <LogOut size={14} className="mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link 
                  href="/sign-in" 
                  className="px-4 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  href="/sign-up" 
                  className="px-5 py-2.5 text-sm font-semibold bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors shadow-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-neutral-900"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-200 bg-white">
            <div className="flex flex-col gap-4">
              <a href="#features" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
                How It Works
              </a>
              <a href="#stats" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
                Industry Facts
              </a>
              <a href="#contact" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
                Contact
              </a>
              <div className="flex flex-col gap-2 pt-4 border-t border-neutral-200">
                {user ? (
                  <>
                    <Link 
                      href="/dashboard" 
                      className="px-4 py-2.5 text-sm font-medium text-center text-white bg-neutral-900 rounded-lg"
                    >
                      Dashboard
                    </Link>
                    <button 
                      onClick={handleSignOut}
                      className="px-4 py-2.5 text-sm font-medium text-center text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/sign-in" 
                      className="px-4 py-2.5 text-sm font-medium text-center text-neutral-700 border border-neutral-300 rounded-lg hover:bg-neutral-50"
                    >
                      Sign In
                    </Link>
                    <Link 
                      href="/sign-up" 
                      className="px-4 py-2.5 text-sm font-medium text-center bg-neutral-900 text-white rounded-lg hover:bg-neutral-800"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
