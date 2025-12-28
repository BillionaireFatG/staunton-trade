'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Users, Globe, Shield } from 'lucide-react';

const stats = [
  {
    icon: TrendingUp,
    value: '$2B+',
    label: 'Trade Volume',
    description: 'Total transaction value processed',
  },
  {
    icon: Users,
    value: '10K+',
    label: 'Active Users',
    description: 'Verified professionals',
  },
  {
    icon: Globe,
    value: '50+',
    label: 'Countries',
    description: 'Global market reach',
  },
  {
    icon: Shield,
    value: '99.9%',
    label: 'Uptime',
    description: 'Enterprise reliability',
  },
];

export default function Stats() {
  return (
    <section id="stats" className="py-24 bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Industry-Leading Performance
          </h2>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Trusted by commodity professionals worldwide
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center p-8 rounded-2xl bg-neutral-800/50 border border-neutral-700"
            >
              <div className="w-14 h-14 rounded-xl bg-neutral-700 flex items-center justify-center mx-auto mb-4">
                <stat.icon size={28} className="text-white" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-base font-semibold text-neutral-300 mb-1">{stat.label}</div>
              <div className="text-sm text-neutral-500">{stat.description}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
