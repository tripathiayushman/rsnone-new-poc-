import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { StatusBar, TabBar } from '../../components/Chrome';
import { Img, Logo } from '../../components/Img';
import { houseById, productById } from '../../data/catalogue';
import type { Address } from '../../data/types';
import { inr } from '../../lib/money';
import { bagTotals, useStore } from '../../store/useStore';
import './C11CheckoutDetails.css';

/**
 * C11 Checkout — Details. Port of rsn-one-html/C11-CheckoutDetails.html.
 * Delivery form is controlled + validated; "Use saved address" fills it from the
 * account's addresses; delivery method / note / promo write to the store's checkout
 * draft; the rail reads bagTotals() so it always agrees with C10 and C12.
 */
const COUNTRIES = ['India', 'Nepal', 'United Kingdom', 'United States', 'United Arab Emirates'];

interface Form { name: string; line1: string; line2: string; city: string; pincode: string; country: string }
type Errors = Partial<Record<keyof Form, string>>;

function validate(f: Form): Errors {
  const e: Errors = {};
  if (!f.name.trim()) e.name = 'Please enter your full name';
  if (!f.line1.trim()) e.line1 = 'Please enter your address';
  if (!f.city.trim()) e.city = 'Please enter your city';
  if (!/^\d{5,6}$/.test(f.pincode.trim())) e.pincode = 'Enter a 5–6 digit pincode';
  return e;
}

