import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, StatusBar, TabBar } from '../../components/Chrome';
import { Img } from '../../components/Img';
import { HELP_ARTICLES, HELP_TOPICS } from '../../data/seed';
import type { HelpArticle } from '../../data/types';
import './C30HelpSupport.css';

/** Topic disc icons as drawn in the handoff, keyed by HelpTopic id. */
const TOPIC_ICONS: Record<string, ReactNode> = {
  orders: <svg width="34" height="34" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M11 1 2 6v10l9 5 9-5V6l-9-5Z" /><path d="M2 6l9 5 9-5M11 11v10" /></svg>,
  returns: <svg width="34" height="34" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M4 8h10a5 5 0 0 1 0 10H8" /><path d="M8 3 3 8l5 5" /></svg>,
  payments: <svg width="34" height="34" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="1" y="4" width="20" height="14" rx="3" /><path d="M1 9h20M5 14h4" /></svg>,
  account: <svg width="34" height="34" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.3"><circle cx="11" cy="7" r="4" /><path d="M3.5 19a7.5 7.5 0 0 1 15 0" /></svg>,
  membership: <svg width="34" height="34" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M4 4h14l3 5-10 10L1 9l3-5Z" /><path d="M1 9h20M8 4l3 5 3-5" /></svg>,
  products: <svg width="34" height="34" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.3"><circle cx="11" cy="11" r="10" /><path d="M8 8a3 3 0 0 1 5.8 1c0 2-3 2.3-3 4" /><path d="M11 17h.01" /></svg>,
};
const ARROW = <svg className="topic-card__arrow" width="28" height="17" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M0 5h14M10 1l4 4-4 4" /></svg>;
const CHEVRON = <svg className="list-row__chevron" width="18" height="30" viewBox="0 0 12 20" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="m2 1 9 9-9 9" /></svg>;
const DOC = <svg width="28" height="30" viewBox="0 0 18 20" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M2 1h9l6 6v12H2V1Z" /><path d="M11 1v6h6M5 11h8M5 15h6" /></svg>;

/** Compact 764 x 51 article row that expands to its answer. */
function ArticleRow({ a, open, onToggle }: { a: HelpArticle; open: boolean; onToggle: () => void }) {
  return (
    <div className="article">
      <button type="button" className={`list-row list-row--article ${open ? 'list-row--open' : ''}`} aria-expanded={open} onClick={onToggle}>
        <span className="list-row__icon">{DOC}</span>
        <span className="list-row__body"><span className="list-row__label">{a.q}</span></span>
        {CHEVRON}
      </button>
      {open && <p className="article__answer">{a.a}</p>}
    </div>
  );
}

/**
 * C30 Help & Support — port of rsn-one-html/C30-HelpSupport.html. Photographic
 * header, a live search that filters topics and articles, a 3x2 topic grid whose
 * cards open an inline article list, the "Still need help?" banner, contact rows
 * and the Help Articles list.
 */
