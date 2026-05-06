/**
 * Placeholders visibles para modales familiares/empresa (hasta comprimir tus PNG con
 * npm run demo:familiares-webp / demo:empresa-webp).
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const dir = path.resolve('public/images/demos');

const famSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
<stop offset="0%" stop-color="#fff1f2"/><stop offset="40%" stop-color="#e0f2fe"/><stop offset="100%" stop-color="#99f6e4"/></linearGradient></defs>
<rect width="100%" height="100%" fill="url(#g)"/>
<rect x="80" y="80" width="1120" height="560" rx="40" fill="rgba(255,255,255,0.65)" stroke="rgba(13,148,136,0.35)" stroke-width="4"/>
</svg>`;

const empSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="900">
<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
<stop offset="0%" stop-color="#f1f5f9"/><stop offset="30%" stop-color="#ccfbf1"/><stop offset="100%" stop-color="#115e59"/></linearGradient></defs>
<rect width="100%" height="100%" fill="url(#g)"/>
<rect x="88" y="100" width="1104" height="700" rx="32" fill="rgba(255,255,255,0.88)" stroke="#14b8a6" stroke-width="4"/>
</svg>`;

fs.mkdirSync(dir, { recursive: true });

await sharp(Buffer.from(famSvg)).webp({ quality: 82 }).toFile(path.join(dir, 'soluciones-familiares-modal.webp'));
await sharp(Buffer.from(empSvg)).webp({ quality: 82 }).toFile(path.join(dir, 'soluciones-empresa-modal.webp'));

for (const n of ['soluciones-familiares-modal.webp', 'soluciones-empresa-modal.webp']) {
  const kb = (fs.statSync(path.join(dir, n)).size / 1024).toFixed(1);
  // eslint-disable-next-line no-console
  console.log(`[placeholders] ${n} (${kb} KB)`);
}
