import OpenAI from 'openai';
import { ensureConversation, addMessage, getRecentMessages } from './db.mjs';
import {
  addItem,
  listItems,
  completeItem,
  deleteItem,
  addReminder,
  listPendingReminders,
  cancelReminder,
} from './ownerStore.mjs';
import {
  getWhatsAppConfig,
  updateWhatsAppConfig,
  listPausedChats,
  resumeChat,
} from './whatsappConfig.mjs';
import { listAgents, queueAgentCommand, findAgentAction } from './agentHub.mjs';
import { chatModel, reasoningParams } from './openaiModel.mjs';

const TIME_ZONE = 'America/Costa_Rica';
const PENDING_TTL_MS = 10 * 60 * 1000;
const YES_RE = /^\s*(s[ií]+|dale|confirmo|confirmado|hazlo|de una|ok(ay)?|yes|correcto)\b/i;
const NO_RE = /^\s*(no|cancela(r)?|olv[ií]dalo|mejor no)\b/i;
/** pc_speak only runs when the owner's message itself asks for speech; the model alone tends to "greet" through the PC. */
const PC_SPEAK_RE =
  /(^|[^a-záéíóúñ])(d[ií]|dile|d[ií]ga|dec[ií]|decir|habl[aeé]\w*|reproduc\w*|en voz alta|voz|pc|compu\w*|localbot|salom[eé]|parlante|bocina|anunci[ae]\w*)(?=$|[^a-záéíóúñ])/i;

/** Sensitive actions awaiting a "sí" from the owner, keyed by chat jid. */
const pendingByJid = new Map();

