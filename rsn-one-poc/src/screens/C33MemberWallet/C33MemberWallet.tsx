import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StatusBar, TabBar } from '../../components/Chrome';
import { Img, Logo } from '../../components/Img';
import { fmtDate } from '../../lib/dates';
import { inr } from '../../lib/money';
import { useStore } from '../../store/useStore';
import '../../styles/membership-shared.css';
import './C33MemberWallet.css';

/**
 * C33 Member Wallet — port of rsn-one-html/C33-MemberWallet.html. Balance card,
 * Add Funds / View Usage, breakdown, recent transactions (first three, "View all"
 * expands), promo banner, ME tab active. Everything reads from the store wallet.
 */
const TOPUPS = [1000, 2000, 5000];
/* WalletTx carries no image; the mock shows a product thumbnail per row, so cycle
   the three thumbnails the mock uses. */
const THUMBS = ['prod-copper-vessel-01', 'prod-rsn-candle-01', 'prod-linen-throw-01'];

const Chevron = () => (
  <span className="data-row__chevron" aria-hidden="true">
    <svg width="22" height="34" viewBox="0 0 11 17" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="m2 1 7 7.5L2 16" /></svg>
  </span>
);

export default function C33MemberWallet() {
  const navigate = useNavigate();
  const wallet = useStore(s => s.wallet);
  const isMember = useStore(s => s.isMember);
  const addFunds = useStore(s => s.addFunds);
  const showToast = useStore(s => s.showToast);

  const [topup, setTopup] = useState(false);
  const [amount, setAmount] = useState<number | ''>(TOPUPS[0]);
  const [showAll, setShowAll] = useState(false);
  const txRef = useRef<HTMLDivElement>(null);

  const viewUsage = () => {
    setShowAll(true);
    txRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const toggleAll = () => {
    if (wallet.tx.length <= 3) { setShowAll(true); showToast('Showing all transactions'); return; }
    setShowAll(v => !v);
  };
  const confirmTopup = () => {
    const n = Number(amount);
    if (!n || n <= 0) return;
    addFunds(Math.round(n));
    setTopup(false);
    setAmount(TOPUPS[0]);
  };

  const txs = showAll ? wallet.tx : wallet.tx.slice(0, 3);

  return (
    <div className="screen c33">
      <StatusBar />

      {/* back bar — back arrow and the small lockup on one line. */}
      <nav className="navbar c33-nav">
        <button className="navbar__back" aria-label="Back" onClick={() => navigate(-1)}>
          <svg width="40" height="28" viewBox="0 0 22 15" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M21 7.5H1M7 1.5 1 7.5l6 6" /></svg>
        </button>
        <Link className="brandmark brandmark--sm" to="/home" aria-label="RSN one — Global Family Club">
          <Logo width={168} height={85} />
        </Link>
      </nav>

      {!isMember && (
        <Link className="c33-joinbar" to="/membership/join">
          <span>Join RSN One to unlock your wallet</span>
          <svg width="28" height="16" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M0 5h14M10 1l4 4-4 4" /></svg>
        </Link>
      )}

      {/* screen title — 72px serif, then a 2-line subtitle */}
      <h1 className="c33-title">Member Wallet</h1>
      <p className="c33-sub">Manage your refunds, rewards and<br />credits — all in one place.</p>

      {/* balance card — warm gradient plate with a ribboned gift-box photograph
          bleeding in from the right. */}
      <section className="balance-card" aria-label="Available balance">
        <Img className="balance-card__media" slot="promo-wallet-gift-01" alt="" width={433} height={243} />
        <div className="balance-card__body">
          <h2 className="balance-card__label">Available Balance</h2>
          <p className="balance-card__amount">{inr(wallet.balance)}</p>
          <p className="balance-card__note">Your wallet balance can be used<br />at checkout.</p>
        </div>
      </section>

      {/* action row — filled "ADD FUNDS" + outlined "VIEW USAGE" */}
      <div className="c33-actions">
        <button className="btn btn--primary" onClick={() => setTopup(t => !t)} aria-expanded={topup}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 5v14M5 12h14" /></svg>
          <span className="t-eyebrow">Add Funds</span>
        </button>
        <button className="btn btn--outline" onClick={viewUsage}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M7 17 17 7M9 7h8v8" /></svg>
          <span className="t-eyebrow">View Usage</span>
        </button>
      </div>

      {topup && (
        <div className="c33-topup">
          <p className="c33-topup__label">Choose an amount to add</p>
          <div className="c33-topup__chips">
            {TOPUPS.map(n => (
              <button key={n} className={`chip c33-topup__chip ${amount === n ? 'c33-topup__chip--on' : ''}`} onClick={() => setAmount(n)}>{inr(n)}</button>
            ))}
          </div>
          <div className="c33-topup__row">
            <input className="c33-topup__input" type="number" min={100} step={100} inputMode="numeric" placeholder="Custom amount (₹)"
              value={amount} onChange={e => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
              onKeyDown={e => { if (e.key === 'Enter') confirmTopup(); }} aria-label="Custom amount" />
            <button className="btn btn--primary" onClick={confirmTopup} disabled={!amount || Number(amount) <= 0}>
              <span className="t-eyebrow">Add {amount ? inr(Number(amount)) : ''}</span>
            </button>
            <button className="c33-topup__cancel" onClick={() => setTopup(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* "Wallet Breakdown" — two 105px .data-row entries */}
      <h2 className="c33-h2">Wallet Breakdown</h2>

      <ul className="c33-breakdown">
        <li className="data-row" onClick={viewUsage}>
          <span className="data-row__icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="3" y="9" width="18" height="12" rx="1" /><path d="M3 13h18M12 9v12" /><path d="M12 9S10.5 4 8 4a2 2 0 0 0 0 5h4Zm0 0s1.5-5 4-5a2 2 0 0 1 0 5h-4Z" /></svg>
          </span>
          <span className="data-row__body">
            <h3 className="data-row__title">Refunds</h3>
            <p className="data-row__sub">Amount from returned orders</p>
          </span>
          <span className="data-row__value">{inr(wallet.refunds)}</span>
          <Chevron />
        </li>
        <li className="data-row" onClick={viewUsage}>
          <span className="data-row__icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="m12 3 2.8 5.9 6.2.9-4.5 4.5 1.1 6.4L12 17.7 6.4 20.7l1.1-6.4L3 9.8l6.2-.9L12 3Z" /></svg>
          </span>
          <span className="data-row__body">
            <h3 className="data-row__title">Rewards & Credits</h3>
            <p className="data-row__sub">Exclusive member rewards</p>
          </span>
          <span className="data-row__value">{inr(wallet.rewards)}</span>
          <Chevron />
        </li>
      </ul>

      {/* "Recent Transactions" + "View all" — 107px rows with a 136x90 thumbnail.
          ASSUMPTION: the list is a recent-activity feed, not a full ledger. */}
      <div className="c33-head" ref={txRef}>
        <h2>Recent Transactions</h2>
        <button onClick={toggleAll} aria-expanded={showAll}>{showAll && wallet.tx.length > 3 ? 'Show less' : 'View all'}
          <svg width="30" height="18" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M0 5h14M10 1l4 4-4 4" /></svg>
        </button>
      </div>

      <ul className="c33-txns">
        {txs.length === 0 && <li className="c33-empty">No transactions yet.</li>}
        {txs.map((t, i) => (
          <li className="data-row" key={t.id}>
            <Img className="data-row__thumb" slot={THUMBS[i % THUMBS.length]} alt="" width={136} height={90} />
            <span className="data-row__body">
              <h3 className="data-row__title">{t.title}</h3>
              <p className="data-row__sub">{t.ref}</p>
              <p className="data-row__meta">{fmtDate(t.at)}</p>
            </span>
            <span className={`data-row__value ${t.amount < 0 ? 'data-row__value--debit' : 'data-row__value--credit'}`}>
              {t.amount < 0 ? inr(t.amount) : inr(t.amount, { sign: true })}
            </span>
            <Chevron />
          </li>
        ))}
      </ul>

      {/* promo banner — 178px light editorial strip, same photo as C34. */}
      <Link className="promo-banner c33-promo" to="/membership">
        <Img className="promo-banner__media" slot="promo-quiet-table-01" alt="" width={773} height={178} />
        <div className="promo-banner__scrim" />
        <div className="promo-banner__body">
          <div className="promo-banner__title">More rewards.<br />A more <em>thoughtful</em> tomorrow.</div>
          <span className="promo-banner__link">Explore Member Benefits
            <svg width="28" height="16" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M0 5h14M10 1l4 4-4 4" /></svg>
          </span>
        </div>
      </Link>

      {/* tab bar — ME active. 144px here vs 88px on C03 (see CSS note). */}
      <TabBar active="me" />
    </div>
  );
}
