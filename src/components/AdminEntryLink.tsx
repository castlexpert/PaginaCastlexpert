import { Shield } from 'lucide-react';

const defaultAdminUrl = 'http://localhost:5174';

export default function AdminEntryLink() {
  const base = import.meta.env.VITE_ADMIN_URL?.replace(/\/$/, '') || defaultAdminUrl;
  const href = `${base}/login`;

  return (
    <a
      href={href}
      className="fixed bottom-4 left-4 z-50 rounded-full border border-black/10 bg-white/25 p-2 text-zinc-400 shadow-sm backdrop-blur-md transition hover:bg-white/45 hover:text-zinc-600"
      title="Área administrativa"
      aria-label="Área administrativa"
      rel="noopener noreferrer"
    >
      <Shield className="h-4 w-4" strokeWidth={1.5} />
    </a>
  );
}