function nowInCostaRica() {
  const fmt = new Intl.DateTimeFormat('es-CR', {
    timeZone: TIME_ZONE,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  return `${fmt.format(new Date())} (UTC-06:00, ${TIME_ZONE})`;
}

function formatDate(d) {
  return new Intl.DateTimeFormat('es-CR', {
    timeZone: TIME_ZONE,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(d));
}

function digits(s) {
  return String(s || '').replace(/\D/g, '');
}

const TOOLS = [
  {
    name: 'add_task',
    description: 'Agrega un pendiente a la lista del jefe.',
    parameters: { type: 'object', properties: { content: { type: 'string' } }, required: ['content'] },
  },
  {
    name: 'add_note',
    description: 'Guarda una nota o idea libre del jefe.',
    parameters: { type: 'object', properties: { content: { type: 'string' } }, required: ['content'] },
  },
  {
    name: 'list_items',
    description: 'Lista pendientes (task) o notas (note). Cada item tiene un id numérico.',
    parameters: {
      type: 'object',
      properties: {
        kind: { type: 'string', enum: ['task', 'note'] },
        include_done: { type: 'boolean', description: 'Incluir pendientes ya hechos.' },
      },
      required: ['kind'],
    },
  },
  {
    name: 'complete_task',
    description: 'Marca un pendiente como hecho usando su id.',
    parameters: { type: 'object', properties: { id: { type: 'integer' } }, required: ['id'] },
  },
  {
    name: 'delete_item',
    description: 'Elimina un pendiente o nota por id.',
    parameters: { type: 'object', properties: { id: { type: 'integer' } }, required: ['id'] },
  },
  {
    name: 'create_reminder',
    description:
      'Crea un recordatorio que se envía por WhatsApp al jefe a la hora indicada. due_at en ISO 8601 con offset -06:00.',
    parameters: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        due_at: { type: 'string', description: 'Ejemplo: 2026-10-03T09:00:00-06:00' },
      },
      required: ['message', 'due_at'],
    },
  },
  {
    name: 'list_reminders',
    description: 'Lista recordatorios pendientes.',
    parameters: { type: 'object', properties: {} },
  },
  {
    name: 'cancel_reminder',
    description: 'Cancela un recordatorio pendiente por id.',
    parameters: { type: 'object', properties: { id: { type: 'integer' } }, required: ['id'] },
  },
  {
    name: 'get_bot_status',
    description: 'Estado del bot de clientes: conexión WhatsApp, si responde automático y chats pausados.',
    parameters: { type: 'object', properties: {} },
  },
  {
    name: 'set_bot_enabled',
    description: 'Enciende o apaga las respuestas automáticas a clientes. No afecta el modo jefe.',
    parameters: { type: 'object', properties: { enabled: { type: 'boolean' } }, required: ['enabled'] },
  },
  {
    name: 'resume_chat',
    description: 'Reanuda el bot en un chat de cliente pausado (por handoff). Recibe el teléfono o el jid.',
    parameters: { type: 'object', properties: { phone_or_jid: { type: 'string' } }, required: ['phone_or_jid'] },
  },
  {
    name: 'send_message_to_client',
    description:
      'Prepara un mensaje de WhatsApp para un cliente. NO se envía hasta que el jefe confirme con "sí".',
    parameters: {
      type: 'object',
      properties: {
        phone: { type: 'string', description: 'Número con código de país, ej. +50688887777' },
        message: { type: 'string' },
      },
      required: ['phone', 'message'],
    },
  },
  {
    name: 'pc_list',
    description: 'Lista las computadoras del jefe, si están en línea y qué acciones locales permiten.',
    parameters: { type: 'object', properties: {} },
  },
  {
    name: 'pc_speak',
    description:
      'Hace que la computadora del jefe diga un texto en voz alta. Úsala SOLO si el jefe pide explícitamente que la PC hable, diga o reproduzca algo. Nunca para saludar ni para responder sus mensajes.',
    parameters: {
      type: 'object',
      properties: { text: { type: 'string' }, device: { type: 'string', description: 'Opcional' } },
      required: ['text'],
    },
  },
  {
    name: 'pc_run_action',
    description:
      'Ejecuta una acción local permitida (por id, ver pc_list) en la computadora del jefe. Algunas piden confirmación.',
    parameters: {
      type: 'object',
      properties: { action_id: { type: 'string' }, device: { type: 'string', description: 'Opcional' } },
      required: ['action_id'],
    },
  },
  {
    name: 'pc_lock',
    description: 'Bloquea la sesión de Windows de la computadora del jefe.',
    parameters: { type: 'object', properties: { device: { type: 'string', description: 'Opcional' } } },
  },
];

function systemPrompt(source = 'whatsapp') {
  const voice = source === 'pc-voice';
  return [
    voice
      ? 'Eres el asistente personal del dueño de CastleXpert. Te habla por voz desde su PC (LocalBot / Cleo). Responde para ser leída en voz alta: frases cortas, sin markdown, sin listas largas ni enlaces.'
      : 'Eres el asistente personal del dueño de CastleXpert. Le hablas por WhatsApp.',
    'Llámalo siempre "Jefe". Tono servicial, breve y con energía: "Sí, jefe", "Ok, jefe", "Listo, jefe", "A la orden, jefe".',
    voice
      ? 'Si el mensaje es un saludo, responde breve: "Hola jefe".'
      : 'Si el mensaje es un saludo, empieza con "Hola Jefe!!!".',
    'Usa las herramientas para pendientes, notas, recordatorios, control del bot de clientes, mensajes a clientes y su computadora.',
    voice
      ? 'NO uses pc_speak: tu respuesta ya se reproduce en la PC. Nunca digas que vas a hacer hablar a la computadora.'
      : 'Responde siempre por WhatsApp. Solo usa pc_speak cuando el jefe pida explícitamente que la computadora diga o reproduzca algo; un saludo o una pregunta normal NO es una orden para la PC.',
    'Nunca inventes resultados: si una herramienta falla, díselo al jefe.',
    'Para recordatorios, calcula due_at en ISO 8601 con offset -06:00 a partir de la fecha y hora actual.',
    'Si una herramienta devuelve needs_confirmation, pregunta al jefe si confirma y explica exactamente qué se hará.',
    voice
      ? 'Al listar, di como máximo 5 ítems en frases cortas, mencionando el id.'
      : 'Al listar, usa listas cortas con el id entre corchetes, por ejemplo "[3] Llamar a Juan".',
    `Fecha y hora actual: ${nowInCostaRica()}.`,
  ].join(' ');
}

async function runTool(db, name, args, ctx) {
  switch (name) {
    case 'add_task':
      return { ok: true, item: await addItem(db, 'task', args.content) };
    case 'add_note':
      return { ok: true, item: await addItem(db, 'note', args.content) };
    case 'list_items': {
      const items = await listItems(db, args.kind === 'note' ? 'note' : 'task', Boolean(args.include_done));
      return { ok: true, items: items.map((i) => ({ id: i.id, content: i.content, done: i.done })) };
    }
    case 'complete_task': {
      const item = await completeItem(db, args.id);
      return item ? { ok: true, item } : { ok: false, error: 'No existe un pendiente con ese id.' };
    }
    case 'delete_item': {
      const item = await deleteItem(db, args.id);
      return item ? { ok: true, item } : { ok: false, error: 'No existe un item con ese id.' };
    }
    case 'create_reminder': {
      const r = await addReminder(db, args.message, args.due_at);
      if (new Date(r.due_at).getTime() < Date.now() - 60 * 1000) {
        return { ok: true, reminder: r, warning: 'La hora ya pasó; se enviará de inmediato.' };
      }
      return { ok: true, reminder: { ...r, due_local: formatDate(r.due_at) } };
    }
    case 'list_reminders': {
      const rows = await listPendingReminders(db);
      return { ok: true, reminders: rows.map((r) => ({ id: r.id, message: r.message, due_local: formatDate(r.due_at) })) };
    }
    case 'cancel_reminder': {
      const r = await cancelReminder(db, args.id);
      return r ? { ok: true, reminder: r } : { ok: false, error: 'No existe un recordatorio pendiente con ese id.' };
    }
    case 'get_bot_status': {
      const cfg = await getWhatsAppConfig(db);
      const paused = await listPausedChats(db);
      return {
        ok: true,
        connection: ctx.getConnection(),
        bot_enabled: cfg.bot_enabled,
        handoff_channel: cfg.handoff_channel,
        paused_chats: paused.map((p) => ({ jid: p.remote_jid, until: formatDate(p.paused_until), reason: p.reason })),
      };
    }
    case 'set_bot_enabled': {
      const cfg = await updateWhatsAppConfig(db, { bot_enabled: Boolean(args.enabled) });
      return { ok: true, bot_enabled: cfg.bot_enabled };
    }
    case 'resume_chat': {
      const ref = String(args.phone_or_jid || '').trim();
      const paused = await listPausedChats(db);
      const match = paused.find((p) => p.remote_jid === ref || (digits(ref) && digits(p.remote_jid).endsWith(digits(ref))));
      if (!match) return { ok: false, error: 'No encontré un chat pausado con ese número.' };
      await resumeChat(db, match.remote_jid);
      return { ok: true, resumed: match.remote_jid };
    }
    case 'send_message_to_client': {
      const phone = digits(args.phone);
      if (phone.length < 8) return { ok: false, error: 'Número inválido.' };
      const message = String(args.message || '').trim();
      if (!message) return { ok: false, error: 'Mensaje vacío.' };
      pendingByJid.set(ctx.jid, {
        kind: 'send_client',
        payload: { phone, message },
        summary: `Enviar a +${phone}: "${message}"`,
        expiresAt: Date.now() + PENDING_TTL_MS,
      });
      return { ok: true, needs_confirmation: true, summary: `Enviar a +${phone}: "${message}"` };
    }
    case 'pc_list': {
      const agents = await listAgents(db);
      return {
        ok: true,
        devices: agents.map((a) => ({
          name: a.name,
          online: a.online,
          last_seen: a.last_seen_at ? formatDate(a.last_seen_at) : null,
          actions: (a.actions || []).map((x) => ({ id: x.id, type: x.type, description: x.description, confirm: x.confirm })),
        })),
      };
    }
    case 'pc_speak': {
      if (ctx.source === 'pc-voice') {
        return { ok: false, error: 'El jefe ya habla por voz en la PC. No uses pc_speak; responde en texto oral.' };
      }
      if (!PC_SPEAK_RE.test(String(ctx.text || ''))) {
        return { ok: false, error: 'El jefe no pidió que la PC hable. No uses pc_speak; responde solo por WhatsApp.' };
      }
      const text = String(args.text || '').trim().slice(0, 500);
      if (!text) return { ok: false, error: 'Texto vacío.' };
      const q = await queueAgentCommand(db, { agent: args.device, type: 'speak', payload: { text }, source: 'whatsapp' });
      return { ok: true, device: q.agent.name, online: q.online, note: q.online ? 'Enviado.' : 'PC desconectada; queda en cola 10 minutos.' };
    }
    case 'pc_run_action': {
      const { agent, action } = await findAgentAction(db, String(args.action_id || ''), args.device);
      if (!agent) return { ok: false, error: 'No hay computadoras registradas con ese nombre.' };
      if (!action) return { ok: false, error: `La acción "${args.action_id}" no está permitida en ${agent.name}. Usa pc_list.` };
      if (action.confirm) {
        pendingByJid.set(ctx.jid, {
          kind: 'pc_run',
          payload: { agent: agent.name, actionId: action.id },
          summary: `Ejecutar "${action.id}" en ${agent.name}${action.description ? ` (${action.description})` : ''}`,
          expiresAt: Date.now() + PENDING_TTL_MS,
        });
        return { ok: true, needs_confirmation: true, summary: `Ejecutar "${action.id}" en ${agent.name}` };
      }
      const q = await queueAgentCommand(db, {
        agent: agent.name,
        type: 'run',
        payload: { action: action.id },
        source: ctx.source === 'pc-voice' ? 'pc-voice' : 'whatsapp',
        notifyJid: ctx.source === 'pc-voice' ? ctx.phone : ctx.jid,
      });
      return { ok: true, device: q.agent.name, online: q.online, note: 'Te aviso cuando termine.' };
    }
    case 'pc_lock': {
      const q = await queueAgentCommand(db, {
        agent: args.device,
        type: 'lock',
        source: ctx.source === 'pc-voice' ? 'pc-voice' : 'whatsapp',
      });
      return { ok: true, device: q.agent.name, online: q.online };
    }
    default:
      return { ok: false, error: `Herramienta desconocida: ${name}` };
  }
}

async function executePending(db, pending, ctx) {
  if (pending.kind === 'send_client') {
    await ctx.sendText(pending.payload.phone, pending.payload.message);
    return `Listo, jefe. Mensaje enviado a +${pending.payload.phone}.`;
  }
  if (pending.kind === 'pc_run') {
    const q = await queueAgentCommand(db, {
      agent: pending.payload.agent,
      type: 'run',
      payload: { action: pending.payload.actionId },
      source: ctx.source === 'pc-voice' ? 'pc-voice' : 'whatsapp',
      notifyJid: ctx.source === 'pc-voice' ? ctx.phone : ctx.jid,
    });
    return q.online
      ? `Listo, jefe. Ejecutando "${pending.payload.actionId}" en ${q.agent.name}; le aviso cuando termine.`
      : `Ok, jefe. ${q.agent.name} está desconectada; el comando queda en cola 10 minutos.`;
  }
  return 'Jefe, no reconozco esa acción pendiente.';
}

let client = null;
function getClient() {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) return null;
  if (!client) client = new OpenAI({ apiKey: key });
  return client;
}

