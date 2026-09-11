import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Icon } from './Icon';
import { Logo } from './Img';
import { useBagCount } from '../store/useStore';
import type { ReactNode } from 'react';

/* ------------------------------------------------------------------------
   Phone chrome + the three shared bars, lifted from the handoff markup.
   ------------------------------------------------------------------------ */

/** iOS status bar (9:41 / signal / wifi / battery). Drawn on every screen like the mocks. */
export function StatusBar({ className = '' }: { className?: string }) {
  return (
    <div className={`statusbar ${className}`}>
      <span>9:41</span>
      <span className="statusbar__icons">
        <svg width="32" height="21" viewBox="0 0 17 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="1" /><rect x="4.6" y="5" width="3" height="6" rx="1" /><rect x="9.2" y="2.5" width="3" height="8.5" rx="1" /><rect x="13.8" y="0" width="3" height="11" rx="1" /></svg>
        <svg width="30" height="21" viewBox="0 0 16 11" fill="currentColor"><path d="M8 10.5 5.9 8.3a3 3 0 0 1 4.2 0L8 10.5Zm0-4.6a5.4 5.4 0 0 0-3.8 1.6L2.8 6.1a7.4 7.4 0 0 1 10.4 0l-1.4 1.4A5.4 5.4 0 0 0 8 5.9Zm0-3.8a9.2 9.2 0 0 0-6.5 2.7L.1 3.4a11.2 11.2 0 0 1 15.8 0l-1.4 1.4A9.2 9.2 0 0 0 8 2.1Z" /></svg>
        <svg width="46" height="22" viewBox="0 0 25 12" fill="none"><rect x=".5" y=".5" width="21" height="11" rx="3" stroke="currentColor" opacity=".5" /><rect x="2" y="2" width="18" height="8" rx="1.8" fill="currentColor" /><path d="M23 4v4a2 2 0 0 0 0-4Z" fill="currentColor" opacity=".5" /></svg>
      </span>
    </div>
  );
}

export function HomeIndicator({ className = '' }: { className?: string }) {
  return <div className={`home-indicator ${className}`} />;
}

/**
 * Logo app bar: lockup left, search + bag (with live count) right.
 * C03 Home, C04 Shop, C06 Search Results, C09 Wishlist, C15 Drops, C25 Orders …
 * `back` swaps the lockup for a back arrow + lockup (C15/C24/C29/C30 variant).
 */
export function AppBar({ back, logoWidth = 186, logoHeight = 94, className = '', children }: {
  back?: boolean | (() => void); logoWidth?: number; logoHeight?: number; className?: string; children?: ReactNode;
}) {
  const count = useBagCount();
  const navigate = useNavigate();
  const onBack = typeof back === 'function' ? back : () => navigate(-1);
  return (
    <header className={`appbar ${className}`}>
      {back && (
        <button className="appbar__back" aria-label="Back" onClick={onBack} style={{ color: 'var(--cream)', marginRight: 24 }}>
          <svg width="42" height="34" viewBox="0 0 22 18" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M21 9H1M8 2 1 9l7 7" /></svg>
        </button>
      )}
      <Link className="appbar__logo" to="/home" aria-label="RSN one — Global Family Club">
        <Logo width={logoWidth} height={logoHeight} />
      </Link>
      <div className="appbar__actions">
        {children}
        <Link className="appbar__action" aria-label="Search" to="/search">
          <Icon name="search" size={42} />
        </Link>
        <Link className="appbar__action" aria-label={`Bag, ${count} items`} to="/bag">
          <Icon name="bag" size={42} />
          {count > 0 && <span className="appbar__badge">{count}</span>}
        </Link>
      </div>
    </header>
  );
}

export type TabId = 'home' | 'shop' | 'wishlist' | 'me';

/**
 * Bottom tab bar + home indicator. Sticky to the viewport bottom when a screen is
 * taller than the artboard. `variant="roman"` = title-case labels (C06/C07/C09–C12/C17).
 */
/** Short haptic tap on supported devices (Android/Chrome; iOS Safari has no Vibration API). */
function buzz() {
  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') navigator.vibrate(15);
}

export function TabBar({ active, variant, meLabel = 'Me' }: { active?: TabId; variant?: 'roman'; meLabel?: string }) {
  const { pathname } = useLocation();
  const tabs: { id: TabId; to: string; label: string; icon: 'home' | 'bag' | 'heart-lg' | 'user' }[] = [
    { id: 'home', to: '/home', label: 'Home', icon: 'home' },
    { id: 'shop', to: '/shop', label: 'Shop', icon: 'bag' },
    { id: 'wishlist', to: '/wishlist', label: 'Wishlist', icon: 'heart-lg' },
    { id: 'me', to: '/me', label: meLabel, icon: 'user' },
  ];
  const current: TabId | undefined = active ?? (
    pathname.startsWith('/shop') ? 'shop' : pathname.startsWith('/wishlist') ? 'wishlist' :
    pathname.startsWith('/me') ? 'me' : pathname === '/home' ? 'home' : undefined);
  return (
    <div className="tabwrap">
      <nav className={`tabbar ${variant === 'roman' ? 'tabbar--roman' : ''}`} aria-label="Primary">
        {tabs.map(t => {
          const on = t.id === current;
          return (
            <Link key={t.id} to={t.to} onClick={buzz} className={`tab ${on ? 'tab--active' : ''}`} aria-current={on ? 'page' : undefined}>
              <Icon name={on ? (`${t.icon}-fill` as never) : t.icon} size={40} />
              <span className="t-tab tab__label">{t.label}</span>
            </Link>
          );
        })}
      </nav>
      <HomeIndicator />
    </div>
  );
}

/** Back-arrow top bar used by the account / order screens. Pass `right` for a trailing action. */
export function NavBar({ title, right, className = '', onBack, light }: { title?: ReactNode; right?: ReactNode; className?: string; onBack?: () => void; light?: boolean }) {
  const navigate = useNavigate();
  return (
    <header className={`navbar ${className}`} style={light ? { color: 'var(--ink)' } : undefined}>
      <button className="navbar__back" aria-label="Back" onClick={onBack ?? (() => navigate(-1))}>
        <svg width="38" height="32" viewBox="0 0 24 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M23 10H1M9 2 1 10l8 8" /></svg>
      </button>
      {title && <span className="navbar__title">{title}</span>}
      {right && <span className="navbar__right" style={{ marginLeft: 'auto' }}>{right}</span>}
    </header>
  );
}

/** Section title row with optional trailing link ("View all →"). */
export function SectionHead({ title, link, to, onClick, className = '' }: { title: ReactNode; link?: string; to?: string; onClick?: () => void; className?: string }) {
  return (
    <div className={`section__head ${className}`}>
      <h2 className="t-section">{title}</h2>
      {link && (to ? (
        <Link className="section__link" to={to}>{link}<Icon name="arrow-right" width={24} height={15} /></Link>
      ) : (
        <button className="section__link" onClick={onClick}>{link}<Icon name="arrow-right" width={24} height={15} /></button>
      ))}
    </div>
  );
}

/** Centered empty state used by Wishlist / Bag / Orders / Notifications. */
export function EmptyState({ title, body, cta, to }: { title: string; body: string; cta?: string; to?: string }) {
  return (
    <div className="empty">
      <h2 className="empty__title">{title}</h2>
      <p className="empty__body">{body}</p>
      {cta && to && <Link className="btn btn--primary" to={to}><span className="t-eyebrow">{cta}</span></Link>}
    </div>
  );
}
