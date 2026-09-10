import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { HomeIndicator, StatusBar } from '../../components/Chrome';
import { Img, Logo } from '../../components/Img';
import { inr } from '../../lib/money';
import { MEMBERSHIP_FEE, useStore } from '../../store/useStore';
import '../../styles/membership-shared.css';
import './C22MembershipPayment.css';

/**
 * C22 Membership Payment — port of rsn-one-html/C22-MembershipPayment.html.
 * Tier card, 4-up benefits, three payment-method radio rows (the chosen one
 * reveals its detail fields), consent, Pay CTA. Paying calls joinMembership()
 * and lands on C23.
 */
type Method = 'card' | 'upi' | 'netbanking';

const BENEFITS = [
  { title: 'Exclusive Access', text: <>Early access to<br />new drops and<br />limited editions.</>, icon: <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="3" y="9" width="18" height="12" rx="1" /><path d="M3 13h18M12 9v12" /><path d="M12 9S10.5 4 8 4a2 2 0 0 0 0 5h4Zm0 0s1.5-5 4-5a2 2 0 0 1 0 5h-4Z" /></svg> },
  { title: 'Global Curation', text: <>Handpicked objects<br />and homes from<br />around the world.</>, icon: <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c5 5 5 13 0 18M12 3c-5 5-5 13 0 18" /></svg> },
  { title: 'Member Pricing', text: <>Special member<br />rates and privileges.</>, icon: <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M12.5 3H21v8.5L11 21.5 2.5 13 12.5 3Z" /><path d="M16.5 8.5h.01" /><path d="M9 11v4M7 13h4" /></svg> },
  /* DEVIATION-RISK: C21 lists six benefits, C22 four, and "A Global Family" is re-described here. */
  { title: 'A Global Family', text: <>Invitations to<br />curated events<br />and experiences.</>, icon: <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><circle cx="9.5" cy="9" r="3.2" /><circle cx="16.5" cy="10" r="2.4" /><path d="M3.5 19a6 6 0 0 1 12 0M15 19a5 5 0 0 1 5.5-4.7" /></svg> },
];

const METHODS: { id: Method; title: string; sub: string; icon: ReactNode }[] = [
  { id: 'card', title: 'Credit / Debit Card', sub: 'Visa, Mastercard, Rupay and more', icon: <svg width="52" height="40" viewBox="0 0 26 20" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="1" y="2" width="24" height="16" rx="2.5" /><path d="M4 12h5M4 15h3" /></svg> },
  { id: 'upi', title: 'UPI', sub: 'Google Pay, PhonePe, Paytm and more', icon: <svg width="52" height="40" viewBox="0 0 26 20" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M2 5.5A2.5 2.5 0 0 1 4.5 3H21v3" /><rect x="2" y="5.5" width="22" height="12.5" rx="2.5" /><circle cx="19" cy="12" r="1.4" /></svg> },
  { id: 'netbanking', title: 'Net Banking', sub: 'All major banks', icon: <svg width="52" height="40" viewBox="0 0 26 20" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M13 2 2 8h22L13 2Z" /><path d="M5 9v8M10 9v8M16 9v8M21 9v8M2 18h22" /></svg> },
];

const BANKS = ['HDFC', 'ICICI', 'SBI', 'Axis', 'Kotak', 'Nabil', 'NIC Asia'];

const cardBrand = (digits: string) =>
  digits.startsWith('4') ? 'Visa' : digits.startsWith('5') ? 'Mastercard' : digits.startsWith('3') ? 'American Express' : digits.startsWith('6') ? 'RuPay' : 'Card';

export default function C22MembershipPayment() {
  const navigate = useNavigate();
  const isMember = useStore(s => s.isMember);
  const joinMembership = useStore(s => s.joinMembership);

  const [method, setMethod] = useState<Method>('card');
  const [agree, setAgree] = useState(true); // DEVIATION-RISK: pre-ticked in the mock
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [upi, setUpi] = useState('');
  const [bank, setBank] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  /* joinMembership() flips isMember before navigate() lands; without this the
     member guard below would bounce the payer to the wallet instead of C23. */
  const paying = useRef(false);

  if (isMember && !paying.current) return <Navigate to="/member/wallet" replace />;

  const fmtCard = (v: string) => v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
  const fmtExpiry = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d;
  };

  const choose = (m: Method) => { setMethod(m); setErrors({}); };

  const validate = () => {
    const e: Record<string, string> = {};
    if (method === 'card') {
      const digits = card.number.replace(/\s/g, '');
      if (digits.length !== 16) e.number = 'Enter a 16-digit card number';
      const mm = card.expiry.replace(/\D/g, '');
      if (mm.length !== 4 || +mm.slice(0, 2) < 1 || +mm.slice(0, 2) > 12) e.expiry = 'Enter MM / YY';
      if (!/^\d{3,4}$/.test(card.cvv)) e.cvv = 'Enter the CVV';
      if (!card.name.trim()) e.name = 'Enter the name on the card';
    } else if (method === 'upi') {
      if (!/^[\w.-]+@[\w-]+$/.test(upi.trim())) e.upi = 'Enter a valid UPI ID (name@bank)';
    } else if (!bank) e.bank = 'Choose your bank';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const pay = () => {
    if (!agree || !validate()) return;
    const digits = card.number.replace(/\s/g, '');
    const label = method === 'card' ? `${cardBrand(digits)} •••• ${digits.slice(-4)}`
      : method === 'upi' ? `UPI (${upi.trim()})` : `Net Banking (${bank})`;
    paying.current = true;
    joinMembership(label);
    navigate('/membership/welcome');
  };

  const field = (key: string, input: ReactNode, extraClass = '') => (
    <div className={`field ${extraClass} ${errors[key] ? 'field--error' : ''}`}>
      {input}
      {errors[key] && <span className="field__error">{errors[key]}</span>}
    </div>
  );

  const details = () => {
    if (method === 'card') return (
      <li className="c22-fields" key="card-fields">
        {field('number', <input className="field__input" inputMode="numeric" autoComplete="cc-number" placeholder="Card number" value={card.number} onChange={e => setCard({ ...card, number: fmtCard(e.target.value) })} />)}
        <div className="field-row">
          {field('expiry', <input className="field__input" inputMode="numeric" autoComplete="cc-exp" placeholder="MM / YY" value={card.expiry} onChange={e => setCard({ ...card, expiry: fmtExpiry(e.target.value) })} />)}
          {field('cvv', <input className="field__input" inputMode="numeric" autoComplete="cc-csc" placeholder="CVV" type="password" value={card.cvv} onChange={e => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })} />)}
        </div>
        {field('name', <input className="field__input" autoComplete="cc-name" placeholder="Name on card" value={card.name} onChange={e => setCard({ ...card, name: e.target.value })} />)}
      </li>
    );
    if (method === 'upi') return (
      <li className="c22-fields" key="upi-fields">
        {field('upi', <input className="field__input" autoComplete="off" placeholder="UPI ID (name@bank)" value={upi} onChange={e => setUpi(e.target.value)} />)}
      </li>
    );
    return (
      <li className="c22-fields" key="bank-fields">
        {field('bank', <>
          <select className="field__input" value={bank} onChange={e => setBank(e.target.value)} aria-label="Bank">
            <option value="">Choose your bank</option>
            {BANKS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <span className="field__chev" aria-hidden="true"><svg width="18" height="11" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="m1 1 7 7 7-7" /></svg></span>
        </>, 'field--select')}
      </li>
    );
  };

  return (
    <div className="screen screen--photo c22">
      {/* hero photograph — sunlit wall, vase of blossom, stone bowl and a book on a marble ledge. */}
      <div className="hero-shot">
        <Img className="hero-shot__media" slot="hero-membership-payment-01" alt="" width={853} height={1844} />
        <div className="hero-shot__scrim c22-scrim" />
      </div>
      <div className="c22-fade" />

      <StatusBar />

      {/* back bar — rose back arrow, no title. */}
      <nav className="navbar c22-nav">
        <button className="navbar__back" aria-label="Back" onClick={() => navigate('/membership/join')}>
          <svg width="44" height="30" viewBox="0 0 22 15" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M21 7.5H1M7 1.5 1 7.5l6 6" /></svg>
        </button>
      </nav>

      {/* brandmark — shared lockup. */}
      <div className="c22-brand">
        <Link className="brandmark" to="/home" aria-label="RSN one — Global Family Club">
          <Logo width={238} height={120} />
        </Link>
      </div>

      {/* headline — 2 lines, 68px serif; "membership." italic rose. */}
      <div className="c22-copy">
        <h1 className="c22-copy__title">Complete<br />your <em>membership.</em></h1>
        <p className="c22-copy__body">Unlock a more meaningful<br />world with RSN One.</p>
      </div>

      {/* .tier-card — identical component to C21's plan panel, 150px tall. */}
      <section className="tier-card c22-tier" aria-label="RSN One Membership plan">
        <div className="tier-card__main">
          <h3 className="tier-card__name">RSN One Membership</h3>
          <p className="tier-card__desc">More than shopping.<br />A global family.</p>
        </div>
        <div className="tier-card__rule" aria-hidden="true" />
        <div className="tier-card__aside">
          <div><span className="tier-card__price">{inr(MEMBERSHIP_FEE)}</span><span className="tier-card__period">/ year</span></div>
          <p className="tier-card__note">Billed annually</p>
        </div>
      </section>

      {/* "Your Membership Includes" — 4-up benefit grid, 62px discs. */}
      <h2 className="c22-h2">Your Membership Includes</h2>

      <ul className="benefit-grid benefit-grid--4 c22-grid">
        {BENEFITS.map(b => (
          <li className="benefit" key={b.title}>
            <span className="benefit__icon">{b.icon}</span>
            <h3 className="benefit__title">{b.title}</h3>
            <p className="benefit__text">{b.text}</p>
          </li>
        ))}
      </ul>

      {/* "Select Payment Method" — heading with a "Secure Payment" padlock note. */}
      <div className="c22-h2row">
        <h2>Select Payment Method</h2>
        <span className="c22-secure">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>
          Secure Payment
        </span>
      </div>

      {/* Three radio rows, 103px tall, 13px apart. The chosen one reveals its fields. */}
      <ul className="c22-methods" role="radiogroup" aria-label="Payment method">
        {METHODS.map(m => {
          const on = m.id === method;
          return [
            <li key={m.id} className={`data-row ${on ? 'data-row--selected' : ''}`} role="radio" aria-checked={on} tabIndex={0}
              onClick={() => choose(m.id)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(m.id); } }}>
              <span className="c22-method__icon">{m.icon}</span>
              <span className="data-row__body">
                <h3 className="c22-method__title">{m.title}</h3>
                <p className="c22-method__sub">{m.sub}</p>
              </span>
              <span className={`c22-radio ${on ? 'c22-radio--on' : ''}`} aria-hidden="true" />
            </li>,
            on ? details() : null,
          ];
        })}
      </ul>

      {/* consent — 40px rose checkbox, pre-ticked in the mock.
          DEVIATION-RISK: legally this usually has to be an unticked, explicit opt-in. */}
      <label className="c22-consent">
        <span className={`c22-consent__box ${agree ? '' : 'c22-consent__box--off'}`} aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="m5 12.5 4.5 4.5L19 7" /></svg>
        </span>
        <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} hidden />
        <span className="c22-consent__text">I agree to the <Link to="/help" onClick={e => e.stopPropagation()}>Terms & Conditions</Link> and <Link to="/help" onClick={e => e.stopPropagation()}>Privacy Policy</Link>.</span>
      </label>

      {/* primary CTA — 83px rose button, amount repeated in the label. */}
      <button className="btn btn--primary btn--block c22-cta" onClick={pay} disabled={!agree}>
        <span className="t-eyebrow">Pay {inr(MEMBERSHIP_FEE)}</span>
        <svg width="30" height="18" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M0 5h14M10 1l4 4-4 4" /></svg>
      </button>

      <p className="c22-note">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M12 2.5 20 6v6c0 5-3.4 8.3-8 9.5-4.6-1.2-8-4.5-8-9.5V6l8-3.5Z" /></svg>
        Your payment information is secure and encrypted.
      </p>

      <HomeIndicator />
    </div>
  );
}
