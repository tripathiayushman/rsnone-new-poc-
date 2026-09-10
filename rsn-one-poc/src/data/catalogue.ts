import type { Product, House, World, Drop, Promo } from './types';

export const HOUSES: House[] = [
  { id: 'lazimpat', name: 'House of Lazimpat', city: 'Kathmandu', country: 'Nepal',
    tagline: 'Objects shaped by place, material and tradition.',
    story: 'Rooted in Nepal’s rich craft heritage, House of Lazimpat creates objects that carry stories across generations.',
    image: 'house-lazimpat-01' },
  { id: 'lahori', name: 'House of Lahori', city: 'Patan', country: 'Nepal',
    tagline: 'Metal, fire and patience.',
    story: 'Three generations of metalworkers in Patan’s old quarter, hammering brass and copper into vessels made to be used every day.',
    image: 'drop-brass-urn-01' },
  { id: 'atelier-sand', name: 'Atelier Sand', city: 'Pokhara', country: 'Nepal',
    tagline: 'Slow rituals for skin and home.',
    story: 'A small studio by the lake blending beeswax, botanicals and Himalayan minerals into candles and skincare.',
    image: 'world-skin-01' },
  { id: 'chyangra', name: 'House of Chyangra', city: 'Mustang', country: 'Nepal',
    tagline: 'Warmth from the high plateau.',
    story: 'Yak and sheep wool spun and woven by families in the upper valleys, dyed with walnut and madder.',
    image: 'world-sleep-01' },
  { id: 'sujan', name: 'House of Suján', city: 'Jaipur', country: 'India',
    tagline: 'Linen that softens with every wash.',
    story: 'Stonewashed European flax, cut and finished by hand in a family workshop in Jaipur.',
    image: 'hero-membership-01' },
  { id: 'rsn-atelier', name: 'RSN Atelier', city: 'Kathmandu', country: 'Nepal',
    tagline: 'The house edit.',
    story: 'Objects made for and by RSN One, in collaboration with the houses in our family.',
    image: 'promo-wallet-gift-01' },
];

export const WORLDS: World[] = [
  { id: 'morning', name: 'Morning', image: 'world-morning-01' },
  { id: 'skin', name: 'Skin', image: 'world-skin-01' },
  { id: 'sleep', name: 'Sleep', image: 'world-sleep-01' },
  { id: 'table', name: 'Table', image: 'world-table-01' },
  { id: 'gifts', name: 'Gifts', image: 'world-gifts-01' },
  { id: 'global-select', name: 'Global Select', image: 'world-global-select-01' },
];

const std = {
  verification: 'Every RSN One object is inspected at the house, sealed with a tamper-evident RSN seal and logged with a unique verification number you can check in your order.',
  delivery: 'Standard delivery 3–5 business days, free. Express 1–2 business days ₹199. Returns accepted within 14 days of delivery in original packaging.',
};

