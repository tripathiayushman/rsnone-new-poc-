// End-to-end walk of the demo script in README.md against the running dev server.
// Usage: node scripts/e2e.mjs   (dev server on :5173; uses the Playwright Chromium already on the machine)
import { chromium } from 'playwright-core';
import { readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const BASE = process.env.BASE ?? 'http://localhost:5173';
const pw = join(homedir(), 'AppData/Local/ms-playwright');
const dirs = readdirSync(pw);
const dir = dirs.find(d => d.startsWith('chromium_headless_shell')) ?? dirs.find(d => d.startsWith('chromium-'));
const exe = join(pw, dir, dir.startsWith('chromium_headless_shell') ? 'chrome-headless-shell-win64/chrome-headless-shell.exe' : 'chrome-win64/chrome.exe');

const browser = await chromium.launch({ executablePath: exe });
const ctx = await browser.newContext({ viewport: { width: 853, height: 1844 } });
await ctx.grantPermissions(['clipboard-read', 'clipboard-write']);
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push(`[pageerror] ${e.message}`));
page.on('console', m => { if (m.type() === 'error') errors.push(`[console] ${m.text().slice(0, 160)}`); });

let step = 0, failed = 0;
const state = async () => JSON.parse(await page.evaluate(() => localStorage.getItem('rsn-one-poc') || '{"state":{}}')).state;
const path = () => new URL(page.url()).pathname + new URL(page.url()).search;
async function check(name, fn) {
  step++;
  try {
    await fn();
    console.log(`  ok  ${String(step).padStart(2)}  ${name}`);
  } catch (e) {
    failed++;
    console.log(`FAIL  ${String(step).padStart(2)}  ${name}\n        ${e.message.split('\n')[0]}   @ ${path()}`);
    await page.screenshot({ path: `_shots/e2e-fail-${step}.png`, fullPage: true }).catch(() => {});
  }
}
const expect = (cond, msg) => { if (!cond) throw new Error(msg); };
const waitPath = async (p, t = 8000) => { await page.waitForURL(u => (u.pathname + u.search).startsWith(p), { timeout: t }); };
const click = async (sel, opts) => { await page.locator(sel, opts).first().click(); };
const byText = (text, exact = false) => page.getByText(text, { exact }).first();

// fresh state
await page.goto(BASE + '/');
await page.evaluate(() => localStorage.clear());

// ---------- 1. Entry ----------
await check('Splash auto-advances to Welcome', async () => { await page.goto(BASE + '/'); await waitPath('/welcome'); });
await check('Welcome → Get Started → Login', async () => { await byText('Get Started').click(); await waitPath('/login'); });
await check('Login validates empty form', async () => {
  await page.getByRole('button', { name: /^sign in/i }).first().click();
  await page.waitForTimeout(200);
  expect(path().startsWith('/login'), 'should stay on login');
  expect(await page.locator('.field__error').count() > 0, 'expected inline errors');
});
await check('Sign in with email → Store Selection', async () => {
  await page.getByPlaceholder(/email/i).fill('demo@rsnone.com');
  await page.getByPlaceholder(/password/i).fill('secret123');
  await page.getByRole('button', { name: /^sign in/i }).first().click();
  await waitPath('/store');
  const s = await state(); expect(s.isAuthed === true, 'isAuthed');
});
await check('Choose Nepal → Home', async () => { await byText('Explore Nepal').click(); await waitPath('/home'); expect((await state()).store === 'nepal', 'store'); });

// ---------- 2. Discover ----------
await check('Home → Copper Vessel → PDP', async () => { await byText('Copper Vessel', true).click(); await waitPath('/product/copper-vessel'); });
await check('Add to bag (badge 1)', async () => {
  await page.getByRole('button', { name: /add to bag/i }).click();
  await page.waitForTimeout(300);
  const s = await state(); expect(s.bag.length === 1 && s.bag[0].productId === 'copper-vessel', 'bag has vessel');
  expect((await page.locator('.appbar__badge, .pdp-topbar__badge, [class*="badge"]').first().textContent())?.trim() === '1', 'badge 1');
});
await check('Save to wishlist', async () => {
  await page.getByRole('button', { name: /save to wishlist/i }).click();
  await page.waitForTimeout(200);
  expect((await state()).wishlist.includes('copper-vessel'), 'wishlisted');
});
await check('PDP house link → House Profile', async () => { await page.locator('a[href="/house/lazimpat"]').first().click(); await waitPath('/house/lazimpat'); });
await check('Search "linen" → results', async () => {
  await page.goto(BASE + '/search');
  await page.getByPlaceholder(/search/i).fill('linen');
  await page.keyboard.press('Enter');
  await waitPath('/search/results');
  await page.getByText('Linen Sheets', { exact: true }).first().waitFor();
  expect((await state()).recentSearches[0] === 'linen', 'recent search pushed');
});
await check('Open Linen Sheets and add to bag (badge 2)', async () => {
  await byText('Linen Sheets', true).click(); await waitPath('/product/linen-sheets');
  await page.getByRole('button', { name: /add to bag/i }).click(); await page.waitForTimeout(200);
  expect((await state()).bag.length === 2, 'two lines in bag');
});

