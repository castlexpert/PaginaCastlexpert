import OpenAI from 'openai';

let client = null;
function getClient() {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) return null;
  if (!client) client = new OpenAI({ apiKey: key });
  return client;
}

async function toUploadFile(buffer, filename, mime) {
  // Prefer SDK helper when present; fall back to Blob/File for older openai builds.
  if (typeof OpenAI.toFile === 'function') {
    return OpenAI.toFile(buffer, filename, { type: mime });
  }
  try {
    const mod = await import('openai');
    if (typeof mod.toFile === 'function') {
      return mod.toFile(buffer, filename, { type: mime });
    }
  } catch {
    // continue
  }
  if (typeof File !== 'undefined') {
    return new File([buffer], filename, { type: mime });
  }
  return new Blob([buffer], { type: mime });
}

/**
 * Transcribes owner voice audio with Whisper (Spanish).
 * @param {string} base64
 * @param {string} [mime]
 * @param {{ mode?: 'wake' | 'command' }} [opts]
 * @returns {Promise<string>}
 */
export async function transcribeVoiceAudio(base64, mime = 'audio/wav', opts = {}) {
  const openai = getClient();
  if (!openai) {
    throw new Error('OpenAI no está configurado en el servidor.');
  }
  const raw = String(base64 || '').replace(/\s/g, '');
  if (!raw) throw new Error('Audio vacío.');
  // ~1.5 MB base64 limit (~1.1 MB binary) keeps WS payloads sane.
  if (raw.length > 1.6e6) throw new Error('Audio demasiado largo.');

  const buffer = Buffer.from(raw, 'base64');
  // Wake clips are ~1s; allow shorter than full commands.
  const minBytes = opts.mode === 'wake' ? 320 : 500;
  if (buffer.length < minBytes) throw new Error('Audio demasiado corto.');

  const kind = String(mime || 'audio/wav');
  const ext = kind.includes('webm')
    ? 'webm'
    : kind.includes('mpeg') || kind.includes('mp3')
      ? 'mp3'
      : 'wav';
  const contentType = kind.startsWith('audio/') ? kind : `audio/${ext}`;
  const file = await toUploadFile(buffer, `maria-${opts.mode || 'command'}.${ext}`, contentType);

  const body = {
    file,
    model: 'whisper-1',
    language: 'es',
    response_format: 'text',
  };
  // Bias wake clips toward the name so Whisper locks faster / more reliably.
  if (opts.mode === 'wake') {
    body.prompt = 'Maria. María. Oye Maria. Hola Maria.';
  }

  const result = await openai.audio.transcriptions.create(body);

  const text = typeof result === 'string' ? result : String(result?.text || '');
  return text.trim();
}

/** True if transcription contains the wake name (Maria / María / …). */
export function textHasWakeWord(text) {
  const t = String(text || '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase();
  return /\b(maria|mariah|marya)\b/.test(t) || /maria|mariah|marya/.test(t);
}

/** Strip leading wake phrase so the assistant sees only the command. */
export function stripWakeWord(text) {
  return String(text || '')
    .replace(
      /^\s*((oye|oiga|hola|hey|ok|ea)\s+)?(mar[ií]a|mariah|marya)[\s,.:;¡!¿?-]*/iu,
      ''
    )
    .trim();
}