export const PRODUCTS: Product[] = [
  { id: 'copper-vessel', name: 'Copper Vessel', house: 'lazimpat', price: 25199, memberPrice: 21499, stock: 'in',
    worlds: ['table', 'gifts'], images: ['prod-copper-vessel-01', 'prod-copper-vessel-02', 'prod-copper-vessel-03', 'prod-copper-vessel-04'],
    blurb: 'A timeless piece, handcrafted in Nepal using traditional techniques passed down for generations.',
    story: 'Each vessel begins as a single sheet of copper, raised and planished by hand over several days. The engraved band draws on temple motifs from the Kathmandu valley.',
    materials: 'Solid copper, food-safe tin lining, hand-engraved. Approx. 24 cm high, 1.2 kg.',
    origin: 'Lazimpat, Kathmandu, Nepal', isNew: true, isDrop: true, tags: ['vessel', 'nepal', 'copper', 'tableware'], ...std },
  { id: 'brass-kettle', name: 'Brass Kettle', house: 'lahori', price: 18500, memberPrice: 15750, stock: 'in',
    worlds: ['morning', 'table'], images: ['prod-brass-kettle-01'],
    blurb: 'A hand-beaten brass kettle for slow mornings, finished with a turned wooden handle.',
    story: 'Spun and soldered in Patan, then hand-polished to a soft satin that deepens with use.',
    materials: 'Brass, walnut handle. 1.4 L.', origin: 'Patan, Nepal', isNew: true, tags: ['kettle', 'tea', 'brass', 'nepal', 'tableware'], ...std },
  { id: 'beeswax-candle', name: 'Beeswax Candle', house: 'atelier-sand', price: 6800, memberPrice: 5780, stock: 'in',
    worlds: ['sleep', 'gifts'], images: ['prod-beeswax-candle-01'],
    blurb: 'Pure Himalayan beeswax with a cotton wick, poured into a ribbed glass vessel.',
    story: 'Beeswax from apiaries above Pokhara, filtered and poured in small batches. Burns clean for around 60 hours.',
    materials: '100% beeswax, cotton wick, glass. 300 g.', origin: 'Pokhara, Nepal', isNew: true, tags: ['candle', 'wellness', 'gift'], ...std },
  { id: 'yak-blanket', name: 'Yak Blanket', house: 'chyangra', price: 24500, memberPrice: 20999, stock: 'low',
    worlds: ['sleep'], images: ['prod-yak-blanket-01'],
    blurb: 'Hand-woven yak wool in a blush melange, warm without weight.',
    story: 'Woven on backstrap looms in Mustang from the soft undercoat combed each spring.',
    materials: '70% yak wool, 30% sheep wool. 140 × 200 cm.', origin: 'Mustang, Nepal', isNew: true, tags: ['blanket', 'wool', 'bedding', 'nepal'], ...std },
  { id: 'ceramide-cream', name: 'Ceramide Cream', house: 'atelier-sand', price: 8900, memberPrice: 7490, stock: 'in',
    worlds: ['skin'], images: ['prod-ceramide-cream-01'],
    blurb: 'A rich barrier cream with plant ceramides and Himalayan rhododendron extract.',
    story: 'Formulated by the lake at Atelier Sand for dry mountain air.',
    materials: 'Plant ceramides, shea, rhododendron extract. 50 ml.', origin: 'Pokhara, Nepal', tags: ['skincare', 'wellness', 'cream'], ...std },
  { id: 'linen-sheets', name: 'Linen Sheets', house: 'sujan', price: 27800, memberPrice: 23499, stock: 'in',
    worlds: ['sleep'], images: ['prod-linen-sheets-01'],
    blurb: 'Stonewashed flax linen in dusty rose. Softer every wash.',
    story: 'European flax woven and garment-washed in Jaipur.',
    materials: '100% flax linen. Queen set: fitted, flat, two pillowcases.', origin: 'Jaipur, India', tags: ['linen', 'sheets', 'bedding'], ...std },
  { id: 'ceramic-mug', name: 'Ceramic Mug', house: 'lazimpat', price: 4200, memberPrice: 3570, stock: 'in',
    worlds: ['morning', 'table'], images: ['prod-ceramic-mug-01'],
    blurb: 'A stoneware mug in speckled oat glaze, thrown by hand.',
    story: 'Thrown and glazed in the Lazimpat studio, each with its own faint variation.',
    materials: 'Stoneware. 350 ml.', origin: 'Kathmandu, Nepal', tags: ['mug', 'coffee', 'tea', 'ceramic', 'tableware'], ...std },
  { id: 'carved-vase', name: 'Carved Vase', house: 'lazimpat', price: 12400, memberPrice: 10540, stock: 'in',
    worlds: ['table', 'gifts'], images: ['prod-carved-vase-01'],
    blurb: 'A carved stone vase for dried blossom, cool to the touch.',
    story: 'Cut from river stone and carved with a repeating lotus pattern.',
    materials: 'Sandstone. 28 cm.', origin: 'Kathmandu, Nepal', tags: ['vase', 'stone', 'decor'], ...std },
  { id: 'glass-diffuser', name: 'Glass Diffuser', house: 'atelier-sand', price: 5400, memberPrice: 4590, stock: 'in',
    worlds: ['sleep', 'skin'], images: ['prod-glass-diffuser-01'],
    blurb: 'Reed diffuser in cedar and blossom, in a gold-capped glass bottle.',
    story: 'Blended at Atelier Sand from Himalayan cedarwood and orchard blossom.',
    materials: 'Glass, rattan reeds. 200 ml.', origin: 'Pokhara, Nepal', tags: ['diffuser', 'fragrance', 'wellness'], ...std },
  { id: 'stone-bowl', name: 'Stone Bowl', house: 'chyangra', price: 9800, memberPrice: 8330, stock: 'low',
    worlds: ['table'], images: ['prod-stone-bowl-01'],
    blurb: 'A shallow serving bowl ground from a single piece of river stone.',
    story: 'Shaped on a foot-driven wheel in the upper valleys.',
    materials: 'River stone. 26 cm.', origin: 'Mustang, Nepal', isDrop: true, tags: ['bowl', 'stone', 'tableware'], ...std },
  { id: 'brass-urn', name: 'Brass Urn', house: 'lahori', price: 21000, memberPrice: 17850, stock: 'low',
    worlds: ['table', 'gifts'], images: ['prod-brass-urn-01'],
    blurb: 'A hammered brass urn with a fitted lid.', story: 'Raised from sheet brass over a week of hammering.',
    materials: 'Brass. 22 cm.', origin: 'Patan, Nepal', isDrop: true, tags: ['urn', 'brass', 'decor'], ...std },
  { id: 'ceramic-jar', name: 'Ceramic Jar', house: 'lazimpat', price: 7900, memberPrice: 6715, stock: 'in',
    worlds: ['table'], images: ['prod-ceramic-jar-01'],
    blurb: 'A lidded stoneware jar for the kitchen counter.', story: 'Thrown in the Lazimpat studio.',
    materials: 'Stoneware. 1 L.', origin: 'Kathmandu, Nepal', isDrop: true, tags: ['jar', 'ceramic', 'kitchen'], ...std },
  { id: 'tea-set', name: 'Tea Set', house: 'lahori', price: 15600, memberPrice: 13260, stock: 'in',
    worlds: ['morning', 'table', 'gifts'], images: ['prod-tea-set-01'],
    blurb: 'A brass pot and four cups for the afternoon table.', story: 'Spun and soldered in Patan.',
    materials: 'Brass. Pot 800 ml, cups 120 ml.', origin: 'Patan, Nepal', isDrop: true, tags: ['tea', 'set', 'brass', 'tableware'], ...std },
  { id: 'linen-throw', name: 'Linen Throw', house: 'sujan', price: 11200, memberPrice: 9520, stock: 'in',
    worlds: ['sleep'], images: ['prod-linen-throw-01'],
    blurb: 'A fringed linen throw in blush.', story: 'Woven in Jaipur.', materials: '100% flax linen. 130 × 180 cm.',
    origin: 'Jaipur, India', tags: ['throw', 'linen', 'bedding'], ...std },
  { id: 'rsn-candle', name: 'RSN One Candle', house: 'rsn-atelier', price: 4800, memberPrice: 4080, stock: 'in',
    worlds: ['gifts', 'sleep'], images: ['prod-rsn-candle-01'],
    blurb: 'The house candle, in a deep rose glass.', story: 'Poured with Atelier Sand.', materials: 'Soy-beeswax blend. 220 g.',
    origin: 'Kathmandu, Nepal', tags: ['candle', 'gift'], ...std },
  { id: 'gift-box', name: 'RSN Gift Box', house: 'rsn-atelier', price: 3200, memberPrice: 2720, stock: 'in',
    worlds: ['gifts'], images: ['prod-gift-box-01'],
    blurb: 'A ribboned gift box with a handwritten card.', story: 'Assembled in the RSN Atelier.', materials: 'Recycled board, silk ribbon.',
    origin: 'Kathmandu, Nepal', tags: ['gift', 'box', 'wrap'], ...std },
];

