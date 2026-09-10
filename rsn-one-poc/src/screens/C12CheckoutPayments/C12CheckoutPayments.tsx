import { useState, useRef } from 'react';
import type { ReactNode } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { StatusBar, TabBar } from '../../components/Chrome';
import { Img, Logo } from '../../components/Img';
import { houseById, productById } from '../../data/catalogue';
import { inr } from '../../lib/money';
import { bagTotals, useStore } from '../../store/useStore';
import type { PaymentKind } from '../../store/useStore';
import './C12CheckoutPayments.css';

/**
 * C12 Checkout — Payment. Port of rsn-one-html/C12-CheckoutPayments.html.
 * Accordion-radio of payment methods (card / UPI / net banking / wallets / EMI, plus the
 * member wallet balance); card fields auto-format and validate on Pay; the rail is the
 * same Order Summary as C11. "Pay Now" writes the payment label to the checkout draft,
 * places the order in the store and lands on C13.
 */
type Method = 'card' | 'upi' | 'netbanking' | 'wallets' | 'emi' | 'walletbal';
const BANKS = ['HDFC', 'ICICI', 'SBI', 'Axis', 'Kotak'];
const WALLET_APPS = ['PhonePe', 'Google Pay', 'Paytm'];
const TENURES = [3, 6, 9, 12];

const digits = (s: string) => s.replace(/\D/g, '');
const fmtCard = (s: string) => digits(s).slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
const fmtExpiry = (s: string) => { const d = digits(s).slice(0, 4); return d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d; };

const CHEV_DOWN = <svg width="26" height="16" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="m1 1 7 7 7-7" /></svg>;
const CHEV_UP = <svg width="26" height="16" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="m1 9 7-7 7 7" /></svg>;

