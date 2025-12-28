'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

type ThemeMode = 'dark' | 'light' | 'system' | 'auto';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: ThemeMode;
  storageKey?: string;
};

type AutoThemeConfig = {
  enabled: boolean;
  lightStart: number; // Hour (0-23) when light theme starts
  darkStart: number;  // Hour (0-23) when dark theme starts
};

type ThemeProviderState = {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  resolvedTheme: 'dark' | 'light';
  autoConfig: AutoThemeConfig;
  setAutoConfig: (config: Partial<AutoThemeConfig>) => void;
  isAutoActive: boolean;
  customTheme: string | null;
  setCustomTheme: (theme: string | null) => void;
};

const DEFAULT_AUTO_CONFIG: AutoThemeConfig = {
  enabled: false,
  lightStart: 7,  // 7 AM
  darkStart: 19,  // 7 PM
};

// All custom theme IDs
const CUSTOM_THEMES = ['monochrome', 'monochrome-dark', 'purple-hollow', 'purple-hollow-dark', 'sunset', 'sunset-dark', 'ocean', 'ocean-dark'];

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
  resolvedTheme: 'dark',
  autoConfig: DEFAULT_AUTO_CONFIG,
  setAutoConfig: () => null,
  isAutoActive: false,
  customTheme: null,
  setCustomTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

// Helper to determine if it's "day" based on current hour
function isDayTime(lightStart: number, darkStart: number): boolean {
  const hour = new Date().getHours();
  
  // Handle overnight ranges (e.g., light starts at 7, dark starts at 19)
  if (lightStart < darkStart) {
    return hour >= lightStart && hour < darkStart;
  }
  // Handle wrapped ranges (e.g., light starts at 22, dark starts at 6)
  return hour >= lightStart || hour < darkStart;
}