export const DROPS: Drop[] = [
  { id: 'autumn-drop', title: 'The Autumn Drop',
    blurb: 'Curated pieces from exceptional houses, available for a limited time.',
    endsAt: new Date(Date.now() + (3 * 24 + 12) * 36e5 + 45 * 60e3 + 28e3).toISOString(),
    remaining: 12, productId: 'copper-vessel', hero: 'hero-limited-drops-01',
    badges: ['Handcrafted by Artisans', 'Authentic Nepali Heritage', 'Limited Edition'],
    about: 'A handcrafted copper vessel from the House of Lazimpat, celebrating Nepal’s rich heritage and the artistry of traditional metalwork. Each piece is uniquely made by skilled artisans, carrying forward a legacy of timeless craft.' },
];

export const PROMOS: Promo[] = [
  { id: 'rsn-edit', title: 'The RSN Edit', text: 'Stories, objects and rituals from around the world.', cta: 'Read now', to: '/shop', image: 'promo-rsn-edit-01', light: true },
  { id: 'global-select', title: 'Global Select', text: 'Extraordinary makers. Curated for your home.', cta: 'Explore', to: '/shop?world=global-select', image: 'promo-global-select-01' },
  { id: 'featured-house', title: 'Featured House', text: 'House of Lazimpat\nKathmandu, Nepal', cta: 'Explore house', to: '/house/lazimpat', image: 'house-lazimpat-01' },
  { id: 'member-advantage', title: 'Member Advantage', text: 'More than shopping. A global family.', cta: 'Join now', to: '/membership', image: 'promo-member-advantage-01', light: true },
];

export const TRENDING_SEARCHES = ['Gifts for home', 'Objects from Nepal', 'Tableware', 'Wellness'];
export const DEFAULT_RECENT_SEARCHES = ['Copper vessel', 'Linen sheets', 'Nepal', 'Beeswax candle'];

// ---- lookups ----
export const productById = (id: string) => PRODUCTS.find(p => p.id === id);
export const houseById = (id: string) => HOUSES.find(h => h.id === id);
export const worldById = (id: string) => WORLDS.find(w => w.id === id);
export const dropById = (id: string) => DROPS.find(d => d.id === id);
export const productsByHouse = (id: string) => PRODUCTS.filter(p => p.house === id);
export const productsByWorld = (id: string) => PRODUCTS.filter(p => p.worlds.includes(id as never));
export const newProducts = () => PRODUCTS.filter(p => p.isNew);
export const dropProducts = () => PRODUCTS.filter(p => p.isDrop);

/** Case-insensitive search over name, house, worlds, tags. Empty query → all. */
export function searchProducts(q: string): Product[] {
  const s = q.trim().toLowerCase();
  if (!s) return PRODUCTS;
  const terms = s.split(/\s+/);
  return PRODUCTS.filter(p => {
    const house = houseById(p.house);
    const hay = [p.name, house?.name, house?.city, house?.country, ...(p.tags ?? []), ...p.worlds, p.blurb]
      .join(' ').toLowerCase();
    return terms.every(t => hay.includes(t));
  });
}
