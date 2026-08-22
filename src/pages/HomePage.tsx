import Hero from '../components/Hero';
import TrustBar from '../components/TrustBar';
import Services from '../components/Services';
import HowItWorks from '../components/HowItWorks';
import FunctionalDemosSection from '../components/FunctionalDemosSection';
import Benefits from '../components/Benefits';
import Footer from '../components/Footer';
import OracleMigrationSection from '../components/OracleMigrationSection';
import type { AppCopy, Language } from '../i18n';

type HomePageProps = {
  content: AppCopy;
  language: Language;
  onToggleLanguage: () => void;
  onOpenCookiePolicy: () => void;
};

export default function HomePage({ content, language, onToggleLanguage, onOpenCookiePolicy }: HomePageProps) {
  return (
    <main id="contenido-principal">
      <Hero content={content.hero} onToggleLanguage={onToggleLanguage} />
      <HowItWorks content={content.process} />
      <TrustBar content={content.hero} />
      <FunctionalDemosSection content={content.functionalDemos} />
      <OracleMigrationSection content={content.oracleMigration} language={language} />
      <Services content={content.services} variant="solutions" />
      <Services content={content.services} variant="main" />
      <Benefits content={content.benefits} />
      <Footer content={content.footer} onOpenCookiePolicy={onOpenCookiePolicy} />
    </main>
  );
}
