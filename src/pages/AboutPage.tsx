import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import SimplePageHeader from '../components/SimplePageHeader';
import type { AppCopy } from '../i18n';

type AboutPageProps = {
  content: AppCopy;
  onToggleLanguage: () => void;
  onOpenCookiePolicy: () => void;
};

export default function AboutPage({
  content,
  onToggleLanguage,
  onOpenCookiePolicy,
}: AboutPageProps) {
  const [a, b, c] = content.about.paragraphs;
  const p = content.pages.aboutPage;

  return (
    <>
      <SimplePageHeader languageButton={content.hero.languageButton} onToggleLanguage={onToggleLanguage} />

      <main id="contenido-principal" className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="cx-card cx-card-hover rounded-[1.55rem] p-8 sm:p-10">
          <h1 className="font-display text-4xl tracking-tight text-zinc-950 sm:text-[2.65rem]">{p.title}</h1>

          <div className="mt-8 space-y-5 text-lg leading-relaxed text-zinc-700">
            <p>{a}</p>
            <p>{b}</p>
            <p>{c}</p>
          </div>

          <Link
            to="/"
            className="mt-10 inline-flex items-center gap-2 rounded-xl border border-black/15 bg-[#0d4d38] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0b3f2f]"
          >
            {p.backHome}
          </Link>
        </div>
      </main>

      <Footer content={content.footer} onOpenCookiePolicy={onOpenCookiePolicy} />
    </>
  );
}
