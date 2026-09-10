import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { StatusBar, TabBar } from '../../components/Chrome';
import { Img, Logo } from '../../components/Img';
import { houseById, productById } from '../../data/catalogue';
import { inr } from '../../lib/money';
import { useBagCount, useIsWishlisted, useStore } from '../../store/useStore';
import './C07ProductDetail.css';

const SLIDE_W = 853;

/**
 * C07 Product Detail — port of rsn-one-html/C07-ProductDetail.html. Gallery is the
 * handoff's scroll-snap track over product.images; price, wishlist, bag and the
 * six accordions are live against the store and the product record.
 */
export default function C07ProductDetail() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const product = productById(id);
  const house = product ? houseById(product.house) : undefined;

  const isMember = useStore(s => s.isMember);
  const addToBag = useStore(s => s.addToBag);
  const inBag = useStore(s => !!product && s.bag.some(b => b.productId === product.id));
  const toggleWishlist = useStore(s => s.toggleWishlist);
  const wished = useIsWishlisted(id);
  const bagCount = useBagCount();

  const [slide, setSlide] = useState(0);
  const [open, setOpen] = useState<string | null>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => { if (!product) navigate('/shop', { replace: true }); }, [product, navigate]);
  useEffect(() => { setSlide(0); setOpen(null); track.current?.scrollTo({ left: 0 }); }, [id]);

  if (!product) return null;

  const onScroll = () => {
    const el = track.current; if (!el) return;
    // slide width = track width (853 on the mock canvas, 520 on the compact one)
    setSlide(Math.max(0, Math.min(product.images.length - 1, Math.round(el.scrollLeft / (el.clientWidth || SLIDE_W)))));
  };
  const goTo = (i: number) => track.current?.scrollTo({ left: i * (track.current.clientWidth || SLIDE_W), behavior: 'smooth' });

  const mainPrice = isMember ? product.memberPrice : product.price;
  const chip = isMember ? `You save ${inr(product.price - product.memberPrice)}` : `Member ${inr(product.memberPrice)}`;

  const sections: { id: string; title: string; body: ReactNode }[] = [
    { id: 'story', title: 'The Story', body: <p>{product.story}</p> },
    { id: 'materials', title: 'Materials', body: <p>{product.materials}</p> },
    { id: 'house', title: 'The House', body: <><p>{house?.story}</p>{house && <p><Link to={`/house/${house.id}`}>Explore {house.name} →</Link></p>}</> },
    { id: 'origin', title: 'Origin', body: <p>{product.origin}</p> },
    { id: 'verification', title: 'Verification', body: <p>{product.verification}</p> },
    { id: 'delivery', title: 'Delivery & Returns', body: <p>{product.delivery}</p> },
  ];

  return (
    <div className="screen c07">
      {/* GALLERY — full-bleed 853 x 715 carousel; status bar, top bar, heart and dots overlaid.
          ASSUMPTION (handoff): the lockup sits on the photo with no scrim — dark-ink variant. */}
      <section className="pdp-gallery">
        <div className="pdp-gallery__track" ref={track} onScroll={onScroll}>
          {product.images.map((img, i) => (
            <div key={img} className="pdp-gallery__slide" aria-hidden={i !== slide}>
              <Img slot={img} alt={i === 0 ? `${product.name}, ${house?.name ?? ''}` : `${product.name}, view ${i + 1}`} width={853} height={715} />
            </div>
          ))}
        </div>

        <StatusBar />

        {/* NAV BAR — back-arrow variant of the top bar, drawn over the photo */}
        <div className="pdp-topbar">
          <button className="pdp-topbar__back" aria-label="Back" onClick={() => navigate(-1)}>
            <svg width="42" height="38" viewBox="0 0 24 22" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M23 11H1M9 3 1 11l8 8" /></svg>
          </button>
          <Link className="pdp-topbar__logo" to="/home" aria-label="RSN one — Global Family Club">
            <Logo dark width={168} height={85} />
          </Link>
          <Link className="pdp-topbar__bag" aria-label={`Bag, ${bagCount} items`} to="/bag">
            <svg width="40" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
            {bagCount > 0 && <span className="appbar__badge">{bagCount}</span>}
          </Link>
        </div>

        <button className={`pdp-wish ${wished ? 'pdp-wish--on' : ''}`} aria-pressed={wished}
          aria-label={`${wished ? 'Remove' : 'Save'} ${product.name} ${wished ? 'from' : 'to'} wishlist`} onClick={() => toggleWishlist(product.id)}>
          <svg width="44" height="40" viewBox="0 0 18 16" fill={wished ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.1"><path d="M9 15S1 10.4 1 5.6A4.3 4.3 0 0 1 9 3.4 4.3 4.3 0 0 1 17 5.6C17 10.4 9 15 9 15Z" /></svg>
        </button>

        {product.images.length > 1 && (
          <div className="pdp-dots" role="tablist" aria-label="Product images">
            {product.images.map((img, i) => (
              <button key={img} role="tab" aria-selected={i === slide} aria-label={`Image ${i + 1}`}
                className={i === slide ? 'is-active' : ''} onClick={() => goTo(i)} />
            ))}
          </div>
        )}
      </section>

      {/* PRODUCT INFO — house eyebrow, name, description, price + member chip.
          Members see the member price as the main price and how much they save. */}
      <section className="pdp-info">
        {house && <Link className="pdp-info__eyebrow" to={`/house/${house.id}`}>{house.name}</Link>}
        <h1 className="t-h1 pdp-info__title">{product.name}</h1>
        <p className="pdp-info__desc">{product.blurb}</p>
        <div className="pdp-info__pricerow">
          <span className="pdp-info__price">{inr(mainPrice)}</span>
          <span className="chip chip--member pdp-info__chip">{chip}</span>
        </div>
      </section>

      {/* ACTIONS — "Add to bag" + "Save to wishlist" (shares state with the gallery heart) */}
      <div className="pdp-actions">
        {/* feedback: once added, the button becomes "Go to bag" (store convention) */}
        <button className="btn btn--primary" onClick={() => (inBag ? navigate('/bag') : addToBag(product.id))} disabled={product.stock === 'out'}>
          {product.stock === 'out' ? 'Sold out' : inBag ? 'Go to bag' : 'Add to bag'}
        </button>
        <button className="btn btn--wish" aria-pressed={wished} onClick={() => toggleWishlist(product.id)}>
          <svg width="34" height="31" viewBox="0 0 18 16" fill={wished ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.2"><path d="M9 15S1 10.4 1 5.6A4.3 4.3 0 0 1 9 3.4 4.3 4.3 0 0 1 17 5.6C17 10.4 9 15 9 15Z" /></svg>
          {wished ? 'Saved to wishlist' : 'Save to wishlist'}
        </button>
      </div>

      {/* DETAIL ACCORDION — 6 disclosure rows; ASSUMPTION (handoff): all collapsed in the mock */}
      <div className="pdp-accordion pdp-accordion--last">
        {sections.map(s => {
          const on = open === s.id;
          return (
            <div key={s.id}>
              <button className="pdp-accordion__row" aria-expanded={on} aria-controls={`pdp-panel-${s.id}`} onClick={() => setOpen(on ? null : s.id)}>
                <span className="t-section">{s.title}</span>
                <svg width="30" height="17" viewBox="0 0 14 8" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="m1 1 6 6 6-6" /></svg>
              </button>
              {on && <div className="pdp-accordion__panel" id={`pdp-panel-${s.id}`}>{s.body}</div>}
            </div>
          );
        })}
      </div>

      {/* DEVIATION-RISK (handoff): a pushed PDP keeps the tab bar with Shop active */}
      <TabBar active="shop" variant="roman" />
    </div>
  );
}