// Helper to get time until next theme change
function getTimeUntilNextChange(lightStart: number, darkStart: number): number {
  const now = new Date();
  const hour = now.getHours();
  const isDay = isDayTime(lightStart, darkStart);
  
  let targetHour = isDay ? darkStart : lightStart;
  
  // Calculate milliseconds until target hour
  const target = new Date(now);
  target.setHours(targetHour, 0, 0, 0);
  
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1);
  }
  
  return target.getTime() - now.getTime();
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'staunton-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeMode>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark');
  const [autoConfig, setAutoConfigState] = useState<AutoThemeConfig>(DEFAULT_AUTO_CONFIG);
  const [customTheme, setCustomThemeState] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Load stored preferences
  useEffect(() => {
    const storedTheme = localStorage.getItem(storageKey) as ThemeMode;
    const storedAutoConfig = localStorage.getItem(`${storageKey}-auto`);
    const storedCustomTheme = localStorage.getItem('staunton-custom-theme');
    const storedAccent = localStorage.getItem('staunton-accent-color');
    
    if (storedTheme) {
      setThemeState(storedTheme);
    }
    if (storedAutoConfig) {
      try {
        setAutoConfigState(JSON.parse(storedAutoConfig));
      } catch (e) {
        // Invalid JSON, use defaults
      }
    }
    
    const html = document.documentElement;
    
    // Apply custom theme immediately
    if (storedCustomTheme && CUSTOM_THEMES.includes(storedCustomTheme)) {
      setCustomThemeState(storedCustomTheme);
      
      // Remove all theme classes first
      CUSTOM_THEMES.forEach(t => html.classList.remove(t));
      html.classList.remove('light', 'dark');
      
      // Apply custom theme
      html.classList.add(storedCustomTheme);
      
      // Add dark class if it's a dark variant
      if (storedCustomTheme.includes('-dark') || storedCustomTheme === 'dark') {
        html.classList.add('dark');
      }
    }
    
    // Apply accent color
    if (storedAccent) {
      const accentMap: Record<string, string> = {
        'copper': '24 35% 35%',
        'gold': '38 92% 50%',
        'emerald': '160 84% 39%',
        'blue': '217 91% 60%',
        'purple': '262 83% 58%',
        'pink': '330 81% 60%',
        'red': '0 84% 60%',
        'orange': '25 95% 53%',
        'teal': '175 77% 40%',
        'cyan': '189 94% 43%',
        'monochrome': '0 0% 20%',
      };
      if (accentMap[storedAccent]) {
        html.style.setProperty('--primary', accentMap[storedAccent]);
        html.style.setProperty('--ring', accentMap[storedAccent]);
      }
    }
    
    setMounted(true);
  }, [storageKey]);

  // Resolve theme based on mode
  const resolveTheme = useCallback((): 'dark' | 'light' => {
    if (theme === 'auto' && autoConfig.enabled) {
      return isDayTime(autoConfig.lightStart, autoConfig.darkStart) ? 'light' : 'dark';
    }
    
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    if (theme === 'auto') {
      // Auto mode but not enabled, fall back to system
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    return theme;
  }, [theme, autoConfig]);

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    
    const resolved = resolveTheme();
    root.classList.add(resolved);
    setResolvedTheme(resolved);
  }, [theme, autoConfig, mounted, resolveTheme]);

  // Auto-switch timer
  useEffect(() => {
    if (!mounted || theme !== 'auto' || !autoConfig.enabled) return;

    const checkAndSwitch = () => {
      const resolved = resolveTheme();
      const root = window.document.documentElement;
      
      if (resolved !== resolvedTheme) {
        root.classList.remove('light', 'dark');
        root.classList.add(resolved);
        setResolvedTheme(resolved);
      }
    };

    // Check immediately
    checkAndSwitch();

    // Set up timer for next check
    const timeUntilChange = getTimeUntilNextChange(autoConfig.lightStart, autoConfig.darkStart);
    const timer = setTimeout(() => {
      checkAndSwitch();
    }, timeUntilChange);

    // Also check every minute as a fallback
    const interval = setInterval(checkAndSwitch, 60000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [theme, autoConfig, mounted, resolveTheme, resolvedTheme]);

  // Listen for system preference changes
  useEffect(() => {
    if (!mounted || theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      const resolved = resolveTheme();
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(resolved);
      setResolvedTheme(resolved);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mounted, resolveTheme]);

  const setTheme = useCallback((newTheme: ThemeMode) => {
    localStorage.setItem(storageKey, newTheme);
    setThemeState(newTheme);
  }, [storageKey]);

  const setAutoConfig = useCallback((config: Partial<AutoThemeConfig>) => {
    setAutoConfigState(prev => {
      const updated = { ...prev, ...config };
      localStorage.setItem(`${storageKey}-auto`, JSON.stringify(updated));
      return updated;
    });
  }, [storageKey]);

  const setCustomTheme = useCallback((themeId: string | null) => {
    setCustomThemeState(themeId);
    if (themeId) {
      localStorage.setItem('staunton-custom-theme', themeId);
    } else {
      localStorage.removeItem('staunton-custom-theme');
    }
  }, []);

  const value: ThemeProviderState = {
    theme,
    setTheme,
    resolvedTheme,
    autoConfig,
    setAutoConfig,
    isAutoActive: theme === 'auto' && autoConfig.enabled,
    customTheme,
    setCustomTheme,
  };

  if (!mounted) {
    return null;
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};

// Hook for getting formatted time until next switch
export function useAutoThemeCountdown() {
  const { autoConfig, isAutoActive } = useTheme();
  const [countdown, setCountdown] = useState<string>('');

  useEffect(() => {
    if (!isAutoActive) {
      setCountdown('');
      return;
    }

    const updateCountdown = () => {
      const ms = getTimeUntilNextChange(autoConfig.lightStart, autoConfig.darkStart);
      const hours = Math.floor(ms / (1000 * 60 * 60));
      const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hours > 0) {
        setCountdown(`${hours}h ${minutes}m`);
      } else {
        setCountdown(`${minutes}m`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [isAutoActive, autoConfig]);

  return countdown;
}
