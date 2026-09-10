import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EmptyState, StatusBar, TabBar } from '../../components/Chrome';
import { Img, Logo } from '../../components/Img';
import { Icon } from '../../components/Icon';
import { houseById, productById } from '../../data/catalogue';
import { inr } from '../../lib/money';
import { MEMBER_THRESHOLD, bagTotals, useBagCount, useStore } from '../../store/useStore';
import './C10Bag.css';

/**
 * C10 Bag — port of rsn-one-html/C10-Bag.html. Lines come from the store's bag,
 * totals from bagTotals(); the subtitle counts pieces in words; every control acts.
 */
const WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
const countWord = (n: number) => (n <= 10 ? WORDS[n] : String(n));

export default function C10Bag() {
  const navigate = useNavigate();
  const bag = useStore(s => s.bag);
  const isMember = useStore(s => s.isMember);
  const isAuthed = useStore(s => s.isAuthed);
  const promo = useStore(s => s.promo);
  const checkout = useStore(s => s.checkout);
  const giftNote = useStore(s => s.giftNote);
  const setGiftNote = useStore(s => s.setGiftNote);
  const setQty = useStore(s => s.setQty);
  const removeFromBag = useStore(s => s.removeFromBag);
  const count = useBagCount();
  const [noteOpen, setNoteOpen] = useState(() => giftNote.length > 0);

  const totals = bagTotals({ bag, isMember, promo, checkout });
  const gap = MEMBER_THRESHOLD - totals.subtotal;
  const lines = bag.flatMap(b => { const p = productById(b.productId); return p ? [{ qty: b.qty, product: p }] : []; });

  const onCheckout = () => {
    if (!isAuthed) navigate('/login', { state: { returnTo: '/checkout/details' } });
    else navigate('/checkout/details');
  };

  return (
    <div className="screen c10">
      <StatusBar />

      {/* APP BAR — logo left, bag right with badge. No search icon on this screen
          and no hairline under the bar (both present on C09). The bag button is
          the current screen; it simply re-anchors to the top. */}
      <header className="appbar appbar--bag">
        <Link className="appbar__logo" to="/home" aria-label="RSN one — Global Family Club">
          <Logo width={186} height={94} />
        </Link>
        <div className="appbar__actions">
          <Link className="appbar__action" aria-label={`Bag, ${count} items`} to="/bag">
            <Icon name="bag" size={42} />
            {count > 0 && <span className="appbar__badge">{count}</span>}
          </Link>
        </div>
      </header>

      {lines.length === 0 ? (
        <EmptyState title="Your bag is empty" body="Objects worth knowing are waiting." cta="Explore the shop" to="/shop" />
      ) : (
        <div className="bag-body">
          {/* PAGE HEAD — title + subtitle. Subtitle counts the pieces in the bag. */}
          <div className="bag-head">
            <h1 className="t-h1 bag-head__title">Your Bag</h1>
            <p className="bag-sub">{countWord(totals.count)} beautiful {totals.count === 1 ? 'piece' : 'pieces'}, closer to home.</p>
          </div>

          {/* BAG LINES — 779x292 cards, photo 323x292 flush left.
              Each: house eyebrow, name, price, member chip, quantity stepper. */}
          <ul className="bag-list">
            {lines.map(({ product: p, qty }) => (
              <li className="bag-line" key={p.id}>
                <Img className="bag-line__media" slot={p.images[0]} alt={p.name} width={323} height={292} />
                <div className="bag-line__body">
                  <p className="bag-line__house">{houseById(p.house)?.name}</p>
                  <h2 className="t-card bag-line__title"><Link to={`/product/${p.id}`}>{p.name}</Link></h2>
                  <span className="t-price bag-line__price">{inr(p.price)}</span>
                  <span className="chip chip--member bag-line__chip">Member {inr(p.memberPrice)}</span>
                  <button className="bag-line__remove" type="button" aria-label={`Remove ${p.name} from bag`} onClick={() => removeFromBag(p.id)}>
                    <svg width="26" height="30" viewBox="0 0 18 20" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M2 5h14" /><path d="M4 5l1 13h8l1-13" /><path d="M7 5V2h4v3" /></svg>
                  </button>
                  <div className="qty">
                    <button className="qty__btn" type="button" aria-label="Decrease quantity" onClick={() => setQty(p.id, qty - 1)}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M5 12h14" /></svg>
                    </button>
                    <span className="qty__value">{qty}</span>
                    <button className="qty__btn" type="button" aria-label="Increase quantity" onClick={() => setQty(p.id, qty + 1)}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M5 12h14M12 5v14" /></svg>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* GIFT NOTE — outlined row, 772x72. The handoff opens a sub-screen;
              here it discloses a textarea bound to the store's giftNote. */}
          <button className={`gift-note ${noteOpen ? 'gift-note--open' : ''}`} type="button" aria-expanded={noteOpen} onClick={() => setNoteOpen(o => !o)}>
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M3 9h18v11H3V9Z" /><path d="M3 9l1.5-4h15L21 9" /><path d="M12 5v15" /></svg>
            Add a gift note
            <svg className="gift-note__chev" width="22" height="30" viewBox="0 0 12 18" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="m3 1 8 8-8 8" /></svg>
          </button>
          {noteOpen && (
            <textarea className="gift-note__area" aria-label="Gift note" placeholder="Write a few words for the card…"
              value={giftNote} onChange={e => setGiftNote(e.target.value)} />
          )}

          {/* ORDER TOTALS — Subtotal / (Member discount) / (Promo) / Delivery, hairline, Total + tax note.
              DEVIATION-RISK in the handoff: bag and checkout were out of sync in the mocks;
              here both read bagTotals() so they always agree. */}
          <div className="totals">
            <div className="totals__row"><span>Subtotal</span><span>{inr(totals.subtotal)}</span></div>
            {totals.memberDiscount > 0 && (
              <div className="totals__row totals__row--discount"><span>Member discount</span><span>− {inr(totals.memberDiscount)}</span></div>
            )}
            {promo && totals.promoDiscount > 0 && (
              <div className="totals__row totals__row--discount"><span>Promo ({promo})</span><span>− {inr(totals.promoDiscount)}</span></div>
            )}
            <div className="totals__row"><span>Delivery</span><span>{totals.shipping > 0 ? inr(totals.shipping) : 'Free'}</span></div>
            <div className="totals__rule" />
            <div className="totals__grand">
              <span className="totals__grand-label">Total</span>
              <span className="totals__grand-value">{inr(totals.total)}</span>
            </div>
            <p className="totals__note">Inclusive of all taxes</p>
          </div>

          {/* PRIMARY CTA — 766x79 rose button, uppercase label + arrow.
              Secondary "Continue Shopping" text link below it. */}
          <button className="btn bag-cta" type="button" onClick={onCheckout}>
            <span className="bag-cta__label">Checkout</span>
            <svg width="30" height="18" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M0 5h14M10 1l4 4-4 4" /></svg>
          </button>
          <Link className="bag-continue" to="/shop">Continue Shopping</Link>

          {/* MEMBER TEASER — outlined banner 768x110: sparkle, 1px vertical rule,
              two lines of copy. Spend-gap message; hidden for members or once the
              bag clears the threshold. */}
          {!isMember && gap > 0 && (
            <Link className="member-teaser" to="/membership">
              <span className="member-teaser__icon">
                <svg width="46" height="46" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c.6 4.6 2.8 6.8 7.4 7.4-4.6.6-6.8 2.8-7.4 7.4-.6-4.6-2.8-6.8-7.4-7.4C9.2 8.8 11.4 6.6 12 2Z" /></svg>
              </span>
              <span className="member-teaser__rule" aria-hidden="true" />
              <p className="member-teaser__copy">You're {inr(gap)} away from early access<br />to Member privileges.</p>
            </Link>
          )}
        </div>
      )}

      {/* TAB BAR — DEVIATION-RISK in the handoff: no tab is active on the mock since
          Bag is not one of the four tabs. Shop is lit here so the user has a "where am I". */}
      <TabBar active="shop" variant="roman" />
    </div>
  );
}
