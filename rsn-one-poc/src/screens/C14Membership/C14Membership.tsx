import { Link, useNavigate } from 'react-router-dom';
import { HomeIndicator, StatusBar } from '../../components/Chrome';
import { Img } from '../../components/Img';
import { useStore } from '../../store/useStore';
import '../../styles/membership-shared.css';
import './C14Membership.css';

/**
 * C14 Membership — port of rsn-one-html/C14-Membership.html. A poster: one
 * full-bleed pale photograph (the physical card is photographed into it), dark
 * ink type, five benefits, one CTA. No app bar, no tab bar, no back arrow in
 * the mock — so none are added here.
 */
const BENEFITS = [
  { label: 'Member pricing', icon: <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="3" y="9" width="18" height="12" rx="1" /><path d="M3 13h18M12 9v12" /><path d="M12 9S10.5 4 8 4a2 2 0 0 0 0 5h4Zm0 0s1.5-5 4-5a2 2 0 0 1 0 5h-4Z" /></svg> },
  { label: 'Early access', icon: <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /><circle cx="12" cy="15.5" r="1.4" /></svg> },
  /* ASSUMPTION: this icon is an Eiffel Tower in the mock. Reading it as
     "travel / far-away places" for "Private discoveries". */
  { label: 'Private discoveries', icon: <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M12 2v3M10.6 5h2.8M9.4 11h5.2M7.6 16h8.8M12 5c0 5-3.5 11-5.5 16M12 5c0 5 3.5 11 5.5 16M5 21h14" /></svg> },
  { label: 'Concierge', icon: <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><circle cx="12" cy="8" r="4" /><path d="M4.5 21a7.5 7.5 0 0 1 15 0" /></svg> },
  { label: 'Rewards', icon: <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><circle cx="12" cy="9" r="6" /><path d="m9.2 8.8 2.8-2 2.8 2-1.1 3.3H10.3L9.2 8.8Z" /><path d="m8.6 14.4-2 6.6 5.4-2.6 5.4 2.6-2-6.6" /></svg> },
];

export default function C14Membership() {
  const navigate = useNavigate();
  const isAuthed = useStore(s => s.isAuthed);
  const isMember = useStore(s => s.isMember);

  const become = () => {
    if (isAuthed) navigate('/membership/join');
    else navigate('/login', { state: { returnTo: '/membership/join' } });
  };

  return (
    <div className="screen screen--photo c14">
      {/* hero photograph — the whole screen is one image: a pale pink linen
          throw with the physical RSN One membership card lying on it. */}
      <div className="hero-shot">
        <Img className="hero-shot__media" slot="hero-membership-01" alt="" width={853} height={1844} />
      </div>

      {/* dark glyphs here (.statusbar--ink) because the photograph is pale at the top */}
      <StatusBar className="statusbar--ink" />

      {/* DEVIATION-RISK: there is NO back arrow, close button or tab bar on this
          screen. Once the user is here the only exit is "BECOME A MEMBER". */}

      {/* poster copy — single-line serif headline, two-line sans subtitle, benefit list */}
      <div className="poster">
        <h1 className="poster__title">{isMember ? 'You’re in.' : 'Take your place.'}</h1>
        <p className="poster__body">More than shopping.<br />A global family.</p>

        <ul className="benefit-list poster__benefits">
          {BENEFITS.map(b => (
            <li className="benefit-list__item" key={b.label}>
              <span className="benefit-list__icon">{b.icon}</span>
              <span className="benefit-list__label">{b.label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* .member-card — the physical RSN One card is PHOTOGRAPHED INTO
          hero-membership-01; it is not a separate DOM layer in the mock. */}

      {/* CTA — 140px tall rose button, 52px gutter, sits at the bottom of the
          stack (84px above the home indicator). Members get Wallet / Referrals instead. */}
      {isMember ? (
        <div className="c14-cta-row">
          <Link className="btn btn--primary c14-cta" to="/member/wallet">
            <span className="t-eyebrow">Member Wallet</span>
          </Link>
          <Link className="btn c14-cta c14-cta--outline" to="/member/referrals">
            <span className="t-eyebrow">Refer a Friend</span>
          </Link>
        </div>
      ) : (
        <button className="btn btn--primary btn--block c14-cta" onClick={become}>
          <span className="t-eyebrow">Become a Member</span>
        </button>
      )}

      <HomeIndicator />
    </div>
  );
}
