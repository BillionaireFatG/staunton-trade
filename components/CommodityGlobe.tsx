'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { feature } from 'topojson-client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Fuel, 
  Ship, 
  Factory, 
  Warehouse,
  Zap,
  Globe2,
  MapPin,
  TrendingUp,
  DollarSign
} from 'lucide-react';

// Commodity trading hotspots with real coordinates - Expanded list
const COMMODITY_HOTSPOTS = [
  // Major Oil & Gas Trading Hubs
  { id: 1, name: 'Houston', country: 'USA', lat: 29.7604, lon: -95.3698, type: 'trading', volume: '12M BBL/day', commodity: 'Crude Oil', color: '#3b82f6' },
  { id: 2, name: 'Rotterdam', country: 'Netherlands', lat: 51.9244, lon: 4.4777, type: 'hub', volume: '8.5M BBL/day', commodity: 'Refined Products', color: '#10b981' },
  { id: 3, name: 'Singapore', country: 'Singapore', lat: 1.3521, lon: 103.8198, type: 'hub', volume: '6.2M BBL/day', commodity: 'Multi-Product', color: '#f59e0b' },
  { id: 4, name: 'Fujairah', country: 'UAE', lat: 25.1288, lon: 56.3264, type: 'storage', volume: '4.8M BBL/day', commodity: 'Bunker Fuel', color: '#ef4444' },
  { id: 5, name: 'Lagos', country: 'Nigeria', lat: 6.5244, lon: 3.3792, type: 'export', volume: '2.1M BBL/day', commodity: 'Crude Oil', color: '#8b5cf6' },
  { id: 6, name: 'Shanghai', country: 'China', lat: 31.2304, lon: 121.4737, type: 'import', volume: '5.8M BBL/day', commodity: 'Crude Oil', color: '#ec4899' },
  { id: 7, name: 'Mumbai', country: 'India', lat: 19.0760, lon: 72.8777, type: 'refinery', volume: '3.2M BBL/day', commodity: 'Diesel', color: '#06b6d4' },
  { id: 8, name: 'London', country: 'UK', lat: 51.5074, lon: -0.1278, type: 'trading', volume: 'Financial Hub', commodity: 'ICE Brent', color: '#84cc16' },
  { id: 9, name: 'Geneva', country: 'Switzerland', lat: 46.2044, lon: 6.1432, type: 'trading', volume: 'Trading Houses', commodity: 'Multi-Commodity', color: '#f97316' },
  { id: 10, name: 'Ras Tanura', country: 'Saudi Arabia', lat: 26.6500, lon: 50.1500, type: 'export', volume: '7M BBL/day', commodity: 'Crude Oil', color: '#14b8a6' },
  { id: 11, name: 'Corpus Christi', country: 'USA', lat: 27.8006, lon: -97.3964, type: 'export', volume: '2.5M BBL/day', commodity: 'LNG & Crude', color: '#a855f7' },
  { id: 12, name: 'Qingdao', country: 'China', lat: 36.0671, lon: 120.3826, type: 'import', volume: '4.1M BBL/day', commodity: 'Crude Oil', color: '#22d3d1' },
  { id: 13, name: 'Durban', country: 'South Africa', lat: -29.8587, lon: 31.0218, type: 'hub', volume: '1.8M BBL/day', commodity: 'Refined Products', color: '#f43f5e' },
  { id: 14, name: 'Jamnagar', country: 'India', lat: 22.4707, lon: 70.0577, type: 'refinery', volume: '1.4M BBL/day', commodity: 'World\'s Largest Refinery', color: '#eab308' },
  { id: 15, name: 'Abidjan', country: 'Ivory Coast', lat: 5.3600, lon: -4.0083, type: 'hub', volume: '0.8M BBL/day', commodity: 'West Africa Hub', color: '#0ea5e9' },
  // Additional Major Ports & Trading Centers
  { id: 16, name: 'New York', country: 'USA', lat: 40.7128, lon: -74.0060, type: 'trading', volume: 'NYMEX Hub', commodity: 'WTI Crude', color: '#3b82f6' },
  { id: 17, name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503, type: 'import', volume: '3.8M BBL/day', commodity: 'LNG & Crude', color: '#ec4899' },
  { id: 18, name: 'Antwerp', country: 'Belgium', lat: 51.2194, lon: 4.4025, type: 'hub', volume: '6.2M MT/year', commodity: 'Chemicals', color: '#10b981' },
  { id: 19, name: 'Dubai', country: 'UAE', lat: 25.2048, lon: 55.2708, type: 'trading', volume: 'DME Hub', commodity: 'Oman Crude', color: '#f59e0b' },
  { id: 20, name: 'Cushing', country: 'USA', lat: 35.9850, lon: -96.7670, type: 'storage', volume: '90M BBL capacity', commodity: 'WTI Hub', color: '#ef4444' },
  { id: 21, name: 'Primorsk', country: 'Russia', lat: 60.3582, lon: 28.6256, type: 'export', volume: '1.8M BBL/day', commodity: 'Urals Crude', color: '#8b5cf6' },
  { id: 22, name: 'Ningbo', country: 'China', lat: 29.8683, lon: 121.5440, type: 'import', volume: '5.2M BBL/day', commodity: 'Crude & Iron Ore', color: '#22d3d1' },
  { id: 23, name: 'Busan', country: 'South Korea', lat: 35.1796, lon: 129.0756, type: 'hub', volume: '2.1M BBL/day', commodity: 'Bunker & Products', color: '#06b6d4' },
  { id: 24, name: 'Amsterdam', country: 'Netherlands', lat: 52.3676, lon: 4.9041, type: 'hub', volume: 'ARA Hub', commodity: 'Multi-Product', color: '#84cc16' },
  { id: 25, name: 'Zug', country: 'Switzerland', lat: 47.1661, lon: 8.5155, type: 'trading', volume: 'HQ Trading', commodity: 'Glencore Base', color: '#f97316' },
  // LNG Terminals
  { id: 26, name: 'Sabine Pass', country: 'USA', lat: 29.7355, lon: -93.8700, type: 'export', volume: '45 MTPA', commodity: 'LNG', color: '#14b8a6' },
  { id: 27, name: 'Gladstone', country: 'Australia', lat: -23.8427, lon: 151.2555, type: 'export', volume: '25 MTPA', commodity: 'LNG', color: '#a855f7' },
  { id: 28, name: 'Ras Laffan', country: 'Qatar', lat: 25.9061, lon: 51.5361, type: 'export', volume: '77 MTPA', commodity: 'LNG', color: '#f43f5e' },
  { id: 29, name: 'Incheon', country: 'South Korea', lat: 37.4563, lon: 126.7052, type: 'import', volume: '40 MTPA', commodity: 'LNG', color: '#eab308' },
  // Metals & Mining
  { id: 30, name: 'Port Hedland', country: 'Australia', lat: -20.3108, lon: 118.6097, type: 'export', volume: '550 MT/year', commodity: 'Iron Ore', color: '#0ea5e9' },
  { id: 31, name: 'Santos', country: 'Brazil', lat: -23.9608, lon: -46.3339, type: 'export', volume: '150 MT/year', commodity: 'Iron Ore & Soy', color: '#3b82f6' },
  { id: 32, name: 'Newcastle', country: 'Australia', lat: -32.9283, lon: 151.7817, type: 'export', volume: '165 MT/year', commodity: 'Thermal Coal', color: '#10b981' },
  { id: 33, name: 'Richards Bay', country: 'South Africa', lat: -28.8010, lon: 32.0377, type: 'export', volume: '75 MT/year', commodity: 'Coal', color: '#f59e0b' },
  { id: 34, name: 'Tubarão', country: 'Brazil', lat: -20.2960, lon: -40.2883, type: 'export', volume: '120 MT/year', commodity: 'Iron Ore', color: '#ef4444' },
  // Grain & Agriculture
  { id: 35, name: 'New Orleans', country: 'USA', lat: 29.9511, lon: -90.0715, type: 'export', volume: '65 MT/year', commodity: 'Grain', color: '#8b5cf6' },
  { id: 36, name: 'Paranaguá', country: 'Brazil', lat: -25.5162, lon: -48.5225, type: 'export', volume: '55 MT/year', commodity: 'Soybeans', color: '#ec4899' },
  { id: 37, name: 'Odessa', country: 'Ukraine', lat: 46.4825, lon: 30.7233, type: 'export', volume: '45 MT/year', commodity: 'Wheat & Corn', color: '#06b6d4' },
  { id: 38, name: 'Vancouver', country: 'Canada', lat: 49.2827, lon: -123.1207, type: 'export', volume: '35 MT/year', commodity: 'Wheat & Canola', color: '#84cc16' },
  { id: 39, name: 'Rosario', country: 'Argentina', lat: -32.9442, lon: -60.6505, type: 'export', volume: '80 MT/year', commodity: 'Soy & Corn', color: '#f97316' },
  // Additional Oil & Refineries
  { id: 40, name: 'Ulsan', country: 'South Korea', lat: 35.5384, lon: 129.3114, type: 'refinery', volume: '1.1M BBL/day', commodity: 'Refined Products', color: '#14b8a6' },
  { id: 41, name: 'Jurong Island', country: 'Singapore', lat: 1.2655, lon: 103.6990, type: 'refinery', volume: '1.5M BBL/day', commodity: 'Petrochemicals', color: '#a855f7' },
  { id: 42, name: 'Ruwais', country: 'UAE', lat: 24.1100, lon: 52.7300, type: 'refinery', volume: '0.9M BBL/day', commodity: 'Refined Products', color: '#f43f5e' },
  { id: 43, name: 'Pernis', country: 'Netherlands', lat: 51.8800, lon: 4.3800, type: 'refinery', volume: '0.4M BBL/day', commodity: 'Shell Refinery', color: '#eab308' },
  { id: 44, name: 'Galveston', country: 'USA', lat: 29.3013, lon: -94.7977, type: 'export', volume: '1.5M BBL/day', commodity: 'Crude & Products', color: '#0ea5e9' },
  { id: 45, name: 'Basra', country: 'Iraq', lat: 30.5085, lon: 47.7804, type: 'export', volume: '3.5M BBL/day', commodity: 'Basra Crude', color: '#3b82f6' },
  // Copper & Base Metals
  { id: 46, name: 'Antofagasta', country: 'Chile', lat: -23.6509, lon: -70.3975, type: 'export', volume: '5 MT/year', commodity: 'Copper', color: '#10b981' },
  { id: 47, name: 'Escondida', country: 'Chile', lat: -24.2667, lon: -69.0667, type: 'export', volume: '1.2 MT/year', commodity: 'Copper', color: '#f59e0b' },
  { id: 48, name: 'Dampier', country: 'Australia', lat: -20.6617, lon: 116.7128, type: 'export', volume: '180 MT/year', commodity: 'Iron Ore', color: '#ef4444' },
  // Additional Trading Centers
  { id: 49, name: 'Chicago', country: 'USA', lat: 41.8781, lon: -87.6298, type: 'trading', volume: 'CME Hub', commodity: 'Grains & Livestock', color: '#8b5cf6' },
  { id: 50, name: 'Hong Kong', country: 'China', lat: 22.3193, lon: 114.1694, type: 'trading', volume: 'Financial Hub', commodity: 'Multi-Commodity', color: '#ec4899' },
];