// ---------- 3. Buy ----------
await check('Bag: qty + on first line', async () => {
  await page.goto(BASE + '/bag');
  await page.locator('button[aria-label*="ncrease"], .qty__btn').nth(1).click();
  await page.waitForTimeout(200);
  const s = await state(); expect(s.bag.reduce((n, b) => n + b.qty, 0) === 3, 'three units');
});
await check('Checkout → Details', async () => { await page.getByRole('button', { name: /^checkout/i }).first().click(); await waitPath('/checkout/details'); });
await check('Details: use saved address, express, promo RSN10, continue', async () => {
  await page.getByRole('button', { name: /use saved address/i }).click();
  await page.waitForTimeout(150);
  await byText('Maple Residency').click();
  await byText('Express Delivery').click();
  await byText('Have a promo code?').click();
  await page.getByLabel('Promo code').fill('RSN10');
  await page.getByRole('button', { name: /^apply/i }).click();
  await page.waitForTimeout(200);
  const s = await state(); expect(s.promo === 'RSN10', 'promo applied'); expect(s.checkout.delivery === 'express', 'express');
  await page.getByRole('button', { name: /continue to payment/i }).click();
  await waitPath('/checkout/payment');
});
let newOrderId = '';
await check('Payment: UPI → Pay Now → Confirmation, order created, bag cleared', async () => {
  await byText('UPI', true).click();
  await page.locator('input[placeholder*="@" i], input[placeholder*="upi" i]').first().fill('demo@okaxis');
  await page.getByRole('button', { name: /pay now/i }).click();
  await waitPath('/order/confirmation/');
  const s = await state();
  newOrderId = s.orders[0].id;
  expect(s.bag.length === 0, 'bag cleared');
  expect(s.orders.length === 6, '6 orders');
  expect(s.orders[0].payment.startsWith('UPI'), 'paid via UPI');
  expect(s.orders[0].promoDiscount > 0 && s.orders[0].shipping === 199, 'promo + express on order');
  expect(s.notifications[0].title.toLowerCase().includes('order'), 'order notification pushed');
});
await check('Confirmation → Track Order (8-stage timeline)', async () => {
  await byText('Track Order').click(); await waitPath(`/orders/${newOrderId}/track`);
  await byText('Confirmed').waitFor(); await byText('Delivered').waitFor();
});

// ---------- 4. Post-purchase ----------
await check('Orders list shows the new order first', async () => {
  await page.goto(BASE + '/orders');
  const first = await page.locator('.order-card, [class*="order-card"]').first().textContent();
  expect(first?.includes(newOrderId), 'new order at top');
});
await check('Delivered order → Request Return → submit', async () => {
  await page.goto(BASE + '/orders/RSN10231');
  await page.getByRole('link', { name: /request return/i }).or(page.getByRole('button', { name: /request return/i })).first().click();
  await waitPath('/orders/RSN10231/return');
  await byText('Not as expected').click();
  await page.locator('textarea').first().fill('Colour differs from the photos.');
  await page.getByRole('button', { name: /submit return request/i }).click();
  await waitPath('/orders/RSN10231');
  const o = (await state()).orders.find(o => o.id === 'RSN10231');
  expect(o.status === 'return-requested', 'status updated');
});

