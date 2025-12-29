'use client';

import { motion } from 'framer-motion';
import { AlertCircle, Clock, DollarSign, FileX } from 'lucide-react';
import Image from 'next/image';

const stats = [
  {
    icon: DollarSign,
    value: '$1.6T',
    label: 'Annual Fraud Loss in Trade',
    description: 'Lack of verification systems',
  },
  {
    icon: Clock,
    value: '5-21 Days',
    label: 'Average Transaction Wait Time',
    description: 'Manual verification delays',
  },
  {
    icon: FileX,
    value: '$150K+',
    label: 'Average Document Issuance Cost Per Transaction',
    description: 'Paper-based inefficiency',
  },
  {
    icon: AlertCircle,
    value: '75 Hours',
    label: 'Average Port Wait Time',
    description: 'Documentation bottlenecks',
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
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Global Commodity Inefficiencies
          </h2>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            That reduce trust in commodity markets
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
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
