'use client';

import { useState, useEffect } from 'react';
import { useTheme, useAutoThemeCountdown } from '@/components/ThemeProvider';
import { 
  Palette, 
  Sun, 
  Moon, 
  Monitor,
  Sparkles,
  Check,
  ChevronDown,
  Clock,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

// Theme configurations
const THEMES = [
  { 
    id: 'light', 
    name: 'Light', 
    icon: Sun,
    description: 'Clean, professional',
    colors: ['#644a40', '#ffdfb5', '#f9f9f9'],
    isDark: false,
  },
  { 
    id: 'dark', 
    name: 'Dark', 
    icon: Moon,
    description: 'Easy on the eyes',
    colors: ['#ffe0c2', '#393028', '#111111'],
    isDark: true,
  },
  { 
    id: 'monochrome', 
    name: 'Monochrome', 
    icon: Monitor,
    description: 'Pure black & white',
    colors: ['#000000', '#ffffff', '#f5f5f5'],
    isDark: false,
  },
  { 
    id: 'monochrome-dark', 
    name: 'Monochrome Dark', 
    icon: Monitor,
    description: 'Inverted B&W',
    colors: ['#ffffff', '#000000', '#0a0a0a'],
    isDark: true,
  },
  { 
    id: 'purple-hollow', 
    name: 'Purple Hollow', 
    icon: Sparkles,
    description: 'Ethereal purple',
    colors: ['#8b5cf6', '#e9d5ff', '#faf5ff'],
    isDark: false,
  },
  { 
    id: 'purple-hollow-dark', 
    name: 'Purple Dark', 
    icon: Sparkles,
    description: 'Deep purple',
    colors: ['#a78bfa', '#3b0764', '#0c0415'],
    isDark: true,
  },
  { 
    id: 'sunset', 
    name: 'Sunset', 
    icon: Sun,
    description: 'Warm oranges',
    colors: ['#f97316', '#fed7aa', '#fff7ed'],
    isDark: false,
  },
  { 
    id: 'sunset-dark', 
    name: 'Sunset Dark', 
    icon: Sun,
    description: 'Deep sunset',
    colors: ['#fb923c', '#431407', '#0f0603'],
    isDark: true,
  },
  { 
    id: 'ocean', 
    name: 'Ocean', 
    icon: Moon,
    description: 'Cool blues',
    colors: ['#0ea5e9', '#bae6fd', '#f0f9ff'],
    isDark: false,
  },
  { 
    id: 'ocean-dark', 
    name: 'Ocean Dark', 
    icon: Moon,
    description: 'Deep ocean',
    colors: ['#22d3ee', '#083344', '#030a0f'],
    isDark: true,
  },
];

// Accent color presets
const ACCENT_COLORS = [
  { id: 'copper', name: 'Copper', hsl: '24 35% 35%', hex: '#7a5c4f' },
  { id: 'gold', name: 'Gold', hsl: '38 92% 50%', hex: '#f5a623' },
  { id: 'emerald', name: 'Emerald', hsl: '160 84% 39%', hex: '#10b981' },
  { id: 'blue', name: 'Blue', hsl: '217 91% 60%', hex: '#3b82f6' },
  { id: 'purple', name: 'Purple', hsl: '262 83% 58%', hex: '#8b5cf6' },
  { id: 'pink', name: 'Pink', hsl: '330 81% 60%', hex: '#ec4899' },
  { id: 'red', name: 'Red', hsl: '0 84% 60%', hex: '#ef4444' },
  { id: 'orange', name: 'Orange', hsl: '25 95% 53%', hex: '#f97316' },
  { id: 'teal', name: 'Teal', hsl: '175 77% 40%', hex: '#14b8a6' },
  { id: 'cyan', name: 'Cyan', hsl: '189 94% 43%', hex: '#06b6d4' },
  { id: 'monochrome', name: 'Mono', hsl: '0 0% 20%', hex: '#333333' },
];

interface ThemeCustomizerProps {
  variant?: 'dropdown' | 'panel' | 'inline';
}

export function ThemeCustomizer({ variant = 'dropdown' }: ThemeCustomizerProps) {
  const { theme, setTheme, resolvedTheme, autoConfig, setAutoConfig, isAutoActive } = useTheme();
  const countdown = useAutoThemeCountdown();
  const [mounted, setMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('dark');
  const [currentAccent, setCurrentAccent] = useState('copper');

  useEffect(() => {
    setMounted(true);
    // Check for custom theme class on document
    const html = document.documentElement;
    const classes = Array.from(html.classList);
    const themeClass = THEMES.find(t => classes.includes(t.id));
    if (themeClass) {
      setCurrentTheme(themeClass.id);
    } else if (resolvedTheme) {
      setCurrentTheme(resolvedTheme);
    }
    
    // Load saved accent
    const savedAccent = localStorage.getItem('staunton-accent-color');
    if (savedAccent) {
      setCurrentAccent(savedAccent);
      applyAccentColor(savedAccent);
    }
  }, [resolvedTheme]);

  const applyAccentColor = (accentId: string) => {
    const accent = ACCENT_COLORS.find(a => a.id === accentId);
    if (!accent) return;
    
    const html = document.documentElement;
    html.style.setProperty('--primary', accent.hsl);
    html.style.setProperty('--ring', accent.hsl);
    
    // For dark themes, we might want a lighter version
    const isDark = html.classList.contains('dark');
    if (isDark) {
      // Make the accent slightly lighter for dark mode
      const lighterHsl = accent.hsl.replace(/(\d+)%\)$/, (match, p1) => {
        const lightness = Math.min(parseInt(p1) + 15, 85);
        return `${lightness}%)`;
      });
      html.style.setProperty('--primary', accent.hsl);
    }
  };

  const handleAccentChange = (accentId: string) => {
    setCurrentAccent(accentId);
    applyAccentColor(accentId);
    localStorage.setItem('staunton-accent-color', accentId);
  };

  const handleThemeChange = (themeId: string) => {
    const html = document.documentElement;
    const selectedTheme = THEMES.find(t => t.id === themeId);
    
    // Remove all theme classes
    THEMES.forEach(t => {
      html.classList.remove(t.id);
    });
    
    // Clear custom accent when changing themes (theme has its own accent)
    html.style.removeProperty('--primary');
    html.style.removeProperty('--ring');
    
    // Handle special cases
    if (themeId === 'light') {
      html.classList.remove('dark');
      setTheme('light');
    } else if (themeId === 'dark') {
      html.classList.add('dark');
      setTheme('dark');
    } else if (selectedTheme?.isDark) {
      html.classList.add('dark');
      html.classList.add(themeId);
      setTheme('dark');
    } else {
      html.classList.remove('dark');
      html.classList.add(themeId);
      setTheme('light');
    }
    
    setCurrentTheme(themeId);
    
    // Store preference
    localStorage.setItem('staunton-custom-theme', themeId);
    
    // Re-apply accent if one was selected
    const savedAccent = localStorage.getItem('staunton-accent-color');
    if (savedAccent) {
      setTimeout(() => applyAccentColor(savedAccent), 50);
    }
  };

  // Load saved theme on mount
  useEffect(() => {
    if (!mounted) return;
    const savedTheme = localStorage.getItem('staunton-custom-theme');
    if (savedTheme && THEMES.find(t => t.id === savedTheme)) {
      handleThemeChange(savedTheme);
    }
  }, [mounted]);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9">
        <Palette size={18} />
      </Button>
    );
  }

  const currentThemeData = THEMES.find(t => t.id === currentTheme) || THEMES[0];
  const currentAccentData = ACCENT_COLORS.find(a => a.id === currentAccent);
  const Icon = currentThemeData.icon;

  if (variant === 'dropdown') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-9 gap-2 px-3 text-muted-foreground hover:text-foreground"
          >
            <div 
              className="w-4 h-4 rounded-full border border-border"
              style={{ backgroundColor: currentAccentData?.hex || '#7a5c4f' }}
            />
            <span className="hidden sm:inline text-xs">{currentThemeData.name}</span>
            <ChevronDown size={12} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72">
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Theme
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {/* Quick theme selection - just show icons */}
          <div className="grid grid-cols-5 gap-1 p-2">
            {THEMES.map(themeOption => (
              <button
                key={themeOption.id}
                onClick={() => handleThemeChange(themeOption.id)}
                className={`relative p-2 rounded-lg transition-all ${
                  currentTheme === themeOption.id 
                    ? 'bg-primary/20 ring-1 ring-primary' 
                    : 'hover:bg-accent'
                }`}
                title={themeOption.name}
              >
                <div className="flex gap-0.5 justify-center">
                  {themeOption.colors.slice(0, 2).map((color, i) => (
                    <div 
                      key={i}
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                {currentTheme === themeOption.id && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary flex items-center justify-center">
                    <Check size={8} className="text-primary-foreground" />
                  </div>
                )}
              </button>
            ))}
          </div>
          
          <DropdownMenuSeparator />
          
          {/* Accent Colors */}
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Accent Color
          </DropdownMenuLabel>
          <div className="grid grid-cols-5 gap-1.5 p-2">
            {ACCENT_COLORS.map(accent => (
              <button
                key={accent.id}
                onClick={() => handleAccentChange(accent.id)}
                className={`relative w-8 h-8 rounded-lg transition-all ${
                  currentAccent === accent.id 
                    ? 'ring-2 ring-offset-2 ring-offset-background ring-primary' 
                    : 'hover:scale-110'
                }`}
                style={{ backgroundColor: accent.hex }}
                title={accent.name}
              >
                {currentAccent === accent.id && (
                  <Check size={14} className="absolute inset-0 m-auto text-white drop-shadow-md" />
                )}
              </button>
            ))}
          </div>
          
          <DropdownMenuSeparator />
          
          {/* Auto Switch Option */}
          <DropdownMenuItem
            onClick={() => {
              setTheme('auto');
              setAutoConfig({ enabled: true });
            }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 via-orange-400 to-indigo-600 flex items-center justify-center">
              <Clock size={14} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">Auto Switch</p>
                {isAutoActive && (
                  <Badge variant="secondary" className="text-[9px] px-1 py-0">
                    <Zap size={8} className="mr-0.5" />
                    Active
                  </Badge>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground">
                {isAutoActive 
                  ? `Light 7AM–7PM · Next: ${countdown}`
                  : 'Based on time of day'
                }
              </p>
            </div>
            {isAutoActive && (
              <Check size={14} className="text-primary" />
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase">Theme</p>
        <div className="flex gap-1">
          <button
            onClick={() => handleThemeChange('light')}
            className={`flex-1 p-2 rounded-lg text-xs font-medium transition-colors ${
              currentTheme === 'light' ? 'bg-primary text-primary-foreground' : 'bg-accent hover:bg-accent/80'
            }`}
          >
            <Sun size={14} className="mx-auto mb-1" />
            Light
          </button>
          <button
            onClick={() => handleThemeChange('dark')}
            className={`flex-1 p-2 rounded-lg text-xs font-medium transition-colors ${
              currentTheme === 'dark' ? 'bg-primary text-primary-foreground' : 'bg-accent hover:bg-accent/80'
            }`}
          >
            <Moon size={14} className="mx-auto mb-1" />
            Dark
          </button>
          <button
            onClick={() => {
              setTheme('system');
              handleThemeChange(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
            }}
            className="flex-1 p-2 rounded-lg text-xs font-medium bg-accent hover:bg-accent/80 transition-colors"
          >
            <Monitor size={14} className="mx-auto mb-1" />
            Auto
          </button>
        </div>
      </div>
    );
  }

  // Panel variant for settings page
  return (
    <div className="space-y-6">
      {/* Theme Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Palette size={18} className="text-muted-foreground" />
          <h3 className="font-medium">Theme</h3>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {THEMES.map(themeOption => (
            <button
              key={themeOption.id}
              onClick={() => handleThemeChange(themeOption.id)}
              className={`group relative p-3 rounded-xl border transition-all ${
                currentTheme === themeOption.id 
                  ? 'border-primary bg-primary/5 ring-2 ring-primary' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {/* Color swatches */}
              <div className="flex items-center justify-center gap-1 mb-2">
                {themeOption.colors.map((color, i) => (
                  <div 
                    key={i}
                    className="w-4 h-4 rounded-full border border-border/50"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              
              {/* Theme name */}
              <p className="text-xs font-medium text-center truncate">
                {themeOption.name}
              </p>
              
              {/* Check mark */}
              {currentTheme === themeOption.id && (
                <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check size={12} className="text-primary-foreground" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Accent Color Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div 
            className="w-5 h-5 rounded-full"
            style={{ backgroundColor: currentAccentData?.hex || '#7a5c4f' }}
          />
          <h3 className="font-medium">Accent Color</h3>
          <span className="text-sm text-muted-foreground">({currentAccentData?.name || 'Copper'})</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {ACCENT_COLORS.map(accent => (
            <button
              key={accent.id}
              onClick={() => handleAccentChange(accent.id)}
              className={`relative w-10 h-10 rounded-xl transition-all ${
                currentAccent === accent.id 
                  ? 'ring-2 ring-offset-2 ring-offset-background ring-primary scale-110' 
                  : 'hover:scale-105'
              }`}
              style={{ backgroundColor: accent.hex }}
              title={accent.name}
            >
              {currentAccent === accent.id && (
                <Check size={16} className="absolute inset-0 m-auto text-white drop-shadow-md" />
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Auto theme info */}
      <div className="p-4 rounded-xl bg-muted/50 border border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 via-orange-400 to-indigo-600 flex items-center justify-center">
            <Clock size={18} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-medium">Auto Theme Switch</p>
              {isAutoActive && (
                <Badge variant="secondary" className="text-xs">
                  <Zap size={10} className="mr-1" />
                  Active
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Automatically switch between light and dark themes based on time of day
            </p>
          </div>
          <button
            onClick={() => {
              setTheme('auto');
              setAutoConfig({ enabled: !autoConfig.enabled });
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isAutoActive 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-accent hover:bg-accent/80'
            }`}
          >
            {isAutoActive ? 'Enabled' : 'Enable'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ThemeCustomizer;
