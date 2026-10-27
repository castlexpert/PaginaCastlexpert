import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';

const KEY_STORAGE = 'cx_owner_voice_key_v1';
const DEVICE_STORAGE = 'cx_owner_voice_device_v1';
const MANIFEST_HREF = '/voz-manifest.webmanifest';

type TurnResult = {
  transcript?: string;
  command?: string;
  answer?: string;
  audio?: string | null;
  mime?: string | null;
  voice?: string | null;
  error?: string;
};

function getOrCreateDeviceId() {
  try {
    const existing = localStorage.getItem(DEVICE_STORAGE);
    if (existing) return existing;
    const id = crypto.randomUUID();
    localStorage.setItem(DEVICE_STORAGE, id);
    return id;
  } catch {
    return 'pwa';
  }
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || '');
      const i = dataUrl.indexOf(',');
      resolve(i >= 0 ? dataUrl.slice(i + 1) : '');
    };
    reader.onerror = () => reject(reader.error || new Error('read failed'));
    reader.readAsDataURL(blob);
  });
}

export default function OwnerVoicePage() {
  const [adminKey, setAdminKey] = useState(() => {
    try {
      return localStorage.getItem(KEY_STORAGE) || '';
    } catch {
      return '';
    }
  });
  const [keyDraft, setKeyDraft] = useState(adminKey);
  const [unlocked, setUnlocked] = useState(Boolean(adminKey));
  const [status, setStatus] = useState('Mantenga pulsado para hablar');
  const [transcript, setTranscript] = useState('');
  const [answer, setAnswer] = useState('');
  const [busy, setBusy] = useState(false);
  const [recording, setRecording] = useState(false);
  const [installHint, setInstallHint] = useState('');

  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pressRef = useRef(false);

  useEffect(() => {
    document.title = 'Penélope | CastleXpert';
    let link = document.querySelector<HTMLLinkElement>('link[rel="manifest"][data-voz]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'manifest';
      link.href = MANIFEST_HREF;
      link.dataset.voz = '1';
      document.head.appendChild(link);
    }
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/voz-sw.js').catch(() => {});
    }
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      // @ts-expect-error iOS
      Boolean(navigator.standalone);
    if (!isStandalone) {
      setInstallHint(
        /Android/i.test(navigator.userAgent)
          ? 'En Android: menú → Instalar app / Añadir a inicio'
          : 'En Windows: menú del navegador → Instalar CastleXpert Penélope'
      );
    }
    return () => {
      document.querySelector('link[rel="manifest"][data-voz]')?.remove();
    };
  }, []);

  const saveKey = () => {
    const k = keyDraft.trim();
    if (!k) return;
    localStorage.setItem(KEY_STORAGE, k);
    setAdminKey(k);
    setUnlocked(true);
    setStatus('Mantenga pulsado para hablar');
  };

  const playAnswerAudio = useCallback(async (mime: string, base64: string) => {
    const src = `data:${mime};base64,${base64}`;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    const audio = new Audio(src);
    audioRef.current = audio;
    await audio.play();
  }, []);

  const sendTurn = useCallback(
    async (blob: Blob) => {
      if (!adminKey) return;
      setBusy(true);
      setStatus('Entendiendo…');
      try {
        const base64 = await blobToBase64(blob);
        const res = await fetch('/api/owner-voice/turn', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-key': adminKey,
          },
          body: JSON.stringify({
            audio: base64,
            mime: blob.type || 'audio/webm',
            deviceId: getOrCreateDeviceId(),
          }),
        });
        const data = (await res.json()) as TurnResult;
        if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
        setTranscript(data.transcript || data.command || '');
        setAnswer(data.answer || '');
        setStatus('Listo');
        if (data.audio && data.mime) {
          await playAnswerAudio(data.mime, data.audio);
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        setStatus(msg);
        setAnswer('');
      } finally {
        setBusy(false);
      }
    },
    [adminKey, playAnswerAudio]
  );

  const stopRecording = useCallback(async () => {
    const rec = mediaRef.current;
    if (!rec || rec.state === 'inactive') {
      setRecording(false);
      return;
    }
    await new Promise<void>((resolve) => {
      rec.onstop = () => resolve();
      try {
        rec.stop();
      } catch {
        resolve();
      }
    });
    setRecording(false);
    mediaRef.current = null;
    const blob = new Blob(chunksRef.current, { type: chunksRef.current[0]?.type || 'audio/webm' });
    chunksRef.current = [];
    if (blob.size < 800) {
      setStatus('Muy corto. Mantenga pulsado e hable.');
      return;
    }
    await sendTurn(blob);
  }, [sendTurn]);

  const startRecording = useCallback(async () => {
    if (busy || recording || !adminKey) return;
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : '';
      const rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (ev) => {
        if (ev.data.size > 0) chunksRef.current.push(ev.data);
      };
      rec.onerror = () => setStatus('Error de micrófono');
      mediaRef.current = rec;
      rec.start(200);
      setRecording(true);
      setStatus('Escuchando… suelte para enviar');
    } catch {
      setStatus('Permita el micrófono en el navegador');
    }
  }, [adminKey, busy, recording]);

  const onPointerDown = async (e: ReactPointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    pressRef.current = true;
    await startRecording();
  };

  const onPointerUp = async (e: ReactPointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!pressRef.current) return;
    pressRef.current = false;
    await stopRecording();
  };

  if (!unlocked) {
    return (
      <main className="voz-shell">
        <div className="voz-card">
          <p className="voz-brand">CastleXpert</p>
          <h1 className="voz-title">Penélope</h1>
          <p className="voz-sub">Asistente de voz del dueño. Pegue la clave de administración una vez.</p>
          <input
            className="voz-input"
            type="password"
            autoComplete="off"
            placeholder="x-admin-key"
            value={keyDraft}
            onChange={(e) => setKeyDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && saveKey()}
          />
          <button type="button" className="voz-btn secondary" onClick={saveKey}>
            Entrar
          </button>
        </div>
        <style>{vozCss}</style>
      </main>
    );
  }

  return (
    <main className="voz-shell">
      <header className="voz-top">
        <div>
          <p className="voz-brand">CastleXpert</p>
          <h1 className="voz-title">Penélope</h1>
        </div>
        <button
          type="button"
          className="voz-link"
          onClick={() => {
            localStorage.removeItem(KEY_STORAGE);
            setAdminKey('');
            setUnlocked(false);
          }}
        >
          Salir
        </button>
      </header>

      <p className="voz-status" aria-live="polite">
        {status}
      </p>

      <button
        type="button"
        className={`voz-mic ${recording ? 'hot' : ''} ${busy ? 'busy' : ''}`}
        disabled={busy && !recording}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onContextMenu={(e) => e.preventDefault()}
      >
        <span>{recording ? 'Soltar' : busy ? '…' : 'Hablar'}</span>
      </button>

      <section className="voz-log" aria-live="polite">
        {transcript ? (
          <p>
            <span>Usted:</span> {transcript}
          </p>
        ) : null}
        {answer ? (
          <p>
            <span>Penélope:</span> {answer}
          </p>
        ) : null}
      </section>

      {installHint ? <p className="voz-hint">{installHint}</p> : null}
      <style>{vozCss}</style>
    </main>
  );
}

