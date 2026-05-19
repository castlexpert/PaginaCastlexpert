import { Download, Globe, Mail, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { contactCard } from '../data/contactCard';

export default function ContactCardPage() {
  const vcfHref = contactCard.vcfPath;

  return (
    <div className="min-h-[100dvh]">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_12%,rgba(255,255,255,0.9),transparent_48%),radial-gradient(circle_at_88%_88%,rgba(13,77,56,0.12),transparent_42%),linear-gradient(165deg,#f7f4ed_0%,#efe9df_55%,#e6e0d4_100%)]"
        aria-hidden
      />

      <main
        id="contenido-principal"
        className="mx-auto flex min-h-[100dvh] max-w-lg flex-col items-center justify-center px-5 py-10"
      >
        <article className="w-full overflow-hidden rounded-[1.75rem] border border-black/10 bg-white/35 shadow-[0_28px_90px_-40px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
          <div className="h-2 bg-gradient-to-r from-[#0d4d38] via-[#1a6b52] to-[#0d4d38]" />

          <div className="px-7 pb-8 pt-9 text-center">
            <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-2xl border border-black/10 bg-white/60 p-3 shadow-sm">
              <img
                src={contactCard.logoPath}
                alt="CastleXpert"
                width={96}
                height={96}
                className="h-full w-full object-contain"
              />
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#0d4d38]">{contactCard.organization}</p>
            <h1 className="mt-3 font-display text-3xl tracking-tight text-zinc-950">{contactCard.fullName}</h1>
            <p className="mt-2 text-base font-medium text-zinc-600">{contactCard.title}</p>
          </div>

          <ul className="space-y-2 border-t border-black/8 px-5 py-5">
            <li>
              <a
                href={`mailto:${contactCard.email}`}
                className="flex items-center gap-4 rounded-xl border border-black/8 bg-white/40 px-4 py-3.5 transition hover:bg-white/70"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0d4d38]/10 text-[#0d4d38]">
                  <Mail className="h-5 w-5" />
                </span>
                <span className="min-w-0 text-left">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">Correo</span>
                  <span className="block truncate text-sm font-semibold text-zinc-900">{contactCard.email}</span>
                </span>
              </a>
            </li>
            <li>
              <a
                href={contactCard.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-xl border border-black/8 bg-white/40 px-4 py-3.5 transition hover:bg-white/70"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366]/15 text-[#128C7E]">
                  <MessageCircle className="h-5 w-5" />
                </span>
                <span className="min-w-0 text-left">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">WhatsApp</span>
                  <span className="block text-sm font-semibold text-zinc-900">{contactCard.phoneDisplay}</span>
                </span>
              </a>
            </li>
            <li>
              <a
                href={contactCard.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-xl border border-black/8 bg-white/40 px-4 py-3.5 transition hover:bg-white/70"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-900/8 text-zinc-800">
                  <Globe className="h-5 w-5" />
                </span>
                <span className="min-w-0 text-left">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">Sitio web</span>
                  <span className="block text-sm font-semibold text-zinc-900">{contactCard.websiteLabel}</span>
                </span>
              </a>
            </li>
          </ul>

          <div className="border-t border-black/8 px-5 pb-7 pt-5">
            <a
              href={vcfHref}
              download={contactCard.vcfDownloadName}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0d4d38] px-5 py-4 text-sm font-bold text-white shadow-lg shadow-[#0d4d38]/25 transition hover:bg-[#0b3f2f]"
            >
              <Download className="h-5 w-5" />
              Guardar contacto
            </a>
            <p className="mt-3 text-center text-xs leading-relaxed text-zinc-500">
              Compatible con iPhone, Android y escaneo NFC. También puedes abrir{' '}
              <a href={vcfHref} className="font-semibold text-[#0d4d38] underline-offset-2 hover:underline">
                contacto.vcf
              </a>{' '}
              directamente.
            </p>
          </div>
        </article>

        <Link
          to="/"
          className="mt-8 text-sm font-medium text-zinc-600 transition hover:text-zinc-900"
        >
          ← Volver a castlexpert.com
        </Link>
      </main>
    </div>
  );
}
