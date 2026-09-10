import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { StatusBar, TabBar } from '../../components/Chrome';
import { Img, Logo } from '../../components/Img';
import { productById } from '../../data/catalogue';
import { fmtDate } from '../../lib/dates';
import { inr } from '../../lib/money';
import { useStore } from '../../store/useStore';
import './C32ReturnRequest.css';

/**
 * C32 Return Request — port of rsn-one-html/C32-ReturnRequest.html. Reason, photos
 * and notes are local form state; submit calls the store's requestReturn.
 */
const REASONS = [
  { id: 'damaged', label: 'Product arrived damaged' },
  { id: 'wrong-item', label: 'Received wrong item' },
  { id: 'not-as-expected', label: 'Not as expected' },
  { id: 'quality', label: 'Quality issue' },
  { id: 'other', label: 'Other' },
];
const MAX_PHOTOS = 5;
const MAX_NOTES = 500;

interface Photo { id: number; url: string; name: string }

const CAMERA = <svg width="34" height="30" viewBox="0 0 24 21" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"><path d="M1 6.5A2.5 2.5 0 0 1 3.5 4h3L8.5 1h7l2 3h3A2.5 2.5 0 0 1 23 6.5v11A2.5 2.5 0 0 1 20.5 20h-17A2.5 2.5 0 0 1 1 17.5v-11Z" /><circle cx="12" cy="11.5" r="4.2" /></svg>;