const vozCss = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Source+Sans+3:wght@400;600&display=swap');
.voz-shell {
  min-height: 100dvh;
  margin: 0;
  padding: 1.5rem 1.25rem 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  background:
    radial-gradient(120% 80% at 50% -10%, #1a6b52 0%, transparent 55%),
    linear-gradient(165deg, #0a1f18 0%, #102820 40%, #0c1814 100%);
  color: #e8f2ec;
  font-family: 'Source Sans 3', system-ui, sans-serif;
  touch-action: manipulation;
  user-select: none;
}
.voz-top {
  width: min(28rem, 100%);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.voz-brand {
  margin: 0;
  font-size: 0.75rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #8fbfa8;
}
.voz-title {
  margin: 0.15rem 0 0;
  font-family: Fraunces, Georgia, serif;
  font-size: clamp(2rem, 6vw, 2.75rem);
  font-weight: 700;
  letter-spacing: -0.02em;
}
.voz-sub { margin: 0; color: #b7cfc2; line-height: 1.45; max-width: 22rem; text-align: center; }
.voz-card {
  margin: auto;
  width: min(24rem, 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
}
.voz-input {
  width: 100%;
  border: 1px solid #2d5a48;
  border-radius: 0.75rem;
  background: #0d241c;
  color: #e8f2ec;
  padding: 0.85rem 1rem;
  font-size: 1rem;
}
.voz-btn, .voz-mic {
  border: 0;
  cursor: pointer;
  font-family: inherit;
  font-weight: 600;
}
.voz-btn.secondary {
  background: #1f7a5c;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: 999px;
}
.voz-link {
  background: transparent;
  border: 0;
  color: #8fbfa8;
  font-size: 0.9rem;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.voz-status {
  margin: 0.5rem 0 0;
  min-height: 1.5rem;
  color: #c5ddd0;
  text-align: center;
}
.voz-mic {
  width: min(12rem, 46vw);
  height: min(12rem, 46vw);
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #2f9a72, #146348 55%, #0d3d2e);
  color: #fff;
  font-size: 1.15rem;
  letter-spacing: 0.04em;
  box-shadow: 0 18px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.15);
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}
.voz-mic:active, .voz-mic.hot {
  transform: scale(1.04);
  box-shadow: 0 0 0 10px rgba(47, 154, 114, 0.25), 0 18px 40px rgba(0,0,0,0.35);
}
.voz-mic.busy:not(.hot) { opacity: 0.7; }
.voz-log {
  width: min(28rem, 100%);
  min-height: 4.5rem;
  color: #d5e8dd;
  font-size: 1rem;
  line-height: 1.45;
}
.voz-log span { color: #8fbfa8; font-weight: 600; }
.voz-hint {
  margin-top: auto;
  font-size: 0.85rem;
  color: #7fa894;
  text-align: center;
  max-width: 22rem;
}
`;
