import OpenAI from 'openai';

function getClient() {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) return null;
  return new OpenAI({ apiKey: key });
}

export function isOpenAiConfigured() {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

export async function answerWithLlm({ language, question, context, history }) {
  const client = getClient();
  if (!client) return null;

  const model = process.env.OPENAI_MODEL?.trim() || 'gpt-4o-mini';

  const system =
    language === 'es'
      ? [
          'Eres un asistente de CastleXpert.',
          'Responde SOLO sobre temas relacionados al sitio: servicios, proceso, demos, contacto, arquitectura web/apps.',
          'Si falta información, dilo y sugiere hablar con un asesor.',
          'Sé claro, breve y orientado a ayudar al cliente.',
        ].join(' ')
      : [
          'You are CastleXpert’s assistant.',
          'Answer ONLY about topics related to the website: services, process, demos, contact, web/app architecture.',
          'If information is missing, say so and suggest talking to an advisor.',
          'Be clear, concise, and helpful.',
        ].join(' ');

  const input = [
    { role: 'system', content: system },
    ...(history || []).map((m) => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content,
    })),
    {
      role: 'user',
      content:
        language === 'es'
          ? `Contexto del sitio:\n${context}\n\nPregunta del usuario:\n${question}`
          : `Website context:\n${context}\n\nUser question:\n${question}`,
    },
  ];

  try {
    const response = await client.chat.completions.create({
      model,
      messages: input,
      temperature: 0.4,
      max_tokens: 350,
    });

    return response.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  }
}
