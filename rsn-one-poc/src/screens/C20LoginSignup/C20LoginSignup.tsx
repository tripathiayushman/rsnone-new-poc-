import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HomeIndicator, StatusBar } from '../../components/Chrome';
import { Img, Logo } from '../../components/Img';
import { useStore } from '../../store/useStore';
import './C20LoginSignup.css';

type Tab = 'in' | 'up';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * C20 Login / Sign Up — port of rsn-one-html/C20-LoginSignup.html. The Sign In tab is
 * the mock; Sign Up reuses the same form shell with an extra "Full name" field
 * (ASSUMPTION: the Sign Up form has no screen in the set). Any successful sign-in
 * continues to `location.state.returnTo`, else Store Selection / Home.
 */
export default function C20LoginSignup() {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = (location.state as { returnTo?: string } | null)?.returnTo;

  const signIn = useStore(s => s.signIn);
  const signUp = useStore(s => s.signUp);
  const continueAsGuest = useStore(s => s.continueAsGuest);
  const showToast = useStore(s => s.showToast);
  const store = useStore(s => s.store);

  const [tab, setTab] = useState<Tab>('in');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  const afterAuth = () => navigate(returnTo ?? (store ? '/home' : '/store'), { replace: true });

  const switchTab = (t: Tab) => { setTab(t); setErrors({}); };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (tab === 'up' && !name.trim()) next.name = 'Please enter your name';
    if (!email.trim()) next.email = 'Please enter your email address';
    else if (!EMAIL_RE.test(email.trim())) next.email = 'Enter a valid email address';
    if (!password) next.password = 'Please enter your password';
    else if (password.length < 6) next.password = 'Password must be at least 6 characters';
    setErrors(next);
    if (Object.keys(next).length) return;
    if (tab === 'up') signUp(email.trim(), name.trim()); else signIn(email.trim());
    afterAuth();
  };

  const sso = () => { signIn('maya.kapoor@rsnone.com'); afterAuth(); };
  const skip = () => { continueAsGuest(); navigate('/store'); };

  return (
    <div className="screen c20 login">
      {/* BACKDROP PHOTO — full-bleed 853 x 1844, two overlaid scrims keep copy and form legible. */}
      <Img className="login__media" slot="hero-login-01" alt="" width={853} height={1844} />
      <div className="login__scrim" />

      <StatusBar />

      {/* back arrow (rose, x 47 y 116) and Skip (cream, right edge 803).
          ASSUMPTION: back returns to the previous screen, Skip enters the app as a guest. */}
      <button className="login__back" type="button" aria-label="Back" onClick={() => navigate(-1)}>
        <svg width="42" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12H4" /><path d="m10 6-6 6 6 6" /></svg>
      </button>
      <button className="login__skip" type="button" onClick={skip}>Skip</button>

      {/* BRAND LOCKUP — left aligned, cream wordmark with the rose script "one". */}
      <div className="login__lockup">
        <Logo width={289} height={146} />
      </div>

      <h1 className="login__title">Welcome<br /><em>back.</em></h1>
      <p className="login__body">Sign in to continue your<br />journey with extraordinary<br />objects, homes and rituals.</p>

      {/* TABS — DEVIATION-RISK: the 127px underline overhangs the 82px "Sign In" label by 45px. */}
      <div className="login__tabs" role="tablist">
        <button className={`login__tab ${tab === 'in' ? 'login__tab--active' : ''}`} role="tab" aria-selected={tab === 'in'} type="button" onClick={() => switchTab('in')}>Sign In</button>
        <button className={`login__tab ${tab === 'up' ? 'login__tab--active' : ''}`} role="tab" aria-selected={tab === 'up'} type="button" onClick={() => switchTab('up')}>Sign Up</button>
      </div>

      {/* SIGN-IN FORM — all controls 730px wide at x=62. */}
      <form className="login__form" onSubmit={submit} noValidate>

        {tab === 'up' && (
          <>
            <label className={`field ${errors.name ? 'field--error' : ''}`}>
              <span className="field__icon" aria-hidden="true">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4.5 21a7.5 7.5 0 0 1 15 0" /></svg>
              </span>
              <input className="field__input" type="text" name="name" placeholder="Full name" autoComplete="name"
                value={name} onChange={e => { setName(e.target.value); if (errors.name) setErrors({ ...errors, name: undefined }); }} />
            </label>
            {errors.name && <span className="field__error">{errors.name}</span>}
          </>
        )}

        <label className={`field ${errors.email ? 'field--error' : ''}`}>
          <span className="field__icon" aria-hidden="true">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"><rect x="2.5" y="5" width="19" height="14" rx="2.5" /><path d="m3 7 9 6 9-6" /></svg>
          </span>
          <input className="field__input" type="email" name="email" placeholder="Email address" autoComplete="email"
            value={email} onChange={e => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: undefined }); }} />
        </label>
        {errors.email && <span className="field__error">{errors.email}</span>}

        <label className={`field ${errors.password ? 'field--error' : ''}`}>
          <span className="field__icon" aria-hidden="true">
            <svg width="32" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"><rect x="4" y="10.5" width="16" height="11" rx="2.5" /><path d="M8 10.5V7.6a4 4 0 0 1 8 0v2.9" /></svg>
          </span>
          <input className="field__input" type={showPw ? 'text' : 'password'} name="password" placeholder="Password"
            autoComplete={tab === 'up' ? 'new-password' : 'current-password'}
            value={password} onChange={e => { setPassword(e.target.value); if (errors.password) setErrors({ ...errors, password: undefined }); }} />
          <button className="field__toggle" type="button" aria-label={showPw ? 'Hide password' : 'Show password'} aria-pressed={showPw} onClick={() => setShowPw(v => !v)}>
            <svg width="36" height="26" viewBox="0 0 24 17" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M1 8.5S5 2 12 2s11 6.5 11 6.5S19 15 12 15 1 8.5 1 8.5Z" /><circle cx="12" cy="8.5" r="3.2" />
              {showPw && <path d="m3 15 18-13" />}
            </svg>
          </button>
        </label>
        {errors.password && <span className="field__error">{errors.password}</span>}

        {tab === 'in' && (
          <button className="login__forgot" type="button" onClick={() => showToast('Reset link sent to your email')}>Forgot password?</button>
        )}

        <button className="login__submit" type="submit">{tab === 'in' ? 'Sign in' : 'Sign up'}
          <svg width="30" height="18" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M0 5h14M10 1l4 4-4 4" /></svg>
        </button>

        {/* "or" divider — two 308px hairlines with the label between. */}
        <div className="login__or"><span>or</span></div>

        {/* third-party sign-in. ICON: the Apple and Google marks are approximations. */}
        <button className="login__sso" type="button" onClick={sso}>
          <svg width="36" height="42" viewBox="0 0 20 24" fill="#fff" aria-hidden="true"><path d="M14.8 12.6c0-2.5 2-3.7 2.1-3.8-1.2-1.7-3-1.9-3.6-2-1.5-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.9-1.7 0-3.3 1-4.2 2.5-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.5 1.3 0 1.8-.8 3.3-.8s2 .8 3.3.8c1.4 0 2.3-1.2 3.1-2.5.6-.9 1-1.8 1.3-2.8-3.4-1.3-2.7-5-2.7-5.1ZM12.4 4.2c.7-.9 1.2-2.1 1-3.3-1 0-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.2 1.1.1 2.3-.6 3.1-1.5Z" /></svg>
          <span>Continue with Apple</span>
        </button>

        <button className="login__sso" type="button" onClick={sso}>
          <svg width="42" height="42" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-2.8-.4-4.1H24v7.5h11.9c-.2 2-1.5 5-4.4 7l6.7 5.2c4-3.7 6.9-9.1 6.9-15.6Z" />
            <path fill="#34A853" d="M24 46c5.8 0 10.7-1.9 14.2-5.2l-6.7-5.2c-1.8 1.3-4.2 2.2-7.5 2.2-5.7 0-10.6-3.8-12.3-9l-7 5.4C8.2 41.3 15.5 46 24 46Z" />
            <path fill="#FBBC05" d="M11.7 28.8c-.5-1.3-.7-2.8-.7-4.3s.3-3 .7-4.3l-7-5.4C3.6 17.6 3 20.7 3 24s.6 6.4 1.7 9.2l7-4.4Z" />
            <path fill="#EA4335" d="M24 10.7c4 0 6.8 1.7 8.3 3.2l6-5.9C34.6 4.6 29.8 2 24 2 15.5 2 8.2 6.7 4.7 14.8l7 5.4c1.7-5.2 6.6-9.5 12.3-9.5Z" />
          </svg>
          <span>Continue with Google</span>
        </button>
      </form>

      {/* FOOTER — DEVIATION-RISK: this link and the "Sign Up" tab are two routes to the same thing. */}
      {tab === 'in' ? (
        <p className="login__footer">New to RSN One? <button type="button" onClick={() => switchTab('up')}>Create an account</button></p>
      ) : (
        <p className="login__footer">Already with RSN One? <button type="button" onClick={() => switchTab('in')}>Sign in</button></p>
      )}

      <HomeIndicator />
    </div>
  );
}
