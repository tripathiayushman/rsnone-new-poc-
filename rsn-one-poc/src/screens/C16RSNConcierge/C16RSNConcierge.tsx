import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HomeIndicator, StatusBar } from '../../components/Chrome';
import { productById } from '../../data/catalogue';
import { CONCIERGE_PROMPTS, conciergeReply } from '../../data/seed';
import { inr } from '../../lib/money';
import { priceFor, useStore } from '../../store/useStore';
import './C16RSNConcierge.css';

interface Msg { id: number; role: 'user' | 'concierge'; text: string; productIds?: string[] }

/** The three suggestion-card icons from the handoff, keyed by CONCIERGE_PROMPTS id. */
const PROMPT_ICONS: Record<string, ReactNode> = {
  home: <svg width="58" height="58" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M15 3a10 10 0 0 1 10 10c0 6-6 11-10 14C11 24 5 19 5 13A10 10 0 0 1 15 3Z" /><circle cx="15" cy="12" r="3" /><path d="M15 15v4" /></svg>,
  gift: <svg width="58" height="58" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="4" y="14" width="10" height="13" rx="1.5" /><rect x="16" y="14" width="10" height="13" rx="1.5" /><path d="m8 11 1.6-3.4L13 6l-3.4-1.6L8 1 6.4 4.4 3 6l3.4 1.6L8 11Z" /><path d="m21 12 .9-2 2-.9-2-.9-.9-2-.9 2-2 .9 2 .9.9 2Z" /></svg>,
  nepal: <svg width="58" height="58" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M6 10h18l-1 16H7L6 10Z" /><path d="M11 10V7a4 4 0 0 1 8 0v3" /><path d="M15 14a3 3 0 0 1 3 3c0 2-3 5-3 5s-3-3-3-5a3 3 0 0 1 3-3Z" /></svg>,
};
/** The mock hard-breaks two of the three labels; keep those breaks on the cards. */
const PROMPT_BREAKS: Record<string, ReactNode> = {
  home: <>Find something special<br />for my home</>,
  nepal: <>Find something<br />from Nepal</>,
};

/**
 * C16 RSN Concierge — port of rsn-one-html/C16-RSNConcierge.html. The three cards
 * pre-fill the request; Send Request appends the message to a local thread and the
 * concierge answers (conciergeReply in src/data/seed.ts) with a rail of suggested objects.
 */
export default function C16RSNConcierge() {
  const navigate = useNavigate();
  const isMember = useStore(s => s.isMember);
  const [text, setText] = useState('');
  const [thread, setThread] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const replyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const fieldRef = useRef<HTMLTextAreaElement>(null);
  const seq = useRef(0);

  useEffect(() => () => clearTimeout(replyTimer.current), []);

  const send = (e: FormEvent) => {
    e.preventDefault();
    const q = text.trim();
    if (!q) return;
    setThread(t => [...t, { id: ++seq.current, role: 'user', text: q }]);
    setText('');
    setTyping(true);
    clearTimeout(replyTimer.current);
    replyTimer.current = setTimeout(() => {
      const r = conciergeReply(q);
      setThread(t => [...t, { id: ++seq.current, role: 'concierge', text: r.text, productIds: r.productIds }]);
      setTyping(false);
    }, 600);
  };

  const pick = (label: string) => { setText(label); fieldRef.current?.focus(); };

  return (
    <div className="screen c16">
      <StatusBar />

      {/* nav bar — back arrow only, measured 43-91 x, 118-152 y */}
      <header className="navbar">
        <button className="navbar__back" aria-label="Back" onClick={() => navigate(-1)}>
          <svg width="48" height="36" viewBox="0 0 24 18" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M23 9H1M8 2 1 9l7 7" /></svg>
        </button>
      </header>

      {/* CONCIERGE FORM — title, subtitle, three suggestion cards, free-text box,
          submit. The three cards are shortcuts that pre-fill the request. */}
      <form className="concierge" onSubmit={send}>
        <h1 className="concierge__title">RSN Concierge</h1>
        <p className="concierge__sub">Tell us what you’re looking for.</p>

        {/* suggestion cards — .suggest-card, 771x232, 30px apart */}
        <div className="suggest-list">
          {CONCIERGE_PROMPTS.map(p => (
            <button key={p.id} className="suggest-card" type="button" onClick={() => pick(p.label)}>
              <span className="suggest-card__disc">{PROMPT_ICONS[p.id]}</span>
              <span className="suggest-card__label">{PROMPT_BREAKS[p.id] ?? p.label}</span>
            </button>
          ))}
        </div>

        {/* POC: the request / reply thread, hidden until the first request is sent */}
        {thread.length > 0 && (
          <div className="thread" role="log" aria-live="polite">
            {thread.map(m => (
              <div key={m.id} className={`msg msg--${m.role}`}>
                {m.role === 'concierge' && <span className="msg__who t-eyebrow">RSN Concierge</span>}
                {m.text}
                {m.productIds && (
                  <div className="msg__picks">
                    {m.productIds.map(id => {
                      const p = productById(id);
                      if (!p) return null;
                      return (
                        <Link key={id} className="pick" to={`/product/${id}`}>
                          <span>{p.name}</span>
                          <span className="pick__price">{inr(priceFor(p, isMember))}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
            {typing && <div className="msg msg--concierge msg--typing" aria-label="Concierge is typing"><i /><i /><i /></div>}
          </div>
        )}

        {/* free-text request, 771x188 outlined box */}
        <textarea ref={fieldRef} className="concierge__field" id="concierge-request" rows={1}
          aria-label="What are you looking for?"
          placeholder="What are you looking for?"
          value={text} onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); e.currentTarget.form?.requestSubmit(); } }} />

        {/* submit — full-width rose button, 771x128 */}
        <button className="btn btn--primary btn--block concierge__send" type="submit" disabled={!text.trim()}>
          <span className="t-eyebrow">Send Request</span>
        </button>
      </form>

      <HomeIndicator />
    </div>
  );
}
