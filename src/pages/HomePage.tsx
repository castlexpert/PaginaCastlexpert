import Hero from '../components/Hero';
import TrustBar from '../components/TrustBar';
import Services from '../components/Services';
import HowItWorks from '../components/HowItWorks';
import Benefits from '../components/Benefits';
import Contact from '../components/Contact';
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
      <TrustBar content={content.hero} />
      <HowItWorks content={content.process} />
      <Services content={content.services} />
      <Benefits content={content.benefits} />
      <Contact content={content.contact} />
      <Footer content={content.footer} onOpenCookiePolicy={onOpenCookiePolicy} />
    </main>
  );
}
