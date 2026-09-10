import { Link } from 'react-router-dom';
import { HomeIndicator, StatusBar } from '../../components/Chrome';
import { Img, Logo } from '../../components/Img';
import { useStore } from '../../store/useStore';
import '../../styles/membership-shared.css';
import './C23MembershipConfirmation.css';

/**
 * C23 Membership Confirmation — port of rsn-one-html/C23-MembershipConfirmation.html.
 * Centred lockup, rose tick, "Welcome to RSN One!", the pull-quote set into the
 * photo, then the "What's Next?" plate with three routes and Explore Now.
 */
const NEXT = [
  { to: '/shop', title: <>Shop<br />Curated Collections</>, icon: <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg> },
  { to: '/drops', title: <>Discover<br />Limited Drops</>, icon: <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="m12 3 2.8 5.9 6.2.9-4.5 4.5 1.1 6.4L12 17.7 6.4 20.7l1.1-6.4L3 9.8l6.2-.9L12 3Z" /></svg> },
  { to: '/shop?world=global-select', title: <>Explore<br />Global Makers</>, icon: <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c5 5 5 13 0 18M12 3c-5 5-5 13 0 18" /></svg> },
];

export default function C23MembershipConfirmation() {
  const memberNo = useStore(s => s.user?.memberNo);

  return (
    <div className="screen screen--photo c23">
      {/* hero photograph — the RSN One gift box on a marble ledge, stone bowl, blossom, petals. */}
      <div className="hero-shot">
        <Img className="hero-shot__media" slot="hero-membership-welcome-01" alt="" width={853} height={1844} />
        <div className="hero-shot__scrim c23-scrim" />
      </div>

      <StatusBar />

      {/* DEVIATION-RISK: no back arrow and no tab bar on this screen — "EXPLORE NOW"
          is the only way on. The membership record lives on C17 Me / C33 Wallet. */}

      {/* confirmation stack — all centred: lockup, 110px rose tick, headline, blurb. */}
      <div className="c23-brand">
        <Link className="brandmark brandmark--center" to="/home" aria-label="RSN one — Global Family Club">
          <Logo width={240} height={121} />
        </Link>
      </div>

      <div className="c23-check" aria-hidden="true">
        <svg width="58" height="58" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12.5 4.5 4.5L19 7" /></svg>
      </div>

      <h1 className="c23-title">Welcome to<br /><em>RSN One!</em></h1>
      <p className="c23-sub">Your membership is now active.<br />A more meaningful world awaits you.</p>
      {memberNo && <p className="c23-memberno t-eyebrow">{memberNo}</p>}

      {/* pull-quote set into the photograph, right of the box.
          DEVIATION-RISK: sits on the brightest part of the photo with no scrim of its own. */}
      <p className="c23-voice">Extraordinary<br />objects.<br />A more<br />meaningful<br />you.</p>

      {/* .member-card — the RSN One box is PHOTOGRAPHED INTO hero-membership-welcome-01. */}

      {/* "What's Next?" panel — near-opaque espresso plate, 3 routes, primary CTA. */}
      <section className="c23-next">
        <h2 className="c23-next__title">What’s Next?</h2>
        <p className="c23-next__sub">Start exploring a world of extraordinary objects, <br />homes and experiences.</p>

        <ul className="benefit-grid benefit-grid--3 benefit-grid--ruled c23-grid">
          {NEXT.map(n => (
            <li className="benefit" key={n.to}>
              <Link className="c23-route" to={n.to}>
                <span className="benefit__icon">{n.icon}</span>
                <h3 className="benefit__title">{n.title}</h3>
              </Link>
            </li>
          ))}
        </ul>

        <Link className="btn btn--primary btn--block c23-cta" to="/home">
          <span className="t-eyebrow">Explore Now</span>
          <svg width="30" height="18" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M0 5h14M10 1l4 4-4 4" /></svg>
        </Link>
      </section>

      <HomeIndicator />
    </div>
  );
}
