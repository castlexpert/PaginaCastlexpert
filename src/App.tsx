import { useEffect, useState } from 'react';
import Hero from './components/Hero';
import Services from './components/Services';
import HowItWorks from './components/HowItWorks';
import Benefits from './components/Benefits';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import AdminEntryLink from './components/AdminEntryLink';
import AboutModal from './components/AboutModal';
import CookieBanner, { hasStoredCookieConsent, storeCookieConsent } from './components/CookieBanner';
import CookiePolicyModal from './components/CookiePolicyModal';
import ChatWidget from './components/ChatWidget';
import SeoHead from './components/SeoHead';
import { copy, Language } from './i18n';

function App() {
  const [language, setLanguage] = useState<Language>('es');
  const [aboutOpen, setAboutOpen] = useState(false);
  const [cookiePolicyOpen, setCookiePolicyOpen] = useState(false);
  const [hasCookieConsent, setHasCookieConsent] = useState(() => hasStoredCookieConsent());
  const content = copy[language];
  const showCookieBanner = !hasCookieConsent;

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  function handleAcceptCookies() {
    storeCookieConsent();
    setHasCookieConsent(true);
  }

  return (
    <div className="min-h-screen bg-transparent text-zinc-900">
      <SeoHead language={language} />
      <main id="contenido-principal">
        <Hero
          content={content.hero}
          onToggleLanguage={() => setLanguage((current) => (current === 'es' ? 'en' : 'es'))}
        />
        <HowItWorks content={content.process} />
        <Services content={content.services} />
        <Benefits content={content.benefits} />
        <Contact content={content.contact} />
        <Footer
          content={content.footer}
          onOpenAbout={() => setAboutOpen(true)}
          onOpenCookiePolicy={() => setCookiePolicyOpen(true)}
        />
      </main>
      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} content={content.about} />
      <CookiePolicyModal open={cookiePolicyOpen} onClose={() => setCookiePolicyOpen(false)} content={content.cookies} />
      <CookieBanner
        content={content.cookies}
        visible={showCookieBanner}
        onAccept={handleAcceptCookies}
        onOpenPolicy={() => setCookiePolicyOpen(true)}
      />
      <ChatWidget content={content.chat} language={language} layoutCookieBanner={showCookieBanner} />
      <WhatsAppButton content={content.whatsapp} layoutCookieBanner={showCookieBanner} />
      <AdminEntryLink layoutCookieBanner={showCookieBanner} />
    </div>
  );
}

export default App;
