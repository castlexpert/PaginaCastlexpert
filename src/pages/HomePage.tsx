import Hero from '../components/Hero';
import TrustBar from '../components/TrustBar';
import Services from '../components/Services';
import HowItWorks from '../components/HowItWorks';
import FunctionalDemosSection from '../components/FunctionalDemosSection';
import Benefits from '../components/Benefits';
import Footer from '../components/Footer';
import type { AppCopy } from '../i18n';

type HomePageProps = {
  content: AppCopy;
  onToggleLanguage: () => void;
  onOpenCookiePolicy: () => void;
};

export default function HomePage({ content, onToggleLanguage, onOpenCookiePolicy }: HomePageProps) {
  return (
    <main id="contenido-principal">
      <Hero content={content.hero} onToggleLanguage={onToggleLanguage} />
      <HowItWorks content={content.process} />
      <TrustBar content={content.hero} />
      <FunctionalDemosSection content={content.functionalDemos} />
      <Services content={content.services} variant="solutions" />
      <Services content={content.services} variant="main" />
      <Benefits content={content.benefits} />
      <Footer content={content.footer} onOpenCookiePolicy={onOpenCookiePolicy} />
    </main>
  );
}
