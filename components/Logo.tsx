'use client';

import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  variant?: 'light' | 'dark' | 'auto';
}

export function Logo({ size = 'md', showText = true, className = '', variant = 'auto' }: LogoProps) {
  const sizes = {
    sm: { logo: 28, text: 'text-sm' },
    md: { logo: 36, text: 'text-lg' },
    lg: { logo: 48, text: 'text-xl' },
    xl: { logo: 64, text: 'text-2xl' },
  };

  const { logo, text } = sizes[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div 
        className="relative flex-shrink-0"
        style={{ width: logo, height: logo }}
      >
        <Image
          src="/logo.png"
          alt="Staunton Trade"
          fill
          className="object-contain"
          priority
        />
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-bold tracking-tight ${text} ${
            variant === 'light' ? 'text-white' : 
            variant === 'dark' ? 'text-neutral-900' : 
            'text-foreground'
          }`}>
            STAUNTON
          </span>
          <span className={`font-light tracking-[0.25em] text-[0.6em] ${
            variant === 'light' ? 'text-white/80' : 
            variant === 'dark' ? 'text-neutral-600' : 
            'text-muted-foreground'
          }`}>
            TRADE
          </span>
        </div>
      )}
    </div>
  );
}

// Simplified version for just the icon
export function LogoIcon({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <div 
      className={`relative flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/logo.png"
        alt="Staunton Trade"
        fill
        className="object-contain"
        priority
      />
    </div>
  );
}

