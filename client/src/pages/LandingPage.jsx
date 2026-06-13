import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/landing/Hero';
import Stats from '../components/landing/Stats';
import Features from '../components/landing/Features';
import TemplateCarousel from '../components/landing/TemplateCarousel';
import Testimonials from '../components/landing/Testimonials';
import Pricing from '../components/landing/Pricing';
import FinalCTA from '../components/landing/FinalCTA';

import SEO from '../components/SEO';

export default function LandingPage() {
  return (
    <>
      <SEO 
        title="Samacvpro - Créez un CV professionnel et design en ligne" 
        description="Créez votre CV professionnel et Portfolio en ligne au Sénégal. Modèles premium, téléchargement PDF immédiat." 
        url="https://samacvpro.com/" 
      />
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Features />
        <TemplateCarousel />
        <Testimonials />
        <Pricing />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
