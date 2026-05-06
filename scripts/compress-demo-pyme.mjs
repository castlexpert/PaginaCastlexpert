/**
 * WebP liviano para el modal "Soluciones PYME" → public/images/demos/soluciones-pyme-modal.webp
 *
 * Uso: node scripts/compress-demo-pyme.mjs <ruta-al-png-o-jpg>
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const outRel = 'public/images/demos/soluciones-pyme-modal.webp';
const input = process.argv[2];

if (!input || !fs.existsSync(input)) {
  console.error('Uso: node scripts/compress-demo-pyme.mjs <imagen>');
  process.exit(1);
}

const outPath = path.resolve(outRel);
fs.mkdirSync(path.dirname(outPath), { recursive: true });

await sharp(input)
  .rotate()
  .resize({ width: 1280, withoutEnlargement: true })
  .webp({ quality: 76, effort: 5 })
  .toFile(outPath);

const { size } = fs.statSync(outPath);
console.log(`[compress-demo-pyme] ${(size / 1024).toFixed(1)} KB -> ${outRel}`);
