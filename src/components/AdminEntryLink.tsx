import { Shield } from 'lucide-react';

const defaultAdminUrl = 'https://admin.castlexpert.com';

type AdminEntryLinkProps = {
  layoutCookieBanner?: boolean;
};

export default function AdminEntryLink({ layoutCookieBanner }: AdminEntryLinkProps) {
  const base = import.meta.env.VITE_ADMIN_URL?.replace(/\/$/, '') || defaultAdminUrl;
  const href = `${base}/`;
  void layoutCookieBanner;

  return (
    <a
      href={href}
      target="_blank"
      className="fixed bottom-4 left-4 z-50 rounded-full border border-black/10 bg-white/25 p-2 text-zinc-400 shadow-sm backdrop-blur-md transition hover:bg-white/45 hover:text-zinc-600"
      title="Área administrativa"
      aria-label="Área administrativa"
      rel="noopener noreferrer"
    >
      <Shield className="h-4 w-4" strokeWidth={1.5} />
    </a>
  );
}
