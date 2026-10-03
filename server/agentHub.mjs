import crypto from 'node:crypto';
import { WebSocketServer } from 'ws';

export const AGENT_WS_PATH = '/api/agent/ws';
const COMMAND_TTL_MS = 10 * 60 * 1000;
const PING_INTERVAL_MS = 30 * 1000;

/** @type {Map<string, import('ws').WebSocket>} agentId -> socket */
const sockets = new Map();
let resultListener = null;
let getDb = null;

function hashToken(token) {
  return crypto.createHash('sha256').update(String(token)).digest('hex');
}

export async function ensureAgentSchema(pool) {
  await pool.query(`
    create table if not exists pc_agents (
      id uuid primary key default gen_random_uuid(),
      name text not null unique,
      token_hash text not null unique,
      actions jsonb not null default '[]'::jsonb,
      version text,
      last_seen_at timestamptz,
      created_at timestamptz not null default now()
    );
  `);

  await pool.query(`
    create table if not exists pc_commands (
      id uuid primary key default gen_random_uuid(),
      agent_id uuid not null references pc_agents(id) on delete cascade,
      type text not null,
      payload jsonb not null default '{}'::jsonb,
      status text not null default 'queued',
      result jsonb,
      source text not null default 'admin',
      notify_jid text,
      created_at timestamptz not null default now(),
      sent_at timestamptz,
      done_at timestamptz,
      expires_at timestamptz not null
    );
    create index if not exists pc_commands_agent_status_idx on pc_commands (agent_id, status, created_at);
  `);
}

/** Called with (command row, result payload) whenever an agent reports a result. */
export function setAgentResultListener(fn) {
  resultListener = fn;
}

export function isAgentOnline(agentId) {
  const ws = sockets.get(String(agentId));
  return Boolean(ws && ws.readyState === ws.OPEN);
}

export async function listAgents(pool) {
  const { rows } = await pool.query(
    `select id, name, actions, version, last_seen_at, created_at
     from pc_agents
     order by created_at asc`
  );
  return rows.map((r) => ({ ...r, online: isAgentOnline(r.id) }));
}

export async function createAgent(pool, name) {
  const cleanName = String(name || '').trim().slice(0, 60);
  if (!cleanName) throw new Error('Nombre del dispositivo requerido.');
  const token = crypto.randomBytes(32).toString('hex');
  const { rows } = await pool.query(
    `insert into pc_agents (name, token_hash) values ($1, $2) returning id, name, created_at`,
    [cleanName, hashToken(token)]
  );
  return { agent: rows[0], token };
}

export async function deleteAgent(pool, id) {
  const ws = sockets.get(String(id));
  if (ws) ws.close(4001, 'agent deleted');
  sockets.delete(String(id));
  await pool.query(`delete from pc_agents where id = $1`, [id]);
}

export async function listRecentCommands(pool, limit = 30) {
  const { rows } = await pool.query(
    `select c.id, c.type, c.payload, c.status, c.result, c.source, c.created_at, c.done_at, a.name as agent_name
     from pc_commands c
     join pc_agents a on a.id = c.agent_id
     order by c.created_at desc
     limit $1`,
    [Math.min(Math.max(Number(limit) || 30, 1), 100)]
  );
  return rows;
}

/** Picks an agent by name (case-insensitive) or the most recently seen one. */
async function resolveAgent(pool, agentRef) {
  const agents = await listAgents(pool);
  if (!agents.length) return null;
  if (agentRef) {
    const ref = String(agentRef).trim().toLowerCase();
    return agents.find((a) => a.id === agentRef || a.name.toLowerCase() === ref) || null;
  }
  const online = agents.filter((a) => a.online);
  const pool2 = online.length ? online : agents;
  return pool2.sort((a, b) => new Date(b.last_seen_at || 0) - new Date(a.last_seen_at || 0))[0];
}

export async function findAgentAction(pool, actionId, agentRef) {
  const agent = await resolveAgent(pool, agentRef);
  if (!agent) return { agent: null, action: null };
  const actions = Array.isArray(agent.actions) ? agent.actions : [];
  const action = actions.find((a) => a.id === actionId) || null;
  return { agent, action };
}

function sendToSocket(ws, row) {
  ws.send(JSON.stringify({ id: row.id, type: row.type, ...(row.payload || {}) }));
}

/**
 * Queues a command for an agent and sends it right away if the agent is online.
 * @returns {Promise<{ id: string, agent: { id: string, name: string }, online: boolean }>}
 */
export async function queueAgentCommand(pool, { agent: agentRef, type, payload = {}, source = 'admin', notifyJid = null }) {
  const agent = await resolveAgent(pool, agentRef);
  if (!agent) {
    const err = new Error(agentRef ? `No existe el dispositivo "${agentRef}".` : 'No hay dispositivos registrados.');
    err.code = 'NO_AGENT';
    throw err;
  }

  const expiresAt = new Date(Date.now() + COMMAND_TTL_MS).toISOString();
  const { rows } = await pool.query(
    `insert into pc_commands (agent_id, type, payload, source, notify_jid, expires_at)
     values ($1, $2, $3, $4, $5, $6)
     returning id, type, payload`,
    [agent.id, type, JSON.stringify(payload), source, notifyJid, expiresAt]
  );
  const row = rows[0];

  const ws = sockets.get(String(agent.id));
  const online = Boolean(ws && ws.readyState === ws.OPEN);
  if (online) {
    sendToSocket(ws, row);
    await pool.query(`update pc_commands set status = 'sent', sent_at = now() where id = $1`, [row.id]);
  }

  return { id: row.id, agent: { id: agent.id, name: agent.name }, online };
}

