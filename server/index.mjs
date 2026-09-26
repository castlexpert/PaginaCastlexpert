import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import express from 'express';
import cors from 'cors';
import { getPool, ensureSchema, ensureConversation, addMessage, searchKb } from './db.mjs';
import { isOpenAiConfigured } from './llm.mjs';
import { notifyAdvisor } from './whatsapp.mjs';
import { notifyContactFormSubmission } from './mail.mjs';
import { answerChatMessage } from './chatAnswer.mjs';
import {
  ensureSiteIndexSchema,
  countSitePages,
} from './siteIndex.mjs';
import {
  syncSitioSeedFiles,
  listSiteImages,
  getSitioFilesDir,
  SITIO_MEDIA_MOUNT,
} from './siteImages.mjs';
import {
  ensureWhatsAppConfigSchema,
  getWhatsAppConfig,
  publicWhatsAppConfig,
  updateWhatsAppConfig,
  resumeChat,
} from './whatsappConfig.mjs';
import {
  startBaileys,
  logoutBaileys,
  getBaileysStatus,
  getQrDataUrl,
} from './baileysWhatsApp.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.disable('x-powered-by');

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use((err, _req, res, next) => {
  if (err?.type === 'entity.parse.failed') {
    res.status(400).json({ error: 'Invalid JSON body.' });
    return;
  }
  if (err?.type === 'entity.too.large') {
    res.status(413).json({ error: 'Request body too large.' });
    return;
  }
  next(err);
});

const port = Number(process.env.PORT || 3000);

// eslint-disable-next-line no-console
console.log(`[server] OPENAI configured: ${isOpenAiConfigured() ? 'yes' : 'no'}`);

let pool = null;
async function getDb() {
  if (pool) return pool;
  pool = getPool();
  await ensureSchema(pool);
  await ensureSiteIndexSchema(pool);
  await ensureWhatsAppConfigSchema(pool);
  return pool;
}

function requireAdminKey(req, res, next) {
  const key = process.env.CASTLEXPERT_ADMIN_KEY?.trim();
  if (!key) {
    res.status(501).json({ error: 'CASTLEXPERT_ADMIN_KEY not configured on site API.' });
    return;
  }
  const provided = String(req.header('x-admin-key') || '').trim();
  if (!provided || provided !== key) {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }
  next();
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

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    res.status(400).json({ error: 'Missing name, email, or message.' });
    return;
  }

  try {
    const db = await getDb();
    await db.query(
      `insert into contact_messages (name, email, message) values ($1, $2, $3)`,
      [String(name).trim().slice(0, 500), String(email).trim().slice(0, 500), String(message).trim().slice(0, 8000)]
    );

    let emailSent = false;
    let mailError = null;
    try {
      const mailResult = await notifyContactFormSubmission({
        name: String(name).trim(),
        email: String(email).trim(),
        message: String(message).trim(),
      });
      emailSent = mailResult.sent === true;
    } catch (err) {
      mailError = err?.message || 'mail_error';
      // eslint-disable-next-line no-console
      console.error('[contact] notify email failed:', mailError);
    }

    res.json({ success: true, emailSent, ...(mailError ? { mailError } : {}) });
  } catch (e) {
    res.status(500).json({ error: e?.message || 'error' });
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
    const answer = await answerChatMessage(db, {
      conversationId: String(conversationId),
      language: String(language),
      message: String(message),
    });
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
            String(transcript || '').slice(0, 8000),
          ].join('\n')
        : [
            `New lead from the chatbot (CastleXpert).`,
            phone ? `Customer WhatsApp: ${phone}` : `Customer WhatsApp: (not provided)`,
            '',
            'Transcript:',
            String(transcript || '').slice(0, 8000),
          ].join('\n');

    await notifyAdvisor({ body, db });

    await addMessage(db, String(conversationId), 'assistant', '[handoff] advisor_notified');
    res.json({ ok: true });
  } catch (e) {
    const msg = e?.message || 'error';
    const code = e?.code;
    if (code === 'NO_TWILIO' || code === 'NO_WHATSAPP_NUMBERS' || code === 'WA_NOT_CONNECTED') {
      res.status(501).json({ ok: false, error: msg });
      return;
    }
    if (code === 'TWILIO_REST_ERROR') {
      res.status(503).json({
        ok: false,
        error: msg,
        twilioCode: e?.twilioCode,
        twilioStatus: e?.twilioStatus,
      });
      return;
    }
    res.status(500).json({ ok: false, error: msg });
  }
});

// --- WhatsApp bot admin (proxied from WAdministrativo) ---
app.get('/api/whatsapp/status', requireAdminKey, async (_req, res) => {
  try {
    const db = await getDb();
    const cfg = publicWhatsAppConfig(await getWhatsAppConfig(db));
    res.json({ ok: true, connection: getBaileysStatus(), config: cfg });
  } catch (e) {
    res.status(500).json({ ok: false, error: e?.message || 'error' });
  }
});

