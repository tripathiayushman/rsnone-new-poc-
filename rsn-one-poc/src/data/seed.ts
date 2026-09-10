import type { Order, Notification, Address, PaymentMethod, WalletTx, Referral, HelpTopic, HelpArticle, User } from './types';
import { daysAgo, hoursAgo } from '../lib/dates';

export const USER: User = {
  name: 'Maya Kapoor',
  email: 'maya.kapoor@rsnone.com',
  memberNo: 'Founding Member 047',
  avatar: 'avatar-maya-kapoor-01',
};

const addr = (over: Partial<Order['address']> = {}): Order['address'] => ({
  name: 'Aanya Sharma', line1: 'B-102, Maple Residency', city: 'Panipokhari, Kathmandu', postal: '44600',
  country: 'Nepal', phone: '+977 98123 45678', ...over,
});

/** Build stageTimes for an order that reached `stageIndex`, spacing stages back from `placed`. */
export function stageTimes(placedIso: string, stageIndex: number): (string | undefined)[] {
  const t0 = new Date(placedIso).getTime();
  const gaps = [0, 3, 20, 28, 30, 44, 70, 76]; // hours after placement
  return gaps.map((h, i) => (i <= stageIndex ? new Date(t0 + h * 36e5).toISOString() : undefined));
}

// Seed orders match C25 (ids, dates, item counts, statuses) and C26 (RSN10234 detail).
export const SEED_ORDERS: Order[] = [
  { id: 'RSN10234', placedAt: '2024-09-08T10:24:00', status: 'shipped', stageIndex: 6, stageTimes: stageTimes('2024-09-08T10:24:00', 6),
    items: [{ productId: 'copper-vessel', qty: 1, unitPrice: 25199 }, { productId: 'ceramic-mug', qty: 1, unitPrice: 4200 }],
    address: addr(), delivery: 'standard', payment: 'Credit Card (•••• 4242)',
    subtotal: 29399, memberDiscount: 4330, shipping: 0, promoDiscount: 0, total: 25069, eta: 'Arriving today by 8:00 PM' },
  { id: 'RSN10223', placedAt: '2024-09-05T15:10:00', status: 'shipped', stageIndex: 5, stageTimes: stageTimes('2024-09-05T15:10:00', 5),
    items: [{ productId: 'yak-blanket', qty: 1, unitPrice: 24500 }],
    address: addr(), delivery: 'express', payment: 'UPI (aanya@okaxis)',
    subtotal: 24500, memberDiscount: 3501, shipping: 199, promoDiscount: 0, total: 21198, eta: 'Arriving Thursday' },
  { id: 'RSN10232', placedAt: '2024-08-28T09:02:00', status: 'processing', stageIndex: 1, stageTimes: stageTimes('2024-08-28T09:02:00', 1),
    items: [{ productId: 'ceramide-cream', qty: 1, unitPrice: 8900 }, { productId: 'glass-diffuser', qty: 1, unitPrice: 5400 }, { productId: 'ceramic-mug', qty: 1, unitPrice: 4200 }],
    address: addr({ line1: '3rd Floor, Innovation Hub', city: 'Pulchowk, Lalitpur', postal: '44700' }), delivery: 'standard', payment: 'Mastercard (•••• 8910)',
    subtotal: 18500, memberDiscount: 2850, shipping: 0, promoDiscount: 0, total: 15650 },
  { id: 'RSN10231', placedAt: '2024-08-14T18:40:00', status: 'delivered', stageIndex: 7, stageTimes: stageTimes('2024-08-14T18:40:00', 7),
    items: [{ productId: 'beeswax-candle', qty: 1, unitPrice: 6800 }],
    address: addr(), delivery: 'standard', payment: 'Credit Card (•••• 4242)',
    subtotal: 6800, memberDiscount: 1020, shipping: 0, promoDiscount: 0, total: 5780 },
  { id: 'RSN10230', placedAt: '2024-08-02T11:15:00', status: 'returned', stageIndex: 7, stageTimes: stageTimes('2024-08-02T11:15:00', 7),
    items: [{ productId: 'copper-vessel', qty: 1, unitPrice: 25199 }],
    address: addr(), delivery: 'standard', payment: 'Credit Card (•••• 4242)',
    subtotal: 25199, memberDiscount: 3700, shipping: 0, promoDiscount: 0, total: 21499, returnReason: 'Not as expected' },
];