export default function C30HelpSupport() {
  const [q, setQ] = useState('');
  const [topic, setTopic] = useState<string | null>(null);
  const [openArticle, setOpenArticle] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const s = q.trim().toLowerCase();
  const hit = (...text: string[]) => !s || text.some(t => t.toLowerCase().includes(s));
  const topics = HELP_TOPICS.filter(t => hit(t.title, t.blurb));
  const matched = HELP_ARTICLES.filter(a => hit(a.q, a.a));
  const articles = s || showAll ? matched : matched.slice(0, 2);
  const openTopic = topic ? HELP_TOPICS.find(t => t.id === topic) : undefined;
  const topicArticles = topic ? HELP_ARTICLES.filter(a => a.topic === topic) : [];
  const nothing = s && topics.length === 0 && matched.length === 0;

  const toggleArticle = (id: string) => setOpenArticle(openArticle === id ? null : id);

  return (
    <div className="screen c30">
      {/* HEADER PHOTO — 853 x 445 behind the status bar, app bar and title block.
          ASSUMPTION (handoff): 445px inferred from where the last visible detail stops. */}
      <div className="help-hero">
        <Img className="help-hero__media" slot="hero-help-support-01" alt="" width={853} height={445} />
        <div className="help-hero__scrim" />
      </div>

      <StatusBar />

      {/* app bar — back arrow + logo only, no search or bag */}
      <AppBar back />

      {/* TITLE BLOCK — 67px serif title, italic pull-line, 2-line body */}
      <div className="help-head">
        <h1 className="t-h1 help-head__title">Help & Support</h1>
        <p className="help-head__voice">We’re here for <em>you.</em></p>
        <p className="help-head__body">Get support, find answers or reach out{' '}<br />to our team.</p>
      </div>

      {/* search field — filters the topic grid and the article list live */}
      <form className="field field--search" role="search" onSubmit={e => e.preventDefault()}>
        <svg width="30" height="31" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="11" cy="11" r="7" /><path d="m16.5 16.5 4 4" /></svg>
        <input className="field__input" type="search" placeholder="Search for help, topics or keywords..." aria-label="Search for help, topics or keywords"
          value={q} onChange={e => setQ(e.target.value)} />
        {q && (
          <button type="button" className="field__clear" aria-label="Clear search" onClick={() => setQ('')}>
            <svg width="18" height="18" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M2 2l10 10M12 2 2 12" /></svg>
          </button>
        )}
      </form>

      {nothing && <p className="help-empty">No results for “{q.trim()}”. Try another word, or chat with us below.</p>}

      {/* "Popular Topics" — 3 x 2 grid; a tapped card opens its articles under the grid */}
      {topics.length > 0 && (
        <section className="help-section">
          <h2 className="t-section">Popular Topics</h2>
          <div className="topic-grid">
            {topics.map(t => (
              <button key={t.id} type="button" className={`topic-card ${topic === t.id ? 'topic-card--open' : ''}`}
                aria-expanded={topic === t.id} onClick={() => setTopic(topic === t.id ? null : t.id)}>
                <span className="topic-card__disc">{TOPIC_ICONS[t.id]}</span>
                <h3 className="topic-card__title">{t.title}</h3>
                <p className="topic-card__text">{t.blurb}</p>
                {ARROW}
              </button>
            ))}
          </div>

          {openTopic && (
            <div className="topic-panel" aria-live="polite">
              <div className="topic-panel__head">
                <h3 className="topic-panel__title">{openTopic.title}</h3>
                <button type="button" className="topic-panel__close" onClick={() => setTopic(null)}>Close</button>
              </div>
              {topicArticles.length
                ? topicArticles.map(a => <ArticleRow key={a.id} a={a} open={openArticle === a.id} onToggle={() => toggleArticle(a.id)} />)
                : <p className="topic-panel__empty">No articles for this topic yet — chat with us below and we’ll help.</p>}
            </div>
          )}
        </section>
      )}

      {/* "STILL NEED HELP?" BANNER — pale tile with the CHAT WITH US button */}
      <section className="help-banner">
        <Img className="help-banner__media" slot="promo-quiet-table-01" alt="" width={764} height={188} />
        <div className="help-banner__scrim" />
        <div className="help-banner__body">
          <h2 className="help-banner__title">Still need help?</h2>
          <p className="help-banner__text">Our support team is here for you.</p>
          <Link className="btn btn--primary help-banner__cta" to="/concierge">
            <svg width="30" height="30" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M2 4h16v11H8l-6 4V4Z" /><path d="M6.5 9.5h.01M10 9.5h.01M13.5 9.5h.01" /></svg>
            <span className="t-eyebrow">Chat with us</span>
          </Link>
        </div>
      </section>

      {/* CONTACT ROWS — mailto / tel */}
      <div className="help-section help-contacts">
        <a className="list-row list-row--contact" href="mailto:support@rsnone.com">
          <span className="list-row__icon"><svg width="40" height="32" viewBox="0 0 24 19" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="1" y="1" width="22" height="17" rx="3" /><path d="m1.5 3 10.5 8L22.5 3" /></svg></span>
          <span className="list-row__body">
            <span className="list-row__label">Email Us</span>
            <span className="list-row__sub">support@rsnone.com</span>
          </span>
          {CHEVRON}
        </a>
        <a className="list-row list-row--contact" href="tel:+9779801234567">
          <span className="list-row__icon"><svg width="38" height="38" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M3 3h4l2 5-2.5 1.5a12 12 0 0 0 6 6L14 13l5 2v4a2 2 0 0 1-2.2 2A17 17 0 0 1 1 5.2 2 2 0 0 1 3 3Z" /></svg></span>
          <span className="list-row__body">
            <span className="list-row__label">Call Us</span>
            <span className="list-row__sub">+977 98012 34567</span>
          </span>
          {CHEVRON}
        </a>
      </div>

      {/* "Help Articles" — heading + "View all" toggle, then compact expandable rows.
          DEVIATION-RISK (handoff): only two are drawn; the list is longer. */}
      <section className="help-articles">
        <div className="help-articles__head">
          <h2 className="t-section">Help Articles</h2>
          {!s && matched.length > 2 && (
            <button type="button" className="help-articles__link" aria-expanded={showAll} onClick={() => setShowAll(v => !v)}>
              {showAll ? 'Show less' : 'View all'}
              <svg width="26" height="16" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M0 5h14M10 1l4 4-4 4" /></svg>
            </button>
          )}
        </div>
        {articles.map(a => <ArticleRow key={a.id} a={a} open={openArticle === a.id} onToggle={() => toggleArticle(a.id)} />)}
        {articles.length === 0 && <p className="topic-panel__empty">No articles match your search.</p>}
      </section>

      <TabBar active="me" />
    </div>
  );
}
