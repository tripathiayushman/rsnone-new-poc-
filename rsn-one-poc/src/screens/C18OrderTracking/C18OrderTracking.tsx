import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { HomeIndicator, StatusBar } from '../../components/Chrome';
import { Img } from '../../components/Img';
import { houseById, productById } from '../../data/catalogue';
import { ORDER_STAGES } from '../../data/types';
import { fmtDateTime } from '../../lib/dates';
import { inr } from '../../lib/money';
import { useStore } from '../../store/useStore';
import './C18OrderTracking.css';

/**
 * C18 Order Tracking — port of rsn-one-html/C18-OrderTracking.html. Header card is
 * the order's first item; the vertical 8-step timeline walks ORDER_STAGES against
 * order.stageIndex. No tab bar on this screen — the mock ends with the home indicator.
 */
export default function C18OrderTracking() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const order = useStore(s => s.orders.find(o => o.id === id));
  if (!order) return <Navigate to="/orders" replace />;

  const first = order.items[0];
  const product = productById(first?.productId ?? '');

  return (
    <div className="screen c18">
      <StatusBar />

      {/* BACK BAR — rose back arrow at x=49, y=114. No title, no actions. */}
      <header className="navbar">
        <button className="navbar__back" aria-label="Back" onClick={() => navigate(-1)}>
          <svg width="47" height="42" viewBox="0 0 24 21" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M23 10.5H1" /><path d="M9.5 1 1 10.5 9.5 20" /></svg>
        </button>
      </header>

      {/* ORDER TITLE — two lines, two sizes: "Order" ≈72px, the order number ≈96px.
          (The mock's sample id is hyphenated "RSN-10482"; ids are shown as stored.) */}
      <div className="order-title">
        <h1 className="order-title__label">Order</h1>
        <span className="order-title__id">{order.id}</span>
      </div>

      {/* ORDERED PRODUCT — single line item. Image 321x297, radius 24.
          DEVIATION-RISK (handoff): the house is spelled "House of Lazaripat" on this
          mock but "House of Lazimpat" everywhere else — the catalogue name is used. */}
      {product && (
        <section className="order-product">
          <Link to={`/product/${product.id}`}>
            <Img className="order-product__media" slot={product.images[0]} alt={product.name} width={321} height={297} />
          </Link>
          <div className="order-product__body">
            <h2 className="order-product__title">{product.name}</h2>
            <p className="order-product__house">{houseById(product.house)?.name}</p>
            <p className="order-product__price">{inr(first.unitPrice)}</p>
          </div>
        </section>
      )}

      {/* STATUS TIMELINE — 8 steps, vertical. done = before stageIndex, current =
          stageIndex, pending after. Every done/current stage with a recorded time
          shows it, using the handoff's --timed treatment.
          DEVIATION-RISK (handoff): two completed markers are drawn 36px in the mock
          (.timeline__dot--sm) — read as a drawing slip, so every marker is 48px here. */}
      <ol className="timeline">
        {ORDER_STAGES.map((stage, i) => {
          const done = i < order.stageIndex;
          const current = i === order.stageIndex;
          const t = (done || current) ? order.stageTimes[i] : undefined;
          const cls = ['timeline__step', done ? 'timeline__step--done' : '', current ? 'timeline__step--current' : '', t ? 'timeline__step--timed' : ''].filter(Boolean).join(' ');
          return (
            <li key={stage} className={cls} aria-current={current ? 'step' : undefined}>
              <span className="timeline__marker"><span className="timeline__dot" /></span>
              <div className="timeline__body">
                <p className="timeline__label">{stage}</p>
                {t && <p className="timeline__time">{fmtDateTime(t)}</p>}
              </div>
            </li>
          );
        })}
      </ol>

      {/* POC addition: way back to the full order record */}
      <div className="track-foot">
        <Link className="track-foot__link" to={`/orders/${order.id}`}>View order details
          <svg width="26" height="16" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M0 5h14M10 1l4 4-4 4" /></svg>
        </Link>
      </div>

      {/* No tab bar on this screen — the mock ends with the home indicator. */}
      <HomeIndicator />
    </div>
  );
}
