'use client';

import { motion } from 'framer-motion';
import { Shield, MessageSquare, FileCheck, Handshake, Globe, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-level encryption and security protocols protect your sensitive trading data and transactions.',
  },
  {
    icon: MessageSquare,
    title: 'Secure Communication',
    description: 'End-to-end encrypted messaging for confidential negotiations and deal discussions.',
  },
  {
    icon: FileCheck,
    title: 'Document Verification',
    description: 'Industry-expert validation ensures authenticity of contracts and compliance documents.',
  },
  {
    icon: Handshake,
    title: 'Transaction Facilitation',
    description: 'Streamlined deal management with escrow services and complete audit trails.',
  },
  {
    icon: Globe,
    title: 'Global Network',
    description: 'Connect with verified counterparties across all major commodity markets worldwide.',
  },
  {
    icon: BarChart3,
    title: 'Market Intelligence',
    description: 'Real-time market data and AI-powered insights to inform trading decisions.',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
            Everything You Need
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Comprehensive tools and infrastructure for professional commodity trading operations.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group p-6 bg-white rounded-2xl border border-neutral-200 hover:border-neutral-300 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center mb-4 group-hover:bg-neutral-900 transition-colors">
                <feature.icon size={24} className="text-neutral-700 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
