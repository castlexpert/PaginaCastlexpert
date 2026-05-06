/**
 * Miniaturas WebP para los 4 cards DEMOS (fondo), derivadas de las imágenes de los modales.
 * Salida: public/images/demos/soluciones-*-card.webp (~560px ancho, liviano para red).
 *
 * Uso: npm run demo:card-thumbs
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const dir = path.resolve('public/images/demos');
const pairs = [
  ['soluciones-personales-modal.webp', 'soluciones-personales-card.webp'],
  ['soluciones-familiares-modal.webp', 'soluciones-familiares-card.webp'],
  ['soluciones-empresa-modal.webp', 'soluciones-empresa-card.webp'],
  ['soluciones-pyme-modal.webp', 'soluciones-pyme-card.webp'],
];

fs.mkdirSync(dir, { recursive: true });

for (const [srcName, outName] of pairs) {
  const src = path.join(dir, srcName);
  const out = path.join(dir, outName);
  if (!fs.existsSync(src)) {
    // eslint-disable-next-line no-console
    console.warn(`[demo-card-thumbs] omitido (no existe modal): ${srcName}`);
    continue;
  }

  await sharp(src)
    .resize({ width: 560, withoutEnlargement: true })
    .webp({ quality: 68, effort: 5 })
    .toFile(out);

  const kb = (fs.statSync(out).size / 1024).toFixed(1);
  // eslint-disable-next-line no-console
  console.log(`[demo-card-thumbs] ${outName} (${kb} KB)`);
}
