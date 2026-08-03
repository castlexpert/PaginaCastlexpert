import { Download, ExternalLink, ArrowLeft, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Footer from '../components/Footer';
import SimplePageHeader from '../components/SimplePageHeader';
import DemoVideoPlayer from '../components/DemoVideoPlayer';
import type { AppCopy } from '../i18n';
import { getFunctionalDemo, type FunctionalDemoId } from '../data/functionalDemos';
import { getAdminAnalyticsBaseUrl } from '../lib/publicApi';
import { trackEvent } from '../lib/siteAnalytics';

type DemoProductPageProps = {
  demoId: FunctionalDemoId;
  content: AppCopy;
  onToggleLanguage: () => void;
  onOpenCookiePolicy: () => void;
};

export default function DemoProductPage({
  demoId,
  content,
  onToggleLanguage,
  onOpenCookiePolicy,
}: DemoProductPageProps) {
  const demo = getFunctionalDemo(demoId);
  const copy = content.functionalDemos;
  const item = copy.items.find((i) => i.id === demoId);
  const [apkBusy, setApkBusy] = useState(false);
  const [apkError, setApkError] = useState<string | null>(null);
  const [videoOpen, setVideoOpen] = useState(false);

  if (!demo || !item) {
    return (
      <>
        <SimplePageHeader languageButton={content.hero.languageButton} onToggleLanguage={onToggleLanguage} />
        <main className="mx-auto max-w-3xl px-4 py-16">
          <p className="text-zinc-600">Demo no encontrado.</p>
          <Link to="/" className="mt-6 inline-block text-[#0d4d38] underline">
            {copy.backHome}
          </Link>
        </main>
      </>
    );
  }

  async function downloadApk() {
    if (!demo?.apkSlug) return;
    setApkBusy(true);
    setApkError(null);
    trackEvent('apk_download_click', { slug: demo.apkSlug, demo: demo.id });
    const base = getAdminAnalyticsBaseUrl();
    if (!base) {
      setApkError(copy.apkUnavailable);
      setApkBusy(false);
      return;
    }
    try {
      window.location.href = `${base}/api/public/apk/${encodeURIComponent(demo.apkSlug)}/download`;
    } catch {
      setApkError(copy.apkUnavailable);
    } finally {
      setApkBusy(false);
    }
  }

  return (
    <>
      <SimplePageHeader languageButton={content.hero.languageButton} onToggleLanguage={onToggleLanguage} />

      <main id="contenido-principal">
        <section className="relative overflow-hidden border-b border-black/8">
          <div className="absolute inset-0">
            <img src={demo.image} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#071a14]/95 via-[#0a2e24]/88 to-[#0d4d38]/72" />
            <div className="absolute inset-0 bg-black/25" />
          </div>
          <div className="relative z-10 mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/75">{copy.eyebrow}</p>
            <h1 className="mt-3 max-w-2xl font-display text-4xl tracking-tight text-white sm:text-5xl">{item.title}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/90">{item.tagline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={demo.guidePath}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#0d4d38] shadow-lg transition hover:bg-white/95"
                onClick={() => trackEvent('demo_guide_open', { demo: demo.id })}
              >
                <ExternalLink className="h-4 w-4" />
                {copy.openGuide}
              </a>
              {demo.video ? (
                <button
                  type="button"
                  onClick={() => {
                    setVideoOpen(true);
                    trackEvent('demo_video_open', { demo: demo.id });
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
                >
                  <Play className="h-4 w-4" />
                  {copy.watchVideo}
                </button>
              ) : null}
              {demo.apkSlug ? (
                <button
                  type="button"
                  disabled={apkBusy}
                  onClick={() => void downloadApk()}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20 disabled:opacity-60"
                >
                  <Download className="h-4 w-4" />
                  {apkBusy ? copy.apkDownloading : copy.downloadApk}
                </button>
              ) : null}
              <Link
                to="/contacto"
                className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-transparent px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                onClick={() => trackEvent('demo_contact_cta', { demo: demo.id })}
              >
                {copy.requestDemo}
              </Link>
            </div>
            {apkError ? <p className="mt-4 text-sm text-amber-200">{apkError}</p> : null}
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h2 className="font-display text-2xl text-zinc-950 sm:text-3xl">{copy.aboutTitle}</h2>
              <p className="mt-4 text-lg leading-relaxed text-zinc-700">{item.description}</p>
              <ul className="mt-8 space-y-3">
                {item.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex gap-3 rounded-xl border border-black/8 bg-white/50 px-4 py-3 text-zinc-800"
                  >
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#0d4d38]" aria-hidden />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <aside className="rounded-2xl border border-black/10 bg-[#0d4d38] p-6 text-white shadow-xl shadow-[#0d4d38]/15 sm:p-8">
              <h3 className="text-xl font-bold">{copy.tryTitle}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/85">{copy.tryDescription}</p>
              <a
                href={demo.guidePath}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3.5 text-sm font-bold text-[#0d4d38] transition hover:bg-zinc-100"
              >
                {copy.openGuide}
              </a>
              {demo.video ? (
                <button
                  type="button"
                  onClick={() => {
                    setVideoOpen(true);
                    trackEvent('demo_video_open', { demo: demo.id, source: 'aside' });
                  }}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-white/20"
                >
                  <Play className="h-4 w-4" />
                  {copy.watchVideo}
                </button>
              ) : null}
              {demo.apkSlug ? (
                <button
                  type="button"
                  disabled={apkBusy}
                  onClick={() => void downloadApk()}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-white/20 disabled:opacity-60"
                >
                  <Download className="h-4 w-4" />
                  {copy.downloadApk}
                </button>
              ) : null}
              <p className="mt-4 text-xs leading-relaxed text-white/65">{item.guideHint}</p>
            </aside>
          </div>

          <Link
            to="/#demos"
            className="mt-12 inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 transition hover:text-[#0d4d38]"
          >
            <ArrowLeft className="h-4 w-4" />
            {copy.backDemos}
          </Link>
        </section>
      </main>

      {demo.video ? (
        <DemoVideoPlayer
          open={videoOpen}
          src={demo.video.src}
          title={item.title}
          poster={demo.video.poster}
          closeLabel={content.services.modalLabels.closeVideo}
          onClose={() => setVideoOpen(false)}
        />
      ) : null}

      <Footer content={content.footer} onOpenCookiePolicy={onOpenCookiePolicy} />
    </>
  );
}
