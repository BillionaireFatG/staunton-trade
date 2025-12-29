'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, CheckCircle, Shield } from 'lucide-react';

const benefits = [
  'Enterprise security',
  'Regulatory compliance',
  '24/7 support',
];

export default function CTA() {
  return (
    <section className="py-24 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* One-liner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900">
            Fixing Trillion Dollar Markets
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative rounded-3xl bg-white p-8 md:p-12 lg:p-16 border border-neutral-200 shadow-xl"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
                Ready to Transform Your Trading?
              </h2>
              <p className="text-lg text-neutral-600 mb-6">
                Join leading commodities firms managing billions in trade volume. 
                Experience enterprise-grade trading infrastructure.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2 text-sm text-neutral-600">
                    <CheckCircle size={16} className="text-neutral-900" />
                    {benefit}
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4 relative z-50">
                <Link
                  href="/sign-up"
                  className="group flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-all"
                >
                  <Calendar size={18} />
                  Get Started Free
                </Link>
                <Link
                  href="/sign-in"
                  className="flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-neutral-700 border-2 border-neutral-300 rounded-xl hover:bg-neutral-50 transition-colors"
                >
                  Sign In
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-32 h-32 bg-neutral-100 rounded-2xl rotate-6" />
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-neutral-200 rounded-2xl -rotate-6" />
                <div className="relative bg-neutral-50 rounded-2xl border border-neutral-200 p-6 shadow-lg">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center">
                      <Shield className="text-white" size={24} />
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-neutral-900">Secure Platform</div>
                      <div className="text-sm text-neutral-500">Bank-level encryption</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-500">Monthly Volume</span>
                      <span className="font-semibold text-neutral-900">$245M</span>
                    </div>
                    <div className="h-px bg-neutral-200" />
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-500">Active Deals</span>
                      <span className="font-semibold text-neutral-900">1,234</span>
                    </div>
                    <div className="h-px bg-neutral-200" />
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-500">Verified Partners</span>
                      <span className="font-semibold text-neutral-900">8,567</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
