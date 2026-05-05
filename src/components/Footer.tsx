import { Facebook, Instagram, Mail } from 'lucide-react';
import type { AppCopy } from '../i18n';

type FooterProps = {
  content: AppCopy['footer'];
  onOpenAbout: () => void;
};

export default function Footer({ content, onOpenAbout }: FooterProps) {
  return (
    <footer className="relative py-12 border-t border-black/15 bg-[#ebe6dd]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#f1ece2] to-[#e6e0d4]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/castlexpert-logo.png"
                alt="Logo oficial de CastleXpert"
                className="h-12 w-12 object-contain"
                loading="lazy"
                decoding="async"
              />
              <span className="text-2xl font-bold text-black">CastleXpert</span>
            </div>
            <p className="text-zinc-600 mb-4">{content.description}</p>
            <p className="text-zinc-500 text-sm">castlexpert.com</p>
          </div>

          <div>
            <h3 className="text-black font-semibold mb-4">{content.linksTitle}</h3>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={onOpenAbout}
                  className="text-zinc-600 hover:text-black transition-colors"
                >
                  {content.aboutLink}
                </button>
              </li>
              <li>
                <a href="#services" className="text-zinc-600 hover:text-black transition-colors">
                  {content.servicesLink}
                </a>
              </li>
              <li>
                <a href="#contact" className="text-zinc-600 hover:text-black transition-colors">
                  {content.contactLink}
                </a>
              </li>
              <li className="pt-3">
                <div className="text-xs font-extrabold uppercase tracking-[0.18em] text-zinc-600">
                  {content.paymentsTitle}
                </div>
                <div className="mt-2 inline-flex items-center gap-2 rounded-xl border border-black/15 bg-white/25 px-3 py-2 backdrop-blur-2xl">
                  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
                    <path
                      fill="#003087"
                      d="M7.55 19.5H5.1a.6.6 0 0 1-.59-.72L7.2 4.7A.75.75 0 0 1 7.94 4h5.5c3.6 0 5.7 1.74 5.7 4.7 0 3.74-2.78 6.05-6.84 6.05h-2.2a.75.75 0 0 0-.74.62l-.96 4.81a.75.75 0 0 1-.73.6Zm4.97-6.54c2.9 0 4.6-1.32 4.6-3.97 0-1.9-1.33-2.98-3.62-2.98H9.1L8.06 12.96h4.46Z"
                    />
                    <path
                      fill="#009CDE"
                      d="M10.45 19.5H8.1a.6.6 0 0 1-.59-.72l.24-1.22.55-2.78.96-4.81A.75.75 0 0 1 10 9.35h2.84c3.26 0 5.15 1.57 5.15 4.23 0 3.45-2.55 5.92-6.28 5.92h-1.23a.75.75 0 0 0-.74.62l-.03.14a.75.75 0 0 1-.72.6Z"
                    />
                  </svg>
                  <span className="text-sm font-extrabold tracking-tight text-zinc-900">PayPal</span>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-black font-semibold mb-4">{content.followUs}</h3>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/castlexpert"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-2xl border border-black/15 flex items-center justify-center hover:bg-white/30 hover:border-black/25 transition-all group"
              >
                <Facebook className="w-5 h-5 text-zinc-600 group-hover:text-black transition-colors" />
              </a>
              <a
                href="https://www.instagram.com/castlexpert"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-2xl border border-black/15 flex items-center justify-center hover:bg-white/30 hover:border-black/25 transition-all group"
              >
                <Instagram className="w-5 h-5 text-zinc-600 group-hover:text-black transition-colors" />
              </a>
              <a
                href="mailto:info@castlexpert.com"
                className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-2xl border border-black/15 flex items-center justify-center hover:bg-white/30 hover:border-black/25 transition-all group"
              >
                <Mail className="w-5 h-5 text-zinc-600 group-hover:text-black transition-colors" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-black/15 text-center text-zinc-600">
          <p>&copy; {new Date().getFullYear()} CastleXpert. {content.rights}</p>
        </div>
      </div>
    </footer>
  );
}

