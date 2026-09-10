import { useState, type FormEvent, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { HomeIndicator, StatusBar } from '../../components/Chrome';
import { TRENDING_SEARCHES } from '../../data/catalogue';
import { useStore } from '../../store/useStore';
import './C05Search.css';

/**
 * C05 Search — port of rsn-one-html/C05-Search.html (empty / pre-query state).
 * Submitting (Enter or the magnifier) records the query and opens C06 results.
 */

/* Row glyphs, transcribed from the handoff in mock order.
   DEVIATION-RISK (handoff): the leading icons do not match the entries — the
   mock mixes a tag, two person glyphs and a clock. Cycled by index here. */
const RECENT_GLYPHS: ReactNode[] = [
  <svg key="tag" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"><path d="M12.6 3H20a1 1 0 0 1 1 1v7.4a2 2 0 0 1-.6 1.4l-7.6 7.6a2 2 0 0 1-2.8 0l-6-6a2 2 0 0 1 0-2.8l7.6-7.6A2 2 0 0 1 12.6 3Z" /><circle cx="16.5" cy="7.5" r="1.4" /></svg>,
  <svg key="person" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="12" cy="8" r="4" /><path d="M4.8 20.5a7.2 7.2 0 0 1 14.4 0" /></svg>,
  <svg key="person2" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="12" cy="8" r="4" /><path d="M4.8 20.5a7.2 7.2 0 0 1 14.4 0" /></svg>,
  <svg key="clock" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5.2l3.4 2" /></svg>,
];
const TRENDING_GLYPHS: ReactNode[] = [
  <svg key="bag" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6.4a3 3 0 0 1 6 0V8" /></svg>,
  <svg key="case" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"><rect x="5" y="8" width="14" height="12" rx="2" /><path d="M9 8V6.4a3 3 0 0 1 6 0V8" /><path d="M10 14h4" /></svg>,
  <svg key="magnifier" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="11" cy="11" r="7" /><path d="m16.5 16.5 4.5 4.5" /></svg>,
  <svg key="lotus" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="4" /><path d="M12 16c-2.2 0-3.6-1.5-3.6-3.6 1.4 0 2.5.5 3.6 1.8 1.1-1.3 2.2-1.8 3.6-1.8 0 2.1-1.4 3.6-3.6 3.6Z" /><path d="M12 14V8.4" /></svg>,
];

export default function C05Search() {
  const navigate = useNavigate();
  const recent = useStore(s => s.recentSearches);
  const pushRecentSearch = useStore(s => s.pushRecentSearch);
  const [q, setQ] = useState('');

  const go = (query: string) => {
    const s = query.trim();
    if (!s) return;
    pushRecentSearch(s);
    navigate(`/search/results?q=${encodeURIComponent(s)}`);
  };
  const onSubmit = (e: FormEvent) => { e.preventDefault(); go(q); };

  return (
    <div className="screen c05">
      <StatusBar />

      {/* BACK BAR — a bare back arrow in rose-pale, no title, no right action */}
      <nav className="search-nav">
        <button className="search-nav__back" type="button" aria-label="Back" onClick={() => navigate(-1)}>
          <svg width="42" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12H4" /><path d="m10 6-6 6 6 6" /></svg>
        </button>
      </nav>

      {/* SEARCH FIELD — 760 x 136 pill; magnifier submits, Enter submits */}
      <form className="search-field" role="search" onSubmit={onSubmit}>
        <button className="search-field__icon" type="submit" aria-label="Search">
          <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><circle cx="11" cy="11" r="7" /><path d="m16.5 16.5 4.5 4.5" /></svg>
        </button>
        <label className="search-field__label" htmlFor="q" hidden>Search</label>
        <input className="search-field__input" id="q" type="search" name="q" autoFocus autoComplete="off"
          placeholder="Search houses, objects, rituals..." value={q} onChange={e => setQ(e.target.value)} />
      </form>

      {/* "Recent Searches" — from the store; each row re-runs that query */}
      {recent.length > 0 && (
        <>
          <h2 className="search-heading search-heading--recent">Recent Searches</h2>
          <ul className="search-list search-list--recent">
            {recent.map((r, i) => (
              <li key={r}>
                <button className="search-row" type="button" onClick={() => go(r)}>
                  <span className="search-row__badge" aria-hidden="true">{RECENT_GLYPHS[i % RECENT_GLYPHS.length]}</span>
                  <span className="search-row__label">{r}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* "Trending" — 4 rows from TRENDING_SEARCHES */}
      <h2 className="search-heading search-heading--trending">Trending</h2>
      <ul className="search-list search-list--trending">
        {TRENDING_SEARCHES.map((t, i) => (
          <li key={t}>
            <button className="search-row" type="button" onClick={() => go(t)}>
              <span className="search-row__badge" aria-hidden="true">{TRENDING_GLYPHS[i % TRENDING_GLYPHS.length]}</span>
              <span className="search-row__label">{t}</span>
            </button>
          </li>
        ))}
      </ul>

      {/* DEVIATION-RISK (handoff): no tab bar on this screen — Search is reached
          from the app bar and returns via the back arrow. Kept as drawn. */}
      <HomeIndicator />
    </div>
  );
}
