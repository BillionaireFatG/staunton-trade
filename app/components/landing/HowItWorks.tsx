'use client';

import { motion } from 'framer-motion';
import { UserPlus, Search, FileCheck, Handshake } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    step: '01',
    title: 'Create Account',
    description: 'Register and complete verification to join our trusted network.',
  },
  {
    icon: Search,
    step: '02',
    title: 'Find Partners',
    description: 'Browse verified traders filtered by commodity, region, and volume.',
  },
  {
    icon: FileCheck,
    step: '03',
    title: 'Verify Documents',
    description: 'Upload contracts for industry-expert validation.',
  },
  {
    icon: Handshake,
    step: '04',
    title: 'Execute Trades',
    description: 'Complete transactions with real-time tracking and escrow.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Get started with Staunton Trade in four simple steps
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-full h-px bg-neutral-200" />
              )}
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-neutral-100 flex items-center justify-center mb-4 border border-neutral-200">
                    <step.icon size={32} className="text-neutral-700" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center text-xs font-bold text-white">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-neutral-600">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