/**
 * Handles a message from the owner's WhatsApp or PC voice (LocalBot / Cleo).
 * @param {*} db
 * @param {{ text: string, jid: string, phone: string, sendText: Function, getConnection: Function, source?: 'whatsapp'|'pc-voice' }} ctx
 * @returns {Promise<string>}
 */
export async function handleOwnerMessage(db, ctx) {
  const text = String(ctx.text || '').trim();
  const source = ctx.source === 'pc-voice' ? 'pc-voice' : 'whatsapp';
  const conversationId = `owner:${digits(ctx.phone) || ctx.jid}`;

  const pending = pendingByJid.get(ctx.jid);
  if (pending) {
    pendingByJid.delete(ctx.jid);
    if (pending.expiresAt > Date.now()) {
      if (YES_RE.test(text)) {
        try {
          return await executePending(db, pending, ctx);
        } catch (e) {
          return `Jefe, no pude completarlo: ${e?.message || e}`;
        }
      }
      if (NO_RE.test(text)) {
        return 'Ok, jefe. Cancelado.';
      }
    }
  }

  const openai = getClient();
  if (!openai) {
    return source === 'pc-voice'
      ? 'Jefe, no tengo OpenAI configurado en el servidor, así que por ahora no puedo ayudarle.'
      : 'Hola Jefe!!! No tengo OpenAI configurado en el servidor, así que por ahora no puedo ayudarle con tareas.';
  }

  await ensureConversation(db, conversationId, 'es');
  const history = await getRecentMessages(db, conversationId, 10);
  await addMessage(db, conversationId, 'user', text);

  const messages = [
    { role: 'system', content: systemPrompt(source) },
    ...history.map((m) => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content })),
    { role: 'user', content: text },
  ];

  const model = chatModel();
  let answer = '';
  const maxTokens = source === 'pc-voice' ? 280 : 500;

  for (let step = 0; step < 5; step += 1) {
    // eslint-disable-next-line no-await-in-loop
    const response = await openai.chat.completions.create({
      model,
      messages,
      tools: TOOLS.map((t) => ({ type: 'function', function: t })),
      ...reasoningParams(model),
      temperature: 0.3,
      max_completion_tokens: maxTokens,
    });
    const choice = response.choices?.[0]?.message;
    if (!choice) break;

    if (choice.tool_calls?.length) {
      messages.push(choice);
      for (const call of choice.tool_calls) {
        let result;
        try {
          const args = call.function?.arguments ? JSON.parse(call.function.arguments) : {};
          // eslint-disable-next-line no-await-in-loop
          result = await runTool(db, call.function?.name, args, ctx);
        } catch (e) {
          result = { ok: false, error: e?.message || String(e) };
        }
        messages.push({ role: 'tool', tool_call_id: call.id, content: JSON.stringify(result) });
      }
      continue;
    }

    answer = String(choice.content || '').trim();
    break;
  }

  if (!answer) answer = 'Jefe, tuve un problema procesando eso. ¿Me lo repite?';
  await addMessage(db, conversationId, 'assistant', answer);
  return answer;
}

/** Formats an agent command result as a WhatsApp message for the owner. */
export function formatAgentResult(command, result) {
  const label = command.payload?.action || command.type;
  if (result.ok) {
    const tail = result.output ? `\n\n${result.output.split('\n').slice(-8).join('\n')}` : '';
    return `Listo, jefe. "${label}" terminó${result.exitCode != null ? ` (código ${result.exitCode})` : ''}.${tail}`;
  }
  return `Jefe, "${label}" falló${result.exitCode != null ? ` (código ${result.exitCode})` : ''}: ${result.error || 'sin detalle'}`;
}
