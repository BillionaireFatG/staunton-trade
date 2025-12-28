'use client';

import * as React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  RadialBarChart,
  RadialBar,
} from 'recharts';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// Chart Colors
export const CHART_COLORS = {
  primary: 'hsl(var(--primary))',
  secondary: 'hsl(var(--secondary))',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
  purple: '#8b5cf6',
  pink: '#ec4899',
  cyan: '#06b6d4',
  orange: '#f97316',
};

export const GRADIENT_COLORS = [
  { id: 'primary', start: '#3b82f6', end: '#1d4ed8' },
  { id: 'success', start: '#10b981', end: '#059669' },
  { id: 'warning', start: '#f59e0b', end: '#d97706' },
  { id: 'purple', start: '#8b5cf6', end: '#6d28d9' },
  { id: 'pink', start: '#ec4899', end: '#be185d' },
];

// Custom Tooltip
interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  formatter?: (value: number, name: string) => string;
}

export function CustomTooltip({ active, payload, label, formatter }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-popover text-popover-foreground border border-border rounded-lg shadow-lg p-3 text-sm">
      <p className="font-medium text-foreground mb-2">{label}</p>
      <div className="space-y-1">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-medium text-foreground">
              {formatter ? formatter(entry.value, entry.name) : entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Area Chart Component
interface AreaChartData {
  name: string;
  [key: string]: string | number;
}

interface AreaChartProps {
  data: AreaChartData[];
  dataKeys: { key: string; color: string; name?: string }[];
  xAxisKey?: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  gradientFill?: boolean;
  formatter?: (value: number, name: string) => string;
  className?: string;
}

export function AreaChartComponent({
  data,
  dataKeys,
  xAxisKey = 'name',
  height = 300,
  showGrid = true,
  showLegend = true,
  gradientFill = true,
  formatter,
  className,
}: AreaChartProps) {
  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            {dataKeys.map((dk) => (
              <linearGradient key={dk.key} id={`gradient-${dk.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={dk.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={dk.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
          )}
          <XAxis
            dataKey={xAxisKey}
            axisLine={false}
            tickLine={false}
            className="text-xs fill-muted-foreground"
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            className="text-xs fill-muted-foreground"
            dx={-10}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip content={<CustomTooltip formatter={formatter} />} />
          {showLegend && (
            <Legend
              wrapperStyle={{ paddingTop: 20 }}
              formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
            />
          )}
          {dataKeys.map((dk) => (
            <Area
              key={dk.key}
              type="monotone"
              dataKey={dk.key}
              name={dk.name || dk.key}
              stroke={dk.color}
              strokeWidth={2}
              fill={gradientFill ? `url(#gradient-${dk.key})` : dk.color}
              fillOpacity={gradientFill ? 1 : 0.1}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// Bar Chart Component
interface BarChartProps {
  data: AreaChartData[];
  dataKeys: { key: string; color: string; name?: string }[];
  xAxisKey?: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  stacked?: boolean;
  horizontal?: boolean;
  formatter?: (value: number, name: string) => string;
  className?: string;
}

export function BarChartComponent({
  data,
  dataKeys,
  xAxisKey = 'name',
  height = 300,
  showGrid = true,
  showLegend = true,
  stacked = false,
  horizontal = false,
  formatter,
  className,
}: BarChartProps) {
  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout={horizontal ? 'vertical' : 'horizontal'}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
          )}
          {horizontal ? (
            <>
              <XAxis type="number" axisLine={false} tickLine={false} className="text-xs fill-muted-foreground" />
              <YAxis
                type="category"
                dataKey={xAxisKey}
                axisLine={false}
                tickLine={false}
                className="text-xs fill-muted-foreground"
                width={80}
              />
            </>
          ) : (
            <>
              <XAxis
                dataKey={xAxisKey}
                axisLine={false}
                tickLine={false}
                className="text-xs fill-muted-foreground"
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                className="text-xs fill-muted-foreground"
                dx={-10}
                tickFormatter={(value) => value.toLocaleString()}
              />
            </>
          )}
          <Tooltip content={<CustomTooltip formatter={formatter} />} />
          {showLegend && (
            <Legend
              wrapperStyle={{ paddingTop: 20 }}
              formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
            />
          )}
          {dataKeys.map((dk) => (
            <Bar
              key={dk.key}
              dataKey={dk.key}
              name={dk.name || dk.key}
              fill={dk.color}
              stackId={stacked ? 'stack' : undefined}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Line Chart Component
interface LineChartProps {
  data: AreaChartData[];
  dataKeys: { key: string; color: string; name?: string; dashed?: boolean }[];
  xAxisKey?: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  showDots?: boolean;
  formatter?: (value: number, name: string) => string;
  className?: string;
}

export function LineChartComponent({
  data,
  dataKeys,
  xAxisKey = 'name',
  height = 300,
  showGrid = true,
  showLegend = true,
  showDots = true,
  formatter,
  className,
}: LineChartProps) {
  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
          )}
          <XAxis
            dataKey={xAxisKey}
            axisLine={false}
            tickLine={false}
            className="text-xs fill-muted-foreground"
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            className="text-xs fill-muted-foreground"
            dx={-10}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip content={<CustomTooltip formatter={formatter} />} />
          {showLegend && (
            <Legend
              wrapperStyle={{ paddingTop: 20 }}
              formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
            />
          )}
          {dataKeys.map((dk) => (
            <Line
              key={dk.key}
              type="monotone"
              dataKey={dk.key}
              name={dk.name || dk.key}
              stroke={dk.color}
              strokeWidth={2}
              strokeDasharray={dk.dashed ? '5 5' : undefined}
              dot={showDots ? { fill: dk.color, strokeWidth: 2 } : false}
              activeDot={showDots ? { r: 6, fill: dk.color } : false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Pie Chart Component
interface PieChartData {
  name: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieChartData[];
  height?: number;
  showLegend?: boolean;
  innerRadius?: number;
  outerRadius?: number;
  formatter?: (value: number, name: string) => string;
  className?: string;
}

export function PieChartComponent({
  data,
  height = 300,
  showLegend = true,
  innerRadius = 60,
  outerRadius = 100,
  formatter,
  className,
}: PieChartProps) {
  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip formatter={formatter} />} />
          {showLegend && (
            <Legend
              formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
            />
          )}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// Radial Progress Chart
interface RadialProgressProps {
  value: number;
  maxValue?: number;
  color?: string;
  backgroundColor?: string;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  className?: string;
}

export function RadialProgress({
  value,
  maxValue = 100,
  color = CHART_COLORS.primary,
  backgroundColor = 'hsl(var(--muted))',
  size = 120,
  strokeWidth = 12,
  label,
  sublabel,
  className,
}: RadialProgressProps) {
  const percentage = (value / maxValue) * 100;
  const data = [
    { name: 'Progress', value: percentage, fill: color },
    { name: 'Remaining', value: 100 - percentage, fill: backgroundColor },
  ];

  return (
    <div className={cn('relative', className)} style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius={size / 2 - strokeWidth}
          outerRadius={size / 2}
          startAngle={90}
          endAngle={-270}
          data={data}
        >
          <RadialBar
            dataKey="value"
            cornerRadius={strokeWidth / 2}
            background={{ fill: backgroundColor }}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-foreground">{label || `${Math.round(percentage)}%`}</span>
        {sublabel && <span className="text-xs text-muted-foreground">{sublabel}</span>}
      </div>
    </div>
  );
}

// Sparkline Chart (Mini Chart)
interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
  showDot?: boolean;
  className?: string;
}

export function Sparkline({
  data,
  color = CHART_COLORS.primary,
  height = 40,
  showDot = true,
  className,
}: SparklineProps) {
  const chartData = data.map((value, index) => ({ index, value }));

  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
          <defs>
            <linearGradient id="sparkline-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            fill="url(#sparkline-gradient)"
            dot={showDot ? { fill: color, strokeWidth: 0, r: 2 } : false}
            activeDot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// Combo/Composed Chart
interface ComposedChartProps {
  data: AreaChartData[];
  bars?: { key: string; color: string; name?: string }[];
  lines?: { key: string; color: string; name?: string; dashed?: boolean }[];
  areas?: { key: string; color: string; name?: string }[];
  xAxisKey?: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  formatter?: (value: number, name: string) => string;
  className?: string;
}

export function ComposedChartComponent({
  data,
  bars = [],
  lines = [],
  areas = [],
  xAxisKey = 'name',
  height = 300,
  showGrid = true,
  showLegend = true,
  formatter,
  className,
}: ComposedChartProps) {
  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            {areas.map((a) => (
              <linearGradient key={a.key} id={`gradient-${a.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={a.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={a.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
          )}
          <XAxis
            dataKey={xAxisKey}
            axisLine={false}
            tickLine={false}
            className="text-xs fill-muted-foreground"
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            className="text-xs fill-muted-foreground"
            dx={-10}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip content={<CustomTooltip formatter={formatter} />} />
          {showLegend && (
            <Legend
              wrapperStyle={{ paddingTop: 20 }}
              formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
            />
          )}
          {areas.map((a) => (
            <Area
              key={a.key}
              type="monotone"
              dataKey={a.key}
              name={a.name || a.key}
              stroke={a.color}
              strokeWidth={2}
              fill={`url(#gradient-${a.key})`}
            />
          ))}
          {bars.map((b) => (
            <Bar
              key={b.key}
              dataKey={b.key}
              name={b.name || b.key}
              fill={b.color}
              radius={[4, 4, 0, 0]}
            />
          ))}
          {lines.map((l) => (
            <Line
              key={l.key}
              type="monotone"
              dataKey={l.key}
              name={l.name || l.key}
              stroke={l.color}
              strokeWidth={2}
              strokeDasharray={l.dashed ? '5 5' : undefined}
              dot={false}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export default {
  AreaChartComponent,
  BarChartComponent,
  LineChartComponent,
  PieChartComponent,
  RadialProgress,
  Sparkline,
  ComposedChartComponent,
  CHART_COLORS,
};


