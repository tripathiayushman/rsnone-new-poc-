import { Link, useNavigate } from 'react-router-dom';
import type { MouseEvent } from 'react';
import type { Product } from '../data/types';
import { houseById } from '../data/catalogue';
import { inr } from '../lib/money';
import { Img } from './Img';
import { Icon } from './Icon';
import { useIsWishlisted, useStore } from '../store/useStore';

/**
 * The product card from C03 (rail, 194×160) — the same block also serves C04 / C06 / C09
 * with per-screen size overrides in that screen's CSS (`.product-card--tile` etc.).
 * Markup and class names match the handoff exactly.
 */
export function ProductCard({ product, className = '', mediaW = 194, mediaH = 160, showStock = false, as: Tag = 'li' }: {
  product: Product; className?: string; mediaW?: number; mediaH?: number; showStock?: boolean; as?: 'li' | 'div';
}) {
  const house = houseById(product.house);
  const wished = useIsWishlisted(product.id);
  const toggle = useStore(s => s.toggleWishlist);
  const navigate = useNavigate();
  const onWish = (e: MouseEvent) => { e.preventDefault(); e.stopPropagation(); toggle(product.id); };
  return (
    <Tag className={`product-card ${className}`} onClick={() => navigate(`/product/${product.id}`)} style={{ cursor: 'pointer' }}>
      <Img className="product-card__media" slot={product.images[0]} alt={`${product.name}, ${house?.name}`} width={mediaW} height={mediaH} />
      <button className="product-card__wish" aria-label={`${wished ? 'Remove' : 'Add'} ${product.name} ${wished ? 'from' : 'to'} wishlist`} aria-pressed={wished} onClick={onWish}>
        <Icon name={wished ? 'heart-fill' : 'heart'} width={30} height={27} />
      </button>
      <h3 className="t-card product-card__title"><Link to={`/product/${product.id}`} onClick={e => e.stopPropagation()}>{product.name}</Link></h3>
      <p className="t-meta product-card__house">{house?.name}</p>
      <span className="t-price product-card__price">{inr(product.price)}</span>
      <span className="chip chip--member product-card__chip">Member {inr(product.memberPrice)}</span>
      {showStock && (
        <span className={`product-card__stock product-card__stock--${product.stock}`}>
          {product.stock === 'in' ? 'In stock' : product.stock === 'low' ? 'Low stock' : 'Sold out'}
        </span>
      )}
    </Tag>
  );
}