export default function C11CheckoutDetails() {
  const navigate = useNavigate();
  const bag = useStore(s => s.bag);
  const isMember = useStore(s => s.isMember);
  const promo = useStore(s => s.promo);
  const checkout = useStore(s => s.checkout);
  const addresses = useStore(s => s.addresses);
  const setCheckout = useStore(s => s.setCheckout);
  const applyPromo = useStore(s => s.applyPromo);
  const clearPromo = useStore(s => s.clearPromo);

  const [form, setForm] = useState<Form>(() => ({
    name: checkout.address?.name ?? '', line1: checkout.address?.line1 ?? '', line2: checkout.address?.line2 ?? '',
    city: checkout.address?.city ?? '', pincode: checkout.address?.postal ?? '', country: checkout.address?.country ?? 'India',
  }));
  const [addressId, setAddressId] = useState<string | null>(checkout.addressId);
  const [touched, setTouched] = useState<Partial<Record<keyof Form, boolean>>>({});
  const [pickerOpen, setPickerOpen] = useState(false);
  const [promoOpen, setPromoOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);

  if (bag.length === 0) return <Navigate to="/bag" replace />;

  const totals = bagTotals({ bag, isMember, promo, checkout });
  const lines = bag.flatMap(b => { const p = productById(b.productId); return p ? [{ qty: b.qty, product: p }] : []; });
  const errors = validate(form);
  const valid = Object.keys(errors).length === 0;

  const set = (k: keyof Form) => (v: string) => { setForm(f => ({ ...f, [k]: v })); if (addressId) setAddressId(null); };
  const blur = (k: keyof Form) => () => setTouched(t => ({ ...t, [k]: true }));
  const err = (k: keyof Form) => (touched[k] ? errors[k] : undefined);

  const pick = (a: Address) => {
    setForm({ name: a.name, line1: a.line1, line2: a.line2 ?? '', city: a.city, pincode: a.postal, country: a.country });
    setAddressId(a.id);
    setTouched({});
    setPickerOpen(false);
  };

  const onApplyPromo = () => {
    if (applyPromo(promoCode)) { setPromoError(null); setPromoCode(''); setPromoOpen(false); }
    else setPromoError('Invalid code');
  };

  const onContinue = () => {
    if (!valid) { setTouched({ name: true, line1: true, city: true, pincode: true }); return; }
    const saved = addresses.find(a => a.id === addressId);
    setCheckout({
      addressId,
      address: {
        name: form.name.trim(), line1: form.line1.trim(), line2: form.line2.trim() || undefined, city: form.city.trim(),
        state: saved?.state, postal: form.pincode.trim(), country: form.country, phone: saved?.phone ?? '',
      },
    });
    navigate('/checkout/payment');
  };

  const field = (k: keyof Form, placeholder: string, extra?: { icon?: ReactNode; inputMode?: 'numeric' }) => {
    const e = err(k);
    return (
      <div className={`field ${extra?.icon ? 'field--icon' : ''} ${e ? 'field--error' : ''}`}>
        {extra?.icon && <span className="field__icon" aria-hidden="true">{extra.icon}</span>}
        <input className="field__input" type="text" placeholder={placeholder} aria-label={placeholder} inputMode={extra?.inputMode}
          value={form[k]} onChange={ev => set(k)(ev.target.value)} onBlur={blur(k)} aria-invalid={!!e} />
        {e && <span className="field__error">{e}</span>}
      </div>
    );
  };

  return (
    <div className="screen c11">
      <StatusBar />

      {/* CHECKOUT BAR — back arrow, logo lockup, italic voice line right.
          Replaces the standard app bar for the whole checkout flow (C11/C12). */}
      <header className="checkout-bar">
        <button className="checkout-bar__back" type="button" aria-label="Back to bag" onClick={() => navigate('/bag')}>
          <svg width="33" height="29" viewBox="0 0 20 18" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M19 9H1M8 1 1 9l7 8" /></svg>
        </button>
        <Link className="checkout-bar__logo" to="/home" aria-label="RSN one — Global Family Club">
          <Logo width={186} height={94} />
        </Link>
        <p className="checkout-bar__voice">More than objects,<br />a kinder tomorrow.</p>
      </header>

      {/* STEPPER — step 1 Bag done, step 2 Details current, 3 and 4 ahead. */}
      <nav className="stepper" aria-label="Checkout progress">
        <Link className="step step--done" to="/bag">
          <span className="step__dot" aria-hidden="true">
            <svg width="20" height="15" viewBox="0 0 14 11" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m1 5.5 4 4 8-8" /></svg>
          </span>
          <span className="step__label">Bag</span>
        </Link>
        <span className="step__line" aria-hidden="true" />
        <div className="step step--current" aria-current="step">
          <span className="step__dot">2</span>
          <span className="step__label">Details</span>
        </div>
        <span className="step__line" aria-hidden="true" />
        <div className="step">
          <span className="step__dot">3</span>
          <span className="step__label">Payment</span>
        </div>
        <span className="step__line" aria-hidden="true" />
        <div className="step">
          <span className="step__dot">4</span>
          <span className="step__label">Review</span>
        </div>
      </nav>

      {/* DEVIATION-RISK (handoff): this hairline runs from x=78 to x=504 only — it stops
          at the edge of the left form column and does not continue under the right rail. */}
      <div className="stepper-rule" />

      {/* CHECKOUT BODY — two columns: form 472px left, order rail 302px right. */}
      <div className="checkout">

        {/* LEFT: delivery form */}
        <div className="checkout__form">
          <div className="panel-head">
            <h1 className="t-title delivery-title">Delivery Details</h1>
            <button className={`saved-address ${pickerOpen ? 'saved-address--on' : ''}`} type="button" aria-expanded={pickerOpen} onClick={() => setPickerOpen(o => !o)}>Use saved address</button>
          </div>
          <p className="panel-sub">Where should we send your order?</p>

          {pickerOpen && (
            <ul className="saved-picker" aria-label="Saved addresses">
              {addresses.map(a => (
                <li key={a.id}>
                  <button className={`saved-picker__item ${a.id === addressId ? 'saved-picker__item--on' : ''}`} type="button" onClick={() => pick(a)}>
                    <span className="method__radio" aria-hidden="true" />
                    <span className="method__text">
                      <span className="saved-picker__label">{a.label}{a.isDefault ? ' · Default' : ''}</span>
                      <span className="saved-picker__line">{a.line1}, {a.city}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* address form — 5 inputs, 68px tall, 22px apart. City and Pincode share a row. */}
          {field('name', 'Full Name', { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><circle cx="12" cy="8" r="4" /><path d="M4.5 21a7.5 7.5 0 0 1 15 0" /></svg> })}
          {field('line1', 'Address Line 1', { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" /><circle cx="12" cy="10" r="2.6" /></svg> })}
          {field('line2', 'Address Line 2 (Optional)')}
          <div className="field-row">
            {field('city', 'City')}
            {field('pincode', 'Pincode', { inputMode: 'numeric' })}
          </div>

          <div className="field field--select">
            <select className="field__input" aria-label="Country" value={form.country} onChange={e => set('country')(e.target.value)}>
              {COUNTRIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <span className="field__chev" aria-hidden="true">
              <svg width="26" height="16" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="m1 1 7 7 7-7" /></svg>
            </span>
          </div>

          {/* delivery method — 2 radio rows, 472x79. */}
          <div className="method-head">
            <h2 className="t-title method-title">Delivery Method</h2>
            <p className="panel-sub">Choose how you'd like to receive your order.</p>
          </div>

          <label className={`method ${checkout.delivery === 'standard' ? 'method--on' : ''}`}>
            <input type="radio" name="delivery" checked={checkout.delivery === 'standard'} onChange={() => setCheckout({ delivery: 'standard' })} hidden />
            <span className="method__radio" aria-hidden="true" />
            <span className="method__icon">
              <svg width="42" height="34" viewBox="0 0 26 20" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M1 3h14v11H1V3Z" /><path d="M15 7h5l4 4v3h-9V7Z" /><circle cx="6" cy="16" r="2.4" /><circle cx="18" cy="16" r="2.4" /></svg>
            </span>
            <span className="method__text">
              <span className="method__name">Standard Delivery</span>
              <span className="method__eta">3–5 business days</span>
            </span>
            <span className="method__price">Free</span>
          </label>

          <label className={`method ${checkout.delivery === 'express' ? 'method--on' : ''}`}>
            <input type="radio" name="delivery" checked={checkout.delivery === 'express'} onChange={() => setCheckout({ delivery: 'express' })} hidden />
            <span className="method__radio" aria-hidden="true" />
            <span className="method__icon">
              <svg width="42" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M20 4c0 9-5 14-11 14-2 0-4-1-4-1S8 4 20 4Z" /><path d="M5 19 14 9" /></svg>
            </span>
            <span className="method__text">
              <span className="method__name">Express Delivery</span>
              <span className="method__eta">1–2 business days</span>
            </span>
            <span className="method__price">₹199</span>
          </label>

          {/* DEVIATION-RISK (handoff): Express costs ₹199 but the mock's summary hard-codes
              "Shipping Free". Here the rail recalculates from bagTotals() when Express is picked. */}

          {/* gift note textarea, 472x92 */}
          <div className="note-head">
            <svg width="34" height="30" viewBox="0 0 20 18" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M1 2h18v11H7l-6 4V2Z" /><path d="M5 6h10M5 9h6" /></svg>
            Add a Note <span className="note-head__opt">(Optional)</span>
          </div>
          <textarea className="note-area" placeholder="Add a gift note or special instructions..." aria-label="Add a note"
            value={checkout.note} onChange={e => setCheckout({ note: e.target.value })} />
        </div>

        {/* RIGHT: order rail */}
        <aside className="checkout__rail">
          {/* Order Summary card, 302px wide. Line items with 103x96 thumbnails, then totals. */}
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
              <span className="promo-row__chev" aria-hidden="true">
                <svg width="26" height="16" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="m1 1 7 7 7-7" /></svg>
              </span>
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

          {/* editorial tile, 302x317. Italic voice copy sits ON the photo. */}
          <div className="rail-tile">
            <Img className="rail-tile__media" slot="promo-thoughtful-pieces-01" alt="" width={302} height={317} />
            <p className="rail-tile__copy">Thoughtful<br />pieces.<br />Brighter<br />days.</p>
            <span className="rail-tile__rule" aria-hidden="true" />
          </div>
          {/* ASSUMPTION (handoff): the tag in this photo reads "For a kinder tomorrow." —
              treated as part of the photograph, not as live text. */}
        </aside>
      </div>

      {/* CHECKOUT FOOTER — primary CTA spans the FULL frame width, then the reassurance line. */}
      <div className="checkout-foot">
        <button className="btn checkout-foot__cta" type="button" disabled={!valid} onClick={onContinue}>
          Continue to Payment
          <svg width="30" height="18" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M0 5h14M10 1l4 4-4 4" /></svg>
        </button>
        <p className="checkout-foot__secure">
          <svg width="26" height="30" viewBox="0 0 16 18" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="1" y="7" width="14" height="10" rx="2" /><path d="M4 7V5a4 4 0 0 1 8 0v2" /></svg>
          Your information is secure and encrypted.
        </p>
      </div>

      {/* TAB BAR — DEVIATION-RISK (handoff): the 4-tab bar is drawn during checkout. */}
      <TabBar active="shop" variant="roman" />
    </div>
  );
}