// Trade routes connecting major hubs
const TRADE_ROUTES = [
  // Oil Routes
  { from: 10, to: 3, active: true }, // Saudi to Singapore
  { from: 10, to: 6, active: true }, // Saudi to Shanghai
  { from: 5, to: 2, active: true }, // Nigeria to Rotterdam
  { from: 1, to: 8, active: false }, // Houston to London
  { from: 3, to: 7, active: true }, // Singapore to Mumbai
  { from: 11, to: 6, active: true }, // Corpus Christi to Shanghai
  { from: 2, to: 13, active: false }, // Rotterdam to Durban
  { from: 4, to: 3, active: true }, // Fujairah to Singapore
  { from: 45, to: 6, active: true }, // Basra to Shanghai
  { from: 21, to: 2, active: true }, // Primorsk to Rotterdam
  { from: 10, to: 17, active: true }, // Saudi to Tokyo
  { from: 44, to: 2, active: false }, // Galveston to Rotterdam
  // LNG Routes
  { from: 26, to: 17, active: true }, // Sabine Pass to Tokyo
  { from: 28, to: 29, active: true }, // Qatar to South Korea
  { from: 27, to: 6, active: true }, // Gladstone to Shanghai
  { from: 28, to: 7, active: false }, // Qatar to Mumbai
  // Iron Ore Routes
  { from: 30, to: 22, active: true }, // Port Hedland to Ningbo
  { from: 31, to: 6, active: true }, // Santos to Shanghai
  { from: 48, to: 12, active: true }, // Dampier to Qingdao
  { from: 34, to: 22, active: false }, // Tubarão to Ningbo
  // Grain Routes
  { from: 35, to: 6, active: true }, // New Orleans to Shanghai
  { from: 36, to: 6, active: true }, // Paranaguá to Shanghai
  { from: 38, to: 17, active: false }, // Vancouver to Tokyo
  { from: 39, to: 6, active: true }, // Rosario to Shanghai
  // Copper Routes
  { from: 46, to: 6, active: true }, // Antofagasta to Shanghai
  { from: 47, to: 22, active: false }, // Escondida to Ningbo
];

