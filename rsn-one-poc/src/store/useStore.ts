import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Address, Notification, Order, OrderAddress, PaymentMethod, Product, Referral, StoreId, User, WalletTx,
} from '../data/types';
import { ORDER_STAGES } from '../data/types';
import { productById } from '../data/catalogue';
import {
  SEED_ADDRESSES, SEED_NOTIFICATIONS, SEED_ORDERS, SEED_PAYMENT_METHODS, SEED_REFERRALS, SEED_REFERRAL_STATS,
  SEED_WALLET, USER, stageTimes,
} from '../data/seed';
import { DEFAULT_RECENT_SEARCHES } from '../data/catalogue';
import { orderId, uid } from '../lib/ids';

export interface BagItem { productId: string; qty: number }
export type DeliveryMethod = 'standard' | 'express';
export type PaymentKind = 'card' | 'upi' | 'netbanking' | 'wallet' | 'emi';

export const MEMBERSHIP_FEE = 5999;
export const EXPRESS_FEE = 199;
export const MEMBER_THRESHOLD = 100000; // C10 banner: "₹47,001 away" on a ₹52,999 bag
export const PROMO_CODES: Record<string, number> = { RSN10: 0.10, WELCOME: 0.05 };

export interface Totals {
  count: number; subtotal: number; memberDiscount: number; promoDiscount: number; shipping: number; total: number;
}

interface State {
  // session
  user: User | null; isAuthed: boolean; isGuest: boolean; store: StoreId | null; hasSeenWelcome: boolean;
  // shopping
  bag: BagItem[]; giftNote: string; promo: string | null;
  wishlist: string[];
  // checkout draft
  checkout: { addressId: string | null; address: OrderAddress | null; delivery: DeliveryMethod; note: string; payment: PaymentKind; paymentLabel: string };
  // post-purchase
  orders: Order[];
  // membership
  isMember: boolean; memberSince: string | null;
  wallet: { balance: number; refunds: number; rewards: number; tx: WalletTx[] };
  referrals: Referral[]; referralStats: { invited: number; successful: number; earnings: number };
  // account
  addresses: Address[]; paymentMethods: PaymentMethod[]; notifications: Notification[]; recentSearches: string[];
  // ui (not persisted)
  zoom: number; toast: string | null;

  // ---- actions ----
  signIn: (email: string) => void;
  signUp: (email: string, name?: string) => void;
  continueAsGuest: () => void;
  signOut: () => void;
  selectStore: (s: StoreId) => void;
  markWelcomeSeen: () => void;

  addToBag: (productId: string, qty?: number, opts?: { silent?: boolean }) => void;
  removeFromBag: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  setGiftNote: (s: string) => void;
  applyPromo: (code: string) => boolean;
  clearPromo: () => void;
  clearBag: () => void;

  toggleWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  moveToBag: (productId: string) => void;

  setCheckout: (patch: Partial<State['checkout']>) => void;
  placeOrder: () => Order;
  requestReturn: (orderId: string, reason: string, notes?: string) => void;
  updateOrderAddress: (orderId: string, address: OrderAddress) => void;

  joinMembership: (paymentLabel: string) => void;
  addFunds: (amount: number) => void;
  /** C12: pay from the member wallet — debits the balance and logs a "Used at Checkout" transaction. */
  spendWallet: (amount: number, ref: string) => void;

