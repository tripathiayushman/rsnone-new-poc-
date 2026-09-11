import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Tara } from '../components/Tara';
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
  const toast = useStore(s => s.toast);
  const [vw, setVw] = useState(() => window.innerWidth);
  const { pathname } = useLocation();
  // Tara concierge — session-scoped: hidden + dragged position persist while the
  // app stays open (DeviceFrame never unmounts), reset on a fresh launch.
  const [taraHidden, setTaraHidden] = useState(false);
  const [taraCollapsed, setTaraCollapsed] = useState(false);
  const [taraPos, setTaraPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const on = () => setVw(window.innerWidth);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  useEffect(() => { window.scrollTo({ top: 0 }); }, [pathname]);

  // phones: compact 520px canvas scaled to the viewport width; desktop: 853px mock canvas
  const compact = vw < 900;
  const canvasW = compact ? 520 : ART_W;
  const fit = Math.min(1, (vw - 8) / canvasW);
  const zoom = compact ? fit : Math.min(zoomPref, fit);

  return (
    <div className="frame-backdrop">
      <div className={"frame" + (compact ? " frame--compact" : "")} style={{ zoom, width: canvasW }}>
        <Outlet />
      </div>

      {toast && <div className="toast" role="status">{toast}</div>}

      {/* Tara, the house concierge — home screen only, rendered at viewport scale */}
      {pathname === '/home' && !taraHidden && (
        <Tara
          pos={taraPos}
          collapsed={taraCollapsed}
          onMove={setTaraPos}
          onCollapse={() => setTaraCollapsed(true)}
          onRemove={() => setTaraHidden(true)}
        />
      )}
    </div>
  );
}
