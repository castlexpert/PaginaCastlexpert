/**
 * Genera WebP para modales de servicios sin imágenes (UI mockups alineados al estilo CastleXpert).
 * Uso: node scripts/generate-missing-service-images.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const W = 1280;
const H = 800;

const palette = {
  bg1: '#f7f4ed',
  bg2: '#efe9df',
  accent: '#0d4d38',
  accent2: '#1a6b52',
  card: '#ffffff',
  muted: '#6b7280',
  line: '#d4cfc4',
};

function svgWrap(body) {
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${palette.bg1}"/>
          <stop offset="100%" stop-color="${palette.bg2}"/>
        </linearGradient>
        <filter id="sh" x="-8%" y="-8%" width="116%" height="116%">
          <feDropShadow dx="0" dy="10" stdDeviation="18" flood-color="#000" flood-opacity="0.12"/>
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>
      <circle cx="1080" cy="120" r="180" fill="${palette.accent}" opacity="0.08"/>
      <circle cx="160" cy="680" r="220" fill="${palette.accent2}" opacity="0.06"/>
      ${body}
    </svg>`
  );
}

function panel(x, y, w, h, extra = '') {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="20" fill="${palette.card}" filter="url(#sh)" ${extra}/>`;
}

const specs = [
  {
    out: 'public/services/planning/planning-1.webp',
    svg: () => {
      const cal = panel(140, 120, 520, 560);
      const side = panel(720, 160, 420, 480);
      return `${cal}
        <text x="180" y="180" font-family="Segoe UI, Arial, sans-serif" font-size="28" font-weight="700" fill="#111">${'Planeamiento'}</text>
        <g fill="${palette.line}">
          ${[0, 1, 2, 3, 4, 5, 6].map((i) => `<rect x="${180 + (i % 7) * 62}" y="220" width="48" height="48" rx="10"/>`).join('')}
          ${[0, 1, 2, 3, 4, 5, 6].map((i) => `<rect x="${180 + (i % 7) * 62}" y="290" width="48" height="48" rx="10"/>`).join('')}
          ${[0, 1, 2, 3, 4, 5, 6].map((i) => `<rect x="${180 + (i % 7) * 62}" y="360" width="48" height="48" rx="10"/>`).join('')}
        </g>
        <rect x="210" y="450" width="180" height="56" rx="14" fill="${palette.accent}" opacity="0.9"/>
        <text x="230" y="488" font-family="Segoe UI, Arial, sans-serif" font-size="20" font-weight="600" fill="#fff">Meta Q2 · Citas</text>
        ${side}
        <text x="760" y="220" font-family="Segoe UI, Arial, sans-serif" font-size="22" font-weight="700" fill="#111">Recordatorios</text>
        ${[0, 1, 2, 3].map((i) => `<rect x="760" y="${260 + i * 72}" width="340" height="52" rx="12" fill="${palette.bg1}" stroke="${palette.line}"/><circle cx="790" cy="${286 + i * 72}" r="10" fill="${palette.accent}"/>`).join('')}`;
    },
  },
  {
    out: 'public/services/notifications/notifications-1.webp',
    svg: () => {
      const phone = panel(420, 100, 440, 620);
      return `${phone}
        <circle cx="640" cy="200" r="36" fill="${palette.accent}"/>
        <text x="620" y="210" font-family="Segoe UI, Arial, sans-serif" font-size="32" fill="#fff">!</text>
        ${[0, 1, 2, 3].map(
          (i) =>
            `<rect x="460" y="${280 + i * 110}" width="360" height="82" rx="16" fill="${palette.bg1}" stroke="${palette.line}"/>
             <rect x="480" y="${300 + i * 110}" width="200" height="14" rx="7" fill="${palette.line}"/>
             <rect x="480" y="${326 + i * 110}" width="140" height="10" rx="5" fill="${palette.line}" opacity="0.7"/>`
        ).join('')}
        <text x="200" y="200" font-family="Segoe UI, Arial, sans-serif" font-size="36" font-weight="800" fill="#111">Alertas</text>
        <text x="200" y="250" font-family="Segoe UI, Arial, sans-serif" font-size="22" fill="${palette.muted}">Push · Email · In-app</text>`;
    },
  },
  {
    out: 'public/services/reports/reports-1.webp',
    svg: () => {
      const dash = panel(120, 100, 1040, 600);
      const bars = [120, 180, 90, 210, 160, 240, 190];
      return `${dash}
        <text x="160" y="170" font-family="Segoe UI, Arial, sans-serif" font-size="30" font-weight="700" fill="#111">Dashboard KPI</text>
        ${bars.map((h, i) => `<rect x="${200 + i * 95}" y="${620 - h}" width="52" height="${h}" rx="8" fill="${palette.accent}" opacity="${0.45 + i * 0.07}"/>`).join('')}
        <path d="M200 520 L320 460 L440 490 L560 400 L680 420 L800 350 L920 380" stroke="${palette.accent2}" stroke-width="5" fill="none" stroke-linecap="round"/>
        <rect x="780" y="180" width="320" height="200" rx="16" fill="${palette.bg1}" stroke="${palette.line}"/>
        <text x="810" y="230" font-family="Segoe UI, Arial, sans-serif" font-size="18" fill="${palette.muted}">Ingresos vs gastos</text>
        <circle cx="940" cy="300" r="70" fill="none" stroke="${palette.accent}" stroke-width="18" stroke-dasharray="280 120"/>`;
    },
  },
  {
    out: 'public/services/architecture/architecture-1.webp',
    svg: () => {
      return `${panel(200, 140, 880, 520)}
        <text x="260" y="210" font-family="Segoe UI, Arial, sans-serif" font-size="32" font-weight="700" fill="#111">Arquitectura escalable</text>
        ${[
          [280, 280, 220, 100],
          [540, 280, 220, 100],
          [800, 280, 220, 100],
          [410, 420, 460, 100],
        ]
          .map(
            ([x, y, w, h]) =>
              `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${palette.bg1}" stroke="${palette.accent}" stroke-width="2"/>
               <rect x="${x + 20}" y="${y + 24}" width="${w - 40}" height="12" rx="6" fill="${palette.line}"/>`
          )
          .join('')}
        <path d="M390 380 L500 380 L640 420 L870 420" stroke="${palette.accent}" stroke-width="3" marker-end="url(#a)"/>
        <text x="280" y="560" font-family="Segoe UI, Arial, sans-serif" font-size="18" fill="${palette.muted}">API · Módulos · Seguridad · Monitoreo</text>`;
    },
  },
  {
    out: 'public/services/fx/fx-1.webp',
    svg: () => {
      return `${panel(280, 120, 720, 560)}
        <text x="340" y="200" font-family="Segoe UI, Arial, sans-serif" font-size="34" font-weight="700" fill="#111">Tipo de cambio</text>
        <text x="340" y="250" font-family="Segoe UI, Arial, sans-serif" font-size="48" font-weight="800" fill="${palette.accent}">₡ 512.40</text>
        <text x="340" y="290" font-family="Segoe UI, Arial, sans-serif" font-size="22" fill="${palette.muted}">USD → CRC · Actualizado</text>
        <rect x="340" y="340" width="600" height="120" rx="16" fill="${palette.bg1}" stroke="${palette.line}"/>
        ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(
          (i) =>
            `<rect x="${360 + i * 44}" y="${460 - (i % 5) * 18}" width="28" height="${40 + (i % 5) * 18}" rx="6" fill="${palette.accent}" opacity="0.35"/>`
        ).join('')}`;
    },
  },
  {
    out: 'public/services/android/android-1.webp',
    svg: () => {
      const phone = `<rect x="460" y="80" width="360" height="640" rx="48" fill="${palette.card}" filter="url(#sh)"/>`;
      return `${phone}
        <rect x="520" y="140" width="240" height="48" rx="12" fill="${palette.accent}"/>
        <rect x="520" y="220" width="240" height="120" rx="16" fill="${palette.bg1}" stroke="${palette.line}"/>
        <rect x="520" y="360" width="110" height="110" rx="16" fill="${palette.bg1}" stroke="${palette.line}"/>
        <rect x="650" y="360" width="110" height="110" rx="16" fill="${palette.bg1}" stroke="${palette.line}"/>
        <text x="180" y="220" font-family="Segoe UI, Arial, sans-serif" font-size="40" font-weight="800" fill="#111">Android</text>
        <text x="180" y="280" font-family="Segoe UI, Arial, sans-serif" font-size="22" fill="${palette.muted}">Nativo · Rápido · Confiable</text>`;
    },
  },
  {
    out: 'public/services/pwa/pwa-1.webp',
    svg: () => {
      const browser = panel(220, 100, 840, 580);
      return `${browser}
        <rect x="220" y="100" width="840" height="56" rx="20" fill="${palette.accent}" opacity="0.15"/>
        <circle cx="260" cy="128" r="8" fill="#ef4444"/><circle cx="290" cy="128" r="8" fill="#f59e0b"/><circle cx="320" cy="128" r="8" fill="#22c55e"/>
        <rect x="360" y="200" width="560" height="360" rx="20" fill="${palette.bg1}" stroke="${palette.line}"/>
        <rect x="400" y="480" width="200" height="48" rx="12" fill="${palette.accent}"/>
        <text x="430" y="512" font-family="Segoe UI, Arial, sans-serif" font-size="18" font-weight="600" fill="#fff">Instalar app</text>
        <text x="180" y="720" font-family="Segoe UI, Arial, sans-serif" font-size="28" font-weight="700" fill="#111">PWA · iOS y Android</text>`;
    },
  },
  {
    out: 'public/services/web-architecture/web-architecture-1.webp',
    svg: () => {
      return `${panel(140, 120, 1000, 560)}
        <text x="200" y="190" font-family="Segoe UI, Arial, sans-serif" font-size="34" font-weight="700" fill="#111">Sitio web · Arquitectura</text>
        <rect x="200" y="240" width="880" height="48" rx="12" fill="${palette.accent}" opacity="0.12"/>
        <rect x="200" y="310" width="640" height="280" rx="16" fill="${palette.bg1}" stroke="${palette.line}"/>
        <rect x="880" y="310" width="200" height="130" rx="14" fill="${palette.bg1}" stroke="${palette.line}"/>
        <rect x="880" y="460" width="200" height="130" rx="14" fill="${palette.bg1}" stroke="${palette.line}"/>
        <text x="220" y="600" font-family="Segoe UI, Arial, sans-serif" font-size="18" fill="${palette.muted}">Pymes · Alto volumen · Integraciones</text>`;
    },
  },
];

for (const { out, svg } of specs) {
  const outPath = path.join(root, out);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  const buf = svgWrap(svg());
  await sharp(buf).webp({ quality: 82, effort: 5 }).toFile(outPath);
  const { size } = fs.statSync(outPath);
  // eslint-disable-next-line no-console
  console.log(`[ok] ${out} (${(size / 1024).toFixed(1)} KB)`);
}
