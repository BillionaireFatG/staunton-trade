'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Globe, Zap } from 'lucide-react';
import dynamic from 'next/dynamic';

// Lazy load the globe for better performance
const CommodityGlobe = dynamic(() => import('@/components/CommodityGlobe').then(mod => ({ default: mod.CommodityGlobe })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] rounded-2xl bg-neutral-100 animate-pulse flex items-center justify-center">
      <Globe size={64} className="text-neutral-300" />
    </div>
  ),
});

export default function Hero() {
  return (
    <section className="relative min-h-screen pt-16 overflow-hidden bg-white">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-50 pointer-events-none" />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-neutral-50 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-100 border border-neutral-200 text-sm font-medium text-neutral-700 mb-8"
            >
              <Zap size={14} className="text-neutral-900" />
              Enterprise-Grade Trading Infrastructure
            </motion.div>

            {/* Title */}
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Global Commodity
              <span className="block text-neutral-500 mt-2">Trading Platform</span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              className="text-lg text-neutral-600 max-w-xl mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              Staunton Trade provides institutional-grade infrastructure for commodities professionals. 
              Secure document verification, enterprise communication, and transaction facilitation 
              for high-value trading operations.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row items-start gap-4 mb-12 relative z-50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              <Link 
                href="/sign-up"
                className="group flex items-center gap-2 px-8 py-4 text-base font-semibold bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-all shadow-lg shadow-neutral-900/20 cursor-pointer"
              >
                Request Access
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/sign-in"
                className="px-8 py-4 text-base font-semibold text-neutral-700 border-2 border-neutral-300 rounded-xl hover:bg-neutral-50 hover:border-neutral-400 transition-all cursor-pointer"
              >
                Sign In
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="flex gap-8 sm:gap-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            >
              <div>
                <div className="text-3xl font-bold text-neutral-900">10K+</div>
                <div className="text-sm text-neutral-500 mt-1">Active Users</div>
              </div>
              <div className="w-px bg-neutral-200" />
              <div>
                <div className="text-3xl font-bold text-neutral-900">50K+</div>
                <div className="text-sm text-neutral-500 mt-1">Documents</div>
              </div>
              <div className="w-px bg-neutral-200" />
              <div>
                <div className="text-3xl font-bold text-neutral-900">$2B+</div>
                <div className="text-sm text-neutral-500 mt-1">Trade Volume</div>
              </div>
            </motion.div>
          </div>

          {/* Right - Globe */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-neutral-50 to-neutral-100 border border-neutral-200 shadow-2xl shadow-neutral-200/50">
              <CommodityGlobe className="w-full" />
              
              {/* Floating cards */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-neutral-200"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-medium text-neutral-700">Live Trading</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-neutral-200"
              >
                <div className="text-xs text-neutral-500">Active Hotspots</div>
                <div className="text-lg font-bold text-neutral-900">15 Locations</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
