import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HomeIndicator, StatusBar } from '../../components/Chrome';
import { Logo } from '../../components/Img';
import { useStore } from '../../store/useStore';
import './C01Splash.css';

/**
 * C01 Splash — port of rsn-one-html/C01-Splash.html. Cold-launch screen: no app
 * chrome beyond the status bar and home indicator, nothing tappable. After 1.8 s it
 * hands off to Home (signed in + store chosen), Login (welcome already seen) or Welcome.
 */
export default function C01Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => {
      const { isAuthed, store, hasSeenWelcome } = useStore.getState();
      if (isAuthed && store) navigate('/home', { replace: true });
      else if (hasSeenWelcome) navigate('/login', { replace: true });
      else navigate('/welcome', { replace: true });
    }, 1800);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="screen c01 splash">
      <StatusBar />

      {/* BRAND LOCKUP — arc-and-dots flourish, "RSNone" wordmark, GLOBAL FAMILY CLUB
          tagline. ASSUMPTION (resolved): the whole lockup ships as ONE asset. */}
      <div className="splash__lockup">
        <Logo width={432} height={218} />
      </div>

      {/* LOADING SPINNER — 52 x 52 at y 1536, centred. Eight rose dots on a ring at
          stepped opacity. DEVIATION-RISK: the splash shows a loading state but no
          timeout, error or retry state exists anywhere in the 34-screen set. */}
      <div className="splash__spinner" role="img" aria-label="Loading">
        <svg width="52" height="52" viewBox="0 0 52 52" fill="currentColor">
          <circle cx="26" cy="5" r="4.5" opacity="1" />
          <circle cx="41" cy="11" r="4" opacity=".8" />
          <circle cx="47" cy="26" r="3.6" opacity=".64" />
          <circle cx="41" cy="41" r="3.3" opacity=".5" />
          <circle cx="26" cy="47" r="3" opacity=".38" />
          <circle cx="11" cy="41" r="2.8" opacity=".28" />
          <circle cx="5" cy="26" r="2.6" opacity=".2" />
          <circle cx="11" cy="11" r="2.4" opacity=".14" />
        </svg>
      </div>

      <HomeIndicator />
    </div>
  );
}
