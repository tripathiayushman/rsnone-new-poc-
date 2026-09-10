import { Link } from 'react-router-dom';
import { AppBar, HomeIndicator, StatusBar } from '../../components/Chrome';
import { Img } from '../../components/Img';
import { Icon } from '../../components/Icon';
import { DROPS } from '../../data/catalogue';
import './C15LimitedDrops.css';

/**
 * C15 Limited Drops — port of rsn-one-html/C15-LimitedDrops.html. One full-bleed
 * photograph behind the whole frame, intro copy on top, and the pale "Autumn Drop"
 * panel over the lower third. No tab bar on this screen (handoff DEVIATION-RISK:
 * the back arrow is the only way out) — only the home indicator.
 */
export default function C15LimitedDrops() {
  const drop = DROPS[0];

  return (
    <div className="screen c15 dropscreen">
      {/* BACKGROUND PHOTO — one image behind the entire frame (853 x 1844) + scrim */}
      <Img className="dropscreen__media" slot={drop.hero} alt="" width={853} height={1844} />
      <div className="dropscreen__scrim" />

      <StatusBar />

      {/* APP BAR — back arrow ahead of the logo, plus a THIRD action (wishlist
          heart) between search and bag, as measured in the mock. */}
      <AppBar back>
        <Link className="appbar__action" aria-label="Wishlist" to="/wishlist">
          <Icon name="heart-lg" size={42} />
        </Link>
      </AppBar>

      {/* INTRO — eyebrow + 88x3 rule + 2-line display headline + 2-line body
          + italic pull-quote + 57x3 rule. Left gutter 60px on this screen. */}
      <section className="drop-intro">
        {/* ASSUMPTION (handoff): the mock's eyebrow reads "C10 Limited Drops" — the
            "C10" is a stray screen/route label the designer left in the artwork
            (this is C15). Treated as a design artefact and dropped here. */}
        <span className="drop-intro__eyebrow">Limited Drops</span>
        <hr className="rule rule--88" />
        <h1 className="drop-intro__title">Limited<br />Discoveries</h1>
        <p className="drop-intro__body">Rare objects. Exclusive access.<br />For those who seek more.</p>
        <p className="drop-intro__voice">Thoughtful pieces.<br />Brighter days.</p>
        <hr className="rule rule--57" />
      </section>

      {/* "The Autumn Drop" PANEL — pale card, 813 x 451, overlapping the bottom of
          the photograph. Title + blurb come from DROPS[0]. */}
      <section className="drop-panel">
        <h2 className="drop-panel__title">{drop.title}</h2>
        <p className="drop-panel__body">{drop.blurb}</p>
        <Link className="btn btn--primary drop-panel__cta" to={`/drops/${drop.id}`}>
          <span className="t-eyebrow">Explore Drop</span>
          <svg width="34" height="20" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M0 5h14M10 1l4 4-4 4" /></svg>
        </Link>
      </section>

      <HomeIndicator />
    </div>
  );
}
