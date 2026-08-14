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
import ContactPage from './pages/ContactPage';
import DemoProductPage from './pages/DemoProductPage';
import MockupsPage from './pages/MockupsPage';
import { enableSiteAnalytics, trackPageView } from './lib/siteAnalytics';

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

  useEffect(() => {
    if (!hasCookieConsent || contactCardOnly) return;
    enableSiteAnalytics();
    trackPageView(location.pathname);
  }, [location.pathname, hasCookieConsent, contactCardOnly]);

  function handleAcceptCookies() {
    storeCookieConsent();
    setHasCookieConsent(true);
    enableSiteAnalytics();
    trackPageView(location.pathname);
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
        <Route
          path="/contacto"
          element={
            <ContactPage
              content={content}
              onToggleLanguage={() => setLanguage((current) => (current === 'es' ? 'en' : 'es'))}
              onOpenCookiePolicy={() => setCookiePolicyOpen(true)}
            />
          }
        />
        <Route
          path="/contact"
          element={
            <ContactPage
              content={content}
              onToggleLanguage={() => setLanguage((current) => (current === 'es' ? 'en' : 'es'))}
              onOpenCookiePolicy={() => setCookiePolicyOpen(true)}
            />
          }
        />
        <Route path="/castlexpertCard" element={<ContactCardPage />} />
        <Route path="/castlexpert-card" element={<ContactCardPage />} />
        <Route
          path="/demos/tracklogic"
          element={
            <DemoProductPage
              demoId="tracklogic"
              content={content}
              onToggleLanguage={() => setLanguage((current) => (current === 'es' ? 'en' : 'es'))}
              onOpenCookiePolicy={() => setCookiePolicyOpen(true)}
            />
          }
        />
        <Route
          path="/demos/foodly"
          element={
            <DemoProductPage
              demoId="foodly"
              content={content}
              onToggleLanguage={() => setLanguage((current) => (current === 'es' ? 'en' : 'es'))}
              onOpenCookiePolicy={() => setCookiePolicyOpen(true)}
            />
          }
        />
        <Route
          path="/demos/cmms"
          element={
            <DemoProductPage
              demoId="cmms"
              content={content}
              onToggleLanguage={() => setLanguage((current) => (current === 'es' ? 'en' : 'es'))}
              onOpenCookiePolicy={() => setCookiePolicyOpen(true)}
            />
          }
        />
        <Route
          path="/demos/pura-puntos"
          element={
            <DemoProductPage
              demoId="pura-puntos"
              content={content}
              onToggleLanguage={() => setLanguage((current) => (current === 'es' ? 'en' : 'es'))}
              onOpenCookiePolicy={() => setCookiePolicyOpen(true)}
            />
          }
        />
        <Route
          path="/mockups"
          element={
            <MockupsPage
              content={content}
              onToggleLanguage={() => setLanguage((current) => (current === 'es' ? 'en' : 'es'))}
              onOpenCookiePolicy={() => setCookiePolicyOpen(true)}
            />
          }
        />
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
