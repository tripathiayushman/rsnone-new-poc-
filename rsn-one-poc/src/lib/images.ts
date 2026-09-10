import { AVAILABLE_SLOTS } from '../data/imageIndex';

/**
 * Photography stand-ins. 21 slots in IMAGE-MANIFEST.md were not supplied. Until the
 * real file lands in rsn-one-html/rsn-one-images/ (then `npm run images`), each one
 * borrows the closest supplied photograph so the demo never shows a broken box.
 * The <img> gets data-standin="true" so QA can spot them.
 */
export const STANDIN: Record<string, string> = {
  'prod-copper-vessel-01': 'drop-brass-urn-01',
  'prod-copper-vessel-02': 'prod-carved-vase-01',
  'prod-copper-vessel-03': 'drop-ceramic-jar-01',
  'prod-copper-vessel-04': 'hero-store-footer-01',
  'prod-copper-vessel-05': 'drop-brass-urn-01',
  'prod-brass-kettle-01': 'drop-tea-set-01',
  'prod-beeswax-candle-01': 'hero-limited-drops-02',
  'prod-yak-blanket-01': 'world-sleep-01',
  'prod-linen-sheets-01': 'hero-membership-01',
  'prod-linen-throw-01': 'hero-membership-01',
  'prod-ceramide-cream-01': 'world-skin-01',
  'prod-glass-diffuser-01': 'world-skin-01',
  'prod-ceramic-mug-01': 'world-morning-01',
  'prod-gift-box-01': 'world-gifts-01',
  'prod-rsn-candle-01': 'hero-order-confirmation-01',
  'prod-shop-grid-07-01': 'world-table-01',
  'prod-shop-grid-08-01': 'drop-stone-bowl-01',
  'prod-stone-bowl-01': 'drop-stone-bowl-01',
  'prod-brass-urn-01': 'drop-brass-urn-01',
  'prod-ceramic-jar-01': 'drop-ceramic-jar-01',
  'prod-tea-set-01': 'drop-tea-set-01',
};

export interface Resolved { src: string; standin: boolean }

/** Resolve a manifest slot name (no extension) to a URL under /images. */
export function resolveSlot(slot: string): Resolved | null {
  const clean = slot.replace(/\.(jpe?g|png|webp)$/i, '');
  if (AVAILABLE_SLOTS.has(clean)) return { src: url(clean), standin: false };
  const alt = STANDIN[clean];
  if (alt && AVAILABLE_SLOTS.has(alt)) return { src: url(alt), standin: true };
  return null;
}
function url(slot: string) {
  // BASE_URL is '/' for the web build and './' for the embedded mobile build
  return `${import.meta.env.BASE_URL}images/${slot}${slot.startsWith('logo-') ? '.png' : '.webp'}`;
}
