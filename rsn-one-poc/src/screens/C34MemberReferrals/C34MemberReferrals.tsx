import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StatusBar, TabBar } from '../../components/Chrome';
import { Img, Logo } from '../../components/Img';
import { REFERRAL_LINK } from '../../data/seed';
import { fmtDate } from '../../lib/dates';
import { inr } from '../../lib/money';
import { useStore } from '../../store/useStore';
import '../../styles/membership-shared.css';
import './C34MemberReferrals.css';

/**
 * C34 Member Referrals — port of rsn-one-html/C34-MemberReferrals.html. Hero
 * card, Share Invite Link + read-only invite field with Copy, rewards split,
 * stats, recent referrals (from the store) and the promo banner. ME tab active.
 */
export default function C34MemberReferrals() {
  const navigate = useNavigate();
  const referrals = useStore(s => s.referrals);
  const stats = useStore(s => s.referralStats);
  const showToast = useStore(s => s.showToast);
  const [showAll, setShowAll] = useState(false);

  const share = async () => {
    try { await navigator.clipboard.writeText(REFERRAL_LINK); } catch { /* clipboard blocked — toast still confirms the link */ }
    if (typeof navigator.share === 'function') {
      try { await navigator.share({ title: 'Join RSN One', text: 'Join me at RSN One — a global family club.', url: REFERRAL_LINK }); } catch { /* user dismissed the sheet */ }
    }
    showToast('Invite link copied');
  };
  const viewAll = () => { setShowAll(true); showToast('Showing all referrals'); };

  const list = showAll ? referrals : referrals.slice(0, 2);

  return (
    <div className="screen c34">
      <StatusBar />

      {/* back bar — back arrow + small lockup, same block as C33. */}
      <nav className="navbar c34-nav">
        <button className="navbar__back" aria-label="Back" onClick={() => navigate(-1)}>
          <svg width="40" height="28" viewBox="0 0 22 15" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M21 7.5H1M7 1.5 1 7.5l6 6" /></svg>
        </button>
        <Link className="brandmark brandmark--sm" to="/home" aria-label="RSN one — Global Family Club">
          <Logo width={156} height={79} />
        </Link>
      </nav>

      <h1 className="c34-title">Refer a Friend</h1>
      <p className="c34-sub">Share the extraordinary. Invite your<br />friends and earn rewards together.</p>

      {/* referral hero card — 772 x 263, light photograph of a ribboned gift box. */}
      <div className="referral-hero">
        <Img className="referral-hero__media" slot="promo-referral-gift-01" alt="" width={772} height={263} />
        <div className="referral-hero__scrim" />
        <div className="referral-hero__body">
          <div className="referral-hero__title">A more<br /><em>thoughtful</em> circle.</div>
          <p className="referral-hero__text">Give your friends 10% off<br />their first order, and earn<br />₹1,000 for each successful referral.</p>
        </div>
      </div>

      {/* share action — 77px rose button, then the invite link in a read-only field with Copy. */}
      <button className="btn btn--primary btn--block c34-share" onClick={share}>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M12 16V4M8 8l4-4 4 4" /><path d="M5 14v5h14v-5" /></svg>
        <span className="t-eyebrow">Share Invite Link</span>
      </button>

      <div className="invite-field">
        <input className="invite-field__input" type="text" value={REFERRAL_LINK} readOnly aria-label="Your invite link" onFocus={e => e.target.select()} />
        <span className="invite-field__rule" aria-hidden="true" />
        <button className="invite-field__copy" onClick={share}>Copy</button>
      </div>

      {/* "Your Rewards" — one 138px panel split in two by a hairline. */}
      <h2 className="c34-h2">Your Rewards</h2>

      <div className="reward-split">
        <div className="reward-split__half">
          <span className="data-row__icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="3" y="9" width="18" height="12" rx="1" /><path d="M3 13h18M12 9v12" /><path d="M12 9S10.5 4 8 4a2 2 0 0 0 0 5h4Zm0 0s1.5-5 4-5a2 2 0 0 1 0 5h-4Z" /></svg>
          </span>
          <span>
            <p className="reward-split__amount">₹1,000</p>
            <p className="reward-split__label">for each successful<br />referral</p>
          </span>
        </div>
        <span className="reward-split__rule" aria-hidden="true" />
        <div className="reward-split__half">
          <span className="data-row__icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M12.5 3H21v8.5L11 21.5 2.5 13 12.5 3Z" /><path d="M16.6 8.4h.01" /></svg>
          </span>
          <span>
            <p className="reward-split__amount">10% Off</p>
            <p className="reward-split__label">for your friend's<br />first order</p>
          </span>
        </div>
      </div>

      {/* "Referral Stats" + "View all" — one 117px panel, three cells.
          ASSUMPTION: 8 successful referrals x ₹1,000 = ₹8,000, matching "Total Earnings". */}
      <div className="c34-head">
        <h2>Referral Stats</h2>
        <button onClick={viewAll} aria-expanded={showAll}>View all
          <svg width="30" height="18" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M0 5h14M10 1l4 4-4 4" /></svg>
        </button>
      </div>

      <div className="stat-split">
        <div className="stat-split__cell">
          <p className="stat-split__num">{stats.invited}</p>
          <p className="stat-split__label">Friends Invited</p>
        </div>
        <span className="stat-split__rule" aria-hidden="true" />
        <div className="stat-split__cell">
          <p className="stat-split__num">{stats.successful}</p>
          <p className="stat-split__label">Successful Referrals</p>
        </div>
        <span className="stat-split__rule" aria-hidden="true" />
        <div className="stat-split__cell">
          <p className="stat-split__num">{inr(stats.earnings)}</p>
          <p className="stat-split__label">Total Earnings</p>
        </div>
      </div>

      {/* "Recent Referrals" — 89px .data-row entries with an initial-letter disc.
          DEVIATION-RISK: 8 successful referrals but only 2 rows in the mock; "View all" above expands. */}
      <h2 className="c34-h2">Recent Referrals</h2>

      <ul className="c34-referrals">
        {list.length === 0 && <li className="c34-empty">No referrals yet — share your link to get started.</li>}
        {list.map(r => (
          <li className="data-row" key={r.id}>
            <span className="data-row__icon c34-avatar" aria-hidden="true">{r.name.charAt(0)}</span>
            <span className="data-row__body">
              <h3 className="data-row__title">{r.name}</h3>
              <p className="data-row__sub">Joined on {fmtDate(r.joinedAt)}</p>
            </span>
            <span className="data-row__value data-row__value--credit">{inr(r.reward, { sign: true })}</span>
          </li>
        ))}
      </ul>

      {/* promo banner — 170px, same .promo-banner component and photo as C33. Shares the link. */}
      <button className="promo-banner c34-promo" onClick={share}>
        <Img className="promo-banner__media" slot="promo-quiet-table-01" alt="" width={772} height={170} />
        <div className="promo-banner__scrim" />
        <div className="promo-banner__body">
          <div className="promo-banner__title">Extraordinary living<br />is better <em>together.</em></div>
          <span className="promo-banner__link">Build your global family
            <svg width="28" height="16" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M0 5h14M10 1l4 4-4 4" /></svg>
          </span>
        </div>
      </button>

      {/* tab bar — ME active. Same 144px height note as C33. */}
      <TabBar active="me" />
    </div>
  );
}
