import { Link, useLocation } from 'react-router-dom';
import { HomeIndicator, StatusBar } from '../../components/Chrome';
import { Img, Logo } from '../../components/Img';
import { useStore } from '../../store/useStore';
import type { StoreId } from '../../data/types';
import './C19StoreSelection.css';

/**
 * C19 Store Selection — port of rsn-one-html/C19-StoreSelection.html. Two cards pick
 * the Nepal or Global Select store, then continue to `location.state.returnTo`
 * (the surface that redirected here) or Home. The card matching the current store
 * gets a rose outline. DEVIATION-RISK: no back arrow, Skip or tab bar in the mock —
 * once reached, the only way out is to pick a store.
 */
export default function C19StoreSelection() {
  const location = useLocation();
  const returnTo = (location.state as { returnTo?: string } | null)?.returnTo;
  const store = useStore(s => s.store);
  const selectStore = useStore(s => s.selectStore);
  const to = returnTo ?? '/home';

  const cardClass = (id: StoreId) => `store-card store-card--${id} ${store === id ? 'store-card--selected' : ''}`;

  return (
    <div className="screen c19 store">
      {/* FOOTER PHOTOGRAPHY — full-width still life occupying the bottom 356px. */}
      <div className="store__footer">
        <Img className="store__footer-media" slot="hero-store-footer-01" alt="" width={853} height={356} />
        <div className="store__footer-scrim" />
      </div>

      <StatusBar />

      {/* BRAND LOCKUP — centred. Same lockup as C01/C02/C20, smaller here. */}
      <div className="store__lockup">
        <Logo width={273} height={138} />
      </div>

      <h1 className="store__title">Choose your<br /><em>world</em> of RSN.</h1>
      <p className="store__sub">Same extraordinary curation.<br />Different worlds to explore.</p>

      {/* STORE CARD 1 — RSNOne Nepal. 770 x 407 at y 626. ASSUMPTION: the eyebrow
          lines are set flush right. */}
      <Link className={cardClass('nepal')} to={to} onClick={() => selectStore('nepal')} aria-current={store === 'nepal' ? 'true' : undefined}>
        <Img className="store-card__media" slot="promo-store-nepal-01" alt="" width={770} height={407} />
        <div className="store-card__scrim" />

        <p className="store-card__eyebrow">Local<br />Roots.<br />Timeless<br />Beauty.</p>

        <div className="store-card__body">
          <h2 className="store-card__name">RSNOne<br /><em>Nepal</em></h2>
          <p className="store-card__text">Extraordinary objects<br />from the heart of Nepal.</p>
          <span className="store-card__cta">Explore Nepal
            <svg width="26" height="16" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M0 5h14M10 1l4 4-4 4" /></svg>
          </span>
        </div>
      </Link>

      {/* STORE CARD 2 — RSNOne Global Select. 770 x 417 at y 1070. DEVIATION-RISK:
          card 1 is 407px tall and card 2 is 417px — a 10px mismatch. */}
      <Link className={cardClass('global')} to={to} onClick={() => selectStore('global')} aria-current={store === 'global' ? 'true' : undefined}>
        <Img className="store-card__media" slot="promo-store-global-01" alt="" width={770} height={417} />
        <div className="store-card__scrim" />

        <p className="store-card__eyebrow">A more<br />Thoughtful<br />way to live.</p>

        <div className="store-card__body">
          <h2 className="store-card__name">RSNOne<br /><em>Global Select</em></h2>
          <p className="store-card__text">Extraordinary makers<br />from around the world.</p>
          <span className="store-card__cta">Explore Global
            <svg width="26" height="16" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M0 5h14M10 1l4 4-4 4" /></svg>
          </span>
        </div>
      </Link>

      {/* CLOSING — 40 x 2 rose rule at y 1560, then the italic pull-quote. */}
      <div className="store__rule" aria-hidden="true" />
      <p className="store__voice">Different places.<br />A more meaningful home.</p>

      <HomeIndicator />
    </div>
  );
}
