import { Fragment, useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { HomeIndicator, StatusBar } from '../../components/Chrome';
import { Img } from '../../components/Img';
import { dropById, houseById, productById } from '../../data/catalogue';
import { inr } from '../../lib/money';
import { useIsWishlisted, useStore } from '../../store/useStore';
import './C24DropDetail.css';

/** Icons for the three provenance badges, in the order the mock draws them. */
const BADGE_ICONS = [
  <svg key="leaf" width="30" height="30" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M17 3C9 3 4 6 4 12a5 5 0 0 0 5 5c6 0 8-6 8-14Z" /><path d="M4 17 12 9" /></svg>,
  <svg key="peak" width="30" height="30" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M2 16 10 3l8 13H2Z" /><path d="m7 16 3-4 3 4" /></svg>,
  <svg key="gem" width="30" height="30" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M4 3h12l3 5-9 9-9-9 3-5Z" /><path d="M1 8h18M7 3l3 5 3-5" /></svg>,
];

const pad = (n: number) => n.toString().padStart(2, '0');

/** Time left until `endsAt`, clamped at zero, split into DD / HH / MM / SS. */
function remainingParts(endsAt: string, now: number) {
  const s = Math.max(0, Math.floor((new Date(endsAt).getTime() - now) / 1000));
  return { d: Math.floor(s / 86400), h: Math.floor(s / 3600) % 24, m: Math.floor(s / 60) % 60, s: s % 60 };
}

/**
 * C24 Drop Detail — port of rsn-one-html/C24-DropDetail.html. Product page for one
 * Limited Drop object: photo full-bleed behind the top 810px, hero copy, a live
 * countdown, thumbnail strip, About, provenance badges, four accordion rows and a
 * sticky buy bar. No tab bar on this screen.
 */
export default function C24DropDetail() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const drop = dropById(id);
  const product = drop ? productById(drop.productId) : undefined;
  const house = product ? houseById(product.house) : undefined;

  const addToBag = useStore(s => s.addToBag);
  const inBag = useStore(s => !!product && s.bag.some(b => b.productId === product.id));
  const toggleWishlist = useStore(s => s.toggleWishlist);
  const showToast = useStore(s => s.showToast);
  const wished = useIsWishlisted(product?.id ?? '');

  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!drop || !product) return <Navigate to="/drops" replace />;

  const left = remainingParts(drop.endsAt, now);
  const units = [[left.d, 'Days'], [left.h, 'Hours'], [left.m, 'Minutes'], [left.s, 'Seconds']] as const;

  const share = async () => {
    try { await navigator.clipboard?.writeText(window.location.href); } catch { /* clipboard blocked — still confirm */ }
    showToast('Link copied');
  };

  const rows = [
    { id: 'story', label: 'Maker Story', body: house?.story ?? product.story },
    { id: 'details', label: 'Product Details', body: product.materials },
    { id: 'care', label: 'Care Instructions', body: 'Wipe with a soft, dry cloth after each use and keep it away from harsh detergents. If the surface darkens with time, a little lemon and salt rubbed gently will bring back its warmth.' },
    { id: 'shipping', label: 'Shipping & Returns', body: product.delivery },
  ];

  return (
    <div className="screen c24 pdp">
      {/* PRODUCT PHOTO — full-bleed behind the top 810px; the thumbnails swap it */}
      <Img className="pdp__photo" slot={product.images[active] ?? product.images[0]} alt={product.name} width={853} height={810} />
      <div className="pdp__scrim" />

      <StatusBar />

      {/* NAV BAR — back, wishlist heart, share. No logo and no bag on this screen. */}
      <header className="navbar">
        <button className="navbar__back" aria-label="Back" onClick={() => navigate(-1)}>
          <svg width="44" height="34" viewBox="0 0 22 18" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M21 9H1M8 2 1 9l7 7" /></svg>
        </button>
        <div className="navbar__actions">
          <button className="navbar__action" aria-pressed={wished} aria-label={`${wished ? 'Remove' : 'Add'} ${product.name} ${wished ? 'from' : 'to'} wishlist`} onClick={() => toggleWishlist(product.id)}>
            <svg width="43" height="38" viewBox="0 0 24 21" fill={wished ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.4"><path d="M12 20S1 13.4 1 7.2A5.4 5.4 0 0 1 12 4.3 5.4 5.4 0 0 1 23 7.2C23 13.4 12 20 12 20Z" /></svg>
          </button>
          <button className="navbar__action" aria-label="Share" onClick={share}>
            <svg width="37" height="43" viewBox="0 0 20 23" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M3 10v11h14V10" /><path d="M10 15V1M5 6l5-5 5 5" /></svg>
          </button>
        </div>
      </header>

      {/* HERO COPY — eyebrow, 2-line product name, house, city, price, member chip.
          ASSUMPTION: the mock's name reads "Handcrafted / Copper Vessel"; the
          catalogue name is "Copper Vessel", so "Handcrafted" is kept as the
          drop's marketing prefix on line one. */}
      <section className="pdp-copy">
        <span className="pdp-copy__eyebrow">Limited Drop</span>
        <h1 className="pdp-copy__name">Handcrafted<br />{product.name}</h1>
        <p className="pdp-copy__house">{house?.name}</p>
        <p className="pdp-copy__city">{house ? `${house.city}, ${house.country}` : product.origin}</p>
        <span className="pdp-copy__price">{inr(product.price)}</span>
        <span className="chip chip--member pdp-copy__chip">Member {inr(product.memberPrice)}</span>
      </section>

      {/* italic pull-quote, set right of the vessel */}
      <p className="pdp-voice">Tradition<br />in every<br />curve.</p>

      {/* COUNTDOWN PANEL — live, ticking each second to drop.endsAt */}
      <section className="countdown" aria-label="Limited drop countdown">
        <div className="countdown__icon">
          <svg width="52" height="54" viewBox="0 0 26 27" fill="none" stroke="currentColor" strokeWidth="1.3"><circle cx="13" cy="15" r="10" /><path d="M13 9v6l4 3M5 5 8 2M21 5l-3-3" /></svg>
        </div>
        <div className="countdown__main">
          <div className="countdown__label">Limited Drop Ends In</div>
          <div className="countdown__clock" role="timer" aria-live="off">
            {units.map(([n, label], i) => (
              <Fragment key={label}>
                {i > 0 && <span className="countdown__sep">:</span>}
                <span className="countdown__unit"><b className="countdown__num">{pad(n)}</b><span className="countdown__unitlabel">{label}</span></span>
              </Fragment>
            ))}
          </div>
        </div>
        <div className="countdown__aside">
          <p className="countdown__stock">Only <b>{drop.remaining}</b> left{' '}<br />in this drop</p>
        </div>
      </section>

      {/* THUMBNAIL STRIP — every angle from product.images; tap swaps the hero */}
      <ul className="pdp-thumbs">
        {product.images.map((img, i) => (
          <li key={img}>
            <button type="button" className={`pdp-thumb ${i === active ? 'pdp-thumb--active' : ''}`}
              aria-current={i === active} aria-label={`${product.name}, view ${i + 1}`} onClick={() => setActive(i)}>
              <Img slot={img} alt="" width={180} height={160} />
            </button>
          </li>
        ))}
      </ul>

      {/* "About this object" */}
      <section className="pdp-about">
        <h2 className="pdp-about__title">About this object</h2>
        <p className="pdp-about__body">{drop.about}</p>
      </section>

      {/* PROVENANCE BADGES — 3 across; each label breaks after its first word as
          in the mock. DEVIATION-RISK (handoff): the third badge is right-aligned. */}
      <ul className="badges">
        {drop.badges.map((b, i) => {
          const [first, ...rest] = b.split(' ');
          return (
            <li className="badge" key={b}>
              <span className="badge__disc">{BADGE_ICONS[i % BADGE_ICONS.length]}</span>
              <span className="badge__label">{first}<br />{rest.join(' ')}</span>
            </li>
          );
        })}
      </ul>

      {/* DISCLOSURE ROWS — 4 accordions, 67px each, hairline above each row */}
      <div className="disclosure">
        {rows.map(r => {
          const on = open === r.id;
          return (
            <div key={r.id} className="disclosure__item">
              <button type="button" className={`list-row ${on ? 'list-row--open' : ''}`} aria-expanded={on}
                onClick={() => setOpen(on ? null : r.id)}>
                <span className="list-row__label">{r.label}</span>
                <svg className="list-row__chevron" width="20" height="34" viewBox="0 0 12 20" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="m2 1 9 9-9 9" /></svg>
              </button>
              {on && <p className="disclosure__panel">{r.body}</p>}
            </div>
          );
        })}
      </div>

      {/* BUY BAR — price + member chip left, 450 x 88 ADD TO CART right; sticky
          with the home indicator below it */}
      <div className="pdp__foot">
        <div className="buybar">
          <div>
            <span className="buybar__price">{inr(product.price)}</span>
            <span className="chip chip--member buybar__chip">Member {inr(product.memberPrice)}</span>
          </div>
          <button className="btn btn--primary buybar__cta" onClick={() => (inBag ? navigate('/bag') : addToBag(product.id))}>
            <span className="t-eyebrow">{inBag ? 'Go to bag' : 'Add to Cart'}</span>
            <svg width="30" height="18" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M0 5h14M10 1l4 4-4 4" /></svg>
          </button>
        </div>
        <HomeIndicator />
      </div>
    </div>
  );
}
