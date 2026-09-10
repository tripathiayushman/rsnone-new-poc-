import { Link } from 'react-router-dom';
import { AppBar, EmptyState, StatusBar, TabBar } from '../../components/Chrome';
import { Img } from '../../components/Img';
import { houseById, productById } from '../../data/catalogue';
import { inr } from '../../lib/money';
import { useStore } from '../../store/useStore';
import type { Product } from '../../data/types';
import './C09Wishlist.css';

/**
 * C09 Wishlist — port of rsn-one-html/C09-Wishlist.html. Cards are the store's
 * wishlist; Move to Bag / Remove / the filled heart all write back to it.
 */
export default function C09Wishlist() {
  const wishlist = useStore(s => s.wishlist);
  const moveToBag = useStore(s => s.moveToBag);
  const removeFromWishlist = useStore(s => s.removeFromWishlist);
  const showToast = useStore(s => s.showToast);

  const items = wishlist.map(productById).filter((p): p is Product => !!p);

  const share = () => {
    const url = window.location.href;
    const done = () => showToast('Wishlist link copied');
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(url).then(done, done);
    else done();
  };

  return (
    <div className="screen c09">
      <StatusBar />
      {/* APP BAR — standard block with a hairline under it on this screen */}
      <AppBar />

      {/* PAGE HEAD — title left, "Share Wishlist" right, subtitle below */}
      <div className="wish-head">
        <h1 className="t-h1 wish-head__title">Wishlist</h1>
        <button className="wish-head__share" type="button" onClick={share}>
          <svg width="26" height="32" viewBox="0 0 16 20" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M8 1v12" /><path d="M4 5l4-4 4 4" /><path d="M1 11v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7" /></svg>
          Share Wishlist
        </button>
      </div>
      <p className="wish-sub">Your saved luxury finds.</p>

      {/* WISHLIST — saved-item cards 789x296; ASSUMPTION (handoff): no empty state
          in the mock, so the shared <EmptyState> stands in */}
      {items.length ? (
        <ul className="wishlist">
          {items.map(p => {
            const house = houseById(p.house);
            return (
              <li key={p.id} className="wish-card">
                <Link to={`/product/${p.id}`} aria-label={p.name}>
                  <Img className="wish-card__media" slot={p.images[0]} alt={`${p.name}, ${house?.name ?? ''}`} width={327} height={296} />
                </Link>
                <div className="wish-card__body">
                  <p className="wish-card__house">{house?.name}</p>
                  <h2 className="t-card wish-card__title"><Link to={`/product/${p.id}`}>{p.name}</Link></h2>
                  <div className="wish-card__pricing">
                    <span className="t-price wish-card__price">{inr(p.price)}</span>
                    <span className="chip chip--member wish-card__chip">Member {inr(p.memberPrice)}</span>
                  </div>
                  <button className="wish-card__unwish" type="button" aria-label={`Remove ${p.name} from wishlist`} aria-pressed="true"
                    onClick={() => removeFromWishlist(p.id)}>
                    <svg width="36" height="32" viewBox="0 0 18 16" fill="currentColor"><path d="M9 15.5S.6 10.6.6 5.4A4.5 4.5 0 0 1 9 3.1 4.5 4.5 0 0 1 17.4 5.4C17.4 10.6 9 15.5 9 15.5Z" /></svg>
                  </button>
                  <div className="wish-card__actions">
                    <button className="btn wish-card__cta" type="button" onClick={() => moveToBag(p.id)}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
                      Move to Bag
                    </button>
                    <span className="wish-card__sep" aria-hidden="true" />
                    <button className="wish-card__remove" type="button" onClick={() => removeFromWishlist(p.id)}>
                      <svg width="26" height="28" viewBox="0 0 18 20" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M2 5h14" /><path d="M4 5l1 13h8l1-13" /><path d="M7 5V2h4v3" /></svg>
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState title="Your wishlist is empty" body="Save the pieces you love and find them here." cta="Explore the shop" to="/shop" />
      )}

      <TabBar active="wishlist" variant="roman" />
    </div>
  );
}
