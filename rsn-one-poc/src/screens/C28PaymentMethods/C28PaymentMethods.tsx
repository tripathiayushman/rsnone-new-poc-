import { useEffect, useRef, useState, type FormEvent } from 'react';
import { NavBar, StatusBar, TabBar } from '../../components/Chrome';
import { useStore } from '../../store/useStore';
import type { PaymentMethod } from '../../data/types';
import './C28PaymentMethods.css';

type Brand = NonNullable<PaymentMethod['brand']>;
const ART: Record<Brand, string> = { Visa: 'visa', Mastercard: 'mastercard', 'American Express': 'amex', RuPay: 'rupay' };

/** Brand from the first digit: 4 Visa, 5 Mastercard, 3 Amex, else RuPay. */
function detectBrand(num: string): Brand {
  const d = num.replace(/\D/g, '');
  if (d.startsWith('4')) return 'Visa';
  if (d.startsWith('5')) return 'Mastercard';
  if (d.startsWith('3')) return 'American Express';
  return 'RuPay';
}
const fmtNumber = (v: string) => v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
const fmtExpiry = (v: string) => { const d = v.replace(/\D/g, '').slice(0, 4); return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d; };
function validExpiry(v: string) {
  const m = /^(\d{2})\/(\d{2})$/.exec(v);
  if (!m) return false;
  const mm = Number(m[1]), yy = 2000 + Number(m[2]);
  if (mm < 1 || mm > 12) return false;
  const now = new Date();
  return yy > now.getFullYear() || (yy === now.getFullYear() && mm >= now.getMonth() + 1);
}
const UPI_RE = /^[a-z0-9][a-z0-9._-]{1,}@[a-z]{2,}$/i;

/** Card artwork built in CSS — the promo-card-* image slots were not supplied. */
function CardArt({ brand }: { brand?: Brand }) {
  const key = brand ? ART[brand] : 'upi';
  return (
    <span className={`pay-card__art pay-card__art--${key}`} aria-hidden="true">
      {brand === 'Mastercard' && <span className="pay-card__mc" />}
      <span className="pay-card__arc" />
    </span>
  );
}

const DOTS = <svg width="26" height="6" viewBox="0 0 26 6" fill="currentColor"><circle cx="3" cy="3" r="3" /><circle cx="13" cy="3" r="3" /><circle cx="23" cy="3" r="3" /></svg>;
const PLUS = <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>;

/**
 * C28 Payment Methods — port of rsn-one-html/C28-PaymentMethods.html. Cards and UPI
 * handles come from the store; "Add Card" / "Add UPI" open inline forms; the "..."
 * menu offers Set as default / Remove.
 */