export default function C32ReturnRequest() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const order = useStore(s => s.orders.find(o => o.id === id));
  const requestReturn = useStore(s => s.requestReturn);
  const showToast = useStore(s => s.showToast);

  const [reason, setReason] = useState<string | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [notes, setNotes] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(1);

  // object URLs are released when the screen unmounts
  const photosRef = useRef(photos); photosRef.current = photos;
  useEffect(() => () => { photosRef.current.forEach(p => URL.revokeObjectURL(p.url)); }, []);

  if (!order) return <Navigate to="/orders" replace />;

  const eligible = order.status === 'delivered';
  const deliveredOn = fmtDate(order.stageTimes[7] ?? order.placedAt);
  const first = productById(order.items[0]?.productId ?? '');
  const reasonLabel = REASONS.find(r => r.id === reason)?.label;

  const onPick = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (!files.length) return;
    setPhotos(prev => {
      const room = MAX_PHOTOS - prev.length;
      const added = files.slice(0, room).map(f => ({ id: nextId.current++, url: URL.createObjectURL(f), name: f.name }));
      return [...prev, ...added];
    });
  };
  const remove = (p: Photo) => {
    URL.revokeObjectURL(p.url);
    setPhotos(prev => prev.filter(x => x.id !== p.id));
  };
  const submit = () => {
    if (!eligible || !reasonLabel) return;
    requestReturn(order.id, reasonLabel, notes.trim() || undefined);
    navigate(`/orders/${order.id}`);
  };

  return (
    <div className="screen c32">
      <StatusBar />

      <div className="page">
        {/* NAV BAR — back arrow (x=33) followed by the RSN one logo lockup. No title. */}
        <nav className="navbar">
          <button className="navbar__back" aria-label="Back" onClick={() => navigate(-1)}>
            <svg width="38" height="30" viewBox="0 0 24 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M23 10H1M9 2 1 10l8 8" /></svg>
          </button>
          <Link className="navbar__logo" to="/home" aria-label="RSN one — Global Family Club">
            <Logo />
          </Link>
        </nav>

        {/* PAGE HEAD — screen title + outlined "Return Policy" button (202x63) on the
            same line, then a 2-line supporting paragraph. */}
        <header className="page-head">
          <div className="page-head__top">
            <h1 className="t-h1">Return Request</h1>
            <button className="btn btn--outline btn--policy" onClick={() => showToast('Returns accepted within 14 days of delivery')}>
              <svg width="27" height="31" viewBox="0 0 20 23" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"><path d="M12 1H4a2.5 2.5 0 0 0-2.5 2.5v16A2.5 2.5 0 0 0 4 22h12a2.5 2.5 0 0 0 2.5-2.5V7.5L12 1Z" /><path d="M12 1v6.5h6.5" /><path d="M5.5 12h9M5.5 16h9" /></svg>
              Return Policy
            </button>
          </div>
          <p className="t-body-lg page-head__sub">Request a return for your order with ease.<br />We’re here to help.</p>
        </header>

        {/* SECTION: Order Details — the order being returned. Card 442-630.
            Several items are listed one under another in the same row style. */}
        <section className="rr-section rr-section--order">
          <div className="rr-section__head">
            <h2 className="t-section">Order Details</h2>
          </div>

          <div className="order-card">
            <Img className="order-card__media" slot={first?.images[0] ?? 'prod-copper-vessel-01'} alt={first?.name ?? ''} width={172} height={162} />
            <div className="order-card__body">
              <p className="order-card__no">Order #{order.id}</p>
              <p className="order-card__delivered">Delivered on {deliveredOn}</p>
              {order.items.map(it => {
                const p = productById(it.productId);
                return (
                  <div key={it.productId}>
                    <h3 className="order-card__product">{p?.name ?? it.productId}</h3>
                    <p className="order-card__meta">Qty: {it.qty}<i>|</i><span className="order-card__price">{inr(it.unitPrice)}</span></p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION: Reason for Return — 5 mutually exclusive options, required.
            DEVIATION-RISK (handoff): "Other" has no dedicated "please specify" input;
            the optional notes box below is the only free text. */}
        <section className="rr-section rr-section--reason">
          <div className="rr-section__head">
            <h2 className="t-section">Reason for Return</h2>
          </div>

          <div className="reasons" role="radiogroup" aria-label="Reason for return">
            {REASONS.map(r => (
              <label key={r.id} className={`reason ${reason === r.id ? 'reason--selected' : ''}`}>
                <input className="reason__radio" type="radio" name="returnReason" value={r.id}
                  checked={reason === r.id} onChange={() => setReason(r.id)} />
                <span className="reason__label">{r.label}</span>
              </label>
            ))}
          </div>
        </section>

        {/* SECTION: Add Photos (Optional) — 5 slots across, 140px square. Filled
            slots show the picked image with a remove button; the rest open the
            native file picker. Picked photos count towards the 5. */}
        <section className="rr-section rr-section--photos">
          <div className="rr-section__head">
            <h2 className="t-section">Add Photos <span className="rr-section__opt">(Optional)</span></h2>
            <span className="rr-section__note">Add up to 5 photos</span>
          </div>

          <input ref={fileRef} className="photo-input" type="file" accept="image/*" multiple tabIndex={-1} aria-hidden="true" onChange={onPick} />
          <div className="photo-grid">
            {photos.map(p => (
              <div className="photo-tile" key={p.id}>
                {/* user-picked file (object URL), not a manifest slot — plain <img> */}
                <img className="photo-tile__img" src={p.url} alt={p.name} width={140} height={140} />
                <button className="photo-tile__remove" aria-label="Remove this photo" onClick={() => remove(p)}>
                  <svg width="16" height="16" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M2 2l10 10M12 2 2 12" /></svg>
                </button>
              </div>
            ))}
            {Array.from({ length: MAX_PHOTOS - photos.length }, (_, i) => (
              <button className="photo-add" type="button" key={`add-${i}`} onClick={() => fileRef.current?.click()}>
                {CAMERA}
                <span className="photo-add__label">Add Photo</span>
              </button>
            ))}
          </div>
        </section>

        {/* SECTION: Additional Notes (Optional) — 133px textarea, live n/500 counter. */}
        <section className="rr-section rr-section--notes">
          <div className="rr-section__head">
            <h2 className="t-section">Additional Notes <span className="rr-section__opt">(Optional)</span></h2>
          </div>

          <div className="notes">
            <textarea className="notes__input" name="notes" maxLength={MAX_NOTES}
              placeholder="Tell us more about your return request..."
              value={notes} onChange={e => setNotes(e.target.value.slice(0, MAX_NOTES))} />
            <span className="notes__count">{notes.length}/{MAX_NOTES}</span>
          </div>
        </section>

        {/* PRIMARY ACTION — full-width rose button, 72px tall, letterspaced uppercase.
            Disabled until a reason is chosen; replaced by a muted note when the order
            isn't returnable (not yet delivered, or already returned). */}
        <div className="page-action">
          {eligible ? (
            <button className="btn btn--primary btn--block btn--submit" type="submit" disabled={!reason} onClick={submit}>Submit Return Request</button>
          ) : (
            <p className="page-action__note" aria-disabled="true">
              {order.status === 'returned' ? 'This order has already been returned'
                : order.status === 'return-requested' ? 'A return is already under review for this order'
                : 'This order isn’t eligible for return yet'}
            </p>
          )}
        </div>
        <div className="page-end" />
      </div>

      {/* TAB BAR — ME active. */}
      <TabBar active="me" />
    </div>
  );
}