app.get('/api/whatsapp/qr', requireAdminKey, async (_req, res) => {
  try {
    const dataUrl = await getQrDataUrl();
    const st = getBaileysStatus();
    res.json({ ok: true, qrDataUrl: dataUrl, connection: st });
  } catch (e) {
    res.status(500).json({ ok: false, error: e?.message || 'error' });
  }
});

app.post('/api/whatsapp/start', requireAdminKey, async (_req, res) => {
  try {
    const connection = await startBaileys({ getDbFn: getDb });
    res.json({ ok: true, connection });
  } catch (e) {
    res.status(500).json({ ok: false, error: e?.message || 'error' });
  }
});

app.post('/api/whatsapp/logout', requireAdminKey, async (_req, res) => {
  try {
    await logoutBaileys();
    res.json({ ok: true, connection: getBaileysStatus() });
  } catch (e) {
    res.status(500).json({ ok: false, error: e?.message || 'error' });
  }
});

app.get('/api/whatsapp/config', requireAdminKey, async (_req, res) => {
  try {
    const db = await getDb();
    res.json({ ok: true, config: publicWhatsAppConfig(await getWhatsAppConfig(db)) });
  } catch (e) {
    res.status(500).json({ ok: false, error: e?.message || 'error' });
  }
});

app.put('/api/whatsapp/config', requireAdminKey, async (req, res) => {
  try {
    const db = await getDb();
    const updated = await updateWhatsAppConfig(db, req.body || {});
    res.json({ ok: true, config: publicWhatsAppConfig(updated) });
  } catch (e) {
    res.status(500).json({ ok: false, error: e?.message || 'error' });
  }
});

app.post('/api/whatsapp/resume', requireAdminKey, async (req, res) => {
  try {
    const remoteJid = String(req.body?.remoteJid || '').trim();
    if (!remoteJid) {
      res.status(400).json({ error: 'Missing remoteJid' });
      return;
    }
    const db = await getDb();
    await resumeChat(db, remoteJid);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e?.message || 'error' });
  }
});

app.get('/api/site-images', async (_req, res) => {
  try {
    const db = await getDb();
    const rows = await listSiteImages(db);
    const images = rows.map((r) => ({
      usageKey: r.usage_key,
      url: `${SITIO_MEDIA_MOUNT}/${encodeURIComponent(r.file_name)}`,
      altEs: r.alt_text_es,
      altEn: r.alt_text_en,
    }));
    res.json({ images });
  } catch (e) {
    res.status(500).json({ error: e?.message || 'error' });
  }
});

app.use(
  SITIO_MEDIA_MOUNT,
  express.static(getSitioFilesDir(), {
    maxAge: process.env.NODE_ENV === 'production' ? '7d' : 0,
    index: false,
  }),
);

const distDir = path.resolve(__dirname, '..', 'dist');
const indexHtml = path.join(distDir, 'index.html');
const contactVcfPath = path.join(distDir, 'contacto.vcf');

function sendContactVcf(_req, res) {
  if (!fs.existsSync(contactVcfPath)) {
    res.status(404).type('text/plain').send('contacto.vcf not found');
    return;
  }
  res.type('text/vcard; charset=utf-8');
  res.set('Content-Disposition', 'inline; filename="Deiby-Castillo-CastleXpert.vcf"');
  res.sendFile(contactVcfPath);
}

// Debe registrarse ANTES del catch-all de la SPA (app.get('*', ...))
app.get('/contacto.vcf', sendContactVcf);
app.get('/castlexpertCard.vcf', sendContactVcf);

if (fs.existsSync(indexHtml)) {
  app.use(
    express.static(distDir, {
      maxAge: process.env.NODE_ENV === 'production' ? '7d' : 0,
      setHeaders(res, filePath) {
        if (/\.(mp4|webm)$/i.test(filePath)) {
          res.setHeader('Cache-Control', 'public, max-age=2592000, immutable');
          res.setHeader('Accept-Ranges', 'bytes');
        }
      },
    }),
  );
  app.get('*', (req, res) => {
    // Evitar devolver index.html para rutas que parecen archivos estáticos (404 real si falta el asset).
    if (/\.(webp|png|jpg|jpeg|gif|svg|ico|woff2?|css|js|map|txt|xml|vcf|mp4|webm)$/i.test(req.path)) {
      res.status(404).type('text/plain').send('Not found');
      return;
    }
    res.sendFile(indexHtml);
  });
}

async function start() {
  try {
    await getDb();
    // eslint-disable-next-line no-console
    console.log('[db] migrations OK (kb, chat, contact, site_image_catalog, site index, …)');
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('[db] startup failed — migrations not applied:', e?.message || e);
    process.exit(1);
  }

  syncSitioSeedFiles();

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`[server] listening on :${port}`);
  });

  // WhatsApp Baileys (non-blocking; QR available in WAdministrativo)
  startBaileys({ getDbFn: getDb }).catch((e) => {
    // eslint-disable-next-line no-console
    console.error('[wa] auto-start failed:', e?.message || e);
  });
}

start();