// C29 — grouped by the screen into Today / This Week / Earlier from `at`
export const SEED_NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'Your order has been delivered', body: 'Order #RSN10230 has been delivered successfully.', at: hoursAgo(2), read: false, image: 'drop-stone-bowl-01', to: '/orders/RSN10230' },
  { id: 'n2', title: 'You earned a reward!', body: 'You\'ve received ₹2,000 in your wallet for referring a friend.', at: hoursAgo(5), read: false, image: 'prod-gift-box-01', to: '/member/wallet' },
  { id: 'n3', title: 'New arrivals are here', body: 'Explore the latest collection from House of Lazimpat.', at: hoursAgo(8), read: false, image: 'prod-brass-kettle-01', to: '/house/lazimpat' },
  { id: 'n4', title: 'Your return request is approved', body: 'Your return for Order #RSN10198 has been approved.', at: daysAgo(4), read: true, image: 'prod-carved-vase-01', to: '/orders' },
  { id: 'n5', title: 'Exclusive offer for members', body: 'Get 10% off on Global Select collection. Valid till 18 Aug.', at: daysAgo(6), read: true, image: 'world-global-select-01', to: '/shop?world=global-select' },
  { id: 'n6', title: 'Your wallet has been updated', body: '₹4,049 has been refunded to your wallet for Order #RSN10156.', at: daysAgo(8), read: true, image: 'prod-glass-diffuser-01', to: '/member/wallet' },
  { id: 'n7', title: 'Welcome to RSN One', body: 'Thank you for joining our global family. Here\'s to a more thoughtful tomorrow.', at: daysAgo(40), read: true, image: 'prod-yak-blanket-01', to: '/membership' },
  { id: 'n8', title: 'Your profile is complete', body: 'You\'re all set to enjoy a seamless shopping experience.', at: daysAgo(44), read: true, image: 'prod-beeswax-candle-01', to: '/me' },
];

// C27
export const SEED_ADDRESSES: Address[] = [
  { id: 'a1', label: 'Home', name: 'Aanya Sharma', phone: '+977 98123 45678', line1: 'B-102, Maple Residency', city: 'Panipokhari, Kathmandu', state: 'Bagmati', postal: '44600', country: 'Nepal', isDefault: true },
  { id: 'a2', label: 'Office', name: 'Aanya Sharma', phone: '+977 98123 45678', line1: '3rd Floor, Innovation Hub', city: 'Pulchowk, Lalitpur', state: 'Bagmati', postal: '44700', country: 'Nepal', isDefault: false },
  { id: 'a3', label: 'Parents’ Home', name: 'Aanya Sharma', phone: '+977 98123 45678', line1: 'House No. 45, Green Park', city: 'Baneshwor, Kathmandu', state: 'Bagmati', postal: '44600', country: 'Nepal', isDefault: false },
  { id: 'a4', label: 'Vacation Home', name: 'Aanya Sharma', phone: '+977 98123 45678', line1: 'Lakeside Road, Pokhara', city: 'Kaski', state: 'Gandaki', postal: '33700', country: 'Nepal', isDefault: false },
];

// C28
export const SEED_PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'p1', kind: 'card', brand: 'Visa', last4: '4242', expiry: '04/27', isDefault: true },
  { id: 'p2', kind: 'card', brand: 'Mastercard', last4: '8910', expiry: '11/26', isDefault: false },
  { id: 'p3', kind: 'card', brand: 'American Express', last4: '1009', expiry: '08/28', isDefault: false },
  { id: 'p4', kind: 'upi', upiId: 'aanya@okaxis', isDefault: false },
];

// C33
export const SEED_WALLET = {
  balance: 12450, refunds: 8950, rewards: 3500,
  tx: [
    { id: 'w1', title: 'Refund Processed', ref: 'Order #RSN10212', at: '2024-07-18T12:00:00', amount: 8499 },
    { id: 'w2', title: 'Reward Credit', ref: 'Welcome Bonus', at: '2024-07-10T12:00:00', amount: 2000 },
    { id: 'w3', title: 'Used at Checkout', ref: 'Order #RSN10198', at: '2024-07-02T12:00:00', amount: -4049 },
  ] as WalletTx[],
};

