import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { NavBar, StatusBar, TabBar } from '../../components/Chrome';
import { useStore } from '../../store/useStore';
import './C31AddEditAddress.css';

const CITIES = ['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Pokhara', 'Kaski', 'Chitwan', 'Biratnagar', 'Butwal'];
const STATES = ['Bagmati', 'Gandaki', 'Lumbini', 'Koshi', 'Madhesh', 'Karnali', 'Sudurpashchim'];
const COUNTRIES = ['Nepal', 'India', 'United Kingdom', 'United States', 'United Arab Emirates', 'Australia'];
const LABEL_CHIPS = ['Home', 'Office', 'Other'] as const;

/** A select's option list, with the current value prepended when it is not a preset. */
const withValue = (list: string[], v: string) => (v && !list.includes(v) ? [v, ...list] : list);
const digits = (s: string) => s.replace(/\D/g, '');

interface Form {
  label: string; name: string; phone: string; line1: string; line2: string;
  city: string; state: string; postal: string; country: string; isDefault: boolean;
}
type Field = keyof Form;

/**
 * C31 Add / Edit Address — port of rsn-one-html/C31-AddEditAddress.html. Serves
 * /addresses/new (add) and /addresses/:id (edit, prefilled). Nine .field rows as
 * drawn, plus a POC "Label" row at the top (the C27 list needs it).
 */
