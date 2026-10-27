import { getWhatsAppConfig } from './whatsappConfig.mjs';
import { handleOwnerMessage } from './ownerAssistant.mjs';
import { stripWakeWord, transcribeVoiceAudio } from './voiceTranscribe.mjs';
import { synthesizeOwnerVoice } from './ownerVoiceTts.mjs';
import { getBaileysStatus } from './baileysWhatsApp.mjs';

/**
 * One voice turn for the owner PWA: audio → Whisper → ownerAssistant → Penelope TTS.
 * @param {import('pg').Pool} db
 * @param {{ audio?: string, mime?: string, text?: string, deviceId?: string }} body
 */
export async function handleOwnerVoiceTurn(db, body) {
  const cfg = await getWhatsAppConfig(db);
  const phone = String(cfg.owner_phone || '').trim();
  if (!phone) {
    const err = new Error(
      'Configure el teléfono de dueño en WhatsApp del panel para usar Penélope.'
    );
    err.status = 400;
    throw err;
  }

  let text = String(body.text || '').trim();
  if (!text && body.audio) {
    text = await transcribeVoiceAudio(body.audio, body.mime || 'audio/webm');
  }
  if (!text) {
    const err = new Error('No se escuchó nada. Mantenga pulsado e intente de nuevo.');
    err.status = 400;
    throw err;
  }

  const command = stripWakeWord(text) || text;
  const deviceId = String(body.deviceId || 'pwa').slice(0, 64);
  const answer = await handleOwnerMessage(db, {
    text: command,
    jid: `pwa-voice:${deviceId}`,
    phone,
    source: 'pc-voice',
    sendText: async () => {},
    getConnection: getBaileysStatus,
  });

  const spoken = String(answer || '').trim() || 'Dígame, jefe.';
  let tts;
  try {
    tts = await synthesizeOwnerVoice(spoken);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[owner-voice] TTS falló, solo texto:', e?.message || e);
    return {
      transcript: text,
      command,
      answer: spoken,
      audio: null,
      mime: null,
      voice: null,
    };
  }

  return {
    transcript: text,
    command,
    answer: spoken,
    audio: tts.base64,
    mime: tts.mime,
    voice: tts.voice,
  };
}
