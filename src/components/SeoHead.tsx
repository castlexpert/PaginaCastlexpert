import { useEffect } from 'react';
import type { Language } from '../i18n';
import { getSiteUrl, seoByLang } from '../seo/config';

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  const selector = attr === 'name' ? `meta[name="${key}"]` : `meta[property="${key}"]`;
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  let el = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function buildJsonLd(siteUrl: string, lang: Language): object {
  const orgId = `${siteUrl}#organization`;
  const organization = {
    '@type': 'Organization',
    '@id': orgId,
    name: 'CastleXpert',
    url: siteUrl,
    logo: `${siteUrl}/castlexpert-logo.png`,
    image: `${siteUrl}/og-image.png`,
    email: 'info@castlexpert.com',
    sameAs: [
      'https://www.facebook.com/castlexpert',
      'https://www.instagram.com/castlexpert',
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'CR',
    },
  };

  const website = {
    '@type': 'WebSite',
    '@id': `${siteUrl}#website`,
    name: 'CastleXpert',
    url: siteUrl,
    inLanguage: lang === 'es' ? 'es-CR' : 'en',
    publisher: { '@id': orgId },
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [organization, website],
  };
}

type SeoHeadProps = {
  language: Language;
};

export default function SeoHead({ language }: SeoHeadProps) {
  useEffect(() => {
    const siteUrl = getSiteUrl();
    const seo = seoByLang[language];
    const ogLocale = language === 'es' ? 'es_CR' : 'en_US';

    document.title = seo.title;

    upsertMeta('name', 'description', seo.description);
    upsertMeta('name', 'keywords', seo.keywords);
    upsertMeta('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    upsertMeta('property', 'og:title', seo.title);
    upsertMeta('property', 'og:description', seo.description);
    upsertMeta('property', 'og:url', siteUrl);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:locale', ogLocale);
    upsertMeta('property', 'og:site_name', 'CastleXpert');
    upsertMeta('property', 'og:image', `${siteUrl}/og-image.png`);
    upsertMeta('property', 'og:image:width', '1200');
    upsertMeta('property', 'og:image:height', '630');
    upsertMeta('property', 'og:image:alt', seo.title);

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', seo.title);
    upsertMeta('name', 'twitter:description', seo.description);
    upsertMeta('name', 'twitter:image', `${siteUrl}/og-image.png`);

    upsertCanonical(siteUrl);

    const jsonLd = JSON.stringify(buildJsonLd(siteUrl, language));
    let script = document.getElementById('seo-jsonld') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = 'seo-jsonld';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = jsonLd;
  }, [language]);

  return null;
}
