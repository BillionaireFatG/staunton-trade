'use client';

import Image from 'next/image';
import { useTradeEnvironment } from '@/lib/contexts/trade-environment-context';
import { useMemo } from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  variant?: 'light' | 'dark' | 'auto';
}

export function Logo({ size = 'md', showText = false, className = '' }: LogoProps) {
  const { environmentName } = useTradeEnvironment();

  const sizes = useMemo(() => ({
    sm: { px: 44,  text: 'text-sm' },
    md: { px: 56,  text: 'text-lg' },
    lg: { px: 75,  text: 'text-xl' },
    xl: { px: 115, text: 'text-2xl' },
  }), []);

  const { px } = sizes[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className="flex-shrink-0 rounded-xl overflow-hidden bg-black"
        style={{ width: px, height: px }}
      >
        <Image
          src="/logo5.png"
          alt={environmentName}
          width={px}
          height={px}
          className="w-full h-full object-cover"
          quality={100}
          priority
        />
      </div>
      {showText && (
        <span className={`font-bold ${sizes[size].text}`}>
          {environmentName.toUpperCase()}
        </span>
      )}
    </div>
  );
}

// Compact icon variant for sidebars and nav bars
export function LogoIcon({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <div
      className={`flex-shrink-0 rounded-lg overflow-hidden bg-black ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/logo5.png"
        alt="Staunton Trade"
        width={size}
        height={size}
        className="w-full h-full object-cover"
        quality={100}
        priority
      />
    </div>
  );
}
