#!/usr/bin/env node
/**
 * Index site pages: crawl → clean HTML → OpenAI extract → embed → pgvector.
 * Usage: node scripts/rag/index-pages.mjs [BASE_URL]
 * Env: DATABASE_URL, OPENAI_API_KEY, optional MAX_PAGES (default 50)
 */
import 'dotenv/config';
import { discoverUrls, fetchPageHtml } from './crawler.mjs';
import { cleanHtmlToText, truncateText } from './html-cleaner.mjs';
import { extractStructuredPage } from './openai-extract.mjs';
import { embedDocument, embeddingInput } from './embeddings.mjs';
import { getPool, ensureRagSchema, upsertPage } from './db-rag.mjs';

const BASE = process.argv[2] || process.env.SITE_BASE_URL || 'https://castlexpert.com';
const MAX_PAGES = Number(process.env.MAX_PAGES || 50);

function logErr(e, ctx) {
  console.error(`[skip] ${ctx}:`, e?.message || e);
}

async function main() {
  const pool = getPool();
  try {
    await ensureRagSchema(pool);
  } catch (e) {
    console.error('[fatal] No se pudo crear extensión vector / tabla:', e.message);
    console.error('Asegúrate de que Postgres tenga pgvector y permisos CREATE EXTENSION.');
    process.exit(1);
  }

  const { urls } = await discoverUrls(BASE, {
    maxPages: MAX_PAGES,
    onError: logErr,
  });

  console.log(`[index] ${urls.length} URLs (base=${BASE})`);

  let ok = 0;
  let fail = 0;

  for (const url of urls) {
    try {
      const html = await fetchPageHtml(url);
      const rawText = cleanHtmlToText(html);
      const cleanText = truncateText(rawText, 12000);

      if (cleanText.length < 80) {
        console.warn(`[warn] Poco texto en ${url} (${cleanText.length} chars) — puede ser SPA.`);
      }

      let structured;
      try {
        structured = await extractStructuredPage({ cleanText });
      } catch (e) {
        logErr(e, `OpenAI extract ${url}`);
        fail += 1;
        continue;
      }

      const embedText = embeddingInput(structured);
      let embedding;
      try {
        embedding = await embedDocument(embedText);
      } catch (e) {
        logErr(e, `embed ${url}`);
        fail += 1;
        continue;
      }

      await upsertPage(pool, {
        url,
        titulo: structured.titulo,
        descripcion: structured.descripcion,
        secciones: structured.secciones,
        embedding,
      });

      ok += 1;
      console.log(`[ok] ${url}`);
    } catch (e) {
      logErr(e, url);
      fail += 1;
    }
  }

  console.log(`[done] inserted/updated=${ok} failed=${fail}`);
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