  addAddress: (a: Omit<Address, 'id'>) => Address;
  updateAddress: (id: string, patch: Partial<Address>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  addPaymentMethod: (p: Omit<PaymentMethod, 'id'>) => void;
  removePaymentMethod: (id: string) => void;
  setDefaultPaymentMethod: (id: string) => void;

  markRead: (id: string) => void;
  markAllRead: () => void;
  pushNotification: (n: Omit<Notification, 'id' | 'at' | 'read'>) => void;

  pushRecentSearch: (q: string) => void;
  clearRecentSearches: () => void;

  setZoom: (z: number) => void;
  showToast: (msg: string) => void;
  resetDemo: () => void;
}

const initial = () => ({
  user: null, isAuthed: false, isGuest: false, store: null as StoreId | null, hasSeenWelcome: false,
  bag: [] as BagItem[], giftNote: '', promo: null as string | null,
  wishlist: [] as string[],
  checkout: { addressId: null, address: null, delivery: 'standard' as DeliveryMethod, note: '', payment: 'upi' as PaymentKind, paymentLabel: 'UPI' },
  orders: SEED_ORDERS,
  isMember: false, memberSince: null as string | null,
  wallet: { ...SEED_WALLET, tx: [...SEED_WALLET.tx] },
  referrals: SEED_REFERRALS, referralStats: { ...SEED_REFERRAL_STATS },
  addresses: SEED_ADDRESSES, paymentMethods: SEED_PAYMENT_METHODS, notifications: SEED_NOTIFICATIONS,
  recentSearches: DEFAULT_RECENT_SEARCHES,
  zoom: 0.5, toast: null as string | null,
});

/** Unit price a given shopper pays for a product. */
export function priceFor(p: Product, isMember: boolean) {
  return isMember ? p.memberPrice : p.price;
}

/** Bag totals — the same maths on C10, C11, C12 and the order record. */
export function bagTotals(s: Pick<State, 'bag' | 'isMember' | 'promo' | 'checkout'>): Totals {
  let count = 0, subtotal = 0, memberDiscount = 0;
  for (const it of s.bag) {
    const p = productById(it.productId); if (!p) continue;
    count += it.qty;
    subtotal += p.price * it.qty;
    if (s.isMember) memberDiscount += (p.price - p.memberPrice) * it.qty;
  }
  const rate = s.promo ? PROMO_CODES[s.promo] ?? 0 : 0;
  const promoDiscount = Math.round((subtotal - memberDiscount) * rate);
  const shipping = s.checkout.delivery === 'express' ? EXPRESS_FEE : 0;
  const total = subtotal - memberDiscount - promoDiscount + shipping;
  return { count, subtotal, memberDiscount, promoDiscount, shipping, total };
}

let toastTimer: ReturnType<typeof setTimeout> | undefined;

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      ...initial(),

      // ---- session ----
      signIn: (email) => set({ user: { ...USER, email: email || USER.email }, isAuthed: true, isGuest: false }),
      signUp: (email, name) => set({ user: { ...USER, email: email || USER.email, name: name || USER.name, memberNo: 'Member' }, isAuthed: true, isGuest: false }),
      continueAsGuest: () => set({ isGuest: true, isAuthed: false, user: null }),
      signOut: () => set({ ...initial(), zoom: get().zoom, hasSeenWelcome: true }),
      selectStore: (store) => set({ store }),
      markWelcomeSeen: () => set({ hasSeenWelcome: true }),

      // ---- bag ----
      addToBag: (productId, qty = 1, opts) => {
        const bag = [...get().bag];
        const i = bag.findIndex(b => b.productId === productId);
        if (i >= 0) bag[i] = { ...bag[i], qty: bag[i].qty + qty }; else bag.push({ productId, qty });
        set({ bag });
        // PDP "Add to cart" redirects to the bag instead of toasting (opts.silent)
        if (!opts?.silent) get().showToast('Added to bag');
      },
      removeFromBag: (productId) => set({ bag: get().bag.filter(b => b.productId !== productId) }),
      setQty: (productId, qty) => {
        if (qty <= 0) return get().removeFromBag(productId);
        set({ bag: get().bag.map(b => (b.productId === productId ? { ...b, qty } : b)) });
      },
      setGiftNote: (giftNote) => set({ giftNote }),
      applyPromo: (code) => {
        const c = code.trim().toUpperCase();
        if (PROMO_CODES[c]) { set({ promo: c }); get().showToast(`Promo ${c} applied`); return true; }
        return false;
      },
      clearPromo: () => set({ promo: null }),
      clearBag: () => set({ bag: [], giftNote: '', promo: null }),

