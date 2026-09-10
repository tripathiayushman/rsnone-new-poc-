// Screenshot every screen (or the ones passed as args: C03 C07 …) at 853px into _shots/.
// Seeds localStorage so guarded routes render (signed in, store chosen, bag + wishlist populated).
// Usage: node scripts/shots.mjs [C03 C07 …]   (dev server must be running on :5173)
import { chromium } from 'playwright-core';
import { mkdirSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const BASE = process.env.BASE ?? 'http://localhost:5173';
const COMPACT = !!process.env.COMPACT; // COMPACT=1 → phone viewport (412px), screenshots suffixed -m
const OUT = '_shots'; mkdirSync(OUT, { recursive: true });
const pw = join(homedir(), 'AppData/Local/ms-playwright');
const dirs = readdirSync(pw);
const dir = dirs.find(d => d.startsWith('chromium_headless_shell')) ?? dirs.find(d => d.startsWith('chromium-'));
const exe = join(pw, dir, dir.startsWith('chromium_headless_shell') ? 'chrome-headless-shell-win64/chrome-headless-shell.exe' : 'chrome-win64/chrome.exe');

export const SCREENS = [
  ['C01', '/'], ['C02', '/welcome'], ['C20', '/login'], ['C19', '/store'], ['C03', '/home'], ['C04', '/shop'],
  ['C05', '/search'], ['C06', '/search/results?q=copper'], ['C07', '/product/copper-vessel'], ['C08', '/house/lazimpat'],
  ['C09', '/wishlist'], ['C10', '/bag'], ['C11', '/checkout/details'], ['C12', '/checkout/payment'],
  ['C13', '/order/confirmation/RSN10234'], ['C14', '/membership'], ['C15', '/drops'], ['C16', '/concierge'], ['C17', '/me'],
  ['C18', '/orders/RSN10234/track'], ['C21', '/membership/join'], ['C22', '/membership/payment'], ['C23', '/membership/welcome'],
  ['C24', '/drops/autumn-drop'], ['C25', '/orders'], ['C26', '/orders/RSN10234'], ['C27', '/addresses'], ['C28', '/payments'],
  ['C29', '/notifications'], ['C30', '/help'], ['C31', '/addresses/new'], ['C32', '/orders/RSN10231/return'],
  ['C33', '/member/wallet'], ['C34', '/member/referrals'],
];
const only = process.argv.slice(2);
const list = only.length ? SCREENS.filter(([id]) => only.includes(id)) : SCREENS;

const seed = {
  state: {
    user: { name: 'Maya Kapoor', email: 'maya.kapoor@rsnone.com', memberNo: 'Founding Member 047', avatar: 'avatar-maya-kapoor-01' },
    isAuthed: true, isGuest: false, store: 'nepal', hasSeenWelcome: true,
    bag: [{ productId: 'copper-vessel', qty: 1 }, { productId: 'linen-sheets', qty: 1 }, { productId: 'beeswax-candle', qty: 1 }],
    wishlist: ['copper-vessel', 'linen-sheets', 'beeswax-candle', 'brass-kettle'],
    checkout: { addressId: null, address: { name: 'Maya Kapoor', line1: 'B-102, Maple Residency', city: 'Kathmandu', postal: '44600', country: 'Nepal', phone: '+977 98123 45678' }, delivery: 'standard', note: '', payment: 'upi', paymentLabel: 'UPI' },
    zoom: 1,
  }, version: 1,
};

const browser = await chromium.launch({ executablePath: exe });
// desktop must be ≥ 900px wide or DeviceFrame switches to the compact phone canvas
const ctx = await browser.newContext({ viewport: COMPACT ? { width: 412, height: 915 } : { width: 1000, height: 1844 }, deviceScaleFactor: COMPACT ? 2 : 1 });
await ctx.addInitScript((s) => {
  const cur = JSON.parse(localStorage.getItem('rsn-one-poc') || '{"state":{}}');
  localStorage.setItem('rsn-one-poc', JSON.stringify({ ...s, state: { ...cur.state, ...s.state } }));
}, seed);
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push(`[pageerror] ${e.message}`));
page.on('console', m => { if (m.type() === 'error') errors.push(`[console] ${m.text().slice(0, 200)}`); });
for (const [id, path] of list) {
  errors.length = 0;
  try {
    await page.goto(BASE + path, { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(600);
    // scroll through so lazy images load, then back to top
    await page.evaluate(async () => { const h = document.documentElement.scrollHeight; for (let y = 0; y < h; y += 800) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } window.scrollTo(0, 0); });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(300);
    await page.addStyleTag({ content: COMPACT ? '.devbar{display:none!important} .frame-backdrop{padding:0!important}' : '.devbar{display:none!important} .frame-backdrop{padding:0!important} .frame{zoom:1!important;box-shadow:none!important}' });
    if (COMPACT) await page.screenshot({ path: `${OUT}/${id}-m.png`, fullPage: true });
    else await page.locator('.frame').screenshot({ path: `${OUT}/${id}.png` }); // the 853px artboard only
    const h = await page.evaluate(() => document.querySelector('.screen')?.scrollHeight ?? 0);
    const url = page.url().replace(BASE, '');
    console.log(`${id} ${path.padEnd(32)} h=${String(h).padEnd(5)} ${url !== path ? 'REDIRECTED→' + url : ''}${errors.length ? '  ERRORS: ' + errors.join(' | ') : ''}`);
  } catch (e) {
    console.log(`${id} ${path.padEnd(32)} FAILED: ${e.message.split('\n')[0]}`);
  }
}
await browser.close();