export default function C12CheckoutPayments() {
  const navigate = useNavigate();
  const bag = useStore(s => s.bag);
  const isMember = useStore(s => s.isMember);
  const promo = useStore(s => s.promo);
  const checkout = useStore(s => s.checkout);
  const wallet = useStore(s => s.wallet);
  const setCheckout = useStore(s => s.setCheckout);
  const placeOrder = useStore(s => s.placeOrder);
  const spendWallet = useStore(s => s.spendWallet);
  const applyPromo = useStore(s => s.applyPromo);
  const clearPromo = useStore(s => s.clearPromo);
  const showToast = useStore(s => s.showToast);

  const [method, setMethod] = useState<Method>('card');
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [upiId, setUpiId] = useState('');
  const [bank, setBank] = useState(BANKS[0]);
  const [walletApp, setWalletApp] = useState(WALLET_APPS[0]);
  const [tenure, setTenure] = useState(6);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [promoOpen, setPromoOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);

  // placeOrder() empties the bag synchronously; without this ref the guard below would
  // bounce the payer to /bag before navigate() reaches the confirmation screen.
  const placing = useRef(false);
  if (bag.length === 0 && !placing.current) return <Navigate to="/bag" replace />;
  if (!checkout.address) return <Navigate to="/checkout/details" replace />;

  const totals = bagTotals({ bag, isMember, promo, checkout });
  const lines = bag.flatMap(b => { const p = productById(b.productId); return p ? [{ qty: b.qty, product: p }] : []; });

  const choose = (m: Method) => { setMethod(m); setErrors({}); };

  const onApplyPromo = () => {
    if (applyPromo(promoCode)) { setPromoError(null); setPromoCode(''); setPromoOpen(false); }
    else setPromoError('Invalid code');
  };

  /** Validate the open method; returns the store payment kind + human label, or null. */
  const resolvePayment = (): { payment: PaymentKind; paymentLabel: string } | null => {
    const e: Record<string, string> = {};
    let out: { payment: PaymentKind; paymentLabel: string } | null = null;
    if (method === 'card') {
      const num = digits(card.number); const exp = digits(card.expiry);
      const mm = Number(exp.slice(0, 2));
      if (num.length !== 16) e.number = 'Enter a 16-digit card number';
      if (exp.length !== 4 || mm < 1 || mm > 12) e.expiry = 'Enter expiry as MM / YY';
      if (digits(card.cvv).length !== 3) e.cvv = 'Enter the 3-digit CVV';
      if (!card.name.trim()) e.name = 'Enter the name on the card';
      out = { payment: 'card', paymentLabel: `Credit Card (•••• ${num.slice(-4)})` };
    } else if (method === 'upi') {
      if (!/^[\w.-]+@[a-z]+$/i.test(upiId.trim())) e.upi = 'Enter a valid UPI ID, e.g. name@bank';
      out = { payment: 'upi', paymentLabel: `UPI (${upiId.trim()})` };
    } else if (method === 'netbanking') {
      out = { payment: 'netbanking', paymentLabel: `Net Banking (${bank})` };
    } else if (method === 'wallets') {
      out = { payment: 'wallet', paymentLabel: walletApp };
    } else if (method === 'emi') {
      out = { payment: 'emi', paymentLabel: `EMI ${tenure} months` };
    } else {
      if (wallet.balance < totals.total) e.walletbal = `Insufficient balance — ${inr(totals.total - wallet.balance)} short`;
      out = { payment: 'wallet', paymentLabel: 'Wallet' };
    }
    setErrors(e);
    return Object.keys(e).length ? null : out;
  };

  const onPay = () => {
    const p = resolvePayment();
    if (!p) return;
    setCheckout(p);
    placing.current = true;
    const order = placeOrder();
    if (method === 'walletbal') spendWallet(order.total, `Order #${order.id}`);
    navigate(`/order/confirmation/${order.id}`);
  };

  const terms = (label: string) => (
    <a href="#" role="button" onClick={e => { e.preventDefault(); showToast(`${label} — coming soon`); }}>{label}</a>
  );

  /** One accordion row: head (radio + icon + text + chevron) and, when open, its panel. */
  const row = (m: Method, icon: ReactNode, name: string, hint: string, panel: ReactNode) => {
    const open = method === m;
    return (
      <div className={`pay-method ${open ? 'pay-method--open' : ''}`}>
        <button className="pay-method__head" type="button" aria-expanded={open} onClick={() => choose(m)}>
          <span className="pay-method__radio" aria-hidden="true" />
          <span className="pay-method__icon">{icon}</span>
          <span className="pay-method__text">
            <span className="pay-method__name">{name}</span>
            <span className="pay-method__hint">{hint}</span>
          </span>
          <span className="pay-method__chev" aria-hidden="true">{open ? CHEV_UP : CHEV_DOWN}</span>
        </button>
        {open && <div className="pay-method__panel">{panel}</div>}
      </div>
    );
  };

  return (
    <div className="screen c12">
      <StatusBar />

      {/* CHECKOUT BAR — identical block to C11; only the voice line differs. */}
      <header className="checkout-bar">
        <button className="checkout-bar__back" type="button" aria-label="Back to delivery details" onClick={() => navigate('/checkout/details')}>
          <svg width="33" height="29" viewBox="0 0 20 18" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M19 9H1M8 1 1 9l7 8" /></svg>
        </button>
        <Link className="checkout-bar__logo" to="/home" aria-label="RSN one — Global Family Club">
          <Logo width={186} height={94} />
        </Link>
        <p className="checkout-bar__voice">Meaningful<br />purchases create<br />a brighter tomorrow.</p>
      </header>
      {/* ASSUMPTION (handoff): the voice line's third line ends 24px from the frame edge. */}

      {/* STEPPER — steps 1 and 2 done, step 3 Payment current, 4 ahead. */}
      <nav className="stepper" aria-label="Checkout progress">
        <Link className="step step--done" to="/bag">
          <span className="step__dot" aria-hidden="true">
            <svg width="20" height="15" viewBox="0 0 14 11" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m1 5.5 4 4 8-8" /></svg>
          </span>
          <span className="step__label">Bag</span>
        </Link>
        <span className="step__line" aria-hidden="true" />
        <Link className="step step--done" to="/checkout/details">
          <span className="step__dot" aria-hidden="true">
            <svg width="20" height="15" viewBox="0 0 14 11" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m1 5.5 4 4 8-8" /></svg>
          </span>
          <span className="step__label">Details</span>
        </Link>
        <span className="step__line" aria-hidden="true" />
        <div className="step step--current" aria-current="step">
          <span className="step__dot">3</span>
          <span className="step__label">Payment</span>
        </div>
        <span className="step__line" aria-hidden="true" />
        <div className="step">
          <span className="step__dot">4</span>
          <span className="step__label">Review</span>
        </div>
      </nav>

      {/* CHECKOUT BODY — same two columns as C11: form 472px, rail 302px. */}
      <div className="checkout">

        {/* LEFT: payment method accordion */}
        <div className="checkout__form">
          <h1 className="t-title pay-title">Payment Method</h1>
          <p className="panel-sub">Choose a secure payment method</p>

          {/* expanded card option, 472x449. Panel holds Card Number, Expiry Date + CVV, Name on Card. */}
          {row('card',
            <svg width="46" height="34" viewBox="0 0 28 20" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="1" y="1" width="26" height="18" rx="3" /><path d="M1 7h26" /><path d="M5 13h6" /></svg>,
            'Credit / Debit Card', 'Visa, Mastercard, RuPay, Amex',
            <>
              <p className="pay-label">Card Number</p>
              <div className={`pay-field ${errors.number ? 'field--error' : ''}`}>
                <input className="pay-field__input" type="text" inputMode="numeric" autoComplete="cc-number"
                  placeholder="1234 5678 9012 3456" aria-label="Card Number" value={card.number}
                  onChange={e => setCard(c => ({ ...c, number: fmtCard(e.target.value) }))} />
                <span className="pay-field__adorn" aria-hidden="true">
                  <svg width="30" height="22" viewBox="0 0 22 16" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="1" y="1" width="20" height="14" rx="2.5" /><path d="M1 6h20" /></svg>
                </span>
                {errors.number && <span className="field__error">{errors.number}</span>}
              </div>

              <div className="pay-grid">
                <div>
                  <p className="pay-label">Expiry Date</p>
                  <div className={`pay-field ${errors.expiry ? 'field--error' : ''}`}>
                    <input className="pay-field__input" type="text" inputMode="numeric" autoComplete="cc-exp"
                      placeholder="MM / YY" aria-label="Expiry Date" value={card.expiry}
                      onChange={e => setCard(c => ({ ...c, expiry: fmtExpiry(e.target.value) }))} />
                    <span className="pay-field__adorn" aria-hidden="true">
                      <svg width="26" height="26" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="1" y="3" width="18" height="16" rx="2.5" /><path d="M1 8h18M6 1v4M14 1v4" /></svg>
                    </span>
                    {errors.expiry && <span className="field__error">{errors.expiry}</span>}
                  </div>
                </div>
                <div>
                  <p className="pay-label">CVV</p>
                  <div className={`pay-field ${errors.cvv ? 'field--error' : ''}`}>
                    <input className="pay-field__input" type="password" inputMode="numeric" autoComplete="cc-csc"
                      placeholder="123" aria-label="CVV" value={card.cvv}
                      onChange={e => setCard(c => ({ ...c, cvv: digits(e.target.value).slice(0, 3) }))} />
                    <span className="pay-field__adorn" aria-hidden="true">
                      <svg width="26" height="26" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="10" cy="10" r="9" /><path d="M10 9v6M10 5.5v.5" /></svg>
                    </span>
                    {errors.cvv && <span className="field__error">{errors.cvv}</span>}
                  </div>
                </div>
              </div>

              <p className="pay-label">Name on Card</p>
              <div className={`pay-field pay-field--last ${errors.name ? 'field--error' : ''}`}>
                <input className="pay-field__input" type="text" autoComplete="cc-name" placeholder="e.g. Ananya Sharma" aria-label="Name on Card"
                  value={card.name} onChange={e => setCard(c => ({ ...c, name: e.target.value }))} />
                {errors.name && <span className="field__error">{errors.name}</span>}
              </div>
            </>,
          )}

          {/* collapsed payment options, 472x95, 12px apart — each opens in place. */}
          {row('upi',
            <svg width="40" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M8 2 18 12 8 22" /><path d="M4 6l7 7-7 7" /></svg>,
            'UPI', 'Pay with any UPI app',
            <>
              <p className="pay-label">UPI ID</p>
              <div className={`pay-field pay-field--last ${errors.upi ? 'field--error' : ''}`}>
                <input className="pay-field__input" type="text" placeholder="name@bank" aria-label="UPI ID" autoComplete="off"
                  value={upiId} onChange={e => setUpiId(e.target.value)} />
                {errors.upi && <span className="field__error">{errors.upi}</span>}
              </div>
            </>,
          )}

          {row('netbanking',
            <svg width="42" height="38" viewBox="0 0 24 22" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M2 8 12 2l10 6" /><path d="M4 8v9M9 8v9M15 8v9M20 8v9" /><path d="M1 20h22" /></svg>,
            'Net Banking', 'All major banks',
            <>
              <p className="pay-label">Bank</p>
              <div className="pay-field pay-field--last pay-field--select">
                <select className="pay-field__input" aria-label="Bank" value={bank} onChange={e => setBank(e.target.value)}>
                  {BANKS.map(b => <option key={b}>{b}</option>)}
                </select>
                <span className="pay-field__adorn" aria-hidden="true">{CHEV_DOWN}</span>
              </div>
            </>,
          )}

          {row('wallets',
            <svg width="42" height="36" viewBox="0 0 24 20" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M2 4h16a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H2V4Z" /><path d="M2 4 15 1" /><circle cx="17" cy="11.5" r="1.6" /></svg>,
            'Wallets', 'PhonePe, Google Pay, Paytm',
            <>
              <p className="pay-label">Choose a wallet</p>
              <div className="pay-chips" role="radiogroup" aria-label="Wallet">
                {WALLET_APPS.map(w => (
                  <button key={w} type="button" role="radio" aria-checked={walletApp === w}
                    className={`pay-chip ${walletApp === w ? 'pay-chip--on' : ''}`} onClick={() => setWalletApp(w)}>{w}</button>
                ))}
              </div>
            </>,
          )}

          {row('emi',
            <svg width="40" height="38" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="1" y="3" width="18" height="16" rx="2.5" /><path d="M1 8h18M6 1v4M14 1v4" /><path d="M6 12h8M6 15h5" /></svg>,
            'EMI', 'Easy monthly payments',
            <>
              <p className="pay-label">Tenure</p>
              <div className="pay-field pay-field--last pay-field--select">
                <select className="pay-field__input" aria-label="Tenure" value={tenure} onChange={e => setTenure(Number(e.target.value))}>
                  {TENURES.map(t => <option key={t} value={t}>{t} months · {inr(Math.ceil(totals.total / t))}/month</option>)}
                </select>
                <span className="pay-field__adorn" aria-hidden="true">{CHEV_DOWN}</span>
              </div>
            </>,
          )}

          {/* Member-only: pay from the RSN wallet (C33). Not in the handoff mock. */}
          {isMember && row('walletbal',
            <svg width="42" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="2.5" y="6" width="19" height="13" rx="2.5" /><path d="M16 12.5h5.5v3H16a1.5 1.5 0 0 1 0-3Z" /><path d="M2.5 9h19" /></svg>,
            'Wallet balance', `${inr(wallet.balance)} available`,
            <>
              <p className="pay-balance"><span>Pay from wallet</span><span>{inr(totals.total)}</span></p>
              {errors.walletbal && <span className="field__error">{errors.walletbal}</span>}
            </>,
          )}

          <p className="pay-secure">
            <svg width="30" height="34" viewBox="0 0 16 18" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="1" y="7" width="14" height="10" rx="2" /><path d="M4 7V5a4 4 0 0 1 8 0v2" /></svg>
            All payments are secure and encrypted.
          </p>
        </div>

        {/* RIGHT: order rail (identical content to C11) */}
        <aside className="checkout__rail">
          <div className="summary">
            <div className="summary__head">
              <h2 className="summary__title">Order Summary</h2>
              <span className="summary__count">{totals.count} {totals.count === 1 ? 'item' : 'items'}</span>
            </div>

            <ul className="summary__list">
              {lines.map(({ product: p, qty }) => (
                <li className="summary__item" key={p.id}>
                  <Img className="summary__media" slot={p.images[0]} alt={p.name} width={103} height={96} />
                  <div>
                    <div className="summary__name">{p.name}</div>
                    <div className="summary__house">{houseById(p.house)?.name}</div>
                    <span className="summary__price">{inr(p.price)}</span>
                    <div className="summary__qty">Qty: {qty}</div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="summary__rule" />
            <div className="summary__row"><span>Subtotal</span><span>{inr(totals.subtotal)}</span></div>
            {totals.memberDiscount > 0 && (
              <div className="summary__row summary__row--discount"><span>Member discount</span><span>− {inr(totals.memberDiscount)}</span></div>
            )}
            {promo && totals.promoDiscount > 0 && (
              <div className="summary__row summary__row--discount"><span>Promo ({promo})</span><span>− {inr(totals.promoDiscount)}</span></div>
            )}
            <div className="summary__row"><span>Shipping</span><span>{totals.shipping > 0 ? inr(totals.shipping) : 'Free'}</span></div>
            <div className="summary__rule summary__rule--total" />
            <div className="summary__total">
              <span className="summary__total-label">Total</span>
              <span className="summary__total-value">{inr(totals.total)}</span>
            </div>
          </div>

          {/* promo code disclosure row, 302x69 */}
          {promo ? (
            <div className="promo-row" aria-live="polite">
              <svg width="32" height="28" viewBox="0 0 20 18" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M1 8V2h6l11 11-6 6L1 8Z" /><circle cx="5" cy="6" r="1.4" /></svg>
              {promo} applied
              <button className="promo-row__remove" type="button" aria-label={`Remove promo ${promo}`} onClick={() => clearPromo()}>
                <svg width="16" height="16" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M2 2l10 10M12 2 2 12" /></svg>
              </button>
            </div>
          ) : (
            <button className={`promo-row ${promoOpen ? 'promo-row--open' : ''}`} type="button" aria-expanded={promoOpen} onClick={() => setPromoOpen(o => !o)}>
              <svg width="32" height="28" viewBox="0 0 20 18" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M1 8V2h6l11 11-6 6L1 8Z" /><circle cx="5" cy="6" r="1.4" /></svg>
              Have a promo code?
              <span className="promo-row__chev" aria-hidden="true">{CHEV_DOWN}</span>
            </button>
          )}
          {!promo && promoOpen && (
            <div className={promoError ? 'field--error' : undefined}>
              <form className="promo-form" onSubmit={e => { e.preventDefault(); onApplyPromo(); }}>
                <input className="promo-form__input" aria-label="Promo code" placeholder="Enter code" value={promoCode}
                  onChange={e => { setPromoCode(e.target.value); setPromoError(null); }} />
                <button className="promo-form__apply" type="submit" disabled={!promoCode.trim()}>Apply</button>
              </form>
              {promoError && <span className="field__error">{promoError}</span>}
            </div>
          )}

          {/* editorial tile, 302x317. Different photo from C11 but the same block. */}
          <div className="rail-tile">
            <Img className="rail-tile__media" slot="promo-kinder-tomorrow-01" alt="" width={302} height={317} />
            <p className="rail-tile__copy">More<br />than objects,<br />a kinder<br />tomorrow.</p>
            <span className="rail-tile__rule" aria-hidden="true" />
          </div>
        </aside>
      </div>

      {/* CHECKOUT FOOTER — "Pay Now" spans the full frame width, then the terms line.
          DEVIATION-RISK (handoff): the CTA says "Pay Now" while the stepper still shows a
          4th "Review" step; there is no screen between the two, so Pay Now places the order. */}
      <div className="checkout-foot">
        <button className="btn checkout-foot__cta" type="button" onClick={onPay}>
          Pay Now
          <svg width="30" height="18" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M0 5h14M10 1l4 4-4 4" /></svg>
        </button>
        <p className="pay-terms">By completing your purchase, you agree to our {terms('Terms & Conditions')}<br />and {terms('Privacy Policy')}.</p>
      </div>

      {/* TAB BAR — DEVIATION-RISK (handoff): the 4-tab bar is drawn during checkout. */}
      <TabBar active="shop" variant="roman" />
    </div>
  );
}