      // ---- wishlist ----
      toggleWishlist: (productId) => {
        const w = get().wishlist;
        const on = w.includes(productId);
        set({ wishlist: on ? w.filter(x => x !== productId) : [...w, productId] });
        // no toast — the filled/outline heart is the only feedback
      },
      removeFromWishlist: (productId) => set({ wishlist: get().wishlist.filter(x => x !== productId) }),
      moveToBag: (productId) => { get().addToBag(productId); get().removeFromWishlist(productId); },

      // ---- checkout ----
      setCheckout: (patch) => set({ checkout: { ...get().checkout, ...patch } }),
      placeOrder: () => {
        const s = get();
        const t = bagTotals(s);
        const now = new Date().toISOString();
        const fallbackAddr = s.addresses.find(a => a.isDefault) ?? s.addresses[0];
        const address: OrderAddress = s.checkout.address ?? {
          name: fallbackAddr.name, line1: fallbackAddr.line1, line2: fallbackAddr.line2, city: fallbackAddr.city,
          state: fallbackAddr.state, postal: fallbackAddr.postal, country: fallbackAddr.country, phone: fallbackAddr.phone,
        };
        const order: Order = {
          id: orderId(), placedAt: now, status: 'processing', stageIndex: 0, stageTimes: stageTimes(now, 0),
          items: s.bag.map(b => ({ productId: b.productId, qty: b.qty, unitPrice: productById(b.productId)?.price ?? 0 })),
          address, delivery: s.checkout.delivery, payment: s.checkout.paymentLabel,
          subtotal: t.subtotal, memberDiscount: t.memberDiscount, shipping: t.shipping, promoDiscount: t.promoDiscount, total: t.total,
          eta: s.checkout.delivery === 'express' ? 'Arriving in 1–2 business days' : 'Arriving in 3–5 business days',
          giftNote: s.giftNote || s.checkout.note || undefined,
        };
        set({ orders: [order, ...s.orders], bag: [], giftNote: '', promo: null, checkout: { ...s.checkout, note: '' } });
        get().pushNotification({ title: 'Your order is confirmed', body: `Order #${order.id} is being prepared at the house.`, image: productById(order.items[0]?.productId)?.images[0], to: `/orders/${order.id}` });
        return order;
      },
      requestReturn: (id, reason, notes) => {
        set({ orders: get().orders.map(o => (o.id === id ? { ...o, status: 'return-requested', returnReason: notes ? `${reason} — ${notes}` : reason } : o)) });
        get().pushNotification({ title: 'Return request received', body: `We\'re reviewing your return for Order #${id}. You\'ll hear from us within 24 hours.`, to: `/orders/${id}` });
        get().showToast('Return request submitted');
      },
      updateOrderAddress: (id, address) => set({ orders: get().orders.map(o => (o.id === id ? { ...o, address } : o)) }),

      // ---- membership ----
      joinMembership: (paymentLabel) => {
        const now = new Date().toISOString();
        const w = get().wallet;
        set({
          isMember: true, memberSince: now,
          user: get().user ? { ...get().user!, memberNo: 'Founding Member 047' } : get().user,
          wallet: { ...w, balance: w.balance + 2000, rewards: w.rewards + 2000,
            tx: [{ id: uid('w'), title: 'Reward Credit', ref: 'Welcome Bonus', at: now, amount: 2000 }, ...w.tx] },
        });
        get().pushNotification({ title: 'Welcome to RSN One', body: `Your membership is active. Paid via ${paymentLabel}. ₹2,000 welcome credit added to your wallet.`, to: '/member/wallet' });
      },
      addFunds: (amount) => {
        const w = get().wallet; const now = new Date().toISOString();
        set({ wallet: { ...w, balance: w.balance + amount, tx: [{ id: uid('w'), title: 'Funds Added', ref: 'Wallet top-up', at: now, amount }, ...w.tx] } });
        get().showToast(`₹${amount.toLocaleString('en-IN')} added to your wallet`);
      },
      spendWallet: (amount, ref) => {
        const w = get().wallet; const now = new Date().toISOString();
        set({ wallet: { ...w, balance: Math.max(0, w.balance - amount), tx: [{ id: uid('w'), title: 'Used at Checkout', ref, at: now, amount: -amount }, ...w.tx] } });
      },

