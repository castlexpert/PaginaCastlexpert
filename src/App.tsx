import { useEffect, useState } from 'react';
import Hero from './components/Hero';
import Services from './components/Services';
import HowItWorks from './components/HowItWorks';
import Benefits from './components/Benefits';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import AdminEntryLink from './components/AdminEntryLink';
import { copy, Language } from './i18n';

function App() {
  const [language, setLanguage] = useState<Language>('es');
  const content = copy[language];

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <div className="min-h-screen bg-transparent text-zinc-900">
      <Hero
        content={content.hero}
        onToggleLanguage={() => setLanguage((current) => (current === 'es' ? 'en' : 'es'))}
      />
      <HowItWorks content={content.process} />
      <Services content={content.services} />
      <Benefits content={content.benefits} />
      <Contact content={content.contact} />
      <Footer content={content.footer} />
      <WhatsAppButton content={content.whatsapp} />
      <AdminEntryLink />
    </div>
  );
}

export default App;
