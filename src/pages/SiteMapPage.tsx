import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import SimplePageHeader from '../components/SimplePageHeader';
import type { AppCopy } from '../i18n';

type SiteMapPageProps = {
  content: AppCopy;
  onToggleLanguage: () => void;
  onOpenCookiePolicy: () => void;
};

export default function SiteMapPage({
  content,
  onToggleLanguage,
  onOpenCookiePolicy,
}: SiteMapPageProps) {
  const p = content.pages.siteMap;

  const linkCls =
    'block rounded-xl border border-black/10 bg-white/25 px-4 py-3 text-zinc-800 transition hover:bg-white/45 hover:text-black';

  return (
    <>
      <SimplePageHeader languageButton={content.hero.languageButton} onToggleLanguage={onToggleLanguage} />

      <main id="contenido-principal" className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="cx-card cx-card-hover rounded-[1.55rem] p-8 sm:p-10">
          <h1 className="font-display text-4xl tracking-tight text-zinc-950 sm:text-[2.65rem]">{p.title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-zinc-700">{p.intro}</p>

          <ul className="mt-10 space-y-3">
            <li>
              <Link className={linkCls} to="/">
                {p.home}
              </Link>
            </li>
            <li>
              <Link className={linkCls} to="/#services">
                {p.services}
              </Link>
            </li>
            <li>
              <Link className={linkCls} to="/#process">
                {p.process}
              </Link>
            </li>
            <li>
              <Link className={linkCls} to="/#benefits">
                {p.benefits}
              </Link>
            </li>
            <li>
              <Link className={linkCls} to="/#contact">
                {p.contact}
              </Link>
            </li>
            <li>
              <Link className={linkCls} to="/acerca-de">
                {p.about}
              </Link>
            </li>
            <li>
              <button type="button" onClick={onOpenCookiePolicy} className={`w-full text-left ${linkCls}`}>
                {p.cookiePolicy}
              </button>
            </li>
          </ul>

          <p className="mt-8 text-sm leading-relaxed text-zinc-600">{p.note}</p>
        </div>
      </main>

      <Footer content={content.footer} onOpenCookiePolicy={onOpenCookiePolicy} />
    </>
  );
}
