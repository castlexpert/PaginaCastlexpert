import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import express from 'express';
import cors from 'cors';
import { getPool, ensureSchema, ensureConversation, addMessage, getRecentMessages, searchKb } from './db.mjs';
import { answerWithLlm, isOpenAiConfigured } from './llm.mjs';
import { notifyAdvisor } from './whatsapp.mjs';
import {
  ensureSiteIndexSchema,
  embedQueryText,
  searchSitePagesByEmbedding,
  formatSitePagesForContext,
  formatSiteFallbackAnswer,
  countSitePages,
} from './siteIndex.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.disable('x-powered-by');

app.use(cors());
app.use(express.json({ limit: '1mb' }));

const port = Number(process.env.PORT || 3000);

// eslint-disable-next-line no-console
console.log(`[server] OPENAI configured: ${isOpenAiConfigured() ? 'yes' : 'no'}`);

let pool = null;
async function getDb() {
  if (pool) return pool;
  pool = getPool();
  await ensureSchema(pool);
  await ensureSiteIndexSchema(pool);
  return pool;
}

app.get('/api/health', async (_req, res) => {
  try {
    const db = await getDb();
    const { rows } = await db.query(`select count(*)::int as count from kb_documents`);
    const sample = await searchKb(db, 'es', 'servicios', 5);
    let siteIndexedCount = 0;
    try {
      siteIndexedCount = await countSitePages(db);
    } catch {
      siteIndexedCount = 0;
    }
    res.json({
      ok: true,
      kbCount: rows?.[0]?.count ?? 0,
      sampleHits: sample.length,
      siteIndexedCount,
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: e?.message || 'error' });
  }
});

app.post('/api/chat', async (req, res) => {
  const { conversationId, language, message } = req.body || {};
  if (!conversationId || !language || !message) {
    res.status(400).json({ error: 'Missing conversationId, language, or message.' });
    return;
  }

  try {
    const db = await getDb();
    await ensureConversation(db, String(conversationId), String(language));
    await addMessage(db, String(conversationId), 'user', String(message));

    const history = await getRecentMessages(db, String(conversationId), 8);
    const lang = String(language);
    const msg = String(message);

    let siteRows = [];
    try {
      const emb = await embedQueryText(msg);
      if (emb) {
        siteRows = await searchSitePagesByEmbedding(db, emb, 5);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('[chat] site index search failed:', err?.message || err);
    }

    let kbHits = [];
    let context;
    if (siteRows.length > 0) {
      context = formatSitePagesForContext(siteRows, lang);
    } else {
      kbHits = await searchKb(db, lang, msg, 6);
      context = kbHits.length
        ? kbHits.map((d) => `- ${d.title}: ${d.content}`).join('\n')
        : lang === 'es'
          ? 'No hay contexto adicional disponible.'
          : 'No additional context available.';
    }

    let llmAnswer = null;
    try {
      llmAnswer = await answerWithLlm({
        language: lang,
        question: msg,
        context,
        history,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('[chat] LLM failed, falling back to KB:', err?.message || err);
    }

    const siteFallback = siteRows.length > 0 ? formatSiteFallbackAnswer(siteRows, lang) : null;

    const kbFallback =
      !siteFallback && kbHits.length > 0
        ? lang === 'es'
          ? `Según nuestro sitio:\n${kbHits
              .slice(0, 3)
              .map((d) => `- ${d.title}: ${d.content}`)
              .join('\n')}\n\nSi quieres, dime qué tipo de solución buscas y te recomiendo la mejor opción.`
          : `Based on our website:\n${kbHits
              .slice(0, 3)
              .map((d) => `- ${d.title}: ${d.content}`)
              .join('\n')}\n\nTell me what kind of solution you need and I’ll recommend the best option.`
        : null;

    const answer =
      llmAnswer ||
      siteFallback ||
      kbFallback ||
      (lang === 'es'
        ? `Puedo ayudarte con temas de CastleXpert (servicios, proceso, demos y contacto). Cuéntame qué necesitas y te guío.`
        : `I can help with CastleXpert topics (services, process, demos, and contact). Tell me what you need and I’ll guide you.`);

    await addMessage(db, String(conversationId), 'assistant', answer);
    res.json({ answer });
  } catch (e) {
    res.status(500).json({ error: e?.message || 'error' });
  }
});

app.post('/api/handoff', async (req, res) => {
  const { conversationId, language, phone, transcript } = req.body || {};
  if (!conversationId || !language) {
    res.status(400).json({ error: 'Missing conversationId or language.' });
    return;
  }

  try {
    const db = await getDb();
    await ensureConversation(db, String(conversationId), String(language));
    if (transcript) await addMessage(db, String(conversationId), 'user', `[handoff]\n${String(transcript).slice(0, 8000)}`);

    const body =
      String(language) === 'es'
        ? [
            `Nuevo contacto desde el chatbot (CastleXpert).`,
            phone ? `WhatsApp del cliente: ${phone}` : `WhatsApp del cliente: (no indicado)`,
            '',
            'Transcripción:',
            String(transcript || '').slice(0, 3500),
          ].join('\n')
        : [
            `New lead from the chatbot (CastleXpert).`,
            phone ? `Customer WhatsApp: ${phone}` : `Customer WhatsApp: (not provided)`,
            '',
            'Transcript:',
            String(transcript || '').slice(0, 3500),
          ].join('\n');

    await notifyAdvisor({ body });

    await addMessage(db, String(conversationId), 'assistant', '[handoff] advisor_notified');
    res.json({ ok: true });
  } catch (e) {
    const msg = e?.message || 'error';
    const code = e?.code;
    if (code === 'NO_TWILIO' || code === 'NO_WHATSAPP_NUMBERS') {
      res.status(501).json({ ok: false, error: msg });
      return;
    }
    res.status(500).json({ ok: false, error: msg });
  }
});

const distDir = path.resolve(__dirname, '..', 'dist');
const indexHtml = path.join(distDir, 'index.html');
if (fs.existsSync(indexHtml)) {
  app.use(express.static(distDir));
  app.get('*', (_req, res) => {
    res.sendFile(indexHtml);
  });
}

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`[server] listening on :${port}`);
});