export default function C31AddEditAddress() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addresses = useStore(s => s.addresses);
  const addAddress = useStore(s => s.addAddress);
  const updateAddress = useStore(s => s.updateAddress);
  const removeAddress = useStore(s => s.removeAddress);
  const showToast = useStore(s => s.showToast);
  const editing = id ? addresses.find(a => a.id === id) : undefined;

  // The mock draws the "Set as default" switch ON — new addresses default to it.
  const [form, setForm] = useState<Form>(() => ({
    label: editing?.label ?? 'Home',
    name: editing?.name ?? '', phone: editing?.phone ?? '',
    line1: editing?.line1 ?? '', line2: editing?.line2 ?? '',
    city: editing?.city ?? 'Kathmandu', state: editing?.state ?? 'Bagmati',
    postal: editing?.postal ?? '', country: editing?.country ?? 'Nepal',
    isDefault: editing ? editing.isDefault : true,
  }));
  const [submitted, setSubmitted] = useState(false);

  if (id && !editing) return <Navigate to="/addresses" replace />;

  const set = <K extends Field>(k: K, v: Form[K]) => setForm(f => ({ ...f, [k]: v }));

  const errors: Partial<Record<Field, string>> = {
    label: form.label.trim() ? undefined : 'Give this address a label',
    name: form.name.trim() ? undefined : 'Full name is required',
    phone: digits(form.phone).length >= 10 ? undefined : 'Enter a valid phone number (at least 10 digits)',
    line1: form.line1.trim() ? undefined : 'Address line 1 is required',
    city: form.city.trim() ? undefined : 'Select a city',
    postal: /^\d{5,6}$/.test(form.postal.trim()) ? undefined : 'Enter a 5–6 digit postal code',
  };
  const valid = Object.values(errors).every(e => !e);
  const err = (k: Field) => (submitted ? errors[k] : undefined);
  const cls = (k: Field, extra = '') => `field ${extra} ${err(k) ? 'field--error' : ''}`;

  const labelChip = (LABEL_CHIPS as readonly string[]).includes(form.label) ? form.label : 'Other';
  const pickLabel = (chip: string) => {
    if (chip === 'Other') { if (labelChip !== 'Other') set('label', ''); }
    else set('label', chip);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!valid) return;
    const data = {
      label: form.label.trim(), name: form.name.trim(), phone: form.phone.trim(),
      line1: form.line1.trim(), line2: form.line2.trim() || undefined,
      city: form.city, state: form.state, postal: form.postal.trim(), country: form.country,
      // the default address can only be replaced by promoting another one, never un-set
      isDefault: form.isDefault || (editing?.isDefault ?? false) || addresses.length === 0,
    };
    if (editing) updateAddress(editing.id, data); else addAddress(data);
    showToast(editing ? 'Address updated' : 'Address saved');
    navigate('/addresses');
  };

  const onDelete = () => {
    if (!editing) return;
    if (editing.isDefault) { showToast('Set another address as default first'); return; }
    if (window.confirm(`Delete "${editing.label}"? This cannot be undone.`)) {
      removeAddress(editing.id);
      showToast('Address deleted');
      navigate(-1);
    }
  };

  return (
    <div className="screen c31">
      <StatusBar />

      <div className="page">
        {/* NAV BAR — back arrow only (rose), no title text */}
        <NavBar />

        {/* PAGE HEAD — screen title + 2-line supporting line, by mode */}
        <header className="page-head">
          <h1 className="t-h1">{editing ? 'Edit Address' : 'Add Address'}</h1>
          <p className="t-body-lg page-head__sub">
            {editing
              ? <>Update this delivery address to keep your{' '}<br />orders arriving seamlessly.</>
              : <>Add a new delivery address to receive your{' '}<br />orders seamlessly.</>}
          </p>
        </header>

        {/* FORM — rows built from the shared .field component, 10px apart */}
        <form className="form" onSubmit={onSubmit} noValidate>

          {/* POC: Label — Home / Office / Other chips (the address list shows it) */}
          <div className={cls('label')}>
            <span className="field__icon">
              <svg width="36" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"><path d="M3 3h8l10 10-8 8L3 11V3Z" /><circle cx="7.5" cy="7.5" r="1.5" /></svg>
            </span>
            <span className="field__body">
              <span className="field__label">Label</span>
              <span className="field__chips" role="radiogroup" aria-label="Address label">
                {LABEL_CHIPS.map(c => (
                  <button key={c} type="button" role="radio" aria-checked={labelChip === c}
                    className={`field__chip ${labelChip === c ? 'field__chip--on' : ''}`} onClick={() => pickLabel(c)}>{c}</button>
                ))}
                {labelChip === 'Other' && (
                  <input className="field__input" type="text" name="label" value={form.label} placeholder="e.g. Parents’ Home"
                    aria-label="Custom label" onChange={e => set('label', e.target.value)} />
                )}
              </span>
              {err('label') && <span className="field__error">{err('label')}</span>}
            </span>
          </div>

          {/* Full Name */}
          <label className={cls('name')}>
            <span className="field__icon">
              <svg width="36" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="8" r="4" /><path d="M4.5 21a7.5 7.5 0 0 1 15 0" /></svg>
            </span>
            <span className="field__body">
              <span className="field__label">Full Name</span>
              <input className="field__input" type="text" name="fullName" value={form.name} placeholder="Full Name" autoComplete="name"
                onChange={e => set('name', e.target.value)} />
              {err('name') && <span className="field__error">{err('name')}</span>}
            </span>
          </label>

          {/* Phone Number */}
          <label className={cls('phone')}>
            <span className="field__icon">
              <svg width="36" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h3l2 5-2.5 1.5a12 12 0 0 0 6 6L16 13l5 2v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4 5.2 2 2 0 0 1 6 3Z" /></svg>
            </span>
            <span className="field__body">
              <span className="field__label">Phone Number</span>
              <input className="field__input" type="tel" name="phone" value={form.phone} placeholder="Phone Number" autoComplete="tel"
                onChange={e => set('phone', e.target.value)} />
              {err('phone') && <span className="field__error">{err('phone')}</span>}
            </span>
          </label>

          {/* Address Line 1 — value + grey hint line beneath (the hint doubles as placeholder) */}
          <label className={cls('line1')}>
            <span className="field__icon">
              <svg width="36" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s7-6.3 7-12a7 7 0 1 0-14 0c0 5.7 7 12 7 12Z" /><circle cx="12" cy="10" r="2.6" /></svg>
            </span>
            <span className="field__body">
              <span className="field__label">Address Line 1</span>
              <input className="field__input" type="text" name="address1" value={form.line1} placeholder="House no., Building, Street, Area"
                autoComplete="address-line1" onChange={e => set('line1', e.target.value)} />
              <span className="field__hint">House no., Building, Street, Area</span>
              {err('line1') && <span className="field__error">{err('line1')}</span>}
            </span>
          </label>

          {/* Address Line 2 (Optional) — value + grey hint line */}
          <label className="field">
            <span className="field__icon">
              <svg width="36" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"><path d="M4 21V6l7-3v18M11 21V9l9 3v9" /><path d="M6.5 9h2M6.5 13h2M6.5 17h2M14 14h3M14 18h3" /></svg>
            </span>
            <span className="field__body">
              <span className="field__label">Address Line 2 (Optional)</span>
              <input className="field__input" type="text" name="address2" value={form.line2} placeholder="Landmark, Apartment, Suite, etc."
                autoComplete="address-line2" onChange={e => set('line2', e.target.value)} />
              <span className="field__hint">Landmark, Apartment, Suite, etc.</span>
            </span>
          </label>

          {/* City — select variant of .field, chevron-down at the right */}
          <label className={cls('city', 'field--select')}>
            <span className="field__icon">
              <svg width="36" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"><path d="M4 21V8l6-4v17M10 21V11l10 3v7" /><path d="M6.2 10h1.8M6.2 14h1.8M6.2 18h1.8M13 15h2M13 18h2M17 15h1.6M17 18h1.6" /></svg>
            </span>
            <span className="field__body">
              <span className="field__label">City</span>
              <select className="field__input" name="city" value={form.city} onChange={e => set('city', e.target.value)}>
                {withValue(CITIES, form.city).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {err('city') && <span className="field__error">{err('city')}</span>}
            </span>
            <span className="field__chevron">
              <svg width="26" height="14" viewBox="0 0 26 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2 2l11 10L24 2" /></svg>
            </span>
          </label>

          {/* State / Province.
              DEVIATION-RISK (handoff): drawn with a chevron-RIGHT like a push-to-picker
              while City and Country are inline selects. Built as a select here (same
              data shape) but the chevron is kept as drawn. */}
          <label className="field field--select">
            <span className="field__icon">
              <svg width="36" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"><path d="M2 6.5 9 4l6 2.5L22 4v13.5L15 20l-6-2.5L2 20Z" /><path d="M9 4v13.5M15 6.5V20" /></svg>
            </span>
            <span className="field__body">
              <span className="field__label">State / Province</span>
              <select className="field__input" name="state" value={form.state} onChange={e => set('state', e.target.value)}>
                {withValue(STATES, form.state).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </span>
            <span className="field__chevron">
              <svg width="14" height="26" viewBox="0 0 14 26" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2 2l10 11L2 24" /></svg>
            </span>
          </label>

          {/* Postal Code */}
          <label className={cls('postal')}>
            <span className="field__icon">
              <svg width="36" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"><rect x="2.5" y="5" width="19" height="14" rx="2.5" /><path d="m3 7 9 6.5L21 7" /></svg>
            </span>
            <span className="field__body">
              <span className="field__label">Postal Code</span>
              <input className="field__input" type="text" inputMode="numeric" name="postal" value={form.postal} placeholder="Postal Code"
                maxLength={6} autoComplete="postal-code" onChange={e => set('postal', e.target.value)} />
              {err('postal') && <span className="field__error">{err('postal')}</span>}
            </span>
          </label>

          {/* Country — select variant, chevron-down */}
          <label className="field field--select">
            <span className="field__icon">
              <svg width="36" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" /></svg>
            </span>
            <span className="field__body">
              <span className="field__label">Country</span>
              <select className="field__input" name="country" value={form.country} onChange={e => set('country', e.target.value)}>
                {withValue(COUNTRIES, form.country).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </span>
            <span className="field__chevron">
              <svg width="26" height="14" viewBox="0 0 26 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2 2l11 10L24 2" /></svg>
            </span>
          </label>

          {/* "Set as default address" — same .field shell, checkbox styled as a 76x44 switch */}
          <label className="field field--toggle">
            <span className="field__icon">
              <svg width="36" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"><path d="M3 11 12 3l9 8" /><path d="M5.5 9.5V21h13V9.5" /><path d="M10 21v-5.5h4V21" /></svg>
            </span>
            <span className="field__body">
              <span className="field__title">Set as default address</span>
              <span className="field__desc">Use this address for all future orders</span>
            </span>
            <span className="switch">
              <input className="switch__input" type="checkbox" name="setDefault" checked={form.isDefault}
                onChange={e => set('isDefault', e.target.checked)} />
              <span className="switch__track" />
            </span>
          </label>

          {/* PRIMARY ACTION — full-width rose button, 88px tall */}
          <div className="form-action">
            <button className="btn btn--primary btn--block btn--save" type="submit">Save Address</button>
            {editing && <button type="button" className="form-delete" onClick={onDelete}>Delete address</button>}
          </div>
        </form>
      </div>

      <TabBar active="me" />
    </div>
  );
}
