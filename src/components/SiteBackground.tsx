/**
 * Fondo decorativo (imagen generada) usado en todas las rutas.
 */
export default function SiteBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.28] sm:opacity-[0.22]"
        style={{ backgroundImage: 'url(/assets/cx-site-bg-ai.png)' }}
      />
      <div className="absolute inset-0 bg-[#f3efe7]/82" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/45 via-transparent to-[#e8e2d7]/88" />
    </div>
  );
}
