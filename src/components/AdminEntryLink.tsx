import { Shield } from 'lucide-react';

const defaultAdminUrl = 'https://admin.castlexpert.com';

export default function AdminEntryLink() {
  const base = import.meta.env.VITE_ADMIN_URL?.replace(/\/$/, '') || defaultAdminUrl;
  const href = `${base}/`;

  return (
    <a
      href={href}
      target="_blank"
      className="inline-flex shrink-0 items-center justify-center rounded-full border border-black/10 bg-white/25 p-2 text-zinc-400 shadow-sm backdrop-blur-md transition hover:bg-white/45 hover:text-zinc-600"
      title="Área administrativa"
      aria-label="Área administrativa"
      rel="noopener noreferrer"
    >
      <Shield className="h-4 w-4" strokeWidth={1.5} />
    </a>
  );
}
