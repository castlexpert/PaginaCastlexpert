import { ensureConversation, addMessage, getRecentMessages, searchKb } from './db.mjs';
import { answerWithLlm } from './llm.mjs';
import { answerMockupPresentation } from './mockupIntents.mjs';
import {
  embedQueryText,
  searchSitePagesByEmbedding,
  formatSitePagesForContext,
  formatSiteFallbackAnswer,
} from './siteIndex.mjs';

/**
 * Shared chat brain for web widget and WhatsApp bot.
 * @returns {Promise<string>}
 */
export async function answerChatMessage(db, { conversationId, language, message }) {
  const lang = String(language || 'es');
  const msg = String(message || '').trim();
  const convId = String(conversationId);

  if (!msg) {
    return lang === 'es' ? '¿En qué puedo ayudarte?' : 'How can I help you?';
  }

  await ensureConversation(db, convId, lang);
  await addMessage(db, convId, 'user', msg);

  const history = await getRecentMessages(db, convId, 8);

  const mockupAnswer = answerMockupPresentation(msg, lang);
  if (mockupAnswer) {
    await addMessage(db, convId, 'assistant', mockupAnswer);
    return mockupAnswer;
  }

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

  await addMessage(db, convId, 'assistant', answer);
  return answer;
}

const HANDOFF_RE =
  /\b(asesor|humano|persona|agente|advisor|human|hablar\s+con\s+alguien|quiero\s+cotizar|cotizaci[oó]n)\b/i;

export function wantsHumanHandoff(text) {
  return HANDOFF_RE.test(String(text || ''));
}
