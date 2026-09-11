import { useEffect, useRef, useState } from 'react';
import { Logo } from './Img';
import './Tara.css';

/**
 * Tara — the RSN One house concierge. A floating "Ask Tara" pill on the home
 * screen opens a chat sheet. This is a POC: Tara greets, offers a few prompts,
 * and replies to anything with a short "preview only" note. No real model.
 */
const WELCOME =
  "Welcome to RSN ONE. I'm Tara, the house concierge. Ask me about the membership, the curation, sourcing, or the brand register.";
const POC_REPLY =
  "This is a preview build, so I'm a demo concierge for now — I can't answer that for real yet. In the full RSN One, I'd help you with membership, the curation, sourcing and the brand register.";
const SUGGESTIONS = [
  'How does membership work?',
  "What's in the curation?",
  'Brand partnerships?',
  'How do referrals work?',
];

type Msg = { from: 'tara' | 'you'; text: string };
type Pos = { x: number; y: number };

export function Tara({ pos, collapsed, onMove, onCollapse, onRemove }: {
  pos: Pos | null;
  collapsed: boolean;
  onMove: (p: Pos) => void;
  onCollapse: () => void;
  onRemove: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const bodyRef = useRef<HTMLDivElement>(null);

  // --- drag-and-drop for the floating pill ---
  const wrapRef = useRef<HTMLDivElement>(null);
  const zoneRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ startX: 0, startY: 0, offX: 0, offY: 0, moved: false });
  const [dragPos, setDragPos] = useState<Pos | null>(null);
  const [dragging, setDragging] = useState(false);
  const [overZone, setOverZone] = useState(false);

  // keep the latest message in view
  useEffect(() => { bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' }); }, [msgs]);
  // close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setMsgs(m => [...m, { from: 'you', text: t }, { from: 'tara', text: POC_REPLY }]);
    setInput('');
  };

  const clamp = (x: number, y: number, w: number, h: number): Pos => ({
    x: Math.max(8, Math.min(x, window.innerWidth - w - 8)),
    y: Math.max(8, Math.min(y, window.innerHeight - h - 8)),
  });
  const onPointerDown = (e: React.PointerEvent) => {
    if (open) return;
    const el = wrapRef.current!; const r = el.getBoundingClientRect();
    drag.current = { startX: e.clientX, startY: e.clientY, offX: e.clientX - r.left, offY: e.clientY - r.top, moved: false };
    el.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const el = wrapRef.current!;
    if (!el.hasPointerCapture(e.pointerId)) return;
    const dx = e.clientX - drag.current.startX, dy = e.clientY - drag.current.startY;
    if (!drag.current.moved && Math.hypot(dx, dy) > 6) { drag.current.moved = true; setDragging(true); }
    if (drag.current.moved) {
      const r = el.getBoundingClientRect();
      setDragPos(clamp(e.clientX - drag.current.offX, e.clientY - drag.current.offY, r.width, r.height));
      const z = zoneRef.current?.getBoundingClientRect();
      setOverZone(!!z && e.clientX >= z.left && e.clientX <= z.right && e.clientY >= z.top && e.clientY <= z.bottom);
    }
  };
  const onPointerUp = (e: React.PointerEvent) => {
    try { wrapRef.current?.releasePointerCapture(e.pointerId); } catch { /* ignore */ }
    if (drag.current.moved) {
      if (overZone) onRemove();
      else if (dragPos) onMove(dragPos);
    } else {
      setOpen(true); // a tap (no drag) opens the chat
    }
    drag.current.moved = false;
    setDragging(false); setDragPos(null); setOverZone(false);
  };

  const active = dragPos ?? pos;
  const wrapStyle = active ? { left: active.x, top: active.y, right: 'auto', bottom: 'auto' } as const : undefined;

  return (
    <>
      {!open && (
        <div ref={wrapRef} className={`tara-fab-wrap${dragging ? ' is-dragging' : ''}${collapsed ? ' is-collapsed' : ''}`} style={wrapStyle}
          role="button" tabIndex={0} aria-label="Ask Tara, the house concierge — drag to move, tap to open"
          onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(true); } }}>
          {collapsed ? (
            <span className="tara-bubble"><span className="tara-mark tara-mark--bubble"><Logo width={44} height={22} /></span></span>
          ) : (
            <>
              <div className="tara-fab">
                <span className="tara-mark"><Logo width={40} height={20} /></span>
                <span className="tara-fab__text">
                  <span className="tara-fab__title">Ask Tara</span>
                  <span className="tara-fab__sub"><span className="tara-fab__dot" />House Concierge</span>
                </span>
              </div>
              <button className="tara-fab__x" type="button" aria-label="Minimise Tara to a bubble"
                onPointerDown={e => e.stopPropagation()} onClick={onCollapse}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M2 2l8 8M10 2 2 10" /></svg>
              </button>
            </>
          )}
        </div>
      )}

      {dragging && (
        <div ref={zoneRef} className={`tara-zone${overZone ? ' is-over' : ''}`} aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13h10l1-13" /></svg>
          <span>{overZone ? 'Release to remove' : 'Drop here to remove'}</span>
        </div>
      )}

      {open && (
        <div className="tara-sheet" role="dialog" aria-modal="true" aria-label="Tara, house concierge">
          <header className="tara-head">
            <span className="tara-mark tara-mark--head"><Logo width={44} height={22} /></span>
            <span className="tara-head__id">
              <span className="tara-head__name">Tara</span>
              <span className="tara-head__role">House Concierge</span>
            </span>
            <button className="tara-head__close" onClick={() => setOpen(false)} aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 4l12 12M16 4 4 16" /></svg>
            </button>
          </header>

          <div className="tara-body" ref={bodyRef}>
            <div className="tara-msg tara-msg--tara">{WELCOME}</div>
            {msgs.map((m, i) => (
              <div key={i} className={`tara-msg tara-msg--${m.from}`}>{m.text}</div>
            ))}
          </div>

          {msgs.length === 0 && (
            <div className="tara-try">
              <span className="tara-try__label">Try</span>
              <div className="tara-try__grid">
                {SUGGESTIONS.map(s => (
                  <button key={s} className="tara-chip" onClick={() => send(s)}>{s}</button>
                ))}
              </div>
            </div>
          )}

          <form className="tara-input" onSubmit={e => { e.preventDefault(); send(input); }}>
            <input
              className="tara-input__field"
              placeholder="Ask about membership, the curation, partnerships…"
              value={input}
              onChange={e => setInput(e.target.value)}
              aria-label="Message Tara"
            />
            <button className="tara-input__send" type="submit" aria-label="Send message" disabled={!input.trim()}>
              <svg width="20" height="20" viewBox="0 0 22 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M1 8h19M14 2l6 6-6 6" /></svg>
            </button>
          </form>

          <button className="tara-speak" type="button" onClick={() => send('I would like to speak to a person.')}>
            Speak to a person
          </button>
        </div>
      )}
    </>
  );
}
