'use client';

import dynamic from 'next/dynamic';

// Lazy load chart components (recharts is heavy)
export const AreaChartComponent = dynamic(() => 
  import('./Charts').then(mod => ({ default: mod.AreaChartComponent })), 
  { ssr: false }
);

export const BarChartComponent = dynamic(() => 
  import('./Charts').then(mod => ({ default: mod.BarChartComponent })), 
  { ssr: false }
);

export const LineChartComponent = dynamic(() => 
  import('./Charts').then(mod => ({ default: mod.LineChartComponent })), 
  { ssr: false }
);

export const PieChartComponent = dynamic(() => 
  import('./Charts').then(mod => ({ default: mod.PieChartComponent })), 
  { ssr: false }
);

export const RadialProgress = dynamic(() => 
  import('./Charts').then(mod => ({ default: mod.RadialProgress })), 
  { ssr: false }
);

export const Sparkline = dynamic(() => 
  import('./Charts').then(mod => ({ default: mod.Sparkline })), 
  { ssr: false }
);

export const ComposedChartComponent = dynamic(() => 
  import('./Charts').then(mod => ({ default: mod.ComposedChartComponent })), 
  { ssr: false }
);

// CHART_COLORS as a constant (lightweight, no need to lazy load)
export const CHART_COLORS = {
  primary: 'hsl(var(--primary))',
  secondary: 'hsl(var(--secondary))',
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  purple: '#8b5cf6',
};

