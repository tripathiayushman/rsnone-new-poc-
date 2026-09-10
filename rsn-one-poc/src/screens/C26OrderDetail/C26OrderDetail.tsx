import { useState, type ReactNode } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { StatusBar, TabBar } from '../../components/Chrome';
import { Icon } from '../../components/Icon';
import { Img } from '../../components/Img';
import { houseById, productById } from '../../data/catalogue';
import type { Address, Order, OrderAddress } from '../../data/types';
import { fmtDate, fmtDay, fmtLong } from '../../lib/dates';
import { inr } from '../../lib/money';
import { useStore } from '../../store/useStore';
import './C26OrderDetail.css';

/**
 * C26 Order Detail — port of rsn-one-html/C26-OrderDetail.html. Everything is read
 * from the order record; the 4-step tracker is derived from order.stageIndex.
 */

/* 4-step tracker over ORDER_STAGES: Placed = 0, Shipped = 5 ('In Transit'),
   Out for Delivery = 6, Delivered = 7. The step's own icon is drawn while it is
   current or pending; a check replaces it once done. */
const CHECK = <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="m5 12.5 4.5 4.5L19 7" /></svg>;
const TRUCK = <svg width="30" height="24" viewBox="0 0 26 22" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M1 3.5h13v11H1z" /><path d="M14 7.5h5l4 4v3h-9z" /><circle cx="7" cy="17.5" r="2.2" /><circle cx="18" cy="17.5" r="2.2" /></svg>;
const BOX = <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3.5 7.5h17v12h-17z" /><path d="M3.5 7.5 6 4h12l2.5 3.5" /><path d="M10 11.5h4" /></svg>;
const STEPS: { label: string; stage: number; icon: ReactNode }[] = [
  { label: 'Order Placed', stage: 0, icon: CHECK },
  { label: 'Shipped', stage: 5, icon: TRUCK },
  { label: 'Out for Delivery', stage: 6, icon: TRUCK },
  { label: 'Delivered', stage: 7, icon: BOX },
];

/* Delivery note under the tracker — headline + sub per status / stage. */
function statusLine(o: Order): { headline: string; sub: string } {
  if (o.status === 'return-requested') return { headline: 'Return requested', sub: 'We’re reviewing it — you’ll hear from us within 24 hours' };
  if (o.status === 'returned') return { headline: 'Returned — refund credited to wallet', sub: `${inr(o.total)} is back in your wallet` };
  if (o.status === 'delivered' || o.stageIndex >= 7) return { headline: 'Your order has been delivered', sub: `Delivered on ${fmtDate(o.stageTimes[7] ?? o.placedAt)}` };
  const eta = o.eta ?? (o.delivery === 'express' ? 'Arriving in 1–2 business days' : 'Arriving in 3–5 business days');
  if (o.stageIndex >= 6) return { headline: 'Your order is out for delivery', sub: eta };
  if (o.stageIndex >= 5) return { headline: 'Your order is on its way', sub: eta };
  if (o.stageIndex >= 4) return { headline: 'Your order is sealed and ready to ship', sub: eta };
  if (o.stageIndex >= 2) return { headline: 'Your order is at the house', sub: `Being verified and sealed · ${eta}` };
  return { headline: 'Your order is being prepared', sub: eta };
}

