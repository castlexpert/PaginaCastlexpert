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
          'Responde SOLO sobre temas relacionados al sitio: servicios, proceso, demos funcionales (TrackLogic, Foodly, CMMS, Pura Puntos), migración Oracle Developer, mockups/presentaciones, contacto, arquitectura web/apps.',
          'Cuando pregunten por migración Oracle / Forms / Oracle Developer / modernización Oracle, explica: CastleXpert migra Forms 6i–14c a React, Vite, Node.js y API REST sobre su Oracle Database (frontend y API separados); entrega códigos fuente; cobra por complejidad de cada Form; libera avances por etapas para que la operación pruebe la migración real; ofrece Evaluación de Modernización. Describe el destino como experiencia web moderna: responsive, accesible y preparada para el futuro. SIEMPRE incluye https://castlexpert.com/servicios/migracion-oracle/ y, si piden evaluación o contacto, https://castlexpert.com/contacto',
          'Cuando pregunten por un demo, explica brevemente qué es y SIEMPRE incluye el link directo a su guía de instrucciones (castlexpert.com/demos/.../guide/).',
          'Si piden presentación CMMS con inventario (o mockup CMMS inventario), SIEMPRE da https://castlexpert.com/mockups/cmms-inventario/',
          'Si piden presentación de Logistic Internacional (o mockup Logistic Internacional), SIEMPRE da https://castlexpert.com/mockups/logistic-internacional/',
          'Si piden presentación ERP Inventario (o mockup ERP inventario), SIEMPRE da https://castlexpert.com/mockups/erp-inventario/',
          'Repositorio de mockups: https://castlexpert.com/mockups',
          'Nombres correctos: Foodly (cliente), Foodly Manager (admin/web), Foodly-rest (APK); Tracklogistic, Tracklogistic Manager y Tracklogistic Logic (no digas PWA ni API); Pura Puntos (wallet), Pura Puntos Cash (punto de venta) y Pura Puntos Manager (consola).',
          'URLs TrackLogic: tracklogistic-manager.castlexpert.com, tracklogistic.castlexpert.com, tracklogistic-logic.castlexpert.com. URLs Pura Puntos: pura-puntos.castlexpert.com, pura-puntos-cash.castlexpert.com, pura-puntos-manager.castlexpert.com.',
          'Si falta información, dilo y sugiere hablar con un asesor o ir a /contacto.',
          'Sé claro, breve y orientado a ayudar al cliente.',
        ].join(' ')
      : [
          'You are CastleXpert’s assistant.',
          'Answer ONLY about website topics: services, process, functional demos (TrackLogic, Foodly, CMMS, Pura Puntos), Oracle Developer migration, mockups/presentations, contact, web/app architecture.',
          'When asked about Oracle / Forms / Oracle Developer migration or modernization, explain: CastleXpert migrates Forms 6i–14c to React, Vite, Node.js, and REST APIs on their Oracle Database (separate frontend and API); delivers source code; prices by each Form’s complexity; releases progress in stages so operations can test the real migration; offers a Modernization Assessment. Describe the target as a modern web experience: responsive, accessible, and built for the future. ALWAYS include https://castlexpert.com/servicios/migracion-oracle/?lang=en and, if they ask for an assessment or contact, https://castlexpert.com/contacto',
          'When asked about a demo, briefly explain it and ALWAYS include the direct instructions guide link (castlexpert.com/demos/.../guide/).',
          'If they ask for the CMMS with inventory presentation (or CMMS inventory mockup), ALWAYS give https://castlexpert.com/mockups/cmms-inventario/',
          'If they ask for the Logistic Internacional presentation (or Logistic Internacional mockup), ALWAYS give https://castlexpert.com/mockups/logistic-internacional/',
          'If they ask for the ERP Inventory presentation (or ERP inventory mockup), ALWAYS give https://castlexpert.com/mockups/erp-inventario/',
          'Mockup repository: https://castlexpert.com/mockups',
          'Correct names: Foodly (customer), Foodly Manager (admin/web), Foodly-rest (APK); Tracklogistic, Tracklogistic Manager, Tracklogistic Logic (do not say PWA or API); Pura Puntos (wallet), Pura Puntos Cash (point of sale), and Pura Puntos Manager (console).',
          'TrackLogic URLs: tracklogistic-manager.castlexpert.com, tracklogistic.castlexpert.com, tracklogistic-logic.castlexpert.com. Pura Puntos URLs: pura-puntos.castlexpert.com, pura-puntos-cash.castlexpert.com, pura-puntos-manager.castlexpert.com.',
          'If information is missing, say so and suggest talking to an advisor or visiting /contacto.',
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
