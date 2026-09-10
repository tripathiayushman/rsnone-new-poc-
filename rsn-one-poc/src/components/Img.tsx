import type { ImgHTMLAttributes } from 'react';
import { resolveSlot } from '../lib/images';

interface Props extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  /** manifest slot name, e.g. "prod-copper-vessel-01" (extension optional) */
  slot: string;
}

/**
 * Every photograph in the app goes through this. It maps a manifest slot name to
 * /images/<slot>.webp, falls back to a supplied stand-in for the 21 missing slots,
 * and renders a labelled box if neither exists. Drop the real file into
 * rsn-one-html/rsn-one-images/ and run `npm run images` — no code change.
 */
export function Img({ slot, alt = '', className, width, height, style, ...rest }: Props) {
  const r = resolveSlot(slot);
  if (!r) {
    return (
      <div className={`img-slot ${className ?? ''}`} style={{ width, height, ...style }} role="img" aria-label={alt || slot}>
        {slot}
      </div>
    );
  }
  return (
    <img src={r.src} alt={alt} className={className} width={width} height={height} style={style}
      loading="lazy" decoding="async" data-slot={slot} data-standin={r.standin ? 'true' : undefined} {...rest} />
  );
}

/** The RSN one lockup. `dark` = ink variant for light grounds. */
export function Logo({ dark = false, width = 186, height = 94, className = '' }: { dark?: boolean; width?: number; height?: number; className?: string }) {
  return <Img slot={dark ? 'logo-rsnone-dark-01' : 'logo-rsnone-01'} alt="RSN one — Global Family Club" className={`logo ${className}`} width={width} height={height} />;
}
