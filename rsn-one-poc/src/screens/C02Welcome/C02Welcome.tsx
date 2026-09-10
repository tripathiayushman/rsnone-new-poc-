import { useNavigate } from 'react-router-dom';
import { HomeIndicator, StatusBar } from '../../components/Chrome';
import { Img, Logo } from '../../components/Img';
import { useStore } from '../../store/useStore';
import './C02Welcome.css';

/**
 * C02 Welcome — port of rsn-one-html/C02-Welcome.html. Slide 1 of the onboarding
 * carousel (slides 2–3 have no mocks). Get Started → C20 Login; Explore as Guest /
 * Skip → guest session → C19 Store Selection.
 */
export default function C02Welcome() {
  const navigate = useNavigate();
  const markWelcomeSeen = useStore(s => s.markWelcomeSeen);
  const continueAsGuest = useStore(s => s.continueAsGuest);

  const getStarted = () => { markWelcomeSeen(); navigate('/login'); };
  const asGuest = () => { continueAsGuest(); markWelcomeSeen(); navigate('/store'); };

  return (
    <div className="screen c02 welcome">
      {/* BACKDROP PHOTO — full-bleed, 853 x 1844. One image in the mock, so one slot. */}
      <Img className="welcome__media" slot="hero-welcome-01" alt="" width={853} height={1844} />

      {/* DEVIATION-RISK: the status bar and "Skip" are drawn in near-white over the
          pale part of the photo — roughly 2:1 contrast, will fail WCAG AA. */}
      <StatusBar />

      {/* Skip — ASSUMPTION: skips the 3-slide onboarding straight to C19 Store Selection. */}
      <button className="welcome__skip" type="button" onClick={asGuest}>Skip</button>

      {/* BRAND LOCKUP — centred, dark-ink variant of the logo used on C01/C03. */}
      <div className="welcome__lockup">
        <Logo dark width={319} height={161} />
      </div>

      {/* HEADLINE + BODY — left aligned at x=64. Line breaks are hard in the mock. */}
      <div className="welcome__copy">
        <h1 className="welcome__title">The world’s<br />houses,<br /><em>brought home.</em></h1>
        <p className="welcome__body">The world’s finest makers,<br />curated for your home.<br />Verified. Sealed. Open to all.</p>
      </div>

      {/* CTA STACK — ASSUMPTION: GET STARTED goes to C20 Login / Sign Up; EXPLORE AS
          GUEST goes to C19 Store Selection. */}
      <div className="welcome__cta">
        <button className="welcome__btn welcome__btn--primary" type="button" onClick={getStarted}>Get Started</button>
        <button className="welcome__btn welcome__btn--guest" type="button" onClick={asGuest}>Explore as Guest</button>
      </div>

      {/* PAGER — 3 dots, slide 1 active. DEVIATION-RISK: slides 2 and 3 are not in the set. */}
      <div className="welcome__dots" role="tablist" aria-label="Onboarding slides">
        <span className="welcome__dot welcome__dot--active" />
        <span className="welcome__dot" />
        <span className="welcome__dot" />
      </div>

      <HomeIndicator />
    </div>
  );
}
