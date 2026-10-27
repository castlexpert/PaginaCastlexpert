import OpenAI from 'openai';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { randomBytes } from 'node:crypto';

const PENELOPE = 'es-US-PenelopeNeural';

let openai = null;
function getOpenAi() {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) return null;
  if (!openai) openai = new OpenAI({ apiKey: key });
  return openai;
}

/**
 * Try Edge neural Penelope; fall back to OpenAI TTS (reliable on Railway).
 * @returns {Promise<{ mime: string, base64: string, voice: string }>}
 */
export async function synthesizeOwnerVoice(text) {
  const clean = String(text || '')
    .replace(/\*\*?/g, '')
    .replace(/`+/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 600);
  if (!clean) throw new Error('Texto vacío para TTS.');

  try {
    return await synthesizePenelopeEdge(clean);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[owner-voice] Edge Penelope falló:', e?.message || e);
  }
  return synthesizeOpenAi(clean);
}

async function synthesizePenelopeEdge(text) {
  const { MsEdgeTTS, OUTPUT_FORMAT } = await import('msedge-tts');
  const workDir = path.join(os.tmpdir(), `cx-penelope-${randomBytes(6).toString('hex')}`);
  fs.mkdirSync(workDir, { recursive: true });
  const tts = new MsEdgeTTS({ connectionTimeoutMs: 10000, synthesisTimeoutMs: 25000 });
  try {
    await tts.setMetadata(PENELOPE, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
    const { audioFilePath } = await tts.toFile(workDir, text, { rate: '+5%', pitch: '+0Hz' });
    const buf = fs.readFileSync(audioFilePath);
    return {
      mime: 'audio/mpeg',
      base64: buf.toString('base64'),
      voice: PENELOPE,
    };
  } finally {
    try {
      tts.close();
    } catch {
      // ignore
    }
    fs.rmSync(workDir, { recursive: true, force: true });
  }
}

async function synthesizeOpenAi(text) {
  const client = getOpenAi();
  if (!client) throw new Error('OpenAI no configurado para TTS.');
  const result = await client.audio.speech.create({
    model: 'tts-1-hd',
    voice: 'nova',
    input: text,
    response_format: 'mp3',
    speed: 1.05,
  });
  const buf = Buffer.from(await result.arrayBuffer());
  return {
    mime: 'audio/mpeg',
    base64: buf.toString('base64'),
    voice: 'openai:nova',
  };
}
