import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, SectionHead, StatusBar, TabBar } from '../../components/Chrome';
import { Img } from '../../components/Img';
import { Icon } from '../../components/Icon';
import { ProductCard } from '../../components/ProductCard';
import { PROMOS, WORLDS, dropProducts, newProducts } from '../../data/catalogue';
import { useStore } from '../../store/useStore';
import './C03Home.css';

/**
 * C03 Home — port of rsn-one-html/C03-Home.html. Markup and class names follow the
 * handoff 1:1; content comes from src/data; hero slides rotate; every link is real.
 */
const SLIDES = [
  { image: 'hero-home-01', title: <>Objects<br />worth <em>knowing.</em></>, body: <>Extraordinary homes.<br />Remarkable makers.<br />Now closer to yours.</>, to: '/shop' },
  { image: 'hero-limited-drops-01', title: <>Rare objects.<br /><em>Exclusive</em> access.</>, body: <>The Autumn Drop is open.<br />Curated pieces, for a<br />limited time.</>, to: '/drops' },
  { image: 'hero-membership-join-01', title: <>A more meaningful<br />way to <em>belong.</em></>, body: <>Member pricing, early access,<br />private discoveries<br />and a global family.</>, to: '/membership' },
];

export default function C03Home() {
  const store = useStore(s => s.store);
  const [slide, setSlide] = useState(0);
  const go = (dir: number) => setSlide(s => (s + dir + SLIDES.length) % SLIDES.length);
  // auto-advance; the timer resets on every change so a manual swipe/tap isn't cut short
  useEffect(() => {
    const t = setTimeout(() => setSlide(s => (s + 1) % SLIDES.length), 5000);
    return () => clearTimeout(t);
  }, [slide]);

  // left / right swipe (pointer events cover touch, mouse and pen)
  const swipeX = useRef<number | null>(null);
  const onDown = (x: number) => { swipeX.current = x; };
  const onUp = (x: number) => {
    if (swipeX.current == null) return;
    const dx = x - swipeX.current;
    swipeX.current = null;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1); // left → next, right → previous
  };

  const rail = newProducts();
  const drops = dropProducts();

  return (
    <div className="screen c03">
      <StatusBar />
      <AppBar />

      {/* HERO — 432px tall, full-bleed photo, headline, DISCOVER, pull-quote, 3 dots */}
      <section className="hero" aria-roledescription="carousel"
        onPointerDown={e => onDown(e.clientX)}
        onPointerUp={e => onUp(e.clientX)}
        onPointerCancel={() => { swipeX.current = null; }}>
        {SLIDES.map((s, i) => (
          <div key={s.image} className={`hero__slide ${i === slide ? 'hero__slide--on' : ''}`} aria-hidden={i !== slide}>
            <Img className="hero__media" slot={s.image} alt="" width={853} height={432} />
            <div className="hero__scrim" />
            <div className="hero__copy">
              <h1 className="t-display hero__title">{s.title}</h1>
              <p className="hero__body">{s.body}</p>
              <Link className="btn btn--primary hero__cta" to={s.to}>
                <span className="t-eyebrow">Discover</span>
                <Icon name="arrow-right" width={26} height={16} />
              </Link>
            </div>
          </div>
        ))}
        <p className="t-voice hero__voice">{store === 'global' ? <>Different<br />places. One<br />home.</> : <>A more<br />thoughtful<br />way to live.</>}</p>
        <div className="hero__dots" role="tablist" aria-label="Hero slides">
          {SLIDES.map((s, i) => (
            <button key={s.image} role="tab" aria-selected={i === slide} aria-label={`Slide ${i + 1}`}
              className={`hero__dot ${i === slide ? 'hero__dot--active' : ''}`} onClick={() => setSlide(i)} />
          ))}
        </div>
      </section>

      {/* "New at RSN" — horizontal rail of product cards */}
      <section className="section">
        <SectionHead title="New at RSN" link="View all" to="/shop?sort=new" />
        <ul className="product-rail">
          {rail.map(p => <ProductCard key={p.id} product={p} />)}
        </ul>
      </section>

      {/* "The Worlds of RSN" — 6 circular categories */}
      <section className="section">
        <SectionHead title="The Worlds of RSN" link="Explore all" to="/shop" />
        <ul className="worlds">
          {WORLDS.map(w => (
            <li className="world" key={w.id}>
              <Link to={`/shop?world=${w.id}`}>
                <Img className="world__disc" slot={w.image} alt={w.name} width={118} height={118} />
                <div className="world__label">{w.name}</div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* PROMO GRID — 2×2 editorial tiles */}
      <div className="promo-grid">
        {PROMOS.map(p => (
          <Link key={p.id} className={`promo-card ${p.light ? 'promo-card--light' : ''}`} to={p.to}>
            <Img className="promo-card__media" slot={p.image} alt="" width={391} height={190} />
            <div className="promo-card__scrim" />
            <div className="promo-card__body">
              <div className="promo-card__title">{p.title}</div>
              <p className="promo-card__text">
                {p.text.split('\n').map((line, i) => (i === 0 && p.text.includes('\n') ? <strong key={i}>{line}<br /></strong> : <span key={i}>{line}</span>))}
              </p>
              <span className="promo-card__link t-eyebrow">{p.cta}<Icon name="arrow-right" width={22} height={14} /></span>
            </div>
          </Link>
        ))}
      </div>

      {/* "Limited Discoveries" — rail, cut off by the frame in the mock */}
      <section className="section section--last">
        <SectionHead title="Limited Discoveries" link="View all" to="/drops" />
        <ul className="product-rail">
          {drops.map(p => <ProductCard key={p.id} product={p} />)}
        </ul>
      </section>

      <TabBar active="home" />
    </div>
  );
}