interface GeoFeature {
  type: string;
  geometry: any;
  properties: any;
}

function interpolateProjection(raw0: any, raw1: any) {
  const mutate: any = d3.geoProjectionMutator((t: number) => (x: number, y: number) => {
    const [x0, y0] = raw0(x, y);
    const [x1, y1] = raw1(x, y);
    return [x0 + t * (x1 - x0), y0 + t * (y1 - y0)];
  });
  let t = 0;
  return Object.assign((mutate as any)(t), {
    alpha(_: number) {
      return arguments.length ? (mutate as any)((t = +_)) : t;
    },
  });
}

interface CommodityGlobeProps {
  className?: string;
  onHotspotClick?: (hotspot: typeof COMMODITY_HOTSPOTS[0]) => void;
}

export function CommodityGlobe({ className = '', onHotspotClick }: CommodityGlobeProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [worldData, setWorldData] = useState<GeoFeature[]>([]);
  const [rotation, setRotation] = useState<[number, number]>([-20, -10]);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState<[number, number]>([0, 0]);
  const [selectedHotspot, setSelectedHotspot] = useState<typeof COMMODITY_HOTSPOTS[0] | null>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const animationRef = useRef<number>();

  const width = 800;
  const height = 600;

  // Load world data
  useEffect(() => {
    const loadWorldData = async () => {
      try {
        const response = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
        const world: any = await response.json();
        const countries = feature(world, world.objects.countries).features;
        setWorldData(countries);
      } catch (error) {
        console.error('Error loading world data:', error);
      }
    };
    loadWorldData();
  }, []);

  // Auto-rotation
  useEffect(() => {
    if (!isAutoRotating || isDragging || isAnimating) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const animate = () => {
      setRotation(prev => [(prev[0] + 0.15) % 360, prev[1]]);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAutoRotating, isDragging, isAnimating]);

  const handleMouseDown = (event: React.MouseEvent) => {
    setIsDragging(true);
    setIsAutoRotating(false);
    const rect = svgRef.current?.getBoundingClientRect();
    if (rect) {
      setLastMouse([event.clientX - rect.left, event.clientY - rect.top]);
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging) return;

    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    const currentMouse: [number, number] = [event.clientX - rect.left, event.clientY - rect.top];
    const dx = currentMouse[0] - lastMouse[0];
    const dy = currentMouse[1] - lastMouse[1];

    const sensitivity = 0.4;
    setRotation(prev => [
      prev[0] + dx * sensitivity,
      Math.max(-60, Math.min(60, prev[1] - dy * sensitivity))
    ]);

    setLastMouse(currentMouse);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Main visualization
  useEffect(() => {
    if (!svgRef.current || worldData.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const t = progress / 100;
    const alpha = Math.pow(t, 0.5);
    const scale = d3.scaleLinear().domain([0, 1]).range([250, 140]);

    const projection = interpolateProjection(d3.geoOrthographicRaw, d3.geoEquirectangularRaw)
      .scale(scale(alpha))
      .translate([width / 2, height / 2])
      .rotate([rotation[0], rotation[1]])
      .precision(0.1);

    projection.alpha(alpha);

    const path = d3.geoPath(projection);

    // Defs for gradients and filters
    const defs = svg.append('defs');

    // Glow filter for hotspots
    const glowFilter = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');
    
    glowFilter.append('feGaussianBlur')
      .attr('stdDeviation', '3')
      .attr('result', 'coloredBlur');
    
    const feMerge = glowFilter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Gradient for ocean
    const oceanGradient = defs.append('radialGradient')
      .attr('id', 'oceanGradient')
      .attr('cx', '30%')
      .attr('cy', '30%');
    
    oceanGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', 'hsl(var(--primary) / 0.15)');
    
    oceanGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'hsl(var(--primary) / 0.05)');

    // Background sphere
    const spherePath = path({ type: 'Sphere' });
    if (spherePath) {
      svg.append('path')
        .datum({ type: 'Sphere' })
        .attr('d', spherePath)
        .attr('fill', 'url(#oceanGradient)')
        .attr('stroke', 'hsl(var(--border))')
        .attr('stroke-width', 1.5);
    }

    // Graticule
    try {
      const graticule = d3.geoGraticule();
      const graticulePath = path(graticule());
      if (graticulePath) {
        svg.append('path')
          .datum(graticule())
          .attr('d', graticulePath)
          .attr('fill', 'none')
          .attr('stroke', 'hsl(var(--muted-foreground) / 0.15)')
          .attr('stroke-width', 0.5);
      }
    } catch (error) {}

    // Countries
    svg.selectAll('.country')
      .data(worldData)
      .enter()
      .append('path')
      .attr('class', 'country')
      .attr('d', (d) => {
        try {
          const pathString = path(d as any);
          if (!pathString || pathString.includes('NaN')) return '';
          return pathString;
        } catch (error) {
          return '';
        }
      })
      .attr('fill', 'hsl(var(--muted) / 0.6)')
      .attr('stroke', 'hsl(var(--border))')
      .attr('stroke-width', 0.5)
      .style('transition', 'fill 0.3s ease')
      .on('mouseenter', function() {
        d3.select(this).attr('fill', 'hsl(var(--accent))');
      })
      .on('mouseleave', function() {
        d3.select(this).attr('fill', 'hsl(var(--muted) / 0.6)');
      });

    // Trade routes
    TRADE_ROUTES.forEach(route => {
      const fromSpot = COMMODITY_HOTSPOTS.find(h => h.id === route.from);
      const toSpot = COMMODITY_HOTSPOTS.find(h => h.id === route.to);
      if (!fromSpot || !toSpot) return;

      const fromCoords = projection([fromSpot.lon, fromSpot.lat]);
      const toCoords = projection([toSpot.lon, toSpot.lat]);
      
      if (!fromCoords || !toCoords) return;

      // Check if both points are visible
      const fromVisible = d3.geoDistance(
        [fromSpot.lon, fromSpot.lat],
        [-rotation[0], -rotation[1]]
      ) < Math.PI / 2;
      const toVisible = d3.geoDistance(
        [toSpot.lon, toSpot.lat],
        [-rotation[0], -rotation[1]]
      ) < Math.PI / 2;

      if (!fromVisible && !toVisible) return;

      // Create curved path
      const midX = (fromCoords[0] + toCoords[0]) / 2;
      const midY = (fromCoords[1] + toCoords[1]) / 2 - 40;
      
      const routePath = svg.append('path')
        .attr('d', `M ${fromCoords[0]} ${fromCoords[1]} Q ${midX} ${midY} ${toCoords[0]} ${toCoords[1]}`)
        .attr('fill', 'none')
        .attr('stroke', route.active ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground) / 0.3)')
        .attr('stroke-width', route.active ? 2 : 1)
        .attr('stroke-dasharray', route.active ? '8,4' : '4,4')
        .attr('opacity', fromVisible && toVisible ? 0.7 : 0.3);

      // Animated dash for active routes
      if (route.active) {
        const pathLength = routePath.node()?.getTotalLength() || 0;
        routePath
          .attr('stroke-dasharray', `${pathLength}`)
          .attr('stroke-dashoffset', pathLength)
          .transition()
          .duration(2000)
          .ease(d3.easeLinear)
          .attr('stroke-dashoffset', 0)
          .on('end', function repeat() {
            d3.select(this)
              .attr('stroke-dashoffset', pathLength)
              .transition()
              .duration(2000)
              .ease(d3.easeLinear)
              .attr('stroke-dashoffset', 0)
              .on('end', repeat);
          });
      }
    });

    // Hotspots
    COMMODITY_HOTSPOTS.forEach((spot) => {
      const coords = projection([spot.lon, spot.lat]);
      if (!coords) return;

      // Check if visible (front of globe)
      const distance = d3.geoDistance(
        [spot.lon, spot.lat],
        [-rotation[0], -rotation[1]]
      );
      const isVisible = distance < Math.PI / 2;
      
      if (!isVisible) return;

      const group = svg.append('g')
        .attr('class', 'hotspot')
        .attr('transform', `translate(${coords[0]}, ${coords[1]})`)
        .style('cursor', 'pointer')
        .on('click', () => {
          setSelectedHotspot(spot);
          onHotspotClick?.(spot);
        });

      // Pulse animation ring
      group.append('circle')
        .attr('r', 12)
        .attr('fill', 'none')
        .attr('stroke', spot.color)
        .attr('stroke-width', 2)
        .attr('opacity', 0.5)
        .append('animate')
        .attr('attributeName', 'r')
        .attr('from', '6')
        .attr('to', '20')
        .attr('dur', '2s')
        .attr('repeatCount', 'indefinite');

      group.append('circle')
        .attr('r', 12)
        .attr('fill', 'none')
        .attr('stroke', spot.color)
        .attr('stroke-width', 2)
        .attr('opacity', 0)
        .append('animate')
        .attr('attributeName', 'opacity')
        .attr('from', '0.8')
        .attr('to', '0')
        .attr('dur', '2s')
        .attr('repeatCount', 'indefinite');

      // Main dot
      group.append('circle')
        .attr('r', 6)
        .attr('fill', spot.color)
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)
        .attr('filter', 'url(#glow)');

      // Label (only for selected or hovered)
      if (selectedHotspot?.id === spot.id) {
        group.append('text')
          .attr('x', 12)
          .attr('y', -8)
          .attr('fill', 'hsl(var(--foreground))')
          .attr('font-size', '12px')
          .attr('font-weight', '600')
          .text(spot.name);
        
        group.append('text')
          .attr('x', 12)
          .attr('y', 6)
          .attr('fill', 'hsl(var(--muted-foreground))')
          .attr('font-size', '10px')
          .text(spot.commodity);
      }
    });

  }, [worldData, progress, rotation, selectedHotspot, onHotspotClick]);

  const handleAnimate = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setIsAutoRotating(false);
    const startProgress = progress;
    const endProgress = startProgress === 0 ? 100 : 0;
    const duration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      const currentProgress = startProgress + (endProgress - startProgress) * eased;

      setProgress(currentProgress);

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    animate();
  };

  const getHotspotIcon = (type: string) => {
    switch (type) {
      case 'trading': return <DollarSign size={14} />;
      case 'hub': return <Warehouse size={14} />;
      case 'export': return <Ship size={14} />;
      case 'import': return <Ship size={14} />;
      case 'refinery': return <Factory size={14} />;
      case 'storage': return <Fuel size={14} />;
      default: return <MapPin size={14} />;
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Globe SVG */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full cursor-grab active:cursor-grabbing rounded-xl bg-gradient-to-br from-background to-muted/30"
        preserveAspectRatio="xMidYMid meet"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      {/* Legend */}
      <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-3 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
          <Globe2 size={14} className="text-primary" />
          Commodity Hotspots
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { type: 'trading', label: 'Trading', color: '#3b82f6' },
            { type: 'hub', label: 'Hub', color: '#10b981' },
            { type: 'export', label: 'Export', color: '#f59e0b' },
            { type: 'refinery', label: 'Refinery', color: '#06b6d4' },
          ].map(item => (
            <div key={item.type} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* Selected Hotspot Info */}
      {selectedHotspot && (
        <div className="absolute top-4 right-4 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-4 w-64 shadow-xl">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-foreground">{selectedHotspot.name}</h3>
              <p className="text-xs text-muted-foreground">{selectedHotspot.country}</p>
            </div>
            <Badge 
              variant="secondary" 
              className="text-[10px]"
              style={{ backgroundColor: `${selectedHotspot.color}20`, color: selectedHotspot.color }}
            >
              {selectedHotspot.type}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Fuel size={14} className="text-muted-foreground" />
              <span className="text-foreground">{selectedHotspot.commodity}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp size={14} className="text-muted-foreground" />
              <span className="text-foreground">{selectedHotspot.volume}</span>
            </div>
          </div>
          <button 
            onClick={() => setSelectedHotspot(null)}
            className="mt-3 w-full py-1.5 text-xs text-muted-foreground hover:text-foreground border border-border rounded-md hover:bg-accent transition-colors"
          >
            Close
          </button>
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            variant={isAutoRotating ? 'default' : 'outline'}
            size="sm"
            className="h-8 text-xs"
          >
            {isAutoRotating ? 'Pause Rotation' : 'Auto Rotate'}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleAnimate}
            disabled={isAnimating}
            size="sm"
            className="h-8 text-xs"
          >
            {isAnimating ? 'Transforming...' : progress === 0 ? 'Flatten to Map' : 'Form Globe'}
          </Button>
          <Button
            onClick={() => {
              setRotation([-20, -10]);
              setProgress(0);
              setSelectedHotspot(null);
            }}
            variant="outline"
            size="sm"
            className="h-8 text-xs"
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Active Trade Routes Count */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-card/90 backdrop-blur-sm border border-border rounded-full px-4 py-1.5 flex items-center gap-2">
        <Zap size={12} className="text-primary animate-pulse" />
        <span className="text-xs font-medium text-foreground">
          {TRADE_ROUTES.filter(r => r.active).length} Active Trade Routes
        </span>
      </div>
    </div>
  );
}

export default CommodityGlobe;


