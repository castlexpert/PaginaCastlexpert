import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import CookieBanner, { hasStoredCookieConsent, storeCookieConsent } from './components/CookieBanner';
import CookiePolicyModal from './components/CookiePolicyModal';
import ChatWidget from './components/ChatWidget';
import SeoHead from './components/SeoHead';
import WhatsAppButton from './components/WhatsAppButton';
import SiteBackground from './components/SiteBackground';
import { copy, Language } from './i18n';
import HomePage from './pages/HomePage';
import SiteMapPage from './pages/SiteMapPage';
import AboutPage from './pages/AboutPage';
import ContactCardPage from './pages/ContactCardPage';

function isContactCardPath(pathname: string) {
  const p = pathname.toLowerCase();
  return p === '/castlexpertcard' || p === '/castlexpert-card';
}

function App() {
  const location = useLocation();
  const contactCardOnly = isContactCardPath(location.pathname);
  const [language, setLanguage] = useState<Language>('es');
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
      {!contactCardOnly && <SiteBackground />}
      <SeoHead language={language} pathname={location.pathname} />
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              content={content}
              onToggleLanguage={() => setLanguage((current) => (current === 'es' ? 'en' : 'es'))}
              onOpenCookiePolicy={() => setCookiePolicyOpen(true)}
            />
          }
        />
        <Route
          path="/mapa-del-sitio"
          element={
            <SiteMapPage
              content={content}
              onToggleLanguage={() => setLanguage((current) => (current === 'es' ? 'en' : 'es'))}
              onOpenCookiePolicy={() => setCookiePolicyOpen(true)}
            />
          }
        />
        <Route
          path="/acerca-de"
          element={
            <AboutPage
              content={content}
              onToggleLanguage={() => setLanguage((current) => (current === 'es' ? 'en' : 'es'))}
              onOpenCookiePolicy={() => setCookiePolicyOpen(true)}
            />
          }
        />
        <Route path="/castlexpertCard" element={<ContactCardPage />} />
        <Route path="/castlexpert-card" element={<ContactCardPage />} />
      </Routes>
      {!contactCardOnly && (
        <>
          <CookiePolicyModal open={cookiePolicyOpen} onClose={() => setCookiePolicyOpen(false)} content={content.cookies} />
          <CookieBanner
            content={content.cookies}
            visible={showCookieBanner}
            onAccept={handleAcceptCookies}
            onOpenPolicy={() => setCookiePolicyOpen(true)}
          />
          <ChatWidget content={content.chat} language={language} layoutCookieBanner={showCookieBanner} />
          <WhatsAppButton content={content.whatsapp} layoutCookieBanner={showCookieBanner} />
        </>
      )}
    </div>
  );
}

export default App;
