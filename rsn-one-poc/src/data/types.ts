export type WorldId = 'morning' | 'skin' | 'sleep' | 'table' | 'gifts' | 'global-select';
export type HouseId = 'lazimpat' | 'lahori' | 'atelier-sand' | 'chyangra' | 'sujan' | 'rsn-atelier';
export type Stock = 'in' | 'low' | 'out';
export type StoreId = 'nepal' | 'global';

export interface Product {
  id: string;
  name: string;
  house: HouseId;
  price: number;
  memberPrice: number;
  stock: Stock;
  worlds: WorldId[];
  /** manifest slot names, first = primary */
  images: string[];
  blurb: string;
  story: string;
  materials: string;
  origin: string;
  verification: string;
  delivery: string;
  isNew?: boolean;
  isDrop?: boolean;
  /** search keywords beyond name/house */
  tags?: string[];
}

export interface House {
  id: HouseId;
  name: string;
  city: string;
  country: string;
  tagline: string;
  story: string;
  image: string;
}

export interface World {
  id: WorldId;
  name: string;
  image: string;
}

export interface Drop {
  id: string;
  title: string;
  blurb: string;
  /** ISO — countdown target */
  endsAt: string;
  remaining: number;
  productId: string;
  hero: string;
  badges: string[];
  about: string;
}

export interface Promo {
  id: string;
  title: string;
  text: string;
  cta: string;
  to: string;
  image: string;
  light?: boolean;
}

export type OrderStage =
  | 'Confirmed' | 'Processing' | 'At House' | 'Verified' | 'Sealed'
  | 'In Transit' | 'Out for Delivery' | 'Delivered';
export const ORDER_STAGES: OrderStage[] = [
  'Confirmed', 'Processing', 'At House', 'Verified', 'Sealed', 'In Transit', 'Out for Delivery', 'Delivered',
];
export type OrderStatus = 'processing' | 'shipped' | 'delivered' | 'returned' | 'return-requested';

export interface OrderItem { productId: string; qty: number; unitPrice: number }
export interface OrderAddress {
  name: string; line1: string; line2?: string; city: string; state?: string; postal: string; country: string; phone: string;
}
export interface Order {
  id: string;
  placedAt: string;
  status: OrderStatus;
  /** index into ORDER_STAGES of the latest completed stage */
  stageIndex: number;
  /** ISO timestamps per completed stage (parallel to ORDER_STAGES, undefined = pending) */
  stageTimes: (string | undefined)[];
  items: OrderItem[];
  address: OrderAddress;
  delivery: 'standard' | 'express';
  payment: string; // "Credit Card (•••• 4242)" | "UPI (aanya@okaxis)" …
  subtotal: number;
  memberDiscount: number;
  shipping: number;
  promoDiscount: number;
  total: number;
  eta?: string;
  giftNote?: string;
  returnReason?: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  at: string;
  read: boolean;
  image?: string;
  to?: string;
}

export interface Address {
  id: string;
  label: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal: string;
  country: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  kind: 'card' | 'upi';
  brand?: 'Visa' | 'Mastercard' | 'American Express' | 'RuPay';
  last4?: string;
  expiry?: string;
  upiId?: string;
  isDefault: boolean;
}

export interface WalletTx {
  id: string;
  title: string;
  ref: string;
  at: string;
  amount: number; // + credit, - debit
}

export interface Referral { id: string; name: string; joinedAt: string; reward: number }

export interface HelpTopic { id: string; title: string; blurb: string; icon: string }
export interface HelpArticle { id: string; topic: string; q: string; a: string }

export interface User {
  name: string;
  email: string;
  memberNo: string;
  avatar: string;
}
