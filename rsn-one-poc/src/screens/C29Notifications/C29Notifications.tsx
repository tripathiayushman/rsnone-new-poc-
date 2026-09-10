import { Link, useNavigate } from 'react-router-dom';
import { AppBar, EmptyState, StatusBar, TabBar } from '../../components/Chrome';
import { Img } from '../../components/Img';
import { Icon } from '../../components/Icon';
import { fmtAgo } from '../../lib/dates';
import { useStore } from '../../store/useStore';
import type { Notification } from '../../data/types';
import './C29Notifications.css';

const DAY = 864e5;
const GROUPS = ['Today', 'This Week', 'Earlier'] as const;
/** Today = under 24h old, This Week = under 7 days, else Earlier. */
function bucket(iso: string, now: number): (typeof GROUPS)[number] {
  const age = now - new Date(iso).getTime();
  return age < DAY ? 'Today' : age < 7 * DAY ? 'This Week' : 'Earlier';
}

/**
 * C29 Notifications — port of rsn-one-html/C29-Notifications.html. Title row with
 * "Mark all as read", three dated groups of rows from the store, an editorial
 * banner, and the tab bar with ME active. ASSUMPTION (handoff): rose dot = unread,
 * grey dot = read.
 */
export default function C29Notifications() {
  const navigate = useNavigate();
  const notifications = useStore(s => s.notifications);
  const markRead = useStore(s => s.markRead);
  const markAllRead = useStore(s => s.markAllRead);
  const showToast = useStore(s => s.showToast);

  const now = Date.now();
  const sorted = [...notifications].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
  const groups = GROUPS.map(title => ({ title, items: sorted.filter(n => bucket(n.at, now) === title) })).filter(g => g.items.length);
  const unread = notifications.filter(n => !n.read).length;

  const open = (n: Notification) => {
    markRead(n.id);
    if (n.to) navigate(n.to);
  };
  const onMarkAll = () => {
    if (unread === 0) { showToast('You’re all caught up'); return; }
    markAllRead();
    showToast('All notifications marked as read');
  };

  return (
    <div className="screen c29">
      <StatusBar />

      {/* APP BAR — back arrow + logo only. No search or bag on this screen. */}
      <AppBar back />

      {/* PAGE HEAD — 71px serif title with a text action on the same line */}
      <div className="notif-head">
        <div className="notif-head__row">
          <h1 className="notif-head__title">Notifications</h1>
          <button className="notif-head__action" type="button" onClick={onMarkAll}>Mark all as read</button>
        </div>
        <p className="notif-head__sub">Stay updated with your orders, rewards<br />and more.</p>
      </div>

      {groups.length === 0 ? (
        <EmptyState title="No notifications yet" body="Order updates, rewards and new drops will appear here." cta="Explore new arrivals" to="/shop?sort=new" />
      ) : (
        groups.map((g, gi) => (
          <section className={`notif-group ${gi === 0 ? 'notif-group--first' : ''}`} key={g.title}>
            <h2 className="t-section notif-group__title">{g.title}</h2>
            <ul className="notif-list">
              {g.items.map(n => (
                <li key={n.id}>
                  <button type="button" className={`list-row list-row--notification ${n.read ? '' : 'list-row--unread'}`} onClick={() => open(n)}>
                    {n.image
                      ? <Img className="list-row__media" slot={n.image} alt="" width={133} height={90} />
                      : <span className="list-row__media list-row__media--blank" aria-hidden="true"><Icon name="bell" size={40} /></span>}
                    <span className="list-row__body">
                      <span className="list-row__title">{n.title}</span>
                      <span className="list-row__text">{n.body}</span>
                    </span>
                    <span className="list-row__meta">
                      <span className="list-row__time">{fmtAgo(n.at, now)}</span>
                      <span className={`list-row__dot ${n.read ? 'list-row__dot--read' : ''}`} aria-label={n.read ? 'Read' : 'Unread'} />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}

      {/* EDITORIAL BANNER — pale tile, photo bleeding off the right */}
      <Link className="notif-banner" to="/shop?sort=new">
        <Img className="notif-banner__media" slot="promo-quiet-table-01" alt="" width={779} height={162} />
        <div className="notif-banner__scrim" />
        <div className="notif-banner__body">
          <div className="notif-banner__title">A more thoughtful<br />tomorrow, <em>together.</em></div>
          <span className="notif-banner__link">Explore new arrivals
            <svg width="26" height="16" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M0 5h14M10 1l4 4-4 4" /></svg>
          </span>
        </div>
      </Link>

      <TabBar active="me" />
    </div>
  );
}