export default function C28PaymentMethods() {
  const paymentMethods = useStore(s => s.paymentMethods);
  const addPaymentMethod = useStore(s => s.addPaymentMethod);
  const removePaymentMethod = useStore(s => s.removePaymentMethod);
  const setDefaultPaymentMethod = useStore(s => s.setDefaultPaymentMethod);
  const showToast = useStore(s => s.showToast);

  const cards = paymentMethods.filter(p => p.kind === 'card');
  const upis = paymentMethods.filter(p => p.kind === 'upi');

  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [cardOpen, setCardOpen] = useState(false);
  const [card, setCard] = useState({ number: '', expiry: '', name: '' });
  const [cardTried, setCardTried] = useState(false);
  const [upiOpen, setUpiOpen] = useState(false);
  const [upi, setUpi] = useState('');
  const [upiTried, setUpiTried] = useState(false);
  const numberRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (cardOpen) {
      numberRef.current?.focus();
      numberRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }, [cardOpen]);

  const cardDigits = card.number.replace(/\D/g, '');
  const cardErrors = {
    number: cardDigits.length === 16 ? '' : 'Enter a 16-digit card number',
    expiry: validExpiry(card.expiry) ? '' : 'Enter a valid expiry (MM/YY)',
    name: card.name.trim() ? '' : 'Name on card is required',
  };
  const cardValid = !cardErrors.number && !cardErrors.expiry && !cardErrors.name;
  const cErr = (k: keyof typeof cardErrors) => (cardTried ? cardErrors[k] : '');

  const saveCard = (e: FormEvent) => {
    e.preventDefault();
    setCardTried(true);
    if (!cardValid) return;
    addPaymentMethod({ kind: 'card', brand: detectBrand(card.number), last4: cardDigits.slice(-4), expiry: card.expiry, isDefault: cards.length === 0 });
    showToast(`${detectBrand(card.number)} •••• ${cardDigits.slice(-4)} added`);
    setCard({ number: '', expiry: '', name: '' }); setCardTried(false); setCardOpen(false);
  };
  const saveUpi = (e: FormEvent) => {
    e.preventDefault();
    setUpiTried(true);
    const id = upi.trim();
    if (!UPI_RE.test(id)) return;
    addPaymentMethod({ kind: 'upi', upiId: id, isDefault: false });
    showToast(`${id} added`);
    setUpi(''); setUpiTried(false); setUpiOpen(false);
  };

  const onSetDefault = (p: PaymentMethod) => {
    setMenuFor(null);
    setDefaultPaymentMethod(p.id);
    showToast(`${p.kind === 'card' ? `${p.brand} •••• ${p.last4}` : p.upiId} is now your default`);
  };
  const onRemove = (p: PaymentMethod) => {
    setMenuFor(null);
    const label = p.kind === 'card' ? `${p.brand} ending ${p.last4}` : p.upiId;
    if (window.confirm(`Remove ${label}?`)) { removePaymentMethod(p.id); showToast('Payment method removed'); }
  };

  const menu = (p: PaymentMethod, label: string) => (
    <>
      <button className="pay-card__menu" aria-label={`More options for ${label}`} aria-haspopup="menu" aria-expanded={menuFor === p.id}
        onClick={() => setMenuFor(menuFor === p.id ? null : p.id)}>{DOTS}</button>
      {menuFor === p.id && (
        <div className="pay-card__popover" role="menu">
          {!p.isDefault && <button type="button" role="menuitem" onClick={() => onSetDefault(p)}>Set as default</button>}
          <button type="button" role="menuitem" className="is-danger" onClick={() => onRemove(p)}>Remove</button>
        </div>
      )}
    </>
  );

  return (
    <div className="screen c28">
      <StatusBar />

      {menuFor && <div className="menu-backdrop" onClick={() => setMenuFor(null)} />}

      <div className="page">
        {/* NAV BAR — back arrow only (rose), no title text */}
        <NavBar />

        {/* PAGE HEAD — screen title + 2-line supporting line */}
        <header className="page-head">
          <h1 className="t-h1">Payment Methods</h1>
          <p className="t-body-lg page-head__sub">Save and manage your payment methods<br />for a faster, more seamless checkout.</p>
        </header>

        {/* SECTION: Cards — saved cards 14px apart; artwork drawn in CSS.
            ASSUMPTION (handoff): the artwork slots promo-card-*-01 were not supplied,
            so the brand tiles are gradient + mark + RSN arc built in CSS. */}
        <section className="pay-section">
          <div className="pay-section__head">
            <h2 className="t-section">Cards</h2>
            <button className="pay-section__add" aria-expanded={cardOpen} onClick={() => setCardOpen(o => !o)}>Add Card {PLUS}</button>
          </div>

          {cardOpen && (
            <form className="pay-form" onSubmit={saveCard} noValidate aria-label="Add a card">
              <label className={`field ${cErr('number') ? 'field--error' : ''}`}>
                <span className="field__body">
                  <span className="field__label">Card Number</span>
                  <input ref={numberRef} className="field__input" inputMode="numeric" autoComplete="cc-number" placeholder="1234 5678 9012 3456"
                    value={card.number} onChange={e => setCard({ ...card, number: fmtNumber(e.target.value) })} />
                  {cErr('number') && <span className="field__error">{cErr('number')}</span>}
                </span>
                {cardDigits && <span className="field__brand">{detectBrand(card.number)}</span>}
              </label>
              <div className="pay-form__row">
                <label className={`field ${cErr('expiry') ? 'field--error' : ''}`}>
                  <span className="field__body">
                    <span className="field__label">Expiry (MM/YY)</span>
                    <input className="field__input" inputMode="numeric" autoComplete="cc-exp" placeholder="MM/YY" maxLength={5}
                      value={card.expiry} onChange={e => setCard({ ...card, expiry: fmtExpiry(e.target.value) })} />
                    {cErr('expiry') && <span className="field__error">{cErr('expiry')}</span>}
                  </span>
                </label>
                <label className={`field ${cErr('name') ? 'field--error' : ''}`}>
                  <span className="field__body">
                    <span className="field__label">Name on Card</span>
                    <input className="field__input" autoComplete="cc-name" placeholder="Name on Card"
                      value={card.name} onChange={e => setCard({ ...card, name: e.target.value })} />
                    {cErr('name') && <span className="field__error">{cErr('name')}</span>}
                  </span>
                </label>
              </div>
              <div className="pay-form__actions">
                <button type="submit" className="btn btn--primary">Save Card</button>
                <button type="button" className="btn btn--outline" onClick={() => { setCardOpen(false); setCardTried(false); }}>Cancel</button>
              </div>
            </form>
          )}

          <ul className="pay-list">
            {cards.length === 0 && <li><p className="pay-list__empty">No saved cards yet.</p></li>}
            {cards.map(p => (
              <li className="pay-card" key={p.id}>
                <CardArt brand={p.brand} />
                <div className="pay-card__body">
                  <h3 className="pay-card__name">{p.brand}</h3>
                  <p className="pay-card__number"><b>••••</b>{p.last4}</p>
                  <p className="pay-card__expiry">Expiry<span>{p.expiry}</span></p>
                </div>
                {p.isDefault && <span className="pay-card__default">Default</span>}
                {menu(p, `${p.brand} ending ${p.last4}`)}
              </li>
            ))}
          </ul>
        </section>

        {/* SECTION: UPI — saved handles, 113px rows with 170 x 85 artwork */}
        <section className="pay-section">
          <div className="pay-section__head">
            <h2 className="t-section">UPI</h2>
            <button className="pay-section__add" aria-expanded={upiOpen} onClick={() => setUpiOpen(o => !o)}>Add UPI {PLUS}</button>
          </div>

          {upiOpen && (
            <form className="pay-form" onSubmit={saveUpi} noValidate aria-label="Add a UPI ID">
              <label className={`field ${upiTried && !UPI_RE.test(upi.trim()) ? 'field--error' : ''}`}>
                <span className="field__body">
                  <span className="field__label">UPI ID</span>
                  <input className="field__input" placeholder="name@bank" autoCapitalize="none" autoFocus
                    value={upi} onChange={e => setUpi(e.target.value)} />
                  {upiTried && !UPI_RE.test(upi.trim()) && <span className="field__error">Enter a valid UPI ID, e.g. name@okaxis</span>}
                </span>
              </label>
              <div className="pay-form__actions">
                <button type="submit" className="btn btn--primary">Save UPI</button>
                <button type="button" className="btn btn--outline" onClick={() => { setUpiOpen(false); setUpiTried(false); }}>Cancel</button>
              </div>
            </form>
          )}

          <ul className="pay-list">
            {upis.length === 0 && <li><p className="pay-list__empty">No saved UPI IDs yet.</p></li>}
            {upis.map(p => (
              <li className="pay-card pay-card--upi" key={p.id}>
                <CardArt />
                <div className="pay-card__body">
                  <p className="pay-card__handle">{p.upiId}</p>
                </div>
                {p.isDefault && <span className="pay-card__default">Default</span>}
                {menu(p, `UPI ${p.upiId}`)}
              </li>
            ))}
          </ul>
        </section>

        {/* SECTION: More Payment Options — single push row.
            DEVIATION-RISK (handoff): no "Add …" action here and only one row. */}
        <section className="pay-section">
          <div className="pay-section__head">
            <h2 className="t-section">More Payment Options</h2>
          </div>
          <button className="pay-option" type="button" onClick={() => showToast('Net Banking is available at checkout')}>
            <span className="pay-option__icon" aria-hidden="true">
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"><path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H18a2 2 0 0 1 2 2v1" /><rect x="3" y="7.5" width="18" height="11.5" rx="2.5" /><circle cx="16.5" cy="13.2" r="1.4" /></svg>
            </span>
            <span className="pay-option__body">
              <span className="pay-option__title">Net Banking</span>
              <span className="pay-option__desc">Pay securely through your bank</span>
            </span>
            <span className="pay-option__chevron">
              <svg width="20" height="36" viewBox="0 0 14 26" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2 2l10 11L2 24" /></svg>
            </span>
          </button>
        </section>

        {/* SECURITY NOTE — shield-check + 2 lines */}
        <div className="secure">
          <span className="secure__icon" aria-hidden="true">
            <svg width="40" height="48" viewBox="0 0 20 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M10 1.5 18 5v7c0 5-3.4 8.6-8 10.5C5.4 20.6 2 17 2 12V5l8-3.5Z" /><path d="m6.6 11.6 2.6 2.6 4.5-4.9" /></svg>
          </span>
          <p className="secure__text">Your payment information is secure and encrypted.<br />
            <span>We never store your complete card details.</span></p>
        </div>

        {/* PRIMARY ACTION — opens (and focuses) the Add Card form.
            DEVIATION-RISK (handoff): duplicates the per-section "Add …" actions. */}
        <div className="page-action">
          <button className="btn btn--primary btn--block btn--add" type="button" onClick={() => { setCardOpen(true); numberRef.current?.focus(); }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
            Add Payment Method
          </button>
        </div>
      </div>

      <TabBar active="me" />
    </div>
  );
}
