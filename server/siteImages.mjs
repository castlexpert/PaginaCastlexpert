import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** URL pública bajo la que se sirven los archivos del volumen (sin barra final). */
export const SITIO_MEDIA_MOUNT = '/media-sitio';

export function getSitioFilesDir() {
  const explicit = process.env.SITIO_FILES_DIR?.trim();
  if (explicit) return explicit;
  const railwayMount = process.env.RAILWAY_VOLUME_MOUNT_PATH?.trim();
  if (railwayMount) return railwayMount;
  return path.resolve(__dirname, '..', 'local-archivos-sitio');
}

export function ensureSitioDirectory() {
  const dir = getSitioFilesDir();
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

/**
 * Copia archivos seed desde el repo al volumen si aún no existen (primer deploy / volumen vacío).
 */
export function syncSitioSeedFiles() {
  const destRoot = ensureSitioDirectory();
  const seedDir = path.join(__dirname, 'seed-assets', 'sitio');
  // eslint-disable-next-line no-console
  console.log(`[sitio] volume dir: ${destRoot}`);
  if (!fs.existsSync(seedDir)) {
    // eslint-disable-next-line no-console
    console.warn(
      `[sitio] seed folder missing in image — commit server/seed-assets/sitio/ in git: ${seedDir}`,
    );
    return;
  }

  const seeds = fs.readdirSync(seedDir).filter((n) => fs.statSync(path.join(seedDir, n)).isFile());
  if (seeds.length === 0) {
    // eslint-disable-next-line no-console
    console.warn(`[sitio] seed folder empty: ${seedDir}`);
    return;
  }

  for (const name of seeds) {
    const from = path.join(seedDir, name);
    const to = path.join(destRoot, name);
    if (!fs.existsSync(to)) {
      fs.copyFileSync(from, to);
      // eslint-disable-next-line no-console
      console.log(`[sitio] copied seed ${name} -> ${to}`);
    } else {
      // eslint-disable-next-line no-console
      console.log(`[sitio] skip ${name} (already on volume)`);
    }
  }

  try {
    const onDisk = fs.readdirSync(destRoot).filter((n) => fs.statSync(path.join(destRoot, n)).isFile());
    // eslint-disable-next-line no-console
    console.log(`[sitio] volume files: ${onDisk.length} → ${onDisk.join(', ') || '(none)'}`);
  } catch {
    /* ignore */
  }
}

export async function listSiteImages(pool) {
  const { rows } = await pool.query(
    `
    select usage_key, file_name, alt_text_es, alt_text_en
    from site_image_catalog
    where is_active = true
    order by sort_order asc, usage_key asc
  `
  );
  return rows;
}
