import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Staunton Trade - Global Commodity Trading Platform",
  description: "The backbone of modern commodity trading. Centralized verification, live tracking, AI-powered insights, and seamless B2B transactions.",
};

// Script to apply theme before React hydrates (prevents flash)
const themeScript = `
  (function() {
    try {
      const CUSTOM_THEMES = ['monochrome', 'monochrome-dark', 'purple-hollow', 'purple-hollow-dark', 'sunset', 'sunset-dark', 'ocean', 'ocean-dark'];
      const storedCustomTheme = localStorage.getItem('staunton-custom-theme');
      const storedTheme = localStorage.getItem('staunton-theme');
      const storedAccent = localStorage.getItem('staunton-accent-color');
      const html = document.documentElement;
      
      // Apply custom theme or default to light
      if (storedCustomTheme && CUSTOM_THEMES.includes(storedCustomTheme)) {
        html.classList.add(storedCustomTheme);
        if (storedCustomTheme.includes('-dark')) {
          html.classList.add('dark');
        } else {
          html.classList.add('light');
        }
      } else if (storedTheme === 'dark') {
        html.classList.add('dark');
      } else if (storedTheme === 'system') {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          html.classList.add('dark');
        } else {
          html.classList.add('light');
        }
      } else {
        // Default to light theme with monochrome
        html.classList.add('light');
        html.classList.add('monochrome');
      }
      
      // Apply accent color (default to monochrome if not set)
      const accentMap = {
        'copper': '24 35% 35%',
        'gold': '38 92% 50%',
        'emerald': '160 84% 39%',
        'blue': '217 91% 60%',
        'purple': '262 83% 58%',
        'pink': '330 81% 60%',
        'red': '0 84% 60%',
        'orange': '25 95% 53%',
        'teal': '175 77% 40%',
        'cyan': '189 94% 43%',
        'monochrome': '0 0% 20%',
      };
      const accent = storedAccent || 'monochrome';
      if (accentMap[accent]) {
        html.style.setProperty('--primary', accentMap[accent]);
        html.style.setProperty('--ring', accentMap[accent]);
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider defaultTheme="light" storageKey="staunton-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