async function flushQueued(pool, agentId, ws) {
  await pool.query(
    `update pc_commands set status = 'expired'
     where agent_id = $1 and status = 'queued' and expires_at <= now()`,
    [agentId]
  );
  const { rows } = await pool.query(
    `select id, type, payload from pc_commands
     where agent_id = $1 and status = 'queued'
     order by created_at asc`,
    [agentId]
  );
  for (const row of rows) {
    sendToSocket(ws, row);
    // eslint-disable-next-line no-await-in-loop
    await pool.query(`update pc_commands set status = 'sent', sent_at = now() where id = $1`, [row.id]);
  }
}

async function handleAgentMessage(agentId, ws, raw) {
  let msg;
  try {
    msg = JSON.parse(String(raw));
  } catch {
    return;
  }
  const pool = await getDb();

  if (msg.type === 'hello') {
    const actions = Array.isArray(msg.actions)
      ? msg.actions
          .filter((a) => a && typeof a.id === 'string')
          .map((a) => ({
            id: String(a.id).slice(0, 60),
            type: String(a.type || 'run').slice(0, 20),
            description: String(a.description || '').slice(0, 200),
            confirm: Boolean(a.confirm),
          }))
          .slice(0, 100)
      : [];
    await pool.query(
      `update pc_agents set actions = $2, version = $3, last_seen_at = now() where id = $1`,
      [agentId, JSON.stringify(actions), String(msg.version || '').slice(0, 30)]
    );
    await flushQueued(pool, agentId, ws);
    return;
  }

  if (msg.type === 'heartbeat') {
    await pool.query(`update pc_agents set last_seen_at = now() where id = $1`, [agentId]);
    return;
  }

  if (msg.type === 'result' && msg.id) {
    const ok = Boolean(msg.ok);
    const result = {
      ok,
      exitCode: msg.exitCode ?? null,
      output: typeof msg.output === 'string' ? msg.output.slice(-2000) : null,
      error: typeof msg.error === 'string' ? msg.error.slice(0, 500) : null,
    };
    const { rows } = await pool.query(
      `update pc_commands set status = $3, result = $4, done_at = now()
       where id = $1 and agent_id = $2
       returning id, type, payload, source, notify_jid`,
      [msg.id, agentId, ok ? 'done' : 'error', JSON.stringify(result)]
    );
    if (rows[0] && resultListener) {
      try {
        await resultListener(rows[0], result);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('[agent] result listener failed:', e?.message || e);
      }
    }
  }
}

function extractToken(req) {
  const auth = String(req.headers.authorization || '');
  const m = auth.match(/^Bearer\s+(.+)$/i);
  if (m) return m[1].trim();
  return String(req.headers['x-agent-token'] || '').trim();
}

export function attachAgentHub(server, getDbFn) {
  getDb = getDbFn;
  const wss = new WebSocketServer({ noServer: true, maxPayload: 64 * 1024 });

  server.on('upgrade', async (req, socket, head) => {
    let pathname = '';
    try {
      pathname = new URL(req.url, 'http://localhost').pathname;
    } catch {
      pathname = '';
    }
    if (pathname !== AGENT_WS_PATH) {
      socket.destroy();
      return;
    }

    try {
      const token = extractToken(req);
      if (!token) throw new Error('missing token');
      const pool = await getDb();
      const { rows } = await pool.query(`select id, name from pc_agents where token_hash = $1`, [hashToken(token)]);
      const agent = rows[0];
      if (!agent) throw new Error('invalid token');

      wss.handleUpgrade(req, socket, head, (ws) => {
        const agentId = String(agent.id);
        const previous = sockets.get(agentId);
        if (previous && previous !== ws) previous.close(4000, 'replaced by new connection');
        sockets.set(agentId, ws);
        ws.isAlive = true;
        // eslint-disable-next-line no-console
        console.log(`[agent] connected: ${agent.name}`);

        ws.on('pong', () => {
          ws.isAlive = true;
        });
        ws.on('message', (data) => {
          handleAgentMessage(agentId, ws, data).catch((e) => {
            // eslint-disable-next-line no-console
            console.warn('[agent] message error:', e?.message || e);
          });
        });
        ws.on('close', () => {
          if (sockets.get(agentId) === ws) sockets.delete(agentId);
          // eslint-disable-next-line no-console
          console.log(`[agent] disconnected: ${agent.name}`);
        });
        ws.on('error', () => {});
      });
    } catch {
      socket.write('HTTP/1.1 401 Unauthorized\r\nConnection: close\r\n\r\n');
      socket.destroy();
    }
  });

  setInterval(() => {
    for (const [agentId, ws] of sockets) {
      if (!ws.isAlive) {
        ws.terminate();
        sockets.delete(agentId);
        continue;
      }
      ws.isAlive = false;
      try {
        ws.ping();
      } catch {
        // ignore
      }
    }
  }, PING_INTERVAL_MS).unref();
}
