import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  
  // Disable the dev indicators (the "Compiling/Rendering" thing)
  devIndicators: false,
  
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', 'framer-motion'],
  },
  
  turbopack: {},
};

export default nextConfig;
