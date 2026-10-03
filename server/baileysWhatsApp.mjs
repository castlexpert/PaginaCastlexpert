import fs from 'node:fs';
import path from 'node:path';
import qrcode from 'qrcode';
import pino from 'pino';
import makeWASocket, {
  DisconnectReason,
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
} from '@whiskeysockets/baileys';
import { getSitioFilesDir } from './siteImages.mjs';
import { answerChatMessage, wantsHumanHandoff } from './chatAnswer.mjs';
import {
  getWhatsAppConfig,
  isChatPaused,
  pauseChat,
  samePhone,
} from './whatsappConfig.mjs';
import { handleOwnerMessage } from './ownerAssistant.mjs';

const logger = pino({ level: process.env.WA_LOG_LEVEL || 'silent' });

let sock = null;
let starting = false;
let lastQr = null;
let lastQrDataUrl = null;
let connectionStatus = 'disconnected'; // disconnected | connecting | qr | open | logged_out
let statusDetail = '';
let connectedPhone = '';
let getDb = null;
/** @type {Map<string, number>} */
const recentInbound = new Map();

function authDir() {
  const root = getSitioFilesDir();
  const dir = path.join(root, 'whatsapp-auth');
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export function getBaileysStatus() {
  return {
    status: connectionStatus,
    detail: statusDetail,
    hasQr: Boolean(lastQr),
    connectedPhone: connectedPhone || null,
    authDir: authDir(),
  };
}

export function isBaileysConnected() {
  return Boolean(sock) && connectionStatus === 'open';
}

export async function getQrDataUrl() {
  if (!lastQr) return null;
  if (lastQrDataUrl) return lastQrDataUrl;
  lastQrDataUrl = await qrcode.toDataURL(lastQr, { margin: 2, width: 320 });
  return lastQrDataUrl;
}

export function phoneToJid(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return '';
  return `${digits}@s.whatsapp.net`;
}

export function jidToPhone(jid) {
  return String(jid || '').split('@')[0].replace(/\D/g, '');
}

function detectLanguage(text) {
  const t = String(text || '').toLowerCase();
  if (/\b(hello|hi|please|what|how|price|demo|services)\b/.test(t)) return 'en';
  return 'es';
}

async function persistHandoffLead(db, { phone, transcript, source }) {
  try {
    await db.query(
      `insert into contact_messages (name, email, message)
       values ($1, $2, $3)`,
      [
        `WhatsApp ${phone || 'lead'}`,
        'whatsapp-handoff@castlexpert.local',
        `[${source}]\nTel: ${phone || 'n/a'}\n\n${String(transcript || '').slice(0, 7800)}`,
      ]
    );
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[wa] persist handoff failed:', e?.message || e);
  }
}

export async function sendTextMessage(jidOrPhone, text) {
  if (!sock || connectionStatus !== 'open') {
    const err = new Error('WhatsApp Baileys is not connected.');
    err.code = 'WA_NOT_CONNECTED';
    throw err;
  }
  const jid = String(jidOrPhone).includes('@') ? jidOrPhone : phoneToJid(jidOrPhone);
  if (!jid) {
    const err = new Error('Invalid WhatsApp recipient.');
    err.code = 'WA_BAD_RECIPIENT';
    throw err;
  }

  const body = String(text ?? '').replace(/\u0000/g, '');
  const max = 4000;
  const parts = [];
  let rest = body;
  while (rest.length > 0) {
    if (rest.length <= max) {
      parts.push(rest);
      break;
    }
    const window = rest.slice(0, max + 1);
    const nl = window.lastIndexOf('\n');
    const cut = nl > Math.floor(max * 0.6) ? nl : max;
    parts.push(rest.slice(0, cut).trimEnd());
    rest = rest.slice(cut).trimStart();
  }

  let last = null;
  for (const part of parts.filter(Boolean)) {
    // eslint-disable-next-line no-await-in-loop
    last = await sock.sendMessage(jid, { text: part });
  }
  return last;
}

export async function notifyAdvisorViaBaileys(db, { body }) {
  const cfg = await getWhatsAppConfig(db);
  const to = cfg.advisor_phone || process.env.ADVISOR_WHATSAPP_TO || '';
  await persistHandoffLead(db, {
    phone: jidToPhone(phoneToJid(to)) || to,
    transcript: body,
    source: 'web-handoff',
  });
  return sendTextMessage(to, body);
}

async function handleInboundText(remoteJid, text, senderPhone) {
  if (!getDb) return;
  const db = await getDb();
  const cfg = await getWhatsAppConfig(db);

  // Owner mode runs before bot_enabled / pause / handoff so it keeps working when the client bot is off.
  if (cfg.owner_phone && samePhone(senderPhone, cfg.owner_phone)) {
    const reply = await handleOwnerMessage(db, {
      text,
      jid: remoteJid,
      phone: senderPhone,
      sendText: sendTextMessage,
      getConnection: getBaileysStatus,
    });
    await sendTextMessage(remoteJid, reply);
    return;
  }

  if (!cfg.bot_enabled) return;
  if (await isChatPaused(db, remoteJid)) return;

  const phone = jidToPhone(remoteJid);
  const lang = detectLanguage(text);
  const conversationId = `wa:${phone || remoteJid}`;

  if (wantsHumanHandoff(text)) {
    await pauseChat(db, remoteJid, 48, 'customer_request');
    await persistHandoffLead(db, {
      phone,
      transcript: text,
      source: 'whatsapp-bot-handoff',
    });
    const reply =
      lang === 'es'
        ? 'Perfecto. Un asesor de CastleXpert te atenderá por este mismo chat en breve. Mientras tanto puedes seguir escribiendo.'
        : 'Got it. A CastleXpert advisor will follow up in this chat shortly. You can keep writing in the meantime.';
    await sendTextMessage(remoteJid, reply);
    // Also ping advisor phone if different from customer
    try {
      const advisorJid = phoneToJid(cfg.advisor_phone);
      if (advisorJid && advisorJid !== remoteJid) {
        await sendTextMessage(
          advisorJid,
          `CastleXpert bot: un cliente (${phone}) pidió asesor.\n\nMensaje:\n${text}`
        );
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[wa] advisor ping failed:', e?.message || e);
    }
    return;
  }

  const answer = await answerChatMessage(db, {
    conversationId,
    language: lang,
    message: text,
  });
  await sendTextMessage(remoteJid, answer);
}

/** WhatsApp may address chats by LID (`...@lid`); the real number then comes in `senderPn`. */
function resolveSenderPhone(key = {}) {
  for (const candidate of [key.senderPn, key.remoteJid]) {
    if (candidate && /@s\.whatsapp\.net$/.test(candidate)) return jidToPhone(candidate);
  }
  if (String(key.remoteJid || '').endsWith('@lid')) {
    // eslint-disable-next-line no-console
    console.warn('[wa] inbound from LID without senderPn:', key.remoteJid);
  }
  return '';
}

function shouldRateLimit(remoteJid) {
  const now = Date.now();
  const last = recentInbound.get(remoteJid) || 0;
  if (now - last < 1500) return true;
  recentInbound.set(remoteJid, now);
  return false;
}

async function onMessagesUpsert(upsert) {
  if (upsert.type !== 'notify') return;
  for (const msg of upsert.messages || []) {
    try {
      if (!msg.message || msg.key?.fromMe) continue;
      const remoteJid = msg.key?.remoteJid;
      if (!remoteJid || remoteJid === 'status@broadcast' || remoteJid.endsWith('@g.us')) continue;
      if (shouldRateLimit(remoteJid)) continue;

      const text =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        msg.message.imageMessage?.caption ||
        msg.message.videoMessage?.caption ||
        '';

      if (!String(text).trim()) {
        // Ignore media-only for now (optional download unused)
        if (msg.message.imageMessage || msg.message.audioMessage || msg.message.documentMessage) {
          await sendTextMessage(
            remoteJid,
            'Por ahora respondo mejor a mensajes de texto. ¿Me escribes tu consulta?'
          );
        }
        continue;
      }

      const senderPhone = resolveSenderPhone(msg.key);
      // eslint-disable-next-line no-await-in-loop
      await handleInboundText(remoteJid, String(text).trim(), senderPhone);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[wa] inbound handler error:', e?.message || e);
    }
  }
}

export async function startBaileys({ getDbFn }) {
  getDb = getDbFn;
  if (starting || (sock && connectionStatus === 'open')) return getBaileysStatus();
  starting = true;
  connectionStatus = 'connecting';
  statusDetail = 'Iniciando sesión Baileys…';

  try {
    const { state, saveCreds } = await useMultiFileAuthState(authDir());
    const { version } = await fetchLatestBaileysVersion();

    sock = makeWASocket({
      version,
      auth: state,
      logger,
      printQRInTerminal: false,
      syncFullHistory: false,
      markOnlineOnConnect: false,
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;
      if (qr) {
        lastQr = qr;
        lastQrDataUrl = null;
        connectionStatus = 'qr';
        statusDetail = 'Escanea el QR con WhatsApp Business (Dispositivos vinculados).';
        // eslint-disable-next-line no-console
        console.log('[wa] QR ready — scan from WAdministrativo');
      }
      if (connection === 'open') {
        lastQr = null;
        lastQrDataUrl = null;
        connectionStatus = 'open';
        statusDetail = 'Conectado';
        const id = sock?.user?.id || '';
        connectedPhone = jidToPhone(id.split(':')[0] || id);
        // eslint-disable-next-line no-console
        console.log('[wa] connected as', connectedPhone || id);
      }
      if (connection === 'close') {
        const code = lastDisconnect?.error?.output?.statusCode;
        const loggedOut = code === DisconnectReason.loggedOut;
        sock = null;
        if (loggedOut) {
          connectionStatus = 'logged_out';
          statusDetail = 'Sesión cerrada. Escanea un nuevo QR.';
          starting = false;
          return;
        }
        connectionStatus = 'disconnected';
        statusDetail = `Desconectado (${code ?? 'unknown'}). Reintentando…`;
        starting = false;
        setTimeout(() => {
          startBaileys({ getDbFn }).catch((e) => {
            // eslint-disable-next-line no-console
            console.error('[wa] reconnect failed:', e?.message || e);
          });
        }, 4000);
      }
    });

    sock.ev.on('messages.upsert', onMessagesUpsert);
  } catch (e) {
    connectionStatus = 'disconnected';
    statusDetail = e?.message || 'Error al iniciar Baileys';
    // eslint-disable-next-line no-console
    console.error('[wa] start failed:', statusDetail);
  } finally {
    starting = false;
  }

  return getBaileysStatus();
}

export async function logoutBaileys() {
  try {
    if (sock) {
      await sock.logout();
    }
  } catch {
    // ignore
  }
  sock = null;
  lastQr = null;
  lastQrDataUrl = null;
  connectedPhone = '';
  connectionStatus = 'logged_out';
  statusDetail = 'Sesión cerrada manualmente.';

  // Clear auth files so a fresh QR can be generated
  try {
    const dir = authDir();
    for (const name of fs.readdirSync(dir)) {
      fs.rmSync(path.join(dir, name), { force: true, recursive: true });
    }
  } catch {
    // ignore
  }
}