      // ---- addresses ----
      addAddress: (a) => {
        const addr: Address = { ...a, id: uid('a') };
        let list = [...get().addresses, addr];
        if (addr.isDefault) list = list.map(x => ({ ...x, isDefault: x.id === addr.id }));
        set({ addresses: list }); return addr;
      },
      updateAddress: (id, patch) => {
        let list = get().addresses.map(a => (a.id === id ? { ...a, ...patch } : a));
        if (patch.isDefault) list = list.map(x => ({ ...x, isDefault: x.id === id }));
        set({ addresses: list });
      },
      removeAddress: (id) => set({ addresses: get().addresses.filter(a => a.id !== id) }),
      setDefaultAddress: (id) => set({ addresses: get().addresses.map(a => ({ ...a, isDefault: a.id === id })) }),

      // ---- payment methods ----
      addPaymentMethod: (p) => {
        const pm: PaymentMethod = { ...p, id: uid('p') };
        let list = [...get().paymentMethods, pm];
        if (pm.isDefault) list = list.map(x => ({ ...x, isDefault: x.id === pm.id }));
        set({ paymentMethods: list });
      },
      removePaymentMethod: (id) => set({ paymentMethods: get().paymentMethods.filter(p => p.id !== id) }),
      setDefaultPaymentMethod: (id) => set({ paymentMethods: get().paymentMethods.map(p => ({ ...p, isDefault: p.id === id })) }),

      // ---- notifications ----
      markRead: (id) => set({ notifications: get().notifications.map(n => (n.id === id ? { ...n, read: true } : n)) }),
      markAllRead: () => set({ notifications: get().notifications.map(n => ({ ...n, read: true })) }),
      pushNotification: (n) => set({ notifications: [{ ...n, id: uid('n'), at: new Date().toISOString(), read: false }, ...get().notifications] }),

      // ---- search ----
      pushRecentSearch: (q) => {
        const s = q.trim(); if (!s) return;
        set({ recentSearches: [s, ...get().recentSearches.filter(x => x.toLowerCase() !== s.toLowerCase())].slice(0, 6) });
      },
      clearRecentSearches: () => set({ recentSearches: [] }),

      // ---- ui ----
      setZoom: (zoom) => set({ zoom }),
      showToast: (toast) => {
        set({ toast });
        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(() => set({ toast: null }), 2200);
      },
      resetDemo: () => set({ ...initial(), zoom: get().zoom }),
    }),
    {
      name: 'rsn-one-poc',
      version: 1,
      partialize: (s) => {
        const { toast: _t, ...rest } = s;
        // strip functions — zustand persist only serialises state, but be explicit
        return Object.fromEntries(Object.entries(rest).filter(([, v]) => typeof v !== 'function')) as Partial<State>;
      },
    },
  ),
);

// ---- convenience selectors ----
export const useBagCount = () => useStore(s => s.bag.reduce((n, b) => n + b.qty, 0));
export const useUnreadCount = () => useStore(s => s.notifications.filter(n => !n.read).length);
export const useIsWishlisted = (id: string) => useStore(s => s.wishlist.includes(id));
export const orderStatusLabel = (o: Order): string => ({
  processing: 'Processing', shipped: 'Shipped', delivered: 'Delivered', returned: 'Returned', 'return-requested': 'Return requested',
}[o.status]);
export const orderStageName = (o: Order) => ORDER_STAGES[o.stageIndex];
