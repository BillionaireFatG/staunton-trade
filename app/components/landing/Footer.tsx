'use client';

import Link from 'next/link';
import { Twitter, Linkedin, Github } from 'lucide-react';
import { Logo } from '@/components/Logo';

const footerLinks = {
  product: [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Compliance', href: '/compliance' },
    { label: 'Security', href: '/security' },
  ],
};

export default function Footer() {
  return (
    <footer id="contact" className="bg-white border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <Logo size="md" variant="dark" />
            </Link>
            <p className="text-sm text-neutral-600 mb-4 max-w-xs leading-relaxed">
              The premier platform for commodities professionals. 
              Connect, verify, and trade with confidence.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-neutral-900 hover:text-white transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-neutral-900 hover:text-white transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-neutral-900 hover:text-white transition-colors">
                <Github size={18} />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-neutral-900 mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href} 
                    className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-neutral-900 mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-neutral-900 mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-neutral-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-neutral-500">
            © {new Date().getFullYear()} Staunton Trade. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
              Terms
            </Link>
            <Link href="/cookies" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
