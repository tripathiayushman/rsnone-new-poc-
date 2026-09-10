/** Screen inventory — C-numbers from the flow document, routes from PLAN.md §7. */
export interface ScreenDef { id: string; name: string; path: string; group: string; match: (p: string) => boolean }

const exact = (p: string) => (x: string) => x === p;
const prefix = (p: string) => (x: string) => x === p || x.startsWith(p + '/');

export const SCREENS: ScreenDef[] = [
  { id: 'C01', name: 'Splash', path: '/', group: 'Entry', match: exact('/') },
  { id: 'C02', name: 'Welcome', path: '/welcome', group: 'Entry', match: exact('/welcome') },
  { id: 'C20', name: 'Login / Signup', path: '/login', group: 'Entry', match: exact('/login') },
  { id: 'C19', name: 'Store Selection', path: '/store', group: 'Entry', match: exact('/store') },
  { id: 'C03', name: 'Home', path: '/home', group: 'Core', match: exact('/home') },
  { id: 'C04', name: 'Shop', path: '/shop', group: 'Shopping', match: exact('/shop') },
  { id: 'C05', name: 'Search', path: '/search', group: 'Shopping', match: exact('/search') },
  { id: 'C06', name: 'Search Results', path: '/search/results', group: 'Shopping', match: exact('/search/results') },
  { id: 'C07', name: 'Product Detail', path: '/product/copper-vessel', group: 'Shopping', match: prefix('/product') },
  { id: 'C08', name: 'House Profile', path: '/house/lazimpat', group: 'Shopping', match: prefix('/house') },
  { id: 'C09', name: 'Wishlist', path: '/wishlist', group: 'Shopping', match: exact('/wishlist') },
  { id: 'C10', name: 'Bag', path: '/bag', group: 'Checkout', match: exact('/bag') },
  { id: 'C11', name: 'Checkout Details', path: '/checkout/details', group: 'Checkout', match: exact('/checkout/details') },
  { id: 'C12', name: 'Checkout Payments', path: '/checkout/payment', group: 'Checkout', match: exact('/checkout/payment') },
  { id: 'C13', name: 'Order Confirmation', path: '/order/confirmation/RSN10234', group: 'Checkout', match: prefix('/order/confirmation') },
  { id: 'C15', name: 'Limited Drops', path: '/drops', group: 'Drops', match: exact('/drops') },
  { id: 'C24', name: 'Drop Detail', path: '/drops/autumn-drop', group: 'Drops', match: (p) => p.startsWith('/drops/') },
  { id: 'C25', name: 'Orders', path: '/orders', group: 'Orders', match: exact('/orders') },
  { id: 'C26', name: 'Order Detail', path: '/orders/RSN10234', group: 'Orders', match: (p) => /^\/orders\/[^/]+$/.test(p) },
  { id: 'C18', name: 'Order Tracking', path: '/orders/RSN10234/track', group: 'Orders', match: (p) => /^\/orders\/[^/]+\/track$/.test(p) },
  { id: 'C32', name: 'Return Request', path: '/orders/RSN10231/return', group: 'Orders', match: (p) => /^\/orders\/[^/]+\/return$/.test(p) },
  { id: 'C14', name: 'Membership', path: '/membership', group: 'Membership', match: exact('/membership') },
  { id: 'C21', name: 'Membership Join', path: '/membership/join', group: 'Membership', match: exact('/membership/join') },
  { id: 'C22', name: 'Membership Payment', path: '/membership/payment', group: 'Membership', match: exact('/membership/payment') },
  { id: 'C23', name: 'Membership Confirmation', path: '/membership/welcome', group: 'Membership', match: exact('/membership/welcome') },
  { id: 'C33', name: 'Member Wallet', path: '/member/wallet', group: 'Membership', match: exact('/member/wallet') },
  { id: 'C34', name: 'Member Referrals', path: '/member/referrals', group: 'Membership', match: exact('/member/referrals') },
  { id: 'C16', name: 'RSN Concierge', path: '/concierge', group: 'Services', match: exact('/concierge') },
  { id: 'C17', name: 'Me', path: '/me', group: 'Account', match: exact('/me') },
  { id: 'C27', name: 'Address Management', path: '/addresses', group: 'Account', match: exact('/addresses') },
  { id: 'C31', name: 'Add / Edit Address', path: '/addresses/new', group: 'Account', match: (p) => p.startsWith('/addresses/') },
  { id: 'C28', name: 'Payment Methods', path: '/payments', group: 'Account', match: exact('/payments') },
  { id: 'C29', name: 'Notifications', path: '/notifications', group: 'Account', match: exact('/notifications') },
  { id: 'C30', name: 'Help & Support', path: '/help', group: 'Account', match: exact('/help') },
];