export default function C26OrderDetail() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const order = useStore(s => s.orders.find(o => o.id === id));
  const addresses = useStore(s => s.addresses);
  const updateOrderAddress = useStore(s => s.updateOrderAddress);
  const showToast = useStore(s => s.showToast);
  const [picking, setPicking] = useState(false);

  if (!order) return <Navigate to="/orders" replace />;

  const reached = STEPS.filter(s => order.stageIndex >= s.stage);
  const currentStage = reached[reached.length - 1]?.stage ?? 0;
  const line = statusLine(order);
  const canChange = order.stageIndex < 4; // sealed at stage 4 — address is locked from then on
  const a = order.address;

  const onChange = () => {
    if (!canChange) { showToast('This order is already sealed'); return; }
    setPicking(p => !p);
  };
  const pick = (addr: Address) => {
    const next: OrderAddress = { name: addr.name, line1: addr.line1, line2: addr.line2, city: addr.city, state: addr.state, postal: addr.postal, country: addr.country, phone: addr.phone };
    updateOrderAddress(order.id, next);
    setPicking(false);
    showToast(`Shipping to ${addr.label}`);
  };
  const isCurrent = (addr: Address) => addr.line1 === a.line1 && addr.postal === a.postal;

  return (
    <div className="screen c26">
      <StatusBar />

      {/* BACK BAR — cream back arrow (x=42), rose "? Help" affordance (x=701). */}
      <header className="navbar">
        <button className="navbar__back" aria-label="Back" onClick={() => navigate('/orders')}>
          <svg width="35" height="32" viewBox="0 0 24 21" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M23 10.5H1" /><path d="M9.5 1 1 10.5 9.5 20" /></svg>
        </button>
        <Link className="navbar__help" to="/help">
          <svg width="37" height="37" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="12" cy="12" r="10" /><path d="M9.6 9.4a2.5 2.5 0 1 1 3.3 2.4c-.6.2-.9.8-.9 1.4v.5" /><path d="M12 16.6h.01" strokeWidth="2" strokeLinecap="round" /></svg>
          Help
        </Link>
      </header>

      {/* ORDER TITLE — 60px serif number + 23px placed-on line. */}
      <div className="detail-head">
        <h1 className="detail-head__title">Order #{order.id}</h1>
        <p className="detail-head__meta">Placed on {fmtLong(order.placedAt)}</p>
      </div>

      {/* TRACKER CARD — 4-step horizontal timeline, hairline, delivery note + CTA.
          DEVIATION-RISK (handoff): the current step carries a date too; here every
          reached step shows the date the order entered that stage. */}
      <section className="panel tracker">
        <ol className="timeline timeline--horizontal">
          {STEPS.map(s => {
            const done = order.stageIndex >= s.stage && s.stage !== currentStage;
            const current = s.stage === currentStage;
            const t = order.stageTimes[s.stage];
            return (
              <li key={s.label} className={`timeline__step ${done ? 'timeline__step--done' : current ? 'timeline__step--current' : ''}`}>
                <span className="timeline__marker"><span className="timeline__dot">{done ? CHECK : s.icon}</span></span>
                <p className="timeline__label">{s.label}</p>
                {(done || current) && t && <p className="timeline__time">{fmtDay(t)}</p>}
              </li>
            );
          })}
        </ol>

        <div className="tracker__rule" />

        <div className="tracker__note">
          <span className="tracker__icon"><svg width="53" height="41" viewBox="0.5 2.5 23 18" fill="none" stroke="currentColor" strokeWidth=".95"><path d="M1 3.5h13v11H1z" /><path d="M14 7.5h5l4 4v3h-9z" /><circle cx="7" cy="17.5" r="2.2" /><circle cx="18" cy="17.5" r="2.2" /></svg></span>
          <div className="tracker__text">
            <p className="tracker__headline">{line.headline}</p>
            <p className="tracker__sub">{line.sub}</p>
          </div>
          <Link className="tracker__cta" to={`/orders/${order.id}/track`}>Track Package
            <svg width="26" height="16" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M0 5h14M10 1l4 4-4 4" /></svg>
          </Link>
        </div>
      </section>

      {/* SHIPPING ADDRESS — serif section head with a rose "Change" link, then a
          785x190 panel: pin icon + recipient + address lines. "Change" opens an
          inline picker of the saved addresses while the order is still unsealed. */}
      <div className="detail-section">
        <h2 className="detail-section__title">Shipping Address</h2>
        <button className="detail-section__link" onClick={onChange} aria-expanded={picking}>{picking ? 'Cancel' : 'Change'}</button>
      </div>

      {picking ? (
        <div className="address-picker" role="listbox" aria-label="Choose a shipping address">
          {addresses.map(addr => (
            <button key={addr.id} role="option" aria-selected={isCurrent(addr)}
              className={`address-option ${isCurrent(addr) ? 'address-option--on' : ''}`} onClick={() => pick(addr)}>
              <span className="address-option__label">{addr.label}</span>
              <span className="address-option__line">{addr.line1}, {addr.city} {addr.postal}</span>
            </button>
          ))}
          <Link className="address-picker__cancel" to="/addresses/new">Add a new address</Link>
        </div>
      ) : (
        <section className="panel">
          <div className="address">
            <span className="address__pin">
              <svg width="32" height="38" viewBox="0 0 24 28" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 26s8.5-8.6 8.5-15A8.5 8.5 0 1 0 3.5 11C3.5 17.4 12 26 12 26Z" /><circle cx="12" cy="11" r="3.2" /></svg>
            </span>
            <div>
              <p className="address__name">{a.name}</p>
              <p className="address__line">
                {a.line1}<br />
                {a.line2 && <>{a.line2}<br /></>}
                {a.city} {a.postal}<br />
                {a.country}
              </p>
              <p className="address__line">{a.phone}</p>
            </div>
          </div>
        </section>
      )}

      {/* ORDER ITEMS — one line per item: 248x216 photo, name, house, price,
          member-price chip, quantity. */}
      <div className="detail-section">
        <h2 className="detail-section__title">Order Items</h2>
      </div>

      {order.items.map(it => {
        const p = productById(it.productId);
        if (!p) return null;
        return (
          <section className="order-item" key={it.productId}>
            <Link to={`/product/${p.id}`}>
              <Img className="order-item__media" slot={p.images[0]} alt={p.name} width={248} height={216} />
            </Link>
            <div className="order-item__body">
              <h3 className="order-item__title">{p.name}</h3>
              <p className="order-item__house">{houseById(p.house)?.name}</p>
              <span className="order-item__price">{inr(it.unitPrice)}</span>
              <span className="chip chip--member order-item__chip">Member {inr(p.memberPrice)}</span>
              <p className="order-item__qty">Qty: {it.qty}</p>
            </div>
          </section>
        );
      })}

      {/* ORDER SUMMARY — meta rows, hairline, total, payment method + invoice link. */}
      <div className="detail-section">
        <h2 className="detail-section__title">Order Summary</h2>
      </div>

      <section className="panel">
        <div className="summary">
          <div className="summary__row"><span>Subtotal</span><span className="summary__value">{inr(order.subtotal)}</span></div>
          {order.memberDiscount > 0 && (
            <div className="summary__row"><span>Member Discount</span><span className="summary__value summary__value--discount">{inr(-order.memberDiscount)}</span></div>
          )}
          {order.promoDiscount > 0 && (
            <div className="summary__row"><span>Promo</span><span className="summary__value summary__value--discount">{inr(-order.promoDiscount)}</span></div>
          )}
          <div className="summary__row"><span>Shipping</span><span className="summary__value">{order.shipping > 0 ? inr(order.shipping) : 'Free'}</span></div>

          <div className="summary__rule" />

          <div className="summary__total">
            <span className="summary__total-label">Total Paid</span>
            <span className="summary__total-value">{inr(order.total)}</span>
          </div>
          <div className="summary__foot">
            <span className="summary__paid">Paid via {order.payment}</span>
            <button className="summary__invoice" onClick={() => showToast('Invoice sent to your email')}>View Invoice
              <svg width="26" height="16" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M0 5h14M10 1l4 4-4 4" /></svg>
            </button>
          </div>
        </div>
      </section>

      {/* HELP CTA — 768x78 rose outline button, centred. */}
      <Link className="help-cta" to="/help">
        <svg width="33" height="32" viewBox="0 0 24 23" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2.5c5.2 0 9.5 3.4 9.5 7.6s-4.3 7.6-9.5 7.6c-1 0-2-.1-2.9-.4l-4.6 2 1.3-3.6C3.5 14.4 2.5 12.4 2.5 10.1 2.5 5.9 6.8 2.5 12 2.5Z" /></svg>
        Need Help with this Order?
      </Link>

      {/* POC addition: return entry point (same outline language as the help CTA) */}
      {order.status === 'delivered' && (
        <Link className="help-cta return-cta" to={`/orders/${order.id}/return`}>
          <Icon name="return" size={33} />
          Request Return
        </Link>
      )}
      {order.status === 'return-requested' && (
        <p className="return-note">Return requested — under review</p>
      )}
      <div className="detail-end" />

      {/* TAB BAR. DEVIATION-RISK (handoff): no tab is marked active on this mock;
          Order Detail is reached through ME → Orders, so ME reads as active. */}
      <TabBar active="me" />
    </div>
  );
}
