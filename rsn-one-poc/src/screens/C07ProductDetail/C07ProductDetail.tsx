import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { StatusBar, TabBar } from '../../components/Chrome';
import { Img } from '../../components/Img';
import { PRODUCTS, houseById, productById } from '../../data/catalogue';
import { inr } from '../../lib/money';
import { useBagCount, useIsWishlisted, useStore } from '../../store/useStore';
import './C07ProductDetail.css';

const SLIDE_W = 853;

/**
 * C07 Product Detail — restructured to a full commerce layout (image, price + heart,
 * origin, quantity, add-to-cart, description, reviews, questions, related) while keeping
 * RSN one's dark espresso / rose theme. Add to cart adds the chosen qty and goes straight
 * to the bag; the heart toggles the wishlist with a small confirmation.
 */
export default function C07ProductDetail() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const product = productById(id);
  const house = product ? houseById(product.house) : undefined;

  const isMember = useStore(s => s.isMember);
  const addToBag = useStore(s => s.addToBag);
  const toggleWishlist = useStore(s => s.toggleWishlist);
  const wished = useIsWishlisted(id);
  const bagCount = useBagCount();

  const [slide, setSlide] = useState(0);
  const [qty, setQty] = useState(1);
  const [open, setOpen] = useState<string | null>('description');
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => { if (!product) navigate('/shop', { replace: true }); }, [product, navigate]);
  useEffect(() => { setSlide(0); setQty(1); setOpen('description'); track.current?.scrollTo({ left: 0 }); }, [id]);

  if (!product) return null;

  const onScroll = () => {
    const el = track.current; if (!el) return;
    setSlide(Math.max(0, Math.min(product.images.length - 1, Math.round(el.scrollLeft / (el.clientWidth || SLIDE_W)))));
  };
  const goTo = (i: number) => track.current?.scrollTo({ left: i * (track.current.clientWidth || SLIDE_W), behavior: 'smooth' });

  const mainPrice = isMember ? product.memberPrice : product.price;
  const save = product.price - product.memberPrice;
  const soldOut = product.stock === 'out';

  const related = PRODUCTS.filter(p => p.id !== product.id && p.worlds.some(w => product.worlds.includes(w))).slice(0, 6);

  const details: { id: string; title: string; body: ReactNode }[] = [
    { id: 'description', title: 'Description', body: <><p>{product.blurb}</p><p>{product.story}</p></> },
    { id: 'materials', title: 'Materials', body: <p>{product.materials}</p> },
    { id: 'house', title: 'The House', body: <><p>{house?.story}</p>{house && <p><Link to={`/house/${house.id}`}>Explore {house.name} →</Link></p>}</> },
    { id: 'verification', title: 'Verification', body: <p>{product.verification}</p> },
    { id: 'delivery', title: 'Delivery & Returns', body: <p>{product.delivery}</p> },
  ];

  const addToCart = () => { if (soldOut) return; addToBag(product.id, qty, { silent: true }); navigate('/bag'); };

  return (
    <div className="screen c07">
      <StatusBar />

      {/* HEADER — solid bar: back (left), bag (right) */}
      <header className="pdp2-header">
        <button className="pdp2-header__btn" aria-label="Back" onClick={() => navigate(-1)}>
          <svg width="24" height="20" viewBox="0 0 24 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 10H1M9 2 1 10l8 8" /></svg>
        </button>
        <Link className="pdp2-header__btn pdp2-header__bag" aria-label={`Bag, ${bagCount} items`} to="/bag">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
          {bagCount > 0 && <span className="appbar__badge">{bagCount}</span>}
        </Link>
      </header>

      {/* GALLERY — scroll-snap carousel over product.images */}
      <section className="pdp2-gallery">
        <div className="pdp2-gallery__track" ref={track} onScroll={onScroll}>
          {product.images.map((img, i) => (
            <div key={img} className="pdp2-gallery__slide" aria-hidden={i !== slide}>
              <Img slot={img} alt={i === 0 ? `${product.name}, ${house?.name ?? ''}` : `${product.name}, view ${i + 1}`} width={853} height={715} />
            </div>
          ))}
        </div>
        {product.images.length > 1 && (
          <div className="pdp2-dots" role="tablist" aria-label="Product images">
            {product.images.map((img, i) => (
              <button key={img} role="tab" aria-selected={i === slide} aria-label={`Image ${i + 1}`}
                className={i === slide ? 'is-active' : ''} onClick={() => goTo(i)} />
            ))}
          </div>
        )}
      </section>

      {/* INFO — eyebrow, title, price + wishlist heart, member saving */}
      <section className="pdp2-info">
        {house && <Link className="pdp2-eyebrow" to={`/house/${house.id}`}><span className="pdp2-eyebrow__line" />{house.name}</Link>}
        <h1 className="pdp2-title">{product.name}</h1>

        <div className="pdp2-pricerow">
          <span className="pdp2-price">{inr(mainPrice)}</span>
          <button className={`pdp2-heart ${wished ? 'is-on' : ''}`} aria-pressed={wished}
            aria-label={`${wished ? 'Remove' : 'Add'} ${product.name} ${wished ? 'from' : 'to'} wishlist`} onClick={() => toggleWishlist(product.id)}>
            <svg width="28" height="26" viewBox="0 0 24 24" fill={wished ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5"><path d="M12 20.5S3 14.8 3 9.2A5 5 0 0 1 12 6.5 5 5 0 0 1 21 9.2c0 5.6-9 11.3-9 11.3Z" /></svg>
          </button>
        </div>
        {save > 0 && <p className="pdp2-save">Members save {inr(save)}</p>}

        <hr className="pdp2-rule" />

        <div className="pdp2-spec">
          <span className="pdp2-label">Sourced at origin</span>
          <p className="pdp2-spec__val">{product.origin}</p>
        </div>

        <div className="pdp2-spec">
          <span className="pdp2-label">Quantity</span>
          <div className="qty">
            <button className="qty__btn" type="button" aria-label="Decrease quantity" onClick={() => setQty(q => Math.max(1, q - 1))}>
              <svg width="16" height="2" viewBox="0 0 16 2" stroke="currentColor" strokeWidth="1.6"><path d="M0 1h16" /></svg>
            </button>
            <span className="qty__value">{qty}</span>
            <button className="qty__btn" type="button" aria-label="Increase quantity" onClick={() => setQty(q => q + 1)}>
              <svg width="16" height="16" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.6"><path d="M8 0v16M0 8h16" /></svg>
            </button>
          </div>
        </div>

        <button className="pdp2-cart" onClick={addToCart} disabled={soldOut}>
          {soldOut ? 'Sold out' : 'Add to cart'}
        </button>
      </section>

      {/* DETAILS — Description expanded by default, the rest collapsed */}
      <div className="pdp2-accordion">
        {details.map(s => {
          const on = open === s.id;
          return (
            <div key={s.id}>
              <button className="pdp2-accordion__row" aria-expanded={on} aria-controls={`pdp-panel-${s.id}`} onClick={() => setOpen(on ? null : s.id)}>
                <span className="pdp2-accordion__title">{s.title}</span>
                <span className="pdp2-accordion__ico" aria-hidden>{on ? '–' : '+'}</span>
              </button>
              {on && <div className="pdp2-accordion__panel" id={`pdp-panel-${s.id}`}>{s.body}</div>}
            </div>
          );
        })}
      </div>

      {/* REVIEWS — empty state with the rating summary + distribution */}
      <section className="pdp2-block">
        <h2 className="pdp2-h2">Reviews</h2>
        <div className="pdp2-rating">
          <span className="pdp2-rating__line" />
          <span className="pdp2-stars" aria-hidden>
            {[0, 1, 2, 3, 4].map(i => (
              <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z" /></svg>
            ))}
          </span>
          <span className="pdp2-rating__count">0 reviews</span>
        </div>
        <div className="pdp2-bars">
          {[5, 4, 3, 2, 1].map(n => (
            <div className="pdp2-bar" key={n}>
              <span className="pdp2-bar__n">{n}</span>
              <span className="pdp2-bar__track" />
              <span className="pdp2-bar__c">0</span>
            </div>
          ))}
        </div>
        <p className="pdp2-muted">No reviews yet.</p>
        <hr className="pdp2-rule" />
        <p className="pdp2-note">You can write a review once an order containing this piece has been delivered.</p>
      </section>

      {/* QUESTIONS */}
      <section className="pdp2-block">
        <h2 className="pdp2-h2">Questions</h2>
        <p className="pdp2-muted">No questions answered yet.</p>
        <hr className="pdp2-rule" />
        <Link className="pdp2-ask" to="/concierge">Ask a question</Link>
      </section>

      {/* RELATED */}
      {related.length > 0 && (
        <section className="pdp2-block pdp2-related">
          <h2 className="pdp2-h2">Related</h2>
          <ul className="pdp2-related__rail">
            {related.map(p => (
              <li key={p.id} className="pdp2-rel" onClick={() => navigate(`/product/${p.id}`)}>
                <div className="pdp2-rel__media">
                  <Img slot={p.images[0]} alt={`${p.name}, ${houseById(p.house)?.name ?? ''}`} width={240} height={240} />
                  {p.stock === 'out' && <span className="pdp2-rel__badge">Sold out</span>}
                </div>
                <h3 className="pdp2-rel__title">{p.name}</h3>
                <span className="pdp2-rel__price">{inr(p.price)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <TabBar active="shop" variant="roman" />
    </div>
  );
}
