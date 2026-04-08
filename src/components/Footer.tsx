import { Facebook, Instagram, Mail } from 'lucide-react';
import type { AppCopy } from '../i18n';

type FooterProps = {
  content: AppCopy['footer'];
};

export default function Footer({ content }: FooterProps) {
  return (
    <footer className="relative py-12 border-t border-black/15 bg-[#ebe6dd]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#f1ece2] to-[#e6e0d4]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/castlexpert-logo.png"
                alt="Logo oficial de Castlexpert"
                className="h-12 w-12 object-contain"
                loading="lazy"
                decoding="async"
              />
              <span className="text-2xl font-bold text-black">Castlexpert</span>
            </div>
            <p className="text-zinc-600 mb-4">{content.description}</p>
            <p className="text-zinc-500 text-sm">castlexpertcr.com</p>
          </div>

          <div>
            <h3 className="text-black font-semibold mb-4">{content.linksTitle}</h3>
            <ul className="space-y-2">
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
            </ul>
          </div>

          <div>
            <h3 className="text-black font-semibold mb-4">{content.followUs}</h3>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-2xl border border-black/15 flex items-center justify-center hover:bg-white/30 hover:border-black/25 transition-all group"
              >
                <Facebook className="w-5 h-5 text-zinc-600 group-hover:text-black transition-colors" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-2xl border border-black/15 flex items-center justify-center hover:bg-white/30 hover:border-black/25 transition-all group"
              >
                <Instagram className="w-5 h-5 text-zinc-600 group-hover:text-black transition-colors" />
              </a>
              <a
                href="mailto:info@castlexpertcr.com"
                className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-2xl border border-black/15 flex items-center justify-center hover:bg-white/30 hover:border-black/25 transition-all group"
              >
                <Mail className="w-5 h-5 text-zinc-600 group-hover:text-black transition-colors" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-black/15 text-center text-zinc-600">
          <p>&copy; {new Date().getFullYear()} Castlexpert. {content.rights}</p>
        </div>
      </div>
    </footer>
  );
}

