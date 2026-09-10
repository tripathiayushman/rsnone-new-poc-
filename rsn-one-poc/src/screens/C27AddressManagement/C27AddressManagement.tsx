import { useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState, NavBar, StatusBar, TabBar } from '../../components/Chrome';
import { useStore } from '../../store/useStore';
import type { Address } from '../../data/types';
import './C27AddressManagement.css';

/** Address-type icon, mirroring the mock: Office = case, Parents' Home = house, everything else = map pin. */
function AddressIcon({ label }: { label: string }) {
  const l = label.toLowerCase();
  if (/office|work/.test(l)) {
    return <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"><rect x="3" y="7.5" width="18" height="12.5" rx="2.5" /><path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5" /><path d="M3 13h18" /></svg>;
  }
  if (/parent|family/.test(l)) {
    return <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"><path d="M3 11 12 3l9 8" /><path d="M5.5 9.5V21h13V9.5" /><path d="M10 21v-5.5h4V21" /></svg>;
  }
  return <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s7-6.3 7-12a7 7 0 1 0-14 0c0 5.7 7 12 7 12Z" /><circle cx="12" cy="10" r="2.6" /></svg>;
}

/**
 * C27 Address Management ("My Addresses") — port of rsn-one-html/C27-AddressManagement.html.
 * Cards come from the store; the "..." menu opens a popover with Set as default / Delete
 * (handoff DEVIATION-RISK: two edit affordances per card — the menu holds the
 * destructive actions, "Edit" pushes to C31).
 */
export default function C27AddressManagement() {
  const addresses = useStore(s => s.addresses);
  const setDefaultAddress = useStore(s => s.setDefaultAddress);
  const removeAddress = useStore(s => s.removeAddress);
  const showToast = useStore(s => s.showToast);
  const [menuFor, setMenuFor] = useState<string | null>(null);

  const onSetDefault = (a: Address) => {
    setMenuFor(null);
    setDefaultAddress(a.id);
    showToast(`${a.label} is now your default address`);
  };
  const onDelete = (a: Address) => {
    setMenuFor(null);
    if (a.isDefault) { showToast('Set another address as default first'); return; }
    if (window.confirm(`Delete "${a.label}"? This cannot be undone.`)) {
      removeAddress(a.id);
      showToast('Address deleted');
    }
  };

  return (
    <div className="screen c27">
      <StatusBar />

      {/* click-away layer for the open "..." menu */}
      {menuFor && <div className="menu-backdrop" onClick={() => setMenuFor(null)} />}

      <div className="page">
        {/* NAV BAR — back arrow only (rose), no title text */}
        <NavBar />

        {/* PAGE HEAD — screen title + 2-line supporting line */}
        <header className="page-head">
          <h1 className="t-h1">My Addresses</h1>
          <p className="t-body-lg page-head__sub">Save and manage your delivery addresses{' '}<br />for a seamless experience.</p>
        </header>

        {addresses.length === 0 ? (
          <EmptyState title="No saved addresses" body="Add a delivery address to check out faster next time." cta="Add New Address" to="/addresses/new" />
        ) : (
          <>
            {/* ADDRESS LIST — one card per saved address; the default one carries the pill */}
            <ul className="addr-list">
              {addresses.map(a => (
                <li className="addr-card" key={a.id}>
                  <span className="addr-card__icon" aria-hidden="true"><AddressIcon label={a.label} /></span>
                  <div className="addr-card__body">
                    <div className="addr-card__head">
                      <h2 className="addr-card__name">{a.label}</h2>
                      {a.isDefault && <span className="addr-card__default">Default</span>}
                    </div>
                    <p className="addr-card__lines">
                      <span className="addr-card__recipient">{a.name}</span><br />
                      {a.line1}<br />
                      {a.line2 && <>{a.line2}<br /></>}
                      {a.city} {a.postal}<br />
                      {a.country}<br />
                      {a.phone}
                    </p>
                  </div>
                  <button className="addr-card__menu" aria-label={`More options for ${a.label} address`} aria-haspopup="menu"
                    aria-expanded={menuFor === a.id} onClick={() => setMenuFor(menuFor === a.id ? null : a.id)}>
                    <svg width="26" height="6" viewBox="0 0 26 6" fill="currentColor"><circle cx="3" cy="3" r="3" /><circle cx="13" cy="3" r="3" /><circle cx="23" cy="3" r="3" /></svg>
                  </button>
                  {menuFor === a.id && (
                    <div className="addr-card__popover" role="menu">
                      {!a.isDefault && <button type="button" role="menuitem" onClick={() => onSetDefault(a)}>Set as default</button>}
                      <button type="button" role="menuitem" className="is-danger" onClick={() => onDelete(a)}>Delete</button>
                    </div>
                  )}
                  <Link className="addr-card__edit" to={`/addresses/${a.id}`}>Edit</Link>
                </li>
              ))}
            </ul>

            {/* PRIMARY ACTION — full-width rose button, 90px tall */}
            <div className="list-action">
              <Link className="btn btn--primary btn--block btn--add" to="/addresses/new">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                Add New Address
              </Link>
            </div>
          </>
        )}
      </div>

      <TabBar active="me" />
    </div>
  );
}
