import OpenAI from 'openai';

const MODEL = 'text-embedding-3-small';

export async function embedDocument(text) {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) throw new Error('OPENAI_API_KEY no configurada');

  const client = new OpenAI({ apiKey: key });
  const res = await client.embeddings.create({
    model: MODEL,
    input: text,
  });
  const vec = res.data?.[0]?.embedding;
  if (!Array.isArray(vec)) throw new Error('embedding inválido');
  return vec;
}

const BATCH = 64;

/**
 * Varios textos en una o varias llamadas (mismo orden de salida que entrada).
 * @param {string[]} texts
 * @returns {Promise<number[][]>}
 */
export async function embedDocumentsBatch(texts) {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) throw new Error('OPENAI_API_KEY no configurada');
  if (!texts.length) return [];

  const client = new OpenAI({ apiKey: key });
  const all = [];
  for (let i = 0; i < texts.length; i += BATCH) {
    const chunk = texts.slice(i, i + BATCH);
    const res = await client.embeddings.create({
      model: process.env.OPENAI_EMBEDDING_MODEL?.trim() || MODEL,
      input: chunk,
    });
    const sorted = [...res.data].sort((a, b) => a.index - b.index);
    for (const row of sorted) {
      if (!Array.isArray(row.embedding)) throw new Error('embedding inválido en batch');
      all.push(row.embedding);
    }
  }
  if (all.length !== texts.length) throw new Error('embeddings batch: conteo no coincide');
  return all;
}

/** Build one string for semantic search from structured fields */
export function embeddingInput({ titulo, descripcion, secciones }) {
  const sec = Array.isArray(secciones)
    ? secciones.map((s) => `${s.titulo}: ${s.descripcion}`).join('\n')
    : '';
  return [titulo, descripcion, sec].filter(Boolean).join('\n\n');
}
