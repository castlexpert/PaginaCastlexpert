/**
 * Comprime una imagen (p. ej. la captura de “Soluciones personales”) a WebP en server/seed-assets/sitio/
 * y se copiará al volumen en el primer arranque del servidor.
 *
 * Uso: node scripts/build-sitio-seed.mjs "ruta/a/tu-imagen.png"
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const outName = 'wellness_personal_solutions.webp';
const input = process.argv[2];

const outDir = path.resolve('server/seed-assets/sitio');
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, outName);

if (!input) {
  console.error(`Uso: node scripts/build-sitio-seed.mjs <archivo-imagen>`);
  console.error(`Generó solo marcador si no hay entrada — ejecute con su PNG/JPEG adjunto.`);
  await sharp({
    create: {
      width: 1200,
      height: 675,
      channels: 3,
      background: { r: 235, g: 230, b: 220 },
    },
  })
    .webp({ quality: 82, effort: 4 })
    .toFile(outPath);
  console.log(`[build-sitio-seed] placeholder -> ${outPath} (reemplácelo con: node scripts/build-sitio-seed.mjs tu-foto.png)`);
  process.exit(0);
}

if (!fs.existsSync(input)) {
  console.error(`No existe: ${input}`);
  process.exit(1);
}

await sharp(input)
  .rotate()
  .resize(1600, 1200, { fit: 'inside', withoutEnlargement: true })
  .webp({ quality: 82, effort: 4 })
  .toFile(outPath);

console.log(`[build-sitio-seed] ${input} -> ${outPath}`);
