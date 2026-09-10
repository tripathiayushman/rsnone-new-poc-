import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AppBar, EmptyState, StatusBar, TabBar } from '../../components/Chrome';
import { Img } from '../../components/Img';
import { ProductCard } from '../../components/ProductCard';
import { WORLDS, houseById, searchProducts } from '../../data/catalogue';
import { useStore } from '../../store/useStore';
import './C06SearchResults.css';

/**
 * C06 Search Results — port of rsn-one-html/C06-SearchResults.html. Reads ?q=,
 * ?house= and ?world=; the field is prefilled and editable, recent chips and the
 * category discs re-query, and the grid is the live result set.
 */
export default function C06SearchResults() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const house = params.get('house') ?? '';
  const world = params.get('world') ?? '';

  const recent = useStore(s => s.recentSearches);
  const pushRecentSearch = useStore(s => s.pushRecentSearch);
  const clearRecentSearches = useStore(s => s.clearRecentSearches);

  const [draft, setDraft] = useState(q);
  useEffect(() => { setDraft(q); }, [q]);

  const results = useMemo(() => {
    let list = searchProducts(q);
    if (house) list = list.filter(p => p.house === house);
    if (world) list = list.filter(p => p.worlds.includes(world as never));
    return list;
  }, [q, house, world]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const s = draft.trim();
    if (s) pushRecentSearch(s);
    const next = new URLSearchParams(params);
    if (s) next.set('q', s); else next.delete('q');
    setParams(next);
  };

  const houseName = house ? houseById(house)?.name : undefined;
  const worldName = world ? WORLDS.find(w => w.id === world)?.name : undefined;
  const filterNote = [houseName, worldName].filter(Boolean).join(' · ');

  return (
    <div className="screen c06">
      <StatusBar />
      <AppBar />

      {/* SCREEN HEAD — "Search" (78px serif) + subtitle */}
      <section className="search-head">
        <h1 className="search-head__title">Search</h1>
        <p className="search-head__sub">Discover extraordinary objects, houses and rituals.</p>
      </section>

      {/* SEARCH FIELD — prefilled from ?q=, Enter re-searches and updates the URL */}
      <form className="field" role="search" onSubmit={onSubmit}>
        <span className="field__icon" aria-hidden="true">
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><circle cx="11" cy="11" r="7" /><path d="m16.5 16.5 4 4" /></svg>
        </span>
        <input className="field__input" type="search" aria-label="Search houses, objects, rituals" autoComplete="off"
          placeholder="Search houses, objects, rituals..." value={draft} onChange={e => setDraft(e.target.value)} />
      </form>

      {/* RECENT SEARCHES — outlined chips from the store + "Clear all" */}
      {recent.length > 0 && (
        <section className="search-section search-section--recent">
          <div className="search-section__head">
            <h2 className="search-section__title">Recent Searches</h2>
            <button className="search-section__action" onClick={clearRecentSearches}>Clear all</button>
          </div>
          <ul className="recent">
            {recent.map(r => (
              <li key={r}>
                <Link className="recent__chip" to={`/search/results?q=${encodeURIComponent(r)}`} onClick={() => pushRecentSearch(r)}>
                  <svg width="26" height="26" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="8" cy="8" r="6.6" /><path d="M8 4.2V8l2.6 1.6" /></svg>
                  {r}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* BROWSE BY CATEGORY — six 106px discs; the ?world= one carries the rose ring.
          ASSUMPTION (handoff): the ring on Morning read as selected; here it is real. */}
      <section className="search-section search-section--browse">
        <div className="search-section__head">
          <h2 className="t-section">Browse by Category</h2>
          <Link className="search-section__link" to="/shop">View all
            <svg width="26" height="16" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M0 5h14M10 1l4 4-4 4" /></svg>
          </Link>
        </div>
      </section>
      <ul className="worlds worlds--search">
        {WORLDS.map(w => (
          <li key={w.id} className={`world ${world === w.id ? 'world--selected' : ''}`}>
            <Link to={`/search/results?world=${w.id}`} aria-current={world === w.id ? 'true' : undefined}>
              <Img className="world__disc" slot={w.image} alt={w.name} width={106} height={106} />
              <div className="world__label">{w.name}</div>
            </Link>
          </li>
        ))}
      </ul>

      {/* SEARCH RESULTS — heading + live count, then the 2-column grid.
          DEVIATION-RISK (handoff): card text is indented 19px relative to its photo. */}
      <section className="search-section search-section--results">
        <div className="search-section__head">
          <h2 className="t-section">Search Results</h2>
          <span className="t-meta search-count">{results.length} {results.length === 1 ? 'result' : 'results'}{filterNote ? ` in ${filterNote}` : ''}</span>
        </div>
      </section>

      {results.length ? (
        <div className="result-grid result-grid--last">
          {results.map(p => (
            <ProductCard key={p.id} product={p} className="product-card--result" mediaW={385} mediaH={232} as="div" />
          ))}
        </div>
      ) : (
        <EmptyState title="No results found" body={q ? `Nothing matched “${q}”. Try another word, a house or a world.` : 'Try another word, a house or a world.'} cta="Explore the shop" to="/shop" />
      )}

      {/* DEVIATION-RISK (handoff): no tab is active in the mock; Shop is marked here */}
      <TabBar active="shop" variant="roman" />
    </div>
  );
}
