import { takeDueReminders, markReminderSent } from './ownerStore.mjs';
import { getWhatsAppConfig } from './whatsappConfig.mjs';

const TICK_MS = 30 * 1000;
let running = false;

/**
 * Sends due owner reminders over WhatsApp. A reminder stays pending until the send succeeds,
 * so reminders that come due while WhatsApp is disconnected go out after it reconnects.
 */
export function startOwnerReminders({ getDb, sendText, isConnected }) {
  const tick = async () => {
    if (running || !isConnected()) return;
    running = true;
    try {
      const db = await getDb();
      const cfg = await getWhatsAppConfig(db);
      if (!cfg.owner_phone) return;
      const due = await takeDueReminders(db);
      for (const r of due) {
        try {
          // eslint-disable-next-line no-await-in-loop
          await sendText(cfg.owner_phone, `Jefe, recordatorio: ${r.message}`);
          // eslint-disable-next-line no-await-in-loop
          await markReminderSent(db, r.id);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn('[owner] reminder send failed:', e?.message || e);
          break;
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[owner] reminder tick failed:', e?.message || e);
    } finally {
      running = false;
    }
  };

  setInterval(() => {
    tick();
  }, TICK_MS).unref();
}
