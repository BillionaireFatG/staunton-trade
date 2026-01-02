'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Briefcase, Users, MessageSquare, Mic } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface SearchResult {
  type: 'user' | 'deal' | 'room';
  id: string;
  title: string;
  subtitle?: string;
  icon: any;
  href: string;
}

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Keyboard shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 0);
      }
      
      if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Search function
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      const searchResults: SearchResult[] = [];

      try {
        // Search users/companies
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, company_name')
          .or(`full_name.ilike.%${query}%,company_name.ilike.%${query}%`)
          .limit(5);

        if (profiles) {
          profiles.forEach((profile) => {
            searchResults.push({
              type: 'user',
              id: profile.id,
              title: profile.full_name || 'Unknown',
              subtitle: profile.company_name || undefined,
              icon: Users,
              href: `/profile/${profile.id}`,
            });
          });
        }

        // Search voice rooms
        const { data: rooms } = await supabase
          .from('voice_rooms')
          .select('id, name, emoji, description')
          .ilike('name', `%${query}%`)
          .limit(5);

        if (rooms) {
          rooms.forEach((room) => {
            searchResults.push({
              type: 'room',
              id: room.id,
              title: `${room.emoji} ${room.name}`,
              subtitle: room.description || undefined,
              icon: Mic,
              href: `/voice-rooms?room=${room.id}`,
            });
          });
        }

        setResults(searchResults);
        setSelectedIndex(0);
      } catch (error) {
        console.error('Search error:', error);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      router.push(results[selectedIndex].href);
      setIsOpen(false);
      setQuery('');
    }
  };

  const handleResultClick = (href: string) => {
    router.push(href);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <>
      {/* Search Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent hover:bg-accent/80 text-sm text-muted-foreground transition-colors min-w-[200px]"
      >
        <Search size={14} />
        <span>Search...</span>
        <kbd className="ml-auto px-1.5 py-0.5 text-xs bg-background rounded border border-border">
          ⌘K
        </kbd>
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="fixed left-1/2 top-20 -translate-x-1/2 w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-card border border-border rounded-lg shadow-lg overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <Search size={18} className="text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search deals, users, companies, voice rooms..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent outline-none text-sm"
                  autoFocus
                />
                <kbd className="px-2 py-1 text-xs bg-accent rounded border border-border">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              {results.length > 0 ? (
                <div className="max-h-[400px] overflow-y-auto">
                  {results.map((result, index) => {
                    const Icon = result.icon;
                    return (
                      <button
                        key={result.id}
                        onClick={() => handleResultClick(result.href)}
                        className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors ${
                          index === selectedIndex ? 'bg-accent' : ''
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon size={16} className="text-primary" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium">{result.title}</p>
                          {result.subtitle && (
                            <p className="text-xs text-muted-foreground">
                              {result.subtitle}
                            </p>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground capitalize">
                          {result.type}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : query ? (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No results found for "{query}"
                </div>
              ) : (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                  Start typing to search...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