// ---------- 5. Membership ----------
await check('Membership → Become a Member → Join → Payment', async () => {
  await page.goto(BASE + '/membership');
  await byText('Become a Member').click(); await waitPath('/membership/join');
  await page.getByRole('button', { name: /join now/i }).or(page.getByRole('link', { name: /join now/i })).first().click();
  await waitPath('/membership/payment');
});
await check('Pay ₹5,999 via UPI → Welcome; member + ₹2,000 bonus', async () => {
  await byText('UPI', true).click();
  await page.locator('input[placeholder*="@" i], input[placeholder*="upi" i]').first().fill('demo@okaxis');
  await page.getByRole('button', { name: /pay ₹5,999/i }).click();
  await waitPath('/membership/welcome');
  const s = await state();
  expect(s.isMember === true, 'isMember');
  expect(s.wallet.balance === 14450, `wallet ${s.wallet.balance}`);
});
await check('Wallet shows ₹14,450; add ₹1,000', async () => {
  await page.goto(BASE + '/member/wallet');
  await byText('₹14,450').waitFor();
  await page.getByRole('button', { name: /add funds/i }).click();
  await page.getByRole('button', { name: /₹1,000/ }).first().click();
  await page.locator('.c33-topup .btn--primary, .c33-topup__confirm').first().click();
  await page.waitForTimeout(300);
  expect((await state()).wallet.balance === 15450, 'balance +1000');
});
await check('Referrals: copy invite link', async () => {
  await page.goto(BASE + '/member/referrals');
  await page.getByRole('button', { name: /^copy$/i }).click();
  await page.waitForTimeout(200);
  const clip = await page.evaluate(() => navigator.clipboard.readText());
  expect(clip.includes('rsnone.com/invite'), 'clipboard has link');
});
await check('Member pricing applies in the bag', async () => {
  await page.goto(BASE + '/product/beeswax-candle');
  await page.getByRole('button', { name: /add to bag/i }).click();
  await page.goto(BASE + '/bag');
  await byText('Member discount').waitFor();
  await byText('₹5,780').first().waitFor();
});

// ---------- 6. Account ----------
await check('Add a new address and save', async () => {
  await page.goto(BASE + '/addresses/new');
  await page.getByPlaceholder('Full Name').fill('Maya Kapoor');
  await page.getByPlaceholder('Phone Number').fill('+977 9800000000');
  await page.getByPlaceholder(/house no/i).fill('12 Lazimpat Marg');
  await page.getByPlaceholder('Postal Code').fill('44600');
  await page.getByRole('button', { name: /save address/i }).click();
  await waitPath('/addresses');
  expect((await state()).addresses.length === 5, '5 addresses');
  await byText('12 Lazimpat Marg').waitFor();
});
await check('Payment methods: set Mastercard default', async () => {
  await page.goto(BASE + '/payments');
  await page.locator('button[aria-label*="options" i], button[aria-label*="menu" i], .pay-card__menu, .addr-card__menu').nth(1).click();
  await byText('Set as default').click();
  await page.waitForTimeout(200);
  const pm = (await state()).paymentMethods.find(p => p.brand === 'Mastercard');
  expect(pm?.isDefault === true, 'mastercard default');
});
await check('Notifications: unread count, mark all read', async () => {
  await page.goto(BASE + '/notifications');
  expect((await state()).notifications.some(n => !n.read), 'has unread');
  await byText('Mark all as read').click();
  await page.waitForTimeout(200);
  expect((await state()).notifications.every(n => n.read), 'all read');
});
await check('Help: search "return" filters; Chat → Concierge', async () => {
  await page.goto(BASE + '/help');
  await page.getByPlaceholder(/search for help/i).fill('return');
  await byText('Returns & Refunds').waitFor();
  expect(await page.getByText('Payments & Wallet').count() === 0, 'non-matching topic hidden');
  await byText('Chat with us').click(); await waitPath('/concierge');
});
await check('Concierge: send a request, get a reply with products', async () => {
  await byText('Find a meaningful gift').click();
  await page.getByRole('button', { name: /send request/i }).click();
  await page.waitForTimeout(1200);
  await byText('Beeswax Candle').first().waitFor();
});
await check('State persists across reload', async () => {
  await page.goto(BASE + '/me');
  await page.reload();
  await waitPath('/me');
  const s = await state(); expect(s.isMember && s.orders.length === 6, 'persisted');
});
await check('Sign out clears session', async () => {
  await page.getByRole('button', { name: /sign out/i }).click();
  await waitPath('/');
  await page.waitForTimeout(300);
  const s = await state(); expect(!s.isAuthed && s.orders.length === 5, 'reset');
});

console.log(`\n${step - failed}/${step} steps passed${errors.length ? `\nBrowser errors:\n  ${errors.join('\n  ')}` : '\nNo browser errors.'}`);
await browser.close();
process.exit(failed ? 1 : 0);
