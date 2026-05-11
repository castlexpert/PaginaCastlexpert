import { Link } from 'react-router-dom';

type SimplePageHeaderProps = {
  languageButton: string;
  onToggleLanguage: () => void;
};

export default function SimplePageHeader({ languageButton, onToggleLanguage }: SimplePageHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-black/10 bg-[#f7f4ed]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="font-display text-2xl italic tracking-tight text-zinc-900 transition hover:text-black"
        >
          CastleXpert
        </Link>
        <button
          type="button"
          onClick={onToggleLanguage}
          className="rounded-full border border-black/10 bg-white/40 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-zinc-800 transition hover:bg-white/65"
        >
          {languageButton}
        </button>
      </div>
    </header>
  );
}