// C34
export const SEED_REFERRALS: Referral[] = [
  { id: 'r1', name: 'Riya Mehta', joinedAt: '2024-08-12T12:00:00', reward: 1000 },
  { id: 'r2', name: 'Karan Sethi', joinedAt: '2024-08-03T12:00:00', reward: 1000 },
];
export const SEED_REFERRAL_STATS = { invited: 12, successful: 8, earnings: 8000 };
export const REFERRAL_LINK = 'https://rsnone.com/invite/MAYA047';

// C30
export const HELP_TOPICS: HelpTopic[] = [
  { id: 'orders', title: 'Orders & Delivery', blurb: 'Track, cancel or modify orders', icon: 'bag' },
  { id: 'returns', title: 'Returns & Refunds', blurb: 'Easy and hassle-free returns', icon: 'return' },
  { id: 'payments', title: 'Payments & Wallet', blurb: 'Help with payments, wallet and credits', icon: 'card' },
  { id: 'account', title: 'Account & Profile', blurb: 'Manage your account settings', icon: 'user' },
  { id: 'membership', title: 'Membership', blurb: 'Benefits, rewards and referrals', icon: 'shield' },
  { id: 'products', title: 'Product Information', blurb: 'Learn more about our collections', icon: 'info' },
];
export const HELP_ARTICLES: HelpArticle[] = [
  { id: 'h1', topic: 'orders', q: 'How to track your order', a: 'Open Me → Orders, choose the order and tap Track Package. Every stage from Confirmed to Delivered is time-stamped as the house and our couriers update it.' },
  { id: 'h2', topic: 'returns', q: 'How to request a return', a: 'Returns are accepted within 14 days of delivery. Open the order, tap Request Return, choose a reason and add photos if you like. Refunds go to your wallet within 5 business days.' },
  { id: 'h3', topic: 'orders', q: 'Can I change my delivery address after ordering?', a: 'Yes, until the order is Sealed at the house. Open the order and tap Change beside the shipping address.' },
  { id: 'h4', topic: 'payments', q: 'How do I use my wallet balance?', a: 'At checkout choose Wallet as the payment method; any remaining amount can be paid by card or UPI.' },
  { id: 'h5', topic: 'membership', q: 'What does membership include?', a: 'Member pricing on every object, early access to drops, private discoveries, concierge and rewards. ₹5,999 a year, cancel any time.' },
  { id: 'h6', topic: 'account', q: 'How do I update my profile?', a: 'Open Me and tap your name. Email and phone changes are verified with a one-time code.' },
  { id: 'h7', topic: 'products', q: 'How are objects verified?', a: 'Every object is inspected at the house, sealed with a tamper-evident RSN seal and logged with a verification number shown on your order.' },
];

// C16
export const CONCIERGE_PROMPTS = [
  { id: 'home', label: 'Find something special for my home' },
  { id: 'gift', label: 'Find a meaningful gift' },
  { id: 'nepal', label: 'Find something from Nepal' },
];
export function conciergeReply(q: string): { text: string; productIds: string[] } {
  const s = q.toLowerCase();
  if (s.includes('gift')) return { text: 'For a gift that lands well, I’d start with the Beeswax Candle or the RSN Gift Box, and add a handwritten note at checkout.', productIds: ['beeswax-candle', 'gift-box', 'rsn-candle'] };
  if (s.includes('nepal')) return { text: 'From the houses in Nepal, the Copper Vessel from Lazimpat and the Brass Kettle from Lahori are the pieces our members return to.', productIds: ['copper-vessel', 'brass-kettle', 'stone-bowl'] };
  if (s.includes('sleep') || s.includes('bed')) return { text: 'For the bedroom: Linen Sheets from Suján, the Yak Blanket for cold nights, and a Glass Diffuser for the side table.', productIds: ['linen-sheets', 'yak-blanket', 'glass-diffuser'] };
  return { text: 'Lovely. For the home I’d look at the Carved Vase for a quiet corner and the Tea Set for the table. Shall I set aside either one?', productIds: ['carved-vase', 'tea-set', 'ceramic-mug'] };
}
