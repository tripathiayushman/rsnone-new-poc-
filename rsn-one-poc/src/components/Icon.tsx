import type { SVGProps } from 'react';

/**
 * Shared icon set, redrawn from the handoff HTML (stroke="currentColor" so they inherit
 * colour). Screens may still inline one-off SVGs verbatim from their handoff file.
 */
const ICONS = {
  search: { vb: '0 0 24 24', sw: 1.3, d: <><circle cx="11" cy="11" r="7" /><path d="m16.5 16.5 4 4" /></> },
  bag: { vb: '0 0 24 24', sw: 1.3, d: <><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></> },
  'bag-fill': { vb: '0 0 24 24', fill: true, d: <><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" strokeWidth="1.4" /></> },
  heart: { vb: '0 0 18 16', sw: 1.2, d: <path d="M9 15S1 10.4 1 5.6A4.3 4.3 0 0 1 9 3.4 4.3 4.3 0 0 1 17 5.6C17 10.4 9 15 9 15Z" /> },
  'heart-fill': { vb: '0 0 18 16', fill: true, d: <path d="M9 15.5S.6 10.6.6 5.4A4.5 4.5 0 0 1 9 3.1 4.5 4.5 0 0 1 17.4 5.4C17.4 10.6 9 15.5 9 15.5Z" /> },
  'heart-lg': { vb: '0 0 24 24', sw: 1.4, d: <path d="M12 20.5S3 14.8 3 9.2A5 5 0 0 1 12 6.5 5 5 0 0 1 21 9.2c0 5.6-9 11.3-9 11.3Z" /> },
  'heart-lg-fill': { vb: '0 0 24 24', fill: true, d: <path d="M12 20.5S2.5 14.5 2.5 8.9A5 5 0 0 1 12 6.2 5 5 0 0 1 21.5 8.9c0 5.6-9.5 11.6-9.5 11.6Z" /> },
  home: { vb: '0 0 24 24', sw: 1.4, d: <><path d="M12 3.5 3.5 10.5V21h17V10.5L12 3.5Z" /><path d="M10 21v-5h4v5" /></> },
  'home-fill': { vb: '0 0 24 24', fill: true, d: <path d="M12 3 3 10v11h6v-6h6v6h6V10l-9-7Z" /> },
  user: { vb: '0 0 24 24', sw: 1.4, d: <><circle cx="12" cy="8" r="4" /><path d="M4.5 21a7.5 7.5 0 0 1 15 0" /></> },
  'user-fill': { vb: '0 0 24 24', fill: true, d: <><circle cx="12" cy="8" r="4" /><path d="M4.5 21a7.5 7.5 0 0 1 15 0Z" /></> },
  back: { vb: '0 0 24 22', sw: 1.4, d: <path d="M23 11H1M9 3 1 11l8 8" /> },
  'arrow-right': { vb: '0 0 16 10', sw: 1.2, d: <path d="M0 5h14M10 1l4 4-4 4" /> },
  'chevron-right': { vb: '0 0 10 17', sw: 1.4, d: <path d="m1.2 1 7.3 7.5-7.3 7.5" /> },
  'chevron-down': { vb: '0 0 16 10', sw: 1.3, d: <path d="m1 1 7 7 7-7" /> },
  'chevron-up': { vb: '0 0 16 10', sw: 1.3, d: <path d="m1 9 7-7 7 7" /> },
  check: { vb: '0 0 14 11', sw: 1.8, d: <path d="m1 5.5 4 4 8-8" /> },
  close: { vb: '0 0 14 14', sw: 1.8, d: <path d="M2 2l10 10M12 2 2 12" /> },
  plus: { vb: '0 0 24 24', sw: 1.4, d: <path d="M5 12h14M12 5v14" /> },
  minus: { vb: '0 0 24 24', sw: 1.4, d: <path d="M5 12h14" /> },
  trash: { vb: '0 0 18 20', sw: 1.2, d: <><path d="M2 5h14" /><path d="M4 5l1 13h8l1-13" /><path d="M7 5V2h4v3" /></> },
  share: { vb: '0 0 16 20', sw: 1.2, d: <><path d="M8 1v12" /><path d="M4 5l4-4 4 4" /><path d="M1 11v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7" /></> },
  filter: { vb: '0 0 20 16', sw: 1.2, d: <><path d="M0 4h5M9 4h11M0 12h11M15 12h5" /><circle cx="7" cy="4" r="2" /><circle cx="13" cy="12" r="2" /></> },
  clock: { vb: '0 0 16 16', sw: 1.2, d: <><circle cx="8" cy="8" r="6.6" /><path d="M8 4.2V8l2.6 1.6" /></> },
  bell: { vb: '0 0 24 24', sw: 1.3, d: <><path d="M6 17V10.5a6 6 0 1 1 12 0V17" /><path d="M4.5 17h15" /><path d="M10 20a2 2 0 0 0 4 0" /></> },
  shield: { vb: '0 0 24 24', sw: 1.3, d: <><path d="M12 3 4 6v6c0 4.6 3.4 8.1 8 9 4.6-.9 8-4.4 8-9V6l-8-3Z" /><path d="m12 8.6 1.1 2.3 2.5.3-1.8 1.7.5 2.5-2.3-1.2-2.3 1.2.5-2.5-1.8-1.7 2.5-.3L12 8.6Z" /></> },
  concierge: { vb: '0 0 24 24', sw: 1.3, d: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="10" r="2.8" /><path d="M6.6 19a6 6 0 0 1 10.8 0" /></> },
  pin: { vb: '0 0 24 24', sw: 1.3, d: <><path d="M12 21s6.5-6.2 6.5-11a6.5 6.5 0 1 0-13 0C5.5 14.8 12 21 12 21Z" /><circle cx="12" cy="10" r="2.4" /><path d="M7 21.6h10" /></> },
  card: { vb: '0 0 24 24', sw: 1.3, d: <><rect x="2.5" y="5.5" width="19" height="13" rx="2.5" /><path d="M2.5 10h19" /><path d="M6 14.5h3" /></> },
  help: { vb: '0 0 24 24', sw: 1.3, d: <><circle cx="12" cy="12" r="9" /><path d="M9.6 9.4a2.5 2.5 0 1 1 3.3 2.4c-.6.2-.9.8-.9 1.4v.5" /><path d="M12 16.6h.01" strokeWidth="1.8" strokeLinecap="round" /></> },
  mail: { vb: '0 0 24 24', sw: 1.4, d: <><rect x="2.5" y="5" width="19" height="14" rx="2.5" /><path d="m3 7 9 6 9-6" /></> },
  lock: { vb: '0 0 24 24', sw: 1.4, d: <><rect x="4" y="10.5" width="16" height="11" rx="2.5" /><path d="M8 10.5V7.6a4 4 0 0 1 8 0v2.9" /></> },
  eye: { vb: '0 0 24 17', sw: 1.4, d: <><path d="M1 8.5S5 2 12 2s11 6.5 11 6.5S19 15 12 15 1 8.5 1 8.5Z" /><circle cx="12" cy="8.5" r="3.2" /></> },
  phone: { vb: '0 0 24 24', sw: 1.5, d: <path d="M6 3h3l2 5-2.5 1.5a12 12 0 0 0 6 6L16 13l5 2v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4 5.2 2 2 0 0 1 6 3Z" /> },
  globe: { vb: '0 0 24 24', sw: 1.5, d: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" /></> },
  truck: { vb: '0 0 26 22', sw: 1.6, d: <><path d="M1 3h13v11H1z" /><path d="M14 7h5l4 4v3h-9z" /><circle cx="7" cy="17" r="2.2" /><circle cx="18" cy="17" r="2.2" /></> },
  'check-circle': { vb: '0 0 24 24', sw: 1.6, d: <><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></> },
  return: { vb: '0 0 24 22', sw: 1.6, d: <><path d="M4 8h11a5 5 0 0 1 0 10H8" /><path d="M8 3 3 8l5 5" /></> },
  dots: { vb: '0 0 26 6', fill: true, d: <><circle cx="3" cy="3" r="3" /><circle cx="13" cy="3" r="3" /><circle cx="23" cy="3" r="3" /></> },
  tag: { vb: '0 0 20 18', sw: 1.3, d: <><path d="M1 1h8l10 10-7 7L1 8V1Z" /><circle cx="5" cy="5" r="1.4" /></> },
  gift: { vb: '0 0 24 24', sw: 1.3, d: <><rect x="3" y="8" width="18" height="13" rx="1.5" /><path d="M3 12h18M12 8v13M12 8s-4-.5-4-3a2 2 0 0 1 4 0 2 2 0 0 1 4 0c0 2.5-4 3-4 3Z" /></> },
  info: { vb: '0 0 24 24', sw: 1.3, d: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7.5h.01" strokeLinecap="round" strokeWidth="1.8" /></> },
  chat: { vb: '0 0 24 23', sw: 1.4, d: <path d="M3 4h18v12H9l-6 5V4Z" /> },
  star: { vb: '0 0 24 24', sw: 1.3, d: <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z" /> },
  camera: { vb: '0 0 24 21', sw: 1.3, d: <><path d="M3 6h4l2-3h6l2 3h4v13H3V6Z" /><circle cx="12" cy="12" r="3.5" /></> },
  leaf: { vb: '0 0 24 24', sw: 1.3, d: <><path d="M5 19C5 9 12 4 20 4c0 8-5 15-15 15Z" /><path d="M5 19c3-5 7-8 11-10" /></> },
  wallet: { vb: '0 0 24 24', sw: 1.3, d: <><rect x="2.5" y="6" width="19" height="13" rx="2.5" /><path d="M16 12.5h5.5v3H16a1.5 1.5 0 0 1 0-3Z" /><path d="M2.5 9h19" /></> },
  copy: { vb: '0 0 24 24', sw: 1.4, d: <><rect x="8" y="8" width="13" height="13" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></> },
  logout: { vb: '0 0 24 24', sw: 1.4, d: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5M21 12H9" /></> },
} as const;

export type IconName = keyof typeof ICONS;

interface Props extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 24, width, height, ...rest }: Props) {
  const def = ICONS[name] as { vb: string; sw?: number; fill?: boolean; d: React.ReactNode };
  const [, , vw, vh] = def.vb.split(' ').map(Number);
  const w = width ?? size;
  const h = height ?? Math.round((size * vh) / vw);
  return (
    <svg width={w} height={h} viewBox={def.vb} aria-hidden="true"
      fill={def.fill ? 'currentColor' : 'none'}
      stroke={def.fill ? undefined : 'currentColor'}
      strokeWidth={def.fill ? undefined : def.sw ?? 1.3}
      {...rest}>
      {def.d}
    </svg>
  );
}
