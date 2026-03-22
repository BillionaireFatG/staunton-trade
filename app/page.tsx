import Navigation from './components/landing/Navigation';
import Hero from './components/landing/Hero';
import Features from './components/landing/Features';
import HowItWorks from './components/landing/HowItWorks';
import Stats from './components/landing/Stats';
import CTA from './components/landing/CTA';
import Footer from './components/landing/Footer';

export default function Home() {
  return (
    <main>
      <Navigation />
      <Hero />
      <Features />
      <HowItWorks />
      <Stats />
      <CTA />
      <Footer />
    </main>
  );
}
