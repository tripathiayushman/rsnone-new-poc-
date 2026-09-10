import { Link, Navigate, useParams } from 'react-router-dom';
import { HomeIndicator, StatusBar } from '../../components/Chrome';
import { Img, Logo } from '../../components/Img';
import { inr } from '../../lib/money';
import { useStore } from '../../store/useStore';
import './C13OrderConfirmation.css';

/**
 * C13 Order Confirmation — port of rsn-one-html/C13-OrderConfirmation.html.
 * The only LIGHT screen in the set: a full-bleed blush photograph with dark ink type.
 * Reads the placed order from the store by :id; the two footer buttons are the only exits.
 */
const displayId = (id: string) => id.replace(/^RSN-?(\d+)$/i, 'RSN-$1');

export default function C13OrderConfirmation() {
  const { id = '' } = useParams();
  const order = useStore(s => s.orders).find(o => o.id === id);
  if (!order) return <Navigate to="/orders" replace />;

  const pieces = order.items.reduce((n, it) => n + it.qty, 0);

  return (
    <div className="screen screen--light c13">
      {/* FULL-BLEED PHOTO — the entire screen is one photograph; all type sits on top.
          DEVIATION-RISK (handoff): no scrim, so legibility depends on this exact photograph. */}
      <div className="confirm">
        <Img className="confirm__media" slot="hero-order-confirmation-01" alt="" width={853} height={1844} />
      </div>

      <div className="confirm-layer">
        <StatusBar />

        {/* BRAND BAR — logo lockup centred-left, italic voice line to its right.
            No back arrow, no bag, no search: this is a terminal screen. */}
        <header className="confirm-bar">
          <Link className="confirm-bar__logo" to="/home" aria-label="RSN one — Global Family Club">
            <Logo dark width={313} height={158} />
          </Link>
          <p className="confirm-bar__voice">Thoughtful<br />pieces.<br />Brighter days.</p>
        </header>

        {/* HEADLINE — 2 lines, serif, last word italic. Order reference underneath in sans,
            then a one-line receipt (POC) so the number on the screen is the real order. */}
        <div className="confirm-head">
          <h1 className="t-display confirm-head__title">Your piece<br />is on its way <em>home.</em></h1>
          <p className="confirm-head__order">Order {displayId(order.id)}</p>
          <p className="confirm-head__meta">{pieces} {pieces === 1 ? 'piece' : 'pieces'} · {inr(order.total)} · {order.eta ?? 'Arriving soon'}</p>
        </div>

        {/* VERTICAL EYEBROW — the brand line set in 5 short uppercase lines down the left edge. */}
        <div className="confirm-eyebrow">
          More<br />than<br />objects,<br />a kinder<br />tomorrow.
          <div className="confirm-eyebrow__rule" />
        </div>

        {/* FOOTER — primary "TRACK ORDER" button and an underlined "Continue Shopping" link.
            ASSUMPTION (handoff): the button is unusually tall once scaled up (127px). */}
        <div className="confirm-foot">
          <Link className="btn confirm-foot__cta" to={`/orders/${order.id}/track`}>
            <span className="confirm-foot__cta-label">Track Order</span>
            <svg width="34" height="20" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M0 5h14M10 1l4 4-4 4" /></svg>
          </Link>
          <Link className="confirm-foot__link" to="/home">Continue Shopping</Link>
        </div>

        {/* No tab bar on this screen — only the iOS home indicator. */}
        <HomeIndicator />
      </div>
    </div>
  );
}
