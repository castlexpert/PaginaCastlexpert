import OpenAI from 'openai';

const SYSTEM = `Eres un asistente que extrae información estructurada de páginas web.
Devuelve un JSON con:
- titulo
- descripcion (máximo 150 palabras)
- secciones: [{titulo, descripcion corta}]

No inventes información. Devuelve solo JSON válido.`;

function stripJsonFence(s) {
  let t = s.trim();
  if (t.startsWith('```')) {
    t = t.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  }
  return t.trim();
}

export function parseAndValidateJson(text) {
  const raw = stripJsonFence(text);
  const obj = JSON.parse(raw);
  if (typeof obj !== 'object' || obj === null) throw new Error('JSON no es objeto');
  if (typeof obj.titulo !== 'string') throw new Error('Falta titulo');
  if (typeof obj.descripcion !== 'string') throw new Error('Falta descripcion');
  if (!Array.isArray(obj.secciones)) throw new Error('secciones debe ser array');
  for (const s of obj.secciones) {
    if (!s || typeof s.titulo !== 'string' || typeof s.descripcion !== 'string') {
      throw new Error('secciones inválidas');
    }
  }
  return obj;
}

export async function extractStructuredPage({ cleanText, model = 'gpt-4o-mini' }) {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) throw new Error('OPENAI_API_KEY no configurada');

  const client = new OpenAI({ apiKey: key });
  const completion = await client.chat.completions.create({
    model,
    temperature: 0.2,
    max_tokens: 1200,
    messages: [
      { role: 'system', content: SYSTEM },
      {
        role: 'user',
        content: `Contenido de la página (texto limpio):\n\n${cleanText}`,
      },
    ],
  });

  const out = completion.choices?.[0]?.message?.content?.trim() || '';
  return parseAndValidateJson(out);
}
