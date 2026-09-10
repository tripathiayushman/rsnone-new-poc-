import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { SCREENS } from '../screens/registry';
import './DeviceFrame.css';

const ART_W = 853;

/**
 * The 853px artboard the handoff was authored at, scaled with CSS `zoom`.
 * Desktop: 0.5× by default (the 427px "phone" reading), switchable 0.5 / 0.75 / 1.
 * Narrow viewports: fit to width. Toasts live outside the zoomed element so they
 * render at viewport scale.
 */
export function DeviceFrame() {
  const zoomPref = useStore(s => s.zoom);
  const setZoom = useStore(s => s.setZoom);
  const toast = useStore(s => s.toast);
  const resetDemo = useStore(s => s.resetDemo);
  const [vw, setVw] = useState(() => window.innerWidth);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const on = () => setVw(window.innerWidth);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  useEffect(() => { window.scrollTo({ top: 0 }); }, [pathname]);

  // dev controls (screen jump, zoom, reset) only on the local dev server or with ?dev in the URL
  const showDev = import.meta.env.DEV || new URLSearchParams(window.location.search).has('dev');
  // phones: compact 520px canvas scaled to the viewport width; desktop: 853px mock canvas
  const compact = vw < 900;
  const canvasW = compact ? 520 : ART_W;
  const fit = Math.min(1, (vw - 8) / canvasW);
  const zoom = compact ? fit : Math.min(zoomPref, fit);
  const current = SCREENS.find(s => s.match(pathname));

  return (
    <div className={"frame-backdrop" + (showDev ? ' frame-backdrop--dev' : '')}>
      <div className={"frame" + (compact ? " frame--compact" : "")} style={{ zoom, width: canvasW }}>
        <Outlet />
      </div>

      {toast && <div className="toast" role="status">{toast}</div>}

      {showDev && <div className="devbar" aria-label="POC controls">
        <select className="devbar__jump" value={current?.path ?? ''} onChange={e => e.target.value && navigate(e.target.value)} aria-label="Jump to screen">
          <option value="">Jump to screen…</option>
          {SCREENS.map(s => <option key={s.id} value={s.path}>{s.id} · {s.name}</option>)}
        </select>
        {vw >= 900 && (
          <span className="devbar__zoom">
            {[0.5, 0.75, 1].map(z => (
              <button key={z} className={zoomPref === z ? 'is-on' : ''} onClick={() => setZoom(z)}>{z}×</button>
            ))}
          </span>
        )}
        <button className="devbar__reset" onClick={() => { if (confirm('Reset all demo state (bag, orders, membership, sign-in)?')) { resetDemo(); navigate('/'); } }}>Reset demo</button>
      </div>}
    </div>
  );
}
