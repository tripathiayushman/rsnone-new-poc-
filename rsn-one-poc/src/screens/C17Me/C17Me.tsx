import { Link, useNavigate } from 'react-router-dom';
import { StatusBar, TabBar } from '../../components/Chrome';
import { Img } from '../../components/Img';
import { Icon, type IconName } from '../../components/Icon';
import { USER } from '../../data/seed';
import { useStore, useUnreadCount } from '../../store/useStore';
import './C17Me.css';

/**
 * C17 Me — port of rsn-one-html/C17-Me.html. Profile header from the store user, then
 * the shared settings-row list. ASSUMPTION: the row destinations are inferred from the
 * label text — the mock shows no navigation targets.
 */
export default function C17Me() {
  const navigate = useNavigate();
  const user = useStore(s => s.user) ?? USER;
  const isMember = useStore(s => s.isMember);
  const signOut = useStore(s => s.signOut);
  const unread = useUnreadCount();

  const rows: { label: string; icon: IconName; to: string; badge?: number }[] = [
    { label: 'Membership', icon: 'shield', to: isMember ? '/member/wallet' : '/membership' },
    { label: 'Orders', icon: 'bag', to: '/orders' },
    { label: 'Wishlist', icon: 'heart-lg', to: '/wishlist' },
    { label: 'Concierge', icon: 'concierge', to: '/concierge' },
    { label: 'Addresses', icon: 'pin', to: '/addresses' },
    { label: 'Payment', icon: 'card', to: '/payments' },
    { label: 'Notifications', icon: 'bell', to: '/notifications', badge: unread },
    { label: 'Help', icon: 'help', to: '/help' },
  ];

  return (
    <div className="screen c17">
      <StatusBar />

      {/* PROFILE HEADER — 194px circular avatar (x=42, y=169), name and membership
          line. There is NO app bar and no screen title on this screen. */}
      <header className="profile">
        <Img className="profile__avatar" slot={user.avatar} alt={user.name} width={194} height={194} />
        <div className="profile__text">
          <h1 className="profile__name">{user.name}</h1>
          <p className="profile__meta">{isMember ? user.memberNo : 'Member'}</p>
        </div>
      </header>

      {/* ACCOUNT LIST — full-bleed rows, 142px each, hairline under every row
          INCLUDING the last one. DEVIATION-RISK: the label measures 40px in the
          mock, but the spec's .t-row token is 26px — the mock is reproduced here. */}
      <nav>
        <ul className="list">
          {rows.map(r => (
            <li key={r.label}>
              <Link className="list-row" to={r.to}>
                <Icon name={r.icon} className="list-row__icon" size={64} />
                <span className="list-row__label">{r.label}</span>
                {r.badge ? <span className="list-row__badge" aria-label={`${r.badge} unread`}>{r.badge}</span> : null}
                <Icon name="chevron-right" className="list-row__chevron" width={20} height={34} />
              </Link>
            </li>
          ))}
          {/* POC: sign out — same row shell, ends the session and returns to the splash */}
          <li>
            <button className="list-row" type="button" onClick={() => { signOut(); navigate('/', { replace: true }); }}>
              <Icon name="logout" className="list-row__icon" size={64} />
              <span className="list-row__label">Sign out</span>
              <Icon name="chevron-right" className="list-row__chevron" width={20} height={34} />
            </button>
          </li>
        </ul>
      </nav>

      {/* TAB BAR — ME active. DEVIATION-RISK: this mock labels the tabs in sentence
          case while C25 Orders uses caps and renames the 4th tab. */}
      <TabBar active="me" variant="roman" />
    </div>
  );
}
