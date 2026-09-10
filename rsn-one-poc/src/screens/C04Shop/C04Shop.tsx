import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AppBar, StatusBar, TabBar } from '../../components/Chrome';
import { Img } from '../../components/Img';
import { ProductCard } from '../../components/ProductCard';
import { HOUSES, PRODUCTS, WORLDS } from '../../data/catalogue';
import type { HouseId, Product } from '../../data/types';
import './C04Shop.css';

/**
 * C04 Shop — port of rsn-one-html/C04-Shop.html. The category row, sort control
 * and filter sheet all drive the grid; `?world=` and `?sort=` are read from the URL
 * so Home ("/shop?world=sleep", "/shop?sort=new") lands on a pre-filtered grid.
 */
type SortId = 'featured' | 'price-asc' | 'price-desc' | 'new';
const SORTS: { id: SortId; label: string }[] = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'new', label: 'Newest' },
];

function sortProducts(list: Product[], sort: SortId): Product[] {
  const out = [...list];
  if (sort === 'price-asc') out.sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') out.sort((a, b) => b.price - a.price);
  else if (sort === 'new') out.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
  return out;
}

export default function C04Shop() {
  const [params, setParams] = useSearchParams();
  const world = params.get('world') ?? '';
  const sort: SortId = (SORTS.find(s => s.id === params.get('sort'))?.id) ?? 'featured';

  // applied filters (from the sheet) + the sheet's own draft
  const [houses, setHouses] = useState<HouseId[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [draftHouses, setDraftHouses] = useState<HouseId[]>([]);
  const [draftInStock, setDraftInStock] = useState(false);

  const setWorld = (id: string) => {
    const next = new URLSearchParams(params);
    if (id) next.set('world', id); else next.delete('world');
    setParams(next, { replace: true });
  };
  const setSort = (id: SortId) => {
    const next = new URLSearchParams(params);
    if (id === 'featured') next.delete('sort'); else next.set('sort', id);
    setParams(next, { replace: true });
  };
  const openSheet = () => { setDraftHouses(houses); setDraftInStock(inStockOnly); setSheetOpen(true); };
  const applySheet = () => { setHouses(draftHouses); setInStockOnly(draftInStock); setSheetOpen(false); };
  const clearSheet = () => { setDraftHouses([]); setDraftInStock(false); };
  const clearAll = () => { setHouses([]); setInStockOnly(false); };

  const grid = useMemo(() => {
    let list = PRODUCTS;
    if (world) list = list.filter(p => p.worlds.includes(world as never));
    if (houses.length) list = list.filter(p => houses.includes(p.house));
    if (inStockOnly) list = list.filter(p => p.stock !== 'out');
    return sortProducts(list, sort);
  }, [world, houses, inStockOnly, sort]);

  const filterCount = houses.length + (inStockOnly ? 1 : 0);

  return (
    <div className="screen c04">
      <StatusBar />
      <AppBar />

      {/* SCREEN HEAD — "Shop", Filter control, subtitle. ASSUMPTION: "Filter" opens a
          filter sheet — no sheet screen was supplied, so the POC draws its own below. */}
      <section className="shop-head">
        <div className="shop-head__row">
          <h1 className="t-h1">Shop</h1>
          <button className="shop-head__filter" aria-label="Filter products" aria-expanded={sheetOpen} onClick={openSheet}>
            <svg width="34" height="27" viewBox="0 0 20 16" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M0 4h5M9 4h11M0 12h11M15 12h5" /><circle cx="7" cy="4" r="2" /><circle cx="13" cy="12" r="2" /></svg>
            <span>Filter{filterCount ? ` (${filterCount})` : ''}</span>
          </button>
        </div>
        <p className="shop-head__sub">Extraordinary objects for a more thoughtful life.</p>
      </section>

      {/* CATEGORY ROW — "All" chip + the six worlds; the active one is ?world= */}
      <ul className="worlds worlds--shop">
        <li className={`world world--all ${world === '' ? 'world--selected' : ''}`}>
          <button aria-current={world === '' ? 'true' : undefined} onClick={() => setWorld('')}>
            <span className="world__disc" aria-hidden="true" />
            <div className="world__label">All</div>
          </button>
        </li>
        {WORLDS.map(w => (
          <li key={w.id} className={`world ${world === w.id ? 'world--selected' : ''}`}>
            <button aria-current={world === w.id ? 'true' : undefined} onClick={() => setWorld(w.id)}>
              <Img className="world__disc" slot={w.image} alt={w.name} width={83} height={83} />
              <div className="world__label">{w.name}</div>
            </button>
          </li>
        ))}
      </ul>

      {/* SHOP BANNER — links to /shop and clears every filter.
          DEVIATION-RISK: the pull-quote has no scrim behind it. */}
      <Link className="shop-banner" to="/shop" onClick={clearAll}>
        <Img className="shop-banner__media" slot="promo-shop-banner-01" alt="" width={807} height={206} />
        <div className="shop-banner__scrim" />
        <div className="shop-banner__copy">
          <h2 className="shop-banner__title">Objects<br />for a more<br /><em>meaningful</em> home.</h2>
        </div>
        <span className="shop-banner__cta">Shop all
          <svg width="22" height="14" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M0 5h14M10 1l4 4-4 4" /></svg>
        </span>
        <p className="shop-banner__voice">Curated<br />from the world's<br />finest makers.</p>
      </Link>

      {/* "All Products" + sort control (native select dressed as the mock's text) */}
      <div className="shop-grid-head">
        <h2 className="t-section">All Products</h2>
        <label className="shop-sort">
          <span>Sort by:</span>
          <select className="shop-sort__select" aria-label="Sort by" value={sort} onChange={e => setSort(e.target.value as SortId)}>
            {SORTS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
          <svg width="22" height="13" viewBox="0 0 14 8" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="m1 1 6 6 6-6" /></svg>
        </label>
      </div>

      {/* PRODUCT GRID — 2 columns of tile cards. DEVIATION-RISK: 25px page padding vs
          the 36px gutter used by the headings above. */}
      {grid.length ? (
        <div className="product-grid product-grid--last">
          {grid.map(p => (
            <ProductCard key={p.id} product={p} showStock className="product-card--tile" mediaW={393} mediaH={186} as="div" />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2 className="empty__title">Nothing here yet</h2>
          <p className="empty__body">No objects match these filters.</p>
          <button className="btn btn--primary" onClick={clearAll}><span className="t-eyebrow">Clear filters</span></button>
        </div>
      )}

      {/* POC FILTER SHEET — houses + in-stock toggle; "Apply" filters the grid */}
      {sheetOpen && (
        <div className="shop-sheet" role="dialog" aria-modal="true" aria-label="Filter products" onClick={() => setSheetOpen(false)}>
          <div className="shop-sheet__panel" onClick={e => e.stopPropagation()}>
            <div className="shop-sheet__head">
              <h2 className="t-section">Filter</h2>
              <button className="shop-sheet__close" onClick={() => setSheetOpen(false)}>Close</button>
            </div>
            <span className="shop-sheet__label">House</span>
            <div className="shop-sheet__list">
              {HOUSES.map(h => {
                const on = draftHouses.includes(h.id);
                return (
                  <label key={h.id} className="shop-sheet__row">
                    <span>{h.name}</span>
                    <input type="checkbox" checked={on} onChange={() => setDraftHouses(on ? draftHouses.filter(x => x !== h.id) : [...draftHouses, h.id])} />
                    <span className="shop-sheet__box" aria-hidden="true">
                      <svg width="16" height="12" viewBox="0 0 14 11" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m1 5.5 4 4 8-8" /></svg>
                    </span>
                  </label>
                );
              })}
            </div>
            <span className="shop-sheet__label">Availability</span>
            <div className="shop-sheet__list">
              <label className="shop-sheet__row">
                <span>In stock only</span>
                <input type="checkbox" checked={draftInStock} onChange={e => setDraftInStock(e.target.checked)} />
                <span className="shop-sheet__toggle" aria-hidden="true" />
              </label>
            </div>
            <div className="shop-sheet__actions">
              <button className="btn btn--outline" onClick={clearSheet}><span className="t-eyebrow">Clear</span></button>
              <button className="btn btn--primary" onClick={applySheet}><span className="t-eyebrow">Apply</span></button>
            </div>
          </div>
        </div>
      )}

      <TabBar active="shop" />
    </div>
  );
}
