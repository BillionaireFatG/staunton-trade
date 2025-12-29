'use client';

import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  variant?: 'light' | 'dark' | 'auto';
}

export function Logo({ size = 'md', showText = false, className = '', variant = 'auto' }: LogoProps) {
  const sizes = {
    sm: { logo: 48, text: 'text-sm' },
    md: { logo: 62, text: 'text-lg' },
    lg: { logo: 82, text: 'text-xl' },
    xl: { logo: 125, text: 'text-2xl' },
  };

  const { logo } = sizes[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div 
        className="relative flex-shrink-0 rounded-xl overflow-hidden"
        style={{ width: logo, height: logo }}
      >
        <Image
          src="/logo5.png"
          alt="Staunton Trade"
          fill
          className="object-cover"
          style={{ color: 'rgba(253, 252, 252, 0)' }}
          quality={60}
          priority
        />
      </div>
      <span className={`font-bold text-neutral-900 ${sizes[size].text}`}>
        STAUNTON TRADE
      </span>
    </div>
  );
}

// Simplified version for just the icon
export function LogoIcon({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <div 
      className={`relative flex-shrink-0 rounded-xl overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/logo5.png"
        alt="Staunton Trade"
        fill
        className="object-cover"
        style={{ color: 'rgba(253, 252, 252, 0)' }}
        quality={60}
        priority
      />
    </div>
  );
}


