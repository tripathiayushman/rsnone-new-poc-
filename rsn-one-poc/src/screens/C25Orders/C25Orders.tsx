import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, EmptyState, StatusBar, TabBar } from '../../components/Chrome';
import { Img } from '../../components/Img';
import { productById } from '../../data/catalogue';
import type { Order, OrderStatus } from '../../data/types';
import { fmtDate } from '../../lib/dates';
import { inr } from '../../lib/money';
import { useStore } from '../../store/useStore';
import './C25Orders.css';

/**
 * C25 Orders — port of rsn-one-html/C25-Orders.html. Cards come from the store
 * (newest first, as stored); the filter chips are local state.
 */
type Filter = 'all' | 'processing' | 'shipped' | 'delivered' | 'returns';
const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All Orders' },
  { id: 'processing', label: 'Processing' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'returns', label: 'Returns' },
];
const matches = (o: Order, f: Filter) =>
  f === 'all' ? true
  : f === 'returns' ? (o.status === 'returned' || o.status === 'return-requested')
  : o.status === f;

/* status pill: handoff class + icon per fulfilment state.
   `return-requested` borrows the returned treatment with its own label. */
const STATUS: Record<OrderStatus, { cls: string; label: string; icon: ReactNode }> = {
  delivered: { cls: 'order-status--delivered', label: 'Delivered',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></svg> },
  shipped: { cls: 'order-status--shipped', label: 'Shipped',
    icon: <svg width="26" height="22" viewBox="0 0 26 22" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M1 3h13v11H1z" /><path d="M14 7h5l4 4v3h-9z" /><circle cx="7" cy="17" r="2.2" /><circle cx="18" cy="17" r="2.2" /></svg> },
  processing: { cls: 'order-status--processing', label: 'Processing',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="9" /><path d="M12 7v5.4l3.4 2" /></svg> },
  returned: { cls: 'order-status--returned', label: 'Returned',
    icon: <svg width="24" height="22" viewBox="0 0 24 22" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 8h11a5 5 0 0 1 0 10H8" /><path d="M8 3 3 8l5 5" /></svg> },
  'return-requested': { cls: 'order-status--returned', label: 'Return requested',
    icon: <svg width="24" height="22" viewBox="0 0 24 22" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 8h11a5 5 0 0 1 0 10H8" /><path d="M8 3 3 8l5 5" /></svg> },
};

export default function C25Orders() {
  const orders = useStore(s => s.orders);
  const [filter, setFilter] = useState<Filter>('all');
  const shown = orders.filter(o => matches(o, filter));
  const filterLabel = FILTERS.find(f => f.id === filter)?.label ?? 'orders';

  return (
    <div className="screen c25">
      <StatusBar />
      <AppBar />

      {/* SCREEN TITLE — "My Orders" ≈80px serif, two-line 26px subtitle. */}
      <div className="orders-head">
        <h1 className="orders-head__title">My Orders</h1>
        <p className="orders-head__sub">Track your orders, view details<br />and manage returns.</p>
      </div>

      {/* FILTER CHIPS — 5 states. DEVIATION-RISK (handoff): in the mock the pill
          outlines OVERLAP each other by ~10px (negative margin reproduced in CSS);
          it almost certainly wants to be a spaced row instead. */}
      <div className="filter-row" role="group" aria-label="Filter orders">
        {FILTERS.map(f => (
          <button key={f.id} className={`filter-chip ${filter === f.id ? 'filter-chip--active' : ''}`}
            aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>{f.label}</button>
        ))}
      </div>

      {/* ORDER LIST — 790x185 cards, 11px apart: thumbnail, order number, order date
          (top-right), item count, fulfilment status pill, total, chevron. */}
      {shown.length === 0 ? (
        filter === 'all'
          ? <EmptyState title="No orders yet" body="Objects you order will appear here, from confirmation to your door." cta="Explore the shop" to="/shop" />
          : <EmptyState title={`No ${filterLabel.toLowerCase()}`} body="Nothing matches this filter right now. Try another one or view all your orders." />
      ) : (
        <section className="order-list-wrap">
          <ul className="order-list">
            {shown.map(o => {
              const first = productById(o.items[0]?.productId);
              const count = o.items.reduce((n, it) => n + it.qty, 0);
              const st = STATUS[o.status];
              return (
                <li key={o.id}>
                  <Link className="order-card" to={`/orders/${o.id}`}>
                    <Img className="order-card__media" slot={first?.images[0] ?? 'prod-copper-vessel-01'} alt={first?.name ?? ''} width={205} height={161} />
                    <div className="order-card__body">
                      <h3 className="order-card__id">Order #{o.id}</h3>
                      <span className="order-card__date">{fmtDate(o.placedAt)}</span>
                      <p className="order-card__count">{count} {count === 1 ? 'item' : 'items'}</p>
                      <span className={`order-status ${st.cls}`}>{st.icon}{st.label}</span>
                      <span className="order-card__price">{inr(o.total)}</span>
                    </div>
                    <svg className="order-card__chevron" width="17" height="35" viewBox="0 0 10 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m1.2 1.5 7.3 8.5-7.3 8.5" /></svg>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* EDITORIAL BANNER — 790x185, light photography with a cream scrim. */}
      <Link className="banner" to="/shop?sort=new">
        <Img className="banner__media" slot="promo-thoughtful-living-01" alt="" width={790} height={185} />
        <div className="banner__scrim" />
        <div className="banner__body">
          <p className="banner__title">Thoughtful living,<em>delivered worldwide.</em></p>
          <span className="banner__link">Explore new arrivals
            <svg width="26" height="16" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M0 5h14M10 1l4 4-4 4" /></svg>
          </span>
        </div>
      </Link>
      <div className="orders-end" />

      {/* TAB BAR. DEVIATION (handoff): this mock names the 4th tab "ORDERS" with the
          person icon, while C17 names the same tab "Me". Reproduced via meLabel — the
          tab still routes to /me. */}
      <TabBar active="me" meLabel="Orders" />
    </div>
  );
}
