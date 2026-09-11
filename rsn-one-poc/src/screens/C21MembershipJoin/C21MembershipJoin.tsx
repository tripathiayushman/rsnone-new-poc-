import { Link, Navigate, useNavigate } from 'react-router-dom';
import { HomeIndicator, StatusBar } from '../../components/Chrome';
import { Img, Logo } from '../../components/Img';
import { inr } from '../../lib/money';
import { MEMBERSHIP_FEE, useStore } from '../../store/useStore';
import '../../styles/membership-shared.css';
import './C21MembershipJoin.css';

/**
 * C21 Membership Join — port of rsn-one-html/C21-MembershipJoin.html. Photo hero
 * with a left-weighted scrim, the lockup, headline, a 3x2 benefits grid, the
 * tier card and the Join Now CTA. Members are sent straight to their wallet.
 */
const BENEFITS = [
  { title: 'Exclusive Access', text: <>Early access to<br />new drops and<br />limited editions.</>, icon: <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="3" y="9" width="18" height="12" rx="1" /><path d="M3 13h18M12 9v12" /><path d="M12 9S10.5 4 8 4a2 2 0 0 0 0 5h4Zm0 0s1.5-5 4-5a2 2 0 0 1 0 5h-4Z" /></svg> },
  { title: 'Global Curation', text: <>Handpicked objects<br />and homes from<br />around the world.</>, icon: <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c5 5 5 13 0 18M12 3c-5 5-5 13 0 18" /></svg> },
  { title: 'Member Pricing', text: <>Special member<br />rates and privileges.</>, icon: <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M12.5 3H21v8.5L11 21.5 2.5 13 12.5 3Z" /><path d="M16.5 8.5h.01" /><path d="M9 11v4M7 13h4" /></svg> },
  { title: 'Curated Stories', text: <>Inspiring stories<br />behind extraordinary<br />makers and homes.</>, icon: <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M12 20.5S3 14.8 3 9.2A5 5 0 0 1 12 6.5 5 5 0 0 1 21 9.2c0 5.6-9 11.3-9 11.3Z" /></svg> },
  { title: 'Invitations', text: <>Access to private<br />events and<br />exclusive experiences.</>, icon: <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="m12 3 2.8 5.9 6.2.9-4.5 4.5 1.1 6.4L12 17.7 6.4 20.7l1.1-6.4L3 9.8l6.2-.9L12 3Z" /></svg> },
  { title: 'A Global Family', text: <>Join a community<br />that values beauty,<br />culture and meaning.</>, icon: <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><circle cx="9.5" cy="9" r="3.2" /><circle cx="16.5" cy="10" r="2.4" /><path d="M3.5 19a6 6 0 0 1 12 0M15 19a5 5 0 0 1 5.5-4.7" /></svg> },
];

export default function C21MembershipJoin() {
  const navigate = useNavigate();
  const isMember = useStore(s => s.isMember);
  if (isMember) return <Navigate to="/member/wallet" replace />;

  return (
    <div className="screen screen--photo c21">
      {/* hero photograph — arched alcove, vase of blossom, stone bowl and the RSN One
          card standing on a marble plinth. Left-weighted scrim, then a fade to espresso. */}
      <div className="hero-shot">
        <Img className="hero-shot__media" slot="hero-membership-join-01" alt="" width={853} height={1844} />
        <div className="hero-shot__scrim c21-scrim" />
      </div>
      <div className="c21-fade" />

      <StatusBar />

      {/* back bar — rose back arrow only, no title. */}
      <nav className="navbar c21-nav">
        <button className="navbar__back" aria-label="Back" onClick={() => navigate(-1)}>
          <svg width="44" height="30" viewBox="0 0 22 15" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M21 7.5H1M7 1.5 1 7.5l6 6" /></svg>
        </button>
      </nav>

      {/* brandmark — the whole lockup ships as one asset. */}
      <div className="c21-brand">
        <Link className="brandmark" to="/home" aria-label="RSN one — Global Family Club">
          <Logo width={240} height={121} />
        </Link>
      </div>

      {/* headline — 3 lines, 68px serif on 70px leading, line 2 italic rose. */}
      <div className="c21-copy">
        <h1 className="c21-copy__title">A more <em>meaningful</em> way to belong.</h1>
        <p className="c21-copy__body">Join RSN One and get closer<br />to extraordinary objects,<br />homes and experiences<br />from around the world.</p>
      </div>

      {/* .member-card — photographed into hero-membership-join-01; not a separate layer. */}

      {/* "Membership Benefits" — 3 x 2 grid. */}
      <h2 className="c21-benefits-title">Membership Benefits</h2>

      <ul className="benefit-grid benefit-grid--3 c21-grid">
        {BENEFITS.map(b => (
          <li className="benefit" key={b.title}>
            <span className="benefit__icon">{b.icon}</span>
            <h3 className="benefit__title">{b.title}</h3>
          </li>
        ))}
      </ul>

      {/* .tier-card — the plan panel. Same component on C22. */}
      <section className="tier-card c21-tier" aria-label="RSN One Membership plan">
        <div className="tier-card__main">
          <h3 className="tier-card__name">RSN One Membership</h3>
          <p className="tier-card__desc">More than shopping.<br />A global family.</p>
        </div>
        <div className="tier-card__rule" aria-hidden="true" />
        <div className="tier-card__aside">
          <div><span className="tier-card__price">{inr(MEMBERSHIP_FEE)}</span><span className="tier-card__period">/ year</span></div>
          <p className="tier-card__note">Unlock a more<br />meaningful world.</p>
        </div>
      </section>

      {/* primary CTA — 83px tall rose button, full gutter width.
          DEVIATION-RISK: nothing on this screen states the renewal terms beyond "/ year". */}
      <button className="btn btn--primary btn--block c21-cta" onClick={() => navigate('/membership/payment')}>
        <span className="t-eyebrow">Join Now</span>
        <svg width="30" height="18" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M0 5h14M10 1l4 4-4 4" /></svg>
      </button>

      {/* Secondary text link, centred and underlined */}
      <Link className="c21-link" to="/membership">Learn more about membership</Link>

      <HomeIndicator />
    </div>
  );
}
