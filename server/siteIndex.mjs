import OpenAI from 'openai';

const EMBEDDING_MODEL = 'text-embedding-3-small';
const EMBEDDING_DIM = 1536;

let siteIndexReady = null;

/**
 * Crea extensión vector + tabla site_page_index si no existen (idempotente).
 * @returns {Promise<boolean>} si el índice vectorial está disponible
 */
export async function ensureSiteIndexSchema(pool) {
  if (siteIndexReady !== null) return siteIndexReady;
  try {
    await pool.query('create extension if not exists vector');
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[site-index] create extension vector failed:', e?.message || e);
    siteIndexReady = false;
    return false;
  }

  try {
    await pool.query(`
      create table if not exists site_page_index (
        url text primary key,
        titulo text not null,
        descripcion text not null default '',
        secciones jsonb not null default '[]'::jsonb,
        embedding vector(${EMBEDDING_DIM}),
        updated_at timestamptz not null default now()
      )
    `);
    await pool
      .query(
        `
        create index if not exists site_page_index_embedding_idx
          on site_page_index using ivfflat (embedding vector_cosine_ops)
          with (lists = 100)
      `
      )
      .catch(() => {});
    siteIndexReady = true;
    return true;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[site-index] table/index failed:', e?.message || e);
    siteIndexReady = false;
    return false;
  }
}

export function resetSiteIndexCacheForTests() {
  siteIndexReady = null;
}

function formatVector(arr) {
  return `[${arr.join(',')}]`;
}

export async function embedQueryText(text) {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) return null;
  const client = new OpenAI({ apiKey: key });
  const res = await client.embeddings.create({
    model: process.env.OPENAI_EMBEDDING_MODEL?.trim() || EMBEDDING_MODEL,
    input: String(text).slice(0, 8000),
  });
  const vec = res.data?.[0]?.embedding;
  return Array.isArray(vec) ? vec : null;
}

/**
 * Vecinos por distancia coseno (pgvector <=>).
 */
export async function searchSitePagesByEmbedding(pool, embedding, limit = 5) {
  if (!embedding?.length) return [];
  const vec = formatVector(embedding);
  const { rows } = await pool.query(
    `
      select url, titulo, descripcion, secciones
      from site_page_index
      where embedding is not null
      order by embedding <=> $1::vector
      limit $2
    `,
    [vec, limit]
  );
  return rows;
}

export async function countSitePages(pool) {
  const { rows } = await pool.query(
    `select count(*)::int as n from site_page_index where embedding is not null`
  );
  return rows?.[0]?.n ?? 0;
}

/**
 * Texto plano para el LLM a partir de filas indexadas.
 */
export function formatSitePagesForContext(rows, language) {
  if (!rows?.length) return '';
  return rows
    .map((r) => {
      let secciones = r.secciones;
      if (typeof secciones === 'string') {
        try {
          secciones = JSON.parse(secciones);
        } catch {
          secciones = [];
        }
      }
      const secLines = Array.isArray(secciones)
        ? secciones.map((s) => `  - ${s.titulo}: ${s.descripcion}`).join('\n')
        : '';
      const header =
        language === 'es'
          ? `Página: ${r.url}\nTítulo: ${r.titulo}\nResumen: ${r.descripcion}`
          : `Page: ${r.url}\nTitle: ${r.titulo}\nSummary: ${r.descripcion}`;
      return secLines ? `${header}\nSecciones:\n${secLines}` : header;
    })
    .join('\n\n---\n\n');
}

/**
 * Respuesta corta si no hay LLM (fallback).
 */
export function formatSiteFallbackAnswer(rows, language) {
  if (!rows?.length) return null;
  const top = rows[0];
  let secciones = top.secciones;
  if (typeof secciones === 'string') {
    try {
      secciones = JSON.parse(secciones);
    } catch {
      secciones = [];
    }
  }
  const secPreview = Array.isArray(secciones)
    ? secciones
        .slice(0, 3)
        .map((s) => `- ${s.titulo}: ${s.descripcion}`)
        .join('\n')
    : '';

  if (language === 'es') {
    return [
      `Según el contenido indexado de nuestro sitio (${top.url}):`,
      top.descripcion,
      secPreview ? `\nDetalles:\n${secPreview}` : '',
      '\nSi quieres profundizar en un tema concreto, dímelo.',
    ]
      .filter(Boolean)
      .join('\n');
  }

  return [
    `Based on indexed content from our site (${top.url}):`,
    top.descripcion,
    secPreview ? `\nDetails:\n${secPreview}` : '',
    '\nAsk if you want more detail on a specific topic.',
  ]
    .filter(Boolean)
    .join('\n');
}
